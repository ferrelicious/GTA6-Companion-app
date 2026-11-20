import { MapMode } from '../types';

export interface SvgWaypoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export const PLAYER_ANCHOR_PCT: SvgWaypoint = { x: 71.0, y: 48.0 };

interface LeonidaSvgMapProps {
  /** Nuvarande zoomnivå för att dynamiskt visa finare gatunät & etiketter vid inzoomning */
  zoom: number;
  /** Förenklad version utan textetiketter för minimapen */
  isMinimap?: boolean;
  /** Aktuellt kartläge: Atlas, Satellit eller Värmekarta/Natt */
  mapMode?: MapMode;
  /** Aktiv GPS-waypoint från pausmenyn */
  waypoint?: SvgWaypoint | null;
}

export function LeonidaSvgMap({
  zoom,
  isMinimap = false,
  mapMode = 'atlas',
  waypoint = null,
}: LeonidaSvgMapProps) {
  const showStreetDetail = !isMinimap && zoom >= 1.45;
  const showMicroDetail = !isMinimap && zoom >= 2.2;

  const isSatellite = mapMode === 'satellite';
  const isNight = mapMode === 'night';

  // Färgteman per kartläge
  const landBase = isSatellite ? '#1C2B20' : isNight ? '#0B0F18' : '#161C28';
  const landSecondary = isSatellite ? '#223325' : isNight ? '#0F1522' : '#1B2334';
  const waterInner = isSatellite ? '#061529' : isNight ? '#04070D' : '#09111E';
  const coastStroke = isSatellite ? '#2DD4BF' : isNight ? '#00F0FF' : '#00F0FF';
  const coastOpacity = isSatellite ? 0.55 : isNight ? 0.85 : 0.6;
  const highwayCasing = isNight ? '#1E1B4B' : '#0F172A';
  const highwayCore = isNight ? '#FF2A85' : isSatellite ? '#FBBF24' : '#F59E0B';
  const arterialColor = isNight ? '#38BDF8' : isSatellite ? '#F1F5F9' : '#E2E8F0';
  const trailColor = isSatellite ? '#B48A5A' : isNight ? '#64748B' : '#94A3B8';

  const playerX = (PLAYER_ANCHOR_PCT.x / 100) * 1600;
  const playerY = (PLAYER_ANCHOR_PCT.y / 100) * 1200;
  const wpX = waypoint ? (waypoint.x / 100) * 1600 : null;
  const wpY = waypoint ? (waypoint.y / 100) * 1200 : null;

  return (
    <svg
      viewBox="0 0 1600 1200"
      className={`w-full h-full block select-none pointer-events-none transition-[filter] duration-300 ${
        isNight
          ? 'brightness-[0.95] contrast-[1.24] saturate-[1.28]'
          : isSatellite
            ? 'brightness-[1.05] contrast-[1.06] saturate-[1.12]'
            : 'brightness-[1.04] contrast-[1.04]'
      }`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Havsgradient per kartläge */}
        <radialGradient id="leonida-ocean-grad" cx="52%" cy="50%" r="72%">
          <stop offset="0%" stopColor={isSatellite ? '#0A223D' : isNight ? '#060A13' : '#0C1524'} />
          <stop offset="55%" stopColor={isSatellite ? '#061529' : isNight ? '#04060B' : '#080C14'} />
          <stop offset="100%" stopColor={isSatellite ? '#030B17' : '#030509'} />
        </radialGradient>

        {/* Landmassa gradient */}
        <linearGradient id="leonida-land-grad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={isSatellite ? '#233322' : isNight ? '#0E1320' : '#1B2334'} />
          <stop offset="52%" stopColor={landBase} />
          <stop offset="100%" stopColor={isSatellite ? '#18261D' : isNight ? '#080B12' : '#121824'} />
        </linearGradient>

        {/* Grassrivers träskgradient */}
        <radialGradient id="grassrivers-grad" cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor={isSatellite ? '#122E21' : isNight ? '#09151C' : '#122227'} />
          <stop offset="100%" stopColor={landBase} stopOpacity="0" />
        </radialGradient>

        {/* Satellit-textur för träsk & jordbruksmarker */}
        <pattern id="marsh-texture" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="8" r="1.4" fill="#2E543E" fillOpacity="0.45" />
          <circle cx="19" cy="18" r="1.8" fill="#1E3F30" fillOpacity="0.55" />
          <path d="M 10 22 Q 14 19 18 22" stroke="#366248" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        </pattern>

        {/* Jordbruksrutor runt Lake Leonida */}
        <pattern id="farm-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect
            x="2"
            y="2"
            width="15"
            height="14"
            fill={isSatellite ? '#2E3B21' : '#1A2333'}
            fillOpacity={isSatellite ? '0.65' : '0.45'}
          />
          <rect
            x="19"
            y="2"
            width="15"
            height="14"
            fill={isSatellite ? '#24341E' : '#17202E'}
            fillOpacity={isSatellite ? '0.6' : '0.4'}
          />
          <rect
            x="2"
            y="19"
            width="15"
            height="15"
            fill={isSatellite ? '#343D22' : '#1D2738'}
            fillOpacity={isSatellite ? '0.55' : '0.35'}
          />
          <rect
            x="19"
            y="19"
            width="15"
            height="15"
            fill={isSatellite ? '#22311D' : '#151D2B'}
            fillOpacity={isSatellite ? '0.65' : '0.4'}
          />
        </pattern>

        {/* Värmekarta / Natt-zoner (Neon urban activity heat glow) */}
        <radialGradient id="heat-pink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF2A85" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#D946EF" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#FF2A85" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat-cyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#0284C7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>

        {/* Turkos grundvatten-aura för Satellitläge */}
        <filter id="shallow-reef-blur" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        {/* Kustlinjeglöd */}
        <filter id="cyan-coast-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Motorvägsglöd */}
        <filter id="highway-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Taktiskt koordinatnät */}
        <pattern id="tactical-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke={isSatellite ? '#94A3B8' : '#00F0FF'}
            strokeOpacity={isNight ? '0.07' : '0.045'}
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* 1. HAVSBAKGRUND & BATYMETRI / GRUNDA KUSTVATTEN */}
      <rect width="1600" height="1200" fill="url(#leonida-ocean-grad)" />
      {!isMinimap && <rect width="1600" height="1200" fill="url(#tactical-grid)" />}

      {/* Turkosa grunda kustområden (extra tydliga i Satellitläge) */}
      <g
        filter={isMinimap ? undefined : 'url(#shallow-reef-blur)'}
        opacity={isSatellite ? 0.65 : isNight ? 0.14 : 0.22}
      >
        {/* Vice Beach & Vice Bay rev */}
        <ellipse cx="1310" cy="520" rx="125" ry="260" fill="#0D9488" />
        {/* Leonida Keys korallrev */}
        <path
          d="M 1060 910 C 900 985, 680 1055, 360 1100"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="75"
          strokeLinecap="round"
        />
        {/* Port Gellhorn kustlagun */}
        <ellipse cx="215" cy="410" rx="85" ry="125" fill="#0F766E" />
      </g>

      {/* Batymetriska djupkonturer */}
      {!isMinimap && (
        <g
          fill="none"
          stroke={isSatellite ? '#2DD4BF' : '#00F0FF'}
          strokeOpacity={isSatellite ? '0.12' : '0.065'}
          strokeWidth="1.1"
          strokeDasharray="6 6"
        >
          <path d="M 110 250 Q 155 430 245 575 T 455 815 T 935 975 T 1460 715 T 1465 190" />
          <path d="M 60 320 Q 115 510 215 660 T 435 905 T 985 1045 T 1525 765 T 1530 130" />
        </g>
      )}

      {/* 2. LEONIDA HUVUDHALVÖ (SÖDRA FLORIDA-GEOGRAFI) */}
      <g filter={isMinimap ? undefined : 'url(#cyan-coast-glow)'}>
        {/* Huvudhalvö: Mount Kalaga -> Port Gellhorn -> Grassrivers -> Vice City */}
        <path
          d="
            M 155 55
            L 1150 55
            C 1168 118, 1192 182, 1212 252
            C 1228 312, 1242 368, 1230 416
            L 1208 442
            L 1228 468
            C 1236 512, 1218 558, 1204 602
            L 1188 656
            L 1158 688
            C 1126 720, 1088 776, 1048 818
            C 996 862, 922 898, 855 918
            C 778 938, 706 922, 640 892
            C 574 865, 528 836, 482 778
            C 442 732, 415 680, 390 638
            C 360 592, 310 568, 286 520
            C 272 490, 294 452, 282 426
            L 246 402
            C 214 418, 196 456, 224 494
            C 198 506, 174 476, 164 438
            C 148 382, 172 332, 188 288
            C 198 242, 164 176, 155 118
            Z
          "
          fill="url(#leonida-land-grad)"
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Vice Beach & South Beach / Ocean Drive (Östra barriäröarna) */}
        <path
          d="
            M 1310 292
            C 1346 288, 1376 318, 1382 374
            C 1388 442, 1392 522, 1378 588
            C 1368 642, 1352 698, 1328 732
            C 1308 734, 1296 706, 1302 658
            C 1308 592, 1316 508, 1306 428
            C 1298 368, 1290 318, 1310 292
            Z
          "
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity + 0.1}
          strokeWidth="2.2"
        />

        {/* Norra barriärö (North Vice Beach) */}
        <path
          d="M 1272 195 C 1300 190, 1324 222, 1325 270 C 1326 286, 1305 292, 1296 274 C 1290 245, 1278 216, 1272 195 Z"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="1.8"
        />

        {/* Starfish Island & Prawn Island i Vice Bay */}
        <ellipse
          cx="1262"
          cy="545"
          rx="27"
          ry="15"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="1.6"
        />
        <ellipse
          cx="1265"
          cy="442"
          rx="20"
          ry="13"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="1.5"
        />

        {/* Vice Port (Hamnön / Dodge Island) */}
        <path
          d="M 1190 618 L 1280 622 L 1286 658 L 1205 662 L 1184 642 Z"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="1.8"
        />

        {/* Key Biscayne / Södra Vice-ön */}
        <path
          d="M 1275 746 C 1306 746, 1326 786, 1312 838 C 1302 868, 1275 870, 1265 844 C 1255 812, 1260 766, 1275 746 Z"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity}
          strokeWidth="1.8"
        />

        {/* Port Gellhorn kustbarriäröar i väst */}
        <path
          d="M 142 355 C 154 348, 168 375, 166 418 C 164 446, 148 455, 142 430 Z"
          fill={landSecondary}
          stroke={coastStroke}
          strokeOpacity={coastOpacity * 0.9}
          strokeWidth="1.5"
        />

        {/* LEONIDA KEYS (Båge av korallöar söderut mot Sunset Key) */}
        <path d="M 992 904 C 1038 894, 1070 920, 1054 946 C 1032 962, 994 950, 984 926 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity} strokeWidth="1.8" />
        <path d="M 885 954 C 932 944, 966 964, 954 986 C 928 996, 892 988, 880 968 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity} strokeWidth="1.8" />
        <path d="M 760 992 C 808 982, 846 998, 835 1018 C 808 1028, 768 1020, 755 1004 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity} strokeWidth="1.8" />
        <path d="M 615 1024 C 668 1012, 706 1025, 695 1046 C 662 1056, 622 1048, 608 1036 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity} strokeWidth="1.8" />
        <path d="M 480 1052 C 535 1040, 568 1054, 558 1072 C 525 1082, 486 1074, 474 1062 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity} strokeWidth="1.8" />
        <path d="M 338 1075 C 398 1060, 436 1076, 422 1098 C 388 1112, 344 1100, 332 1086 Z" fill={landSecondary} stroke={coastStroke} strokeOpacity={coastOpacity + 0.05} strokeWidth="2" />
      </g>

      {/* 3. TOPOGRAFI, JORDBRUK & VÅTMARKER */}

      {/* Jordbruksfält & odlingsrutor runt Lake Leonida & Ambrosia */}
      <g opacity={isSatellite ? 0.9 : isNight ? 0.25 : 0.65}>
        <path
          d="M 490 365 L 650 365 L 642 485 L 745 485 L 745 555 L 490 555 Z"
          fill="url(#farm-grid)"
        />
        <path
          d="M 855 315 L 985 315 L 985 465 L 850 465 Z"
          fill="url(#farm-grid)"
        />
      </g>

      {/* Mount Kalaga (Kuperade norra berg & topografiska höjdlinjer) */}
      <g opacity={isNight ? 0.72 : 0.9}>
        <path
          d="M 265 155 Q 380 82 520 112 T 825 104 T 1025 170 Q 940 245 780 230 T 480 235 Q 330 225 265 155 Z"
          fill={isSatellite ? '#253823' : isNight ? '#111829' : '#1B2435'}
          stroke={isSatellite ? '#4A6B45' : '#2E3B55'}
          strokeWidth="1.5"
        />
        <path
          d="M 335 160 Q 435 110 545 135 T 765 130 T 915 170 Q 845 215 725 205 T 490 210 Q 385 205 335 160 Z"
          fill={isSatellite ? '#2D432A' : isNight ? '#162036' : '#212C40'}
          stroke={isSatellite ? '#5A8254' : '#3C4D6E'}
          strokeWidth="1.3"
        />
        <path
          d="M 425 162 Q 505 130 595 148 T 745 155 Q 705 190 615 186 T 455 185 Z"
          fill={isSatellite ? '#385234' : isNight ? '#1D2945' : '#283650'}
          stroke={isSatellite ? '#74A36C' : '#4E638C'}
          strokeWidth="1.2"
        />
        <path
          d="M 510 162 Q 575 142 645 156 Q 630 176 565 174 Z"
          fill={isSatellite ? '#466441' : isNight ? '#263557' : '#314260'}
          stroke={isSatellite ? '#8EC285' : '#647CA8'}
          strokeWidth="1"
        />

        {/* Kalaga-floden från bergen ner mot Port Gellhorn */}
        <path
          d="M 480 150 C 445 210, 390 250, 330 295 C 290 325, 255 370, 245 415"
          fill="none"
          stroke={waterInner}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 480 150 C 445 210, 390 250, 330 295 C 290 325, 255 370, 245 415"
          fill="none"
          stroke={coastStroke}
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Lake Leonida (Stor central insjö) */}
      <g>
        <path
          d="
            M 665 305
            C 722 276, 826 286, 856 338
            C 884 386, 845 454, 775 464
            C 705 474, 650 432, 642 382
            C 636 348, 645 318, 665 305
            Z
          "
          fill={waterInner}
          stroke={coastStroke}
          strokeOpacity="0.65"
          strokeWidth="2.1"
        />
        {/* Ö i Lake Leonida & utloppskanaler */}
        <circle
          cx="775"
          cy="365"
          r="11"
          fill={landBase}
          stroke={coastStroke}
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <path
          d="M 760 464 C 765 530, 742 605, 725 695"
          fill="none"
          stroke={waterInner}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 852 382 C 920 392, 990 395, 1050 412"
          fill="none"
          stroke={waterInner}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Grassrivers (Vidsträckta träskmarker, öar & slingrande kanaler) */}
      <g>
        <ellipse cx="730" cy="735" rx="240" ry="140" fill="url(#grassrivers-grad)" />
        {isSatellite && (
          <ellipse cx="730" cy="735" rx="215" ry="120" fill="url(#marsh-texture)" opacity="0.85" />
        )}
        <path
          d="M 530 692 C 595 674, 655 712, 725 695 C 795 680, 865 705, 922 756"
          fill="none"
          stroke={waterInner}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M 578 762 C 655 745, 720 796, 800 775 C 865 760, 915 805, 956 836"
          fill="none"
          stroke={waterInner}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M 650 645 C 675 705, 655 765, 686 840"
          fill="none"
          stroke={waterInner}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <g fill={waterInner} stroke={coastStroke} strokeOpacity="0.28" strokeWidth="1.1">
          <ellipse cx="615" cy="725" rx="26" ry="13" />
          <ellipse cx="755" cy="740" rx="35" ry="16" />
          <ellipse cx="845" cy="790" rx="28" ry="14" />
          <ellipse cx="705" cy="825" rx="23" ry="11" />
        </g>
      </g>

      {/* VÄRMEKARTA / NATT AKTIVITETSZONER */}
      {isNight && !isMinimap && (
        <g pointerEvents="none">
          <circle cx="1115" cy="495" r="135" fill="url(#heat-pink)" />
          <circle cx="1340" cy="510" r="115" fill="url(#heat-cyan)" />
          <circle cx="1105" cy="365" r="85" fill="url(#heat-pink)" opacity="0.7" />
          <circle cx="1010" cy="685" r="95" fill="url(#heat-cyan)" opacity="0.65" />
          <circle cx="285" cy="390" r="95" fill="url(#heat-pink)" opacity="0.7" />
          <circle cx="575" cy="475" r="75" fill="url(#heat-cyan)" opacity="0.55" />
        </g>
      )}

      {/* 4. STADSDISTRIKT, GATURUTNÄT & BYGGNADSKVARTER (LOD) */}

      {/* Vice City International Airport (VCIA) */}
      <g transform="translate(955, 650)">
        <polygon
          points="0,20 96,0 122,68 20,92"
          fill={isSatellite ? '#263029' : '#1B2232'}
          stroke="#475569"
          strokeWidth="1.5"
        />
        <line x1="12" y1="35" x2="104" y2="18" stroke="#94A3B8" strokeWidth="4.2" />
        <line x1="25" y1="70" x2="110" y2="48" stroke="#94A3B8" strokeWidth="3.8" />
        <line x1="55" y1="12" x2="72" y2="75" stroke="#64748B" strokeWidth="3" />
      </g>

      {/* Port Gellhorn Airfield */}
      <g transform="translate(295, 290)">
        <polygon points="0,12 48,0 56,28 8,40" fill={isSatellite ? '#252F27' : '#1B2232'} stroke="#475569" strokeWidth="1" />
        <line x1="8" y1="24" x2="48" y2="12" stroke="#94A3B8" strokeWidth="2.8" />
      </g>

      {/* Downtown Vice City, Wynwood & Little Cuba gatunät (tätare vid zoom) */}
      <g
        stroke={isNight ? '#334155' : isSatellite ? '#64748B' : '#334155'}
        strokeOpacity={showStreetDetail ? 0.85 : 0.45}
        strokeWidth={showStreetDetail ? '1.3' : '0.9'}
      >
        {[1045, 1065, 1085, 1105, 1125, 1145, 1165, 1185].map((x) => (
          <line key={`vc-v-${x}`} x1={x} y1="335" x2={x} y2="615" />
        ))}
        {[350, 370, 390, 410, 435, 455, 475, 495, 515, 535, 555, 575, 595].map((y) => (
          <line key={`vc-h-${y}`} x1="1005" y1={y} x2="1202" y2={y} />
        ))}
        {/* Extra mikro-gator & kvarter vid hög zoom */}
        {showStreetDetail && (
          <g strokeOpacity="0.6" strokeWidth="0.85">
            {[1055, 1075, 1095, 1115, 1135, 1155, 1175].map((x) => (
              <line key={`vc-sub-v-${x}`} x1={x} y1="425" x2={x} y2="605" />
            ))}
            {[445, 465, 485, 505, 525, 545, 565, 585].map((y) => (
              <line key={`vc-sub-h-${y}`} x1="1025" y1={y} x2="1196" y2={y} />
            ))}
          </g>
        )}
        {showStreetDetail && (
          <g fill={isNight ? '#1E293B' : '#243046'} stroke="#475569" strokeWidth="0.9">
            <rect x="1109" y="479" width="14" height="14" rx="1" />
            <rect x="1129" y="479" width="12" height="16" rx="1" />
            <rect x="1149" y="499" width="14" height="14" rx="1" />
            <rect x="1109" y="519" width="16" height="12" rx="1" />
            <rect x="1131" y="537" width="14" height="14" rx="1" />
            <rect x="1089" y="499" width="12" height="12" rx="1" />
            <rect x="1089" y="538" width="14" height="14" rx="1" />
          </g>
        )}
      </g>

      {/* Vice Beach & South Beach gatunät */}
      <g
        stroke={isNight ? '#334155' : '#475569'}
        strokeOpacity={showStreetDetail ? 0.85 : 0.45}
        strokeWidth={showStreetDetail ? '1.2' : '0.8'}
      >
        {[335, 360, 385, 410, 435, 460, 485, 510, 535, 560, 585, 610, 635, 660].map((y) => (
          <line key={`vb-h-${y}`} x1="1312" y1={y} x2="1372" y2={y} />
        ))}
        <line x1="1330" y1="318" x2="1330" y2="692" />
        <line x1="1348" y1="322" x2="1348" y2="682" />
        {/* Ocean Drive Neon-strandpromenad */}
        <path
          d="M 1364 460 C 1368 530, 1360 612, 1338 692"
          fill="none"
          stroke="#FF2A85"
          strokeOpacity={isNight ? '0.95' : '0.85'}
          strokeWidth="3"
        />
      </g>

      {/* Port Gellhorn gatunät & hamnpirar */}
      <g stroke="#475569" strokeOpacity={showStreetDetail ? 0.85 : 0.5} strokeWidth="1">
        {[255, 275, 295, 315, 335].map((x) => (
          <line key={`pg-v-${x}`} x1={x} y1="340" x2={x} y2="452" />
        ))}
        {[350, 370, 390, 410, 430].map((y) => (
          <line key={`pg-h-${y}`} x1="240" y1={y} x2="352" y2={y} />
        ))}
        {showStreetDetail && (
          <g strokeOpacity="0.55" strokeWidth="0.75">
            {[265, 285, 305, 325].map((x) => (
              <line key={`pg-sv-${x}`} x1={x} y1="345" x2={x} y2="446" />
            ))}
            {[360, 380, 400, 420].map((y) => (
              <line key={`pg-sh-${y}`} x1="245" y1={y} x2="346" y2={y} />
            ))}
          </g>
        )}
        <rect x="208" y="380" width="26" height="8" fill="#273247" stroke="#64748B" />
        <rect x="206" y="396" width="28" height="8" fill="#273247" stroke="#64748B" />
        <rect x="210" y="412" width="24" height="8" fill="#273247" stroke="#64748B" />
      </g>

      {/* Ambrosia industrikomplex */}
      <g fill={isSatellite ? '#2F362E' : '#222B3D'} stroke="#475569" strokeWidth="1">
        <rect x="530" y="448" width="32" height="18" rx="2" />
        <rect x="570" y="445" width="24" height="22" rx="2" />
        <rect x="535" y="476" width="44" height="16" rx="2" />
        <circle cx="606" cy="482" r="7" />
        <circle cx="624" cy="482" r="7" />
        <circle cx="606" cy="500" r="7" />
      </g>

      {/* 5. VÄG-HIERARKI: GRUSVÄGAR, VITA HUVUDLEDER & DUBBLA MOTORVÄGAR */}

      {/* A. Streckade grusvägar / stigar i Grassrivers & Mount Kalaga */}
      <g fill="none" stroke={trailColor} strokeOpacity="0.58" strokeWidth="1.7" strokeDasharray="5 5" strokeLinecap="round">
        {/* Träskstigar i Grassrivers */}
        <path d="M 555 660 C 600 715, 650 755, 745 738 C 820 725, 875 785, 920 825" />
        <path d="M 675 565 C 695 620, 685 675, 710 730" />
        {/* Bergsstigar i Mount Kalaga */}
        <path d="M 380 185 C 455 155, 535 162, 625 142 C 725 122, 845 145, 935 175" />
        <path d="M 480 115 C 510 155, 505 205, 535 265" />
      </g>

      {/* B. Vita huvudleder (Arterials mellan distrikt) */}
      <g fill="none" stroke={arterialColor} strokeOpacity={isNight ? 0.52 : 0.78} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        {/* Kustled längs Vice Beach & South Beach */}
        <path d="M 1345 315 C 1352 425, 1346 565, 1324 715" />
        {/* Wynwood -> Little Cuba -> VCIA -> South Vice */}
        <path d="M 1015 365 L 1115 365 L 1190 420" />
        <path d="M 970 545 L 1195 545" />
        <path d="M 985 635 L 1120 635" />
        {/* Port Gellhorn kustarterialloop */}
        <path d="M 245 310 L 345 350 L 345 450 L 250 450" />
        {/* Runt Lake Leonida */}
        <path d="M 628 380 C 625 288, 725 258, 845 292 C 912 314, 912 430, 825 478 C 745 502, 648 475, 628 380 Z" />
        {/* Godsjärnväg (Ambrosia -> Vice Port) */}
        <path d="M 355 245 L 555 465 L 875 615 L 1185 635" stroke="#94A3B8" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="7 5" />
      </g>

      {/* C. Dubbla motorvägar (I-95, I-75, Overseas Hwy, Alligator Alley) + Broar */}
      <g filter={isMinimap ? undefined : 'url(#highway-glow)'} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Yttre vägbanekant (Casing) */}
        <g stroke={highwayCasing} strokeWidth="7.2">
          <path d="M 1070 65 C 1095 160, 1120 270, 1115 390 L 1115 620 C 1100 710, 1055 785, 1005 875" />
          <path d="M 1005 875 C 995 935, 920 970, 810 1005 C 700 1035, 570 1055, 385 1085" />
          <path d="M 275 390 C 370 430, 465 465, 580 475 C 720 488, 900 500, 1115 510" />
          <path d="M 315 520 C 430 615, 540 695, 740 710 C 900 722, 1005 685, 1105 645" />
          <path d="M 255 385 C 245 265, 315 165, 495 145 C 680 125, 895 145, 1095 205" />
          <path d="M 595 475 C 605 350, 625 250, 665 140" />
        </g>

        {/* Inre guld/orange/neon motorvägslinjer */}
        <g stroke={highwayCore} strokeWidth="4.2">
          {/* I-95 Östkusten */}
          <path d="M 1070 65 C 1095 160, 1120 270, 1115 390 L 1115 620 C 1100 710, 1055 785, 1005 875" />
          {/* Overseas Highway & Seven Mile Bridge */}
          <path d="M 1005 875 C 995 935, 920 970, 810 1005 C 700 1035, 570 1055, 385 1085" stroke="#FBBF24" strokeWidth="3.6" />
          {/* I-75 Tvärgående motorväg */}
          <path d="M 275 390 C 370 430, 465 465, 580 475 C 720 488, 900 500, 1115 510" strokeWidth="3.8" />
          {/* Alligator Alley */}
          <path d="M 315 520 C 430 615, 540 695, 740 710 C 900 722, 1005 685, 1105 645" stroke="#EAB308" strokeWidth="3.3" />
          {/* Norra bergslederna */}
          <path d="M 255 385 C 245 265, 315 165, 495 145 C 680 125, 895 145, 1095 205" strokeWidth="3.1" />
          <path d="M 595 475 C 605 350, 625 250, 665 140" strokeWidth="2.9" />
        </g>

        {/* Tunn mittlinje för dubbelfilig motorvägskänsla */}
        {!isMinimap && (
          <g stroke="#0D0F14" strokeOpacity="0.6" strokeWidth="0.9">
            <path d="M 1070 65 C 1095 160, 1120 270, 1115 390 L 1115 620 C 1100 710, 1055 785, 1005 875" />
            <path d="M 275 390 C 370 430, 465 465, 580 475 C 720 488, 900 500, 1115 510" />
          </g>
        )}

        {/* Broar & Causeways mellan Vice City och Vice Beach / Port Gellhorn */}
        <path d="M 1185 375 L 1315 375" stroke="#FF2A85" strokeWidth="3.2" />
        <path d="M 1195 442 L 1312 442" stroke="#FF2A85" strokeWidth="3.4" />
        <path d="M 1192 545 L 1320 545" stroke="#FF2A85" strokeWidth="3.6" />
        <path d="M 1175 635 L 1280 642" stroke="#00F0FF" strokeWidth="2.8" />
        <path d="M 1140 695 L 1288 775" stroke="#00F0FF" strokeWidth="2.4" />
        <path d="M 235 405 L 270 435" stroke="#FF2A85" strokeWidth="3" />
      </g>

      {/* 6. GTA PAUSE MENU KARTIKONER (FLYGPLATS, HAMN, AMMU-NATION, VERKSTAD, SAFE HOUSE) */}
      {!isMinimap && (
        <g pointerEvents="none">
          {/* Flygplats: VCIA */}
          <g transform="translate(1015, 690)">
            <circle r="10" fill="#0D0F14" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M-4.5 1 L0 -4.5 L4.5 1 L1.2 1 L1.2 4.5 L-1.2 4.5 L-1.2 1 Z" fill="#F8FAFC" />
          </g>
          {/* Flygplats: Port Gellhorn */}
          <g transform="translate(322, 310)">
            <circle r="8.5" fill="#0D0F14" stroke="#94A3B8" strokeWidth="1.1" />
            <path d="M-3.8 0.8 L0 -3.8 L3.8 0.8 L1 0.8 L1 3.8 L-1 3.8 L-1 0.8 Z" fill="#F8FAFC" />
          </g>

          {/* Hamnar: Vice Port & Port Gellhorn Docks */}
          {[
            [1238, 638],
            [218, 398],
          ].map(([cx, cy], idx) => (
            <g key={`port-${idx}`} transform={`translate(${cx}, ${cy})`}>
              <circle r="8.5" fill="#0D0F14" stroke="#38BDF8" strokeWidth="1.2" />
              <path
                d="M0 -4 V4 M-3.5 1 C-3.5 3.8, 3.5 3.8, 3.5 1 M-2.5 -2 H2.5"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Ammu-Nation (Sikte) */}
          {[
            [1132, 534],
            [314, 368],
          ].map(([cx, cy], idx) => (
            <g key={`ammu-${idx}`} transform={`translate(${cx}, ${cy})`}>
              <circle r="8.5" fill="#0D0F14" stroke="#F43F5E" strokeWidth="1.2" />
              <circle r="3.2" fill="none" stroke="#F43F5E" strokeWidth="1.2" />
              <path d="M0 -5 V-2 M0 2 V5 M-5 0 H-2 M2 0 H5" stroke="#F43F5E" strokeWidth="1.1" />
            </g>
          ))}

          {/* Bilverkstäder / LS Customs */}
          {[
            [1342, 650],
            [565, 488],
            [292, 396],
          ].map(([cx, cy], idx) => (
            <g key={`mod-${idx}`} transform={`translate(${cx}, ${cy})`}>
              <circle r="8" fill="#0D0F14" stroke="#F59E0B" strokeWidth="1.2" />
              <path
                d="M-3 3 L2.2 -2.2 M1 -3.2 L3.2 -1"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Safe Houses */}
          {[
            [1352, 520],
            [1010, 560],
            [266, 434],
            [382, 1085],
          ].map(([cx, cy], idx) => (
            <g key={`safe-${idx}`} transform={`translate(${cx}, ${cy})`}>
              <circle r="8" fill="#0D0F14" stroke="#10B981" strokeWidth="1.2" />
              <path d="M-3.5 0 L0 -3.5 L3.5 0 V3.5 H-3.5 Z" fill="#10B981" />
            </g>
          ))}
        </g>
      )}

      {/* 7. DISTRIKTSNAMN, MOTORVÄGSSKÖLDAR & DETALJETIKETTER */}
      {!isMinimap && (
        <g className="font-display" textAnchor="middle">
          {/* Motorvägssköldar */}
          <g transform="translate(1115, 255)">
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#0D0F14" stroke="#F59E0B" strokeWidth="1.2" />
            <text y="3.5" fill="#FDE68A" fontSize="9" fontWeight="700">I-95</text>
          </g>
          <g transform="translate(435, 446)">
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#0D0F14" stroke="#F59E0B" strokeWidth="1.2" />
            <text y="3.5" fill="#FDE68A" fontSize="9" fontWeight="700">I-75</text>
          </g>
          <g transform="translate(830, 998)">
            <rect x="-16" y="-8" width="32" height="16" rx="4" fill="#0D0F14" stroke="#FBBF24" strokeWidth="1.2" />
            <text y="3.5" fill="#FEF08A" fontSize="9" fontWeight="700">US-1</text>
          </g>

          {/* Stora regionnamn */}
          <text x="575" y="148" fill="#E2E8F0" fillOpacity="0.9" fontSize="24" fontWeight="700" letterSpacing="4">
            MOUNT KALAGA
          </text>
          <text x="752" y="388" fill="#38BDF8" fillOpacity="0.82" fontSize="16" fontWeight="600" letterSpacing="2.5">
            LAKE LEONIDA
          </text>
          <text x="585" y="435" fill="#E2E8F0" fillOpacity="0.88" fontSize="19" fontWeight="700" letterSpacing="3">
            AMBROSIA
          </text>
          <text x="278" y="362" fill="#E2E8F0" fillOpacity="0.92" fontSize="20" fontWeight="700" letterSpacing="2.5">
            PORT GELLHORN
          </text>
          <text x="735" y="742" fill="#CBD5E1" fillOpacity="0.9" fontSize="23" fontWeight="700" letterSpacing="4">
            GRASSRIVERS
          </text>
          <text x="1115" y="495" fill="#FFFFFF" fillOpacity="0.96" fontSize="24" fontWeight="800" letterSpacing="3.5">
            VICE CITY
          </text>
          <text
            x="1342"
            y="490"
            fill="#FF2A85"
            fillOpacity="0.95"
            fontSize="16"
            fontWeight="700"
            letterSpacing="2"
            transform="rotate(90, 1342, 490)"
          >
            VICE BEACH · SOUTH BEACH
          </text>
          <text x="690" y="1075" fill="#00F0FF" fillOpacity="0.9" fontSize="20" fontWeight="700" letterSpacing="3.5">
            LEONIDA KEYS
          </text>

          {/* Sekundära distriktsnamn */}
          <text x="1115" y="520" fill="#CBD5E1" fontSize="12" fontWeight="600" letterSpacing="1.5">
            DOWNTOWN
          </text>
          <text x="1238" y="655" fill="#E2E8F0" fontSize="10.5" fontWeight="600" letterSpacing="1.2">
            VICE PORT
          </text>
          <text x="1015" y="715" fill="#CBD5E1" fontSize="10.5" fontWeight="600" letterSpacing="1">
            VCIA AIRPORT
          </text>
          <text x="1110" y="365" fill="#E2E8F0" fontSize="12" fontWeight="600" letterSpacing="1.5">
            WYNWOOD
          </text>
          <text x="1008" y="544" fill="#CBD5E1" fontSize="11" fontWeight="600" letterSpacing="1.2">
            LITTLE CUBA
          </text>

          {/* Detaljetiketter vid inzoomning */}
          {showMicroDetail && (
            <g fill="#E2E8F0" fillOpacity="0.82" fontSize="9.5" fontWeight="600">
              <text x="1262" y="548">Starfish Island</text>
              <text x="1265" y="445">Prawn Island</text>
              <text x="1255" y="534">Venetian Causeway</text>
              <text x="1358" y="610">Ocean Drive</text>
              <text x="580" y="172">Kalaga Peak (842 m)</text>
              <text x="385" y="1064">Sunset Key</text>
              <text x="652" y="1010">Seven Mile Bridge</text>
              <text x="815" y="696">Alligator Alley</text>
              <text x="220" y="452">Gellhorn Bay</text>
              <text x="915" y="395">Belle Glade Farms</text>
            </g>
          )}
        </g>
      )}

      {/* 8. PAUSMENY-SPELARPOSITION & GPS WAYPOINT-RUTT */}
      <g pointerEvents="none">
        {wpX !== null && wpY !== null && (
          <>
            {/* Lila/rosa GPS-linje mellan spelaren och Waypoint */}
            <line
              x1={playerX}
              y1={playerY}
              x2={wpX}
              y2={wpY}
              stroke="#D946EF"
              strokeOpacity="0.32"
              strokeWidth={isMinimap ? '6' : '7'}
              strokeLinecap="round"
            />
            <line
              x1={playerX}
              y1={playerY}
              x2={wpX}
              y2={wpY}
              stroke="#E879F9"
              strokeWidth={isMinimap ? '2.5' : '3'}
              strokeDasharray="10 7"
              strokeLinecap="round"
            />
            {/* Pulsande Waypoint-markör */}
            <circle
              cx={wpX}
              cy={wpY}
              r={isMinimap ? 18 : 18 / Math.max(zoom * 0.65, 0.8)}
              fill="#D946EF"
              fillOpacity="0.22"
              stroke="#E879F9"
              strokeWidth={isMinimap ? '2.5' : '2'}
            />
            <circle
              cx={wpX}
              cy={wpY}
              r={isMinimap ? 7 : 6.5 / Math.max(zoom * 0.65, 0.8)}
              fill="#D946EF"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </>
        )}

        {/* Spelarens nuvarande position (vit/cyan GTA-pil i Downtown Vice City) */}
        <g transform={`translate(${playerX}, ${playerY}) scale(${isMinimap ? 1.5 : 1 / Math.max(zoom * 0.6, 0.75)})`}>
          <circle r="11" fill="#0D0F14" fillOpacity="0.7" stroke="#00F0FF" strokeWidth="1.4" />
          <polygon points="0,-7 5.5,6 0,3.2 -5.5,6" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}
