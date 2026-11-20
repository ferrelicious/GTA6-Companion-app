import { MapMarker } from '../types';

export const LEONIDA_MAP_IMAGE = '/src/assets/images/leonida_map_1795167708260.jpg';

const IMG_VICE_BEACH = '/src/assets/images/poi_vice_beach_1795167709991.jpg';
const IMG_DOWNTOWN = '/src/assets/images/poi_downtown_vice_1795167710213.jpg';
const IMG_GRASSRIVERS = '/src/assets/images/poi_grassrivers_1795167709995.jpg';
const IMG_PORT_GELLHORN = '/src/assets/images/poi_port_gellhorn_1795167709806.jpg';

export const INITIAL_MARKERS: MapMarker[] = [
  {
    id: 'mk-1',
    title: 'Ocean Beach Art Deco Takpaket',
    category: 'Gömda paket',
    region: 'Vice Beach',
    description:
      'Klättra upp via brandstegen bakom Surfside Hotel för att hitta ett vattentätt kurirpaket gömt bakom neonskylten.',
    x: 86.2,
    y: 49.5,
    imageUrl: IMG_VICE_BEACH,
    reward: '$12 500 + Lås upp Vice Jacket',
  },
  {
    id: 'mk-2',
    title: 'Anpassad Cheetah Classic (Neon)',
    category: 'Speciella fordon',
    region: 'Vice Beach',
    description:
      'Står parkerad i det underjordiska garaget under Ocean View Promenade efter midnatt. Utrustad med unik lila-rosa lack.',
    x: 84.8,
    y: 58.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Sällsynt sportbil till garaget',
  },
  {
    id: 'mk-3',
    title: 'Ammu-Nation Flagship Vice',
    category: 'Affärer',
    region: 'Downtown Vice City',
    description:
      'Huvudbutik med komplett skjutbana inomhus, taktiska sikten, ljuddämpare och skottsäkra västar nivå 3.',
    x: 70.5,
    y: 50.8,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Rabatt vid fullföljd skjutbana',
  },
  {
    id: 'mk-4',
    title: 'Militärkarbin MK II',
    category: 'Vapen',
    region: 'Downtown Vice City',
    description:
      'Låst vapenväska vid byggkranens topp ovanför finansdistriktet. Kräver fallskärm eller helikopter för säker landning.',
    x: 69.2,
    y: 44.1,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Militärkarbin MK II',
  },
  {
    id: 'mk-5',
    title: 'Venetian Causeway Stunt-hopp',
    category: 'Hopp/Stunts',
    region: 'Vice Bay',
    description:
      'Använd en snabb motorcykel eller sportbil från västra brofästet och träffa rampen i 180+ km/h över kanalen.',
    x: 78.4,
    y: 53.0,
    imageUrl: IMG_DOWNTOWN,
    reward: 'Stunt-hopp 1/50 avklarat',
  },
  {
    id: 'mk-6',
    title: 'Övergivna träskbåtsbryggan',
    category: 'Hemligheter',
    region: 'Grassrivers',
    description:
      'En gammal träbrygga med fotogenlyktor djupt i träsket. Innehåller krypterade kartkoordinater och en gömd båt.',
    x: 49.0,
    y: 62.5,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Ledtråd till Skunk Ape-mysteriet',
  },
  {
    id: 'mk-7',
    title: 'Tung hagelbrakare (Träskstugan)',
    category: 'Vapen',
    region: 'Grassrivers',
    description:
      'Gömställe bakom plåtskjulet öster om kanalen. Var uppmärksam på alligatorer i vattnet runt bryggan.',
    x: 55.3,
    y: 55.8,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Combat Shotgun + Ammunition',
  },
  {
    id: 'mk-8',
    title: 'Port Gellhorn Containerterminal',
    category: 'Gömda paket',
    region: 'Port Gellhorn',
    description:
      'Uppe på den andra kranbryggan i hamnen ligger en märkt fraktväska med kontanter och sällsynta reservdelar.',
    x: 20.4,
    y: 28.6,
    imageUrl: IMG_PORT_GELLHORN,
    reward: '$25 000',
  },
  {
    id: 'mk-9',
    title: 'Coastal Lodge Custom Garage',
    category: 'Affärer',
    region: 'Port Gellhorn',
    description:
      'Lokal trimverkstad bredvid motellkylten. Specialiserad på offroad-däck, turbokit och registreringsskyltbyten.',
    x: 24.8,
    y: 34.0,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Exklusiva fälgar upplåsta',
  },
  {
    id: 'mk-10',
    title: 'Kustbrons Mega-hopp',
    category: 'Hopp/Stunts',
    region: 'Port Gellhorn',
    description:
      'Hoppa från den avbrutna arbetsrampen bredvid motorvägsbron och landa på pråmen i bukten nedanför.',
    x: 18.2,
    y: 33.4,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Stunt-hopp 2/50 avklarat',
  },
  {
    id: 'mk-11',
    title: 'Sunken U-båtspassage',
    category: 'Hemligheter',
    region: 'Leonida Keys',
    description:
      'Dyk ner 22 meter söder om Gator Keys-bron med dykutrustning för att inspektera ett sjunket smugglarvrak.',
    x: 46.5,
    y: 86.2,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Guldtackor & unik trofé',
  },
  {
    id: 'mk-12',
    title: 'Keys Amfibie-skoter (SeaShark Pro)',
    category: 'Speciella fordon',
    region: 'Leonida Keys',
    description:
      'Uppgraderad jet-ski med högre toppfart som spawner vid den södra marinan varje morgon mellan 06:00 och 10:00.',
    x: 56.8,
    y: 81.5,
    imageUrl: IMG_VICE_BEACH,
    reward: 'Snabbaste vattenfarkosten i Keys',
  },
  {
    id: 'mk-13',
    title: 'Lake Leonida Radarstation',
    category: 'Hemligheter',
    region: 'Lake Leonida',
    description:
      'Spana in parabolantennen norr om sjön mellan kl. 02:00 och 03:00 under åskväder för att trigga UFO-ljudsignalen.',
    x: 53.5,
    y: 16.5,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Easter Egg-observation',
  },
  {
    id: 'mk-14',
    title: 'North Shore Vapenlager',
    category: 'Vapen',
    region: 'Lake Leonida',
    description:
      'Bakom den övergivna båtmacken vid Lake Leonidas norra strand finns en prickskyttegevär-låda bakom några fat.',
    x: 47.6,
    y: 19.2,
    imageUrl: IMG_GRASSRIVERS,
    reward: 'Marksman Rifle + Kikarsikte',
  },
  {
    id: 'mk-15',
    title: 'Vice Port Tullfria Depot',
    category: 'Gömda paket',
    region: 'Vice Port',
    description:
      'Inne i lagerlokal 4B mellan två gula trailers. Akta dig för privata säkerhetsvakter med ficklampor.',
    x: 72.1,
    y: 62.4,
    imageUrl: IMG_DOWNTOWN,
    reward: '$18 000',
  },
  {
    id: 'mk-16',
    title: 'Kelly County Rally-Banshee',
    category: 'Speciella fordon',
    region: 'Kelly County',
    description:
      'Modifierad grusrallybil gömd under en presenning vid den gamla grustäkten längs västra landsvägen.',
    x: 31.2,
    y: 22.0,
    imageUrl: IMG_PORT_GELLHORN,
    reward: 'Unik Rally-Banshee',
  },
];
