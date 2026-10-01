import { WeddingData, WeddingEvent } from '../types';

// "Ver tu lista" abre el sitio de ejemplo en una pestaña nueva (window.open), que carga
// la app desde cero con su propio estado de React — no comparte memoria con la pestaña
// del dashboard. Mismo problema que resolvimos para el RSVP (ver rsvpStore.ts): acá
// usamos localStorage como puente para que el sitio de ejemplo muestre los datos reales
// de la boda (historia, eventos, galería, qué módulos están tildados, etc.), no defaults
// fijos desconectados de lo que la pareja configuró en "Tu sitio".
const WEDDING_KEY = 'weda_wedding_data';
const EVENTS_KEY = 'weda_wedding_events';

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const persistWedding = (wedding: WeddingData): void => {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(WEDDING_KEY, JSON.stringify(wedding));
  } catch (err) {
    console.warn('No se pudo guardar la boda en localStorage:', err);
  }
};

export const getStoredWedding = (): WeddingData | null => {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(WEDDING_KEY);
    return raw ? (JSON.parse(raw) as WeddingData) : null;
  } catch {
    return null;
  }
};

export const persistWeddingEvents = (events: WeddingEvent[]): void => {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('No se pudieron guardar los eventos en localStorage:', err);
  }
};

export const getStoredWeddingEvents = (): WeddingEvent[] | null => {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as WeddingEvent[]) : null;
  } catch {
    return null;
  }
};
