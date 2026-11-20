export type ConsolePlatform = 'ps5' | 'xbox';

export type MainTab = 'patches' | 'map' | 'checklist' | 'guides' | 'settings';

export type PatchPlatformFilter = 'all' | 'ps5' | 'xbox';

export interface PatchNote {
  id: string;
  version: string;
  title: string;
  releaseDate: string; // ISO YYYY-MM-DD
  platforms: ConsolePlatform[];
  fileSizePs5?: string;
  fileSizeXbox?: string;
  summary: string;
  officialNotes: string[];
  communityDiscoveries: string[];
  isHotfix?: boolean;
}

export type NewPatchInput = Omit<PatchNote, 'id'>;

export type MarkerCategory =
  | 'Vapen'
  | 'Gömda paket'
  | 'Speciella fordon'
  | 'Affärer'
  | 'Hemligheter'
  | 'Hopp/Stunts'
  | 'Egna markörer';

export interface MapMarker {
  id: string;
  title: string;
  category: MarkerCategory;
  region: string;
  description: string;
  /** X coordinate as percentage (0-100) on the Leonida map image */
  x: number;
  /** Y coordinate as percentage (0-100) on the Leonida map image */
  y: number;
  imageUrl?: string;
  reward?: string;
  isCustom?: boolean;
}

export type ChecklistCategoryId =
  | 'main_missions'
  | 'strangers_freaks'
  | 'collectibles'
  | 'vehicle_challenges'
  | 'random_events';

export interface ChecklistItem {
  id: string;
  categoryId: ChecklistCategoryId;
  title: string;
  region: string;
  requirement: string;
  reward?: string;
}

export interface ChecklistCategoryMeta {
  id: ChecklistCategoryId;
  label: string;
  description: string;
  weightLabel: string;
}

export type CheatButtonToken =
  | 'TRIANGLE_Y'
  | 'CIRCLE_B'
  | 'CROSS_A'
  | 'SQUARE_X'
  | 'L1_LB'
  | 'R1_RB'
  | 'L2_LT'
  | 'R2_RT'
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT';

export type CheatCategory = 'Spelare' | 'Vapen & Strid' | 'Fordon' | 'Värld';

export interface CheatCode {
  id: string;
  name: string;
  category: CheatCategory;
  effect: string;
  buttons: CheatButtonToken[];
  phoneNumber?: string;
  disablesTrophies: boolean;
}

export interface RadioTrack {
  title: string;
  artist: string;
  year: number;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  host: string;
  description: string;
  accentHex: string;
  tracks: RadioTrack[];
}

export type ServiceHealth = 'online' | 'degraded' | 'maintenance';

export interface PlatformServerStatus {
  platform: ConsolePlatform;
  platformName: string;
  overall: ServiceHealth;
  summary: string;
  services: {
    name: string;
    status: ServiceHealth;
    note: string;
  }[];
  updatedAt: string;
}

export interface NewswireArticle {
  id: string;
  title: string;
  publishedAt: string;
  summary: string;
  link: string;
  category: string;
  isFallback?: boolean;
}

export type PushPlatformChoice = 'ps5' | 'xbox' | 'both';

export interface PushSubscriptionState {
  enabled: boolean;
  platform: PushPlatformChoice;
  endpoint?: string;
  updatedAt?: string;
}

