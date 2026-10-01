import { MicrositeFeatures, WeddingData } from '../types';

// Mismos defaults que el builder mostraba antes de persistir nada: todo tildado menos
// música. Es lo que ve una pareja que todavía no tocó nada en "Tu sitio".
export const DEFAULT_MICROSITE_FEATURES: MicrositeFeatures = {
  countdown: true,
  story: true,
  events: true,
  guestInfo: true,
  gallery: true,
  giftRegistry: true,
  rsvp: true,
  music: false,
};

export const getMicrositeFeatures = (wedding: WeddingData): MicrositeFeatures => ({
  ...DEFAULT_MICROSITE_FEATURES,
  ...wedding.micrositeFeatures,
});

// Contenido por defecto de cada sección — el mismo texto de ejemplo que ya mostraba el
// builder antes de persistir nada. Se usa tanto en el editor (Tu sitio) como en el sitio
// de ejemplo (ExampleView), para que los dos muestren siempre lo mismo.
export const DEFAULT_STORY_TEXT =
  'Nos conocimos hace 6 años y desde entonces supimos que queríamos caminar juntos para siempre. Nos llena de emoción celebrar este gran paso junto a las personas que más queremos en el mundo.';

export const DEFAULT_LODGING_INFO = 'Hoteles recomendados: Sheraton Pilar, Ibis Pilar y posadas boutique de la zona.';

export const DEFAULT_TRANSPORT_INFO = 'Combis de traslado ida y vuelta desde CABA (Plaza Italia) y estacionamiento con seguridad.';

export const DEFAULT_GALLERY_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
];

// Orden fijo en el que aparecen las secciones en el sitio de ejemplo (Información):
// el mismo orden en el que se listan los módulos en "Tu sitio", para que tildar/destildar
// se sienta predecible. countdown y rsvp no son secciones propias (countdown vive en el
// hero, rsvp ya tiene su propia pantalla vía los botones de navegación).
export const MICROSITE_SECTION_ORDER: (keyof MicrositeFeatures)[] = [
  'giftRegistry',
  'story',
  'events',
  'gallery',
  'guestInfo',
  'music',
];
