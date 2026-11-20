import { CHECKLIST_CATEGORIES, INITIAL_CHECKLIST } from '../data/checklist';
import { CHEAT_CODES, INITIAL_SERVER_STATUS, RADIO_STATIONS } from '../data/cheats';
import { INITIAL_MARKERS } from '../data/markers';
import { INITIAL_PATCHES } from '../data/patches';
import { getOrCreateDeviceId, isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  CheatCode,
  ChecklistCategoryMeta,
  ChecklistItem,
  ConsolePlatform,
  MapMarker,
  MarkerCategory,
  NewPatchInput,
  PatchNote,
  PlatformServerStatus,
  PushPlatformChoice,
  PushSubscriptionState,
  RadioStation,
} from '../types';

const STORAGE_KEYS = {
  CONSOLE: 'leonida_selected_console_v1',
  PATCHES: 'leonida_patches_v1',
  FOUND_MARKERS: 'leonida_found_markers_v1',
  CUSTOM_MARKERS: 'leonida_custom_markers_v1',
  COMPLETED_CHECKLIST: 'leonida_completed_checklist_v1',
  PUSH_SUBSCRIPTION: 'leonida_push_subscription_v1',
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignorera lagringskvotfel
  }
}

interface SupabasePatchRow {
  id: string;
  version: string;
  title: string;
  release_date: string;
  platforms: ConsolePlatform[];
  file_size_ps5: string | null;
  file_size_xbox: string | null;
  summary: string | null;
  official_notes: string[] | null;
  community_discoveries: string[] | null;
  is_hotfix: boolean | null;
}

interface SupabaseMarkerRow {
  id: string;
  title: string;
  category: MarkerCategory;
  region: string;
  description: string | null;
  x: number;
  y: number;
  image_url: string | null;
  reward: string | null;
  is_custom: boolean | null;
  device_id: string | null;
}

interface SupabaseUserProgressRow {
  device_id: string;
  completed_checklist_ids: string[] | null;
  found_marker_ids: string[] | null;
  updated_at?: string;
}

function mapPatchRow(row: SupabasePatchRow): PatchNote {
  return {
    id: row.id,
    version: row.version,
    title: row.title,
    releaseDate: row.release_date,
    platforms: Array.isArray(row.platforms) ? row.platforms : ['ps5', 'xbox'],
    fileSizePs5: row.file_size_ps5 ?? undefined,
    fileSizeXbox: row.file_size_xbox ?? undefined,
    summary: row.summary ?? '',
    officialNotes: Array.isArray(row.official_notes) ? row.official_notes : [],
    communityDiscoveries: Array.isArray(row.community_discoveries)
      ? row.community_discoveries
      : [],
    isHotfix: Boolean(row.is_hotfix),
  };
}

function mapMarkerRow(row: SupabaseMarkerRow): MapMarker {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    region: row.region,
    description: row.description ?? '',
    x: Number(row.x),
    y: Number(row.y),
    imageUrl: row.image_url ?? undefined,
    reward: row.reward ?? undefined,
    isCustom: Boolean(row.is_custom),
  };
}

export interface CompanionApi {
  getDeviceId(): string;
  isCloudSyncEnabled(): boolean;
  getSelectedConsole(): ConsolePlatform;
  setSelectedConsole(platform: ConsolePlatform): void;

  // Patch Notes
  getPatches(): Promise<PatchNote[]>;
  createPatch(input: NewPatchInput): Promise<PatchNote>;

  // Leonida Map Markers
  getMarkers(): Promise<MapMarker[]>;
  getFoundMarkerIds(): Promise<string[]>;
  toggleMarkerFound(markerId: string): Promise<string[]>;
  addCustomMarker(marker: Omit<MapMarker, 'id' | 'isCustom'>): Promise<MapMarker>;
  deleteCustomMarker(markerId: string): Promise<void>;

  // 100% Completion Checklist
  getChecklistCategories(): ChecklistCategoryMeta[];
  getChecklistItems(): Promise<ChecklistItem[]>;
  getCompletedChecklistIds(): Promise<string[]>;
  toggleChecklistItem(itemId: string): Promise<string[]>;
  resetChecklistProgress(): Promise<string[]>;

  // Guides, Radio & Cheats
  getCheats(): Promise<CheatCode[]>;
  getRadioStations(): Promise<RadioStation[]>;
  getServerStatus(): Promise<PlatformServerStatus[]>;

  // Push Notifications
  getPushSubscriptionState(): Promise<PushSubscriptionState>;
  savePushSubscription(
    platform: PushPlatformChoice,
    subscription: PushSubscriptionJSON | Record<string, unknown>
  ): Promise<PushSubscriptionState>;
  disablePushSubscription(): Promise<PushSubscriptionState>;
}

class SupabaseCompanionService implements CompanionApi {
  getDeviceId(): string {
    return getOrCreateDeviceId();
  }

  isCloudSyncEnabled(): boolean {
    return isSupabaseConfigured && supabase !== null;
  }

  getSelectedConsole(): ConsolePlatform {
    const saved = readJson<ConsolePlatform>(STORAGE_KEYS.CONSOLE, 'ps5');
    return saved === 'xbox' ? 'xbox' : 'ps5';
  }

  setSelectedConsole(platform: ConsolePlatform): void {
    writeJson(STORAGE_KEYS.CONSOLE, platform);
  }

  // ---------------- PATCH NOTES ----------------

  async getPatches(): Promise<PatchNote[]> {
    const localPatches = readJson<PatchNote[]>(STORAGE_KEYS.PATCHES, []);

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('patches')
          .select('*')
          .order('release_date', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = (data as SupabasePatchRow[]).map(mapPatchRow);
          writeJson(STORAGE_KEYS.PATCHES, mapped);
          return mapped;
        }
      } catch {
        // Fallback till lokal cache nedan
      }
    }

    const customIds = new Set(localPatches.map((p) => p.id));
    const merged = [...localPatches, ...INITIAL_PATCHES.filter((p) => !customIds.has(p.id))];
    return merged.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  }

  async createPatch(input: NewPatchInput): Promise<PatchNote> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('patches')
          .insert({
            version: input.version,
            title: input.title,
            release_date: input.releaseDate,
            platforms: input.platforms,
            file_size_ps5: input.fileSizePs5 ?? null,
            file_size_xbox: input.fileSizeXbox ?? null,
            summary: input.summary,
            official_notes: input.officialNotes,
            community_discoveries: input.communityDiscoveries,
            is_hotfix: Boolean(input.isHotfix),
          })
          .select('*')
          .single();

        if (!error && data) {
          const created = mapPatchRow(data as SupabasePatchRow);
          const cached = readJson<PatchNote[]>(STORAGE_KEYS.PATCHES, []);
          writeJson(STORAGE_KEYS.PATCHES, [created, ...cached]);
          return created;
        }
      } catch {
        // Fallback till localStorage vid offline/fel
      }
    }

    const existingCustom = readJson<PatchNote[]>(STORAGE_KEYS.PATCHES, []);
    const newPatch: PatchNote = {
      ...input,
      id: `patch-custom-${Date.now()}`,
    };
    writeJson(STORAGE_KEYS.PATCHES, [newPatch, ...existingCustom]);
    return newPatch;
  }

  // ---------------- KARTA & MARKÖRER ----------------

  async getMarkers(): Promise<MapMarker[]> {
    const deviceId = this.getDeviceId();
    const localCustom = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('markers')
          .select('*')
          .or(`is_custom.eq.false,device_id.eq.${deviceId}`);

        if (!error && data && data.length > 0) {
          const mapped = (data as SupabaseMarkerRow[]).map(mapMarkerRow);
          writeJson(
            STORAGE_KEYS.CUSTOM_MARKERS,
            mapped.filter((m) => m.isCustom)
          );
          return mapped;
        }
      } catch {
        // Fallback till mock + lokal cache
      }
    }

    return [...INITIAL_MARKERS, ...localCustom];
  }

  async addCustomMarker(marker: Omit<MapMarker, 'id' | 'isCustom'>): Promise<MapMarker> {
    const deviceId = this.getDeviceId();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('markers')
          .insert({
            title: marker.title,
            category: marker.category,
            region: marker.region,
            description: marker.description,
            x: marker.x,
            y: marker.y,
            image_url: marker.imageUrl ?? null,
            reward: marker.reward ?? null,
            is_custom: true,
            device_id: deviceId,
          })
          .select('*')
          .single();

        if (!error && data) {
          const created = mapMarkerRow(data as SupabaseMarkerRow);
          const existing = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);
          writeJson(STORAGE_KEYS.CUSTOM_MARKERS, [...existing, created]);
          return created;
        }
      } catch {
        // Fallback till localStorage
      }
    }

    const existing = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);
    const created: MapMarker = {
      ...marker,
      id: `custom-mk-${Date.now()}`,
      isCustom: true,
    };
    writeJson(STORAGE_KEYS.CUSTOM_MARKERS, [...existing, created]);
    return created;
  }

  async deleteCustomMarker(markerId: string): Promise<void> {
    const deviceId = this.getDeviceId();

    if (supabase) {
      try {
        await supabase
          .from('markers')
          .delete()
          .eq('id', markerId)
          .eq('device_id', deviceId);
      } catch {
        // Fortsätt rensa lokal cache
      }
    }

    const existing = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);
    writeJson(
      STORAGE_KEYS.CUSTOM_MARKERS,
      existing.filter((m) => m.id !== markerId)
    );

    const found = readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
    if (found.includes(markerId)) {
      const updatedFound = found.filter((id) => id !== markerId);
      writeJson(STORAGE_KEYS.FOUND_MARKERS, updatedFound);
      await this.syncUserProgressToCloud(undefined, updatedFound);
    }
  }

  // ---------------- USER PROGRESS (CHECKLISTA + HITTADE MARKÖRER) ----------------

  private async fetchUserProgressRow(): Promise<SupabaseUserProgressRow | null> {
    if (!supabase) return null;
    const deviceId = this.getDeviceId();
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (!error && data) {
        return data as SupabaseUserProgressRow;
      }
    } catch {
      return null;
    }
    return null;
  }

  private async syncUserProgressToCloud(
    completedChecklistIds?: string[],
    foundMarkerIds?: string[]
  ): Promise<void> {
    if (!supabase) return;
    const deviceId = this.getDeviceId();
    const checklist =
      completedChecklistIds ?? readJson<string[]>(STORAGE_KEYS.COMPLETED_CHECKLIST, ['chk-m1', 'chk-c4']);
    const found = foundMarkerIds ?? readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);

    try {
      await supabase.from('user_progress').upsert(
        {
          device_id: deviceId,
          completed_checklist_ids: checklist,
          found_marker_ids: found,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'device_id' }
      );
    } catch {
      // Offline-cache i localStorage behåller state tills nästa synk
    }
  }

  async getFoundMarkerIds(): Promise<string[]> {
    const cloudRow = await this.fetchUserProgressRow();
    if (cloudRow && Array.isArray(cloudRow.found_marker_ids)) {
      writeJson(STORAGE_KEYS.FOUND_MARKERS, cloudRow.found_marker_ids);
      return cloudRow.found_marker_ids;
    }
    return readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
  }

  async toggleMarkerFound(markerId: string): Promise<string[]> {
    const current = readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
    const exists = current.includes(markerId);
    const updated = exists ? current.filter((id) => id !== markerId) : [...current, markerId];
    writeJson(STORAGE_KEYS.FOUND_MARKERS, updated);
    await this.syncUserProgressToCloud(undefined, updated);
    return updated;
  }

  getChecklistCategories(): ChecklistCategoryMeta[] {
    return CHECKLIST_CATEGORIES;
  }

  async getChecklistItems(): Promise<ChecklistItem[]> {
    return INITIAL_CHECKLIST;
  }

  async getCompletedChecklistIds(): Promise<string[]> {
    const cloudRow = await this.fetchUserProgressRow();
    if (cloudRow && Array.isArray(cloudRow.completed_checklist_ids)) {
      writeJson(STORAGE_KEYS.COMPLETED_CHECKLIST, cloudRow.completed_checklist_ids);
      return cloudRow.completed_checklist_ids;
    }
    return readJson<string[]>(STORAGE_KEYS.COMPLETED_CHECKLIST, ['chk-m1', 'chk-c4']);
  }

  async toggleChecklistItem(itemId: string): Promise<string[]> {
    const current = readJson<string[]>(STORAGE_KEYS.COMPLETED_CHECKLIST, ['chk-m1', 'chk-c4']);
    const exists = current.includes(itemId);
    const updated = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
    writeJson(STORAGE_KEYS.COMPLETED_CHECKLIST, updated);
    await this.syncUserProgressToCloud(updated, undefined);
    return updated;
  }

  async resetChecklistProgress(): Promise<string[]> {
    writeJson(STORAGE_KEYS.COMPLETED_CHECKLIST, []);
    await this.syncUserProgressToCloud([], undefined);
    return [];
  }

  // ---------------- GUIDER, RADIO & FUSK ----------------

  async getCheats(): Promise<CheatCode[]> {
    return CHEAT_CODES;
  }

  async getRadioStations(): Promise<RadioStation[]> {
    return RADIO_STATIONS;
  }

  async getServerStatus(): Promise<PlatformServerStatus[]> {
    return INITIAL_SERVER_STATUS;
  }

  // ---------------- PUSH-PRENUMERATIONER ----------------

  async getPushSubscriptionState(): Promise<PushSubscriptionState> {
    const localState = readJson<PushSubscriptionState>(STORAGE_KEYS.PUSH_SUBSCRIPTION, {
      enabled: false,
      platform: 'both',
    });

    if (supabase) {
      const deviceId = this.getDeviceId();
      try {
        const { data, error } = await supabase
          .from('push_subscriptions')
          .select('platform, endpoint, enabled, updated_at')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (!error && data) {
          const synced: PushSubscriptionState = {
            enabled: Boolean(data.enabled),
            platform: (data.platform as PushPlatformChoice) ?? 'both',
            endpoint: data.endpoint ?? undefined,
            updatedAt: data.updated_at ?? undefined,
          };
          writeJson(STORAGE_KEYS.PUSH_SUBSCRIPTION, synced);
          return synced;
        }
      } catch {
        // Använd lokal cache
      }
    }

    return localState;
  }

  async savePushSubscription(
    platform: PushPlatformChoice,
    subscription: PushSubscriptionJSON | Record<string, unknown>
  ): Promise<PushSubscriptionState> {
    const deviceId = this.getDeviceId();
    const endpoint =
      typeof subscription.endpoint === 'string'
        ? subscription.endpoint
        : `local-browser://${deviceId}`;
    const updatedAt = new Date().toISOString();

    const nextState: PushSubscriptionState = {
      enabled: true,
      platform,
      endpoint,
      updatedAt,
    };

    writeJson(STORAGE_KEYS.PUSH_SUBSCRIPTION, nextState);

    if (supabase) {
      const { error } = await supabase.from('push_subscriptions').upsert(
        {
          device_id: deviceId,
          platform,
          endpoint,
          subscription_json: subscription,
          enabled: true,
          updated_at: updatedAt,
        },
        { onConflict: 'device_id' }
      );
      if (error) {
        console.warn('Kunde inte spara push-prenumeration i Supabase:', error.message);
      }
    }

    return nextState;
  }

  async disablePushSubscription(): Promise<PushSubscriptionState> {
    const deviceId = this.getDeviceId();
    const current = readJson<PushSubscriptionState>(STORAGE_KEYS.PUSH_SUBSCRIPTION, {
      enabled: false,
      platform: 'both',
    });
    const nextState: PushSubscriptionState = {
      ...current,
      enabled: false,
      updatedAt: new Date().toISOString(),
    };
    writeJson(STORAGE_KEYS.PUSH_SUBSCRIPTION, nextState);

    if (supabase) {
      try {
        await supabase
          .from('push_subscriptions')
          .update({ enabled: false, updated_at: nextState.updatedAt })
          .eq('device_id', deviceId);
      } catch {
        // Ignorera nätverksfel
      }
    }

    return nextState;
  }
}

export const api: CompanionApi = new SupabaseCompanionService();
