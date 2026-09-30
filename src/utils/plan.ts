import { DashboardTab, WeddingData, WeddingPlan } from '../types';

export interface PlanDetails {
  id: WeddingPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

// Fuente única de los 3 planes: mismos datos que en la landing (Pricing en
// LandingSections.tsx), reusados en el onboarding, en Cuenta > Tu plan y en el
// modal de publicar. Cada uno incluye todo lo del anterior.
export const PLAN_DETAILS: PlanDetails[] = [
  {
    id: 'regalos',
    name: 'Lista de Regalos',
    price: 'AR$ 99.000',
    description: 'Para parejas que solo quieren recibir regalos de forma simple.',
    features: ['Lista de regalos personalizada', 'Regalos ilimitados', 'Fondos de regalo', 'URL personalizada'],
  },
  {
    id: 'invitados-rsvp',
    name: 'Invitados y RSVP',
    price: 'AR$ 129.000',
    description: 'Sumale confirmaciones online y gestión de invitados a tu lista.',
    features: ['Todo lo de Lista de Regalos', 'RSVP online', 'Gestión de invitados', 'Exportación a Excel'],
  },
  {
    id: 'completo',
    name: 'Evento Completo',
    price: 'AR$ 159.000',
    badge: 'Más elegido',
    description: 'Todo lo necesario para organizar y compartir tu casamiento.',
    features: ['Todo lo de Invitados y RSVP', 'Micrositio completo', 'Galería de fotos', 'Ubicación y cronograma'],
  },
];

export const getPlanDetails = (plan?: WeddingPlan): PlanDetails =>
  PLAN_DETAILS.find((p) => p.id === plan) ?? PLAN_DETAILS[0];

export const PLAN_LABELS: Record<string, string> = Object.fromEntries(PLAN_DETAILS.map((p) => [p.id, p.name]));
export const PLAN_PRICES: Record<string, string> = Object.fromEntries(PLAN_DETAILS.map((p) => [p.id, p.price]));

// Igual que en el pricing de la landing: RSVP se desbloquea desde el plan Invitados
// y RSVP en adelante; Micrositio ("sitio") es exclusivo de Evento Completo.
export const isTabLocked = (tab: DashboardTab, wedding: WeddingData): boolean => {
  const plan = wedding.plan ?? 'regalos';
  if (tab === 'sitio') return plan !== 'completo';
  if (tab === 'rsvp') return plan === 'regalos';
  return false;
};
