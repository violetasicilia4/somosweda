export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-pin'
  | 'reset-password'
  | 'create-wedding'
  | 'dashboard';

export type DashboardTab =
  | 'regalos'
  | 'micrositio'
  | 'recibidos'
  | 'invitados'
  | 'cobros'
  | 'plan'
  | 'cuenta'
  | 'ayuda';

export interface WeddingData {
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
  selectedPlan?: 'essential' | 'premium' | 'signature';
  designTheme?: 'editorial' | 'romantico' | 'minimal' | 'clasico';
  colorPalette?: 'lino' | 'champagne' | 'bosque' | 'salvia';
  typography?: 'serif' | 'sans' | 'editorial';
}

export interface Guest {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  companionsCount: number;
  status: 'confirmado' | 'pendiente' | 'rechazado';
  dietaryRequirement?: string;
  tableAssigned?: string;
  invitationSent: boolean;
  reminderSent?: boolean;
  openedInvitation?: boolean;
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

export interface PricingPlan {
  id: 'essential' | 'premium' | 'signature';
  name: string;
  badge?: string;
  tagline: string;
  headline?: string;
  description?: string;
  decisionCriteria?: string;
  previewImage?: string;
  previewAlt?: string;
  signatureExperiences?: string[];
  experienceType: string;
  price: string;
  features: string[];
  micrositeFeatures: string[];
  extraHighlights?: string[];
  recommended?: boolean;
}
