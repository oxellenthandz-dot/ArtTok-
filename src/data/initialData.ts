import {
  ArtCategory,
  ArtVideoPost,
  CollaborationArtist,
  StoryScenario,
  Conversation,
  NotificationItem,
  UserProfileData
} from '../types';

export const ART_CATEGORIES: ArtCategory[] = [
  {
    id: 'manga-webtoon',
    name: 'Manga & Webtoon',
    subtitle: 'Shonen, Shojo, Seinen & Webtoon scroll',
    domain: 'visuel',
    iconName: 'Sparkles',
    color: '#FE2C55',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    postCount: 4820,
    artistsCount: 1320,
    popularTags: ['#MangaArtist', '#WebtoonCanvas', '#PlancheManga', '#ShonenVibes'],
    description: 'Planches encrées, speed-draws de cases, création de personnages et univers shonen créés par la jeunesse créative.'
  },
  {
    id: 'sculpture-plastique',
    name: 'Arts Plastiques & Sculpture',
    subtitle: 'Argile, Terre cuite, Modelage & Résine',
    domain: 'plastique',
    iconName: 'Hammer',
    color: '#FF6D00',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    postCount: 1980,
    artistsCount: 640,
    popularTags: ['#ArtPlastique', '#SculptureArgile', '#Modelage', '#TerreCuite', '#Polymere'],
    description: 'Sculpture sous toutes ses formes : argile autodurcissante, pâte polymère, modelage de statuettes, bustes d\'anime et travail de la matière en 3 dimensions.'
  },
  {
    id: 'peinture-aquarelle',
    name: 'Peinture & Aquarelle',
    subtitle: 'Huile, Acrylique, Gouache & Lavis',
    domain: 'visuel',
    iconName: 'Brush',
    color: '#00E676',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    postCount: 3100,
    artistsCount: 1140,
    popularTags: ['#Aquarelle', '#PeintureAcrylique', '#ArtTraditionnel', '#Sketchbook', '#PeintureHuile'],
    description: 'Le charme des pigments réels, glacis, carnets de croquis remplis à l\'aquarelle, gouaches vibrantes et toiles grand format.'
  },
  {
    id: 'illustration-digitale',
    name: 'Illustration & Art Digital',
    subtitle: 'Procreate, Clip Studio & Photoshop',
    domain: 'numerique',
    iconName: 'Palette',
    color: '#25F4EE',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    postCount: 6150,
    artistsCount: 2410,
    popularTags: ['#DigitalArt', '#ProcreateArt', '#Speedpaint', '#CharacterDesign'],
    description: 'Colorisations vibrantes, portraits fantastiques, fanarts et concept art réalisés par des illustrateurs ados sur tablette graphique.'
  },
  {
    id: 'ceramique-poterie',
    name: 'Céramique & Poterie',
    subtitle: 'Tournage, Émaillage & Céramique d\'art',
    domain: 'plastique',
    iconName: 'Sparkles',
    color: '#E07A5F',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    postCount: 940,
    artistsCount: 310,
    popularTags: ['#PoterieAdo', '#Ceramique', '#TourDePotier', '#EmailArt'],
    description: 'Créations en terre, vases artistiques, tasses modelées au tour et textures émaillées sorties du four.'
  },
  {
    id: 'dessin-traditionnel',
    name: 'Dessin & Croquis Traditionnel',
    subtitle: 'Crayon graphite, Fusain, Sanguine & Plume',
    domain: 'visuel',
    iconName: 'PenTool',
    color: '#9E9E9E',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    postCount: 4210,
    artistsCount: 1680,
    popularTags: ['#CrayonGraphite', '#Fusain', '#CroquisRapide', '#AnatomieArt'],
    description: 'Études d\'anatomie, hachures, estompes au fusain, croquis sur le vif et maîtrise du trait pur sur papier.'
  },
  {
    id: 'animation-sakuga',
    name: 'Animation 2D & Sakuga',
    subtitle: 'Image par image, Flipbook & Sakuga cuts',
    domain: 'numerique',
    iconName: 'Film',
    color: '#FFB800',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    postCount: 2340,
    artistsCount: 890,
    popularTags: ['#2DAnimation', '#Sakuga', '#Flipbook', '#RoughAnimation'],
    description: 'Courts extraits animés image par image, combats dynamiques, loops poétiques et tests de fluidité.'
  },
  {
    id: 'street-art',
    name: 'Street Art & Graffiti',
    subtitle: 'Muralisme, Aérosol, Posca & Pochoir',
    domain: 'visuel',
    iconName: 'Flame',
    color: '#F72585',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    postCount: 1720,
    artistsCount: 580,
    popularTags: ['#StreetArt', '#GraffitiArt', '#PoscaArt', '#Muralisme'],
    description: 'Fresques urbaines, lettrages wildstyle au Posca, toiles à la bombe aérosol et pochoirs graphiques.'
  },
  {
    id: 'blender-3d',
    name: '3D, Blender & CGI',
    subtitle: 'Modelage, Sculpture 3D & Rendu volumétrique',
    domain: 'numerique',
    iconName: 'Box',
    color: '#3A86FF',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    postCount: 1470,
    artistsCount: 520,
    popularTags: ['#Blender3D', '#LowPoly', '#3DModeling', '#ShaderArt'],
    description: 'Décors 3D futuristes, personnages sculptés sur Blender et animations volumétriques par de jeunes passionnés.'
  },
  {
    id: 'dioramas-maquettes',
    name: 'Maquettes, Dioramas & Résine',
    subtitle: 'Miniatures, Décors d\'animation & Époxy',
    domain: 'plastique',
    iconName: 'Layers',
    color: '#8338EC',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    postCount: 880,
    artistsCount: 290,
    popularTags: ['#DioramaArt', '#MaquetteAnime', '#ResineEpoxy', '#MiniatureWorld'],
    description: 'Mondes miniatures fascinants, décors pour stop-motion, dioramas inspirés d\'animes et inclusions artistiques en résine.'
  },
  {
    id: 'arts-textiles-custom',
    name: 'Arts Appliqués & Customisation',
    subtitle: 'Sneakers peintes, Stylisme, Vêtements & Tufting',
    domain: 'applique',
    iconName: 'Scissors',
    color: '#06D6A0',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    postCount: 1650,
    artistsCount: 610,
    popularTags: ['#CustomSneakers', '#StylismeAdo', '#PeintureSurTissu', '#UpcyclingArt'],
    description: 'Transformations de baskets à l\'acrylique Angelus, créations textiles, broderie contemporaine et tapis tuftés main.'
  },
  {
    id: 'photographie-art',
    name: 'Photographie Artistique',
    subtitle: 'Argentique, Light painting & Portraits conceptuels',
    domain: 'visuel',
    iconName: 'Camera',
    color: '#4CC9F0',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    postCount: 1540,
    artistsCount: 490,
    popularTags: ['#PhotoArgentique', '#LightPainting', '#PhotoConceptuelle', '#ArtVisuel'],
    description: 'Prises de vue argentiques 35mm, jeux d\'ombres et néons, compositions poétiques et retouches créatives.'
  },
  {
    id: 'scenario-ecriture',
    name: 'Scénario & Storytelling',
    subtitle: 'Worldbuilding, Scripts de Manga & Univers',
    domain: 'narratif',
    iconName: 'BookOpen',
    color: '#9D4EDD',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    postCount: 1840,
    artistsCount: 750,
    popularTags: ['#Scenariste', '#LoreAnime', '#Worldbuilding', '#PitchBD'],
    description: 'Récits originaux, fiches personnages, dialogues percutants et synopsis cherchant des dessinateurs.'
  },
  {
    id: 'musique-lofi',
    name: 'Musique, Lo-Fi & Beatmaking',
    subtitle: 'Lo-Fi chill, OST d\'Anime & Sound Design',
    domain: 'sonore',
    iconName: 'Headphones',
    color: '#FF007F',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    postCount: 2190,
    artistsCount: 680,
    popularTags: ['#BeatmakerAdo', '#LoFiBeats', '#AnimeOST', '#SoundDesign'],
    description: 'Musiques d\'ambiance pour dessiner, beats d\'anime et compositions originales pour projets multimédia.'
  },
  {
    id: 'danse-performance',
    name: 'Arts Vivants & Body Art',
    subtitle: 'Danse conceptuelle, Body painting & Théâtre d\'anime',
    domain: 'vivant',
    iconName: 'Activity',
    color: '#E63946',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    postCount: 1120,
    artistsCount: 380,
    popularTags: ['#DanseContemporaine', '#BodyArt', '#ChoregrapheAdo', '#PerformanceArt'],
    description: 'Expressions du corps en mouvement, chorégraphies inspirées de musiques d\'animes et maquillages artistiques corporels.'
  },
  {
    id: 'calligraphie-lettrage',
    name: 'Calligraphie & Lettrage d\'Art',
    subtitle: 'Encre de Chine, Kanji, Brush Pen & Typo manuelle',
    domain: 'applique',
    iconName: 'Feather',
    color: '#D4AF37',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    postCount: 890,
    artistsCount: 320,
    popularTags: ['#Calligraphie', '#BrushLettering', '#KanjiArt', '#EncreDeChine'],
    description: 'Tracés amples au pinceau traditionnel, lettrages de logos pour titres de webtoons et compositions calligraphiques.'
  }
];

export const INITIAL_ART_POSTS: ArtVideoPost[] = [
  {
    id: 'post-1',
    creatorId: 'art-maya',
    creatorName: 'Maya 🌸',
    creatorHandle: 'artby_maya',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    creatorAge: '16 ans',
    creatorRole: 'Dessinatrice Manga & Character Designer',
    isVerifiedTeen: true,
    categoryId: 'manga-webtoon',
    categoryName: 'Manga & Webtoon',
    caption: 'Speedpaint de mon héroïne "Kiyomi" pour mon projet de webtoon shonen ! J\'ai passé 7 heures sur l\'encrage des yeux ✨ Des avis ?',
    hashtags: ['#MangaArt', '#Webtoon', '#Speedpaint', '#ClipStudio', '#AdoArtiste'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    artworkPoster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
    soundTitle: 'Lo-Fi Rain & Chill Beats',
    soundArtist: 'Noah Beatmaker (ArtTok Collab)',
    soundCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    likesCount: 14250,
    commentsCount: 384,
    sharesCount: 1205,
    bookmarksCount: 2310,
    isLiked: false,
    isBookmarked: false,
    isFollowing: false,
    artTools: ['Clip Studio Paint EX', 'Tablette Huion Kamvas 16'],
    collaborationNotice: '🤝 Cherche un scénariste pour co-écrire l\'arc 2 ! Voir onglet Collab',
    comments: [
      {
        id: 'c-1',
        authorName: 'Lucas Scénario',
        authorHandle: 'lucas_script',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        authorAge: '17 ans',
        text: 'Les reflets dans le regard sont incroyables !! Ton style collerait trop avec mon synopsis Dark Fantasy.',
        likesCount: 124,
        timeAgo: 'Il y a 2h',
        isLiked: false
      },
      {
        id: 'c-2',
        authorName: 'Yuki_Draws',
        authorHandle: 'yuki_draws',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        authorAge: '15 ans',
        text: 'Le line-art est ultra propre ! Tu utilises quelle brosse pour l\'encrage ?',
        likesCount: 56,
        timeAgo: 'Il y a 4h',
        isLiked: false
      },
      {
        id: 'c-3',
        authorName: 'Léo Anim',
        authorHandle: 'leo_anim',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        authorAge: '16 ans',
        text: 'Si un jour tu veux animer un extrait d\'intro en 2D, dis-le moi dans l\'onglet collaboration !',
        likesCount: 89,
        timeAgo: 'Il y a 6h',
        isLiked: false
      }
    ]
  },
  {
    id: 'post-2',
    creatorId: 'art-kaito',
    creatorName: 'Kaito ⚡',
    creatorHandle: 'kaito_2d',
    creatorAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    creatorAge: '17 ans',
    creatorRole: 'Animateur 2D Sakuga',
    isVerifiedTeen: true,
    categoryId: 'animation',
    categoryName: 'Animation & Sakuga',
    caption: 'Test d\'impact frame & esquive en 24fps ! Fait sur Krita pendant les vacances scolaires. 45 dessins au total 💥',
    hashtags: ['#2DAnimation', '#Sakuga', '#Krita', '#AnimationStudy', '#IndieAnime'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    artworkPoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
    soundTitle: 'Cyber Samurai (Original Beat)',
    soundArtist: 'Kaito Sound x ArtTok',
    soundCover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    likesCount: 28400,
    commentsCount: 942,
    sharesCount: 3120,
    bookmarksCount: 5410,
    isLiked: true,
    isBookmarked: false,
    isFollowing: true,
    artTools: ['Krita', 'Wacom One', 'Timing Chart'],
    collaborationNotice: '🤝 Cherche un coloriste pour mettre en couleur les frames d\'action !',
    comments: [
      {
        id: 'c-4',
        authorName: 'Camille Color',
        authorHandle: 'camille_colors',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        authorAge: '16 ans',
        text: 'La dynamique du ralenti juste avant l\'impact est folle ! Je peux m\'occuper de la colo si tu veux.',
        likesCount: 210,
        timeAgo: 'Il y a 1h',
        isLiked: false
      }
    ]
  },
  {
    id: 'post-3',
    creatorId: 'art-ines',
    creatorName: 'Inès Art 🌿',
    creatorHandle: 'ines_aquarelle',
    creatorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    creatorAge: '15 ans',
    creatorRole: 'Aquarelliste & Peintre',
    isVerifiedTeen: true,
    categoryId: 'peinture-aquarelle',
    categoryName: 'Peinture & Aquarelle',
    caption: 'Relaxing timelapse : réalisation d\'une forêt de conte de fées avec de la gouache et de l\'aquarelle irisée. Le son des pinceaux est si satisfaisant !',
    hashtags: ['#Aquarelle', '#TraditionalArt', '#ArtTherapy', '#SketchbookTour'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    artworkPoster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&auto=format&fit=crop&q=80',
    soundTitle: 'Acoustic Morning Forest',
    soundArtist: 'Inès Ambient Sounds',
    soundCover: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&auto=format&fit=crop&q=80',
    likesCount: 9830,
    commentsCount: 195,
    sharesCount: 680,
    bookmarksCount: 1450,
    isLiked: false,
    isBookmarked: false,
    isFollowing: false,
    artTools: ['Aquarelles Winsor & Newton', 'Papier Arches 300g'],
    collaborationNotice: 'Dispo pour faire les couvertures d\'histoires et de romans !',
    comments: [
      {
        id: 'c-5',
        authorName: 'Nox Script',
        authorHandle: 'nox_story',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        authorAge: '18 ans',
        text: 'C\'est pile le ton poétique dont j\'ai besoin pour la jaquette de mon recueil fantastique !',
        likesCount: 45,
        timeAgo: 'Hier',
        isLiked: false
      }
    ]
  },
  {
    id: 'post-4',
    creatorId: 'art-noah',
    creatorName: 'Noah Beatmaker 🎧',
    creatorHandle: 'noah_lofi',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    creatorAge: '18 ans',
    creatorRole: 'Beatmaker & Compositeur d\'OST',
    isVerifiedTeen: true,
    categoryId: 'musique-lofi',
    categoryName: 'Musique & Beatmaking',
    caption: 'J\'ai composé ce beat Lo-Fi spécialement pour que vous puissiez dessiner tranquille le soir. Libre d\'utilisation pour tous vos projets ArtTok ! 🎹',
    hashtags: ['#LoFiBeats', '#MusicProducer', '#AnimeSoundtrack', '#FLStudio'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    artworkPoster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=80',
    soundTitle: 'Late Night Manga Sketching',
    soundArtist: 'Noah Beatmaker (Original)',
    soundCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    likesCount: 19100,
    commentsCount: 420,
    sharesCount: 2840,
    bookmarksCount: 4900,
    isLiked: false,
    isBookmarked: true,
    isFollowing: false,
    artTools: ['FL Studio 21', 'Akai MPK Mini', 'Guitare électrique Fender'],
    collaborationNotice: '🤝 Ouvert pour composer l\'OST de vos webtoons animés et courts-métrages',
    comments: [
      {
        id: 'c-6',
        authorName: 'Maya 🌸',
        authorHandle: 'artby_maya',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        authorAge: '16 ans',
        text: 'C\'est littéralement ce son que j\'ai mis sur mon dernier dessin ! Merci Noah ✨',
        likesCount: 88,
        timeAgo: 'Il y a 3h',
        isLiked: false
      }
    ]
  },
  {
    id: 'post-5',
    creatorId: 'art-sam',
    creatorName: 'Sam 3D 🛸',
    creatorHandle: 'sam_blender',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    creatorAge: '17 ans',
    creatorRole: 'Artiste 3D & Environnement',
    isVerifiedTeen: true,
    categoryId: '3d-blender',
    categoryName: '3D & Blender',
    caption: 'Création d\'un temple néon cyberpunk sous la pluie dans Blender ! J\'ai appris la 3D tout seul sur YouTube en 1 an. N\'abandonnez jamais vos passions !',
    hashtags: ['#Blender3D', '#CyberpunkArt', '#3DRender', '#Eevvee', '#TeenCreator'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    artworkPoster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
    soundTitle: 'Synthwave Night Ride',
    soundArtist: 'RetroWave Teens',
    soundCover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
    likesCount: 16750,
    commentsCount: 310,
    sharesCount: 1540,
    bookmarksCount: 3890,
    isLiked: false,
    isBookmarked: false,
    isFollowing: false,
    artTools: ['Blender 4.2', 'Substance Painter', 'GeForce RTX'],
    collaborationNotice: 'Je peux modéliser des décors 3D d\'arrière-plan pour des dessinateurs de webtoon !',
    comments: [
      {
        id: 'c-7',
        authorName: 'Alex Manga',
        authorHandle: 'alex_manga',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        authorAge: '16 ans',
        text: 'Les textures de pluie sur le verre sont folles ! Est-ce que tu peux exporter des angles de vue en 2D ?',
        likesCount: 34,
        timeAgo: 'Il y a 5h',
        isLiked: false
      }
    ]
  }
];

export const INITIAL_COLLAB_ARTISTS: CollaborationArtist[] = [
  {
    id: 'collab-1',
    name: 'Maya Chen',
    handle: 'artby_maya',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    age: '16 ans',
    role: 'Dessinatrice Manga & Character Designer',
    category: 'Manga & Webtoon',
    bio: 'Passionnée de shonen d\'action et fantasy depuis l\'enfance. Je dessine 4 heures par jour. Mon rêve est de sortir un manga broché avant mes 18 ans !',
    skills: ['Character Design', 'Encrage numérique', 'Expression des visages', 'Planches dynamiques'],
    lookingFor: 'Cherche un(e) scénariste adolescent(e) pour co-écrire un manga Shonen urbain fantastique (scénario prêt à 50%).',
    availableForCollab: true,
    tools: ['Clip Studio Paint', 'Huion Kamvas 16 Pro'],
    portfolioSamples: [
      {
        title: 'Héroïne Shonen Kiyomi',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        type: 'Illustration'
      },
      {
        title: 'Planche de combat - Page 12',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        type: 'Planche Manga'
      }
    ],
    socials: {
      instagram: '@maya_manga_art',
      discord: 'MayaDraws#4021',
      tiktok: '@artby_maya'
    },
    registeredDate: 'Il y a 3 jours',
    collabProjectsCount: 2
  },
  {
    id: 'collab-2',
    name: 'Lucas Vauthier',
    handle: 'lucas_script',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    age: '17 ans',
    role: 'Scénariste & Storyteller',
    category: 'Scénario & Écriture',
    bio: 'Écrivain en herbe passionné de dark fantasy, intrigues psychologiques et rebondissements inattendus. J\'ai déjà écrit 6 chapitres complets découpés en cases de webtoon.',
    skills: ['Découpage de storyboards', 'Dialogues percutants', 'Worldbuilding complet', 'Fiches de lore'],
    lookingFor: 'Recherche un dessinateur manga ou webtoon pour donner vie à mon projet "Les Échos du Crépuscule".',
    availableForCollab: true,
    tools: ['Notion', 'Scrivener', 'Google Docs'],
    portfolioSamples: [
      {
        title: 'Synopsis & Bible d\'univers',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
        type: 'Dossier Scénario'
      }
    ],
    socials: {
      discord: 'Lucas_Script#9182',
      instagram: '@lucas_storytelling'
    },
    registeredDate: 'Il y a 5 jours',
    collabProjectsCount: 1
  },
  {
    id: 'collab-3',
    name: 'Léa Bernard',
    handle: 'lea_anim',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    age: '15 ans',
    role: 'Animatrice 2D & Motion',
    category: 'Animation & Sakuga',
    bio: 'Adolescente accro à l\'animation japonaise et aux cuts de combat intenses. Je fais des tests d\'animation rough et clean-up sur TVPaint et Krita.',
    skills: ['Rough Animation', 'In-betweens (intervallisme)', 'Timing & Spacing', 'Effets visuels FX'],
    lookingFor: 'Cherche un compositeur / beatmaker pour mettre en musique mon court-métrage de 45 secondes prévu pour fin d\'année !',
    availableForCollab: true,
    tools: ['TVPaint', 'Krita', 'Wacom One'],
    portfolioSamples: [
      {
        title: 'Combat d\'épées 24fps',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        type: 'Animation'
      }
    ],
    socials: {
      tiktok: '@lea_anim2d',
      discord: 'LeaSakuga#1002'
    },
    registeredDate: 'Il y a 1 semaine',
    collabProjectsCount: 3
  },
  {
    id: 'collab-4',
    name: 'Noah Morel',
    handle: 'noah_lofi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    age: '18 ans',
    role: 'Beatmaker & Compositeur Sonore',
    category: 'Musique & Beatmaking',
    bio: 'Musicien multi-instrumentiste (piano, guitare, synthés). Je compose des ambiances chill, hip-hop lo-fi et des OST orchestrales épiques pour projets animés.',
    skills: ['Sound Design', 'Composition OST', 'Mixage & Mastering', 'Création de thèmes de personnages'],
    lookingFor: 'Dispo pour collaborer avec des animateurs, créateurs de trailers de mangas ou youtubeurs artistiques ados !',
    availableForCollab: true,
    tools: ['FL Studio 21', 'Ableton Live', 'Micro Rode NT1'],
    portfolioSamples: [
      {
        title: 'EP Instrumental "Midnight Sketch"',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        type: 'OST Album'
      }
    ],
    socials: {
      instagram: '@noah_beats_art',
      discord: 'NoahProd#7744'
    },
    registeredDate: 'Il y a 2 semaines',
    collabProjectsCount: 5
  },
  {
    id: 'collab-5',
    name: 'Camille Dubois',
    handle: 'camille_colors',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    age: '16 ans',
    role: 'Coloriste Digital & Lumières',
    category: 'Illustration & 2D',
    bio: 'Ma passion c\'est la lumière, le rendu volumétrique et les ambiances colorimétriques chatoyantes. J\'adore prendre le dessin d\'un autre artiste et le sublimer !',
    skills: ['Théorie des couleurs', 'Ombres portées', 'Lumières volumétriques', 'Finition webtoon'],
    lookingFor: 'Je cherche des dessinateurs qui ont des planches encrées en noir et blanc à mettre en couleurs pour des webtoons Webtoon Canvas.',
    availableForCollab: true,
    tools: ['Photoshop', 'Procreate'],
    portfolioSamples: [
      {
        title: 'Colorisation Portrait Fantastique',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
        type: 'Colorisation'
      }
    ],
    socials: {
      instagram: '@camille_colors',
      discord: 'CamColor#3319'
    },
    registeredDate: 'Il y a 4 jours',
    collabProjectsCount: 2
  }
];

export const INITIAL_STORY_SCENARIOS: StoryScenario[] = [
  {
    id: 'story-1',
    title: 'L\'Atelier des Ombres Éveillées',
    tagline: 'Dans une ville où les dessins des adolescents prennent vie la nuit, un carnet oublié déclenche une malédiction.',
    synopsis: 'Kael, 16 ans, est un lycéen solitaire passionné de graffiti et d\'encre de Chine. Une nuit de pleine lune, son carnet de croquis s\'illumine : chaque créature qu\'il a dessinée s\'échappe dans la ville. Pour éviter le chaos, il doit s\'associer avec Mei, une jeune peintre prodige capable de sceller les esprits grâce à des pigments d\'aquarelle enchantés.',
    genre: 'Urban Fantasy & Action',
    author: {
      name: 'Lucas Vauthier',
      handle: 'lucas_script',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      age: '17 ans',
      role: 'Scénariste'
    },
    targetFormat: 'Webtoon',
    status: 'Recherche Dessinateur',
    tags: ['#Webtoon', '#UrbanFantasy', '#MagieArt', '#DuoAdos', '#ShonenModerne'],
    likesCount: 342,
    commentsCount: 28,
    collaboratorsNeeded: ['Dessinateur principal (style manga)', 'Coloriste d\'ambiances néons'],
    createdAt: 'Il y a 3 jours',
    panels: [
      {
        order: 1,
        title: 'Case d\'ouverture : Le rooftop au crépuscule',
        visualNotes: 'Vue en plongée sur la ville sous un ciel violet/rose crépusculaire. Kael est assis sur le rebord du toit, un carnet à spirales ouvert sur ses genoux. Le vent fait voltiger ses mèches.',
        dialogue: 'Kael (pensée) : "Le monde réel manque cruellement de couleurs. Alors je lui en donne."'
      },
      {
        order: 2,
        title: 'Case 2 : L\'encre vivante',
        visualNotes: 'Gros plan sur la page de papier vergé. Une silhouette de renard corbeau stylisé dessinée à l\'encre noire commence à s\'élever en 3D au-dessus du papier, avec des gouttelettes d\'encre liquide en suspension.',
        dialogue: 'Bruitage : *FLUUUSH... SHHH*'
      },
      {
        order: 3,
        title: 'Case 3 : L\'apparition de Mei',
        visualNotes: 'Un pinceau en bois frappe le sol avec un éclat turquoise étincelant. Mei apparaît vêtue d\'un tablier d\'artiste orné de runes lumineuses.',
        dialogue: 'Mei : "Range immédiatement ce carnet, débutant ! Tu viens d\'ouvrir la porte de l\'Enclave."'
      }
    ]
  },
  {
    id: 'story-2',
    title: 'Neon Pulse 2099',
    tagline: 'Dans une mégapole cyberpunk, deux ados hackent les panneaux publicitaires holographiques pour diffuser du véritable art.',
    synopsis: 'En 2099, l\'intelligence artificielle commerciale a interdit toute création artistique humaine. Deux jeunes rebels, Zack (17 ans, mécano et graffeur hologramme) et Sola (16 ans, compositrice d\'ondes sonores), lancent le mouvement clandestin "Art-Pulse" pour réveiller les émotions de la population à travers des flashmobs audiovisuels illégaux.',
    genre: 'Cyberpunk & Révolution',
    author: {
      name: 'Sarah Blade',
      handle: 'sarah_stories',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      age: '16 ans',
      role: 'Auteure & Scénariste BD',
    },
    targetFormat: 'Manga',
    status: 'Recherche Dessinateur',
    tags: ['#Cyberpunk', '#Rebellion', '#Hologramme', '#ArtContreMachine', '#SciFi'],
    likesCount: 512,
    commentsCount: 45,
    collaboratorsNeeded: ['Dessinateur Mecha & Décor Cyberpunk', 'Sound Designer pour bande sonore interactive'],
    createdAt: 'Il y a 6 jours',
    panels: [
      {
        order: 1,
        title: 'Case 1 : Les tours monolithiques',
        visualNotes: 'Plongeon vertical à travers des gratte-ciels gigantesques saturés d\'écrans géants vendant des produits synthétiques.',
        dialogue: 'Voix IA de la ville : "Souriez citoyen. Votre taux de productivité est optimal."'
      },
      {
        order: 2,
        title: 'Case 2 : L\'étincelle pirate',
        visualNotes: 'Zack appuie sur un déclencheur fait maison. Tous les écrans virent soudainement au rose magenta et au turquoise avec une fresque peinte à la main géante.',
        dialogue: 'Zack : "Le spectacle commence ! Branche les basses, Sola !"'
      }
    ]
  },
  {
    id: 'story-3',
    title: 'L\'Harmonie des Saisons Perdues',
    tagline: 'Une fable douce et mélancolique entre un esprit de l\'automne et une jeune apprentie potière.',
    synopsis: 'Dans un village montagnard où les saisons sont bloquées en un hiver éternel, Yuna découvre un jeune esprit de l\'automne endormi dans un vase en argile millénaire. Ensemble, ils devront recréer les quatre récipients sacrés de la nature pour redonner au monde le vert du printemps et l\'or des moissons.',
    genre: 'Tranche de vie Fantastique',
    author: {
      name: 'Nox Script',
      handle: 'nox_story',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      age: '18 ans',
      role: 'Scénariste Poétique',
    },
    targetFormat: 'BD Franco-Belge',
    status: 'Collab active',
    tags: ['#Poetique', '#GhibliVibes', '#Nature', '#Argile', '#ContedeFees'],
    likesCount: 420,
    commentsCount: 33,
    collaboratorsNeeded: ['Aquarelliste pour décors nature'],
    createdAt: 'Il y a 1 semaine',
    panels: [
      {
        order: 1,
        title: 'Case 1 : Le tour de potier',
        visualNotes: 'L\'argile tourne sous les mains couvertes de boue de Yuna. La lumière filtre à travers les vitres givrées de l\'atelier.',
        dialogue: 'Yuna : "Si seulement la terre pouvait se souvenir de la chaleur du soleil..."'
      }
    ]
  }
];

export const INITIAL_USER_PROFILE: UserProfileData = {
  id: 'user-self',
  name: 'Toi (Artiste)',
  handle: 'mon_art_ado',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  bio: '🎨 Passionné de Manga, Illustration Digitale & Arts Plastiques | 📖 En train d\'écrire mon premier Webtoon | 🤝 Ouvert aux collabs !',
  age: '16 ans',
  role: 'Dessinateur & Créateur d\'Univers',
  artCategory: 'Manga & Arts Plastiques',
  followersCount: 1284,
  followingCount: 89,
  likesTotalCount: 18450,
  portfolioUrl: 'https://arttok.app/@mon_art_ado',
  isRegisteredInCollab: false,
  socials: {
    instagram: '@mon_art_ado',
    discord: 'mon_art_ado#4421',
    tiktok: '@mon_art_ado',
  },
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-maya',
    partnerId: 'art-maya',
    partnerName: 'Maya 🌸',
    partnerHandle: 'artby_maya',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    partnerRole: 'Dessinatrice Manga & Character Designer',
    lastMessage: 'Carrément chaud pour tester un crossover de nos personnages ! Tu as du temps ce week-end ?',
    lastMessageTime: '14:22',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm-1',
        senderId: 'art-maya',
        senderName: 'Maya 🌸',
        senderHandle: 'artby_maya',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        text: 'Salut ! J\'ai adoré ta dernière vidéo sur le flux ArtTok, ton découpage de planches est super dynamique !',
        timestamp: '14:15',
        isMe: false,
      },
      {
        id: 'm-2',
        senderId: 'user-self',
        senderName: 'Toi',
        senderHandle: 'mon_art_ado',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        text: 'Merci beaucoup Maya ! Ton travail sur Kiyomi m\'a trop inspiré pour les yeux.',
        timestamp: '14:18',
        isMe: true,
      },
      {
        id: 'm-3',
        senderId: 'art-maya',
        senderName: 'Maya 🌸',
        senderHandle: 'artby_maya',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        text: 'Carrément chaud pour tester un crossover de nos personnages ! Tu as du temps ce week-end ?',
        timestamp: '14:22',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-lucas',
    partnerId: 'art-lucas',
    partnerName: 'Lucas Vauthier 🖋️',
    partnerHandle: 'lucas_scenario',
    partnerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    partnerRole: 'Scénariste & Storyboarder',
    lastMessage: 'Je t\'ai préparé le découpage de la scène 3 du scénario ! Dis-moi ce que tu en penses.',
    lastMessageTime: 'Hier',
    unreadCount: 0,
    isOnline: false,
    lastSeen: 'il y a 2 heures',
    messages: [
      {
        id: 'm-l-1',
        senderId: 'art-lucas',
        senderName: 'Lucas Vauthier 🖋️',
        senderHandle: 'lucas_scenario',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        text: 'Hey ! J\'ai vu que tu cherchais un projet de scénario pour dessiner du manga fantasy.',
        timestamp: 'Hier 18:40',
        isMe: false,
      },
      {
        id: 'm-l-2',
        senderId: 'user-self',
        senderName: 'Toi',
        senderHandle: 'mon_art_ado',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        text: 'Oui exactement ! Ton univers "L\'Éveil d\'Astra" a l\'air incroyable.',
        timestamp: 'Hier 19:05',
        isMe: true,
      },
      {
        id: 'm-l-3',
        senderId: 'art-lucas',
        senderName: 'Lucas Vauthier 🖋️',
        senderHandle: 'lucas_scenario',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        text: 'Je t\'ai préparé le découpage de la scène 3 du scénario ! Dis-moi ce que tu en penses.',
        timestamp: 'Hier 19:30',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-noah',
    partnerId: 'art-noah',
    partnerName: 'Noah Beatmaker 🎧',
    partnerHandle: 'noah_lofi',
    partnerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    partnerRole: 'Beatmaker & Compositeur OST',
    lastMessage: 'Tu peux utiliser ma track "Midnight Sketch" sur ta prochaine vidéo sans problème !',
    lastMessageTime: 'Il y a 2 j',
    unreadCount: 0,
    isOnline: false,
    lastSeen: 'il y a 2 jours',
    messages: [
      {
        id: 'm-n-1',
        senderId: 'art-noah',
        senderName: 'Noah Beatmaker 🎧',
        senderHandle: 'noah_lofi',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        text: 'Tu peux utiliser ma track "Midnight Sketch" sur ta prochaine vidéo sans problème ! Hâte de voir le speedpaint associé.',
        timestamp: 'Mercredi',
        isMe: false,
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    title: 'Maya 🌸 a aimé ton œuvre',
    description: 'Elle a double-cliqué sur ta vidéo "Encrage Shonen héroïne"',
    timeAgo: 'Il y a 10 min',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    actorHandle: 'artby_maya',
  },
  {
    id: 'notif-2',
    type: 'collab_request',
    title: 'Demande de collaboration reçue !',
    description: 'Lucas Vauthier souhaite te proposer de dessiner son scénario "L\'Éveil d\'Astra"',
    timeAgo: 'Il y a 1 h',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    actorHandle: 'lucas_scenario',
  },
  {
    id: 'notif-3',
    type: 'follow',
    title: 'Kaito s\'est abonné à ton profil',
    description: 'Kaito (Animateur 2D Sakuga) suit maintenant tes créations artistiques.',
    timeAgo: 'Il y a 3 h',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    actorHandle: 'kaito_sakuga',
  },
  {
    id: 'notif-4',
    type: 'comment',
    title: 'Nouveau commentaire de Léo Craft',
    description: '"Le niveau de détail sur la garde du katana est bluffant 🔥"',
    timeAgo: 'Il y a 5 h',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    actorHandle: 'leo_sculpt',
  },
  {
    id: 'notif-5',
    type: 'trend',
    title: 'Tendance ArtTok : Les Arts Plastiques & Sculptures',
    description: 'Plus de 450 nouvelles vidéos publiées avec le tag #ArtPlastique cette semaine.',
    timeAgo: 'Hier',
    read: true,
  },
];
