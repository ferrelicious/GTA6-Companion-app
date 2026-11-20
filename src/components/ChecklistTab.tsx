import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChecklistCategoryId, ChecklistCategoryMeta, ChecklistItem } from '../types';

interface ChecklistTabProps {
  categories: ChecklistCategoryMeta[];
  items: ChecklistItem[];
  completedIds: string[];
  onToggleItem: (itemId: string) => void;
  onResetProgress: () => void;
}

type ChecklistFilter = 'all' | 'remaining' | 'completed';

export function ChecklistTab({
  categories,
  items,
  completedIds,
  onToggleItem,
  onResetProgress,
}: ChecklistTabProps) {
  const [filter, setFilter] = useState<ChecklistFilter>('all');
  const [openCategories, setOpenCategories] = useState<Record<ChecklistCategoryId, boolean>>({
    main_missions: true,
    strangers_freaks: true,
    collectibles: true,
    vehicle_challenges: false,
    random_events: false,
  });
  const [confirmReset, setConfirmReset] = useState(false);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const totalCount = items.length;
  const completedCount = items.filter((item) => completedSet.has(item.id)).length;
  const overallPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  function toggleCategory(id: ChecklistCategoryId) {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section aria-labelledby="checklist-heading" className="space-y-6">
      {/* Top Progress Card */}
      <div className="leonida-glass rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#00F0FF] mb-1">
              Grand Theft Auto VI · Karriärspårning
            </p>
            <h1
              id="checklist-heading"
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
            >
              100% Completion-checklista
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl sm:text-4xl font-extrabold tabular-nums text-white">
              {overallPercent}%
            </span>
            <span className="font-mono text-xs sm:text-sm tabular-nums text-slate-400">
              {completedCount} / {totalCount} avklarade
            </span>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Total 100 procent completion"
          className="mt-4 h-3 w-full rounded-full bg-[#0D0F14] border border-white/10 overflow-hidden"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF2A85] to-[#00F0FF] transition-all duration-300"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Filter & Reset Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Filtrera checklista"
            className="inline-flex items-center p-1 rounded-xl bg-[#0D0F14] border border-white/10"
          >
            {(
              [
                { id: 'all', label: 'Alla' },
                { id: 'remaining', label: 'Kvarvarande' },
                { id: 'completed', label: 'Avklarade' },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Nollställ framsteg</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs font-semibold text-rose-200 hover:bg-rose-500/30 cursor-pointer"
              >
                Bekräfta nollställning
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[36px] px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Avbryt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Categories */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = items.filter((item) => item.categoryId === cat.id);
          const catCompleted = catItems.filter((item) => completedSet.has(item.id)).length;
          const catPercent =
            catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0;

          const visibleItems = catItems.filter((item) => {
            const done = completedSet.has(item.id);
            if (filter === 'remaining') return !done;
            if (filter === 'completed') return done;
            return true;
          });

          const isOpen = openCategories[cat.id];

          return (
            <div key={cat.id} className="leonida-surface rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00F0FF]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                    <h2 className="font-display text-base sm:text-lg font-bold text-white">
                      {cat.label}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {catCompleted}/{catItems.length}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-xs text-slate-400">{cat.weightLabel}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{cat.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block w-24 h-1.5 rounded-full bg-[#0D0F14] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00F0FF] transition-all duration-300"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] divide-y divide-white/[0.06]">
                  {visibleItems.length === 0 ? (
                    <div className="px-5 py-4 text-xs text-slate-500">
                      Inga moment matchar aktuellt filter i denna kategori.
                    </div>
                  ) : (
                    visibleItems.map((item) => {
                      const checked = completedSet.has(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onToggleItem(item.id)}
                          aria-pressed={checked}
                          className="w-full px-5 py-3.5 min-h-[58px] flex items-start gap-3.5 text-left hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF2A85]"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                              checked
                                ? 'bg-[#00F0FF] border-[#00F0FF] text-[#0D0F14]'
                                : 'bg-[#0D0F14] border-white/25 text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                              <span
                                className={`text-sm sm:text-[15px] font-medium transition-colors ${
                                  checked
                                    ? 'line-through text-slate-500'
                                    : 'text-slate-100'
                                }`}
                              >
                                {item.title}
                              </span>
                              <span className="text-xs text-slate-500 shrink-0">
                                {item.region}
                              </span>
                            </div>
                            <p
                              className={`text-xs mt-1 leading-relaxed ${
                                checked ? 'text-slate-600' : 'text-slate-400'
                              }`}
                            >
                              {item.requirement}
                              {item.reward && (
                                <>
                                  <span className="mx-1.5 text-slate-600">·</span>
                                  <span className={checked ? 'text-slate-600' : 'text-[#FF2A85]'}>
                                    Belöning: {item.reward}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
