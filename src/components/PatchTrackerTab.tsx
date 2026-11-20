import {
  Bell,
  BellOff,
  CheckCircle2,
  ExternalLink,
  Eye,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../i18n/translations';
import { api } from '../services/api';
import {
  subscribeToPatchNotifications,
  triggerTestPatchNotification,
} from '../services/pushService';
import { fetchRockstarNewswire, RssFetchResult } from '../services/rssService';
import {
  ConsolePlatform,
  NewPatchInput,
  NewswireArticle,
  PatchNote,
  PatchPlatformFilter,
  PushPlatformChoice,
  PushSubscriptionState,
} from '../types';

interface PatchTrackerTabProps {
  patches: PatchNote[];
  selectedConsole: ConsolePlatform;
  defaultPlatformFilter: PatchPlatformFilter;
  onAddPatch: (input: NewPatchInput) => Promise<void>;
}

export function PatchTrackerTab({
  patches,
  selectedConsole,
  defaultPlatformFilter,
  onAddPatch,
}: PatchTrackerTabProps) {
  const { t, localizePatch, localizeNewswireArticle } = useTranslation();

  const [platformFilter, setPlatformFilter] = useState<PatchPlatformFilter>(defaultPlatformFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPlatformFilter(defaultPlatformFilter);
  }, [defaultPlatformFilter]);

  // Admin modal form state
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [includePs5, setIncludePs5] = useState(true);
  const [includeXbox, setIncludeXbox] = useState(true);
  const [fileSizePs5, setFileSizePs5] = useState('2.10 GB');
  const [fileSizeXbox, setFileSizeXbox] = useState('2.35 GB');
  const [summary, setSummary] = useState('');
  const [officialNotesRaw, setOfficialNotesRaw] = useState('');
  const [communityRaw, setCommunityRaw] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Rockstar Newswire RSS state
  const [newswireArticles, setNewswireArticles] = useState<NewswireArticle[]>([]);
  const [rssSource, setRssSource] = useState<RssFetchResult['source']>('fallback');
  const [isLoadingRss, setIsLoadingRss] = useState(true);

  // Web Push notification state
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [pushState, setPushState] = useState<PushSubscriptionState>({
    enabled: false,
    platform: 'both',
  });
  const [selectedPushPlatform, setSelectedPushPlatform] = useState<PushPlatformChoice>('both');
  const [isPushBusy, setIsPushBusy] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  async function loadNewswire() {
    setIsLoadingRss(true);
    try {
      const result = await fetchRockstarNewswire();
      setNewswireArticles(result.articles);
      setRssSource(result.source);
    } finally {
      setIsLoadingRss(false);
    }
  }

  useEffect(() => {
    loadNewswire();
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

  const localizedPatches = useMemo(
    () => patches.map((patch) => localizePatch(patch)),
    [patches, localizePatch]
  );

  const localizedArticles = useMemo(
    () => newswireArticles.map((art) => localizeNewswireArticle(art)),
    [newswireArticles, localizeNewswireArticle]
  );

  const filteredPatches = useMemo(() => {
    return localizedPatches.filter((patch) => {
      const matchesPlatform =
        platformFilter === 'all' || patch.platforms.includes(platformFilter);
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesPlatform;
      const hay = [
        patch.version,
        patch.title,
        patch.summary,
        ...patch.officialNotes,
        ...patch.communityDiscoveries,
      ]
        .join(' ')
        .toLowerCase();
      return matchesPlatform && hay.includes(q);
    });
  }, [localizedPatches, platformFilter, searchQuery]);

  async function handleSubmitPatch(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    const platforms: ConsolePlatform[] = [];
    if (includePs5) platforms.push('ps5');
    if (includeXbox) platforms.push('xbox');

    if (!version.trim() || !title.trim() || platforms.length === 0) {
      setFormError(t.patches.modalErrorMissing);
      return;
    }

    const officialNotes = officialNotesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const communityDiscoveries = communityRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await onAddPatch({
        version: version.trim(),
        title: title.trim(),
        releaseDate,
        platforms,
        fileSizePs5: includePs5 ? fileSizePs5.trim() || undefined : undefined,
        fileSizeXbox: includeXbox ? fileSizeXbox.trim() || undefined : undefined,
        summary: summary.trim() || t.patches.defaultSummary,
        officialNotes:
          officialNotes.length > 0 ? officialNotes : [t.patches.defaultOfficialNote],
        communityDiscoveries,
      });
      setVersion('');
      setTitle('');
      setSummary('');
      setOfficialNotesRaw('');
      setCommunityRaw('');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="patches-heading" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#00F0FF] mb-1">
            {t.patches.activeConsoleLabel}:{' '}
            {selectedConsole === 'ps5' ? 'PlayStation 5' : t.common.xbox}
          </p>
          <h1
            id="patches-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance"
          >
            {t.patches.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.patches.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setPushFeedback(null);
              setIsPushModalOpen(true);
            }}
            className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
              pushState.enabled
                ? 'bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/25'
                : 'bg-[#141720] border-white/15 text-slate-100 hover:border-[#00F0FF]/50'
            }`}
          >
            <Bell size={17} />
            <span>
              {pushState.enabled ? t.patches.pushActiveBtn : t.patches.watchPushBtn}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] active:scale-[0.99] text-white text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
          >
            <Plus size={18} />
            <span>{t.patches.addPatchBtn}</span>
          </button>
        </div>
      </div>

      {/* Rockstar Newswire & Nyheter (RSS) */}
      <div className="leonida-glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Newspaper size={18} className="text-[#FF2A85] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-lg font-bold text-white truncate">
                {t.patches.newswireTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.patches.newswireSubtitle}
                {rssSource === 'fallback' && ` · ${t.patches.sourceFallback}`}
                {rssSource === 'cors-proxy' && ` · ${t.patches.sourceProxy}`}
                {rssSource === 'edge-function' && ` · ${t.patches.sourceEdge}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadNewswire}
            disabled={isLoadingRss}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl bg-[#0D0F14] border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/25 disabled:opacity-60 cursor-pointer shrink-0"
          >
            <RefreshCw size={14} className={isLoadingRss ? 'animate-spin' : ''} />
            <span>{isLoadingRss ? t.patches.fetchingRss : t.patches.refreshRss}</span>
          </button>
        </div>

        {isLoadingRss && localizedArticles.length === 0 ? (
          <div className="py-6 text-sm text-slate-400">{t.patches.loadingRssText}</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {localizedArticles.slice(0, 3).map((article) => (
              <article
                key={article.id}
                className="flex flex-col justify-between p-4 rounded-xl bg-[#0D0F14]/75 border border-white/[0.07] hover:border-white/15 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-[#00F0FF] font-medium">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedAt} className="font-mono tabular-nums">
                      {article.publishedAt}
                    </time>
                  </div>
                  <h3 className="font-display text-sm font-bold text-white leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF2A85] hover:text-[#ff5ca1] transition-colors"
                >
                  <span>{t.patches.readOnNewswire}</span>
                  <ExternalLink size={13} />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t.common.selectConsoleAria}
          className="inline-flex items-center p-1 rounded-xl bg-[#141720] border border-white/10 self-start"
        >
          {(
            [
              { id: 'all', label: t.patches.filterAll },
              { id: 'ps5', label: t.common.ps5 },
              { id: 'xbox', label: t.common.xbox },
            ] as const
          ).map((tab) => {
            const active = platformFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPlatformFilter(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.patches.searchPlaceholder}
            aria-label={t.patches.searchAria}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#141720] border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>
      </div>

      {/* Timeline List */}
      {filteredPatches.length === 0 ? (
        <div className="leonida-surface rounded-2xl p-8 text-center">
          <p className="text-base font-medium text-slate-200">{t.patches.emptyTitle}</p>
          <p className="text-sm text-slate-400 mt-1">{t.patches.emptySubtitle}</p>
        </div>
      ) : (
        <div className="relative space-y-5">
          {filteredPatches.map((patch) => {
            const platformText = patch.platforms
              .map((p) => (p === 'ps5' ? t.common.ps5 : t.common.xbox))
              .join(' / ');

            const sizeParts: string[] = [];
            if (patch.fileSizePs5) sizeParts.push(`${t.common.ps5}: ${patch.fileSizePs5}`);
            if (patch.fileSizeXbox) sizeParts.push(`${t.common.xboxShort}: ${patch.fileSizeXbox}`);

            return (
              <article
                key={patch.id}
                className="leonida-glass rounded-2xl p-5 sm:p-6 transition-colors hover:border-white/15"
              >
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400 mb-2">
                  <span className="font-mono tabular-nums font-semibold text-[#00F0FF]">
                    v{patch.version}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={patch.releaseDate} className="font-mono tabular-nums">
                    {patch.releaseDate}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300 font-medium">{platformText}</span>
                  {sizeParts.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-slate-400">
                        {sizeParts.join(' · ')}
                      </span>
                    </>
                  )}
                  {patch.isHotfix && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#FF2A85] font-medium">{t.patches.hotfixLabel}</span>
                    </>
                  )}
                </div>

                <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                  {patch.title}
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
                  {patch.summary}
                </p>

                <div className="mt-5 pt-5 border-t border-white/[0.08] grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-3">
                      <ShieldCheck size={15} className="text-[#00F0FF] shrink-0" />
                      <span>{t.patches.officialNotesHeading}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                      {patch.officialNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"
                          />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#FF2A85] mb-3">
                      <Eye size={15} className="shrink-0" />
                      <span>{t.patches.communityHeading}</span>
                    </div>
                    {patch.communityDiscoveries.length === 0 ? (
                      <p className="text-sm text-slate-500">{t.patches.communityEmpty}</p>
                    ) : (
                      <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                        {patch.communityDiscoveries.map((disc, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF2A85]/80 shrink-0"
                            />
                            <span>{disc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Admin Modal for Adding New Patch Note */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-patch-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
        >
          <div className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#141720] border border-white/15 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 id="add-patch-modal-title" className="font-display text-lg font-bold text-white">
                  {t.patches.modalTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.patches.modalSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitPatch} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.patches.fieldVersion}
                  </label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder={t.patches.fieldVersionPlaceholder}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.patches.fieldDate}
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.patches.fieldTitle}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.patches.fieldTitlePlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0D0F14] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-medium text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePs5}
                      onChange={(e) => setIncludePs5(e.target.checked)}
                      className="w-4 h-4 accent-[#00F0FF]"
                    />
                    <span>PlayStation 5</span>
                  </label>
                  {includePs5 && (
                    <input
                      type="text"
                      value={fileSizePs5}
                      onChange={(e) => setFileSizePs5(e.target.value)}
                      placeholder={t.patches.fieldSizePlaceholder}
                      className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#141720] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00F0FF]"
                    />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#0D0F14] border border-white/10 space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-medium text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeXbox}
                      onChange={(e) => setIncludeXbox(e.target.checked)}
                      className="w-4 h-4 accent-[#FF2A85]"
                    />
                    <span>{t.common.xbox}</span>
                  </label>
                  {includeXbox && (
                    <input
                      type="text"
                      value={fileSizeXbox}
                      onChange={(e) => setFileSizeXbox(e.target.value)}
                      placeholder={t.patches.fieldSizePlaceholder}
                      className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#141720] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FF2A85]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.patches.fieldSummary}
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t.patches.fieldSummaryPlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.patches.fieldOfficialNotes}
                </label>
                <textarea
                  rows={3}
                  value={officialNotesRaw}
                  onChange={(e) => setOfficialNotesRaw(e.target.value)}
                  placeholder={t.patches.fieldOfficialNotesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.patches.fieldCommunityNotes}
                </label>
                <textarea
                  rows={2}
                  value={communityRaw}
                  onChange={(e) => setCommunityRaw(e.target.value)}
                  placeholder={t.patches.fieldCommunityNotesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF2A85]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] disabled:opacity-60 text-sm font-semibold text-white cursor-pointer"
                >
                  {isSubmitting ? t.common.saving : t.patches.submitPatch}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal för Pushnotis-bevakning */}
      {isPushModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="push-modal-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
        >
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141720] border border-white/15 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <h2 id="push-modal-title" className="font-display text-lg font-bold text-white">
                  {t.patches.pushModalTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.patches.pushModalSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPushModalOpen(false)}
                aria-label={t.common.close}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">
                {t.patches.pushSelectPlatform}
              </p>
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

            <div className="p-3 rounded-xl bg-[#0D0F14] border border-white/[0.08] text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>{t.patches.pushDeviceId}</span>
                <span className="font-mono text-slate-300">
                  {api.getDeviceId().slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t.patches.pushCloudSync}</span>
                <span className={api.isCloudSyncEnabled() ? 'text-emerald-400' : 'text-amber-400'}>
                  {api.isCloudSyncEnabled() ? t.patches.pushConnected : t.patches.pushOffline}
                </span>
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

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={isPushBusy}
                onClick={handleEnablePush}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] disabled:opacity-60 text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell size={16} />
                <span>
                  {isPushBusy
                    ? t.patches.pushActivating
                    : pushState.enabled
                      ? t.patches.pushUpdateBtn
                      : t.patches.pushActivateBtn}
                </span>
              </button>

              {pushState.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleTestPush}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[#0D0F14] border border-white/15 text-xs font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    {t.patches.pushTestBtn}
                  </button>
                  <button
                    type="button"
                    disabled={isPushBusy}
                    onClick={handleDisablePush}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-xs font-medium text-slate-400 hover:text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BellOff size={14} />
                    <span>{t.patches.pushDisableBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
