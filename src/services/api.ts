import { INITIAL_CHECKLIST, CHECKLIST_CATEGORIES } from '../data/checklist';
import { CHEAT_CODES, INITIAL_SERVER_STATUS, RADIO_STATIONS } from '../data/cheats';
import { INITIAL_MARKERS } from '../data/markers';
import { INITIAL_PATCHES } from '../data/patches';
import {
  CheatCode,
  ChecklistCategoryMeta,
  ChecklistItem,
  ConsolePlatform,
  MapMarker,
  NewPatchInput,
  PatchNote,
  PlatformServerStatus,
  RadioStation,
} from '../types';

const STORAGE_KEYS = {
  CONSOLE: 'leonida_selected_console_v1',
  PATCHES: 'leonida_patches_v1',
  FOUND_MARKERS: 'leonida_found_markers_v1',
  CUSTOM_MARKERS: 'leonida_custom_markers_v1',
  COMPLETED_CHECKLIST: 'leonida_completed_checklist_v1',
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
    // Ignore quota errors gracefully
  }
}

/**
 * Abstrakt service-gränssnitt för datahämtning och lagring.
 * Byt implementationen i denna fil till Supabase-klienten
 * (t.ex. `supabase.from('patches').select('*')`) när databasen kopplas på.
 */
export interface CompanionApi {
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
}

class LocalStorageCompanionService implements CompanionApi {
  getSelectedConsole(): ConsolePlatform {
    const saved = readJson<ConsolePlatform>(STORAGE_KEYS.CONSOLE, 'ps5');
    return saved === 'xbox' ? 'xbox' : 'ps5';
  }

  setSelectedConsole(platform: ConsolePlatform): void {
    writeJson(STORAGE_KEYS.CONSOLE, platform);
  }

  async getPatches(): Promise<PatchNote[]> {
    const customPatches = readJson<PatchNote[]>(STORAGE_KEYS.PATCHES, []);
    // Merge user-added patches ahead of initial mock patches, avoiding duplicate IDs
    const customIds = new Set(customPatches.map((p) => p.id));
    const merged = [...customPatches, ...INITIAL_PATCHES.filter((p) => !customIds.has(p.id))];
    return merged.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  }

  async createPatch(input: NewPatchInput): Promise<PatchNote> {
    const existingCustom = readJson<PatchNote[]>(STORAGE_KEYS.PATCHES, []);
    const newPatch: PatchNote = {
      ...input,
      id: `patch-custom-${Date.now()}`,
    };
    writeJson(STORAGE_KEYS.PATCHES, [newPatch, ...existingCustom]);
    return newPatch;
  }

  async getMarkers(): Promise<MapMarker[]> {
    const customMarkers = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);
    return [...INITIAL_MARKERS, ...customMarkers];
  }

  async getFoundMarkerIds(): Promise<string[]> {
    return readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
  }

  async toggleMarkerFound(markerId: string): Promise<string[]> {
    const current = readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
    const exists = current.includes(markerId);
    const updated = exists ? current.filter((id) => id !== markerId) : [...current, markerId];
    writeJson(STORAGE_KEYS.FOUND_MARKERS, updated);
    return updated;
  }

  async addCustomMarker(marker: Omit<MapMarker, 'id' | 'isCustom'>): Promise<MapMarker> {
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
    const existing = readJson<MapMarker[]>(STORAGE_KEYS.CUSTOM_MARKERS, []);
    const filtered = existing.filter((m) => m.id !== markerId);
    writeJson(STORAGE_KEYS.CUSTOM_MARKERS, filtered);

    // Clean up found state as well
    const found = readJson<string[]>(STORAGE_KEYS.FOUND_MARKERS, []);
    if (found.includes(markerId)) {
      writeJson(
        STORAGE_KEYS.FOUND_MARKERS,
        found.filter((id) => id !== markerId)
      );
    }
  }

  getChecklistCategories(): ChecklistCategoryMeta[] {
    return CHECKLIST_CATEGORIES;
  }

  async getChecklistItems(): Promise<ChecklistItem[]> {
    return INITIAL_CHECKLIST;
  }

  async getCompletedChecklistIds(): Promise<string[]> {
    return readJson<string[]>(STORAGE_KEYS.COMPLETED_CHECKLIST, ['chk-m1', 'chk-c4']);
  }

  async toggleChecklistItem(itemId: string): Promise<string[]> {
    const current = await this.getCompletedChecklistIds();
    const exists = current.includes(itemId);
    const updated = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
    writeJson(STORAGE_KEYS.COMPLETED_CHECKLIST, updated);
    return updated;
  }

  async resetChecklistProgress(): Promise<string[]> {
    writeJson(STORAGE_KEYS.COMPLETED_CHECKLIST, []);
    return [];
  }

  async getCheats(): Promise<CheatCode[]> {
    return CHEAT_CODES;
  }

  async getRadioStations(): Promise<RadioStation[]> {
    return RADIO_STATIONS;
  }

  async getServerStatus(): Promise<PlatformServerStatus[]> {
    return INITIAL_SERVER_STATUS;
  }
}

export const api: CompanionApi = new LocalStorageCompanionService();
