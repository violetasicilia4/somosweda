const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const toDate = (value: string | Date): Date | null => {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

// "24 de octubre de 2026" — formato de fecha único en toda la interfaz
export const formatLongDate = (value: string | Date): string => {
  const d = toDate(value);
  if (!d) return typeof value === 'string' ? value : '';
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
};

// "24/10/2026" — solo para tablas
export const formatShortDate = (value: string | Date): string => {
  const d = toDate(value);
  if (!d) return typeof value === 'string' ? value : '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

export const addMonths = (from: Date, months: number): Date => {
  const d = new Date(from.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
};

// "ARS 450.000" — formato de moneda único en toda la interfaz
export const formatARS = (amount: number): string => `ARS ${amount.toLocaleString('es-AR')}`;
