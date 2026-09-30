import { RsvpEntry } from '../types';

// Puente simple entre el formulario público de RSVP (que se abre en otra pestaña,
// vía "Ver tu lista" / "Ver ejemplo") y el panel del organizador: como esta app no
// tiene backend, usamos localStorage como si fuera la tabla RSVP compartida. Es lo
// mismo que pide la spec (id, first_name, last_name, attendance_status,
// dietary_restrictions, message, created_at), solo que persistido en el navegador.

const STORAGE_KEY = 'weda_rsvp_entries';
const SYNC_EVENT = 'weda:rsvp-updated';

// Un par de respuestas de ejemplo para que el panel no arranque vacío en la demo.
const seedEntries: RsvpEntry[] = [
  {
    id: 'rsvp_seed_1',
    firstName: 'Camila',
    lastName: 'Rodríguez',
    attendanceStatus: 'attending',
    dietaryRestrictions: 'Vegetariana',
    message: '¡No nos lo perdemos por nada!',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'rsvp_seed_2',
    firstName: 'Lucas',
    lastName: 'Benítez',
    attendanceStatus: 'attending',
    dietaryRestrictions: 'Celíaco',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'rsvp_seed_3',
    firstName: 'Florencia',
    lastName: 'Paz',
    attendanceStatus: 'declined',
    message: 'Ese fin de semana estamos de viaje, ¡las mil felicidades igual!',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const getRsvpEntries = (): RsvpEntry[] => {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEntries));
      return seedEntries;
    }
    return JSON.parse(raw) as RsvpEntry[];
  } catch {
    return [];
  }
};

const persist = (entries: RsvpEntry[]) => {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // El evento "storage" nativo no dispara en la misma pestaña que escribió, así que
    // avisamos también con un CustomEvent para que el panel se actualice al toque.
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    // localStorage lleno o bloqueado (modo privado): no rompemos el flujo por esto.
  }
};

export const addRsvpEntry = (entry: Omit<RsvpEntry, 'id' | 'createdAt'>): RsvpEntry => {
  const full: RsvpEntry = {
    ...entry,
    id: `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  persist([full, ...getRsvpEntries()]);
  return full;
};

// Se llama desde el panel para refrescarse cuando cambian las respuestas, ya sea
// desde otra pestaña (evento "storage") o en la misma (nuestro CustomEvent).
export const subscribeToRsvpEntries = (onChange: () => void): (() => void) => {
  if (!hasStorage()) return () => {};
  const handler = () => onChange();
  window.addEventListener('storage', handler);
  window.addEventListener(SYNC_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(SYNC_EVENT, handler);
  };
};
