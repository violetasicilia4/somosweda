import { WeddingData, Guest, GiftItem, WeddingEvent, ReceivedGift, WeddingTable } from '../types';

// Fotos de portada curadas, usadas en el paso "Foto principal" del onboarding
// y en el editor de portada del Micrositio.
export const coverPresets = [
  {
    name: 'Atardecer Dorado',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Playa & Olas',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Estancia Campestre',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Abrazo Íntimo',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Cena con Velas',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Viñedos & Cordillera',
    url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80',
  },
];

export const initialWedding: WeddingData = {
  coupleName: 'Milagros & Juan',
  partner1: 'Milagros',
  partner2: 'Juan',
  weddingDate: '2026-10-24',
  city: 'Buenos Aires',
  venue: 'Estancia La Linda, Pilar',
  address: 'Ruta 8 Km 54, Pilar, Buenos Aires',
  status: 'BORRADOR',
  setupProgress: 35,
  slug: 'milagros-y-juan',
  bannerImage: '/ejemplo-hero.webp',
  storyText: '¡Nos casamos! Después de 6 años juntos, queremos celebrar este momento tan especial con las personas que más queremos.',
  dressCode: 'Elegante / Cocktail',
  bankAlias: 'boda.milagros.juan',
  bankCbu: '0000003100049281740291',
  bankHolder: 'Milagros & Juan',
  bankName: 'Banco Santander',
  bankCuit: '27-38912401-4',
  mercadoPagoAlias: 'milagros.juan.mp',
  mercadoPagoCvu: '0000003100088219401222',
  mercadoPagoLink: 'https://mpago.la/pos/boda-milagros-juan',
  isPaymentConfigured: true,
  durationMonths: 12,
};

export const initialGuests: Guest[] = [
  {
    id: 'g1',
    fullName: 'Camila Rodriguez',
    email: 'camila.r@gmail.com',
    phone: '+54 9 11 4829-1920',
    companionsCount: 1,
    status: 'confirmado',
    dietaryRequirement: 'Vegetariana',
    tableAssigned: 'Mesa 4',
    invitationSent: true,
  },
  {
    id: 'g2',
    fullName: 'Lucas Benítez',
    email: 'lucas.b@hotmail.com',
    phone: '+54 9 11 3912-4019',
    companionsCount: 0,
    status: 'confirmado',
    dietaryRequirement: 'Sin gluten (Celíaco)',
    tableAssigned: 'Mesa 2',
    invitationSent: true,
  },
  {
    id: 'g3',
    fullName: 'Valentina Morales',
    email: 'valen.morales@gmail.com',
    phone: '+54 9 11 5901-2299',
    companionsCount: 2,
    status: 'pendiente',
    dietaryRequirement: 'Ninguna',
    tableAssigned: 'Sin asignar',
    invitationSent: true,
  },
  {
    id: 'g4',
    fullName: 'Ignacio Ferrando',
    email: 'ignacio.f@empresa.com',
    phone: '+54 9 11 6721-0021',
    companionsCount: 1,
    status: 'pendiente',
    dietaryRequirement: 'Ninguna',
    tableAssigned: 'Sin asignar',
    invitationSent: false,
  },
  {
    id: 'g5',
    fullName: 'Florencia & Gonzalo Paz',
    email: 'gonza.paz@gmail.com',
    phone: '+54 9 11 2819-3310',
    companionsCount: 1,
    status: 'rechazado',
    dietaryRequirement: 'Ninguna',
    tableAssigned: '—',
    invitationSent: true,
  },
];

export const initialGifts: GiftItem[] = [
  {
    id: 'gf1',
    title: 'Luna de miel en Italia',
    description: 'Noche de hotel frente al mar y cenas en la costa para nuestro viaje.',
    targetPrice: 180000,
    category: 'Luna de miel',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gf2',
    title: 'Pasajes para nuestro viaje',
    description: 'Los pasajes de avión para iniciar nuestra luna de miel.',
    targetPrice: 450000,
    category: 'Luna de miel',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gf3',
    title: 'Cafetera espresso',
    description: 'Para compartir los desayunos de cada mañana juntos.',
    targetPrice: 75000,
    category: 'Casa y hogar',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gf4',
    title: 'Juego de vajilla completo',
    description: 'Platos y copas para estrenar en nuestra mesa con amigos y familia.',
    targetPrice: 65000,
    category: 'Casa y hogar',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
  },
];

export const initialReceivedGifts: ReceivedGift[] = [
  {
    id: 'rg1',
    giftId: 'gf3',
    giftTitle: 'Cena romántica frente al mar',
    giverName: 'Camila Rodriguez',
    giverEmail: 'camila.r@gmail.com',
    giverPhone: '+54 9 11 4829-1920',
    amount: 95000,
    date: '16 Sep 2026',
    method: 'transferencia',
    status: 'confirmado',
    receiptFileName: 'comprobante_transferencia_santander_4921.pdf',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    dedicationMessage: '¡Mili y Juan! Que tengan una noche mágica frente al mar. Muy feliz de verlos tan felices y de acompañarlos en este gran paso. Los quiero un montón ❤️🥂',
    thankYouMessage: '¡Cami querida! Muchísimas gracias por este regalo tan hermoso. Vamos a brindar por vos en la playa. ¡Te queremos!',
    isThanked: true,
  },
  {
    id: 'rg2',
    giftId: 'gf1',
    giftTitle: 'Noche de bodas en hotel boutique',
    giverName: 'Lucas Benítez',
    giverEmail: 'lucas.b@hotmail.com',
    giverPhone: '+54 9 11 3912-4019',
    amount: 85000,
    date: '17 Sep 2026',
    method: 'mercadopago',
    status: 'confirmado',
    dedicationMessage: '¡Felicidades amigos! A disfrutar a pleno esa noche y esa luna de miel tan esperada. ¡Nos vemos en la pista de baile!',
    isThanked: false,
  },
  {
    id: 'rg3',
    giftId: 'gf2',
    giftTitle: 'Pasajes aéreos a Polinesia',
    giverName: 'Ignacio Ferrando & Familia',
    giverEmail: 'ignacio.f@empresa.com',
    giverPhone: '+54 9 11 6721-0021',
    amount: 50000,
    date: '18 Sep 2026',
    method: 'transferencia',
    status: 'pendiente',
    receiptFileName: 'ticket_transferencia_banco_galicia.png',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    dedicationMessage: 'Un pequeño granito de arena para ese viaje de ensueño. ¡Que sean muy felices toda la vida!',
    isThanked: false,
  },
];

export const initialEvents: WeddingEvent[] = [
  {
    id: 'ev1',
    title: 'Ceremonia Religiosa',
    date: '24 Octubre 2026',
    time: '17:30 hs',
    locationName: 'Parroquia Nuestra Señora del Pilar',
    address: 'Junín 1904, Recoleta, CABA',
    description: 'Por favor llegar 15 minutos antes para ubicarse cómodamente.',
    iconType: 'church',
  },
  {
    id: 'ev2',
    title: 'Recepción y Fiesta',
    date: '24 Octubre 2026',
    time: '19:30 hs a 05:00 hs',
    locationName: 'Estancia La Linda',
    address: 'Ruta 8 Km 54, Pilar, Buenos Aires',
    description: 'Cocktail de bienvenida, cena de 3 pasos, barra libre y fiesta hasta el amanecer.',
    iconType: 'party',
  },
];

// Modelo comercial: un solo producto con todo incluido. Se paga una vez, al publicar,
// según cuánto tiempo se quiere mantener activo el sitio. Precios iniciales a validar.
export interface DurationOption {
  months: 6 | 12 | 24;
  price: number;
  note: string;
  recommended?: boolean;
}

export const durationOptions: DurationOption[] = [
  { months: 6, price: 95000, note: 'Alcanza si publicás cerca de la fecha' },
  { months: 12, price: 140000, note: 'Cubre antes, durante y después de la boda', recommended: true },
  { months: 24, price: 220000, note: 'Para conservar tu lista y sus recuerdos' },
];

export const suggestedGiftsByCategory: Record<string, Omit<GiftItem, 'id'>[]> = {
  'Luna de miel': [
    {
      title: 'Pasajes para nuestro viaje',
      description: 'Los pasajes de avión para iniciar nuestra luna de miel.',
      targetPrice: 450000,
      category: 'Luna de miel',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Noche de hotel frente al mar',
      description: 'Hospedaje con vista a la playa para descansar en nuestro viaje.',
      targetPrice: 180000,
      category: 'Luna de miel',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Excursión y paseo en barco',
      description: 'Un día de navegación y aventura recorriendo calas e islas.',
      targetPrice: 130000,
      category: 'Luna de miel',
      imageUrl: 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Cena romántica especial',
      description: 'Cena a la luz de las velas con gastronomía típica del destino.',
      targetPrice: 95000,
      category: 'Luna de miel',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Desayuno en la habitación',
      description: 'Café, frutas frescas y medialunas sin horarios ni alarmas.',
      targetPrice: 45000,
      category: 'Luna de miel',
      imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Casa y hogar': [
    {
      title: 'Cafetera espresso',
      description: 'Café de especialidad en casa para empezar cada día juntos.',
      targetPrice: 75000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Juego de vajilla completo',
      description: 'Juego de platos, tazas y piezas para recibir a amigos y familia.',
      targetPrice: 65000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Mesa de comedor',
      description: 'El espacio de encuentro diario para compartir comidas y sobremesas.',
      targetPrice: 160000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Sofá para el living',
      description: 'Un sillón cómodo y espacioso para descansar y ver películas juntos.',
      targetPrice: 280000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Juego de sábanas premium',
      description: 'Algodón suave de 400 hilos para hacer de la cama el mejor refugio.',
      targetPrice: 85000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Batería de cocina de acero',
      description: 'Juego de ollas y sartenes duraderas para cocinar de todo.',
      targetPrice: 120000,
      category: 'Casa y hogar',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Regalos simbólicos': [
    {
      title: 'Un brindis con espumante',
      description: 'Una copa de espumante para brindar por nosotros.',
      targetPrice: 20000,
      category: 'Regalos simbólicos',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Un café de especialidad',
      description: 'Para arrancar juntos cada mañana de casados.',
      targetPrice: 15000,
      category: 'Regalos simbólicos',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Flores para nuestro hogar',
      description: 'Un ramo para estrenar la casa con algo lindo.',
      targetPrice: 30000,
      category: 'Regalos simbólicos',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Una canción para bailar',
      description: 'Para seguir bailando después de la fiesta.',
      targetPrice: 25000,
      category: 'Regalos simbólicos',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Un recuerdo en fotos',
      description: 'Para revelar y enmarcar los mejores momentos.',
      targetPrice: 40000,
      category: 'Regalos simbólicos',
      imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Salidas y experiencias': [
    {
      title: 'Degustación de vinos y bodega',
      description: 'Visita guiada y cata de vinos de guarda con tabla de quesos.',
      targetPrice: 85000,
      category: 'Salidas y experiencias',
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Día de spa para dos',
      description: 'Circuito de aguas termales y masajes descontracturantes en pareja.',
      targetPrice: 95000,
      category: 'Salidas y experiencias',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Clase de cocina gourmet',
      description: 'Tarde de pastas artesanales y maridaje con chef privado.',
      targetPrice: 65000,
      category: 'Salidas y experiencias',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Paseo en velero al atardecer',
      description: 'Navegación íntima mientras cae el sol con copa de bienvenida.',
      targetPrice: 140000,
      category: 'Salidas y experiencias',
      imageUrl: 'https://images.unsplash.com/photo-1605387202149-47169c4ea58a?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Noche de teatro y cena',
      description: 'Entradas para ver una obra destacada y cena después de la función.',
      targetPrice: 75000,
      category: 'Salidas y experiencias',
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Proyectos futuros': [
    {
      title: 'Un regalo para nuestro futuro',
      description: 'Para acompañarnos en esta nueva etapa juntos.',
      targetPrice: 50000,
      category: 'Proyectos futuros',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Para nuestra casa propia',
      description: 'Ayudanos a dar los primeros pasos hacia nuestro hogar definitivo.',
      targetPrice: 150000,
      category: 'Proyectos futuros',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Para remodelar la cocina',
      description: 'Para poner a punto el corazón de nuestro hogar.',
      targetPrice: 100000,
      category: 'Proyectos futuros',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Para nuestra luna de miel',
      description: 'Para sumar a los gastos y actividades durante el viaje.',
      targetPrice: 80000,
      category: 'Proyectos futuros',
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

export const initialTables: WeddingTable[] = [
  { id: 't1', name: 'Mesa Presidencial', capacity: 8, notes: 'Novios, padrinos y familia directa' },
  { id: 't2', name: 'Mesa 2 - Amigos del Colegio', capacity: 10, notes: 'Grupo de la secundaria' },
  { id: 't3', name: 'Mesa 3 - Familia', capacity: 10, notes: 'Tíos y primos' },
  { id: 't4', name: 'Mesa 4 - Amigos de la Facu', capacity: 10, notes: 'Compañeros de arquitectura' },
  { id: 't5', name: 'Mesa 5 - Trabajo & Colegas', capacity: 8, notes: 'Colegas de oficina' },
];
