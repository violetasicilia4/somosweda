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

export type DashboardTab =
  | 'inicio'
  | 'regalos'
  | 'recibidos'
  | 'rsvp'
  | 'sitio'
  | 'ayuda'
  | 'cuenta';

// Subsecciones de las pantallas con pestañas internas
export type CuentaSection = 'datos' | 'plan' | 'cobro';

export interface WeddingData {
  plan?: WeddingPlan;
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
