import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  CheatCategory,
  CheatCode,
  ChecklistCategoryMeta,
  ChecklistItem,
  MapMarker,
  MarkerCategory,
  NewswireArticle,
  PatchNote,
  PlatformServerStatus,
  RadioStation,
} from '../types';
import {
  CHEAT_TRANSLATIONS,
  CHECKLIST_CATEGORY_TRANSLATIONS,
  CHECKLIST_ITEM_TRANSLATIONS,
  Language,
  MARKER_TRANSLATIONS,
  PATCH_TRANSLATIONS,
  RADIO_TRANSLATIONS,
  RSS_FALLBACK_TRANSLATIONS,
  SERVER_STATUS_TRANSLATIONS,
} from './dataTranslations';

export type { Language };

export interface LanguageOption {
  code: Language;
  shortLabel: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', shortLabel: 'EN', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sv', shortLabel: 'SV', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'es', shortLabel: 'ES', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', shortLabel: 'DE', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', shortLabel: 'FR', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', shortLabel: 'PT', nativeName: 'Português', flag: '🇵🇹' },
];

const SUPPORTED_LANGUAGES = new Set<Language>(['en', 'sv', 'es', 'de', 'fr', 'pt']);
const LANGUAGE_STORAGE_KEY = 'leonida_language_v1';

export interface TranslationDictionary {
  common: {
    appName: string;
    loading: string;
    cancel: string;
    save: string;
    saving: string;
    close: string;
    ps5: string;
    xbox: string;
    xboxShort: string;
    both: string;
    all: string;
    selectConsoleAria: string;
    selectLanguageAria: string;
    serverStatusShort: string;
    statusOnline: string;
    statusDegraded: string;
    statusMaintenance: string;
    rewardLabel: string;
  };
  nav: {
    ariaLabel: string;
    patches: string;
    map: string;
    checklist: string;
    guides: string;
    settings: string;
  };
  patches: {
    activeConsoleLabel: string;
    title: string;
    subtitle: string;
    watchPushBtn: string;
    pushActiveBtn: string;
    addPatchBtn: string;
    newswireTitle: string;
    newswireSubtitle: string;
    sourceFallback: string;
    sourceProxy: string;
    sourceEdge: string;
    refreshRss: string;
    fetchingRss: string;
    loadingRssText: string;
    readOnNewswire: string;
    filterAll: string;
    searchPlaceholder: string;
    searchAria: string;
    emptyTitle: string;
    emptySubtitle: string;
    hotfixLabel: string;
    officialNotesHeading: string;
    communityHeading: string;
    communityEmpty: string;
    modalTitle: string;
    modalSubtitle: string;
    modalErrorMissing: string;
    fieldVersion: string;
    fieldVersionPlaceholder: string;
    fieldDate: string;
    fieldTitle: string;
    fieldTitlePlaceholder: string;
    fieldSizePlaceholder: string;
    fieldSummary: string;
    fieldSummaryPlaceholder: string;
    fieldOfficialNotes: string;
    fieldOfficialNotesPlaceholder: string;
    fieldCommunityNotes: string;
    fieldCommunityNotesPlaceholder: string;
    submitPatch: string;
    defaultSummary: string;
    defaultOfficialNote: string;
    pushModalTitle: string;
    pushModalSubtitle: string;
    pushSelectPlatform: string;
    pushDeviceId: string;
    pushCloudSync: string;
    pushConnected: string;
    pushOffline: string;
    pushActivateBtn: string;
    pushUpdateBtn: string;
    pushActivating: string;
    pushTestBtn: string;
    pushDisableBtn: string;
    pushPausedMsg: string;
    pushTestSuccessMsg: string;
    pushErrorDefault: string;
    pushTestErrorDefault: string;
    pushUnsupported: string;
    pushPermissionDenied: string;
    pushPermissionRequired: string;
    pushWebPushActive: string;
    pushBrowserSaved: string;
    pushBrowserMissingVapid: string;
    pushTestNotifTitle: string;
    pushTestNotifBody: string;
  };
  map: {
    foundCounter: string; // "{found} / {total} ..."
    title: string;
    hideFound: string;
    showingUnfound: string;
    dayMode: string;
    nightMode: string;
    toggleDayNightAria: string;
    addMarkerBtn: string;
    tapMapHint: string;
    districtsLabel: string;
    allLeonida: string;
    minimapTitle: string;
    controlsHint: string;
    zoomOutAria: string;
    zoomInAria: string;
    resetView: string;
    closeDetailAria: string;
    foundSuffix: string;
    markFound: string;
    markedFoundUndo: string;
    deleteCustomAria: string;
    newMarkerTitle: string;
    coordinatesLabel: string;
    fieldName: string;
    fieldNamePlaceholder: string;
    fieldCategory: string;
    fieldNotes: string;
    fieldNotesPlaceholder: string;
    saveMarkerBtn: string;
    customRegion: string;
    customDefaultDesc: string;
  };
  markerCategories: Record<MarkerCategory, string>;
  checklist: {
    kicker: string;
    title: string;
    completedOfTotal: string; // "{completed} / {total} ..."
    progressAria: string;
    filterAll: string;
    filterRemaining: string;
    filterCompleted: string;
    resetBtn: string;
    confirmResetBtn: string;
    emptyCategory: string;
  };
  guides: {
    iconsAdaptedFor: string;
    title: string;
    serverHeading: string;
    tabCheats: string;
    tabRadio: string;
    cheatSearchPlaceholder: string;
    cheatSearchAria: string;
    noCheatsFound: string;
    trophyWarning: string;
    hostLabel: string;
    tracklistLabel: string;
    tracksUnit: string;
    dpad: { up: string; down: string; left: string; right: string };
    psButtons: { triangle: string; circle: string; cross: string; square: string };
  };
  cheatCategories: Record<'Alla' | CheatCategory, string>;
  settings: {
    kicker: string;
    title: string;
    subtitle: string;
    preferencesHeading: string;
    defaultPlatformLabel: string;
    defaultPlatformHint: string;
    languageLabel: string;
    languageHint: string;
    hideFoundLabel: string;
    hideFoundHint: string;
    pushHeading: string;
    pushHint: string;
    pushStatusActive: string;
    pushStatusInactive: string;
    updatesHeading: string;
    updatesHint: string;
    currentVersionLabel: string;
    repoLabel: string;
    repoNotConfiguredHint: string;
    lastCheckedLabel: string;
    checkUpdatesBtn: string;
    checkingUpdatesBtn: string;
    upToDateMsg: string;
    repoNotFoundError: string;
    rateLimitError: string;
    checkFailedError: string;
    cacheHeading: string;
    cacheHint: string;
    deviceIdLabel: string;
    cloudSyncLabel: string;
    resetCacheBtn: string;
    confirmResetCacheBtn: string;
    cacheClearedMsg: string;
  };
  updateModal: {
    kicker: string;
    title: string;
    currentVersion: string;
    latestVersion: string;
    releaseDate: string;
    notesHeading: string;
    noNotesFallback: string;
    downloadApkBtn: string;
    openReleaseBtn: string;
    laterBtn: string;
  };
}

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Loading Leonida Companion...',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      close: 'Close',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Both',
      all: 'All',
      selectConsoleAria: 'Select console platform',
      selectLanguageAria: 'Select language',
      serverStatusShort: 'Servers',
      statusOnline: 'Online',
      statusDegraded: 'Limited',
      statusMaintenance: 'Maintenance',
      rewardLabel: 'Reward',
    },
    nav: {
      ariaLabel: 'Main navigation',
      patches: 'Updates',
      map: 'Map',
      checklist: 'Checklist',
      guides: 'Guides & Cheats',
      settings: 'Settings',
    },
    patches: {
      activeConsoleLabel: 'Active console',
      title: 'Updates & Patch Notes',
      subtitle:
        'Track official Rockstar Games updates and stealth performance discoveries spotted by the community for PS5 and Xbox Series X|S.',
      watchPushBtn: 'Watch updates (Push)',
      pushActiveBtn: 'Push active',
      addPatchBtn: 'Add patch',
      newswireTitle: 'Rockstar Newswire & News',
      newswireSubtitle: 'Filtered RSS feed for Grand Theft Auto VI and Title Updates',
      sourceFallback: 'Preview fallback (RSS blocked in sandbox)',
      sourceProxy: 'Live via RSS proxy',
      sourceEdge: 'Live via Supabase Edge Function',
      refreshRss: 'Refresh RSS',
      fetchingRss: 'Fetching...',
      loadingRssText: 'Fetching latest articles from Rockstar...',
      readOnNewswire: 'Read on Rockstar Newswire',
      filterAll: 'All',
      searchPlaceholder: 'Search version or change...',
      searchAria: 'Search updates',
      emptyTitle: 'No updates matched your filter.',
      emptySubtitle: 'Try clearing the search box or switching back to All platforms.',
      hotfixLabel: 'Hotfix',
      officialNotesHeading: 'Official Patch Notes (Rockstar Games)',
      communityHeading: 'Community & Stealth Discoveries',
      communityEmpty: 'No hidden changes reported yet for this version.',
      modalTitle: 'Add New Patch Note',
      modalSubtitle: 'Saved locally and synced to the Supabase patches table when connected.',
      modalErrorMissing: 'Please enter a version number, title, and at least one console.',
      fieldVersion: 'Version number *',
      fieldVersionPlaceholder: 'e.g. 01.004.002',
      fieldDate: 'Release date',
      fieldTitle: 'Title *',
      fieldTitlePlaceholder: 'e.g. Vice Port Network & Performance Patch',
      fieldSizePlaceholder: 'File size (e.g. 2.10 GB)',
      fieldSummary: 'Summary',
      fieldSummaryPlaceholder: 'Brief overview of what this patch focuses on...',
      fieldOfficialNotes: 'Official patch notes (one bullet per line)',
      fieldOfficialNotesPlaceholder:
        'Improved frame rate in Downtown Vice City\nFixed radio crash...',
      fieldCommunityNotes: 'Community & Stealth discoveries (one bullet per line)',
      fieldCommunityNotesPlaceholder:
        'Silent boost to water spray effects behind speedboats...',
      submitPatch: 'Publish patch note',
      defaultSummary: 'New update added via the admin tool.',
      defaultOfficialNote: 'General stability and performance improvements.',
      pushModalTitle: 'Watch Updates (Push)',
      pushModalSubtitle: 'Get an instant alert whenever a new GTA VI patch is added.',
      pushSelectPlatform: 'Select platform to watch:',
      pushDeviceId: 'Device ID (anonymous sync):',
      pushCloudSync: 'Cloud sync (Supabase):',
      pushConnected: 'Connected',
      pushOffline: 'Offline mode (localStorage)',
      pushActivateBtn: 'Enable push notifications',
      pushUpdateBtn: 'Update platform choice',
      pushActivating: 'Enabling...',
      pushTestBtn: 'Test notification',
      pushDisableBtn: 'Turn off',
      pushPausedMsg: 'Push notifications paused for this device.',
      pushTestSuccessMsg: 'Test notification sent to your device.',
      pushErrorDefault: 'Could not enable push notifications.',
      pushTestErrorDefault: 'Could not send test notification.',
      pushUnsupported: 'Your browser does not support Web Push notifications.',
      pushPermissionDenied:
        'Notification permission was denied. Allow notifications in browser site settings to watch updates.',
      pushPermissionRequired: 'Enable notification permission first.',
      pushWebPushActive: 'Web Push enabled and synced to Supabase.',
      pushBrowserSaved: 'Subscription saved with browser notifications.',
      pushBrowserMissingVapid:
        'Notifications enabled and saved! Add VITE_WEB_PUSH_PUBLIC_KEY for background push when closed.',
      pushTestNotifTitle: 'GTA VI · New patch for',
      pushTestNotifBody: 'Test alert: Version 01.004.001 is now available in Leonida Companion.',
    },
    map: {
      foundCounter: 'locations found',
      title: 'Interactive Map: Leonida & Vice City',
      hideFound: 'Hide found',
      showingUnfound: 'Unfound only',
      dayMode: 'Day mode',
      nightMode: 'Night mode',
      toggleDayNightAria: 'Toggle map day and night mode',
      addMarkerBtn: 'Add marker',
      tapMapHint: 'Tap on the map...',
      districtsLabel: 'Districts:',
      allLeonida: 'All of Leonida',
      minimapTitle: 'Click or drag on the minimap to pan the view',
      controlsHint:
        'Drag to pan · Scroll or pinch for street-level zoom · Double-click for custom marker',
      zoomOutAria: 'Zoom out',
      zoomInAria: 'Zoom in',
      resetView: 'Reset view',
      closeDetailAria: 'Close marker details',
      foundSuffix: 'Found',
      markFound: 'Mark as found',
      markedFoundUndo: 'Marked as found (undo)',
      deleteCustomAria: 'Delete custom marker',
      newMarkerTitle: 'New Custom Marker',
      coordinatesLabel: 'Coordinates',
      fieldName: 'Location name *',
      fieldNamePlaceholder: 'e.g. Secret garage behind the club',
      fieldCategory: 'Category',
      fieldNotes: 'Notes',
      fieldNotesPlaceholder: 'Optional description or reminder...',
      saveMarkerBtn: 'Save marker',
      customRegion: 'Custom Pin',
      customDefaultDesc: 'Personal marker added on the Leonida map.',
    },
    markerCategories: {
      Vapen: 'Weapons',
      'Gömda paket': 'Hidden Packages',
      'Speciella fordon': 'Special Vehicles',
      Affärer: 'Shops',
      Hemligheter: 'Secrets',
      'Hopp/Stunts': 'Stunt Jumps',
      'Egna markörer': 'Custom Markers',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Career Tracker',
      title: '100% Completion Checklist',
      completedOfTotal: 'completed',
      progressAria: 'Total 100 percent completion',
      filterAll: 'All',
      filterRemaining: 'Remaining',
      filterCompleted: 'Completed',
      resetBtn: 'Reset progress',
      confirmResetBtn: 'Confirm reset',
      emptyCategory: 'No items match the current filter in this category.',
    },
    guides: {
      iconsAdaptedFor: 'Button icons adapted for',
      title: 'Guides, Radio & Cheat Codes',
      serverHeading: 'Rockstar Games Services · Server Status',
      tabCheats: 'Cheat Codes',
      tabRadio: 'Radio Stations',
      cheatSearchPlaceholder: 'Search cheat or effect...',
      cheatSearchAria: 'Search cheat codes',
      noCheatsFound: 'No cheat codes matched your search.',
      trophyWarning: 'Note: Disables trophies/achievements during your current play session.',
      hostLabel: 'Host',
      tracklistLabel: 'Tracklist',
      tracksUnit: 'tracks',
      dpad: { up: 'Up', down: 'Down', left: 'Left', right: 'Right' },
      psButtons: { triangle: 'Triangle', circle: 'Circle', cross: 'Cross', square: 'Square' },
    },
    cheatCategories: {
      Alla: 'All',
      Spelare: 'Player',
      'Vapen & Strid': 'Weapons & Combat',
      Fordon: 'Vehicles',
      Värld: 'World',
    },
    settings: {
      kicker: 'App Configuration & Release Sync',
      title: 'Settings',
      subtitle:
        'Customize your default platform, language, map filters, push notifications, local cache, and check for APK updates.',
      preferencesHeading: 'General & Map Preferences',
      defaultPlatformLabel: 'Default platform',
      defaultPlatformHint: 'Pre-selected platform filter for updates and console layout.',
      languageLabel: 'Interface language',
      languageHint: 'Applies immediately across menus, guides, map markers, and checklists.',
      hideFoundLabel: 'Hide found markers on map',
      hideFoundHint: 'Only show uncollected items and secrets on the Leonida map.',
      pushHeading: 'Push Notifications',
      pushHint: 'Receive alerts whenever a new GTA VI update is published for PS5 or Xbox.',
      pushStatusActive: 'Active',
      pushStatusInactive: 'Off',
      updatesHeading: 'App Updates (GitHub Releases)',
      updatesHint: 'Checks the latest signed Android APK release directly via GitHub API.',
      currentVersionLabel: 'Installed version',
      repoLabel: 'GitHub repository',
      repoNotConfiguredHint:
        'Set VITE_GITHUB_REPO in .env or edit DEFAULT_GITHUB_REPO in updateService.ts.',
      lastCheckedLabel: 'Last checked',
      checkUpdatesBtn: 'Check for updates',
      checkingUpdatesBtn: 'Checking GitHub...',
      upToDateMsg: 'You are already running the latest version.',
      repoNotFoundError:
        'No release found (404). Make sure your GitHub repository is public and has a published v* release.',
      rateLimitError: 'GitHub API rate limit reached. Try again in a few minutes.',
      checkFailedError: 'Could not reach GitHub Releases API.',
      cacheHeading: 'Local Cache & Cloud Sync',
      cacheHint: 'Clears locally cached patches, progress, and filters without deleting your device ID.',
      deviceIdLabel: 'Device ID',
      cloudSyncLabel: 'Supabase Cloud',
      resetCacheBtn: 'Reset local cache',
      confirmResetCacheBtn: 'Confirm clear cache',
      cacheClearedMsg: 'Local cache cleared and defaults restored.',
    },
    updateModal: {
      kicker: 'New Release Available',
      title: 'Update Found for Leonida Companion',
      currentVersion: 'Current version',
      latestVersion: 'Latest release',
      releaseDate: 'Published',
      notesHeading: 'Release Notes',
      noNotesFallback: 'Signed Android APK release built automatically via GitHub Actions.',
      downloadApkBtn: 'Download Signed APK',
      openReleaseBtn: 'View Release on GitHub',
      laterBtn: 'Later',
    },
  },
  sv: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Laddar Leonida Companion...',
      cancel: 'Avbryt',
      save: 'Spara',
      saving: 'Sparar...',
      close: 'Stäng',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Båda',
      all: 'Alla',
      selectConsoleAria: 'Välj konsolplattform',
      selectLanguageAria: 'Välj språk',
      serverStatusShort: 'Servrar',
      statusOnline: 'Online',
      statusDegraded: 'Begränsad',
      statusMaintenance: 'Underhåll',
      rewardLabel: 'Belöning',
    },
    nav: {
      ariaLabel: 'Huvudnavigering',
      patches: 'Uppdateringar',
      map: 'Karta',
      checklist: 'Checklista',
      guides: 'Guider & Fusk',
      settings: 'Inställningar',
    },
    patches: {
      activeConsoleLabel: 'Aktiv konsol',
      title: 'Uppdateringar & Patch Notes',
      subtitle:
        'Spåra officiella uppdateringar från Rockstar Games och dolda prestandaförändringar som communityt upptäckt för PS5 och Xbox Series X|S.',
      watchPushBtn: 'Bevaka uppdateringar (Push)',
      pushActiveBtn: 'Push aktivt',
      addPatchBtn: 'Lägg till patch',
      newswireTitle: 'Rockstar Newswire & Nyheter',
      newswireSubtitle: 'Filtrerat RSS-flöde för Grand Theft Auto VI och Title Updates',
      sourceFallback: 'Förhandsvisningsdata (RSS blockerad i sandbox)',
      sourceProxy: 'Live via RSS-proxy',
      sourceEdge: 'Live via Supabase Edge Function',
      refreshRss: 'Uppdatera RSS',
      fetchingRss: 'Hämtar...',
      loadingRssText: 'Hämtar senaste artiklarna från Rockstar...',
      readOnNewswire: 'Läs på Rockstar Newswire',
      filterAll: 'Alla',
      searchPlaceholder: 'Sök version eller ändring...',
      searchAria: 'Sök bland uppdateringar',
      emptyTitle: 'Inga uppdateringar matchade ditt filter.',
      emptySubtitle: 'Prova att rensa sökfältet eller växla till Alla plattformar.',
      hotfixLabel: 'Hotfix',
      officialNotesHeading: 'Officiella patch notes (Rockstar Games)',
      communityHeading: 'Community & Stealth-upptäckter',
      communityEmpty: 'Inga dolda ändringar rapporterade ännu för denna version.',
      modalTitle: 'Lägg till ny patch note',
      modalSubtitle: 'Sparas lokalt och synkas med Supabase-tabellen patches när den är ansluten.',
      modalErrorMissing: 'Ange versionsnummer, rubrik och minst en konsolplattform.',
      fieldVersion: 'Versionsnummer *',
      fieldVersionPlaceholder: 't.ex. 01.004.002',
      fieldDate: 'Släppdatum',
      fieldTitle: 'Rubrik *',
      fieldTitlePlaceholder: 't.ex. Vice Port Nätverks- & Prestandapatch',
      fieldSizePlaceholder: 'Filstorlek (t.ex. 2.10 GB)',
      fieldSummary: 'Sammanfattning',
      fieldSummaryPlaceholder: 'Kort överblick av vad patchen fokuserar på...',
      fieldOfficialNotes: 'Officiella patch notes (en punkt per rad)',
      fieldOfficialNotesPlaceholder:
        'Förbättrad bildfrekvens i Downtown Vice City\nÅtgärdat krasch vid byte av radio...',
      fieldCommunityNotes: 'Community & Stealth-upptäckter (en punkt per rad)',
      fieldCommunityNotesPlaceholder:
        'Tyst ökning av vattenspray-effekter bakom racerbåtar...',
      submitPatch: 'Publicera patch note',
      defaultSummary: 'Ny uppdatering inlagd via adminverktyget.',
      defaultOfficialNote: 'Allmänna stabilitets- och prestandaförbättringar.',
      pushModalTitle: 'Bevaka uppdateringar (Push)',
      pushModalSubtitle: 'Få en notis direkt när en ny GTA VI-patch läggs in i Supabase.',
      pushSelectPlatform: 'Välj plattform att bevaka:',
      pushDeviceId: 'Enhets-ID (anonym synk):',
      pushCloudSync: 'Molnsynk (Supabase):',
      pushConnected: 'Ansluten',
      pushOffline: 'Offline-läge (localStorage)',
      pushActivateBtn: 'Aktivera pushnotiser',
      pushUpdateBtn: 'Uppdatera plattformsval',
      pushActivating: 'Aktiverar...',
      pushTestBtn: 'Testa notis',
      pushDisableBtn: 'Stäng av',
      pushPausedMsg: 'Pushbevakning pausad för denna enhet.',
      pushTestSuccessMsg: 'Testnotis skickad till din enhet.',
      pushErrorDefault: 'Kunde inte aktivera pushnotiser.',
      pushTestErrorDefault: 'Kunde inte skicka testnotis.',
      pushUnsupported: 'Din webbläsare stöder tyvärr inte Push-notiser.',
      pushPermissionDenied:
        'Notisbehörighet nekades. Tillåt notiser i webbläsarens sidinställningar för att bevaka uppdateringar.',
      pushPermissionRequired: 'Aktivera notisbehörighet först.',
      pushWebPushActive: 'Web Push aktiverat och synkat till Supabase.',
      pushBrowserSaved: 'Prenumeration sparad med webbläsarnotiser.',
      pushBrowserMissingVapid:
        'Notiser aktiverade och sparade! Lägg till VITE_WEB_PUSH_PUBLIC_KEY för bakgrunds-push när appen är stängd.',
      pushTestNotifTitle: 'GTA VI · Ny patch för',
      pushTestNotifBody: 'Testnotis: Version 01.004.001 finns nu i Leonida Companion.',
    },
    map: {
      foundCounter: 'platser hittade',
      title: 'Interaktiv Karta: Leonida & Vice City',
      hideFound: 'Dölj hittade',
      showingUnfound: 'Visar endast ohittade',
      dayMode: 'Dagläge',
      nightMode: 'Nattläge',
      toggleDayNightAria: 'Växla mellan dag- och nattläge på kartan',
      addMarkerBtn: 'Lägg till markör',
      tapMapHint: 'Tryck på kartan...',
      districtsLabel: 'Distrikt:',
      allLeonida: 'Hela Leonida',
      minimapTitle: 'Klicka eller dra i minimapen för att flytta vyn',
      controlsHint:
        'Dra för att panorera · Scrolla eller nyp för gatunivå-zoom · Dubbelklicka för egen markör',
      zoomOutAria: 'Zooma ut',
      zoomInAria: 'Zooma in',
      resetView: 'Återställ vy',
      closeDetailAria: 'Stäng markördetaljer',
      foundSuffix: 'Hittad',
      markFound: 'Markera som hittad',
      markedFoundUndo: 'Markerad som hittad (ångra)',
      deleteCustomAria: 'Ta bort egen markör',
      newMarkerTitle: 'Ny egen markör',
      coordinatesLabel: 'Koordinater',
      fieldName: 'Namn på plats *',
      fieldNamePlaceholder: 't.ex. Hemligt garage bakom klubben',
      fieldCategory: 'Kategori',
      fieldNotes: 'Anteckning',
      fieldNotesPlaceholder: 'Valfri beskrivning eller påminnelse...',
      saveMarkerBtn: 'Spara markör',
      customRegion: 'Egen platsmarkering',
      customDefaultDesc: 'Personlig markör tillagd på Leonida-kartan.',
    },
    markerCategories: {
      Vapen: 'Vapen',
      'Gömda paket': 'Gömda paket',
      'Speciella fordon': 'Speciella fordon',
      Affärer: 'Affärer',
      Hemligheter: 'Hemligheter',
      'Hopp/Stunts': 'Hopp/Stunts',
      'Egna markörer': 'Egna markörer',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Karriärspårning',
      title: '100% Completion-checklista',
      completedOfTotal: 'avklarade',
      progressAria: 'Total 100 procent completion',
      filterAll: 'Alla',
      filterRemaining: 'Kvarvarande',
      filterCompleted: 'Avklarade',
      resetBtn: 'Nollställ framsteg',
      confirmResetBtn: 'Bekräfta nollställning',
      emptyCategory: 'Inga moment matchar aktuellt filter i denna kategori.',
    },
    guides: {
      iconsAdaptedFor: 'Knappikoner anpassade för',
      title: 'Guider, Radio & Fuskkoder',
      serverHeading: 'Rockstar Games Services · Serverstatus',
      tabCheats: 'Fuskkoder',
      tabRadio: 'Radiostationer',
      cheatSearchPlaceholder: 'Sök fusk eller effekt...',
      cheatSearchAria: 'Sök fuskkoder',
      noCheatsFound: 'Inga fuskkoder matchade din sökning.',
      trophyWarning: 'Observera: Inaktiverar troféer/achievements under aktuell spelsession.',
      hostLabel: 'Programledare',
      tracklistLabel: 'Låtlista',
      tracksUnit: 'spår',
      dpad: { up: 'Upp', down: 'Ner', left: 'Vänster', right: 'Höger' },
      psButtons: { triangle: 'Triangel', circle: 'Cirkel', cross: 'Kryss', square: 'Fyrkant' },
    },
    cheatCategories: {
      Alla: 'Alla',
      Spelare: 'Spelare',
      'Vapen & Strid': 'Vapen & Strid',
      Fordon: 'Fordon',
      Värld: 'Värld',
    },
    settings: {
      kicker: 'Appkonfiguration & Release-synk',
      title: 'Inställningar',
      subtitle:
        'Anpassa standardplattform, språk, kartfilter, pushnotiser, lokal cache och sök efter nya APK-uppdateringar.',
      preferencesHeading: 'Allmänt & Kartinställningar',
      defaultPlatformLabel: 'Standardplattform',
      defaultPlatformHint: 'Förvalt plattformsfilter för uppdateringar och konsolvyn.',
      languageLabel: 'Språk i gränssnittet',
      languageHint: 'Uppdaterar menyer, guider, kartmarkörer och checklista direkt.',
      hideFoundLabel: 'Dölj hittade markörer på kartan',
      hideFoundHint: 'Visa endast ohittade samlarobjekt och hemligheter på Leonida-kartan.',
      pushHeading: 'Pushnotiser',
      pushHint: 'Få notis så fort en ny GTA VI-patch publiceras för PS5 eller Xbox.',
      pushStatusActive: 'Aktiv',
      pushStatusInactive: 'Avstängd',
      updatesHeading: 'Appuppdateringar (GitHub Releases)',
      updatesHint: 'Kontrollerar senaste signerade Android-APK direkt mot GitHub API.',
      currentVersionLabel: 'Installerad version',
      repoLabel: 'GitHub-repository',
      repoNotConfiguredHint:
        'Ange VITE_GITHUB_REPO i .env eller uppdatera DEFAULT_GITHUB_REPO i updateService.ts.',
      lastCheckedLabel: 'Senast kontrollerad',
      checkUpdatesBtn: 'Sök efter uppdateringar',
      checkingUpdatesBtn: 'Söker på GitHub...',
      upToDateMsg: 'Du har redan den senaste versionen installerad.',
      repoNotFoundError:
        'Hittade ingen release (404). Kontrollera att ditt GitHub-repo är publikt och har en publicerad v*-release.',
      rateLimitError: 'GitHub API-gräns nådd. Försök igen om några minuter.',
      checkFailedError: 'Kunde inte nå GitHub Releases API.',
      cacheHeading: 'Lokal cache & Molnsynk',
      cacheHint: 'Rensar lokalt cachade patchar, framsteg och filter utan att ta bort ditt enhets-ID.',
      deviceIdLabel: 'Enhets-ID',
      cloudSyncLabel: 'Supabase-moln',
      resetCacheBtn: 'Återställ lokal cache',
      confirmResetCacheBtn: 'Bekräfta rensning',
      cacheClearedMsg: 'Lokal cache rensad och standardvärden återställda.',
    },
    updateModal: {
      kicker: 'Ny version tillgänglig',
      title: 'Uppdatering hittad för Leonida Companion',
      currentVersion: 'Nuvarande version',
      latestVersion: 'Senaste release',
      releaseDate: 'Publicerad',
      notesHeading: 'Ändringar i releasen',
      noNotesFallback: 'Signerad Android-APK byggd automatiskt via GitHub Actions.',
      downloadApkBtn: 'Ladda ner signerad APK',
      openReleaseBtn: 'Visa release på GitHub',
      laterBtn: 'Senare',
    },
  },
  es: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Cargando Leonida Companion...',
      cancel: 'Cancelar',
      save: 'Guardar',
      saving: 'Guardando...',
      close: 'Cerrar',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Ambas',
      all: 'Todas',
      selectConsoleAria: 'Seleccionar consola',
      selectLanguageAria: 'Seleccionar idioma',
      serverStatusShort: 'Servidores',
      statusOnline: 'En línea',
      statusDegraded: 'Limitado',
      statusMaintenance: 'Mantenimiento',
      rewardLabel: 'Recompensa',
    },
    nav: {
      ariaLabel: 'Navegación principal',
      patches: 'Actualizaciones',
      map: 'Mapa',
      checklist: 'Progreso',
      guides: 'Guías y Trucos',
      settings: 'Ajustes',
    },
    patches: {
      activeConsoleLabel: 'Consola activa',
      title: 'Actualizaciones y Notas del Parche',
      subtitle:
        'Sigue las actualizaciones oficiales de Rockstar Games y los cambios ocultos descubiertos por la comunidad para PS5 y Xbox Series X|S.',
      watchPushBtn: 'Seguir parches (Push)',
      pushActiveBtn: 'Push activo',
      addPatchBtn: 'Añadir parche',
      newswireTitle: 'Rockstar Newswire y Noticias',
      newswireSubtitle: 'Fuente RSS filtrada para Grand Theft Auto VI y Title Updates',
      sourceFallback: 'Vista previa (RSS bloqueado en sandbox)',
      sourceProxy: 'En vivo vía proxy RSS',
      sourceEdge: 'En vivo vía Supabase Edge Function',
      refreshRss: 'Actualizar RSS',
      fetchingRss: 'Cargando...',
      loadingRssText: 'Obteniendo últimos artículos de Rockstar...',
      readOnNewswire: 'Leer en Rockstar Newswire',
      filterAll: 'Todas',
      searchPlaceholder: 'Buscar versión o cambio...',
      searchAria: 'Buscar actualizaciones',
      emptyTitle: 'Ninguna actualización coincide con el filtro.',
      emptySubtitle: 'Prueba a limpiar el buscador o cambiar a Todas las plataformas.',
      hotfixLabel: 'Hotfix',
      officialNotesHeading: 'Notas oficiales (Rockstar Games)',
      communityHeading: 'Hallazgos de la comunidad',
      communityEmpty: 'No se han reportado cambios ocultos para esta versión.',
      modalTitle: 'Añadir nueva nota de parche',
      modalSubtitle: 'Se guarda localmente y se sincroniza con la tabla patches en Supabase.',
      modalErrorMissing: 'Introduce versión, título y al menos una consola.',
      fieldVersion: 'Número de versión *',
      fieldVersionPlaceholder: 'ej. 01.004.002',
      fieldDate: 'Fecha de lanzamiento',
      fieldTitle: 'Título *',
      fieldTitlePlaceholder: 'ej. Parche de red y rendimiento en Vice Port',
      fieldSizePlaceholder: 'Tamaño (ej. 2.10 GB)',
      fieldSummary: 'Resumen',
      fieldSummaryPlaceholder: 'Breve descripción del enfoque del parche...',
      fieldOfficialNotes: 'Notas oficiales (una por línea)',
      fieldOfficialNotesPlaceholder:
        'Mejora de FPS en Downtown Vice City\nCorregido bloqueo de radio...',
      fieldCommunityNotes: 'Hallazgos ocultos (uno por línea)',
      fieldCommunityNotesPlaceholder:
        'Mejora silenciosa en los efectos de agua de las lanchas...',
      submitPatch: 'Publicar parche',
      defaultSummary: 'Nueva actualización añadida desde administración.',
      defaultOfficialNote: 'Mejoras generales de estabilidad y rendimiento.',
      pushModalTitle: 'Seguir actualizaciones (Push)',
      pushModalSubtitle: 'Recibe un aviso al instante cuando se publique un nuevo parche.',
      pushSelectPlatform: 'Elige plataforma a seguir:',
      pushDeviceId: 'ID de dispositivo (anónimo):',
      pushCloudSync: 'Sincronización (Supabase):',
      pushConnected: 'Conectado',
      pushOffline: 'Modo sin conexión (localStorage)',
      pushActivateBtn: 'Activar notificaciones',
      pushUpdateBtn: 'Actualizar plataforma',
      pushActivating: 'Activando...',
      pushTestBtn: 'Probar aviso',
      pushDisableBtn: 'Desactivar',
      pushPausedMsg: 'Avisos push pausados para este dispositivo.',
      pushTestSuccessMsg: 'Notificación de prueba enviada a tu dispositivo.',
      pushErrorDefault: 'No se pudieron activar las notificaciones.',
      pushTestErrorDefault: 'No se pudo enviar el aviso de prueba.',
      pushUnsupported: 'Tu navegador no admite notificaciones Web Push.',
      pushPermissionDenied:
        'Se denegó el permiso de notificaciones. Permítelas en los ajustes del navegador para seguir actualizaciones.',
      pushPermissionRequired: 'Activa primero el permiso de notificaciones.',
      pushWebPushActive: 'Web Push activado y sincronizado con Supabase.',
      pushBrowserSaved: 'Suscripción guardada con notificaciones del navegador.',
      pushBrowserMissingVapid:
        '¡Notificaciones activadas y guardadas! Añade VITE_WEB_PUSH_PUBLIC_KEY para push en segundo plano.',
      pushTestNotifTitle: 'GTA VI · Nuevo parche para',
      pushTestNotifBody: 'Aviso de prueba: La versión 01.004.001 ya está en Leonida Companion.',
    },
    map: {
      foundCounter: 'lugares encontrados',
      title: 'Mapa Interactivo: Leonida y Vice City',
      hideFound: 'Ocultar encontrados',
      showingUnfound: 'Solo pendientes',
      dayMode: 'Modo día',
      nightMode: 'Modo noche',
      toggleDayNightAria: 'Cambiar entre modo día y noche en el mapa',
      addMarkerBtn: 'Añadir marcador',
      tapMapHint: 'Toca en el mapa...',
      districtsLabel: 'Distritos:',
      allLeonida: 'Todo Leonida',
      minimapTitle: 'Haz clic o arrastra en el minimapa para mover la vista',
      controlsHint:
        'Arrastra para mover · Rueda o pellizco para zoom urbano · Doble clic para marcador propio',
      zoomOutAria: 'Alejar',
      zoomInAria: 'Acercar',
      resetView: 'Restablecer vista',
      closeDetailAria: 'Cerrar detalles',
      foundSuffix: 'Encontrado',
      markFound: 'Marcar como encontrado',
      markedFoundUndo: 'Encontrado (deshacer)',
      deleteCustomAria: 'Eliminar marcador propio',
      newMarkerTitle: 'Nuevo marcador propio',
      coordinatesLabel: 'Coordenadas',
      fieldName: 'Nombre del lugar *',
      fieldNamePlaceholder: 'ej. Garaje secreto detrás del club',
      fieldCategory: 'Categoría',
      fieldNotes: 'Nota',
      fieldNotesPlaceholder: 'Descripción o recordatorio opcional...',
      saveMarkerBtn: 'Guardar marcador',
      customRegion: 'Marca personal',
      customDefaultDesc: 'Marcador personal añadido en el mapa de Leonida.',
    },
    markerCategories: {
      Vapen: 'Armas',
      'Gömda paket': 'Paquetes ocultos',
      'Speciella fordon': 'Vehículos especiales',
      Affärer: 'Tiendas',
      Hemligheter: 'Secretos',
      'Hopp/Stunts': 'Saltos acrobáticos',
      'Egna markörer': 'Marcadores propios',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Progreso de carrera',
      title: 'Lista de verificación 100%',
      completedOfTotal: 'completados',
      progressAria: 'Progreso total del 100 por ciento',
      filterAll: 'Todos',
      filterRemaining: 'Pendientes',
      filterCompleted: 'Completados',
      resetBtn: 'Reiniciar progreso',
      confirmResetBtn: 'Confirmar reinicio',
      emptyCategory: 'Ningún elemento coincide con el filtro actual.',
    },
    guides: {
      iconsAdaptedFor: 'Botones adaptados para',
      title: 'Guías, Radio y Trucos',
      serverHeading: 'Rockstar Games Services · Estado de servidores',
      tabCheats: 'Trucos',
      tabRadio: 'Emisoras de radio',
      cheatSearchPlaceholder: 'Buscar truco o efecto...',
      cheatSearchAria: 'Buscar trucos',
      noCheatsFound: 'Ningún truco coincide con tu búsqueda.',
      trophyWarning: 'Nota: Desactiva trofeos/logros durante la sesión actual.',
      hostLabel: 'Locutor',
      tracklistLabel: 'Lista de canciones',
      tracksUnit: 'temas',
      dpad: { up: 'Arriba', down: 'Abajo', left: 'Izquierda', right: 'Derecha' },
      psButtons: { triangle: 'Triángulo', circle: 'Círculo', cross: 'Cruz', square: 'Cuadrado' },
    },
    cheatCategories: {
      Alla: 'Todos',
      Spelare: 'Jugador',
      'Vapen & Strid': 'Armas y Combate',
      Fordon: 'Vehículos',
      Värld: 'Mundo',
    },
    settings: {
      kicker: 'Configuración y Versiones',
      title: 'Ajustes',
      subtitle:
        'Configura tu plataforma predeterminada, idioma, filtros del mapa, notificaciones push, caché local y busca actualizaciones APK.',
      preferencesHeading: 'Preferencias generales y del mapa',
      defaultPlatformLabel: 'Plataforma predeterminada',
      defaultPlatformHint: 'Filtro inicial para actualizaciones y diseño de consola.',
      languageLabel: 'Idioma de la interfaz',
      languageHint: 'Se aplica al instante en menús, guías, mapa y listas.',
      hideFoundLabel: 'Ocultar marcadores encontrados',
      hideFoundHint: 'Muestra solo los secretos y objetos pendientes en el mapa de Leonida.',
      pushHeading: 'Notificaciones Push',
      pushHint: 'Recibe alertas cuando se publique un nuevo parche de GTA VI para PS5 o Xbox.',
      pushStatusActive: 'Activo',
      pushStatusInactive: 'Desactivado',
      updatesHeading: 'Actualizaciones (GitHub Releases)',
      updatesHint: 'Comprueba la última APK firmada mediante la API de GitHub.',
      currentVersionLabel: 'Versión instalada',
      repoLabel: 'Repositorio GitHub',
      repoNotConfiguredHint:
        'Configura VITE_GITHUB_REPO en .env o edita DEFAULT_GITHUB_REPO en updateService.ts.',
      lastCheckedLabel: 'Última comprobación',
      checkUpdatesBtn: 'Buscar actualizaciones',
      checkingUpdatesBtn: 'Comprobando GitHub...',
      upToDateMsg: 'Ya tienes instalada la última versión.',
      repoNotFoundError:
        'No se encontró ninguna release (404). Asegúrate de que el repositorio es público y tiene una release v*.',
      rateLimitError: 'Límite de la API de GitHub alcanzado. Inténtalo más tarde.',
      checkFailedError: 'No se pudo conectar con GitHub Releases API.',
      cacheHeading: 'Caché local y Nube',
      cacheHint: 'Borra parches, progreso y filtros cacheados sin eliminar tu ID de dispositivo.',
      deviceIdLabel: 'ID de dispositivo',
      cloudSyncLabel: 'Nube Supabase',
      resetCacheBtn: 'Restablecer caché local',
      confirmResetCacheBtn: 'Confirmar limpieza',
      cacheClearedMsg: 'Caché local borrada y valores restaurados.',
    },
    updateModal: {
      kicker: 'Nueva versión disponible',
      title: 'Actualización disponible para Leonida Companion',
      currentVersion: 'Versión actual',
      latestVersion: 'Última versión',
      releaseDate: 'Publicado',
      notesHeading: 'Notas de la versión',
      noNotesFallback: 'APK de Android firmada compilada automáticamente con GitHub Actions.',
      downloadApkBtn: 'Descargar APK firmada',
      openReleaseBtn: 'Ver release en GitHub',
      laterBtn: 'Más tarde',
    },
  },
  de: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Leonida Companion wird geladen...',
      cancel: 'Abbrechen',
      save: 'Speichern',
      saving: 'Speichert...',
      close: 'Schließen',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Beide',
      all: 'Alle',
      selectConsoleAria: 'Konsole auswählen',
      selectLanguageAria: 'Sprache auswählen',
      serverStatusShort: 'Server',
      statusOnline: 'Online',
      statusDegraded: 'Eingeschränkt',
      statusMaintenance: 'Wartung',
      rewardLabel: 'Belohnung',
    },
    nav: {
      ariaLabel: 'Hauptnavigation',
      patches: 'Updates',
      map: 'Karte',
      checklist: 'Checkliste',
      guides: 'Guides & Cheats',
      settings: 'Einstellungen',
    },
    patches: {
      activeConsoleLabel: 'Aktive Konsole',
      title: 'Updates & Patch Notes',
      subtitle:
        'Verfolge offizielle Rockstar-Games-Updates und versteckte Performance-Änderungen aus der Community für PS5 und Xbox Series X|S.',
      watchPushBtn: 'Updates verfolgen (Push)',
      pushActiveBtn: 'Push aktiv',
      addPatchBtn: 'Patch hinzufügen',
      newswireTitle: 'Rockstar Newswire & Neuigkeiten',
      newswireSubtitle: 'Gefilterter RSS-Feed für Grand Theft Auto VI und Title Updates',
      sourceFallback: 'Vorschaudaten (RSS in Sandbox blockiert)',
      sourceProxy: 'Live über RSS-Proxy',
      sourceEdge: 'Live über Supabase Edge Function',
      refreshRss: 'RSS aktualisieren',
      fetchingRss: 'Lädt...',
      loadingRssText: 'Neueste Artikel von Rockstar werden geladen...',
      readOnNewswire: 'Auf Rockstar Newswire lesen',
      filterAll: 'Alle',
      searchPlaceholder: 'Version oder Änderung suchen...',
      searchAria: 'Updates durchsuchen',
      emptyTitle: 'Keine Updates entsprechen deinem Filter.',
      emptySubtitle: 'Leere das Suchfeld oder wechsle zurück zu Alle Plattformen.',
      hotfixLabel: 'Hotfix',
      officialNotesHeading: 'Offizielle Patch Notes (Rockstar Games)',
      communityHeading: 'Community & Stealth-Entdeckungen',
      communityEmpty: 'Für diese Version wurden noch keine versteckten Änderungen gemeldet.',
      modalTitle: 'Neue Patch Note hinzufügen',
      modalSubtitle: 'Wird lokal gespeichert und bei Verbindung mit Supabase synchronisiert.',
      modalErrorMissing: 'Bitte Versionsnummer, Titel und mindestens eine Konsole angeben.',
      fieldVersion: 'Versionsnummer *',
      fieldVersionPlaceholder: 'z. B. 01.004.002',
      fieldDate: 'Veröffentlichungsdatum',
      fieldTitle: 'Titel *',
      fieldTitlePlaceholder: 'z. B. Vice Port Netzwerk- & Performance-Patch',
      fieldSizePlaceholder: 'Dateigröße (z. B. 2.10 GB)',
      fieldSummary: 'Zusammenfassung',
      fieldSummaryPlaceholder: 'Kurzer Überblick zum Fokus des Updates...',
      fieldOfficialNotes: 'Offizielle Patch Notes (ein Punkt pro Zeile)',
      fieldOfficialNotesPlaceholder:
        'Verbesserte Bildrate in Downtown Vice City\nRadio-Absturz behoben...',
      fieldCommunityNotes: 'Community & Stealth-Funde (ein Punkt pro Zeile)',
      fieldCommunityNotesPlaceholder:
        'Heimliche Verbesserung der Gischt-Effekte bei Schnellbooten...',
      submitPatch: 'Patch Note veröffentlichen',
      defaultSummary: 'Neues Update über das Admin-Tool hinzugefügt.',
      defaultOfficialNote: 'Allgemeine Stabilitäts- und Leistungsverbesserungen.',
      pushModalTitle: 'Updates verfolgen (Push)',
      pushModalSubtitle: 'Erhalte sofort eine Benachrichtigung bei neuen GTA-VI-Patches.',
      pushSelectPlatform: 'Plattform zum Überwachen wählen:',
      pushDeviceId: 'Geräte-ID (anonymer Sync):',
      pushCloudSync: 'Cloud-Sync (Supabase):',
      pushConnected: 'Verbunden',
      pushOffline: 'Offline-Modus (localStorage)',
      pushActivateBtn: 'Push-Benachrichtigungen aktivieren',
      pushUpdateBtn: 'Plattformwahl aktualisieren',
      pushActivating: 'Wird aktiviert...',
      pushTestBtn: 'Test-Benachrichtigung',
      pushDisableBtn: 'Deaktivieren',
      pushPausedMsg: 'Push-Überwachung für dieses Gerät pausiert.',
      pushTestSuccessMsg: 'Test-Benachrichtigung an dein Gerät gesendet.',
      pushErrorDefault: 'Push-Benachrichtigungen konnten nicht aktiviert werden.',
      pushTestErrorDefault: 'Test-Benachrichtigung fehlgeschlagen.',
      pushUnsupported: 'Dein Browser unterstützt leider keine Web-Push-Benachrichtigungen.',
      pushPermissionDenied:
        'Benachrichtigungsrecht verweigert. Erlaube Mitteilungen in den Browser-Einstellungen.',
      pushPermissionRequired: 'Bitte aktiviere zuerst die Benachrichtigungsberechtigung.',
      pushWebPushActive: 'Web Push aktiviert und mit Supabase synchronisiert.',
      pushBrowserSaved: 'Abo mit Browser-Benachrichtigungen gespeichert.',
      pushBrowserMissingVapid:
        'Benachrichtigungen aktiviert! Füge VITE_WEB_PUSH_PUBLIC_KEY für Hintergrund-Push hinzu.',
      pushTestNotifTitle: 'GTA VI · Neuer Patch für',
      pushTestNotifBody: 'Test-Hinweis: Version 01.004.001 ist jetzt in Leonida Companion.',
    },
    map: {
      foundCounter: 'Orte gefunden',
      title: 'Interaktive Karte: Leonida & Vice City',
      hideFound: 'Gefundene ausblenden',
      showingUnfound: 'Nur unentdeckte',
      dayMode: 'Tagmodus',
      nightMode: 'Nachtmodus',
      toggleDayNightAria: 'Zwischen Tag- und Nachtmodus der Karte wechseln',
      addMarkerBtn: 'Marker setzen',
      tapMapHint: 'Auf Karte tippen...',
      districtsLabel: 'Bezirke:',
      allLeonida: 'Ganz Leonida',
      minimapTitle: 'Klicken oder ziehen auf der Minimap zum Verschieben',
      controlsHint:
        'Ziehen zum Verschieben · Scrollen/Pinch für Straßenzoom · Doppelklick für eigenen Marker',
      zoomOutAria: 'Herauszoomen',
      zoomInAria: 'Heranzoomen',
      resetView: 'Ansicht zurücksetzen',
      closeDetailAria: 'Markerdetails schließen',
      foundSuffix: 'Gefunden',
      markFound: 'Als gefunden markieren',
      markedFoundUndo: 'Gefunden (rückgängig)',
      deleteCustomAria: 'Eigenen Marker löschen',
      newMarkerTitle: 'Neuer eigener Marker',
      coordinatesLabel: 'Koordinaten',
      fieldName: 'Ortsname *',
      fieldNamePlaceholder: 'z. B. Geheime Garage hinter dem Club',
      fieldCategory: 'Kategorie',
      fieldNotes: 'Notiz',
      fieldNotesPlaceholder: 'Optionale Beschreibung oder Erinnerung...',
      saveMarkerBtn: 'Marker speichern',
      customRegion: 'Eigene Markierung',
      customDefaultDesc: 'Persönlicher Marker auf der Leonida-Karte.',
    },
    markerCategories: {
      Vapen: 'Waffen',
      'Gömda paket': 'Versteckte Pakete',
      'Speciella fordon': 'Spezialfahrzeuge',
      Affärer: 'Läden',
      Hemligheter: 'Geheimnisse',
      'Hopp/Stunts': 'Stunt-Sprünge',
      'Egna markörer': 'Eigene Marker',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Karriere-Fortschritt',
      title: '100 % Completion-Checkliste',
      completedOfTotal: 'abgeschlossen',
      progressAria: 'Gesamtfortschritt 100 Prozent',
      filterAll: 'Alle',
      filterRemaining: 'Offen',
      filterCompleted: 'Erledigt',
      resetBtn: 'Fortschritt zurücksetzen',
      confirmResetBtn: 'Zurücksetzen bestätigen',
      emptyCategory: 'Keine Einträge entsprechen dem aktuellen Filter.',
    },
    guides: {
      iconsAdaptedFor: 'Tastensymbole angepasst für',
      title: 'Guides, Radio & Cheats',
      serverHeading: 'Rockstar Games Services · Serverstatus',
      tabCheats: 'Cheat-Codes',
      tabRadio: 'Radiosender',
      cheatSearchPlaceholder: 'Cheat oder Effekt suchen...',
      cheatSearchAria: 'Cheat-Codes durchsuchen',
      noCheatsFound: 'Keine Cheat-Codes gefunden.',
      trophyWarning: 'Hinweis: Deaktiviert Trophäen/Erfolge für die laufende Sitzung.',
      hostLabel: 'Moderator',
      tracklistLabel: 'Tracklist',
      tracksUnit: 'Titel',
      dpad: { up: 'Hoch', down: 'Runter', left: 'Links', right: 'Rechts' },
      psButtons: { triangle: 'Dreieck', circle: 'Kreis', cross: 'Kreuz', square: 'Quadrat' },
    },
    cheatCategories: {
      Alla: 'Alle',
      Spelare: 'Spieler',
      'Vapen & Strid': 'Waffen & Kampf',
      Fordon: 'Fahrzeuge',
      Värld: 'Welt',
    },
    settings: {
      kicker: 'App-Konfiguration & Releases',
      title: 'Einstellungen',
      subtitle:
        'Passe Standardplattform, Sprache, Kartenfilter, Push-Mitteilungen, lokalen Cache und APK-Updates an.',
      preferencesHeading: 'Allgemein & Kartenoptionen',
      defaultPlatformLabel: 'Standardplattform',
      defaultPlatformHint: 'Voreingestellter Plattformfilter für Updates und Konsolensymbole.',
      languageLabel: 'App-Sprache',
      languageHint: 'Gilt sofort für Menüs, Guides, Kartenmarker und Checklisten.',
      hideFoundLabel: 'Gefundene Marker ausblenden',
      hideFoundHint: 'Zeigt auf der Leonida-Karte nur noch unentdeckte Orte und Geheimnisse.',
      pushHeading: 'Push-Benachrichtigungen',
      pushHint: 'Erhalte Meldungen, sobald ein neuer GTA-VI-Patch für PS5 oder Xbox erscheint.',
      pushStatusActive: 'Aktiv',
      pushStatusInactive: 'Aus',
      updatesHeading: 'App-Updates (GitHub Releases)',
      updatesHint: 'Prüft über die GitHub-API auf die neueste signierte Android-APK.',
      currentVersionLabel: 'Installierte Version',
      repoLabel: 'GitHub-Repository',
      repoNotConfiguredHint:
        'Lege VITE_GITHUB_REPO in .env fest oder passe DEFAULT_GITHUB_REPO in updateService.ts an.',
      lastCheckedLabel: 'Zuletzt geprüft',
      checkUpdatesBtn: 'Nach Updates suchen',
      checkingUpdatesBtn: 'GitHub wird geprüft...',
      upToDateMsg: 'Du nutzt bereits die aktuellste Version.',
      repoNotFoundError:
        'Kein Release gefunden (404). Stelle sicher, dass das Repo öffentlich ist und ein v*-Release enthält.',
      rateLimitError: 'GitHub-API-Limit erreicht. Bitte später erneut versuchen.',
      checkFailedError: 'GitHub Releases API konnte nicht erreicht werden.',
      cacheHeading: 'Lokaler Cache & Cloud-Sync',
      cacheHint: 'Löscht lokal gespeicherte Patches, Fortschritte und Filter (Geräte-ID bleibt erhalten).',
      deviceIdLabel: 'Geräte-ID',
      cloudSyncLabel: 'Supabase Cloud',
      resetCacheBtn: 'Lokalen Cache zurücksetzen',
      confirmResetCacheBtn: 'Löschen bestätigen',
      cacheClearedMsg: 'Lokaler Cache gelöscht und Standardwerte wiederhergestellt.',
    },
    updateModal: {
      kicker: 'Neue Version verfügbar',
      title: 'Update für Leonida Companion gefunden',
      currentVersion: 'Aktuelle Version',
      latestVersion: 'Neuestes Release',
      releaseDate: 'Veröffentlicht',
      notesHeading: 'Release Notes',
      noNotesFallback: 'Signierte Android-APK automatisch erstellt über GitHub Actions.',
      downloadApkBtn: 'Signierte APK herunterladen',
      openReleaseBtn: 'Release auf GitHub ansehen',
      laterBtn: 'Später',
    },
  },
  fr: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Chargement de Leonida Companion...',
      cancel: 'Annuler',
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      close: 'Fermer',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Les deux',
      all: 'Toutes',
      selectConsoleAria: 'Choisir la console',
      selectLanguageAria: 'Choisir la langue',
      serverStatusShort: 'Serveurs',
      statusOnline: 'En ligne',
      statusDegraded: 'Limité',
      statusMaintenance: 'Maintenance',
      rewardLabel: 'Récompense',
    },
    nav: {
      ariaLabel: 'Navigation principale',
      patches: 'Mises à jour',
      map: 'Carte',
      checklist: 'Progression',
      guides: 'Guides & Codes',
      settings: 'Paramètres',
    },
    patches: {
      activeConsoleLabel: 'Console active',
      title: 'Mises à jour & Notes de patch',
      subtitle:
        'Suivez les mises à jour officielles de Rockstar Games et les découvertes furtives de la communauté sur PS5 et Xbox Series X|S.',
      watchPushBtn: 'Suivre les patchs (Push)',
      pushActiveBtn: 'Push actif',
      addPatchBtn: 'Ajouter un patch',
      newswireTitle: 'Rockstar Newswire & Actualités',
      newswireSubtitle: 'Flux RSS filtré pour Grand Theft Auto VI et Title Updates',
      sourceFallback: 'Aperçu hors ligne (RSS bloqué en sandbox)',
      sourceProxy: 'En direct via proxy RSS',
      sourceEdge: 'En direct via Supabase Edge Function',
      refreshRss: 'Actualiser RSS',
      fetchingRss: 'Chargement...',
      loadingRssText: 'Récupération des derniers articles Rockstar...',
      readOnNewswire: 'Lire sur Rockstar Newswire',
      filterAll: 'Toutes',
      searchPlaceholder: 'Rechercher version ou note...',
      searchAria: 'Rechercher dans les mises à jour',
      emptyTitle: 'Aucune mise à jour ne correspond à votre filtre.',
      emptySubtitle: 'Effacez la recherche ou sélectionnez Toutes les plateformes.',
      hotfixLabel: 'Correctif',
      officialNotesHeading: 'Notes officielles (Rockstar Games)',
      communityHeading: 'Découvertes communauté & furtives',
      communityEmpty: 'Aucun changement caché signalé pour cette version.',
      modalTitle: 'Ajouter une note de patch',
      modalSubtitle: 'Enregistré localement et synchronisé avec la table patches Supabase.',
      modalErrorMissing: 'Indiquez un numéro de version, un titre et au moins une console.',
      fieldVersion: 'Numéro de version *',
      fieldVersionPlaceholder: 'ex. 01.004.002',
      fieldDate: 'Date de sortie',
      fieldTitle: 'Titre *',
      fieldTitlePlaceholder: 'ex. Patch Réseau & Performance Vice Port',
      fieldSizePlaceholder: 'Taille (ex. 2.10 GB)',
      fieldSummary: 'Résumé',
      fieldSummaryPlaceholder: 'Bref aperçu des points clés du patch...',
      fieldOfficialNotes: 'Notes officielles (une ligne par point)',
      fieldOfficialNotesPlaceholder:
        'Meilleur framerate à Downtown Vice City\nCorrection du crash radio...',
      fieldCommunityNotes: 'Découvertes communauté (une ligne par point)',
      fieldCommunityNotesPlaceholder:
        'Amélioration discrète des gerbes d’eau derrière les hors-bords...',
      submitPatch: 'Publier le patch',
      defaultSummary: 'Nouvelle mise à jour ajoutée via l’outil admin.',
      defaultOfficialNote: 'Améliorations générales de stabilité et de performances.',
      pushModalTitle: 'Suivre les mises à jour (Push)',
      pushModalSubtitle: 'Recevez une alerte dès qu’un nouveau patch GTA VI est publié.',
      pushSelectPlatform: 'Plateforme à surveiller :',
      pushDeviceId: 'ID appareil (sync anonyme) :',
      pushCloudSync: 'Sync cloud (Supabase) :',
      pushConnected: 'Connecté',
      pushOffline: 'Mode hors ligne (localStorage)',
      pushActivateBtn: 'Activer les notifications',
      pushUpdateBtn: 'Mettre à jour la plateforme',
      pushActivating: 'Activation...',
      pushTestBtn: 'Tester l’alerte',
      pushDisableBtn: 'Désactiver',
      pushPausedMsg: 'Alertes push mises en pause pour cet appareil.',
      pushTestSuccessMsg: 'Notification de test envoyée à votre appareil.',
      pushErrorDefault: 'Impossible d’activer les notifications.',
      pushTestErrorDefault: 'Impossible d’envoyer la notification de test.',
      pushUnsupported: 'Votre navigateur ne prend pas en charge les notifications Web Push.',
      pushPermissionDenied:
        'Autorisation refusée. Activez les notifications dans les réglages du navigateur.',
      pushPermissionRequired: 'Activez d’abord l’autorisation de notification.',
      pushWebPushActive: 'Web Push activé et synchronisé avec Supabase.',
      pushBrowserSaved: 'Abonnement enregistré avec les notifications du navigateur.',
      pushBrowserMissingVapid:
        'Notifications activées ! Ajoutez VITE_WEB_PUSH_PUBLIC_KEY pour le push en arrière-plan.',
      pushTestNotifTitle: 'GTA VI · Nouveau patch pour',
      pushTestNotifBody: 'Notification test : La version 01.004.001 est disponible dans Leonida Companion.',
    },
    map: {
      foundCounter: 'lieux trouvés',
      title: 'Carte Interactive : Leonida & Vice City',
      hideFound: 'Masquer trouvés',
      showingUnfound: 'Non trouvés uniquement',
      dayMode: 'Mode jour',
      nightMode: 'Mode nuit',
      toggleDayNightAria: 'Basculer entre le mode jour et nuit sur la carte',
      addMarkerBtn: 'Ajouter repère',
      tapMapHint: 'Touchez la carte...',
      districtsLabel: 'Quartiers :',
      allLeonida: 'Tout Leonida',
      minimapTitle: 'Cliquez ou glissez sur la minicarte pour déplacer la vue',
      controlsHint:
        'Glisser pour déplacer · Molette/pincement pour zoom rue · Double-clic pour repère perso',
      zoomOutAria: 'Dézoomer',
      zoomInAria: 'Zoomer',
      resetView: 'Réinitialiser',
      closeDetailAria: 'Fermer les détails',
      foundSuffix: 'Trouvé',
      markFound: 'Marquer comme trouvé',
      markedFoundUndo: 'Trouvé (annuler)',
      deleteCustomAria: 'Supprimer ce repère',
      newMarkerTitle: 'Nouveau repère personnel',
      coordinatesLabel: 'Coordonnées',
      fieldName: 'Nom du lieu *',
      fieldNamePlaceholder: 'ex. Garage secret derrière le club',
      fieldCategory: 'Catégorie',
      fieldNotes: 'Note',
      fieldNotesPlaceholder: 'Description ou mémo facultatif...',
      saveMarkerBtn: 'Enregistrer le repère',
      customRegion: 'Repère personnel',
      customDefaultDesc: 'Repère personnel ajouté sur la carte de Leonida.',
    },
    markerCategories: {
      Vapen: 'Armes',
      'Gömda paket': 'Colis cachés',
      'Speciella fordon': 'Véhicules spéciaux',
      Affärer: 'Boutiques',
      Hemligheter: 'Secrets',
      'Hopp/Stunts': 'Sauts uniques',
      'Egna markörer': 'Repères perso',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Suivi de carrière',
      title: 'Checklist 100 %',
      completedOfTotal: 'terminés',
      progressAria: 'Progression totale 100 pour cent',
      filterAll: 'Tous',
      filterRemaining: 'Restants',
      filterCompleted: 'Terminés',
      resetBtn: 'Réinitialiser',
      confirmResetBtn: 'Confirmer la réinitialisation',
      emptyCategory: 'Aucun élément ne correspond au filtre actuel.',
    },
    guides: {
      iconsAdaptedFor: 'Touches adaptées pour',
      title: 'Guides, Radio & Codes de triche',
      serverHeading: 'Rockstar Games Services · État des serveurs',
      tabCheats: 'Codes de triche',
      tabRadio: 'Stations de radio',
      cheatSearchPlaceholder: 'Chercher un code ou effet...',
      cheatSearchAria: 'Chercher des codes de triche',
      noCheatsFound: 'Aucun code ne correspond à votre recherche.',
      trophyWarning: 'Attention : Désactive les trophées/succès pour la session en cours.',
      hostLabel: 'Animateur',
      tracklistLabel: 'Playlist',
      tracksUnit: 'titres',
      dpad: { up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite' },
      psButtons: { triangle: 'Triangle', circle: 'Rond', cross: 'Croix', square: 'Carré' },
    },
    cheatCategories: {
      Alla: 'Tous',
      Spelare: 'Joueur',
      'Vapen & Strid': 'Armes & Combat',
      Fordon: 'Véhicules',
      Värld: 'Monde',
    },
    settings: {
      kicker: 'Configuration & Mises à jour',
      title: 'Paramètres',
      subtitle:
        'Réglez la plateforme par défaut, la langue, les filtres de carte, les notifications push, le cache local et les mises à jour APK.',
      preferencesHeading: 'Préférences générales & Carte',
      defaultPlatformLabel: 'Plateforme par défaut',
      defaultPlatformHint: 'Filtre initial des mises à jour et affichage des touches console.',
      languageLabel: 'Langue de l’interface',
      languageHint: 'Appliqué immédiatement aux menus, guides, marqueurs et checklists.',
      hideFoundLabel: 'Masquer les repères trouvés',
      hideFoundHint: 'Affiche uniquement les objets et secrets restants sur la carte de Leonida.',
      pushHeading: 'Notifications Push',
      pushHint: 'Recevez une alerte dès qu’un nouveau patch GTA VI sort sur PS5 ou Xbox.',
      pushStatusActive: 'Actif',
      pushStatusInactive: 'Désactivé',
      updatesHeading: 'Mises à jour (GitHub Releases)',
      updatesHint: 'Vérifie la dernière APK Android signée via l’API GitHub.',
      currentVersionLabel: 'Version installée',
      repoLabel: 'Dépôt GitHub',
      repoNotConfiguredHint:
        'Définissez VITE_GITHUB_REPO dans .env ou modifiez DEFAULT_GITHUB_REPO dans updateService.ts.',
      lastCheckedLabel: 'Dernière vérification',
      checkUpdatesBtn: 'Rechercher des mises à jour',
      checkingUpdatesBtn: 'Vérification GitHub...',
      upToDateMsg: 'Vous disposez déjà de la dernière version.',
      repoNotFoundError:
        'Aucune release trouvée (404). Vérifiez que le dépôt est public et contient une release v*.',
      rateLimitError: 'Limite API GitHub atteinte. Réessayez dans quelques minutes.',
      checkFailedError: 'Impossible de contacter l’API GitHub Releases.',
      cacheHeading: 'Cache local & Sync cloud',
      cacheHint: 'Efface les patchs, progrès et filtres locaux sans supprimer votre ID appareil.',
      deviceIdLabel: 'ID appareil',
      cloudSyncLabel: 'Cloud Supabase',
      resetCacheBtn: 'Réinitialiser le cache local',
      confirmResetCacheBtn: 'Confirmer l’effacement',
      cacheClearedMsg: 'Cache local vidé et paramètres restaurés.',
    },
    updateModal: {
      kicker: 'Nouvelle version disponible',
      title: 'Mise à jour trouvée pour Leonida Companion',
      currentVersion: 'Version actuelle',
      latestVersion: 'Dernière release',
      releaseDate: 'Publiée le',
      notesHeading: 'Notes de version',
      noNotesFallback: 'APK Android signée générée automatiquement via GitHub Actions.',
      downloadApkBtn: 'Télécharger l’APK signée',
      openReleaseBtn: 'Voir la release sur GitHub',
      laterBtn: 'Plus tard',
    },
  },
  pt: {
    common: {
      appName: 'Leonida Companion',
      loading: 'Carregando Leonida Companion...',
      cancel: 'Cancelar',
      save: 'Salvar',
      saving: 'Salvando...',
      close: 'Fechar',
      ps5: 'PS5',
      xbox: 'Xbox Series X|S',
      xboxShort: 'Xbox',
      both: 'Ambos',
      all: 'Todas',
      selectConsoleAria: 'Selecionar console',
      selectLanguageAria: 'Selecionar idioma',
      serverStatusShort: 'Servidores',
      statusOnline: 'Online',
      statusDegraded: 'Limitado',
      statusMaintenance: 'Manutenção',
      rewardLabel: 'Recompensa',
    },
    nav: {
      ariaLabel: 'Navegação principal',
      patches: 'Atualizações',
      map: 'Mapa',
      checklist: 'Checklist',
      guides: 'Guias e Cheats',
      settings: 'Ajustes',
    },
    patches: {
      activeConsoleLabel: 'Console ativo',
      title: 'Atualizações e Patch Notes',
      subtitle:
        'Acompanhe atualizações oficiais da Rockstar Games e descobertas ocultas de desempenho feitas pela comunidade para PS5 e Xbox Series X|S.',
      watchPushBtn: 'Monitorar patches (Push)',
      pushActiveBtn: 'Push ativo',
      addPatchBtn: 'Adicionar patch',
      newswireTitle: 'Rockstar Newswire e Notícias',
      newswireSubtitle: 'Feed RSS filtrado de Grand Theft Auto VI e Title Updates',
      sourceFallback: 'Pré-visualização (RSS bloqueado no sandbox)',
      sourceProxy: 'Ao vivo via proxy RSS',
      sourceEdge: 'Ao vivo via Supabase Edge Function',
      refreshRss: 'Atualizar RSS',
      fetchingRss: 'Buscando...',
      loadingRssText: 'Buscando os artigos mais recentes da Rockstar...',
      readOnNewswire: 'Ler no Rockstar Newswire',
      filterAll: 'Todas',
      searchPlaceholder: 'Buscar versão ou mudança...',
      searchAria: 'Buscar atualizações',
      emptyTitle: 'Nenhuma atualização corresponde ao filtro.',
      emptySubtitle: 'Limpe a busca ou mude para Todas as plataformas.',
      hotfixLabel: 'Hotfix',
      officialNotesHeading: 'Notas oficiais (Rockstar Games)',
      communityHeading: 'Descobertas da comunidade e furtivas',
      communityEmpty: 'Nenhuma mudança oculta relatada para esta versão ainda.',
      modalTitle: 'Adicionar novo Patch Note',
      modalSubtitle: 'Salvo localmente e sincronizado com a tabela patches no Supabase.',
      modalErrorMissing: 'Informe o número da versão, título e ao menos um console.',
      fieldVersion: 'Número da versão *',
      fieldVersionPlaceholder: 'ex. 01.004.002',
      fieldDate: 'Data de lançamento',
      fieldTitle: 'Título *',
      fieldTitlePlaceholder: 'ex. Patch de Rede e Desempenho em Vice Port',
      fieldSizePlaceholder: 'Tamanho (ex. 2.10 GB)',
      fieldSummary: 'Resumo',
      fieldSummaryPlaceholder: 'Visão rápida do foco da atualização...',
      fieldOfficialNotes: 'Notas oficiais (um item por linha)',
      fieldOfficialNotesPlaceholder:
        'Taxa de quadros melhorada em Downtown Vice City\nCorrigido travamento no rádio...',
      fieldCommunityNotes: 'Descobertas da comunidade (um item por linha)',
      fieldCommunityNotesPlaceholder:
        'Melhoria discreta nos efeitos de água das lanchas...',
      submitPatch: 'Publicar patch note',
      defaultSummary: 'Nova atualização adicionada pelo painel admin.',
      defaultOfficialNote: 'Melhorias gerais de estabilidade e desempenho.',
      pushModalTitle: 'Monitorar atualizações (Push)',
      pushModalSubtitle: 'Receba um alerta assim que um novo patch de GTA VI for publicado.',
      pushSelectPlatform: 'Escolha a plataforma para monitorar:',
      pushDeviceId: 'ID do dispositivo (anônimo):',
      pushCloudSync: 'Sincronização (Supabase):',
      pushConnected: 'Conectado',
      pushOffline: 'Modo offline (localStorage)',
      pushActivateBtn: 'Ativar notificações push',
      pushUpdateBtn: 'Atualizar plataforma',
      pushActivating: 'Ativando...',
      pushTestBtn: 'Testar aviso',
      pushDisableBtn: 'Desativar',
      pushPausedMsg: 'Notificações push pausadas neste dispositivo.',
      pushTestSuccessMsg: 'Notificação de teste enviada para o seu dispositivo.',
      pushErrorDefault: 'Não foi possível ativar as notificações.',
      pushTestErrorDefault: 'Não foi possível enviar o aviso de teste.',
      pushUnsupported: 'Seu navegador não oferece suporte a notificações Web Push.',
      pushPermissionDenied:
        'Permissão negada. Libere notificações nas configurações do navegador.',
      pushPermissionRequired: 'Ative a permissão de notificação primeiro.',
      pushWebPushActive: 'Web Push ativado e sincronizado com o Supabase.',
      pushBrowserSaved: 'Assinatura salva com notificações do navegador.',
      pushBrowserMissingVapid:
        'Notificações ativadas! Adicione VITE_WEB_PUSH_PUBLIC_KEY para push em segundo plano.',
      pushTestNotifTitle: 'GTA VI · Novo patch para',
      pushTestNotifBody: 'Aviso de teste: A versão 01.004.001 já está no Leonida Companion.',
    },
    map: {
      foundCounter: 'locais encontrados',
      title: 'Mapa Interativo: Leonida e Vice City',
      hideFound: 'Ocultar encontrados',
      showingUnfound: 'Somente pendentes',
      dayMode: 'Modo dia',
      nightMode: 'Modo noite',
      toggleDayNightAria: 'Alternar entre modo dia e noite no mapa',
      addMarkerBtn: 'Adicionar marcador',
      tapMapHint: 'Toque no mapa...',
      districtsLabel: 'Distritos:',
      allLeonida: 'Toda Leonida',
      minimapTitle: 'Clique ou arraste no minimapa para mover a câmera',
      controlsHint:
        'Arraste para mover · Roda ou pinça para zoom de rua · Duplo clique para marcador próprio',
      zoomOutAria: 'Diminuir zoom',
      zoomInAria: 'Aumentar zoom',
      resetView: 'Redefinir visão',
      closeDetailAria: 'Fechar detalhes',
      foundSuffix: 'Encontrado',
      markFound: 'Marcar como encontrado',
      markedFoundUndo: 'Encontrado (desfazer)',
      deleteCustomAria: 'Remover marcador próprio',
      newMarkerTitle: 'Novo marcador pessoal',
      coordinatesLabel: 'Coordenadas',
      fieldName: 'Nome do local *',
      fieldNamePlaceholder: 'ex. Garagem secreta atrás da boate',
      fieldCategory: 'Categoria',
      fieldNotes: 'Observação',
      fieldNotesPlaceholder: 'Descrição ou lembrete opcional...',
      saveMarkerBtn: 'Salvar marcador',
      customRegion: 'Marca pessoal',
      customDefaultDesc: 'Marcador pessoal adicionado ao mapa de Leonida.',
    },
    markerCategories: {
      Vapen: 'Armas',
      'Gömda paket': 'Pacotes ocultos',
      'Speciella fordon': 'Veículos especiais',
      Affärer: 'Lojas',
      Hemligheter: 'Segredos',
      'Hopp/Stunts': 'Saltos únicos',
      'Egna markörer': 'Marcadores próprios',
    },
    checklist: {
      kicker: 'Grand Theft Auto VI · Progresso de Carreira',
      title: 'Checklist de 100%',
      completedOfTotal: 'concluídos',
      progressAria: 'Progresso total de 100 por cento',
      filterAll: 'Todos',
      filterRemaining: 'Restantes',
      filterCompleted: 'Concluídos',
      resetBtn: 'Zerar progresso',
      confirmResetBtn: 'Confirmar reinício',
      emptyCategory: 'Nenhum item corresponde ao filtro atual.',
    },
    guides: {
      iconsAdaptedFor: 'Botões adaptados para',
      title: 'Guias, Rádio e Códigos (Cheats)',
      serverHeading: 'Rockstar Games Services · Status dos Servidores',
      tabCheats: 'Códigos (Cheats)',
      tabRadio: 'Estações de Rádio',
      cheatSearchPlaceholder: 'Buscar código ou efeito...',
      cheatSearchAria: 'Buscar códigos de trapaça',
      noCheatsFound: 'Nenhum código encontrado.',
      trophyWarning: 'Aviso: Desativa troféus/conquistas na sessão atual.',
      hostLabel: 'Apresentador',
      tracklistLabel: 'Lista de músicas',
      tracksUnit: 'faixas',
      dpad: { up: 'Cima', down: 'Baixo', left: 'Esquerda', right: 'Direita' },
      psButtons: { triangle: 'Triângulo', circle: 'Círculo', cross: 'Xis', square: 'Quadrado' },
    },
    cheatCategories: {
      Alla: 'Todos',
      Spelare: 'Jogador',
      'Vapen & Strid': 'Armas e Combate',
      Fordon: 'Veículos',
      Värld: 'Mundo',
    },
    settings: {
      kicker: 'Configuração do App & Releases',
      title: 'Configurações',
      subtitle:
        'Defina plataforma padrão, idioma, filtros do mapa, notificações push, cache local e busque atualizações APK.',
      preferencesHeading: 'Preferências gerais e Mapa',
      defaultPlatformLabel: 'Plataforma padrão',
      defaultPlatformHint: 'Filtro inicial para atualizações e layout dos botões do console.',
      languageLabel: 'Idioma da interface',
      languageHint: 'Aplicado imediatamente em menus, guias, mapa e checklists.',
      hideFoundLabel: 'Ocultar marcadores encontrados',
      hideFoundHint: 'Exibe apenas itens e segredos pendentes no mapa de Leonida.',
      pushHeading: 'Notificações Push',
      pushHint: 'Receba avisos sempre que sair um novo patch de GTA VI para PS5 ou Xbox.',
      pushStatusActive: 'Ativo',
      pushStatusInactive: 'Desativado',
      updatesHeading: 'Atualizações do App (GitHub Releases)',
      updatesHint: 'Verifica a última APK Android assinada diretamente pela API do GitHub.',
      currentVersionLabel: 'Versão instalada',
      repoLabel: 'Repositório GitHub',
      repoNotConfiguredHint:
        'Defina VITE_GITHUB_REPO no .env ou edite DEFAULT_GITHUB_REPO em updateService.ts.',
      lastCheckedLabel: 'Última verificação',
      checkUpdatesBtn: 'Buscar atualizações',
      checkingUpdatesBtn: 'Consultando GitHub...',
      upToDateMsg: 'Você já está usando a versão mais recente.',
      repoNotFoundError:
        'Nenhuma release encontrada (404). Confirme se o repositório é público e possui uma release v*.',
      rateLimitError: 'Limite da API do GitHub atingido. Tente novamente em alguns minutos.',
      checkFailedError: 'Não foi possível acessar a API do GitHub Releases.',
      cacheHeading: 'Cache local e Nuvem',
      cacheHint: 'Limpa patches, progresso e filtros salvos localmente sem apagar seu ID do dispositivo.',
      deviceIdLabel: 'ID do dispositivo',
      cloudSyncLabel: 'Nuvem Supabase',
      resetCacheBtn: 'Redefinir cache local',
      confirmResetCacheBtn: 'Confirmar limpeza',
      cacheClearedMsg: 'Cache local limpo e padrões restaurados.',
    },
    updateModal: {
      kicker: 'Nova versão disponível',
      title: 'Atualização encontrada para o Leonida Companion',
      currentVersion: 'Versão atual',
      latestVersion: 'Última release',
      releaseDate: 'Publicado em',
      notesHeading: 'Notas da versão',
      noNotesFallback: 'APK Android assinada gerada automaticamente via GitHub Actions.',
      downloadApkBtn: 'Baixar APK assinada',
      openReleaseBtn: 'Ver release no GitHub',
      laterBtn: 'Depois',
    },
  },
};

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved && SUPPORTED_LANGUAGES.has(saved)) {
      return saved;
    }
  } catch {
    // Ignorera lagringsfel
  }

  const browserLangs =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language]
      : [];

  for (const rawLang of browserLangs) {
    if (!rawLang) continue;
    const prefix = rawLang.slice(0, 2).toLowerCase() as Language;
    if (SUPPORTED_LANGUAGES.has(prefix)) {
      return prefix;
    }
  }

  return 'en';
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  localizePatch: (patch: PatchNote) => PatchNote;
  localizeMarker: (marker: MapMarker) => MapMarker;
  localizeChecklistCategory: (cat: ChecklistCategoryMeta) => ChecklistCategoryMeta;
  localizeChecklistItem: (item: ChecklistItem) => ChecklistItem;
  localizeCheat: (cheat: CheatCode) => CheatCode;
  localizeRadio: (station: RadioStation) => RadioStation;
  localizeServerStatus: (plat: PlatformServerStatus) => PlatformServerStatus & { overallLabel: string };
  localizeNewswireArticle: (article: NewswireArticle) => NewswireArticle;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectInitialLanguage());

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignorera lagringsfel
    }
  }, [language]);

  function setLanguage(lang: Language) {
    if (SUPPORTED_LANGUAGES.has(lang)) {
      setLanguageState(lang);
    }
  }

  const t = TRANSLATIONS[language];

  function localizePatch(patch: PatchNote): PatchNote {
    if (language === 'sv') return patch;
    const tr = PATCH_TRANSLATIONS[language][patch.id];
    return tr ? { ...patch, ...tr } : patch;
  }

  function localizeMarker(marker: MapMarker): MapMarker {
    if (language === 'sv') return marker;
    const tr = MARKER_TRANSLATIONS[language][marker.id];
    if (!tr) {
      return marker.region === 'Egen platsmarkering'
        ? { ...marker, region: t.map.customRegion }
        : marker;
    }
    return {
      ...marker,
      title: tr.title,
      description: tr.description,
      reward: tr.reward ?? marker.reward,
    };
  }

  function localizeChecklistCategory(cat: ChecklistCategoryMeta): ChecklistCategoryMeta {
    if (language === 'sv') return cat;
    const tr = CHECKLIST_CATEGORY_TRANSLATIONS[language][cat.id];
    return tr ? { ...cat, ...tr } : cat;
  }

  function localizeChecklistItem(item: ChecklistItem): ChecklistItem {
    if (language === 'sv') return item;
    const tr = CHECKLIST_ITEM_TRANSLATIONS[language][item.id];
    return tr ? { ...item, ...tr } : item;
  }

  function localizeCheat(cheat: CheatCode): CheatCode {
    if (language === 'sv') return cheat;
    const tr = CHEAT_TRANSLATIONS[language][cheat.id];
    return tr ? { ...cheat, ...tr } : cheat;
  }

  function localizeRadio(station: RadioStation): RadioStation {
    if (language === 'sv') return station;
    const tr = RADIO_TRANSLATIONS[language][station.id];
    return tr ? { ...station, ...tr } : station;
  }

  function localizeServerStatus(
    plat: PlatformServerStatus
  ): PlatformServerStatus & { overallLabel: string } {
    if (language === 'sv') {
      const label =
        plat.overall === 'online'
          ? t.common.statusOnline
          : plat.overall === 'degraded'
            ? t.common.statusDegraded
            : t.common.statusMaintenance;
      return { ...plat, overallLabel: label };
    }
    const tr = SERVER_STATUS_TRANSLATIONS[language][plat.platform];
    if (!tr) {
      return { ...plat, overallLabel: t.common.statusOnline };
    }
    return {
      ...plat,
      overallLabel: tr.overallLabel,
      summary: tr.summary,
      updatedAt: tr.updatedAt,
      services: plat.services.map((svc) => {
        const mapped = tr.services[svc.name];
        return mapped ? { ...svc, name: mapped.name, note: mapped.note } : svc;
      }),
    };
  }

  function localizeNewswireArticle(article: NewswireArticle): NewswireArticle {
    if (language === 'sv' || !article.isFallback) return article;
    const tr = RSS_FALLBACK_TRANSLATIONS[language][article.id];
    return tr ? { ...article, ...tr } : article;
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
    localizePatch,
    localizeMarker,
    localizeChecklistCategory,
    localizeChecklistItem,
    localizeCheat,
    localizeRadio,
    localizeServerStatus,
    localizeNewswireArticle,
  };

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
