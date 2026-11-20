import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ChecklistTab } from './components/ChecklistTab';
import { GuidesCheatsTab } from './components/GuidesCheatsTab';
import { LeonidaMapTab } from './components/LeonidaMapTab';
import { PatchTrackerTab } from './components/PatchTrackerTab';
import { SettingsTab } from './components/SettingsTab';
import { TopBar } from './components/TopBar';
import { UpdateModal } from './components/UpdateModal';
import { LanguageProvider, useTranslation } from './i18n/translations';
import { api } from './services/api';
import {
  checkForAppUpdate,
  isGithubRepoConfigured,
  UpdateCheckResult,
} from './services/updateService';
import {
  CheatCode,
  ChecklistCategoryMeta,
  ChecklistItem,
  ConsolePlatform,
  MainTab,
  MapMarker,
  NewPatchInput,
  PatchNote,
  PatchPlatformFilter,
  PlatformServerStatus,
  RadioStation,
} from './types';

function CompanionShell() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MainTab>('patches');
  const [selectedConsole, setSelectedConsole] = useState<ConsolePlatform>(() =>
    api.getSelectedConsole()
  );
  const [defaultPlatformFilter, setDefaultPlatformFilter] = useState<PatchPlatformFilter>(() =>
    api.getDefaultPlatformFilter()
  );
  const [hideFoundMarkers, setHideFoundMarkers] = useState<boolean>(() =>
    api.getHideFoundMarkers()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [availableUpdate, setAvailableUpdate] = useState<UpdateCheckResult | null>(null);

  const [patches, setPatches] = useState<PatchNote[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [foundMarkerIds, setFoundMarkerIds] = useState<string[]>([]);
  const [checklistCategories] = useState<ChecklistCategoryMeta[]>(() =>
    api.getChecklistCategories()
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [completedChecklistIds, setCompletedChecklistIds] = useState<string[]>([]);
  const [cheats, setCheats] = useState<CheatCode[]>([]);
  const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
  const [serverStatus, setServerStatus] = useState<PlatformServerStatus[]>([]);

  async function reloadAllData() {
    const [
      patchesData,
      markersData,
      foundIdsData,
      checklistData,
      completedIdsData,
      cheatsData,
      radioData,
      statusData,
    ] = await Promise.all([
      api.getPatches(),
      api.getMarkers(),
      api.getFoundMarkerIds(),
      api.getChecklistItems(),
      api.getCompletedChecklistIds(),
      api.getCheats(),
      api.getRadioStations(),
      api.getServerStatus(),
    ]);

    setPatches(patchesData);
    setMarkers(markersData);
    setFoundMarkerIds(foundIdsData);
    setChecklistItems(checklistData);
    setCompletedChecklistIds(completedIdsData);
    setCheats(cheatsData);
    setRadioStations(radioData);
    setServerStatus(statusData);
  }

  useEffect(() => {
    let active = true;

    async function loadCompanionData() {
      try {
        await reloadAllData();
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadCompanionData();

    // Silent background check for APK updates on startup if repo is configured
    if (isGithubRepoConfigured()) {
      checkForAppUpdate()
        .then((res) => {
          if (active && res.hasUpdate) {
            setAvailableUpdate(res);
          }
        })
        .catch(() => {
          // Ignore silent startup check failures
        });
    }

    return () => {
      active = false;
    };
  }, []);

  function handleSelectConsole(platform: ConsolePlatform) {
    setSelectedConsole(platform);
    api.setSelectedConsole(platform);
  }

  function handleChangeDefaultPlatform(filter: PatchPlatformFilter) {
    setDefaultPlatformFilter(filter);
    api.setDefaultPlatformFilter(filter);
    if (filter === 'ps5' || filter === 'xbox') {
      handleSelectConsole(filter);
    }
  }

  function handleToggleHideFoundMarkers(next: boolean) {
    setHideFoundMarkers(next);
    api.setHideFoundMarkers(next);
  }

  async function handleResetLocalCache() {
    api.resetLocalCache();
    setDefaultPlatformFilter('all');
    setHideFoundMarkers(false);
    await reloadAllData();
  }

  async function handleAddPatch(input: NewPatchInput) {
    const created = await api.createPatch(input);
    setPatches((prev) =>
      [created, ...prev].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    );
  }

  async function handleToggleMarkerFound(markerId: string) {
    const updated = await api.toggleMarkerFound(markerId);
    setFoundMarkerIds(updated);
  }

  async function handleAddCustomMarker(
    markerInput: Omit<MapMarker, 'id' | 'isCustom'>
  ): Promise<MapMarker> {
    const created = await api.addCustomMarker(markerInput);
    setMarkers((prev) => [...prev, created]);
    return created;
  }

  async function handleDeleteCustomMarker(markerId: string) {
    await api.deleteCustomMarker(markerId);
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    setFoundMarkerIds((prev) => prev.filter((id) => id !== markerId));
  }

  async function handleToggleChecklistItem(itemId: string) {
    const updated = await api.toggleChecklistItem(itemId);
    setCompletedChecklistIds(updated);
  }

  async function handleResetChecklist() {
    const updated = await api.resetChecklistProgress();
    setCompletedChecklistIds(updated);
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-100 relative overflow-x-hidden">
      {/* Subtle Leonida twilight ambient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-[#FF2A85]/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[#00F0FF]/[0.05] blur-[130px]" />
      </div>

      <TopBar
        selectedConsole={selectedConsole}
        onSelectConsole={handleSelectConsole}
        serverStatus={serverStatus}
        onOpenServerStatus={() => setActiveTab('guides')}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        {isLoading ? (
          <div className="leonida-surface rounded-2xl p-8 text-center text-sm text-slate-400">
            {t.common.loading}
          </div>
        ) : (
          <>
            {activeTab === 'patches' && (
              <PatchTrackerTab
                patches={patches}
                selectedConsole={selectedConsole}
                defaultPlatformFilter={defaultPlatformFilter}
                onAddPatch={handleAddPatch}
              />
            )}

            {activeTab === 'map' && (
              <LeonidaMapTab
                markers={markers}
                foundMarkerIds={foundMarkerIds}
                hideFound={hideFoundMarkers}
                onToggleHideFound={handleToggleHideFoundMarkers}
                onToggleFound={handleToggleMarkerFound}
                onAddCustomMarker={handleAddCustomMarker}
                onDeleteCustomMarker={handleDeleteCustomMarker}
              />
            )}

            {activeTab === 'checklist' && (
              <ChecklistTab
                categories={checklistCategories}
                items={checklistItems}
                completedIds={completedChecklistIds}
                onToggleItem={handleToggleChecklistItem}
                onResetProgress={handleResetChecklist}
              />
            )}

            {activeTab === 'guides' && (
              <GuidesCheatsTab
                selectedConsole={selectedConsole}
                cheats={cheats}
                radioStations={radioStations}
                serverStatus={serverStatus}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                defaultPlatformFilter={defaultPlatformFilter}
                onChangeDefaultPlatform={handleChangeDefaultPlatform}
                hideFoundMarkers={hideFoundMarkers}
                onToggleHideFoundMarkers={handleToggleHideFoundMarkers}
                onResetLocalCache={handleResetLocalCache}
                onOpenUpdateModal={(info) => setAvailableUpdate(info)}
              />
            )}
          </>
        )}
      </main>

      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {availableUpdate && (
        <UpdateModal
          updateInfo={availableUpdate}
          onClose={() => setAvailableUpdate(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CompanionShell />
    </LanguageProvider>
  );
}
