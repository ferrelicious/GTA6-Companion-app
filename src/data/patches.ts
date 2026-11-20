import { PatchNote } from '../types';

export const INITIAL_PATCHES: PatchNote[] = [
  {
    id: 'patch-01-004-000',
    version: '01.004.000',
    title: 'Leonida Performance & Vice Beach RT-uppdatering',
    releaseDate: '2026-11-18',
    platforms: ['ps5', 'xbox'],
    fileSizePs5: '4.82 GB',
    fileSizeXbox: '5.15 GB',
    summary:
      'Större stabilitetsuppdatering med förbättrad bildfrekvens i täta trafikzoner runt Ocean Beach samt justeringar för ekonomi och fordonshantering.',
    officialNotes: [
      'Förbättrad dynamisk upplösningsskalning i Performance-läge (60 fps) längs Ocean Drive och Downtown Vice City.',
      'Åtgärdat en bugg där Lucias vapenhjul kunde frysa vid snabbväxling från båt till land.',
      'Justerat polisiär responstid i Port Gellhorn efter genomförda butiksrån.',
      'Förbättrat nätverkssynk och matchmaking för 32-spelarsessioner i Leonida Online.',
    ],
    communityDiscoveries: [
      'Digital Foundry-tester visar att skuggeffekter på palmblad nu använder halverad raytracing-kostnad i 60 fps-läget.',
      'Tyst buff av toppfarten på Pegassi Vacca Classic (+6 km/h) och stabilare fjädring över farthinder.',
      'Tre nya hemliga graffitimålningar har dykt upp i Wynwood-distriktet utan att nämnas i patch notes.',
    ],
  },
  {
    id: 'patch-01-003-002',
    version: '01.003.002',
    title: 'Hotfix: DualSense-haptik & Cloud Save-skydd',
    releaseDate: '2026-11-11',
    platforms: ['ps5'],
    fileSizePs5: '890 MB',
    summary:
      'PS5-exklusiv snabbkorrigering som adresserar adaptiva triggers och synkproblem vid viloläge.',
    officialNotes: [
      'Åtgärdat ett problem där DualSense-avtryckarmotståndet tappades efter vissa mellansekvenser med Jason.',
      'Förhindrat att lokala autosparningar skrevs över vid återupptagande från PS5 Rest Mode.',
    ],
    communityDiscoveries: [
      'Märkbart snabbare laddningstid (~1,4 sek snabbare) när man byter karaktär över hela kartan.',
      'Fiskespö-vibrationen i Leonida Keys har blivit tydligare vid napp från större arter.',
    ],
    isHotfix: true,
  },
  {
    id: 'patch-01-003-001',
    version: '01.003.001',
    title: 'Xbox Series X|S VRR & Ljudsynk-patch',
    releaseDate: '2026-11-10',
    platforms: ['xbox'],
    fileSizeXbox: '1.14 GB',
    summary:
      'Riktad uppdatering för Xbox Series X|S som löser VRR-flimmer och Dolby Atmos-fördröjning.',
    officialNotes: [
      'Löst VRR-ljusstyrkeflimmer i mörka nattscener i Grassrivers på 120 Hz-skärmar.',
      'Korrigerat en ljudfördröjning på ~80 ms vid användning av Dolby Atmos via HDMI eARC.',
      'Förbättrad minneshantering på Xbox Series S vid snabba helikopterflygningar.',
    ],
    communityDiscoveries: [
      'Quick Resume fungerar nu tillförlitligt även efter 48 timmar i bakgrunden utan att tappa serveranslutningen.',
      'Texturstreaming längs motorvägen mot Lake Leonida laddar nu in vägskyltar på dubbelt avstånd.',
    ],
    isHotfix: true,
  },
  {
    id: 'patch-01-002-001',
    version: '01.002.001',
    title: 'Grassrivers Ecosystem & Economy Balance',
    releaseDate: '2026-11-04',
    platforms: ['ps5', 'xbox'],
    fileSizePs5: '2.65 GB',
    fileSizeXbox: '2.90 GB',
    summary:
      'Balanseringsuppdatering som finjusterar vilda djur i träskmarkerna, båtfysik samt utbetalningar i sidouppdrag.',
    officialNotes: [
      'Minskade oavsiktliga krokodilangrepp på grunt vatten när spelaren använder smygläge.',
      'Ökade utbetalningen med 15 % för smuggling av sjöfrakt mellan Leonida Keys och Vice Port.',
      'Åtgärdat ett kollisionsfel under bron vid Venetian Causeway där bilar kunde falla genom vägbanan.',
    ],
    communityDiscoveries: [
      'NPC-poliser kontrollerar nu bakluckan oftare om man kör en skåpbil sent på natten i Vice Port.',
      'Dold radiokanal-interferens när man flyger nära Lake Leonidas radarbas har lagts till.',
    ],
  },
  {
    id: 'patch-01-000-001',
    version: '01.000.001',
    title: 'Day One Launch Patch',
    releaseDate: '2026-10-27',
    platforms: ['ps5', 'xbox'],
    fileSizePs5: '18.40 GB',
    fileSizeXbox: '19.85 GB',
    summary:
      'Obligatorisk lanseringsuppdatering med fullständig Photo Mode, sluttuning av ljussättning och dag-ett-stabilitet.',
    officialNotes: [
      'Aktiverar fullständigt Photo Mode med fri kamera, neonfilter och skärpedjup.',
      'Slutlig optimering av globalt ljus (GI) och reflektioner i regnväder över hela staten Leonida.',
      'Låser upp sociala flöden och foto-utmaningar kopplade till Rockstar Games-kontot.',
    ],
    communityDiscoveries: [
      'Lägger till över 40 extra slumpvisa GATV-händelser i telefonens Social-flöde.',
      'Förbättrar bränsle- och slitageeffekter på trimmade motorbåtar jämfört med disc-versionen.',
    ],
  },
];
