interface LeonidaSvgMapProps {
  /** Nuvarande zoomnivå för att dynamiskt visa finare gatunät & etiketter vid inzoomning */
  zoom: number;
  /** Förenklad version utan textetiketter för minimapen */
  isMinimap?: boolean;
  /** Simulerar natt-läge i Leonida med dämpad ljusstyrka och högre neon-kontrast */
  isNightMode?: boolean;
}

export function LeonidaSvgMap({
  zoom,
  isMinimap = false,
  isNightMode = false,
}: LeonidaSvgMapProps) {
  const showStreetDetail = !isMinimap && zoom >= 1.6;
  const showMicroLabels = !isMinimap && zoom >= 2.2;

  return (
    <svg
      viewBox="0 0 1600 1200"
      className={`w-full h-full block select-none pointer-events-none transition-[filter] duration-300 ${
        isNightMode
          ? 'brightness-[0.62] contrast-[1.32] saturate-[1.2]'
          : 'brightness-[1.22] contrast-[0.95] saturate-[1.04]'
      }`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Havsbakgrund */}
        <radialGradient id="leonida-ocean-grad" cx="55%" cy="48%" r="70%">
          <stop offset="0%" stopColor="#0C1422" />
          <stop offset="55%" stopColor="#080C14" />
          <stop offset="100%" stopColor="#05080E" />
        </radialGradient>

        {/* Landmassa gradient */}
        <linearGradient id="leonida-land-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A2232" />
          <stop offset="55%" stopColor="#161C28" />
          <stop offset="100%" stopColor="#121824" />
        </linearGradient>

        {/* Träsk-gradient för Grassrivers */}
        <radialGradient id="grassrivers-grad" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#122126" />
          <stop offset="100%" stopColor="#161C28" stopOpacity="0" />
        </radialGradient>

        {/* Kustlinjeglöd */}
        <filter id="cyan-coast-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Mjukt neon-sken för motorvägar */}
        <filter id="gold-road-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" result="blur" />
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
            stroke="#00F0FF"
            strokeOpacity="0.045"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* 1. DJUPHAV & TAKTISKT RUTNÄT */}
      <rect width="1600" height="1200" fill="url(#leonida-ocean-grad)" />
      {!isMinimap && <rect width="1600" height="1200" fill="url(#tactical-grid)" />}

      {/* Batymetriska djupkonturer i havet */}
      {!isMinimap && (
        <g fill="none" stroke="#00F0FF" strokeOpacity="0.06" strokeWidth="1.2" strokeDasharray="6 6">
          <path d="M 120 260 Q 170 420 250 560 T 460 800 T 920 960 T 1440 720 T 1450 200" />
          <path d="M 70 320 Q 120 500 220 640 T 440 890 T 970 1030 T 1510 760 T 1520 140" />
        </g>
      )}

      {/* 2. LEONIDA HUVUDHALVÖ (LANDMASSA) */}
      <g filter={isMinimap ? undefined : 'url(#cyan-coast-glow)'}>
        {/* Huvudkontinent: Mount Kalaga -> Port Gellhorn -> Grassrivers -> Vice City */}
        <path
          d="
            M 160 60
            L 1140 60
            C 1160 120, 1185 180, 1205 250
            C 1225 320, 1240 375, 1228 420
            L 1205 445
            L 1225 470
            C 1235 510, 1215 560, 1200 600
            L 1185 655
            L 1155 685
            C 1120 715, 1085 775, 1045 815
            C 995 855, 925 895, 860 915
            C 785 935, 710 920, 645 890
            C 580 865, 535 840, 485 780
            C 445 735, 420 680, 395 640
            C 365 595, 315 570, 290 520
            C 275 490, 295 450, 285 425
            L 250 400
            C 215 415, 195 455, 225 495
            C 200 505, 175 475, 165 440
            C 150 385, 175 335, 190 290
            C 200 245, 165 180, 155 120
            Z
          "
          fill="url(#leonida-land-grad)"
          stroke="#00F0FF"
          strokeOpacity="0.65"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vice Beach & Ocean Drive (Östra barriäröarna) */}
        <path
          d="
            M 1310 295
            C 1345 290, 1375 320, 1380 375
            C 1385 440, 1390 520, 1378 585
            C 1368 640, 1352 695, 1328 730
            C 1308 732, 1298 705, 1302 660
            C 1308 595, 1315 510, 1305 430
            C 1298 370, 1290 320, 1310 295
            Z
          "
          fill="#192130"
          stroke="#00F0FF"
          strokeOpacity="0.75"
          strokeWidth="2.2"
        />

        {/* Starfish Island & Prawn Island i Vice Bay */}
        <ellipse
          cx="1262"
          cy="545"
          rx="26"
          ry="15"
          fill="#1B2436"
          stroke="#00F0FF"
          strokeOpacity="0.6"
          strokeWidth="1.6"
        />
        <ellipse
          cx="1265"
          cy="442"
          rx="20"
          ry="13"
          fill="#1B2436"
          stroke="#00F0FF"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />

        {/* Vice Port (Hamnön / Dodge Island) */}
        <path
          d="
            M 1190 618
            L 1278 622
            L 1285 656
            L 1205 660
            L 1184 642
            Z
          "
          fill="#1C2536"
          stroke="#00F0FF"
          strokeOpacity="0.6"
          strokeWidth="1.8"
        />

        {/* Key Biscayne / Södra Vice-ön */}
        <path
          d="
            M 1275 745
            C 1305 745, 1325 785, 1312 835
            C 1302 865, 1275 868, 1265 842
            C 1255 810, 1260 765, 1275 745
            Z
          "
          fill="#171F2E"
          stroke="#00F0FF"
          strokeOpacity="0.55"
          strokeWidth="1.8"
        />

        {/* LEONIDA KEYS (Södra ö-kedjan mot Key West) */}
        <path d="M 990 905 C 1035 895, 1068 920, 1052 945 C 1030 960, 992 950, 982 925 Z" fill="#17202F" stroke="#00F0FF" strokeOpacity="0.7" strokeWidth="1.8" />
        <path d="M 885 955 C 930 945, 965 965, 952 986 C 928 996, 892 988, 880 968 Z" fill="#17202F" stroke="#00F0FF" strokeOpacity="0.7" strokeWidth="1.8" />
        <path d="M 760 992 C 808 982, 845 998, 835 1018 C 808 1028, 768 1020, 755 1004 Z" fill="#17202F" stroke="#00F0FF" strokeOpacity="0.7" strokeWidth="1.8" />
        <path d="M 615 1025 C 668 1012, 705 1025, 695 1046 C 662 1056, 622 1048, 608 1036 Z" fill="#17202F" stroke="#00F0FF" strokeOpacity="0.7" strokeWidth="1.8" />
        <path d="M 480 1052 C 535 1040, 568 1054, 558 1072 C 525 1082, 486 1074, 474 1062 Z" fill="#17202F" stroke="#00F0FF" strokeOpacity="0.7" strokeWidth="1.8" />
        <path d="M 340 1076 C 398 1062, 435 1076, 422 1098 C 388 1110, 344 1100, 334 1086 Z" fill="#1A2435" stroke="#00F0FF" strokeOpacity="0.75" strokeWidth="2" />
      </g>

      {/* 3. TOPOGRAFI & NATURZONING */}

      {/* Mount Kalaga (Bergskedja & höjdkurvor i norr) */}
      <g opacity="0.85">
        <path
          d="M 270 155 Q 380 85 520 115 T 820 105 T 1020 170 Q 940 245 780 230 T 480 235 Q 330 225 270 155 Z"
          fill="#1B2333"
          stroke="#2E3B55"
          strokeWidth="1.5"
        />
        <path
          d="M 335 160 Q 435 110 545 135 T 765 130 T 915 170 Q 845 215 725 205 T 490 210 Q 385 205 335 160 Z"
          fill="#202A3E"
          stroke="#394968"
          strokeWidth="1.3"
        />
        <path
          d="M 425 162 Q 505 130 595 148 T 745 155 Q 705 190 615 186 T 455 185 Z"
          fill="#26334B"
          stroke="#4B5F85"
          strokeWidth="1.2"
        />
        {/* Kalaga-floden från bergen ner mot Lake Leonida & Port Gellhorn */}
        <path
          d="M 480 150 C 445 210, 390 250, 330 295 C 290 325, 255 370, 245 415"
          fill="none"
          stroke="#0A1322"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 480 150 C 445 210, 390 250, 330 295 C 290 325, 255 370, 245 415"
          fill="none"
          stroke="#00F0FF"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Lake Leonida (Stor insjö) */}
      <g>
        <path
          d="
            M 665 305
            C 720 278, 825 288, 855 338
            C 882 385, 845 452, 775 462
            C 705 472, 650 432, 642 382
            C 636 348, 645 318, 665 305
            Z
          "
          fill="#09101C"
          stroke="#00F0FF"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        {/* Liten ö i Lake Leonida */}
        <circle cx="775" cy="365" r="11" fill="#1A2232" stroke="#00F0FF" strokeOpacity="0.5" strokeWidth="1.2" />
      </g>

      {/* Grassrivers (Träskmarker & kanaler i mitten/söder) */}
      <g>
        <ellipse cx="730" cy="735" rx="235" ry="135" fill="url(#grassrivers-grad)" />
        {/* Träskvatten & mangrovekanaler */}
        <path
          d="M 535 690 C 595 675, 655 710, 725 695 C 795 680, 865 705, 920 755"
          fill="none"
          stroke="#0A1320"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 580 760 C 655 745, 720 795, 800 775 C 865 760, 915 805, 955 835"
          fill="none"
          stroke="#0A1320"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 650 645 C 675 705, 655 765, 685 835"
          fill="none"
          stroke="#0A1320"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <g fill="#0A1320" stroke="#00F0FF" strokeOpacity="0.25" strokeWidth="1">
          <ellipse cx="615" cy="725" rx="24" ry="12" />
          <ellipse cx="755" cy="740" rx="34" ry="16" />
          <ellipse cx="845" cy="790" rx="28" ry="14" />
          <ellipse cx="705" cy="825" rx="22" ry="11" />
        </g>
      </g>

      {/* 4. STADSDISTRIKT, GATUNÄT & LANDMÄRKEN */}

      {/* Vice City International Airport (VCIA) */}
      <g transform="translate(955, 650)">
        <polygon
          points="0,20 95,0 120,65 20,90"
          fill="#1B2232"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <line x1="12" y1="35" x2="102" y2="18" stroke="#64748B" strokeWidth="4" />
        <line x1="25" y1="70" x2="108" y2="48" stroke="#64748B" strokeWidth="3.5" />
        <line x1="55" y1="12" x2="72" y2="75" stroke="#475569" strokeWidth="3" />
      </g>

      {/* Downtown Vice City & Wynwood urban block grid */}
      <g stroke="#29354B" strokeWidth={showStreetDetail ? '1.3' : '0.9'}>
        {/* Vertikala gator Downtown */}
        {[1045, 1065, 1085, 1105, 1125, 1145, 1165, 1185].map((x) => (
          <line key={`vc-v-${x}`} x1={x} y1="420" x2={x} y2="615" />
        ))}
        {/* Horisontella gator Downtown */}
        {[435, 455, 475, 495, 515, 535, 555, 575, 595].map((y) => (
          <line key={`vc-h-${y}`} x1="1030" y1={y} x2="1202" y2={y} />
        ))}
        {/* Skyskrapor i Downtown */}
        {showStreetDetail && (
          <g fill="#232D42" stroke="#3B4D6E" strokeWidth="0.9">
            <rect x="1110" y="480" width="14" height="14" rx="1" />
            <rect x="1130" y="480" width="12" height="16" rx="1" />
            <rect x="1150" y="500" width="14" height="14" rx="1" />
            <rect x="1110" y="520" width="16" height="12" rx="1" />
            <rect x="1132" y="538" width="14" height="14" rx="1" />
            <rect x="1090" y="500" width="12" height="12" rx="1" />
          </g>
        )}
      </g>

      {/* Vice Beach & Ocean Drive gatunät */}
      <g stroke="#2B3852" strokeWidth={showStreetDetail ? '1.2' : '0.8'}>
        {[335, 360, 385, 410, 435, 460, 485, 510, 535, 560, 585, 610, 635, 660].map((y) => (
          <line key={`vb-h-${y}`} x1="1312" y1={y} x2="1370" y2={y} />
        ))}
        <line x1="1332" y1="320" x2="1332" y2="690" />
        <line x1="1352" y1="325" x2="1352" y2="680" />
        {/* Ocean Drive neon-strandpromenad */}
        <path
          d="M 1364 460 C 1368 530, 1360 610, 1338 690"
          fill="none"
          stroke="#FF2A85"
          strokeOpacity="0.85"
          strokeWidth="2.8"
        />
      </g>

      {/* Port Gellhorn gatunät & hamnkajer */}
      <g stroke="#29354B" strokeWidth="1">
        {[255, 275, 295, 315, 335].map((x) => (
          <line key={`pg-v-${x}`} x1={x} y1="340" x2={x} y2="450" />
        ))}
        {[350, 370, 390, 410, 430].map((y) => (
          <line key={`pg-h-${y}`} x1="240" y1={y} x2="350" y2={y} />
        ))}
        {/* Hamnpirar */}
        <rect x="208" y="380" width="26" height="8" fill="#273247" stroke="#475569" />
        <rect x="206" y="396" width="28" height="8" fill="#273247" stroke="#475569" />
        <rect x="210" y="412" width="24" height="8" fill="#273247" stroke="#475569" />
      </g>

      {/* Ambrosia industrizon */}
      <g fill="#222B3D" stroke="#3A4966" strokeWidth="1">
        <rect x="530" y="448" width="32" height="18" rx="2" />
        <rect x="570" y="445" width="24" height="22" rx="2" />
        <rect x="535" y="476" width="44" height="16" rx="2" />
        <circle cx="606" cy="482" r="7" />
        <circle cx="624" cy="482" r="7" />
        <circle cx="606" cy="500" r="7" />
      </g>

      {/* 5. MOTORVÄGAR, BROAR & JÄRNVÄG (NEON & GULD) */}
      <g filter={isMinimap ? undefined : 'url(#gold-road-glow)'} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Huvudmotorväg I-95 (Östkusten: Norr -> Downtown -> Söderut till Keys) */}
        <path
          d="M 1070 65 C 1095 160, 1120 270, 1115 390 L 1115 620 C 1100 710, 1055 785, 1005 875"
          stroke="#F59E0B"
          strokeWidth="4.2"
        />

        {/* Overseas Highway & Seven Mile Bridge genom hela Leonida Keys */}
        <path
          d="M 1005 875 C 995 935, 920 970, 810 1005 C 700 1035, 570 1055, 385 1085"
          stroke="#FBBF24"
          strokeWidth="3.6"
        />

        {/* Tvärgående motorväg I-75: Port Gellhorn -> Ambrosia -> Vice City */}
        <path
          d="M 275 390 C 370 430, 465 465, 580 475 C 720 488, 900 500, 1115 510"
          stroke="#F59E0B"
          strokeWidth="3.8"
        />

        {/* Alligator Alley genom Grassrivers */}
        <path
          d="M 315 520 C 430 615, 540 695, 740 710 C 900 722, 1005 685, 1105 645"
          stroke="#EAB308"
          strokeWidth="3.2"
        />

        {/* Norra bergsvägen runt Mount Kalaga & Lake Leonida */}
        <path
          d="M 255 385 C 245 265, 315 165, 495 145 C 680 125, 895 145, 1095 205"
          stroke="#D97706"
          strokeWidth="3"
        />
        <path
          d="M 595 475 C 605 350, 625 250, 665 140"
          stroke="#D97706"
          strokeWidth="2.8"
        />

        {/* Broar & Causeways mellan Downtown Vice City och Vice Beach */}
        <path d="M 1185 375 L 1315 375" stroke="#FF2A85" strokeWidth="3.2" />
        <path d="M 1195 442 L 1312 442" stroke="#FF2A85" strokeWidth="3.4" />
        <path d="M 1192 545 L 1320 545" stroke="#FF2A85" strokeWidth="3.6" />
        <path d="M 1175 635 L 1280 642" stroke="#00F0FF" strokeWidth="2.8" />
        <path d="M 1140 695 L 1288 775" stroke="#00F0FF" strokeWidth="2.4" />

        {/* Port Gellhorn Kustbro */}
        <path d="M 235 405 L 270 435" stroke="#FF2A85" strokeWidth="3" />

        {/* Godsjärnväg (Ambrosia -> Vice Port) */}
        <path
          d="M 355 245 L 555 465 L 875 615 L 1185 635"
          stroke="#94A3B8"
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeDasharray="7 5"
        />
      </g>

      {/* Extra gatudetaljer synliga när man zoomar in */}
      {showStreetDetail && (
        <g stroke="#334155" strokeWidth="1" opacity="0.7">
          <line x1="520" y1="435" x2="640" y2="435" />
          <line x1="520" y1="515" x2="640" y2="515" />
          <line x1="550" y1="425" x2="550" y2="525" />
          <line x1="590" y1="425" x2="590" y2="525" />
          <line x1="940" y1="450" x2="1030" y2="450" />
          <line x1="940" y1="560" x2="1030" y2="560" />
          <line x1="975" y1="420" x2="975" y2="620" />
        </g>
      )}

      {/* 6. DISTRIKTSNAMN & KARTETIKETTER */}
      {!isMinimap && (
        <g className="font-display" textAnchor="middle">
          {/* Stora regionnamn */}
          <text
            x="575"
            y="148"
            fill="#CBD5E1"
            fillOpacity="0.88"
            fontSize="24"
            fontWeight="700"
            letterSpacing="4"
          >
            MOUNT KALAGA
          </text>
          <text
            x="752"
            y="388"
            fill="#38BDF8"
            fillOpacity="0.75"
            fontSize="16"
            fontWeight="600"
            letterSpacing="2.5"
          >
            LAKE LEONIDA
          </text>
          <text
            x="585"
            y="435"
            fill="#E2E8F0"
            fillOpacity="0.85"
            fontSize="19"
            fontWeight="700"
            letterSpacing="3"
          >
            AMBROSIA
          </text>
          <text
            x="278"
            y="362"
            fill="#E2E8F0"
            fillOpacity="0.9"
            fontSize="20"
            fontWeight="700"
            letterSpacing="2.5"
          >
            PORT GELLHORN
          </text>
          <text
            x="735"
            y="742"
            fill="#94A3B8"
            fillOpacity="0.88"
            fontSize="23"
            fontWeight="700"
            letterSpacing="4"
          >
            GRASSRIVERS
          </text>
          <text
            x="1115"
            y="495"
            fill="#FFFFFF"
            fillOpacity="0.95"
            fontSize="24"
            fontWeight="800"
            letterSpacing="3.5"
          >
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
            VICE BEACH · OCEAN DRIVE
          </text>
          <text
            x="690"
            y="1075"
            fill="#00F0FF"
            fillOpacity="0.85"
            fontSize="20"
            fontWeight="700"
            letterSpacing="3.5"
          >
            LEONIDA KEYS
          </text>

          {/* Sekundära distriktsnamn */}
          <text x="1115" y="520" fill="#94A3B8" fontSize="12" fontWeight="600" letterSpacing="1.5">
            DOWNTOWN
          </text>
          <text x="1238" y="644" fill="#CBD5E1" fontSize="11" fontWeight="600" letterSpacing="1.2">
            VICE PORT
          </text>
          <text x="1015" y="695" fill="#94A3B8" fontSize="11" fontWeight="600" letterSpacing="1">
            VCIA AIRPORT
          </text>
          <text x="1110" y="365" fill="#CBD5E1" fontSize="12" fontWeight="600" letterSpacing="1.5">
            WYNWOOD
          </text>
          <text x="1008" y="555" fill="#94A3B8" fontSize="11" fontWeight="600" letterSpacing="1.2">
            LITTLE CUBA
          </text>

          {/* Detaljetiketter vid inzoomning */}
          {showMicroLabels && (
            <g fill="#CBD5E1" fillOpacity="0.78" fontSize="9.5" fontWeight="600">
              <text x="1262" y="548">Starfish Island</text>
              <text x="1265" y="445">Prawn Island</text>
              <text x="1255" y="534">Venetian Causeway</text>
              <text x="1358" y="610">Ocean Drive</text>
              <text x="580" y="172">Kalaga Peak (842 m)</text>
              <text x="385" y="1064">Sunset Key</text>
              <text x="652" y="1010">Seven Mile Bridge</text>
              <text x="815" y="696">Alligator Alley</text>
              <text x="220" y="452">Gellhorn Bay</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
