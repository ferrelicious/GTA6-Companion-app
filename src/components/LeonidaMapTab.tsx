import {
  Car,
  Check,
  Crosshair,
  EyeOff,
  Flame,
  MapPin,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
  WheelEvent as ReactWheelEvent,
} from 'react';
import { LEONIDA_MAP_IMAGE } from '../data/markers';
import { MapMarker, MarkerCategory } from '../types';

interface LeonidaMapTabProps {
  markers: MapMarker[];
  foundMarkerIds: string[];
  onToggleFound: (markerId: string) => void;
  onAddCustomMarker: (marker: Omit<MapMarker, 'id' | 'isCustom'>) => Promise<MapMarker>;
  onDeleteCustomMarker: (markerId: string) => Promise<void>;
}

const ALL_CATEGORIES: {
  id: MarkerCategory;
  color: string;
  bgClass: string;
  icon: typeof Crosshair;
}[] = [
  { id: 'Vapen', color: '#F43F5E', bgClass: 'bg-rose-500', icon: Crosshair },
  { id: 'Gömda paket', color: '#00F0FF', bgClass: 'bg-[#00F0FF]', icon: Package },
  { id: 'Speciella fordon', color: '#A855F7', bgClass: 'bg-purple-500', icon: Car },
  { id: 'Affärer', color: '#10B981', bgClass: 'bg-emerald-500', icon: ShoppingBag },
  { id: 'Hemligheter', color: '#FF2A85', bgClass: 'bg-[#FF2A85]', icon: Sparkles },
  { id: 'Hopp/Stunts', color: '#F59E0B', bgClass: 'bg-amber-500', icon: Flame },
  { id: 'Egna markörer', color: '#E2E8F0', bgClass: 'bg-slate-200', icon: MapPin },
];

const CATEGORY_META = Object.fromEntries(
  ALL_CATEGORIES.map((c) => [c.id, c])
) as Record<MarkerCategory, (typeof ALL_CATEGORIES)[number]>;

export function LeonidaMapTab({
  markers,
  foundMarkerIds,
  onToggleFound,
  onAddCustomMarker,
  onDeleteCustomMarker,
}: LeonidaMapTabProps) {
  const [activeCategories, setActiveCategories] = useState<Set<MarkerCategory>>(
    () => new Set(ALL_CATEGORIES.map((c) => c.id))
  );
  const [hideFound, setHideFound] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1.15);
  const [pan, setPan] = useState({ x: -30, y: -20 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  }>({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });

  // Custom marker placement mode
  const [isPlaceMode, setIsPlaceMode] = useState(false);
  const [draftCoords, setDraftCoords] = useState<{ x: number; y: number } | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<MarkerCategory>('Egna markörer');
  const [draftDesc, setDraftDesc] = useState('');
  const [isSavingMarker, setIsSavingMarker] = useState(false);

  const foundSet = useMemo(() => new Set(foundMarkerIds), [foundMarkerIds]);

  const visibleMarkers = useMemo(() => {
    return markers.filter((m) => {
      if (!activeCategories.has(m.category)) return false;
      if (hideFound && foundSet.has(m.id)) return false;
      return true;
    });
  }, [markers, activeCategories, hideFound, foundSet]);

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId]
  );

  function toggleCategory(category: MarkerCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function clampZoom(nextZoom: number) {
    return Math.min(3.5, Math.max(0.85, Number(nextZoom.toFixed(2))));
  }

  function zoomAroundPoint(nextZoomRaw: number, clientX?: number, clientY?: number) {
    const vp = viewportRef.current;
    const nextZoom = clampZoom(nextZoomRaw);
    if (!vp) {
      setZoom(nextZoom);
      return;
    }

    const vpRect = vp.getBoundingClientRect();
    const focalX = clientX !== undefined ? clientX - vpRect.left : vpRect.width / 2;
    const focalY = clientY !== undefined ? clientY - vpRect.top : vpRect.height / 2;

    const scaleRatio = nextZoom / zoom;
    const nextPanX = focalX - (focalX - pan.x) * scaleRatio;
    const nextPanY = focalY - (focalY - pan.y) * scaleRatio;

    setZoom(nextZoom);
    setPan({ x: nextPanX, y: nextPanY });
  }

  function resetView() {
    setZoom(1.1);
    setPan({ x: -20, y: -15 });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current.isDragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragState.current.moved = true;
    }
    setPan({
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    });
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer already released
    }

    if (!dragState.current.moved && isPlaceMode) {
      openDraftAtClientPos(e.clientX, e.clientY);
    }
  }

  function handleWheel(e: ReactWheelEvent<HTMLDivElement>) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    zoomAroundPoint(zoom * factor, e.clientX, e.clientY);
  }

  function handleDoubleClick(e: ReactMouseEvent<HTMLDivElement>) {
    openDraftAtClientPos(e.clientX, e.clientY);
  }

  function openDraftAtClientPos(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;

    if (xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100) return;

    setDraftCoords({
      x: Number(xPercent.toFixed(1)),
      y: Number(yPercent.toFixed(1)),
    });
    setDraftCategory('Egna markörer');
    setDraftTitle('');
    setDraftDesc('');
    setIsPlaceMode(false);
  }

  async function handleSaveCustomMarker(e: FormEvent) {
    e.preventDefault();
    if (!draftCoords || !draftTitle.trim()) return;
    setIsSavingMarker(true);
    try {
      const created = await onAddCustomMarker({
        title: draftTitle.trim(),
        category: draftCategory,
        region: 'Egen platsmarkering',
        description:
          draftDesc.trim() || 'Personlig markör tillagd på Leonida-kartan.',
        x: draftCoords.x,
        y: draftCoords.y,
      });
      setActiveCategories((prev) => new Set([...prev, created.category]));
      setDraftCoords(null);
      setSelectedMarkerId(created.id);
    } finally {
      setIsSavingMarker(false);
    }
  }

  const foundCount = markers.filter((m) => foundSet.has(m.id)).length;

  return (
    <section aria-labelledby="map-heading" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#00F0FF] mb-1 font-mono tabular-nums">
            {foundCount} / {markers.length} platser hittade
          </p>
          <h1
            id="map-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Interaktiv Karta: Leonida & Vice City
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHideFound((v) => !v)}
            aria-pressed={hideFound}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              hideFound
                ? 'bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF]'
                : 'bg-[#141720] border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <EyeOff size={14} />
            <span>{hideFound ? 'Visar endast ohittade' : 'Dölj hittade'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaceMode((v) => !v)}
            aria-pressed={isPlaceMode}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isPlaceMode
                ? 'bg-[#FF2A85] border-[#FF2A85] text-white'
                : 'bg-[#141720] border-white/10 text-slate-200 hover:border-[#FF2A85]/50'
            }`}
          >
            <MapPin size={14} />
            <span>{isPlaceMode ? 'Tryck på kartan...' : 'Lägg till markör'}</span>
          </button>
        </div>
      </div>

      {/* Layer / Category Filter Chips */}
      <div
        role="group"
        aria-label="Kartlager"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {ALL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategories.has(cat.id);
          const count = markers.filter((m) => m.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#181C27] border-white/20 text-white'
                  : 'bg-[#0D0F14] border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon
                size={14}
                style={{ color: active ? cat.color : '#64748B' }}
              />
              <span>{cat.id}</span>
              <span className="font-mono tabular-nums text-[11px] text-slate-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Zoom & Pan Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#080A0E]">
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          className={`relative w-full h-[58vh] min-h-[420px] lg:h-[65vh] overflow-hidden select-none touch-none ${
            isPlaceMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
        >
          {/* Transformed Stage */}
          <div
            ref={stageRef}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="relative w-[920px] sm:w-[1150px] aspect-[4/3]"
          >
            <img
              src={LEONIDA_MAP_IMAGE}
              alt="Taktisk karta över Leonida och Vice City"
              draggable={false}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Subtle Region Labels on Map */}
            <div className="pointer-events-none absolute inset-0 text-[11px] font-display font-semibold tracking-wider text-slate-300/60 select-none">
              <span className="absolute left-[18%] top-[23%]">Port Gellhorn</span>
              <span className="absolute left-[49%] top-[12%]">Lake Leonida</span>
              <span className="absolute left-[45%] top-[59%]">Grassrivers</span>
              <span className="absolute left-[66%] top-[48%]">Downtown Vice</span>
              <span className="absolute left-[82%] top-[44%]">Vice Beach</span>
              <span className="absolute left-[43%] top-[89%]">Leonida Keys</span>
            </div>

            {/* Interactive Markers */}
            {visibleMarkers.map((marker) => {
              const meta = CATEGORY_META[marker.category] ?? CATEGORY_META['Egna markörer'];
              const Icon = meta.icon;
              const isFound = foundSet.has(marker.id);
              const isSelected = selectedMarkerId === marker.id;

              return (
                <button
                  key={marker.id}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarkerId(marker.id);
                  }}
                  aria-label={`${marker.title} (${marker.category})${isFound ? ' - Hittad' : ''}`}
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                  }}
                  className={`absolute z-10 flex items-center justify-center w-9 h-9 rounded-full border transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isSelected
                      ? 'ring-2 ring-white scale-110 z-20'
                      : ''
                  } ${isFound ? 'opacity-40' : 'opacity-100 hover:opacity-100'}`}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14]/90 border-2 shadow-lg"
                    style={{ borderColor: meta.color }}
                  >
                    <Icon size={15} style={{ color: meta.color }} />
                  </span>
                  {isFound && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-[#0D0F14] flex items-center justify-center"
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Controls Overlay (Zoom + Reset + Hint) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
          <div className="pointer-events-auto px-3 py-1.5 rounded-xl leonida-glass text-[11px] text-slate-300 hidden sm:block">
            Dra för att panorera · Scrolla för att zooma · Dubbelklicka för egen markör
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => zoomAroundPoint(zoom - 0.3)}
              aria-label="Zooma ut"
              className="w-10 h-10 rounded-xl leonida-glass flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <span className="px-2.5 h-10 rounded-xl leonida-glass flex items-center justify-center font-mono text-xs tabular-nums text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomAroundPoint(zoom + 0.3)}
              aria-label="Zooma in"
              className="w-10 h-10 rounded-xl leonida-glass flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="Återställ kartvy"
              className="w-10 h-10 rounded-xl leonida-glass flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Marker Bottom-Sheet / Popup */}
      {selectedMarker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="marker-detail-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setSelectedMarkerId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141720] border border-white/15 overflow-hidden shadow-2xl"
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5" />

            {/* Location Image / Placeholder */}
            <div className="relative h-44 w-full bg-[#0D0F14] overflow-hidden">
              {selectedMarker.imageUrl && !failedImageIds.has(selectedMarker.id) ? (
                <img
                  src={selectedMarker.imageUrl}
                  alt={selectedMarker.title}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImageIds((prev) => new Set([...prev, selectedMarker.id]))
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#181C27] via-[#0D0F14] to-[#1E1326] flex flex-col items-center justify-center gap-2 text-slate-400">
                  <MapPin size={28} className="text-[#00F0FF]" />
                  <span className="text-xs font-medium">{selectedMarker.region}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141720] via-transparent to-black/30" />
              <button
                type="button"
                onClick={() => setSelectedMarkerId(null)}
                aria-label="Stäng markördetaljer"
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        CATEGORY_META[selectedMarker.category]?.color ?? '#00F0FF',
                    }}
                  >
                    {selectedMarker.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedMarker.region}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {selectedMarker.x}%, {selectedMarker.y}%
                  </span>
                </div>
                <h2
                  id="marker-detail-title"
                  className="font-display text-xl font-bold text-white"
                >
                  {selectedMarker.title}
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {selectedMarker.description}
                </p>
                {selectedMarker.reward && (
                  <p className="text-xs text-[#00F0FF] mt-2 font-medium">
                    Belöning: {selectedMarker.reward}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onToggleFound(selectedMarker.id)}
                  className={`flex-1 min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    foundSet.has(selectedMarker.id)
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-[#00F0FF] text-[#0D0F14] hover:bg-[#33f3ff]'
                  }`}
                >
                  <Check size={17} strokeWidth={2.5} />
                  <span>
                    {foundSet.has(selectedMarker.id)
                      ? 'Markerad som hittad (ångra)'
                      : 'Markera som hittad'}
                  </span>
                </button>

                {selectedMarker.isCustom && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onDeleteCustomMarker(selectedMarker.id);
                      setSelectedMarkerId(null);
                    }}
                    aria-label="Ta bort egen markör"
                    className="min-h-[46px] min-w-[46px] px-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Marker Modal */}
      {draftCoords && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-marker-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4"
        >
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141720] border border-white/15 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h2 id="add-marker-title" className="font-display text-lg font-bold text-white">
                  Ny egen markör
                </h2>
                <p className="text-xs font-mono tabular-nums text-slate-400">
                  Koordinater: {draftCoords.x}%, {draftCoords.y}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraftCoords(null)}
                aria-label="Avbryt"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomMarker} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Namn på plats *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="t.ex. Hemligt garage bakom klubben"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as MarkerCategory)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Anteckning
                </label>
                <textarea
                  rows={2}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  placeholder="Valfri beskrivning eller påminnelse..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDraftCoords(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={isSavingMarker}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] text-sm font-semibold text-white cursor-pointer"
                >
                  {isSavingMarker ? 'Sparar...' : 'Spara markör'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
