export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-pin'
  | 'reset-password'
  | 'find-couple'
  | 'choose-plan'
  | 'create-wedding'
  | 'dashboard';

// Los 3 planes de la landing (ver Pricing en LandingSections.tsx). Cada uno incluye
// todo lo del anterior: regalos ⊂ invitados-rsvp ⊂ completo.
export type WeddingPlan = 'regalos' | 'invitados-rsvp' | 'completo';

// "recibidos" (regalos recibidos / agradecimientos) ya no es una pestaña propia: es la
// tercera solapa dentro de "regalos" (ver GiftRegistryView).
export type DashboardTab =
  | 'inicio'
  | 'regalos'
  | 'rsvp'
  | 'sitio'
  | 'ayuda'
  | 'cuenta';

// Subsecciones de las pantallas con pestañas internas. La cuenta de cobro vive dentro
// del módulo de Regalos (ver GiftRegistryView), no en Cuenta.
export type CuentaSection = 'datos' | 'plan';

export interface WeddingData {
  plan?: WeddingPlan;
  // El plan más alto que la pareja llegó a probar/configurar alguna vez. Nunca baja:
  // si después cambian a un plan más chico, las funcionalidades del plan más alto
  // quedan "guardadas" (bloqueadas pero no perdidas) en vez de mostrarse como si
  // nunca las hubieran usado. Ver utils/plan.ts.
  highestPlan?: WeddingPlan;
  coupleName: string;
  partner1: string;
  partner2: string;
  weddingDate: string;
  city: string;
  venue: string;
  address: string;
  status: 'BORRADOR' | 'PUBLICADO';
  setupProgress: number;
  slug: string;
  bannerImage: string;
  storyText?: string;
  dressCode?: string;
  bankAlias?: string;
  bankCbu?: string;
  bankHolder?: string;
  bankName?: string;
  bankCuit?: string;
  mercadoPagoAlias?: string;
  mercadoPagoCvu?: string;
  mercadoPagoLink?: string;
  isPaymentConfigured?: boolean;
  publishedAt?: string;
  designTheme?: 'editorial' | 'romantico' | 'minimal' | 'clasico';
  colorPalette?: 'lino' | 'champagne' | 'bosque' | 'salvia';
  typography?: 'serif' | 'sans' | 'editorial';
  // Info para invitados (módulo "Guía para invitados" de Tu sitio). El dress code vive
  // en dressCode, arriba.
  lodgingInfo?: string;
  transportInfo?: string;
  mapLocation?: string;
  // Hashtag del casamiento (módulo "hashtag" de Tu sitio). Si no se carga, se arma uno
  // por defecto con los nombres de la pareja (ver DEFAULT_HASHTAG en utils/microsite.ts).
  hashtag?: string;
  // Fotos de la galería del micrositio — se muestran en el sitio de ejemplo solo si el
  // módulo "gallery" está tildado (ver MicrositeFeatures).
  galleryImages?: string[];
  // Qué módulos del micrositio están tildados (Tu sitio → "Módulos del sitio"). Es lo
  // que determina, en un orden fijo, qué secciones aparecen en el sitio real que ven los
  // invitados (ExampleView). Nunca se ocultan del panel del organizador, solo del sitio.
  micrositeFeatures?: MicrositeFeatures;
}

export interface MicrositeFeatures {
  countdown: boolean;    // Cuenta regresiva
  story: boolean;        // Nuestra historia
  events: boolean;       // Cronograma de eventos / itinerario
  guestInfo: boolean;    // Info para invitados (dress code, hospedaje, mapa, transporte)
  gallery: boolean;      // Galería de fotos
  giftRegistry: boolean; // Lista de regalos
  rsvp: boolean;         // Confirmar asistencia
  music: boolean;        // Sugerir música para la fiesta
  hashtag: boolean;      // Hashtag del casamiento
}

// RSVP simple: 1 persona = 1 respuesta. Sin acompañantes, sin cantidad de invitados,
// sin links únicos ni matching contra ninguna lista — cada envío del formulario
// público es un registro independiente.
export type RsvpAttendance = 'attending' | 'declined';

export interface RsvpEntry {
  id: string;
  firstName: string;
  lastName: string;
  attendanceStatus: RsvpAttendance;
  dietaryRestrictions?: string;
  message?: string;
  createdAt: string;
}

// Lista propia del organizador, cargada a mano o importada — es solo para
// organización interna y NUNCA se cruza automáticamente con RsvpEntry.
export type ManualGuestStatus = 'pendiente' | 'confirmado' | 'no-asiste';

export interface ManualGuest {
  id: string;
  firstName: string;
  lastName: string;
  status: ManualGuestStatus;
  // Opcional: si se carga, "Recordar por WhatsApp" le escribe directo a este número. Sin
  // teléfono, igual abre WhatsApp con el mensaje ya armado para elegir el contacto a mano.
  phone?: string;
}

export interface WeddingTable {
  id: string;
  name: string;
  capacity: number;
  notes?: string;
}

export interface GiftItem {
  id: string;
  title: string;
  description: string;
  targetPrice: number;
  currentAmount?: number;
  category: 'luna-de-miel' | 'hogar' | 'experiencia' | 'viajes' | 'ahorros' | 'dinero' | string;
  imageUrl: string;
  isCustom?: boolean;
}

export interface ReceivedGift {
  id: string;
  giftId?: string;
  giftTitle: string;
  giverName: string;
  giverEmail?: string;
  giverPhone?: string;
  amount: number;
  date: string;
  method: 'transferencia' | 'mercadopago';
  status: 'confirmado' | 'pendiente';
  receiptUrl?: string;
  receiptFileName?: string;
  dedicationMessage?: string;
  thankYouMessage?: string;
  isThanked?: boolean;
}

export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  description: string;
  iconType: 'church' | 'civil' | 'party' | 'ring';
}
