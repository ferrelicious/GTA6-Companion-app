import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Disc3,
  Phone,
  Radio,
  Search,
  Server,
  Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/translations';
import {
  CheatCategory,
  CheatCode,
  ConsolePlatform,
  PlatformServerStatus,
  RadioStation,
  ServiceHealth,
} from '../types';
import { ControllerButton } from './ControllerButton';

interface GuidesCheatsTabProps {
  selectedConsole: ConsolePlatform;
  cheats: CheatCode[];
  radioStations: RadioStation[];
  serverStatus: PlatformServerStatus[];
}

const CHEAT_CATEGORIES: ('Alla' | CheatCategory)[] = [
  'Alla',
  'Spelare',
  'Vapen & Strid',
  'Fordon',
  'Värld',
];

function StatusIcon({ health }: { health: ServiceHealth }) {
  if (health === 'online') {
    return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
  }
  if (health === 'degraded') {
    return <AlertTriangle size={16} className="text-amber-400 shrink-0" />;
  }
  return <Wrench size={16} className="text-rose-400 shrink-0" />;
}

export function GuidesCheatsTab({
  selectedConsole,
  cheats,
  radioStations,
  serverStatus,
}: GuidesCheatsTabProps) {
  const { t, localizeCheat, localizeRadio, localizeServerStatus } = useTranslation();

  const [subView, setSubView] = useState<'cheats' | 'radio'>('cheats');
  const [cheatSearch, setCheatSearch] = useState('');
  const [cheatCategory, setCheatCategory] = useState<'Alla' | CheatCategory>('Alla');
  const [expandedStationId, setExpandedStationId] = useState<string>(
    radioStations[0]?.id ?? ''
  );

  const localizedServerStatus = useMemo(
    () => serverStatus.map((plat) => localizeServerStatus(plat)),
    [serverStatus, localizeServerStatus]
  );

  const localizedCheats = useMemo(
    () => cheats.map((c) => localizeCheat(c)),
    [cheats, localizeCheat]
  );

  const localizedStations = useMemo(
    () => radioStations.map((st) => localizeRadio(st)),
    [radioStations, localizeRadio]
  );

  const filteredCheats = useMemo(() => {
    const q = cheatSearch.trim().toLowerCase();
    return localizedCheats.filter((c) => {
      const matchesCat = cheatCategory === 'Alla' || c.category === cheatCategory;
      if (!q) return matchesCat;
      const catLabel = t.cheatCategories[c.category] ?? c.category;
      const hay = `${c.name} ${c.effect} ${catLabel} ${c.phoneNumber ?? ''}`.toLowerCase();
      return matchesCat && hay.includes(q);
    });
  }, [localizedCheats, cheatCategory, cheatSearch, t.cheatCategories]);

  return (
    <section aria-labelledby="guides-heading" className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-[#00F0FF] mb-1">
          {t.guides.iconsAdaptedFor}:{' '}
          {selectedConsole === 'ps5' ? 'PlayStation 5' : t.common.xbox}
        </p>
        <h1
          id="guides-heading"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
        >
          {t.guides.title}
        </h1>
      </div>

      {/* Rockstar Games Services Status Card */}
      <div className="leonida-glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Server size={18} className="text-[#00F0FF]" />
            <h2 className="font-display text-base font-bold text-white">
              {t.guides.serverHeading}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {localizedServerStatus[0]?.updatedAt ?? ''}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {localizedServerStatus.map((plat) => {
            const isActiveConsole = plat.platform === selectedConsole;
            return (
              <div
                key={plat.platform}
                className={`p-4 rounded-xl border transition-colors ${
                  isActiveConsole
                    ? 'bg-[#0D0F14]/90 border-white/20'
                    : 'bg-[#0D0F14]/50 border-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-display text-sm font-bold text-white">
                    {plat.platformName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      plat.overall === 'online'
                        ? 'text-emerald-400'
                        : plat.overall === 'degraded'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    <StatusIcon health={plat.overall} />
                    <span>{plat.overallLabel}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{plat.summary}</p>

                <div className="space-y-1.5 pt-2.5 border-t border-white/[0.06]">
                  {plat.services.map((svc) => (
                    <div
                      key={svc.name}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="text-slate-300">{svc.name}</span>
                      <span className="text-slate-400 font-mono text-[11px] truncate">
                        {svc.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-navigation between Cheats & Radio */}
      <div
        role="tablist"
        aria-label={t.guides.title}
        className="inline-flex items-center p-1 rounded-xl bg-[#141720] border border-white/10"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subView === 'cheats'}
          onClick={() => setSubView('cheats')}
          className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
            subView === 'cheats'
              ? 'bg-[#FF2A85] text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.guides.tabCheats} ({localizedCheats.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subView === 'radio'}
          onClick={() => setSubView('radio')}
          className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
            subView === 'radio'
              ? 'bg-[#00F0FF] text-[#0D0F14]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.guides.tabRadio} ({localizedStations.length})
        </button>
      </div>

      {/* CHEATS SECTION */}
      {subView === 'cheats' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {CHEAT_CATEGORIES.map((cat) => {
                const active = cheatCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCheatCategory(cat)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      active
                        ? 'bg-white/10 border-white/25 text-white'
                        : 'bg-[#141720] border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.cheatCategories[cat]}
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
                value={cheatSearch}
                onChange={(e) => setCheatSearch(e.target.value)}
                placeholder={t.guides.cheatSearchPlaceholder}
                aria-label={t.guides.cheatSearchAria}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#141720] border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#FF2A85]"
              />
            </div>
          </div>

          {filteredCheats.length === 0 ? (
            <div className="leonida-surface rounded-2xl p-8 text-center text-sm text-slate-400">
              {t.guides.noCheatsFound}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCheats.map((cheat) => (
                <article
                  key={cheat.id}
                  className="leonida-surface rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-[#FF2A85] font-medium">
                        {t.cheatCategories[cheat.category]}
                      </span>
                      {cheat.phoneNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-300">
                            <Phone size={11} />
                            {cheat.phoneNumber}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-bold text-white">
                      {cheat.name}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {cheat.effect}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.07]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {cheat.buttons.map((token, idx) => (
                        <ControllerButton
                          key={`${cheat.id}-${idx}`}
                          token={token}
                          platform={selectedConsole}
                        />
                      ))}
                    </div>
                    {cheat.disablesTrophies && (
                      <p className="text-[11px] text-slate-500 mt-2.5">
                        {t.guides.trophyWarning}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RADIO STATIONS SECTION */}
      {subView === 'radio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {localizedStations.map((station) => {
            const isExpanded = expandedStationId === station.id;
            return (
              <article
                key={station.id}
                className="leonida-surface rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span
                          className="font-mono tabular-nums font-semibold"
                          style={{ color: station.accentHex }}
                        >
                          {station.frequency}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{station.genre}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {station.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.guides.hostLabel}: {station.host}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="w-10 h-10 rounded-xl bg-[#0D0F14] border border-white/10 flex items-center justify-center shrink-0"
                    >
                      <Radio size={18} style={{ color: station.accentHex }} />
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    {station.description}
                  </p>
                </div>

                <div className="mt-auto border-t border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedStationId(isExpanded ? '' : station.id)
                    }
                    aria-expanded={isExpanded}
                    className="w-full px-5 py-3 min-h-[44px] flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-white/[0.03] cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Disc3 size={15} style={{ color: station.accentHex }} />
                      <span>
                        {t.guides.tracklistLabel} ({station.tracks.length} {t.guides.tracksUnit})
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <ul className="px-5 pb-4 divide-y divide-white/[0.05]">
                      {station.tracks.map((track, idx) => (
                        <li
                          key={idx}
                          className="py-2.5 flex items-baseline justify-between gap-3 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-slate-100 truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {track.artist}
                            </p>
                          </div>
                          <span className="font-mono text-xs tabular-nums text-slate-500 shrink-0">
                            {track.year}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
