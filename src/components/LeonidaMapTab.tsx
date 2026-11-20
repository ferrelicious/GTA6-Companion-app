import {
  Car,
  Check,
  Compass,
  Crosshair,
  EyeOff,
  Flame,
  Globe,
  Layers,
  MapPin,
  Minus,
  Moon,
  Navigation,
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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent as ReactWheelEvent,
} from 'react';
import { useTranslation } from '../i18n/translations';
import { MapMarker, MapMode, MarkerCategory } from '../types';
import { LeonidaSvgMap, PLAYER_ANCHOR_PCT, SvgWaypoint } from './LeonidaSvgMap';

interface LeonidaMapTabProps {
  markers: MapMarker[];
  foundMarkerIds: string[];
  hideFound: boolean;
  onToggleHideFound: (next: boolean) => void;
  onToggleFound: (markerId: string) => void;
  onAddCustomMarker: (marker: Omit<MapMarker, 'id' | 'isCustom'>) => Promise<MapMarker>;
  onDeleteCustomMarker: (markerId: string) => Promise<void>;
}

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 900;
const MIN_ZOOM = 0.45;
const MAX_ZOOM = 6.0;

const ALL_CATEGORIES: {
  id: MarkerCategory;
  color: string;
  icon: typeof Crosshair;
}[] = [
  { id: 'Vapen', color: '#F43F5E', icon: Crosshair },
  { id: 'Gömda paket', color: '#00F0FF', icon: Package },
  { id: 'Speciella fordon', color: '#A855F7', icon: Car },
  { id: 'Affärer', color: '#10B981', icon: ShoppingBag },
  { id: 'Hemligheter', color: '#FF2A85', icon: Sparkles },
  { id: 'Hopp/Stunts', color: '#F59E0B', icon: Flame },
  { id: 'Egna markörer', color: '#E2E8F0', icon: MapPin },
];

const CATEGORY_META = Object.fromEntries(
  ALL_CATEGORIES.map((c) => [c.id, c])
) as Record<MarkerCategory, (typeof ALL_CATEGORIES)[number]>;

const DISTRICT_PRESETS: { label: string; xPct: number; yPct: number; zoom: number }[] = [
  { label: 'Vice City', xPct: 71, yPct: 46, zoom: 2.3 },
  { label: 'Vice Beach', xPct: 84, yPct: 48, zoom: 2.8 },
  { label: 'Leonida Keys', xPct: 46, yPct: 86, zoom: 1.9 },
  { label: 'Grassrivers', xPct: 47, yPct: 62, zoom: 2.0 },
  { label: 'Port Gellhorn', xPct: 18, yPct: 33, zoom: 2.6 },
  { label: 'Ambrosia', xPct: 36, yPct: 40, zoom: 2.4 },
  { label: 'Mount Kalaga', xPct: 37, yPct: 14, zoom: 2.1 },
];

export function LeonidaMapTab({
  markers,
  foundMarkerIds,
  hideFound,
  onToggleHideFound,
  onToggleFound,
  onAddCustomMarker,
  onDeleteCustomMarker,
}: LeonidaMapTabProps) {
  const { t, localizeMarker } = useTranslation();

  const [activeCategories, setActiveCategories] = useState<Set<MarkerCategory>>(
    () => new Set(ALL_CATEGORIES.map((c) => c.id))
  );
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    if (typeof window === 'undefined') return 'atlas';
    try {
      const saved = window.localStorage.getItem('leonida_map_mode_v1');
      return saved === 'satellite' || saved === 'night' ? saved : 'atlas';
    } catch {
      return 'atlas';
    }
  });
  const [waypoint, setWaypoint] = useState<SvgWaypoint | null>(null);
  const [cursorCoords, setCursorCoords] = useState<SvgWaypoint>(PLAYER_ANCHOR_PCT);

  function handleSelectMapMode(mode: MapMode) {
    setMapMode(mode);
    try {
      window.localStorage.setItem('leonida_map_mode_v1', mode);
    } catch {
      // Ignorera lagringsfel
    }
  }

  // Pan & Zoom state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [vpSize, setVpSize] = useState({ width: 900, height: 560 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);

  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    mode: 'none' | 'pan' | 'pinch';
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    moved: boolean;
    initialPinchDist: number;
    initialZoom: number;
    pinchFocalX: number;
    pinchFocalY: number;
  }>({
    mode: 'none',
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    moved: false,
    initialPinchDist: 0,
    initialZoom: 1,
    pinchFocalX: 0,
    pinchFocalY: 0,
  });

  // Custom marker placement mode
  const [isPlaceMode, setIsPlaceMode] = useState(false);
  const [draftCoords, setDraftCoords] = useState<{ x: number; y: number } | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<MarkerCategory>('Egna markörer');
  const [draftDesc, setDraftDesc] = useState('');
  const [isSavingMarker, setIsSavingMarker] = useState(false);

  const foundSet = useMemo(() => new Set(foundMarkerIds), [foundMarkerIds]);

  const localizedMarkers = useMemo(
    () => markers.map((m) => localizeMarker(m)),
    [markers, localizeMarker]
  );

  const visibleMarkers = useMemo(() => {
    return localizedMarkers.filter((m) => {
      if (!activeCategories.has(m.category)) return false;
      if (hideFound && foundSet.has(m.id)) return false;
      return true;
    });
  }, [localizedMarkers, activeCategories, hideFound, foundSet]);

  const selectedMarker = useMemo(
    () => localizedMarkers.find((m) => m.id === selectedMarkerId) ?? null,
    [localizedMarkers, selectedMarkerId]
  );

  const clampZoom = useCallback((nextZoom: number) => {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))));
  }, []);

  const resetView = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const fitZoom = clampZoom(Math.min(rect.width / STAGE_WIDTH, rect.height / STAGE_HEIGHT) * 0.96);
    const centeredX = (rect.width - STAGE_WIDTH * fitZoom) / 2;
    const centeredY = (rect.height - STAGE_HEIGHT * fitZoom) / 2;
    setVpSize({ width: rect.width, height: rect.height });
    setZoom(fitZoom);
    setPan({ x: centeredX, y: centeredY });
  }, [clampZoom]);

  useEffect(() => {
    resetView();
    const vp = viewportRef.current;
    if (!vp || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setVpSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(vp);
    return () => observer.disconnect();
  }, [resetView]);

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

  function focusOnCoordinates(xPct: number, yPct: number, targetZoom: number) {
    const vp = viewportRef.current;
    const clampedZoom = clampZoom(targetZoom);
    const width = vp ? vp.clientWidth : vpSize.width;
    const height = vp ? vp.clientHeight : vpSize.height;

    const stageX = (xPct / 100) * STAGE_WIDTH * clampedZoom;
    const stageY = (yPct / 100) * STAGE_HEIGHT * clampedZoom;

    setZoom(clampedZoom);
    setPan({
      x: width / 2 - stageX,
      y: height / 2 - stageY,
    });
  }

  function getTwoPointerMetrics() {
    const pts = Array.from(activePointers.current.values());
    const p1 = pts[0];
    const p2 = pts[1];
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const midClientX = (p1.x + p2.x) / 2;
    const midClientY = (p1.y + p2.y) / 2;
    return { dist, midClientX, midClientY };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 1) {
      gestureRef.current = {
        ...gestureRef.current,
        mode: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        originPanX: pan.x,
        originPanY: pan.y,
        moved: false,
      };
    } else if (activePointers.current.size === 2) {
      const vp = viewportRef.current;
      const vpRect = vp?.getBoundingClientRect();
      const { dist, midClientX, midClientY } = getTwoPointerMetrics();
      gestureRef.current = {
        ...gestureRef.current,
        mode: 'pinch',
        moved: true,
        initialPinchDist: Math.max(dist, 1),
        initialZoom: zoom,
        originPanX: pan.x,
        originPanY: pan.y,
        pinchFocalX: vpRect ? midClientX - vpRect.left : vpSize.width / 2,
        pinchFocalY: vpRect ? midClientY - vpRect.top : vpSize.height / 2,
      };
    }
  }

  function clientPosToMapPct(clientX: number, clientY: number): SvgWaypoint | null {
    const stage = stageRef.current;
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;
    if (xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100) return null;
    return {
      x: Number(xPercent.toFixed(1)),
      y: Number(yPercent.toFixed(1)),
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const hovered = clientPosToMapPct(e.clientX, e.clientY);
    if (hovered) {
      setCursorCoords(hovered);
    }

    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (gestureRef.current.mode === 'pinch' && activePointers.current.size >= 2) {
      const { dist } = getTwoPointerMetrics();
      const ratio = dist / gestureRef.current.initialPinchDist;
      const nextZoom = clampZoom(gestureRef.current.initialZoom * ratio);
      const scaleChange = nextZoom / gestureRef.current.initialZoom;
      const fx = gestureRef.current.pinchFocalX;
      const fy = gestureRef.current.pinchFocalY;

      setZoom(nextZoom);
      setPan({
        x: fx - (fx - gestureRef.current.originPanX) * scaleChange,
        y: fy - (fy - gestureRef.current.originPanY) * scaleChange,
      });
      return;
    }

    if (gestureRef.current.mode === 'pan' && activePointers.current.size === 1) {
      const dx = e.clientX - gestureRef.current.startX;
      const dy = e.clientY - gestureRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        gestureRef.current.moved = true;
      }
      setPan({
        x: gestureRef.current.originPanX + dx,
        y: gestureRef.current.originPanY + dy,
      });
    }
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const wasTap =
      gestureRef.current.mode === 'pan' &&
      !gestureRef.current.moved &&
      activePointers.current.size === 1;

    activePointers.current.delete(e.pointerId);
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignorera om pointer redan släppts
    }

    if (activePointers.current.size === 0) {
      gestureRef.current.mode = 'none';
      if (wasTap) {
        if (isPlaceMode) {
          openDraftAtClientPos(e.clientX, e.clientY);
        } else {
          const clicked = clientPosToMapPct(e.clientX, e.clientY);
          if (clicked) {
            setWaypoint(clicked);
          }
        }
      }
    } else if (activePointers.current.size === 1) {
      const remaining = Array.from(activePointers.current.values())[0];
      gestureRef.current = {
        ...gestureRef.current,
        mode: 'pan',
        startX: remaining.x,
        startY: remaining.y,
        originPanX: pan.x,
        originPanY: pan.y,
        moved: true,
      };
    }
  }

  function handleWheel(e: ReactWheelEvent<HTMLDivElement>) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.16 : 0.86;
    zoomAroundPoint(zoom * factor, e.clientX, e.clientY);
  }

  function handleDoubleClick(e: ReactMouseEvent<HTMLDivElement>) {
    openDraftAtClientPos(e.clientX, e.clientY);
  }

  function openDraftAtClientPos(clientX: number, clientY: number) {
    const coords = clientPosToMapPct(clientX, clientY);
    if (!coords) return;

    setDraftCoords(coords);
    setDraftCategory('Egna markörer');
    setDraftTitle('');
    setDraftDesc('');
    setIsPlaceMode(false);
  }

  function handleMinimapNavigate(e: ReactPointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    const box = minimapRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    focusOnCoordinates(nx * 100, ny * 100, zoom);
  }

  async function handleSaveCustomMarker(e: FormEvent) {
    e.preventDefault();
    if (!draftCoords || !draftTitle.trim()) return;
    setIsSavingMarker(true);
    try {
      const created = await onAddCustomMarker({
        title: draftTitle.trim(),
        category: draftCategory,
        region: t.map.customRegion,
        description: draftDesc.trim() || t.map.customDefaultDesc,
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

  const minimapRect = useMemo(() => {
    const scaledW = STAGE_WIDTH * zoom;
    const scaledH = STAGE_HEIGHT * zoom;
    const leftPct = (-pan.x / scaledW) * 100;
    const topPct = (-pan.y / scaledH) * 100;
    const widthPct = (vpSize.width / scaledW) * 100;
    const heightPct = (vpSize.height / scaledH) * 100;
    return {
      left: `${leftPct}%`,
      top: `${topPct}%`,
      width: `${widthPct}%`,
      height: `${heightPct}%`,
    };
  }, [pan, zoom, vpSize]);

  const foundCount = markers.filter((m) => foundSet.has(m.id)).length;

  const activeCoords = waypoint ?? cursorCoords;
  const worldX = Math.round((activeCoords.x - 50) * 80);
  const worldY = Math.round((50 - activeCoords.y) * 60);
  const waypointDistanceKm = waypoint
    ? Math.hypot(
        ((waypoint.x - PLAYER_ANCHOR_PCT.x) / 100) * 14.0,
        ((waypoint.y - PLAYER_ANCHOR_PCT.y) / 100) * 10.5
      ).toFixed(2)
    : null;

  return (
    <section aria-labelledby="map-heading" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#00F0FF] mb-1 font-mono tabular-nums">
            {foundCount} / {markers.length} {t.map.foundCounter}
          </p>
          <h1
            id="map-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            {t.map.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleHideFound(!hideFound)}
            aria-pressed={hideFound}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              hideFound
                ? 'bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF]'
                : 'bg-[#141720] border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <EyeOff size={14} />
            <span>{hideFound ? t.map.showingUnfound : t.map.hideFound}</span>
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
            <span>{isPlaceMode ? t.map.tapMapHint : t.map.addMarkerBtn}</span>
          </button>
        </div>
      </div>

      {/* Layer / Category Filter Chips */}
      <div
        role="group"
        aria-label={t.map.fieldCategory}
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
              <Icon size={14} style={{ color: active ? cat.color : '#64748B' }} />
              <span>{t.markerCategories[cat.id]}</span>
              <span className="font-mono tabular-nums text-[11px] text-slate-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick District Navigation */}
      <div
        aria-label={t.map.districtsLabel}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
      >
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 mr-1 shrink-0">
          <Compass size={13} className="text-[#00F0FF]" />
          <span>{t.map.districtsLabel}</span>
        </span>
        <button
          type="button"
          onClick={resetView}
          className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#141720] border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white hover:border-white/25 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {t.map.allLeonida}
        </button>
        {DISTRICT_PRESETS.map((dist) => (
          <button
            key={dist.label}
            type="button"
            onClick={() => focusOnCoordinates(dist.xPct, dist.yPct, dist.zoom)}
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#141720] border border-white/10 text-[11px] font-medium text-slate-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/40 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {dist.label}
          </button>
        ))}
      </div>

      {/* Interactive Zoom & Pan SVG Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#080C14]">
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          className={`relative w-full h-[60vh] min-h-[430px] lg:h-[68vh] overflow-hidden select-none touch-none ${
            isPlaceMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
        >
          <div
            ref={stageRef}
            style={{
              width: `${STAGE_WIDTH}px`,
              height: `${STAGE_HEIGHT}px`,
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="relative"
          >
            <LeonidaSvgMap zoom={zoom} mapMode={mapMode} waypoint={waypoint} />

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
                  aria-label={`${marker.title} (${t.markerCategories[marker.category]})${
                    isFound ? ` - ${t.map.foundSuffix}` : ''
                  }`}
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                  }}
                  className={`absolute z-10 flex items-center justify-center w-9 h-9 rounded-full transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isSelected ? 'ring-2 ring-white z-20' : ''
                  } ${isFound ? 'opacity-40' : 'opacity-100 hover:opacity-100'}`}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#080C14]/90 border-2 shadow-lg"
                    style={{ borderColor: meta.color }}
                  >
                    <Icon size={15} style={{ color: meta.color }} />
                  </span>
                  {isFound && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-[#080C14] flex items-center justify-center"
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-läges Kartväxlare i övre vänstra hörnet (Atlas / Satellit / Värmekarta & Natt) */}
        <div
          role="group"
          aria-label={t.map.mapModeAria}
          className="absolute top-3 left-3 z-20 inline-flex items-center p-1 rounded-xl leonida-glass border border-white/15 shadow-xl"
        >
          {(
            [
              { id: 'atlas', label: t.map.mapModeAtlas, icon: Layers },
              { id: 'satellite', label: t.map.mapModeSatellite, icon: Globe },
              { id: 'night', label: t.map.mapModeNight, icon: Moon },
            ] as const
          ).map((modeOpt) => {
            const Icon = modeOpt.icon;
            const active = mapMode === modeOpt.id;
            return (
              <button
                key={modeOpt.id}
                type="button"
                onClick={() => handleSelectMapMode(modeOpt.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? modeOpt.id === 'night'
                      ? 'bg-[#FF2A85]/20 text-[#FF2A85] border border-[#FF2A85]/45'
                      : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/45'
                    : 'text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={13} />
                <span className={modeOpt.id === 'night' ? 'hidden sm:inline' : ''}>
                  {modeOpt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interaktiv Minimap */}
        <div
          ref={minimapRef}
          onPointerDown={(e) => {
            e.stopPropagation();
            handleMinimapNavigate(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              handleMinimapNavigate(e);
            }
          }}
          title={t.map.minimapTitle}
          className="absolute top-3 right-3 z-20 w-28 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-[#080C14]/95 border border-white/20 shadow-xl cursor-crosshair select-none"
        >
          <LeonidaSvgMap zoom={1} isMinimap mapMode={mapMode} waypoint={waypoint} />

          <div className="absolute inset-0 pointer-events-none">
            {visibleMarkers.map((m) => {
              const meta = CATEGORY_META[m.category] ?? CATEGORY_META['Egna markörer'];
              return (
                <span
                  key={`mini-${m.id}`}
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                    backgroundColor: meta.color,
                  }}
                  className={`absolute w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    foundSet.has(m.id) ? 'opacity-30' : 'opacity-90'
                  }`}
                />
              );
            })}
          </div>

          <div
            style={minimapRect}
            className="absolute border border-[#00F0FF] bg-[#00F0FF]/15 pointer-events-none"
          />
        </div>

        {/* Pause-Menu Bottom HUD: Coordinates, Waypoint Distance & Zoom Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl leonida-glass border border-white/15 text-[11px] text-slate-200">
            <span className="font-mono tabular-nums text-[#00F0FF]">
              X:{worldX} · Y:{worldY}
            </span>

            {waypoint && waypointDistanceKm ? (
              <>
                <span aria-hidden="true" className="text-slate-600">|</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-fuchsia-300 font-mono tabular-nums">
                  <Navigation size={12} className="text-fuchsia-400" />
                  <span>
                    {t.map.waypointLabel} · {t.map.distanceLabel} {waypointDistanceKm} km
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setWaypoint(null)}
                  className="ml-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-medium text-white cursor-pointer"
                >
                  <X size={11} />
                  <span>{t.map.clearWaypoint}</span>
                </button>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-slate-600 hidden lg:inline">|</span>
                <span className="text-slate-400 hidden lg:inline">{t.map.waypointSetHint}</span>
              </>
            )}
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => zoomAroundPoint(zoom * 0.72)}
              aria-label={t.map.zoomOutAria}
              className="w-10 h-10 rounded-xl leonida-glass flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <span className="px-2.5 h-10 rounded-xl leonida-glass flex items-center justify-center font-mono text-xs tabular-nums text-slate-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomAroundPoint(zoom * 1.38)}
              aria-label={t.map.zoomInAria}
              className="w-10 h-10 rounded-xl leonida-glass flex items-center justify-center text-slate-200 hover:text-white cursor-pointer"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label={t.map.resetView}
              title={t.map.resetView}
              className="h-10 px-3 rounded-xl leonida-glass inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">{t.map.resetView}</span>
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
            <div className="sm:hidden w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5" />

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
                aria-label={t.map.closeDetailAria}
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
                    {t.markerCategories[selectedMarker.category]}
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
                    {t.common.rewardLabel}: {selectedMarker.reward}
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
                      ? t.map.markedFoundUndo
                      : t.map.markFound}
                  </span>
                </button>

                {selectedMarker.isCustom && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onDeleteCustomMarker(selectedMarker.id);
                      setSelectedMarkerId(null);
                    }}
                    aria-label={t.map.deleteCustomAria}
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
                  {t.map.newMarkerTitle}
                </h2>
                <p className="text-xs font-mono tabular-nums text-slate-400">
                  {t.map.coordinatesLabel}: {draftCoords.x}%, {draftCoords.y}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraftCoords(null)}
                aria-label={t.common.cancel}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomMarker} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.map.fieldName}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder={t.map.fieldNamePlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.map.fieldCategory}
                </label>
                <select
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as MarkerCategory)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t.markerCategories[c.id]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.map.fieldNotes}
                </label>
                <textarea
                  rows={2}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  placeholder={t.map.fieldNotesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F14] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDraftCoords(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSavingMarker}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] text-sm font-semibold text-white cursor-pointer"
                >
                  {isSavingMarker ? t.common.saving : t.map.saveMarkerBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
