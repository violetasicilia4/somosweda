// Contenido de demostración (Milagros & Juan) que usa la landing para mostrar cómo se ve
// el producto. Son las mismas piezas de la página de ejemplo.
export const showcaseCouple = {
  name: 'Milagros & Juan',
  date: '24 · 10 · 2026',
  slug: 'milagros-y-juan',
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const showcaseGifts = [
  { category: 'Estadías', title: 'Hotel en Mallorca', price: 990000, image: img('photo-1790276319705-915c2b5585c9') },
  { category: 'Traslados', title: 'Pasaje para dos', price: 1900000, image: img('photo-1566622246517-0e59fdb36f0e') },
  { category: 'Experiencias', title: 'City tour en Venecia', price: 850000, image: img('photo-1653657453518-e56590bd357a') },
];
