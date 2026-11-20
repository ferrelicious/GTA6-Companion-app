import { MapMarker } from '../types';

const IMG_VICE_BEACH = '/src/assets/images/poi_vice_beach_1795167709991.jpg';
const IMG_DOWNTOWN = '/src/assets/images/poi_downtown_vice_1795167710213.jpg';
const IMG_GRASSRIVERS = '/src/assets/images/poi_grassrivers_1795167709995.jpg';
const IMG_PORT_GELLHORN = '/src/assets/images/poi_port_gellhorn_1795167709806.jpg';

/**
 * 28 startmarkörer utspridda över samtliga huvuddistrikt i Leonida (0–100% koordinater matchade mot LeonidaSvgMap).
 * Laddas som fallback och synkas med Supabase-tabellen `markers`.
 */
export const INITIAL_MARKERS: MapMarker[] = [
  // ================= VICE CITY: VICE BEACH & OCEAN DRIVE =================
  {
    id: 'mk-1',
    title: 'Ocean Beach Art Deco Takpaket',
    category: 'Gömda paket',
    region: 'Vice Beach · Ocean Drive',
    description:
      'Klättra upp via brandstegen bakom Surfside Hotel längs Ocean Drive för att hitta ett vattentätt kurirpaket gömt bakom neonskylten.',
    x: 84.5,
    y: 48.0,
    imageUrl: IMG_VICE_BEACH,
    reward: '$12 500 + Vice Jacket',
  },
  {
    id: 'mk-2',
    title: 'Anpassad Cheetah Classic (Neon)',
    category: 'Speciella fordon',
    region: 'Vice Beach',
    description:
      'Står parkerad i det underjordiska garaget under Ocean View Promenade efter midnatt. Utrustad med unik neonrosa lack.',
    x: 83.4,
    y: 55.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Sällsynt sportbil till garaget',
  },
  {
    id: 'mk-3',
    title: 'North Beach Lifeguard-hopp',
    category: 'Hopp/Stunts',
    region: 'Vice Beach',
    description:
      'Använd sandvallen norr om Ocean Drive och hoppa rakt över den låga bryggan mot vattnet.',
    x: 84.2,
    y: 31.8,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Stunt-hopp 1/50',
  },
  {
    id: 'mk-4',
    title: 'Ocean Drive Design Boutique',
    category: 'Affärer',
    region: 'Vice Beach · Ocean Drive',
    description:
      'Exklusiv klädbutik med 80-talsinspirerade linnekostymer, solglasögon och neonaccesoarer för Lucia och Jason.',
    x: 84.8,
    y: 41.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'VIP-rabatt 15%',
  },

  // ================= VICE CITY: DOWNTOWN, WYNWOOD, LITTLE CUBA & HAMNEN =================
  {
    id: 'mk-5',
    title: 'Ammu-Nation Flagship Vice',
    category: 'Affärer',
    region: 'Downtown Vice City',
    description:
      'Huvudbutik med komplett skjutbana inomhus, taktiska sikten, ljuddämpare och skottsäkra västar nivå 3.',
    x: 70.6,
    y: 44.8,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Gratis ammunitionstest',
  },
  {
    id: 'mk-6',
    title: 'Militärkarbin MK II (Byggkran)',
    category: 'Vapen',
    region: 'Downtown Vice City',
    description:
      'Låst vapenväska vid byggkranens topp ovanför finansdistriktet. Kräver fallskärm eller helikopter för säker landning.',
    x: 72.8,
    y: 40.5,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Militärkarbin MK II',
  },
  {
    id: 'mk-7',
    title: 'Venetian Causeway Stunt-hopp',
    category: 'Hopp/Stunts',
    region: 'Vice Bay · Starfish Island',
    description:
      'Kom i hög fart från västra brofästet förbi Starfish Island och träffa rampen i 190+ km/h över kanalen.',
    x: 78.8,
    y: 45.4,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Stunt-hopp 2/50',
  },
  {
    id: 'mk-8',
    title: 'Wynwood Neon Mural Hemlighet',
    category: 'Hemligheter',
    region: 'Wynwood · Vice City',
    description:
      'Bakom galleriet på tredje gatan döljer en UV-belyst väggmålning en kod till ett hemligt kassaskåp.',
    x: 69.4,
    y: 31.2,
    imageUrl: IMG_DOWNTOWN,
    reward: '$20 000 + Samlartrofé',
  },
  {
    id: 'mk-9',
    title: 'Little Cuba Custom Lowrider',
    category: 'Speciella fordon',
    region: 'Little Cuba · Vice City',
    description:
      'Hydraulik-utrustad klassiker som dyker upp på innergården bakom Café Havana varje söndagskväll.',
    x: 63.2,
    y: 46.8,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Unik Lowrider',
  },
  {
    id: 'mk-10',
    title: 'Vice Port Tullfria Depot',
    category: 'Gömda paket',
    region: 'Vice Port',
    description:
      'Inne i lagerlokal 4B på hamnön mellan två gula trailers. Akta dig för privata säkerhetsvakter med ficklampor.',
    x: 77.2,
    y: 53.6,
    imageUrl: IMG_DOWNTOWN,
    reward: '$18 000',
  },
  {
    id: 'mk-11',
    title: 'VCIA Hangar 7 (Privatjet)',
    category: 'Speciella fordon',
    region: 'VCIA Airport',
    description:
      'Snabb affärsjet som står redo längst bort på norra landningsbanan. Kräver att man smyger förbi flygplatssäkerheten.',
    x: 63.8,
    y: 57.5,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Tillgång till Nimbus Jet',
  },

  // ================= LEONIDA KEYS =================
  {
    id: 'mk-12',
    title: 'Sunken U-båtspassage',
    category: 'Hemligheter',
    region: 'Leonida Keys',
    description:
      'Dyk ner 22 meter söder om Seven Mile-bron med dykutrustning för att inspektera ett sjunket smugglarvrak.',
    x: 41.2,
    y: 86.4,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Guldtackor & unik trofé',
  },
  {
    id: 'mk-13',
    title: 'Keys Amfibie-skoter (SeaShark Pro)',
    category: 'Speciella fordon',
    region: 'Leonida Keys',
    description:
      'Uppgraderad jet-ski med högre toppfart som spawner vid den östra marinan varje morgon mellan 06:00 och 10:00.',
    x: 57.6,
    y: 81.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Snabbaste vattenfarkosten i Keys',
  },
  {
    id: 'mk-14',
    title: 'Seven Mile Bridge Bro-hopp',
    category: 'Hopp/Stunts',
    region: 'Leonida Keys',
    description:
      'Den gamla raserade parallellbron fungerar som en enorm hoppramp ut över turkost öppet vatten.',
    x: 49.5,
    y: 83.8,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Stunt-hopp 3/50',
  },
  {
    id: 'mk-15',
    title: 'Sunset Key Smugglarpaket',
    category: 'Gömda paket',
    region: 'Leonida Keys · Sunset Key',
    description:
      'Under träbryggan längst västerut i arkipelagen ligger en vattentät väska fäst vid en boj.',
    x: 23.8,
    y: 90.4,
    imageUrl: IMG_VICE_BEACH,
    reward: '$22 000',
  },
  {
    id: 'mk-16',
    title: 'Key Largo Harpun & Dykbutik',
    category: 'Affärer',
    region: 'Leonida Keys',
    description:
      'Säljer dykardräkter, undervattenslampor och tysta harpunvapen för havsuppdrag.',
    x: 64.2,
    y: 77.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Dykutrustning upplåst',
  },

  // ================= GRASSRIVERS =================
  {
    id: 'mk-17',
    title: 'Övergivna träskbåtsbryggan',
    category: 'Hemligheter',
    region: 'Grassrivers',
    description:
      'En gammal träbrygga med fotogenlyktor djupt i träsket. Innehåller krypterade kartkoordinater och en gömd träskbåt.',
    x: 46.8,
    y: 61.5,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Ledtråd till Skunk Ape-mysteriet',
  },
  {
    id: 'mk-18',
    title: 'Tung hagelbrakare (Träskstugan)',
    category: 'Vapen',
    region: 'Grassrivers',
    description:
      'Gömställe bakom plåtskjulet norr om Alligator Alley. Var uppmärksam på alligatorer i vattnet runt bryggan.',
    x: 52.8,
    y: 57.0,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Combat Shotgun + Ammunition',
  },
  {
    id: 'mk-19',
    title: 'Alligator Alley Kurirpaket',
    category: 'Gömda paket',
    region: 'Grassrivers',
    description:
      'Gömt under brovalvet där luftbåtskanalen korsar motorvägen genom träsket.',
    x: 41.0,
    y: 59.0,
    imageUrl: IMG_GRASSRIVERS,
    reward: '$15 000',
  },
  {
    id: 'mk-20',
    title: 'Mangrove Vrakflygplan',
    category: 'Hemligheter',
    region: 'Grassrivers',
    description:
      'Ett gammalt smugglarplan halvt nedsänkt bland cypresserna. Inuti cockpit finns en unik guldrevolver.',
    x: 56.5,
    y: 67.2,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Unik Golden Revolver',
  },

  // ================= PORT GELLHORN =================
  {
    id: 'mk-21',
    title: 'Port Gellhorn Containerterminal',
    category: 'Gömda paket',
    region: 'Port Gellhorn',
    description:
      'Uppe på den andra kranbryggan i hamnen ligger en märkt fraktväska med kontanter och sällsynta reservdelar.',
    x: 13.6,
    y: 33.4,
    imageUrl: IMG_PORT_GELLHORN,
    reward: '$25 000',
  },
  {
    id: 'mk-22',
    title: 'Coastal Lodge Custom Garage',
    category: 'Affärer',
    region: 'Port Gellhorn',
    description:
      'Lokal trimverkstad bredvid motellkylten. Specialiserad på offroad-däck, turbokit och registreringsskyltbyten.',
    x: 18.4,
    y: 33.0,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Exklusiva fälgar upplåsta',
  },
  {
    id: 'mk-23',
    title: 'Gellhorn Kustbro Mega-hopp',
    category: 'Hopp/Stunts',
    region: 'Port Gellhorn',
    description:
      'Hoppa från arbetsrampen vid Gellhorn Causeway och landa på pråmen i bukten nedanför.',
    x: 15.8,
    y: 36.2,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Stunt-hopp 4/50',
  },
  {
    id: 'mk-24',
    title: 'Ammu-Nation West Coast',
    category: 'Affärer',
    region: 'Port Gellhorn',
    description:
      'Västkustens välfyllda vapenhandel längs huvudgatan, med jaktgevär och taktisk utrustning.',
    x: 19.6,
    y: 30.8,
    imageUrl: IMG_PORT_GELLHORN,
    reward: '10% rabatt efter uppdraget "Prolog"',
  },

  // ================= AMBROSIA & LAKE LEONIDA =================
  {
    id: 'mk-25',
    title: 'Ambrosia Sockerraffinaderi (RPG)',
    category: 'Vapen',
    region: 'Ambrosia',
    description:
      'På taket till den största silon vid raffinaderiet ligger ett raketgevär gömt bakom ventilationsrören.',
    x: 36.2,
    y: 39.2,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'RPG-7 + 4 raketer',
  },
  {
    id: 'mk-26',
    title: 'Ambrosia Heavy Hauler (Traktor/Truck)',
    category: 'Speciella fordon',
    region: 'Ambrosia',
    description:
      'Pansarförstärkt gruv- och godstruck som står parkerad vid bangården nattetid.',
    x: 34.4,
    y: 41.2,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Tungt ramningsfordon',
  },
  {
    id: 'mk-27',
    title: 'Lake Leonida Radarstation',
    category: 'Hemligheter',
    region: 'Lake Leonida',
    description:
      'Spana in parabolantennen norr om sjön mellan kl. 02:00 och 03:00 under åskväder för att trigga en dold radiosignal.',
    x: 48.2,
    y: 26.2,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Easter Egg-observation',
  },

  // ================= MOUNT KALAGA =================
  {
    id: 'mk-28',
    title: 'Mount Kalaga Peak Prickskyttegevär',
    category: 'Vapen',
    region: 'Mount Kalaga',
    description:
      'Vid utkikstornet på 842 meters höjd ligger ett avancerat prickskyttegevär intill skogvaktarens ryggsäck.',
    x: 36.8,
    y: 13.8,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Heavy Sniper Rifle',
  },
  {
    id: 'mk-29',
    title: 'Kalaga Canyon Rally-Banshee',
    category: 'Speciella fordon',
    region: 'Mount Kalaga',
    description:
      'Modifierad grusrallybil gömd under en presenning vid serpentinvägen väster om Kalaga Gorge.',
    x: 24.5,
    y: 16.5,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Unik Rally-Banshee',
  },
  {
    id: 'mk-30',
    title: 'Redhill Gorge Klipphopp',
    category: 'Hopp/Stunts',
    region: 'Mount Kalaga',
    description:
      'Kör i full fart nerför grusspåret och flyg över bergsklyftan ner mot Kalaga-flodens södra bank.',
    x: 44.5,
    y: 12.2,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Stunt-hopp 5/50',
  },
];
