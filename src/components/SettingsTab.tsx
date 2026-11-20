import {
  Bell,
  BellOff,
  CheckCircle2,
  Database,
  EyeOff,
  Gamepad2,
  Globe,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LANGUAGE_OPTIONS, useTranslation } from '../i18n/translations';
import { api } from '../services/api';
import {
  subscribeToPatchNotifications,
  triggerTestPatchNotification,
} from '../services/pushService';
import {
  APP_VERSION,
  checkForAppUpdate,
  getConfiguredGithubRepo,
  isGithubRepoConfigured,
  UpdateCheckResult,
} from '../services/updateService';
import { PatchPlatformFilter, PushPlatformChoice, PushSubscriptionState } from '../types';

interface SettingsTabProps {
  defaultPlatformFilter: PatchPlatformFilter;
  onChangeDefaultPlatform: (filter: PatchPlatformFilter) => void;
  hideFoundMarkers: boolean;
  onToggleHideFoundMarkers: (next: boolean) => void;
  onResetLocalCache: () => Promise<void>;
  onOpenUpdateModal: (info: UpdateCheckResult) => void;
}

export function SettingsTab({
  defaultPlatformFilter,
  onChangeDefaultPlatform,
  hideFoundMarkers,
  onToggleHideFoundMarkers,
  onResetLocalCache,
  onOpenUpdateModal,
}: SettingsTabProps) {
  const { language, setLanguage, t } = useTranslation();

  // Push Notifications state
  const [pushState, setPushState] = useState<PushSubscriptionState>({
    enabled: false,
    platform: 'both',
  });
  const [selectedPushPlatform, setSelectedPushPlatform] = useState<PushPlatformChoice>('both');
  const [isPushBusy, setIsPushBusy] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // App Update Check state
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Cache reset state
  const [confirmClearCache, setConfirmClearCache] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheFeedback, setCacheFeedback] = useState<string | null>(null);

  const configuredRepo = getConfiguredGithubRepo();
  const repoConfigured = isGithubRepoConfigured();

  useEffect(() => {
    api.getPushSubscriptionState().then((saved) => {
      setPushState(saved);
      setSelectedPushPlatform(saved.platform);
    });
  }, []);

  async function handleEnablePush() {
    setIsPushBusy(true);
    setPushFeedback(null);
    try {
      const result = await subscribeToPatchNotifications(selectedPushPlatform);
      setPushState(result.state);
      const localizedText =
        result.messageKey === 'webPush'
          ? t.patches.pushWebPushActive
          : result.messageKey === 'browserSaved'
            ? t.patches.pushBrowserSaved
            : t.patches.pushBrowserMissingVapid;
      setPushFeedback({ type: 'success', text: localizedText });
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : '';
      const message =
        code === 'PUSH_UNSUPPORTED'
          ? t.patches.pushUnsupported
          : code === 'PUSH_PERMISSION_DENIED'
            ? t.patches.pushPermissionDenied
            : err instanceof Error && err.message
              ? err.message
              : t.patches.pushErrorDefault;
      setPushFeedback({ type: 'error', text: message });
    } finally {
      setIsPushBusy(false);
    }
  }

  async function handleDisablePush() {
    setIsPushBusy(true);
    setPushFeedback(null);
    try {
      const next = await api.disablePushSubscription();
      setPushState(next);
      setPushFeedback({ type: 'success', text: t.patches.pushPausedMsg });
    } finally {
      setIsPushBusy(false);
    }
  }

  async function handleTestPush() {
    setPushFeedback(null);
    try {
      const platformLabel =
        selectedPushPlatform === 'both'
          ? `${t.common.ps5} & ${t.common.xboxShort}`
          : selectedPushPlatform === 'ps5'
            ? t.common.ps5
            : t.common.xbox;
      await triggerTestPatchNotification(
        `${t.patches.pushTestNotifTitle} ${platformLabel}`,
        t.patches.pushTestNotifBody
      );
      setPushFeedback({ type: 'success', text: t.patches.pushTestSuccessMsg });
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : '';
      const message =
        code === 'PUSH_PERMISSION_REQUIRED'
          ? t.patches.pushPermissionRequired
          : err instanceof Error && err.message
            ? err.message
            : t.patches.pushTestErrorDefault;
      setPushFeedback({ type: 'error', text: message });
    }
  }

  async function handleCheckForUpdates() {
    setIsCheckingUpdate(true);
    setUpdateFeedback(null);
    try {
      const result = await checkForAppUpdate();
      setLastCheckedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (result.hasUpdate) {
        onOpenUpdateModal(result);
      } else {
        setUpdateFeedback({
          type: 'success',
          text: `${t.settings.upToDateMsg} (v${result.latestVersion})`,
        });
      }
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : '';
      const message =
        code === 'UPDATE_REPO_NOT_FOUND'
          ? t.settings.repoNotFoundError
          : code === 'UPDATE_RATE_LIMIT'
            ? t.settings.rateLimitError
            : t.settings.checkFailedError;
      setUpdateFeedback({ type: 'error', text: message });
    } finally {
      setIsCheckingUpdate(false);
    }
  }

  async function handleResetCacheClick() {
    if (!confirmClearCache) {
      setConfirmClearCache(true);
      setCacheFeedback(null);
      return;
    }
    setIsClearingCache(true);
    try {
      await onResetLocalCache();
      setConfirmClearCache(false);
      setCacheFeedback(t.settings.cacheClearedMsg);
    } finally {
      setIsClearingCache(false);
    }
  }

  return (
    <section aria-labelledby="settings-heading" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-[#00F0FF] mb-1">{t.settings.kicker}</p>
        <h1
          id="settings-heading"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
        >
          {t.settings.title}
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.settings.subtitle}</p>
      </div>

      {/* 1. General & Map Preferences */}
      <div className="leonida-glass rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
          <Gamepad2 size={18} className="text-[#00F0FF] shrink-0" />
          <h2 className="font-display text-base sm:text-lg font-bold text-white">
            {t.settings.preferencesHeading}
          </h2>
        </div>

        {/* Default Platform */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{t.settings.defaultPlatformLabel}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.settings.defaultPlatformHint}</p>
          </div>

          <div
            role="group"
            aria-label={t.settings.defaultPlatformLabel}
            className="inline-flex items-center p-1 rounded-xl bg-[#0D0F14] border border-white/10 self-start sm:self-auto"
          >
            {(
              [
                { id: 'all', label: t.common.all },
                { id: 'ps5', label: t.common.ps5 },
                { id: 'xbox', label: t.common.xboxShort },
              ] as const
            ).map((opt) => {
              const active = defaultPlatformFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeDefaultPlatform(opt.id)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interface Language */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-[#FF2A85] shrink-0" />
              <p className="text-sm font-semibold text-white">{t.settings.languageLabel}</p>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.settings.languageHint}</p>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FF2A85]/15 border-[#FF2A85] text-white'
                      : 'bg-[#0D0F14] border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <span aria-hidden="true">{opt.flag}</span>
                  <span className="font-mono">{opt.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hide Found Map Markers */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <EyeOff size={15} className="text-slate-300 shrink-0" />
              <p className="text-sm font-semibold text-white">{t.settings.hideFoundLabel}</p>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.settings.hideFoundHint}</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={hideFoundMarkers}
            onClick={() => onToggleHideFoundMarkers(!hideFoundMarkers)}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
              hideFoundMarkers
                ? 'bg-[#FF2A85] border-[#FF2A85]'
                : 'bg-[#0D0F14] border-white/20'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                hideFoundMarkers ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Push Notifications */}
      <div className="leonida-glass rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-[#FF2A85] shrink-0" />
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                {t.settings.pushHeading}
              </h2>
              <p className="text-xs text-slate-400">{t.settings.pushHint}</p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold shrink-0 ${
              pushState.enabled ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {pushState.enabled ? t.settings.pushStatusActive : t.settings.pushStatusInactive}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-300">{t.patches.pushSelectPlatform}</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'ps5', label: t.common.ps5 },
                { id: 'xbox', label: t.common.xboxShort },
                { id: 'both', label: t.common.both },
              ] as const
            ).map((opt) => {
              const active = selectedPushPlatform === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedPushPlatform(opt.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#0D0F14] border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {pushFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              pushFeedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                : 'bg-rose-500/15 border-rose-500/35 text-rose-200'
            }`}
          >
            {pushFeedback.type === 'success' && (
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            )}
            <span>{pushFeedback.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isPushBusy}
            onClick={handleEnablePush}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] disabled:opacity-60 text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 cursor-pointer"
          >
            <Bell size={15} />
            <span>
              {isPushBusy
                ? t.patches.pushActivating
                : pushState.enabled
                  ? t.patches.pushUpdateBtn
                  : t.patches.pushActivateBtn}
            </span>
          </button>

          {pushState.enabled && (
            <>
              <button
                type="button"
                onClick={handleTestPush}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0D0F14] border border-white/15 text-xs sm:text-sm font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                {t.patches.pushTestBtn}
              </button>
              <button
                type="button"
                disabled={isPushBusy}
                onClick={handleDisablePush}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-xs sm:text-sm font-medium text-slate-400 hover:text-rose-300 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BellOff size={14} />
                <span>{t.patches.pushDisableBtn}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. App Updates & GitHub Releases */}
      <div className="leonida-glass rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
          <Smartphone size={18} className="text-[#00F0FF] shrink-0" />
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-white">
              {t.settings.updatesHeading}
            </h2>
            <p className="text-xs text-slate-400">{t.settings.updatesHint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-400">{t.settings.currentVersionLabel}</span>
            <span className="font-mono tabular-nums font-semibold text-[#00F0FF]">
              v{APP_VERSION}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.08] flex items-center justify-between gap-2">
            <span className="text-slate-400 shrink-0">{t.settings.repoLabel}</span>
            <span className="font-mono text-slate-200 truncate">{configuredRepo}</span>
          </div>
        </div>

        {!repoConfigured && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
            <ShieldAlert size={15} className="shrink-0 mt-0.5 text-amber-400" />
            <span>{t.settings.repoNotConfiguredHint}</span>
          </div>
        )}

        {updateFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              updateFeedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                : 'bg-rose-500/15 border-rose-500/35 text-rose-200'
            }`}
          >
            {updateFeedback.type === 'success' && (
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            )}
            <span>{updateFeedback.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={isCheckingUpdate}
            onClick={handleCheckForUpdates}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/45 hover:bg-[#00F0FF]/25 disabled:opacity-60 text-sm font-semibold text-[#00F0FF] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} className={isCheckingUpdate ? 'animate-spin' : ''} />
            <span>
              {isCheckingUpdate ? t.settings.checkingUpdatesBtn : t.settings.checkUpdatesBtn}
            </span>
          </button>

          {lastCheckedAt && (
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {t.settings.lastCheckedLabel}: {lastCheckedAt}
            </span>
          )}
        </div>
      </div>

      {/* 4. Local Cache & Cloud Sync */}
      <div className="leonida-glass rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
          <Database size={18} className="text-slate-300 shrink-0" />
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-white">
              {t.settings.cacheHeading}
            </h2>
            <p className="text-xs text-slate-400">{t.settings.cacheHint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-400">{t.settings.deviceIdLabel}</span>
            <span className="font-mono text-slate-200">{api.getDeviceId().slice(0, 12)}...</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-400">{t.settings.cloudSyncLabel}</span>
            <span className={api.isCloudSyncEnabled() ? 'text-emerald-400' : 'text-amber-400'}>
              {api.isCloudSyncEnabled() ? t.patches.pushConnected : t.patches.pushOffline}
            </span>
          </div>
        </div>

        {cacheFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{cacheFeedback}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isClearingCache}
            onClick={handleResetCacheClick}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border inline-flex items-center gap-2 transition-colors cursor-pointer ${
              confirmClearCache
                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                : 'bg-[#0D0F14] border-white/15 text-slate-300 hover:border-rose-500/40 hover:text-rose-200'
            }`}
          >
            <RotateCcw size={15} />
            <span>
              {confirmClearCache ? t.settings.confirmResetCacheBtn : t.settings.resetCacheBtn}
            </span>
          </button>

          {confirmClearCache && (
            <button
              type="button"
              onClick={() => setConfirmClearCache(false)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              {t.common.cancel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
