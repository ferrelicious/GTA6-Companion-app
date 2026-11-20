export type Language = 'en' | 'sv' | 'es' | 'de' | 'fr' | 'pt';

export interface PatchLocaleContent {
  title: string;
  summary: string;
  officialNotes: string[];
  communityDiscoveries: string[];
}

export interface MarkerLocaleContent {
  title: string;
  description: string;
  reward?: string;
}

export interface ChecklistCategoryLocaleContent {
  label: string;
  description: string;
  weightLabel: string;
}

export interface ChecklistItemLocaleContent {
  title: string;
  requirement: string;
  reward?: string;
}

export interface CheatLocaleContent {
  name: string;
  effect: string;
}

export interface RadioLocaleContent {
  genre: string;
  description: string;
}

export interface ServerLocaleContent {
  overallLabel: string;
  summary: string;
  updatedAt: string;
  services: Record<string, { name: string; note: string }>;
}

export interface RssFallbackLocaleContent {
  title: string;
  summary: string;
  category: string;
}

export const PATCH_TRANSLATIONS: Record<Exclude<Language, 'sv'>, Record<string, PatchLocaleContent>> = {
  en: {
    'patch-01-004-000': {
      title: 'Leonida Performance & Vice Beach RT Update',
      summary:
        'Major stability update with improved frame pacing in dense Ocean Beach traffic zones plus economy and vehicle handling tuning.',
      officialNotes: [
        'Improved dynamic resolution scaling in Performance mode (60 fps) along Ocean Drive and Downtown Vice City.',
        'Fixed a bug where Lucia’s weapon wheel could freeze when quickly transitioning from boat to land.',
        'Adjusted police response times in Port Gellhorn following store robberies.',
        'Improved network sync and matchmaking for 32-player sessions in Leonida Online.',
      ],
      communityDiscoveries: [
        'Digital Foundry tests show palm tree shadow reflections now use half-rate raytracing in 60 fps mode.',
        'Stealth top-speed buff on Pegassi Vacca Classic (+6 km/h) and steadier suspension over speed bumps.',
        'Three new hidden graffiti murals appeared in the Wynwood district without being listed in the notes.',
      ],
    },
    'patch-01-003-002': {
      title: 'Hotfix: DualSense Haptics & Cloud Save Guard',
      summary:
        'PS5-exclusive hotfix addressing adaptive triggers and rest mode save synchronization.',
      officialNotes: [
        'Fixed an issue where DualSense trigger resistance dropped after certain Jason cutscenes.',
        'Prevented local autosaves from being overwritten when resuming from PS5 Rest Mode.',
      ],
      communityDiscoveries: [
        'Noticeably faster character-switch loading (~1.4s quicker) across the entire map.',
        'Fishing rod vibration in Leonida Keys is now more distinct when hooking larger fish.',
      ],
    },
    'patch-01-003-001': {
      title: 'Xbox Series X|S VRR & Audio Sync Patch',
      summary:
        'Targeted Xbox Series X|S update resolving VRR flicker and Dolby Atmos latency.',
      officialNotes: [
        'Resolved VRR brightness flicker in dark Grassrivers night scenes on 120 Hz displays.',
        'Corrected an ~80 ms audio delay when using Dolby Atmos over HDMI eARC.',
        'Improved memory management on Xbox Series S during high-speed helicopter flights.',
      ],
      communityDiscoveries: [
        'Quick Resume now works reliably even after 48 hours suspended without losing server connection.',
        'Texture streaming along the highway toward Lake Leonida now loads road signs at double distance.',
      ],
    },
    'patch-01-002-001': {
      title: 'Grassrivers Ecosystem & Economy Balance',
      summary:
        'Balance update tuning swamp wildlife, boat physics, and side-activity payouts.',
      officialNotes: [
        'Reduced unintended alligator attacks in shallow water when sneaking.',
        'Increased payouts by 15% for sea freight smuggling runs between Leonida Keys and Vice Port.',
        'Fixed a collision gap under the Venetian Causeway bridge where cars could clip through the road.',
      ],
      communityDiscoveries: [
        'NPC patrol officers now inspect van trunks more frequently late at night near Vice Port.',
        'Added hidden radio frequency interference when flying close to the Lake Leonida radar station.',
      ],
    },
    'patch-01-000-001': {
      title: 'Day One Launch Patch',
      summary:
        'Mandatory launch update enabling full Photo Mode, lighting polish, and day-one stability.',
      officialNotes: [
        'Enables full Photo Mode with free camera, neon filters, and depth of field.',
        'Final optimization of global illumination (GI) and wet reflections across the state of Leonida.',
        'Unlocks social feeds and photo challenges linked to your Rockstar Games account.',
      ],
      communityDiscoveries: [
        'Adds over 40 extra randomized GATV social feed events on the in-game phone.',
        'Improves fuel consumption and wear effects on tuned speedboats compared to the disc build.',
      ],
    },
  },
  es: {
    'patch-01-004-000': {
      title: 'Actualización de rendimiento en Leonida y RT en Vice Beach',
      summary:
        'Gran actualización de estabilidad con mejor fluidez en zonas densas de Ocean Beach y ajustes de economía y manejo.',
      officialNotes: [
        'Escalado de resolución dinámico mejorado en modo Rendimiento (60 fps) por Ocean Drive y Downtown Vice City.',
        'Corregido un error por el que la rueda de armas de Lucia se congelaba al pasar rápido del barco a tierra.',
        'Ajustado el tiempo de respuesta policial en Port Gellhorn tras robos en tiendas.',
        'Sincronización de red y emparejamiento mejorados para sesiones de 32 jugadores en Leonida Online.',
      ],
      communityDiscoveries: [
        'Pruebas de Digital Foundry muestran sombras con raytracing a mitad de coste en el modo de 60 fps.',
        'Mejora oculta de velocidad máxima en el Pegassi Vacca Classic (+6 km/h) y suspensión más estable.',
        'Tres nuevos murales ocultos aparecieron en el distrito de Wynwood sin figurar en las notas.',
      ],
    },
    'patch-01-003-002': {
      title: 'Hotfix: Háptica DualSense y protección de Cloud Save',
      summary: 'Parche rápido exclusivo de PS5 para gatillos adaptativos y modo reposo.',
      officialNotes: [
        'Solucionado un fallo por el que la resistencia del DualSense desaparecía tras ciertas escenas con Jason.',
        'Evitada la sobrescritura de autoguardados locales al reanudar desde el modo reposo de PS5.',
      ],
      communityDiscoveries: [
        'Cambio de personaje notablemente más rápido (~1,4 s menos) por todo el mapa.',
        'La vibración de la caña en Leonida Keys ahora distingue mejor las capturas grandes.',
      ],
    },
    'patch-01-003-001': {
      title: 'Parche de VRR y sincronización de audio en Xbox Series X|S',
      summary: 'Actualización específica para Xbox Series X|S que corrige el parpadeo VRR y el retardo de Dolby Atmos.',
      officialNotes: [
        'Eliminado el parpadeo de brillo VRR en escenas nocturnas de Grassrivers en pantallas de 120 Hz.',
        'Corregido un retardo de ~80 ms al usar Dolby Atmos por HDMI eARC.',
        'Mejorada la gestión de memoria en Xbox Series S durante vuelos rápidos en helicóptero.',
      ],
      communityDiscoveries: [
        'Quick Resume funciona de forma fiable incluso tras 48 horas sin perder conexión.',
        'La carga de texturas hacia Lake Leonida ahora muestra señales al doble de distancia.',
      ],
    },
    'patch-01-002-001': {
      title: 'Equilibrio de ecosistema en Grassrivers y economía',
      summary: 'Ajustes de fauna en los pantanos, física náutica y pagos de actividades secundarias.',
      officialNotes: [
        'Reducidos los ataques inesperados de caimanes en aguas poco profundas al ir en sigilo.',
        'Aumentadas un 15% las recompensas por contrabando marítimo entre Leonida Keys y Vice Port.',
        'Corregido un hueco de colisión bajo el puente Venetian Causeway.',
      ],
      communityDiscoveries: [
        'Los policías NPC revisan maleteros de furgonetas con más frecuencia de noche en Vice Port.',
        'Añadida interferencia de radio oculta al volar cerca del radar de Lake Leonida.',
      ],
    },
    'patch-01-000-001': {
      title: 'Parche de lanzamiento Día Uno',
      summary: 'Actualización obligatoria de estreno con Modo Foto completo, iluminación final y estabilidad.',
      officialNotes: [
        'Activa el Modo Foto completo con cámara libre, filtros neón y profundidad de campo.',
        'Optimización final de iluminación global y reflejos bajo lluvia en todo Leonida.',
        'Desbloquea retos fotográficos y feeds sociales vinculados a Rockstar Games.',
      ],
      communityDiscoveries: [
        'Añade más de 40 eventos aleatorios adicionales en el feed social del teléfono.',
        'Mejora los efectos de consumo y desgaste en lanchas modificadas respecto al disco.',
      ],
    },
  },
  de: {
    'patch-01-004-000': {
      title: 'Leonida Performance- & Vice Beach RT-Update',
      summary:
        'Großes Stabilitätsupdate mit besserer Bildrate im dichten Verkehr von Ocean Beach sowie Wirtschafts- und Fahrzeug-Feintuning.',
      officialNotes: [
        'Verbesserte dynamische Auflösungsskalierung im Performance-Modus (60 fps) entlang des Ocean Drive und in Downtown Vice City.',
        'Fehler behoben, bei dem Lucias Waffenrad beim schnellen Wechsel vom Boot an Land einfrieren konnte.',
        'Polizei-Reaktionszeiten in Port Gellhorn nach Ladenüberfällen angepasst.',
        'Netzwerksynchronisation und Matchmaking für 32-Spieler-Sitzungen in Leonida Online verbessert.',
      ],
      communityDiscoveries: [
        'Digital-Foundry-Tests zeigen, dass Palmblattschatten im 60-fps-Modus mit halber Raytracing-Rate berechnet werden.',
        'Heimlicher Top-Speed-Buff für den Pegassi Vacca Classic (+6 km/h) und stabileres Fahrwerk.',
        'Drei neue versteckte Graffiti-Wandbilder im Stadtteil Wynwood entdeckt.',
      ],
    },
    'patch-01-003-002': {
      title: 'Hotfix: DualSense-Haptik & Cloud-Save-Schutz',
      summary: 'PS5-exklusiver Hotfix für adaptive Trigger und Ruhemodus-Speicherstände.',
      officialNotes: [
        'Problem behoben, bei dem der DualSense-Widerstand nach bestimmten Jason-Zwischensequenzen ausfiel.',
        'Überschreiben lokaler Autosaves beim Aufwecken aus dem PS5-Ruhemodus verhindert.',
      ],
      communityDiscoveries: [
        'Deutlich schnellerer Charakterwechsel (~1,4 Sek. schneller) über die gesamte Karte.',
        'Angelruten-Vibration in den Leonida Keys gibt bei großen Fischen klareres Feedback.',
      ],
    },
    'patch-01-003-001': {
      title: 'Xbox Series X|S VRR- & Audio-Sync-Patch',
      summary: 'Gezieltes Update für Xbox Series X|S gegen VRR-Flimmern und Dolby-Atmos-Verzögerung.',
      officialNotes: [
        'VRR-Helligkeitsflimmern in dunklen Nachtszenen in den Grassrivers auf 120-Hz-Displays behoben.',
        'Audioverzögerung von ~80 ms bei Dolby Atmos über HDMI eARC korrigiert.',
        'Speicherverwaltung auf der Xbox Series S bei schnellen Helikopterflügen verbessert.',
      ],
      communityDiscoveries: [
        'Quick Resume funktioniert nun auch nach 48 Stunden zuverlässig ohne Serverabbruch.',
        'Textur-Streaming entlang des Highways Richtung Lake Leonida lädt Schilder doppelt so früh.',
      ],
    },
    'patch-01-002-001': {
      title: 'Grassrivers-Ökosystem & Wirtschafts-Balance',
      summary: 'Balancing für Sumpf-Wildtiere, Bootsphysik und Nebenmissions-Auszahlungen.',
      officialNotes: [
        'Unbeabsichtigte Alligator-Angriffe im flachen Wasser im Schleichmodus reduziert.',
        'Auszahlungen für Seefracht-Schmuggel zwischen Leonida Keys und Vice Port um 15 % erhöht.',
        'Kollisionsfehler unter dem Venetian Causeway behoben.',
      ],
      communityDiscoveries: [
        'NPC-Polizisten kontrollieren nachts häufiger Lieferwagen in der Nähe von Vice Port.',
        'Versteckte Funkstörung beim Überfliegen der Radarstation am Lake Leonida hinzugefügt.',
      ],
    },
    'patch-01-000-001': {
      title: 'Day-One Launch-Patch',
      summary: 'Pflicht-Update zum Release mit komplettem Fotomodus, finaler Beleuchtung und Stabilität.',
      officialNotes: [
        'Aktiviert den vollständigen Fotomodus mit freier Kamera, Neonfiltern und Tiefenschärfe.',
        'Finale Optimierung der globalen Beleuchtung (GI) und Regenreflexionen in ganz Leonida.',
        'Schaltet Social-Feeds und Foto-Challenges für das Rockstar-Konto frei.',
      ],
      communityDiscoveries: [
        'Fügt über 40 zusätzliche zufällige GATV-Social-Events im Handy-Feed hinzu.',
        'Verbessert Kraftstoff- und Verschleißeffekte getunter Schnellboote gegenüber der Disc-Version.',
      ],
    },
  },
  fr: {
    'patch-01-004-000': {
      title: 'Mise à jour Performance Leonida & Ray Tracing Vice Beach',
      summary:
        'Mise à jour majeure de stabilité améliorant le framerate dans le trafic dense d’Ocean Beach et l’équilibrage des véhicules.',
      officialNotes: [
        'Mise à l’échelle dynamique améliorée en mode Performance (60 fps) sur Ocean Drive et Downtown Vice City.',
        'Correction d’un blocage de la roue d’armes de Lucia lors du passage rapide du bateau à la terre.',
        'Temps de réponse policière ajusté à Port Gellhorn après les braquages de magasins.',
        'Synchronisation réseau et matchmaking optimisés pour 32 joueurs dans Leonida Online.',
      ],
      communityDiscoveries: [
        'Les tests Digital Foundry montrent un raytracing des ombres à demi-coût en mode 60 fps.',
        'Amélioration discrète de la vitesse de pointe de la Pegassi Vacca Classic (+6 km/h).',
        'Trois nouvelles fresques secrètes sont apparues à Wynwood sans mention dans les notes.',
      ],
    },
    'patch-01-003-002': {
      title: 'Correctif : Retour haptique DualSense & Cloud Save',
      summary: 'Correctif exclusif PS5 pour les gâchettes adaptatives et le mode repos.',
      officialNotes: [
        'Correction de la perte de résistance DualSense après certaines cinématiques de Jason.',
        'Protection contre l’écrasement des sauvegardes automatiques en sortie de mode repos PS5.',
      ],
      communityDiscoveries: [
        'Changement de personnage nettement plus rapide (~1,4 s gagnée) sur toute la carte.',
        'Vibration de la canne à pêche plus précise dans les Leonida Keys pour les gros poissons.',
      ],
    },
    'patch-01-003-001': {
      title: 'Patch VRR & synchronisation audio Xbox Series X|S',
      summary: 'Mise à jour ciblée Xbox Series X|S corrigeant le scintillement VRR et la latence Dolby Atmos.',
      officialNotes: [
        'Suppression du scintillement VRR dans les scènes nocturnes des Grassrivers sur écrans 120 Hz.',
        'Correction d’un décalage audio de ~80 ms avec Dolby Atmos via HDMI eARC.',
        'Gestion mémoire optimisée sur Xbox Series S lors des vols rapides en hélicoptère.',
      ],
      communityDiscoveries: [
        'Quick Resume reste stable même après 48 heures en veille sans déconnexion serveur.',
        'Le streaming des panneaux routiers vers Lake Leonida charge deux fois plus loin.',
      ],
    },
    'patch-01-002-001': {
      title: 'Écosystème des Grassrivers & équilibre économique',
      summary: 'Rééquilibrage de la faune des marais, de la physique des bateaux et des gains secondaires.',
      officialNotes: [
        'Réduction des attaques imprévues d’alligators en eau peu profonde en mode furtif.',
        'Gains augmentés de 15 % pour la contrebande maritime entre les Leonida Keys et Vice Port.',
        'Correction d’une collision manquante sous le pont Venetian Causeway.',
      ],
      communityDiscoveries: [
        'Les policiers PNJ inspectent plus souvent les coffres de fourgons la nuit près de Vice Port.',
        'Interférence radio secrète ajoutée près de la station radar de Lake Leonida.',
      ],
    },
    'patch-01-000-001': {
      title: 'Patch de lancement Jour 1',
      summary: 'Mise à jour obligatoire incluant le Mode Photo complet, l’éclairage final et la stabilité.',
      officialNotes: [
        'Active le Mode Photo complet avec caméra libre, filtres néon et profondeur de champ.',
        'Optimisation finale de l’illumination globale (GI) et des reflets sous la pluie dans tout Leonida.',
        'Débloque les défis photo et fils sociaux liés au compte Rockstar Games.',
      ],
      communityDiscoveries: [
        'Ajoute plus de 40 événements aléatoires supplémentaires sur le fil social du téléphone.',
        'Améliore les effets de carburant et d’usure sur les hors-bords modifiés.',
      ],
    },
  },
  pt: {
    'patch-01-004-000': {
      title: 'Atualização de Desempenho em Leonida e RT em Vice Beach',
      summary:
        'Grande atualização de estabilidade com melhor taxa de quadros no trânsito de Ocean Beach e ajustes de economia e direção.',
      officialNotes: [
        'Escalonamento dinâmico de resolução aprimorado no modo Desempenho (60 fps) em Ocean Drive e Downtown Vice City.',
        'Corrigido um bug em que a roda de armas de Lucia travava ao sair rápido do barco para a terra.',
        'Tempo de resposta policial ajustado em Port Gellhorn após assaltos a lojas.',
        'Sincronização de rede e matchmaking melhorados para sessões de 32 jogadores em Leonida Online.',
      ],
      communityDiscoveries: [
        'Testes da Digital Foundry mostram sombras com raytracing pela metade do custo no modo 60 fps.',
        'Aumento discreto na velocidade máxima do Pegassi Vacca Classic (+6 km/h) e suspensão mais firme.',
        'Três novos murais secretos surgiram no distrito de Wynwood sem menção nas notas.',
      ],
    },
    'patch-01-003-002': {
      title: 'Hotfix: Háptica DualSense e Proteção de Cloud Save',
      summary: 'Correção rápida exclusiva do PS5 para gatilhos adaptáveis e modo de repouso.',
      officialNotes: [
        'Corrigido problema em que a resistência dos gatilhos DualSense caía após certas cenas de Jason.',
        'Impedido que salvamentos automáticos locais fossem sobrescritos ao retornar do Modo de Repouso do PS5.',
      ],
      communityDiscoveries: [
        'Troca de personagem visivelmente mais rápida (~1,4 s mais ágil) por todo o mapa.',
        'Vibração da vara de pesca em Leonida Keys está mais nítida ao fisgar peixes grandes.',
      ],
    },
    'patch-01-003-001': {
      title: 'Patch de VRR e Sincronia de Áudio no Xbox Series X|S',
      summary: 'Atualização dedicada ao Xbox Series X|S corrigindo cintilação de VRR e atraso no Dolby Atmos.',
      officialNotes: [
        'Resolvida cintilação de brilho VRR em cenas noturnas escuras de Grassrivers em telas 120 Hz.',
        'Corrigido atraso de ~80 ms no áudio ao usar Dolby Atmos via HDMI eARC.',
        'Gerenciamento de memória aprimorado no Xbox Series S em voos rápidos de helicóptero.',
      ],
      communityDiscoveries: [
        'Quick Resume agora funciona de forma confiável mesmo após 48 horas suspenso sem perder conexão.',
        'Streaming de texturas na rodovia rumo a Lake Leonida carrega placas ao dobro da distância.',
      ],
    },
    'patch-01-002-001': {
      title: 'Ecossistema de Grassrivers e Equilíbrio Econômico',
      summary: 'Balanceamento da fauna do pântano, física de barcos e pagamentos secundários.',
      officialNotes: [
        'Reduzidos ataques inesperados de jacarés em águas rasas durante furtividade.',
        'Pagamentos aumentados em 15% para contrabando marítimo entre Leonida Keys e Vice Port.',
        'Corrigida falha de colisão sob a ponte Venetian Causeway.',
      ],
      communityDiscoveries: [
        'Policiais NPC revistam porta-malas de vans com mais frequência à noite perto de Vice Port.',
        'Adicionada interferência de rádio oculta ao voar perto da estação de radar de Lake Leonida.',
      ],
    },
    'patch-01-000-001': {
      title: 'Patch de Lançamento Dia Um',
      summary: 'Atualização obrigatória com Modo Foto completo, polimento de iluminação e estabilidade inicial.',
      officialNotes: [
        'Ativa o Modo Foto completo com câmera livre, filtros neon e profundidade de campo.',
        'Otimização final de iluminação global (GI) e reflexos na chuva por todo o estado de Leonida.',
        'Desbloqueia feeds sociais e desafios fotográficos vinculados à conta Rockstar Games.',
      ],
      communityDiscoveries: [
        'Adiciona mais de 40 eventos aleatórios extras no feed social do celular.',
        'Melhora efeitos de combustível e desgaste em lanchas modificadas frente à versão em disco.',
      ],
    },
  },
};

export const MARKER_TRANSLATIONS: Record<Exclude<Language, 'sv'>, Record<string, MarkerLocaleContent>> = {
  en: {
    'mk-1': { title: 'Ocean Beach Art Deco Rooftop Stash', description: 'Climb the fire escape behind Surfside Hotel along Ocean Drive to find a waterproof courier package hidden behind the neon sign.', reward: '$12,500 + Vice Jacket' },
    'mk-2': { title: 'Custom Cheetah Classic (Neon)', description: 'Parked in the underground garage beneath Ocean View Promenade after midnight, featuring a unique neon pink finish.', reward: 'Rare sports car for garage' },
    'mk-3': { title: 'North Beach Lifeguard Jump', description: 'Use the sand berm north of Ocean Drive and launch straight across the low pier toward the water.', reward: 'Stunt Jump 1/50' },
    'mk-4': { title: 'Ocean Drive Design Boutique', description: 'Upscale clothing shop offering 80s-inspired linen suits, sunglasses, and neon accessories for Lucia and Jason.', reward: '15% VIP discount' },
    'mk-5': { title: 'Ammu-Nation Flagship Vice', description: 'Flagship store featuring an indoor shooting range, tactical optics, suppressors, and Level 3 armor.', reward: 'Free range trial' },
    'mk-6': { title: 'Military Carbine MK II (Crane)', description: 'Locked weapon case atop the construction crane above the financial district. Requires parachute or helicopter.', reward: 'Military Carbine MK II' },
    'mk-7': { title: 'Venetian Causeway Stunt Jump', description: 'Approach at high speed from the western bridgehead past Starfish Island and hit the ramp at 190+ km/h.', reward: 'Stunt Jump 2/50' },
    'mk-8': { title: 'Wynwood Neon Mural Secret', description: 'Behind the 3rd Street gallery, a UV-lit mural conceals the combination to a hidden safe.', reward: '$20,000 + Collector Trophy' },
    'mk-9': { title: 'Little Cuba Custom Lowrider', description: 'Hydraulics-equipped classic spawning in the courtyard behind Café Havana every Sunday night.', reward: 'Unique Lowrider' },
    'mk-10': { title: 'Vice Port Duty-Free Depot', description: 'Inside Warehouse 4B on the port island between two yellow trailers. Watch out for private guards.', reward: '$18,000' },
    'mk-11': { title: 'VCIA Hangar 7 (Private Jet)', description: 'Fast business jet parked at the far end of the northern runway. Sneak past airport security.', reward: 'Nimbus Jet access' },
    'mk-12': { title: 'Sunken Submarine Passage', description: 'Dive 22 meters south of Seven Mile Bridge with scuba gear to inspect a sunken smuggler wreck.', reward: 'Gold bars & unique trophy' },
    'mk-13': { title: 'Keys Amphibious Scooter (SeaShark Pro)', description: 'Upgraded jet-ski with higher top speed spawning at the eastern marina every morning 06:00–10:00.', reward: 'Fastest watercraft in the Keys' },
    'mk-14': { title: 'Seven Mile Bridge Jump', description: 'The collapsed parallel span serves as a massive stunt ramp over open turquoise water.', reward: 'Stunt Jump 3/50' },
    'mk-15': { title: 'Sunset Key Smuggler Package', description: 'Tied to a buoy beneath the wooden dock at the far western tip of the archipelago.', reward: '$22,000' },
    'mk-16': { title: 'Key Largo Harpoon & Dive Shop', description: 'Sells diving suits, underwater torches, and silent harpoon guns for maritime missions.', reward: 'Diving gear unlocked' },
    'mk-17': { title: 'Abandoned Swamp Boat Dock', description: 'An old lantern-lit wooden pier deep in the marsh containing encrypted coordinates and a hidden airboat.', reward: 'Skunk Ape mystery clue' },
    'mk-18': { title: 'Heavy Combat Shotgun (Swamp Shack)', description: 'Stashed behind the tin shed north of Alligator Alley. Watch out for gators near the pier.', reward: 'Combat Shotgun + Ammo' },
    'mk-19': { title: 'Alligator Alley Courier Stash', description: 'Hidden beneath the bridge arch where the airboat channel crosses the swamp expressway.', reward: '$15,000' },
    'mk-20': { title: 'Mangrove Plane Wreck', description: 'An old smuggler aircraft half-submerged among cypress trees. Inside the cockpit lies a golden revolver.', reward: 'Unique Golden Revolver' },
    'mk-21': { title: 'Port Gellhorn Container Terminal', description: 'Atop the second crane gantry at the harbor sits a marked cargo bag with cash and rare parts.', reward: '$25,000' },
    'mk-22': { title: 'Coastal Lodge Custom Garage', description: 'Local tuning shop beside the motel sign specializing in off-road tires, turbos, and plate swaps.', reward: 'Exclusive rims unlocked' },
    'mk-23': { title: 'Gellhorn Causeway Mega Jump', description: 'Launch off the construction ramp beside the causeway and land on the barge in the bay below.', reward: 'Stunt Jump 4/50' },
    'mk-24': { title: 'Ammu-Nation West Coast', description: 'Well-stocked west coast gun shop along Main Street featuring hunting rifles and tactical gear.', reward: '10% discount after Prologue' },
    'mk-25': { title: 'Ambrosia Sugar Refinery (RPG)', description: 'On the roof of the tallest refinery silo lies an RPG launcher hidden behind ventilation ducts.', reward: 'RPG-7 + 4 rockets' },
    'mk-26': { title: 'Ambrosia Heavy Hauler', description: 'Armored mining and freight truck parked at the rail yard during nighttime hours.', reward: 'Heavy ramming vehicle' },
    'mk-27': { title: 'Lake Leonida Radar Station', description: 'Observe the radar dish north of the lake between 02:00 and 03:00 during a thunderstorm to trigger a hidden signal.', reward: 'Easter Egg observation' },
    'mk-28': { title: 'Mount Kalaga Peak Sniper Rifle', description: 'At the 842 m lookout tower sits an advanced sniper rifle beside a ranger backpack.', reward: 'Heavy Sniper Rifle' },
    'mk-29': { title: 'Kalaga Canyon Rally-Banshee', description: 'Modified gravel rally car hidden under a tarp on the switchback road west of Kalaga Gorge.', reward: 'Unique Rally-Banshee' },
    'mk-30': { title: 'Redhill Gorge Cliff Jump', description: 'Speed down the dirt trail and soar across the canyon gap toward the southern bank of Kalaga River.', reward: 'Stunt Jump 5/50' },
  },
  es: {
    'mk-1': { title: 'Paquete Art Déco en Ocean Beach', description: 'Sube por la escalera de incendios detrás del Surfside Hotel en Ocean Drive para hallar un paquete oculto tras el neón.', reward: '$12 500 + Chaqueta Vice' },
    'mk-2': { title: 'Cheetah Classic (Neón)', description: 'Aparcado en el garaje subterráneo bajo Ocean View Promenade tras medianoche con pintura rosa neón única.', reward: 'Deportivo raro' },
    'mk-3': { title: 'Salto de North Beach', description: 'Usa la duna al norte de Ocean Drive y salta sobre el muelle hacia el agua.', reward: 'Salto acrobático 1/50' },
    'mk-4': { title: 'Boutique Ocean Drive', description: 'Tienda exclusiva con trajes de lino ochenteros, gafas y accesorios neón.', reward: '15% descuento VIP' },
    'mk-5': { title: 'Ammu-Nation Flagship Vice', description: 'Tienda principal con galería de tiro cubierta, miras tácticas y chalecos nivel 3.', reward: 'Prueba de tiro gratis' },
    'mk-6': { title: 'Carabina Militar MK II (Grúa)', description: 'Maletín cerrado en lo alto de la grúa del distrito financiero. Requiere paracaídas o helicóptero.', reward: 'Carabina Militar MK II' },
    'mk-7': { title: 'Salto Venetian Causeway', description: 'Acelera desde el puente oeste pasando Starfish Island a más de 190 km/h sobre el canal.', reward: 'Salto acrobático 2/50' },
    'mk-8': { title: 'Secreto del Mural Neón en Wynwood', description: 'Detrás de la galería de la calle 3, un mural UV revela el código de una caja fuerte.', reward: '$20 000 + Trofeo' },
    'mk-9': { title: 'Lowrider de Little Cuba', description: 'Clásico con hidráulica que aparece tras el Café Havana cada domingo por la noche.', reward: 'Lowrider único' },
    'mk-10': { title: 'Depósito Libre de Vice Port', description: 'Dentro del almacén 4B entre dos remolques amarillos. Cuidado con los guardias privados.', reward: '$18 000' },
    'mk-11': { title: 'Hangar 7 de VCIA (Jet privado)', description: 'Jet rápido listo al final de la pista norte. Evita la seguridad del aeropuerto.', reward: 'Acceso a Nimbus Jet' },
    'mk-12': { title: 'Pasaje del Submarino Hundido', description: 'Bucea 22 metros al sur de Seven Mile Bridge para inspeccionar un naufragio contrabandista.', reward: 'Lingotes de oro' },
    'mk-13': { title: 'Moto acuática SeaShark Pro', description: 'Moto de agua mejorada en el puerto deportivo este cada mañana de 06:00 a 10:00.', reward: 'Vehículo acuático rápido' },
    'mk-14': { title: 'Salto del Seven Mile Bridge', description: 'El antiguo tramo derruido sirve de rampa gigante sobre el mar turquesa.', reward: 'Salto acrobático 3/50' },
    'mk-15': { title: 'Paquete de Sunset Key', description: 'Bajo el muelle de madera en el extremo oeste del archipiélago.', reward: '$22 000' },
    'mk-16': { title: 'Tienda de Buceo Key Largo', description: 'Vende trajes de buzo, linternas subacuáticas y arpones silenciosos.', reward: 'Equipo de buceo' },
    'mk-17': { title: 'Muelle Abandonado del Pantano', description: 'Antiguo muelle con faroles en el pantano con coordenadas cifradas y una hidrodeslizadora.', reward: 'Pista del misterio Skunk Ape' },
    'mk-18': { title: 'Escopeta de Combate (Cabaña)', description: 'Escondida tras el cobertizo al norte de Alligator Alley. Cuidado con los caimanes.', reward: 'Escopeta + Munición' },
    'mk-19': { title: 'Paquete de Alligator Alley', description: 'Oculto bajo el arco del puente donde el canal cruza la autopista.', reward: '$15 000' },
    'mk-20': { title: 'Avión Estrellado en Manglares', description: 'Avioneta semisumergida entre cipreses con un revólver dorado en la cabina.', reward: 'Revólver Dorado único' },
    'mk-21': { title: 'Terminal de Contenedores Port Gellhorn', description: 'En la segunda grúa del puerto hay una bolsa con efectivo y piezas raras.', reward: '$25 000' },
    'mk-22': { title: 'Taller Coastal Lodge Custom', description: 'Taller local especializado en neumáticos todoterreno, turbos y matrículas.', reward: 'Llantas exclusivas' },
    'mk-23': { title: 'Megasalto Puente de Gellhorn', description: 'Salta desde la rampa de obra hacia la barcaza en la bahía.', reward: 'Salto acrobático 4/50' },
    'mk-24': { title: 'Ammu-Nation Costa Oeste', description: 'Armería completa en la calle principal con rifles de caza y equipo táctico.', reward: '10% dto. tras Prólogo' },
    'mk-25': { title: 'Refinería de Ambrosia (RPG)', description: 'En el techo del silo mayor hay un lanzacohetes oculto tras los conductos.', reward: 'RPG-7 + 4 cohetes' },
    'mk-26': { title: 'Camión Blindado de Ambrosia', description: 'Camión minero reforzado estacionado de noche junto a la estación de carga.', reward: 'Vehículo pesado' },
    'mk-27': { title: 'Estación de Radar Lake Leonida', description: 'Observa la antena al norte del lago entre 02:00 y 03:00 con tormenta.', reward: 'Easter Egg' },
    'mk-28': { title: 'Rifle Francotirador Mount Kalaga', description: 'En la torre de vigilancia a 842 m junto a la mochila del guardabosques.', reward: 'Rifle de francotirador pesado' },
    'mk-29': { title: 'Rally-Banshee de Kalaga Canyon', description: 'Coche de rally oculto bajo una lona al oeste de Kalaga Gorge.', reward: 'Rally-Banshee único' },
    'mk-30': { title: 'Salto Acantilado Redhill Gorge', description: 'Lánzate por el sendero de tierra sobre el cañón hacia el río Kalaga.', reward: 'Salto acrobático 5/50' },
  },
  de: {
    'mk-1': { title: 'Ocean Beach Art-Deco-Dachpaket', description: 'Klettere über die Feuerleiter hinter dem Surfside Hotel hoch zum versteckten Kurierpaket.', reward: '12.500 $ + Vice-Jacke' },
    'mk-2': { title: 'Cheetah Classic (Neon)', description: 'Steht nach Mitternacht in der Tiefgarage unter der Ocean View Promenade in einzigartigem Neonpink.', reward: 'Seltener Sportwagen' },
    'mk-3': { title: 'North Beach Rettungsschwimmer-Sprung', description: 'Nutze die Sanddüne nördlich des Ocean Drive für einen Sprung über den Steg.', reward: 'Stunt-Sprung 1/50' },
    'mk-4': { title: 'Ocean Drive Design Boutique', description: 'Exklusive Boutique mit 80er-Leinenanzügen, Sonnenbrillen und Neon-Accessoires.', reward: '15 % VIP-Rabatt' },
    'mk-5': { title: 'Ammu-Nation Flagship Vice', description: 'Hauptfiliale mit Indoor-Schießstand, taktischen Visieren und Panzerung Stufe 3.', reward: 'Kostenloser Schießstand' },
    'mk-6': { title: 'Militärkarabiner MK II (Kran)', description: 'Verschlossener Waffenkoffer auf dem Baukran im Finanzviertel. Fallschirm oder Heli nötig.', reward: 'Militärkarabiner MK II' },
    'mk-7': { title: 'Venetian Causeway Stunt-Sprung', description: 'Fahre mit über 190 km/h über die Rampe nahe Starfish Island über den Kanal.', reward: 'Stunt-Sprung 2/50' },
    'mk-8': { title: 'Wynwood Neon-Wandbild-Geheimnis', description: 'Hinter der Galerie zeigt ein UV-Wandbild den Code für einen versteckten Tresor.', reward: '20.000 $ + Trophäe' },
    'mk-9': { title: 'Little Cuba Custom Lowrider', description: 'Klassiker mit Hydraulik jeden Sonntagabend hinter dem Café Havana.', reward: 'Einzigartiger Lowrider' },
    'mk-10': { title: 'Vice Port Zollfreilager', description: 'In Lagerhalle 4B zwischen zwei gelben Trailern. Vorsicht vor Sicherheitskräften.', reward: '18.000 $' },
    'mk-11': { title: 'VCIA Hangar 7 (Privatjet)', description: 'Schneller Business-Jet am Ende der Nordbahn. Sicherheitsdienst umgehen.', reward: 'Nimbus-Jet-Zugang' },
    'mk-12': { title: 'Gesunkener U-Boot-Durchgang', description: 'Tauche 22 m südlich der Seven Mile Bridge zum gesunkenen Schmugglerwrack.', reward: 'Goldbarren & Trophäe' },
    'mk-13': { title: 'Keys Amphibien-Jetski (SeaShark Pro)', description: 'Schneller Jetski an der Ost-Marina täglich zwischen 06:00 und 10:00 Uhr.', reward: 'Schnellstes Wasserfahrzeug' },
    'mk-14': { title: 'Seven Mile Bridge Sprung', description: 'Die eingestürzte Nebenbrücke dient als gewaltige Sprungrampe über türkises Wasser.', reward: 'Stunt-Sprung 3/50' },
    'mk-15': { title: 'Sunset Key Schmugglerpaket', description: 'Unter dem Holzsteg ganz im Westen des Archipels an einer Boje befestigt.', reward: '22.000 $' },
    'mk-16': { title: 'Key Largo Harpunen- & Tauchshop', description: 'Verkauft Taucheranzüge, Unterwasserlampen und lautlose Harpunen.', reward: 'Tauchausrüstung' },
    'mk-17': { title: 'Verlassener Sumpfboot-Steg', description: 'Laternenbeleuchteter Steg tief im Sumpf mit verschlüsselten Koordinaten.', reward: 'Hinweis zum Skunk-Ape-Rätsel' },
    'mk-18': { title: 'Schwere Kampfschrotflinte', description: 'Hinter dem Blechschuppen nördlich der Alligator Alley. Vorsicht vor Alligatoren.', reward: 'Kampfschrotflinte + Munition' },
    'mk-19': { title: 'Alligator Alley Kurierpaket', description: 'Unter dem Brückenbogen, wo der Luftkissenboot-Kanal den Highway kreuzt.', reward: '15.000 $' },
    'mk-20': { title: 'Mangroven-Flugzeugwrack', description: 'Halb versunkenes Schmugglerflugzeug mit einem goldenen Revolver im Cockpit.', reward: 'Goldener Revolver' },
    'mk-21': { title: 'Port Gellhorn Containerterminal', description: 'Auf der zweiten Kranbrücke liegt eine Tasche mit Bargeld und seltenen Teilen.', reward: '25.000 $' },
    'mk-22': { title: 'Coastal Lodge Custom Garage', description: 'Lokale Tuning-Werkstatt für Offroad-Reifen, Turbos und Kennzeichenwechsel.', reward: 'Exklusive Felgen' },
    'mk-23': { title: 'Gellhorn Küstenbrücken-Megasprung', description: 'Springe von der Baustellenrampe direkt auf den Lastkahn in der Bucht.', reward: 'Stunt-Sprung 4/50' },
    'mk-24': { title: 'Ammu-Nation Westküste', description: 'Gut sortierter Waffenladen an der Hauptstraße mit Jagdgewehren.', reward: '10 % Rabatt nach Prolog' },
    'mk-25': { title: 'Ambrosia Zuckerraffinerie (RPG)', description: 'Auf dem höchsten Silo liegt ein Raketenwerfer hinter den Lüftungsrohren.', reward: 'RPG-7 + 4 Raketen' },
    'mk-26': { title: 'Ambrosia Heavy Hauler', description: 'Gepanzerter Minen-LKW nachts am Güterbahnhof geparkt.', reward: 'Schweres Rammfahrzeug' },
    'mk-27': { title: 'Lake Leonida Radarstation', description: 'Beobachte die Antenne zwischen 02:00 und 03:00 Uhr bei Gewitter.', reward: 'Easter-Egg-Signal' },
    'mk-28': { title: 'Mount Kalaga Scharfschützengewehr', description: 'Am Aussichtsturm auf 842 m Höhe neben dem Ranger-Rucksack.', reward: 'Schweres Scharfschützengewehr' },
    'mk-29': { title: 'Kalaga Canyon Rally-Banshee', description: 'Modifiziertes Rallyefahrzeug unter einer Plane westlich der Kalaga-Schlucht.', reward: 'Einzigartiger Rally-Banshee' },
    'mk-30': { title: 'Redhill Gorge Klippensprung', description: 'Rase den Schotterweg hinab und springe über die Schlucht zum Kalaga-Fluss.', reward: 'Stunt-Sprung 5/50' },
  },
  fr: {
    'mk-1': { title: 'Colis Art Déco d’Ocean Beach', description: 'Montez par l’escalier de secours derrière le Surfside Hotel pour trouver un colis caché derrière le néon.', reward: '12 500 $ + Veste Vice' },
    'mk-2': { title: 'Cheetah Classic (Néon)', description: 'Garée dans le parking souterrain d’Ocean View Promenade après minuit en rose néon unique.', reward: 'Sportive rare' },
    'mk-3': { title: 'Saut North Beach', description: 'Utilisez la dune au nord d’Ocean Drive pour sauter par-dessus la jetée.', reward: 'Saut unique 1/50' },
    'mk-4': { title: 'Boutique Ocean Drive', description: 'Boutique chic proposant costumes en lin années 80, lunettes et accessoires néon.', reward: 'Remise VIP 15 %' },
    'mk-5': { title: 'Ammu-Nation Flagship Vice', description: 'Magasin principal avec stand de tir intérieur, optiques tactiques et gilets niveau 3.', reward: 'Essai stand gratuit' },
    'mk-6': { title: 'Carabine Militaire MK II (Grue)', description: 'Mallette verrouillée en haut de la grue du quartier financier. Parachute ou hélico requis.', reward: 'Carabine Militaire MK II' },
    'mk-7': { title: 'Saut Venetian Causeway', description: 'Arrivez à plus de 190 km/h depuis le pont ouest près de Starfish Island.', reward: 'Saut unique 2/50' },
    'mk-8': { title: 'Secret de la Fresque de Wynwood', description: 'Derrière la galerie, une fresque UV révèle le code d’un coffre caché.', reward: '20 000 $ + Trophée' },
    'mk-9': { title: 'Lowrider de Little Cuba', description: 'Classique à suspensions hydrauliques garée derrière le Café Havana le dimanche soir.', reward: 'Lowrider unique' },
    'mk-10': { title: 'Dépôt Hors-Taxe de Vice Port', description: 'Dans l’entrepôt 4B entre deux remorques jaunes. Méfiez-vous des gardes.', reward: '18 000 $' },
    'mk-11': { title: 'Hangar 7 VCIA (Jet privé)', description: 'Jet d’affaires rapide prêt au bout de la piste nord.', reward: 'Accès Nimbus Jet' },
    'mk-12': { title: 'Passage du Sous-Marin Coulé', description: 'Plongez à 22 m au sud du Seven Mile Bridge vers une épave de contrebande.', reward: 'Lingots d’or & trophée' },
    'mk-13': { title: 'Jet-ski SeaShark Pro', description: 'Jet-ski amélioré à la marina est chaque matin de 06h00 à 10h00.', reward: 'Engin nautique rapide' },
    'mk-14': { title: 'Saut du Seven Mile Bridge', description: 'L’ancien pont effondré sert de tremplin géant au-dessus de l’eau turquoise.', reward: 'Saut unique 3/50' },
    'mk-15': { title: 'Colis de Sunset Key', description: 'Attaché à une bouée sous le ponton à l’extrême ouest de l’archipel.', reward: '22 000 $' },
    'mk-16': { title: 'Boutique Plongée Key Largo', description: 'Vend combinaisons, lampes sous-marines et harpons silencieux.', reward: 'Équipement de plongée' },
    'mk-17': { title: 'Ponton Abandonné du Marais', description: 'Vieux ponton éclairé aux lanternes avec coordonnées cryptées et hydroglisseur.', reward: 'Indice Skunk Ape' },
    'mk-18': { title: 'Fusil à Pompe de Combat', description: 'Caché derrière la cabane au nord d’Alligator Alley. Attention aux alligators.', reward: 'Combat Shotgun + Munitions' },
    'mk-19': { title: 'Colis d’Alligator Alley', description: 'Caché sous l’arche où le canal croise l’autoroute du marais.', reward: '15 000 $' },
    'mk-20': { title: 'Épave d’Avion dans les Mangroves', description: 'Avion semi-immergé contenant un revolver doré unique dans le cockpit.', reward: 'Revolver Doré unique' },
    'mk-21': { title: 'Terminal Port Gellhorn', description: 'Sur la deuxième grue portuaire se trouve un sac rempli de billets et pièces rares.', reward: '25 000 $' },
    'mk-22': { title: 'Garage Coastal Lodge Custom', description: 'Atelier local spécialisé en pneus tout-terrain, turbos et plaques.', reward: 'Jantes exclusives' },
    'mk-23': { title: 'Méga-saut Pont de Gellhorn', description: 'Sautez depuis la rampe de chantier jusqu’à la barge dans la baie.', reward: 'Saut unique 4/50' },
    'mk-24': { title: 'Ammu-Nation Côte Ouest', description: 'Armurerie complète sur l’avenue principale avec fusils de chasse.', reward: '10 % après Prologue' },
    'mk-25': { title: 'Raffinerie d’Ambrosia (RPG)', description: 'Sur le toit du plus haut silo se cache un lance-roquettes.', reward: 'RPG-7 + 4 roquettes' },
    'mk-26': { title: 'Camion Lourd d’Ambrosia', description: 'Camion minier blindé garé la nuit près de la gare de triage.', reward: 'Véhicule bélier lourd' },
    'mk-27': { title: 'Station Radar de Lake Leonida', description: 'Observez l’antenne entre 02h00 et 03h00 par temps d’orage.', reward: 'Observation Easter Egg' },
    'mk-28': { title: 'Fusil Sniper Mount Kalaga', description: 'À la tour de guet à 842 m d’altitude près du sac du garde.', reward: 'Sniper Lourd' },
    'mk-29': { title: 'Rally-Banshee de Kalaga Canyon', description: 'Voiture de rallye cachée sous une bâche à l’ouest de Kalaga Gorge.', reward: 'Rally-Banshee unique' },
    'mk-30': { title: 'Saut Falaise Redhill Gorge', description: 'Dévalez la piste en terre et franchissez le ravin vers la rivière Kalaga.', reward: 'Saut unique 5/50' },
  },
  pt: {
    'mk-1': { title: 'Pacote Art Déco em Ocean Beach', description: 'Suba pela escada de incêndio atrás do Surfside Hotel na Ocean Drive até o pacote atrás do neon.', reward: '$12.500 + Jaqueta Vice' },
    'mk-2': { title: 'Cheetah Classic (Neon)', description: 'Estacionado na garagem subterrânea sob a Ocean View Promenade após meia-noite em rosa neon exclusivo.', reward: 'Esportivo raro' },
    'mk-3': { title: 'Salto de North Beach', description: 'Use a duna ao norte da Ocean Drive e salte sobre o píer rumo à água.', reward: 'Salto único 1/50' },
    'mk-4': { title: 'Boutique Ocean Drive', description: 'Loja de luxo com ternos de linho anos 80, óculos escuros e acessórios neon.', reward: '15% desconto VIP' },
    'mk-5': { title: 'Ammu-Nation Flagship Vice', description: 'Loja principal com estande de tiro interno, miras táticas e coletes nível 3.', reward: 'Teste grátis no estande' },
    'mk-6': { title: 'Carabina Militar MK II (Guindaste)', description: 'Maleta trancada no topo do guindaste no centro financeiro. Requer paraquedas ou helicóptero.', reward: 'Carabina Militar MK II' },
    'mk-7': { title: 'Salto Venetian Causeway', description: 'Acelere a mais de 190 km/h passando por Starfish Island sobre o canal.', reward: 'Salto único 2/50' },
    'mk-8': { title: 'Segredo do Mural Neon de Wynwood', description: 'Atrás da galeria, um mural UV revela a combinação de um cofre secreto.', reward: '$20.000 + Troféu' },
    'mk-9': { title: 'Lowrider de Little Cuba', description: 'Clássico com suspensão hidráulica atrás do Café Havana aos domingos à noite.', reward: 'Lowrider exclusivo' },
    'mk-10': { title: 'Depósito Livre de Vice Port', description: 'Dentro do galpão 4B entre dois reboques amarelos. Cuidado com os seguranças.', reward: '$18.000' },
    'mk-11': { title: 'Hangar 7 VCIA (Jato Particular)', description: 'Jato executivo pronto no fim da pista norte. Passe furtivamente pela segurança.', reward: 'Acesso ao Nimbus Jet' },
    'mk-12': { title: 'Passagem do Submarino Afundado', description: 'Mergulhe 22 metros ao sul da Seven Mile Bridge para inspecionar um naufrágio.', reward: 'Barras de ouro e troféu' },
    'mk-13': { title: 'Jet-ski SeaShark Pro', description: 'Jet-ski tunado na marina leste toda manhã entre 06:00 e 10:00.', reward: 'Embarcação mais rápida' },
    'mk-14': { title: 'Salto da Seven Mile Bridge', description: 'A antiga ponte desabada funciona como rampa gigante sobre o mar turquesa.', reward: 'Salto único 3/50' },
    'mk-15': { title: 'Pacote de Sunset Key', description: 'Preso a uma boia sob o píer de madeira no extremo oeste do arquipélago.', reward: '$22.000' },
    'mk-16': { title: 'Loja de Mergulho Key Largo', description: 'Vende trajes de mergulho, lanternas subaquáticas e arpões silenciosos.', reward: 'Equipamento de mergulho' },
    'mk-17': { title: 'Píer Abandonado do Pântano', description: 'Píer iluminado por lampiões com coordenadas criptografadas e um aerobarco oculto.', reward: 'Pista do mistério Skunk Ape' },
    'mk-18': { title: 'Espingarda de Combate', description: 'Escondida atrás do barraco ao norte da Alligator Alley. Cuidado com jacarés.', reward: 'Combat Shotgun + Munição' },
    'mk-19': { title: 'Pacote de Alligator Alley', description: 'Escondido sob o arco da ponte onde o canal cruza a rodovia.', reward: '$15.000' },
    'mk-20': { title: 'Avião Acidentado nos Manguezais', description: 'Aeronave semissubmersa com um revólver dourado exclusivo na cabine.', reward: 'Revólver Dourado único' },
    'mk-21': { title: 'Terminal de Contêineres Port Gellhorn', description: 'No topo do segundo guindaste há uma bolsa com dinheiro e peças raras.', reward: '$25.000' },
    'mk-22': { title: 'Oficina Coastal Lodge Custom', description: 'Oficina local especializada em pneus off-road, turbos e troca de placas.', reward: 'Rodas exclusivas' },
    'mk-23': { title: 'Megassalto Ponte de Gellhorn', description: 'Salte da rampa de obras direto para a barcaça na baía abaixo.', reward: 'Salto único 4/50' },
    'mk-24': { title: 'Ammu-Nation Costa Oeste', description: 'Loja completa na avenida principal com rifles de caça e equipamento tático.', reward: '10% desc. após Prólogo' },
    'mk-25': { title: 'Refinaria de Ambrosia (RPG)', description: 'No topo do maior silo há um lança-foguetes atrás dos dutos de ventilação.', reward: 'RPG-7 + 4 foguetes' },
    'mk-26': { title: 'Caminhão Blindado de Ambrosia', description: 'Caminhão pesado de mineração estacionado à noite no pátio ferroviário.', reward: 'Veículo pesado' },
    'mk-27': { title: 'Estação de Radar Lake Leonida', description: 'Observe a antena ao norte do lago entre 02:00 e 03:00 durante tempestades.', reward: 'Easter Egg' },
    'mk-28': { title: 'Rifle Sniper Mount Kalaga', description: 'Na torre de vigia a 842 m de altitude ao lado da mochila do guarda.', reward: 'Sniper Pesado' },
    'mk-29': { title: 'Rally-Banshee de Kalaga Canyon', description: 'Carro de rali modificado sob uma lona a oeste de Kalaga Gorge.', reward: 'Rally-Banshee único' },
    'mk-30': { title: 'Salto do Penhasco Redhill Gorge', description: 'Acelere pela trilha de terra e salte sobre o cânion rumo ao rio Kalaga.', reward: 'Salto único 5/50' },
  },
};

export const CHECKLIST_CATEGORY_TRANSLATIONS: Record<
  Exclude<Language, 'sv'>,
  Record<string, ChecklistCategoryLocaleContent>
> = {
  en: {
    main_missions: { label: 'Main Missions', description: 'Core story chapters with Lucia and Jason across Leonida.', weightLabel: '50% of 100%' },
    strangers_freaks: { label: 'Side Missions (Strangers & Freaks)', description: 'Character-driven side stories in Vice City, Grassrivers, and the Keys.', weightLabel: '15% of 100%' },
    collectibles: { label: 'Collectibles', description: 'Hidden packages, neon graffiti, wreck parts, and secret tapes.', weightLabel: '15% of 100%' },
    vehicle_challenges: { label: 'Vehicle Challenges', description: 'Stunt jumps, street racing, offshore boat cups, and flight school.', weightLabel: '10% of 100%' },
    random_events: { label: 'Random Events', description: 'Dynamic world encounters along highways, beaches, and swamps.', weightLabel: '10% of 100%' },
  },
  es: {
    main_missions: { label: 'Misiones principales', description: 'Capítulos clave de la historia con Lucia y Jason por todo Leonida.', weightLabel: '50% del 100%' },
    strangers_freaks: { label: 'Misiones secundarias (Strangers & Freaks)', description: 'Historias secundarias en Vice City, Grassrivers y los Cayos.', weightLabel: '15% del 100%' },
    collectibles: { label: 'Coleccionables', description: 'Paquetes ocultos, grafitis neón, restos de naufragios y cintas secretas.', weightLabel: '15% del 100%' },
    vehicle_challenges: { label: 'Desafíos de vehículos', description: 'Saltos acrobáticos, carreras callejeras, regatas y escuela de vuelo.', weightLabel: '10% del 100%' },
    random_events: { label: 'Eventos aleatorios', description: 'Encuentros dinámicos en carreteras, playas y pantanos.', weightLabel: '10% del 100%' },
  },
  de: {
    main_missions: { label: 'Hauptmissionen', description: 'Zentrale Story-Kapitel mit Lucia und Jason quer durch Leonida.', weightLabel: '50 % von 100 %' },
    strangers_freaks: { label: 'Nebenmissionen (Strangers & Freaks)', description: 'Charakter-Nebengeschichten in Vice City, Grassrivers und den Keys.', weightLabel: '15 % von 100 %' },
    collectibles: { label: 'Sammelobjekte', description: 'Versteckte Pakete, Neon-Graffiti, Wrackteile und geheime Kassetten.', weightLabel: '15 % von 100 %' },
    vehicle_challenges: { label: 'Fahrzeug-Herausforderungen', description: 'Stunt-Sprünge, Straßenrennen, Bootsrennen und Flugschule.', weightLabel: '10 % von 100 %' },
    random_events: { label: 'Zufallsereignisse', description: 'Dynamische Weltereignisse entlang von Highways, Stränden und Sümpfen.', weightLabel: '10 % von 100 %' },
  },
  fr: {
    main_missions: { label: 'Missions principales', description: 'Chapitres clés de l’histoire avec Lucia et Jason à travers Leonida.', weightLabel: '50 % sur 100 %' },
    strangers_freaks: { label: 'Missions secondaires (Inconnus & Détraqués)', description: 'Récits annexes à Vice City, dans les Grassrivers et les Keys.', weightLabel: '15 % sur 100 %' },
    collectibles: { label: 'Objets à collectionner', description: 'Colis cachés, graffitis néon, épaves et cassettes secrètes.', weightLabel: '15 % sur 100 %' },
    vehicle_challenges: { label: 'Défis de véhicules', description: 'Sauts uniques, courses de rue, courses nautiques et école de pilotage.', weightLabel: '10 % sur 100 %' },
    random_events: { label: 'Événements aléatoires', description: 'Rencontres dynamiques sur les routes, plages et marécages.', weightLabel: '10 % sur 100 %' },
  },
  pt: {
    main_missions: { label: 'Missões principais', description: 'Capítulos centrais da história com Lucia e Jason por toda Leonida.', weightLabel: '50% de 100%' },
    strangers_freaks: { label: 'Missões secundárias (Estranhos e Doidos)', description: 'Histórias paralelas em Vice City, Grassrivers e Keys.', weightLabel: '15% de 100%' },
    collectibles: { label: 'Colecionáveis', description: 'Pacotes ocultos, grafites neon, destroços e fitas secretas.', weightLabel: '15% de 100%' },
    vehicle_challenges: { label: 'Desafios de veículos', description: 'Saltos acrobáticos, corridas de rua, regatas e escola de voo.', weightLabel: '10% de 100%' },
    random_events: { label: 'Eventos aleatórios', description: 'Encontros dinâmicos em rodovias, praias e pântanos.', weightLabel: '10% de 100%' },
  },
};

export const CHECKLIST_ITEM_TRANSLATIONS: Record<
  Exclude<Language, 'sv'>,
  Record<string, ChecklistItemLocaleContent>
> = {
  en: {
    'chk-m1': { title: 'Prologue: The Port Gellhorn Job', requirement: 'Complete the opening heist and highway escape.', reward: 'Unlocks free roam in western Leonida' },
    'chk-m2': { title: 'Neon on Ocean Drive', requirement: 'Establish the first safehouse with Lucia and Jason in Vice Beach.', reward: 'Safehouse: Ocean View Suite' },
    'chk-m3': { title: 'Law of the Swamp', requirement: 'Pilot an airboat through the fog and recover smuggled cargo.', reward: '$45,000 + Airboat access' },
    'chk-m4': { title: 'Venetian Heist', requirement: 'Execute the boat-and-helicopter heist in Vice Bay.', reward: '$280,000 + New gear' },
    'chk-m5': { title: 'Key to Leonida Keys', requirement: 'Shut down the cartel’s sea transport during the storm night.', reward: 'Unlocks the southern archipelago' },
    'chk-m6': { title: 'Finale: Trust & Consequences', requirement: 'Complete the final story heist.', reward: 'Main story completed' },
    'chk-s1': { title: 'Leonida Man: Viral Stunts', requirement: 'Help influencer Dre film three outrageous stunts.', reward: 'Social Feed verification + $15,000' },
    'chk-s2': { title: 'Gator King of Grassrivers', requirement: 'Capture and tag three rare albino alligators for researcher Bo.', reward: 'Unique hunter hat + $22,000' },
    'chk-s3': { title: 'Shadow of the Nightclub', requirement: 'Track down the blackmailer targeting Club Malibu Reloaded.', reward: 'VIP access & passive income' },
    'chk-s4': { title: 'Treasure Hunter of Gator Keys', requirement: 'Recover all 4 shipwreck logs for old Captain Vance.', reward: 'Gold watch & diving bonus' },
    'chk-c1': { title: 'All 50 Hidden Packages', requirement: 'Collect every courier and smuggler stash across the map.', reward: '$250,000 Total Bonus' },
    'chk-c2': { title: 'Vice City Neon Graffiti (25/25)', requirement: 'Photograph or tag over all 25 street murals downtown.', reward: 'Custom Spray outfit' },
    'chk-c3': { title: 'Sunken Smuggler Chests (15/15)', requirement: 'Dive and salvage all waterproof chests along the coast.', reward: 'Free submarine rentals' },
    'chk-c4': { title: 'Secret Cassette Tapes (10/10)', requirement: 'Find all 10 retro tapes from Vice City’s 80s history.', reward: 'Bonus mix on Emotion 98.3' },
    'chk-v1': { title: 'Stunt Jumps (25 of 50 for 100%)', requirement: 'Land at least half of all unique stunt jumps cleanly.', reward: 'Trophy: Airborne in Leonida' },
    'chk-v2': { title: 'Midnight Street Circuit', requirement: 'Win all 5 illegal night races in Vice City.', reward: 'Free turbo upgrades' },
    'chk-v3': { title: 'Offshore Powerboat Cup', requirement: 'Set gold medal time in the coastal speedboat race.', reward: 'Exclusive racing boat at marina' },
    'chk-v4': { title: 'Under the Bridges (15/15)', requirement: 'Fly a plane or helicopter beneath all 15 marked bridges.', reward: 'Stunt Pilot title' },
    'chk-r1': { title: 'Stop Armored Vans (5/5)', requirement: 'Intercept or hijack five moving armored bank trucks.', reward: 'Quick cash ($35,000+)' },
    'chk-r2': { title: 'Rescue Stranded Smuggler', requirement: 'Assist or deliver at least three stranded NPCs in the wild.', reward: 'New phone contact' },
    'chk-r3': { title: 'Stop Pickpockets in Vice Beach', requirement: 'Recover stolen bags and return them to tourists 3 times.', reward: 'Honor points & tips' },
    'chk-r4': { title: 'Night Car Meet or Street Brawl', requirement: 'Join and finish a spontaneous car meet without getting busted.', reward: 'Respray discount' },
  },
  es: {
    'chk-m1': { title: 'Prólogo: El golpe de Port Gellhorn', requirement: 'Completa el atraco inicial y la huida por la autopista.', reward: 'Libera Leonida occidental' },
    'chk-m2': { title: 'Neón en Ocean Drive', requirement: 'Establece el primer refugio con Lucia y Jason en Vice Beach.', reward: 'Refugio: Ocean View Suite' },
    'chk-m3': { title: 'La ley del pantano', requirement: 'Conduce un hidrodeslizador entre la niebla y recupera la carga.', reward: '$45 000 + Hidrodeslizador' },
    'chk-m4': { title: 'Golpe Venetian', requirement: 'Ejecuta el atraco en barco y helicóptero en Vice Bay.', reward: '$280 000 + Nuevo equipo' },
    'chk-m5': { title: 'La llave de Leonida Keys', requirement: 'Detén el transporte marítimo del cártel en la noche de tormenta.', reward: 'Desbloquea el archipiélago sur' },
    'chk-m6': { title: 'Final: Confianza y consecuencias', requirement: 'Completa el último gran golpe de la historia.', reward: 'Historia principal completada' },
    'chk-s1': { title: 'Leonida Man: Acrobacias virales', requirement: 'Ayuda al influencer Dre con tres grabaciones arriesgadas.', reward: 'Verificación + $15 000' },
    'chk-s2': { title: 'El rey de los caimanes', requirement: 'Captura y marca tres caimanes albinos para el investigador Bo.', reward: 'Sombrero único + $22 000' },
    'chk-s3': { title: 'La sombra del club nocturno', requirement: 'Rastrea al chantajista de Club Malibu Reloaded.', reward: 'Acceso VIP e ingresos pasivos' },
    'chk-s4': { title: 'Cazatesoros en Gator Keys', requirement: 'Encuentra los 4 diarios de naufragios del capitán Vance.', reward: 'Reloj de oro y bono de buceo' },
    'chk-c1': { title: 'Los 50 Paquetes Ocultos', requirement: 'Recoge todos los alijos repartidos por el mapa.', reward: 'Bono total de $250 000' },
    'chk-c2': { title: 'Grafitis Neón de Vice City (25/25)', requirement: 'Fotografía o pinta los 25 murales del centro.', reward: 'Atuendo especial Spray' },
    'chk-c3': { title: 'Cofres Hundidos (15/15)', requirement: 'Bucea y rescata los 15 cofres herméticos de la costa.', reward: 'Submarino gratis' },
    'chk-c4': { title: 'Cintas de Casete Secretas (10/10)', requirement: 'Halla las 10 cintas retro de los años 80 de Vice City.', reward: 'Mezcla extra en Emotion 98.3' },
    'chk-v1': { title: 'Saltos Acrobáticos (25 de 50)', requirement: 'Completa al menos la mitad de los saltos únicos.', reward: 'Trofeo: En el aire' },
    'chk-v2': { title: 'Circuito Nocturno Callejero', requirement: 'Gana las 5 carreras ilegales nocturnas en Vice City.', reward: 'Turbos gratuitos' },
    'chk-v3': { title: 'Copa Offshore en Lancha', requirement: 'Logra medalla de oro en la carrera costera.', reward: 'Lancha exclusiva en la marina' },
    'chk-v4': { title: 'Bajo los Puentes (15/15)', requirement: 'Vuela bajo los 15 puentes marcados en avión o helicóptero.', reward: 'Título de Piloto Acrobático' },
    'chk-r1': { title: 'Asaltar Furgones Blindados (5/5)', requirement: 'Intercepta cinco furgones blindados en movimiento.', reward: 'Efectivo rápido ($35 000+)' },
    'chk-r2': { title: 'Rescatar Contrabandista Varado', requirement: 'Ayuda a tres NPC varados en zonas salvajes.', reward: 'Nuevo contacto móvil' },
    'chk-r3': { title: 'Detener Carteristas en Vice Beach', requirement: 'Recupera bolsos robados a turistas 3 veces.', reward: 'Puntos de honor y propinas' },
    'chk-r4': { title: 'Concentración Nocturna de Coches', requirement: 'Participa en una quedada espontánea sin ser arrestado.', reward: 'Descuento en pintura' },
  },
  de: {
    'chk-m1': { title: 'Prolog: Der Port-Gellhorn-Coup', requirement: 'Schließe den Eröffnungsraub und die Flucht über den Highway ab.', reward: 'Schaltet West-Leonida frei' },
    'chk-m2': { title: 'Neon am Ocean Drive', requirement: 'Richte das erste Versteck mit Lucia und Jason in Vice Beach ein.', reward: 'Versteck: Ocean View Suite' },
    'chk-m3': { title: 'Gesetz des Sumpfes', requirement: 'Steuere ein Luftkissenboot durch den Nebel und berge Schmuggelware.', reward: '45.000 $ + Airboat-Zugang' },
    'chk-m4': { title: 'Venetian Heist', requirement: 'Führe den Boots- und Helikopterraub in Vice Bay durch.', reward: '280.000 $ + Neue Ausrüstung' },
    'chk-m5': { title: 'Schlüssel zu den Leonida Keys', requirement: 'Stoppe den Seetransport des Kartells in der Sturmnacht.', reward: 'Schaltet südlichen Archipel frei' },
    'chk-m6': { title: 'Finale: Trust & Consequences', requirement: 'Schließe den letzten großen Story-Raub ab.', reward: 'Hauptstory abgeschlossen' },
    'chk-s1': { title: 'Leonida Man: Virale Stunts', requirement: 'Hilf Influencer Dre bei drei spektakulären Stunt-Aufnahmen.', reward: 'Social-Verifizierung + 15.000 $' },
    'chk-s2': { title: 'Alligatorkönig der Grassrivers', requirement: 'Fange und markiere drei seltene Albino-Alligatoren für Bo.', reward: 'Jägerhut + 22.000 $' },
    'chk-s3': { title: 'Schatten des Nachtclubs', requirement: 'Spüre den Erpresser hinter dem Club Malibu Reloaded auf.', reward: 'VIP-Zugang & passives Einkommen' },
    'chk-s4': { title: 'Schatzsucher auf Gator Keys', requirement: 'Finde alle 4 Schiffbruch-Logbücher für Kapitän Vance.', reward: 'Golduhr & Tauchbonus' },
    'chk-c1': { title: 'Alle 50 Versteckten Pakete', requirement: 'Sammle sämtliche Kurier- und Schmugglerpakete auf der Karte.', reward: '250.000 $ Gesamtbonus' },
    'chk-c2': { title: 'Vice City Neon-Graffiti (25/25)', requirement: 'Fotografiere oder übersprühe alle 25 Wandbilder im Zentrum.', reward: 'Spezielles Spray-Outfit' },
    'chk-c3': { title: 'Gesunkene Schmugglerkisten (15/15)', requirement: 'Tauche und berge alle 15 wasserdichten Kisten vor der Küste.', reward: 'Kostenlose U-Boot-Miete' },
    'chk-c4': { title: 'Geheime Kassetten (10/10)', requirement: 'Finde alle 10 Retro-Kassetten aus Vice Citys 80er-Historie.', reward: 'Bonus-Mix auf Emotion 98.3' },
    'chk-v1': { title: 'Stunt-Sprünge (25 von 50)', requirement: 'Meistere mindestens die Hälfte aller Stunt-Sprünge sauber.', reward: 'Trophäe: In der Luft' },
    'chk-v2': { title: 'Midnight Street Circuit', requirement: 'Gewinne alle 5 illegalen Nachtrennen in Vice City.', reward: 'Gratis Turbo-Upgrades' },
    'chk-v3': { title: 'Offshore Powerboat Cup', requirement: 'Hole Gold im langen Küsten-Rennboot-Wettbewerb.', reward: 'Exklusives Rennboot' },
    'chk-v4': { title: 'Unter den Brücken (15/15)', requirement: 'Fliege mit Flugzeug oder Heli unter allen 15 markierten Brücken durch.', reward: 'Stuntpilot-Titel' },
    'chk-r1': { title: 'Geldtransporter stoppen (5/5)', requirement: 'Überfalle fünf fahrende gepanzerte Banktransporter.', reward: 'Schnelles Geld (35.000 $+)' },
    'chk-r2': { title: 'Gestrandete Schmuggler retten', requirement: 'Hilf mindestens drei gestrandeten NPCs in der Wildnis.', reward: 'Neuer Handykontakt' },
    'chk-r3': { title: 'Taschendiebe in Vice Beach fassen', requirement: 'Bringe gestohlene Taschen 3-mal an Touristen zurück.', reward: 'Ehre & Trinkgeld' },
    'chk-r4': { title: 'Nächtliches Autotreffen', requirement: 'Nimm an einem spontanen Treffen teil, ohne verhaftet zu werden.', reward: 'Lackier-Rabatt' },
  },
  fr: {
    'chk-m1': { title: 'Prologue : Le coup de Port Gellhorn', requirement: 'Terminez le braquage d’ouverture et la fuite sur l’autoroute.', reward: 'Débloque l’ouest de Leonida' },
    'chk-m2': { title: 'Néon sur Ocean Drive', requirement: 'Établissez la première planque avec Lucia et Jason à Vice Beach.', reward: 'Planque : Ocean View Suite' },
    'chk-m3': { title: 'La loi du marais', requirement: 'Pilotez un hydroglisseur dans le brouillard et récupérez la cargaison.', reward: '45 000 $ + Hydroglisseur' },
    'chk-m4': { title: 'Braquage Venetian', requirement: 'Réalisez le casse en bateau et hélicoptère à Vice Bay.', reward: '280 000 $ + Équipement' },
    'chk-m5': { title: 'La clé des Leonida Keys', requirement: 'Neutralisez le transport maritime du cartel sous l’orage.', reward: 'Débloque l’archipel sud' },
    'chk-m6': { title: 'Final : Confiance & Conséquences', requirement: 'Terminez le dernier grand casse du scénario.', reward: 'Histoire principale terminée' },
    'chk-s1': { title: 'Leonida Man : Cascades virales', requirement: 'Aidez l’influenceur Dre à filmer trois cascades folles.', reward: 'Badge Social + 15 000 $' },
    'chk-s2': { title: 'Le roi des alligators', requirement: 'Capturez et marquez trois alligators albinos pour le chercheur Bo.', reward: 'Chapeau unique + 22 000 $' },
    'chk-s3': { title: 'L’ombre du club', requirement: 'Retrouvez le maître chanteur visant le Club Malibu Reloaded.', reward: 'Accès VIP & revenus passifs' },
    'chk-s4': { title: 'Chasseur de trésors de Gator Keys', requirement: 'Trouvez les 4 journaux d’épaves pour le capitaine Vance.', reward: 'Montre en or & bonus plongée' },
    'chk-c1': { title: 'Les 50 Colis Cachés', requirement: 'Récupérez tous les colis dissimulés sur la carte.', reward: 'Bonus total de 250 000 $' },
    'chk-c2': { title: 'Graffitis Néon de Vice City (25/25)', requirement: 'Photographiez ou recouvrez les 25 fresques du centre-ville.', reward: 'Tenue Spray spéciale' },
    'chk-c3': { title: 'Coffres Engloutis (15/15)', requirement: 'Plongez pour remonter les 15 coffres étanches le long de la côte.', reward: 'Sous-marin gratuit' },
    'chk-c4': { title: 'Cassettes Secrètes (10/10)', requirement: 'Trouvez les 10 cassettes rétro des années 80 à Vice City.', reward: 'Mix bonus sur Emotion 98.3' },
    'chk-v1': { title: 'Sauts Uniques (25 sur 50)', requirement: 'Réussissez au moins la moitié des sauts uniques.', reward: 'Trophée : Dans les airs' },
    'chk-v2': { title: 'Circuit Nocturne de Rue', requirement: 'Remportez les 5 courses illégales nocturnes de Vice City.', reward: 'Turbos gratuits' },
    'chk-v3': { title: 'Coupe Offshore Hors-Bord', requirement: 'Obtenez l’or dans la course côtière en hors-bord.', reward: 'Bateau exclusif à la marina' },
    'chk-v4': { title: 'Sous les Ponts (15/15)', requirement: 'Passez sous les 15 ponts marqués en avion ou hélicoptère.', reward: 'Titre de Pilote Cascadeur' },
    'chk-r1': { title: 'Fourgons Blindés (5/5)', requirement: 'Interceptez cinq fourgons blindés en mouvement.', reward: 'Argent rapide (35 000 $+)' },
    'chk-r2': { title: 'Sauver un Contrebandier Échoué', requirement: 'Aidez trois PNJ isolés dans la nature.', reward: 'Nouveau contact mobile' },
    'chk-r3': { title: 'Stopper les Pickpockets à Vice Beach', requirement: 'Rendez les sacs volés aux touristes 3 fois.', reward: 'Points d’honneur & pourboires' },
    'chk-r4': { title: 'Rassemblement Auto Nocturne', requirement: 'Participez à un rasso spontané sans vous faire arrêter.', reward: 'Remise peinture' },
  },
  pt: {
    'chk-m1': { title: 'Prólogo: O Golpe de Port Gellhorn', requirement: 'Conclua o assalto inicial e a fuga pela rodovia.', reward: 'Libera o oeste de Leonida' },
    'chk-m2': { title: 'Neon na Ocean Drive', requirement: 'Estabeleça o primeiro esconderijo com Lucia e Jason em Vice Beach.', reward: 'Esconderijo: Ocean View Suite' },
    'chk-m3': { title: 'A Lei do Pântano', requirement: 'Pilote um aerobarco na neblina e recupere a carga contrabandeada.', reward: '$45.000 + Aerobarco' },
    'chk-m4': { title: 'Golpe Venetian', requirement: 'Execute o assalto de barco e helicóptero em Vice Bay.', reward: '$280.000 + Novo equipamento' },
    'chk-m5': { title: 'Chave para Leonida Keys', requirement: 'Interrompa o transporte marítimo do cartel na noite de tempestade.', reward: 'Desbloqueia o arquipélago sul' },
    'chk-m6': { title: 'Final: Confiança e Consequências', requirement: 'Conclua o último grande golpe da história.', reward: 'História principal concluída' },
    'chk-s1': { title: 'Leonida Man: Manobras Virais', requirement: 'Ajude o influenciador Dre a gravar três acrobacias insanas.', reward: 'Verificação + $15.000' },
    'chk-s2': { title: 'Rei dos Jacarés em Grassrivers', requirement: 'Capture e marque três jacarés albinos raros para o pesquisador Bo.', reward: 'Chapéu exclusivo + $22.000' },
    'chk-s3': { title: 'Sombra da Boate', requirement: 'Rastreie o chantagista por trás do Club Malibu Reloaded.', reward: 'Acesso VIP e renda passiva' },
    'chk-s4': { title: 'Caçador de Tesouros em Gator Keys', requirement: 'Encontre todos os 4 diários de naufrágio do Capitão Vance.', reward: 'Relógio de ouro e bônus' },
    'chk-c1': { title: 'Todos os 50 Pacotes Ocultos', requirement: 'Colete todos os pacotes espalhados pelo mapa.', reward: 'Bônus total de $250.000' },
    'chk-c2': { title: 'Grafites Neon de Vice City (25/25)', requirement: 'Fotografe ou pinte todos os 25 murais no centro.', reward: 'Traje especial Spray' },
    'chk-c3': { title: 'Baús Submersos (15/15)', requirement: 'Mergulhe e recupere todos os 15 baús à prova d’água na costa.', reward: 'Submarino gratuito' },
    'chk-c4': { title: 'Fitas Cassete Secretas (10/10)', requirement: 'Encontre as 10 fitas retrô da história dos anos 80 de Vice City.', reward: 'Mix bônus na Emotion 98.3' },
    'chk-v1': { title: 'Saltos Acrobáticos (25 de 50)', requirement: 'Complete ao menos metade de todos os saltos únicos.', reward: 'Troféu: No Ar em Leonida' },
    'chk-v2': { title: 'Circuito Noturno de Rua', requirement: 'Vença todas as 5 corridas ilegais noturnas em Vice City.', reward: 'Turbos gratuitos' },
    'chk-v3': { title: 'Copa Offshore de Lanchas', requirement: 'Conquiste medalha de ouro na corrida costeira.', reward: 'Lancha exclusiva na marina' },
    'chk-v4': { title: 'Por Baixo das Pontes (15/15)', requirement: 'Voe de avião ou helicóptero sob todas as 15 pontes marcadas.', reward: 'Título de Piloto Acrobático' },
    'chk-r1': { title: 'Interceptar Carros-Fortes (5/5)', requirement: 'Intercepte cinco caminhões blindados em movimento.', reward: 'Dinheiro rápido ($35.000+)' },
    'chk-r2': { title: 'Resgatar Contrabandista Perdido', requirement: 'Ajude três NPCs perdidos na natureza.', reward: 'Novo contato no celular' },
    'chk-r3': { title: 'Deter Batedores de Carteira em Vice Beach', requirement: 'Recupere bolsas roubadas de turistas 3 vezes.', reward: 'Pontos de honra e gorjetas' },
    'chk-r4': { title: 'Encontro Noturno de Carros', requirement: 'Participe de um encontro espontâneo sem ser preso.', reward: 'Desconto em pintura' },
  },
};

export const CHEAT_TRANSLATIONS: Record<Exclude<Language, 'sv'>, Record<string, CheatLocaleContent>> = {
  en: {
    'cheat-invincible': { name: 'Invincibility (5 Minutes)', effect: 'Makes Lucia or Jason immune to bullets, falls, and explosions for 5 minutes.' },
    'cheat-health-armor': { name: 'Max Health & Armor', effect: 'Restores full health, refills body armor, and repairs your current vehicle.' },
    'cheat-lower-wanted': { name: 'Lower Wanted Level (-1 Star)', effect: 'Immediately removes one police wanted star.' },
    'cheat-raise-wanted': { name: 'Raise Wanted Level (+1 Star)', effect: 'Increases police wanted attention by one star.' },
    'cheat-weapons': { name: 'All Weapons & Extra Ammo', effect: 'Grants the full arsenal including assault rifle, shotgun, sniper, and grenades.' },
    'cheat-explosive-ammo': { name: 'Explosive Rounds', effect: 'Every fired bullet detonates on impact.' },
    'cheat-cheetah': { name: 'Spawn Pegassi Cheetah Classic', effect: 'Spawns a classic Vice City supercar directly in front of the player.' },
    'cheat-airboat': { name: 'Spawn Leonida Airboat', effect: 'Spawns a fast swamp airboat – ideal for navigating Grassrivers.' },
    'cheat-weather': { name: 'Change Weather (Storm / Sun)', effect: 'Cycles through clear skies, neon rain, swamp fog, and tropical storm.' },
    'cheat-slowmo': { name: 'Slow-Motion Aiming (3 Levels)', effect: 'Slows down time while aiming for cinematic gunfights.' },
  },
  es: {
    'cheat-invincible': { name: 'Invencibilidad (5 minutos)', effect: 'Hace a Lucia o Jason inmunes a balas, caídas y explosiones durante 5 minutos.' },
    'cheat-health-armor': { name: 'Salud y blindaje al máximo', effect: 'Restaura toda la salud, rellena el chaleco y repara tu vehículo actual.' },
    'cheat-lower-wanted': { name: 'Reducir nivel de búsqueda (-1 estrella)', effect: 'Elimina una estrella policial de inmediato.' },
    'cheat-raise-wanted': { name: 'Subir nivel de búsqueda (+1 estrella)', effect: 'Aumenta en una estrella la persecución policial.' },
    'cheat-weapons': { name: 'Todas las armas y munición', effect: 'Otorga todo el arsenal: fusil de asalto, escopeta, francotirador y granadas.' },
    'cheat-explosive-ammo': { name: 'Munición explosiva', effect: 'Todos los disparos detonan al impactar.' },
    'cheat-cheetah': { name: 'Generar Pegassi Cheetah Classic', effect: 'Hace aparecer un superdeportivo clásico de Vice City frente a ti.' },
    'cheat-airboat': { name: 'Generar Hidrodeslizador Leonida', effect: 'Crea un veloz hidrodeslizador, ideal para Grassrivers.' },
    'cheat-weather': { name: 'Cambiar clima (Tormenta / Sol)', effect: 'Alterna entre cielo despejado, lluvia neón, niebla y huracán tropical.' },
    'cheat-slowmo': { name: 'Apuntado a cámara lenta (3 niveles)', effect: 'Ralentiza el tiempo al apuntar para tiroteos cinematográficos.' },
  },
  de: {
    'cheat-invincible': { name: 'Unverwundbarkeit (5 Minuten)', effect: 'Macht Lucia oder Jason 5 Minuten lang immun gegen Kugeln, Stürze und Explosionen.' },
    'cheat-health-armor': { name: 'Volle Gesundheit & Panzerung', effect: 'Stellt Gesundheit und Weste voll wieder her und repariert dein Fahrzeug.' },
    'cheat-lower-wanted': { name: 'Fahndungslevel senken (-1 Stern)', effect: 'Entfernt sofort einen Polizeistern.' },
    'cheat-raise-wanted': { name: 'Fahndungslevel erhöhen (+1 Stern)', effect: 'Erhöht die Polizeifahndung um einen Stern.' },
    'cheat-weapons': { name: 'Alle Waffen & Extra-Munition', effect: 'Gewährt das volle Arsenal inklusive Sturmgewehr, Schrotflinte, Sniper und Granaten.' },
    'cheat-explosive-ammo': { name: 'Explosive Munition', effect: 'Jedes abgefeuerte Projektil detoniert beim Aufprall.' },
    'cheat-cheetah': { name: 'Pegassi Cheetah Classic spawnen', effect: 'Spawnt einen klassischen Vice-City-Supersportwagen direkt vor dir.' },
    'cheat-airboat': { name: 'Leonida Airboat spawnen', effect: 'Spawnt ein schnelles Sumpf-Luftkissenboot – ideal für die Grassrivers.' },
    'cheat-weather': { name: 'Wetter wechseln (Sturm / Sonne)', effect: 'Wechselt zyklisch zwischen klarem Himmel, Neonregen, Nebel und Tropensturm.' },
    'cheat-slowmo': { name: 'Zeitlupen-Zielen (3 Stufen)', effect: 'Verlangsamt die Zeit beim Zielen für filmreife Feuergefechte.' },
  },
  fr: {
    'cheat-invincible': { name: 'Invincibilité (5 minutes)', effect: 'Rend Lucia ou Jason insensible aux balles, chutes et explosions pendant 5 minutes.' },
    'cheat-health-armor': { name: 'Santé & Armure au maximum', effect: 'Restaure la santé, remplit le gilet pare-balles et répare votre véhicule.' },
    'cheat-lower-wanted': { name: 'Baisser l’indice de recherche (-1 étoile)', effect: 'Retire immédiatement une étoile de police.' },
    'cheat-raise-wanted': { name: 'Monter l’indice de recherche (+1 étoile)', effect: 'Ajoute une étoile de recherche policière.' },
    'cheat-weapons': { name: 'Toutes les armes & munitions', effect: 'Donne tout l’arsenal : fusil d’assaut, pompe, sniper et grenades.' },
    'cheat-explosive-ammo': { name: 'Balles explosives', effect: 'Chaque projectile tiré explose à l’impact.' },
    'cheat-cheetah': { name: 'Faire apparaître Pegassi Cheetah Classic', effect: 'Fait apparaître une supercar classique de Vice City devant vous.' },
    'cheat-airboat': { name: 'Faire apparaître un Hydroglisseur', effect: 'Crée un hydroglisseur rapide, idéal pour les Grassrivers.' },
    'cheat-weather': { name: 'Changer la météo (Orage / Soleil)', effect: 'Alterne entre ciel clair, pluie néon, brume des marais et tempête tropicale.' },
    'cheat-slowmo': { name: 'Visée au ralenti (3 niveaux)', effect: 'Ralentit le temps en visant pour des fusillades cinématographiques.' },
  },
  pt: {
    'cheat-invincible': { name: 'Invencibilidade (5 minutos)', effect: 'Torna Lucia ou Jason imune a balas, quedas e explosões por 5 minutos.' },
    'cheat-health-armor': { name: 'Vida e Colete no Máximo', effect: 'Restaura toda a vida, enche o colete e conserta o veículo atual.' },
    'cheat-lower-wanted': { name: 'Reduzir Nível de Procurado (-1 estrela)', effect: 'Remove imediatamente uma estrela de perseguição policial.' },
    'cheat-raise-wanted': { name: 'Aumentar Nível de Procurado (+1 estrela)', effect: 'Aumenta a atenção policial em uma estrela.' },
    'cheat-weapons': { name: 'Todas as Armas e Munição Extra', effect: 'Concede o arsenal completo, incluindo fuzil, escopeta, sniper e granadas.' },
    'cheat-explosive-ammo': { name: 'Munição Explosiva', effect: 'Todos os disparos detonam no impacto.' },
    'cheat-cheetah': { name: 'Gerar Pegassi Cheetah Classic', effect: 'Faz surgir um supercarro clássico de Vice City bem à sua frente.' },
    'cheat-airboat': { name: 'Gerar Aerobarco Leonida', effect: 'Cria um aerobarco veloz – ideal para navegar em Grassrivers.' },
    'cheat-weather': { name: 'Alternar Clima (Tempestade / Sol)', effect: 'Alterna entre céu limpo, chuva neon, neblina e furacão tropical.' },
    'cheat-slowmo': { name: 'Mira em Câmera Lenta (3 níveis)', effect: 'Desacelera o tempo ao mirar para tiroteios cinematográficos.' },
  },
};

export const RADIO_TRANSLATIONS: Record<Exclude<Language, 'sv'>, Record<string, RadioLocaleContent>> = {
  en: {
    'radio-emotion': { genre: '80s Synth-Pop & Power Ballads', description: 'Vice City’s most romantic frequency returns for late-night drives down Ocean Drive.' },
    'radio-vice-fm': { genre: 'Modern R&B, Nu-Disco & Tropical House', description: 'Sun-soaked club tracks straight from Vice Beach’s hottest rooftop lounges.' },
    'radio-grassrivers': { genre: 'Southern Hip-Hop & Florida Trap', description: 'Heavy 808 basslines stretching from Port Gellhorn to downtown Vice City.' },
    'radio-espantoso': { genre: 'Latin Salsa, Reggaeton & Afro-Cuban Jazz', description: 'The heartbeat of Little Cuba blending classic salsa with modern Latin urban.' },
    'radio-vrock': { genre: 'Hard Rock, Alt-Metal & Outlaw Country Rock', description: 'High-octane rock built for long highway runs north toward Lake Leonida and Mount Kalaga.' },
  },
  es: {
    'radio-emotion': { genre: 'Synth-Pop de los 80 y Baladas', description: 'La frecuencia más romántica de Vice City regresa para conducir de noche por Ocean Drive.' },
    'radio-vice-fm': { genre: 'R&B Moderno, Nu-Disco y Tropical House', description: 'Música de club bañada por el sol directo desde las azoteas de Vice Beach.' },
    'radio-grassrivers': { genre: 'Southern Hip-Hop y Florida Trap', description: 'Bajos 808 contundentes desde Port Gellhorn hasta el centro de Vice City.' },
    'radio-espantoso': { genre: 'Salsa Latina, Reggaetón y Jazz Afrocubano', description: 'El latido de Little Cuba uniendo salsa clásica y ritmos latinos actuales.' },
    'radio-vrock': { genre: 'Hard Rock, Alt-Metal y Country Rock', description: 'Rock de alto octanaje para largos viajes al norte hacia Lake Leonida.' },
  },
  de: {
    'radio-emotion': { genre: '80er Synth-Pop & Power-Balladen', description: 'Vice Citys romantischster Sender kehrt zurück für Nachtfahrten am Ocean Drive.' },
    'radio-vice-fm': { genre: 'Modernes R&B, Nu-Disco & Tropical House', description: 'Sonnendurchflutete Club-Beats direkt von den Rooftop-Bars in Vice Beach.' },
    'radio-grassrivers': { genre: 'Southern Hip-Hop & Florida Trap', description: 'Druckvolle 808-Bässe von Port Gellhorn bis ins Zentrum von Vice City.' },
    'radio-espantoso': { genre: 'Latin Salsa, Reggaeton & Afro-Cuban Jazz', description: 'Der Herzschlag von Little Cuba mit klassischem Salsa und modernen Latin-Hits.' },
    'radio-vrock': { genre: 'Hard Rock, Alt-Metal & Outlaw Country Rock', description: 'Hochenergetischer Rock für lange Highway-Touren Richtung Lake Leonida.' },
  },
  fr: {
    'radio-emotion': { genre: 'Synth-Pop 80s & Power Ballads', description: 'La fréquence la plus romantique de Vice City revient pour vos virées nocturnes sur Ocean Drive.' },
    'radio-vice-fm': { genre: 'R&B Moderne, Nu-Disco & Tropical House', description: 'Sons club ensoleillés en direct des rooftops les plus prisés de Vice Beach.' },
    'radio-grassrivers': { genre: 'Southern Hip-Hop & Florida Trap', description: 'Grosses basses 808 de Port Gellhorn au cœur de Vice City.' },
    'radio-espantoso': { genre: 'Salsa Latine, Reggaeton & Jazz Afro-Cubain', description: 'Le cœur de Little Cuba mêlant salsa classique et sons latinos modernes.' },
    'radio-vrock': { genre: 'Hard Rock, Alt-Metal & Country Rock', description: 'Du rock survolté pour les longues virées vers Lake Leonida et Mount Kalaga.' },
  },
  pt: {
    'radio-emotion': { genre: 'Synth-Pop Anos 80 e Power Ballads', description: 'A frequência mais romântica de Vice City retorna para passeios noturnos pela Ocean Drive.' },
    'radio-vice-fm': { genre: 'R&B Moderno, Nu-Disco e Tropical House', description: 'Batidas de clube direto dos terraços mais badalados de Vice Beach.' },
    'radio-grassrivers': { genre: 'Southern Hip-Hop e Florida Trap', description: 'Graves 808 pesados de Port Gellhorn ao centro de Vice City.' },
    'radio-espantoso': { genre: 'Salsa Latina, Reggaeton e Jazz Afro-Cubano', description: 'O ritmo pulsante de Little Cuba unindo salsa clássica e música latina moderna.' },
    'radio-vrock': { genre: 'Hard Rock, Alt-Metal e Outlaw Country Rock', description: 'Rock pesado feito para viagens longas rumo a Lake Leonida e Mount Kalaga.' },
  },
};

export const SERVER_STATUS_TRANSLATIONS: Record<
  Exclude<Language, 'sv'>,
  Record<'ps5' | 'xbox', ServerLocaleContent>
> = {
  en: {
    ps5: {
      overallLabel: 'Online',
      summary: 'All Rockstar Games services for PS5 are operating normally with no known outages.',
      updatedAt: 'Updated 2 min ago',
      services: {
        'Leonida Online-servrar': { name: 'Leonida Online Servers', note: 'Normal latency (18 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Sync active' },
        'Social Club & Photo Feed': { name: 'Social Club & Photo Feed', note: 'Full access' },
      },
    },
    xbox: {
      overallLabel: 'Limited',
      summary: 'High load reported on Cloud Saves; online multiplayer modes are running normally.',
      updatedAt: 'Updated 2 min ago',
      services: {
        'Leonida Online-servrar': { name: 'Leonida Online Servers', note: 'Normal latency (22 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Slight delay on Quick Resume' },
        'Social Club & Photo Feed': { name: 'Social Club & Photo Feed', note: 'Full access' },
      },
    },
  },
  es: {
    ps5: {
      overallLabel: 'En línea',
      summary: 'Todos los servicios de Rockstar Games en PS5 funcionan con normalidad.',
      updatedAt: 'Actualizado hace 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Servidores Leonida Online', note: 'Latencia normal (18 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Sincronización activa' },
        'Social Club & Photo Feed': { name: 'Social Club y Fotos', note: 'Acceso completo' },
      },
    },
    xbox: {
      overallLabel: 'Limitado',
      summary: 'Alta carga reportada en Cloud Saves; los modos en línea funcionan normalmente.',
      updatedAt: 'Actualizado hace 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Servidores Leonida Online', note: 'Latencia normal (22 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Ligero retraso en Quick Resume' },
        'Social Club & Photo Feed': { name: 'Social Club y Fotos', note: 'Acceso completo' },
      },
    },
  },
  de: {
    ps5: {
      overallLabel: 'Online',
      summary: 'Alle Rockstar-Games-Dienste für PS5 laufen stabil ohne bekannte Störungen.',
      updatedAt: 'Vor 2 Min. aktualisiert',
      services: {
        'Leonida Online-servrar': { name: 'Leonida-Online-Server', note: 'Normale Latenz (18 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Synchronisierung aktiv' },
        'Social Club & Photo Feed': { name: 'Social Club & Foto-Feed', note: 'Voller Zugriff' },
      },
    },
    xbox: {
      overallLabel: 'Eingeschränkt',
      summary: 'Erhöhte Auslastung bei Cloud Saves gemeldet; Online-Modi laufen normal.',
      updatedAt: 'Vor 2 Min. aktualisiert',
      services: {
        'Leonida Online-servrar': { name: 'Leonida-Online-Server', note: 'Normale Latenz (22 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Leichte Verzögerung bei Quick Resume' },
        'Social Club & Photo Feed': { name: 'Social Club & Foto-Feed', note: 'Voller Zugriff' },
      },
    },
  },
  fr: {
    ps5: {
      overallLabel: 'En ligne',
      summary: 'Tous les services Rockstar Games sur PS5 fonctionnent normalement sans incident connu.',
      updatedAt: 'Mis à jour il y a 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Serveurs Leonida Online', note: 'Latence normale (18 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Synchronisation active' },
        'Social Club & Photo Feed': { name: 'Social Club & Flux Photo', note: 'Accès complet' },
      },
    },
    xbox: {
      overallLabel: 'Limité',
      summary: 'Forte charge signalée sur Cloud Saves ; les modes en ligne fonctionnent normalement.',
      updatedAt: 'Mis à jour il y a 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Serveurs Leonida Online', note: 'Latence normale (22 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Léger délai avec Quick Resume' },
        'Social Club & Photo Feed': { name: 'Social Club & Flux Photo', note: 'Accès complet' },
      },
    },
  },
  pt: {
    ps5: {
      overallLabel: 'Online',
      summary: 'Todos os serviços da Rockstar Games no PS5 estão operando normalmente.',
      updatedAt: 'Atualizado há 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Servidores Leonida Online', note: 'Latência normal (18 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Sincronização ativa' },
        'Social Club & Photo Feed': { name: 'Social Club e Fotos', note: 'Acesso total' },
      },
    },
    xbox: {
      overallLabel: 'Limitado',
      summary: 'Alta carga reportada em Cloud Saves; os modos online funcionam normalmente.',
      updatedAt: 'Atualizado há 2 min',
      services: {
        'Leonida Online-servrar': { name: 'Servidores Leonida Online', note: 'Latência normal (22 ms)' },
        'Rockstar Cloud Saves': { name: 'Rockstar Cloud Saves', note: 'Pequeno atraso no Quick Resume' },
        'Social Club & Photo Feed': { name: 'Social Club e Fotos', note: 'Acesso total' },
      },
    },
  },
};

export const RSS_FALLBACK_TRANSLATIONS: Record<
  Exclude<Language, 'sv'>,
  Record<string, RssFallbackLocaleContent>
> = {
  en: {
    'rss-fallback-1': {
      title: 'Grand Theft Auto VI: Title Update 01.004.000 — Leonida Performance & Raytracing Notes',
      summary: 'Rockstar Games rolls out 60 fps Performance optimizations across Vice Beach and Downtown along with network and traffic sync updates for PS5 and Xbox Series X|S.',
      category: 'Title Update',
    },
    'rss-fallback-2': {
      title: 'Welcome to Leonida: New Photo Challenges & Vice City Community Spotlight',
      summary: 'This week’s curated player photography from Photo Mode across Grassrivers, Ocean Drive, and Port Gellhorn plus upcoming seasonal activities.',
      category: 'Grand Theft Auto VI',
    },
    'rss-fallback-3': {
      title: 'Grand Theft Auto VI — Console-Specific Hotfixes for DualSense & Xbox VRR',
      summary: 'Details on the latest rapid fixes for DualSense haptic feedback on PlayStation 5 and VRR / Dolby Atmos enhancements on Xbox Series X|S.',
      category: 'Title Update',
    },
  },
  es: {
    'rss-fallback-1': {
      title: 'Grand Theft Auto VI: Title Update 01.004.000 — Rendimiento y Raytracing en Leonida',
      summary: 'Rockstar Games lanza mejoras de 60 fps en Vice Beach y Downtown junto a ajustes de tráfico y red en PS5 y Xbox Series X|S.',
      category: 'Title Update',
    },
    'rss-fallback-2': {
      title: 'Bienvenidos a Leonida: Nuevos retos de foto y Comunidad de Vice City',
      summary: 'Selección semanal de fotos del Modo Foto en Grassrivers, Ocean Drive y Port Gellhorn.',
      category: 'Grand Theft Auto VI',
    },
    'rss-fallback-3': {
      title: 'Grand Theft Auto VI — Hotfixes específicos para DualSense y Xbox VRR',
      summary: 'Detalles sobre las últimas correcciones de respuesta háptica en PS5 y VRR / Dolby Atmos en Xbox Series X|S.',
      category: 'Title Update',
    },
  },
  de: {
    'rss-fallback-1': {
      title: 'Grand Theft Auto VI: Title Update 01.004.000 — Leonida Performance & Raytracing',
      summary: 'Rockstar Games veröffentlicht 60-fps-Optimierungen in Vice Beach und Downtown sowie Netzwerk-Updates für PS5 und Xbox Series X|S.',
      category: 'Title Update',
    },
    'rss-fallback-2': {
      title: 'Willkommen in Leonida: Neue Foto-Challenges & Community-Spotlight',
      summary: 'Die besten Spielerfotos der Woche aus dem Fotomodus in Grassrivers, Ocean Drive und Port Gellhorn.',
      category: 'Grand Theft Auto VI',
    },
    'rss-fallback-3': {
      title: 'Grand Theft Auto VI — Konsolenspezifische Hotfixes für DualSense & Xbox VRR',
      summary: 'Infos zu den neuesten Korrekturen für DualSense-Haptik auf PS5 sowie VRR und Dolby Atmos auf Xbox Series X|S.',
      category: 'Title Update',
    },
  },
  fr: {
    'rss-fallback-1': {
      title: 'Grand Theft Auto VI : Title Update 01.004.000 — Performance & Raytracing à Leonida',
      summary: 'Rockstar Games déploie des optimisations 60 fps à Vice Beach et Downtown ainsi que des améliorations réseau sur PS5 et Xbox Series X|S.',
      category: 'Title Update',
    },
    'rss-fallback-2': {
      title: 'Bienvenue à Leonida : Nouveaux défis photo & Coup de projecteur Vice City',
      summary: 'Sélection hebdomadaire des clichés du Mode Photo pris aux Grassrivers, sur Ocean Drive et à Port Gellhorn.',
      category: 'Grand Theft Auto VI',
    },
    'rss-fallback-3': {
      title: 'Grand Theft Auto VI — Correctifs dédiés DualSense & Xbox VRR',
      summary: 'Détails sur les derniers correctifs haptiques PS5 et les améliorations VRR / Dolby Atmos sur Xbox Series X|S.',
      category: 'Title Update',
    },
  },
  pt: {
    'rss-fallback-1': {
      title: 'Grand Theft Auto VI: Title Update 01.004.000 — Desempenho e Raytracing em Leonida',
      summary: 'A Rockstar Games lança otimizações de 60 fps em Vice Beach e Downtown além de melhorias de rede no PS5 e Xbox Series X|S.',
      category: 'Title Update',
    },
    'rss-fallback-2': {
      title: 'Bem-vindo a Leonida: Novos Desafios de Foto e Destaque da Comunidade',
      summary: 'Seleção semanal das melhores capturas do Modo Foto em Grassrivers, Ocean Drive e Port Gellhorn.',
      category: 'Grand Theft Auto VI',
    },
    'rss-fallback-3': {
      title: 'Grand Theft Auto VI — Hotfixes dedicados para DualSense e Xbox VRR',
      summary: 'Detalhes sobre as correções recentes de resposta háptica no PS5 e VRR / Dolby Atmos no Xbox Series X|S.',
      category: 'Title Update',
    },
  },
};
