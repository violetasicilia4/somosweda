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
// LandingSections.tsx), reusados en el onboarding, en Cuenta > Explorar planes, en el
// modal de publicar y en las pantallas de "probar" una sección bloqueada. Cada uno
// incluye todo lo del anterior. El orden del array ES el orden de "nivel" (de menor a
// mayor) — lo usan planRank/isPlanAtLeast más abajo.
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
    name: 'Evento',
    price: 'AR$ 129.000',
    description: 'Sumale invitados, confirmaciones online y un micrositio para compartir.',
    features: ['Todo lo de Lista de Regalos', 'RSVP online', 'Gestión de invitados', 'Micrositio Base'],
  },
  {
    id: 'completo',
    name: 'Evento Plus',
    price: 'AR$ 159.000',
    badge: 'Más elegido',
    description: 'La versión completa para organizar y compartir tu casamiento.',
    features: ['Todo lo de Evento', 'Micrositio Premium', 'Galería de fotos', 'Guía para invitados y música'],
  },
];

// Orden de nivel: regalos(0) < invitados-rsvp/Evento(1) < completo/Evento Plus(2).
const PLAN_ORDER: WeddingPlan[] = PLAN_DETAILS.map((p) => p.id);

export const getPlanDetails = (plan?: WeddingPlan): PlanDetails =>
  PLAN_DETAILS.find((p) => p.id === plan) ?? PLAN_DETAILS[0];

export const PLAN_LABELS: Record<string, string> = Object.fromEntries(PLAN_DETAILS.map((p) => [p.id, p.name]));
export const PLAN_PRICES: Record<string, string> = Object.fromEntries(PLAN_DETAILS.map((p) => [p.id, p.price]));

export const planRank = (plan?: WeddingPlan): number => {
  const idx = PLAN_ORDER.indexOf(plan ?? 'regalos');
  return idx === -1 ? 0 : idx;
};

export const isPlanAtLeast = (plan: WeddingPlan | undefined, required: WeddingPlan): boolean =>
  planRank(plan) >= planRank(required);

// El plan "más alto" que la pareja probó alguna vez — nunca es menor al plan actual.
// Se usa para saber si una sección bloqueada es "nueva" (nunca la probaron: pantalla de
// venta) o "ya configurada" (la probaron y bajaron de plan: pantalla de "restaurar").
export const getHighestPlan = (wedding: WeddingData): WeddingPlan => {
  const current = wedding.plan ?? 'regalos';
  const highest = wedding.highestPlan ?? current;
  return planRank(highest) >= planRank(current) ? highest : current;
};

// Wrapper que hay que usar en TODO lugar donde se cambia wedding.plan (onboarding,
// Explorar planes, pantallas de "Probar X"): nunca borra progreso — si el usuario baja
// de plan, highestPlan se queda arriba para que sus secciones/configuraciones sigan
// mostrándose como "guardadas" en vez de perderse.
export const withPlanChange = (wedding: WeddingData, plan: WeddingPlan): Pick<WeddingData, 'plan' | 'highestPlan'> => {
  const prevHighest = getHighestPlan(wedding);
  return {
    plan,
    highestPlan: planRank(plan) > planRank(prevHighest) ? plan : prevHighest,
  };
};

// Plan mínimo requerido por cada pestaña del dashboard. "sitio" (Micrositio) ya se
// desbloquea desde Evento (en su versión Base); Evento Plus solo agrega el nivel
// Premium adentro de esa misma pestaña (ver MICROSITE_PREMIUM_REQUIRED_PLAN).
const TAB_REQUIRED_PLAN: Partial<Record<DashboardTab, WeddingPlan>> = {
  rsvp: 'invitados-rsvp',
  sitio: 'invitados-rsvp',
};

export const getRequiredPlanForTab = (tab: DashboardTab): WeddingPlan | null => TAB_REQUIRED_PLAN[tab] ?? null;

// Usado solo para el candadito informativo del sidebar — nunca bloquea la navegación.
// Todas las pestañas son siempre visibles y siempre se puede entrar a todas: adentro de
// cada una se decide si se muestra el contenido real o la pantalla de "Probar/Restaurar".
export const isTabLocked = (tab: DashboardTab, wedding: WeddingData): boolean => {
  const required = getRequiredPlanForTab(tab);
  if (!required) return false;
  return !isPlanAtLeast(wedding.plan, required);
};

// Nivel de Micrositio: Base (Evento) vs Premium (Evento Plus) — galería, guía para
// invitados (dress code/hospedaje/mapa/transporte) y música son exclusivas de Premium.
export const MICROSITE_PREMIUM_REQUIRED_PLAN: WeddingPlan = 'completo';

export const isMicrositePremiumUnlocked = (wedding: WeddingData): boolean =>
  isPlanAtLeast(wedding.plan, MICROSITE_PREMIUM_REQUIRED_PLAN);
