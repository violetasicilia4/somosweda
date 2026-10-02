import React, { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { ExampleHero } from './ExampleHero';
import { GiftPaymentModal } from './GiftPaymentModal';

// Pantalla "Regalos" del ejemplo. Copia del diseño de referencia (frame de 710px de
// ancho): todas las medidas están en "u", 1u = 1px a 710px de ancho del frame, que a
// 1440px de viewport equivale a 2.028px. Se achica proporcionalmente por debajo y no
// crece por encima de 1440px. Con piso (clamp) para que a tablet/desktop chico no se
// achique de más.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

interface ExampleGift {
  id: string;
  category: string;
  title: string;
  price: number;
  image: string;
  filter?: 'Luna de miel' | 'Experiencias' | 'Traslados' | 'Estadías';
}

const gifts: ExampleGift[] = [
  { id: 'g1', category: 'Estadías', filter: 'Estadías', title: 'Alojamiento en Sicilia', price: 430000, image: img('photo-1775744244614-beb197cfac53') },
  { id: 'g2', category: 'Traslados', filter: 'Traslados', title: 'Pasaje para dos', price: 1900000, image: img('photo-1566622246517-0e59fdb36f0e') },
  { id: 'g3', category: 'Experiencias', filter: 'Experiencias', title: 'City tour en Venecia', price: 850000, image: img('photo-1653657453518-e56590bd357a') },
  { id: 'g4', category: 'Hogar', title: 'Bowl de madera', price: 95000, image: img('photo-1712330436003-8ccff835a9b7') },
  { id: 'g5', category: 'Estadías', filter: 'Estadías', title: 'Hotel en Mallorca', price: 990000, image: img('photo-1790276319705-915c2b5585c9') },
  { id: 'g6', category: 'Luna de miel', filter: 'Luna de miel', title: 'Estadía en Cerdeña', price: 790000, image: img('photo-1788805298893-64f54c5ac06d') },
  { id: 'g7', category: 'Hogar', title: 'Mesa rectangular', price: 780000, image: img('photo-1654215325320-3f0527481ace') },
  { id: 'g8', category: 'Hogar', title: 'Mantequera cerámica', price: 85000, image: img('photo-1719148162837-63d2f256231f') },
  { id: 'g9', category: 'Hogar', title: 'Batidora KitchenAid', price: 850000, image: img('photo-1547091267-6b2be403a763') },
  { id: 'g10', category: 'Traslados', filter: 'Traslados', title: 'Traslado privado', price: 180000, image: img('photo-1543797414-a0c3ad076f7c') },
  { id: 'g11', category: 'Hogar', title: 'Velas de mesa', price: 45000, image: img('photo-1476900164809-ff19b8ae5968') },
  { id: 'g12', category: 'Hogar', title: 'Sillón de cuero', price: 980000, image: img('photo-1579656381229-15bdb188da49') },
  { id: 'g13', category: 'Hogar', title: 'Aspiradora minimalista', price: 290000, image: img('photo-1722710070534-e31f0290d8de') },
  { id: 'g14', category: 'Hogar', title: 'Copas de vino', price: 160000, image: img('photo-1558670426-931963635470') },
  { id: 'g15', category: 'Hogar', title: 'Mesa de comedor', price: 1200000, image: img('photo-1745794621090-d856c53b0cc2') },
  { id: 'g16', category: 'Hogar', title: 'Juego de toallas rayadas', price: 165000, image: img('photo-1625931046289-e51edea3e176') },
];

const filters = ['Luna de miel', 'Experiencias', 'Traslados', 'Estadías'] as const;

const priceRanges = [
  { id: 'all', label: 'Rango de precio', min: 0, max: Infinity },
  { id: 'r1', label: 'Hasta ARS 100.000', min: 0, max: 100000 },
  { id: 'r2', label: 'ARS 100.000 – 500.000', min: 100000, max: 500000 },
  { id: 'r3', label: 'Más de ARS 500.000', min: 500000, max: Infinity },
];

const formatPrice = (n: number) => `ARS ${n.toLocaleString('es-AR')}`;

interface ExampleGiftsProps {
  onNavigate: (screen: 'home' | 'gifts' | 'rsvp') => void;
}

export const ExampleGifts: React.FC<ExampleGiftsProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [rangeId, setRangeId] = useState('all');
  const [paymentGift, setPaymentGift] = useState<ExampleGift | null>(null);

  const visible = useMemo(() => {
    const range = priceRanges.find((r) => r.id === rangeId) ?? priceRanges[0];
    const q = query.trim().toLowerCase();
    return gifts.filter(
      (g) =>
        (activeFilter === 'all' || g.filter === activeFilter) &&
        (!q || g.title.toLowerCase().includes(q)) &&
        g.price >= range.min &&
        g.price <= range.max
    );
  }, [activeFilter, query, rangeId]);

  const pill = (active: boolean): React.CSSProperties => ({
    height: u(16),
    padding: `0 ${u(9)}`,
    borderRadius: 999,
    fontFamily: SANS,
    fontSize: u(5.4),
    backgroundColor: active ? '#16283D' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#3C5068',
    border: active ? '1px solid #16283D' : '1px solid #E2E9F0',
  });

  const pillMobile = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full px-3 h-8 text-[12px] border cursor-pointer ${
      active ? 'bg-[#16283D] text-white border-[#16283D]' : 'bg-white text-[#3C5068] border-[#E2E9F0]'
    }`;

  return (
    <div className="min-h-screen bg-white" style={{ ['--u' as string]: 'clamp(1.6px, 0.14085vw, 2.028px)' }}>
      <ExampleHero active="gifts" onNavigate={onNavigate} />

      {/* Todo lo de acá para abajo en un solo bloque con fondo sólido: al scrollear
          normal, tapa completamente al hero de arriba en vez de dejarlo entreverse por
          abajo. Sin "sticky": esta sección es mucho más alta que la pantalla (toda la
          grilla de regalos) y nada la sigue, así que "sticky" acá dejaría la pantalla
          congelada un buen tramo de scroll sin que se vea nada moverse. */}
      <section className="relative z-10 bg-white">

      {/* Título grande apenas se entra acá (en vez de un simple eyebrow chiquito): así
          queda clarísimo que tocar "Regalá" en el header te trajo a una pantalla distinta
          de la invitación, no es solo un cambio de pestaña que puede pasar desapercibido. */}
      <div className="flex flex-col items-center text-center" style={{ paddingTop: u(20), paddingLeft: u(24), paddingRight: u(24) }}>
        <span className="uppercase text-[#8A8A8A]" style={{ fontFamily: SANS, fontSize: `max(${u(3.3)}, 11px)`, letterSpacing: '0.12em', lineHeight: 1 }}>
          Regalá
        </span>
        <h2
          className="font-normal text-[#2B2B2B]"
          style={{ fontFamily: SERIF, fontSize: `max(${u(14)}, 30px)`, lineHeight: 1.1, marginTop: u(8) }}
        >
          Lista de regalos
        </h2>
        <p style={{ fontFamily: SANS, fontSize: `max(${u(4.6)}, 13.5px)`, lineHeight: 1.5, color: '#6B6B6B', marginTop: u(6), whiteSpace: 'nowrap' }}>
          Elegí algo para ayudarnos a armar esta nueva etapa juntos.
        </p>
        <ChevronDown className="text-[#8A8A8A]" style={{ width: `max(${u(7)}, 14px)`, height: `max(${u(7)}, 14px)`, marginTop: u(12) }} strokeWidth={1.5} />
      </div>

      {/* "Más pedidos": con 16 productos en una sola columna en mobile, sin destacar nada,
          es fácil irse sin regalar antes de llegar al final. Esta tira horizontal muestra
          2-3 opciones arriba de todo, antes de los filtros. */}
      <div className="sm:hidden px-4 pt-6 pb-2">
        <p className="uppercase text-[#8A8A8A] text-[11px] tracking-[0.08em]" style={{ fontFamily: SANS }}>
          Los más pedidos
        </p>
        <div
          className="flex items-stretch gap-3 overflow-x-auto pt-3 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gifts.slice(0, 3).map((g) => (
            <button
              key={g.id}
              onClick={() => setPaymentGift(g)}
              className="shrink-0 text-left cursor-pointer"
              style={{ width: 150 }}
            >
              <img
                src={g.image}
                alt={g.title}
                referrerPolicy="no-referrer"
                className="w-full object-cover rounded-xl"
                style={{ aspectRatio: '4 / 3' }}
              />
              <p className="font-normal text-[#2B2B2B] text-[14px] leading-tight mt-2" style={{ fontFamily: SERIF }}>
                {g.title}
              </p>
              <p className="font-bold text-[#2B2B2B] text-[12.5px] mt-0.5" style={{ fontFamily: SANS }}>
                {formatPrice(g.price)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros — mobile: pills en fila con scroll horizontal, buscador y rango apilados debajo */}
      <div className="sticky top-0 z-20 sm:hidden bg-[#FBF9F5] px-4 pt-4 pb-4 flex flex-col gap-3">
        <div
          className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button onClick={() => setActiveFilter('all')} className={pillMobile(activeFilter === 'all')} style={{ fontFamily: SANS }}>
            Ver todos <span className="opacity-60">({gifts.length})</span>
          </button>
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={pillMobile(activeFilter === f)} style={{ fontFamily: SANS }}>
              {f} <span className="opacity-60">({gifts.filter((g) => g.filter === f).length})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center bg-white border border-[#E2E9F0] rounded-full h-10 px-3 gap-2 min-w-0">
            <Search className="text-[#7389A0] w-4 h-4 shrink-0" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar regalo..."
              className="bg-transparent outline-none w-full min-w-0 text-[13px] text-[#3C5068] placeholder:text-[#7389A0]"
              style={{ fontFamily: SANS }}
            />
          </label>
          <div className="relative flex items-center bg-white border border-[#E2E9F0] rounded-full h-10 shrink-0">
            <select
              value={rangeId}
              onChange={(e) => setRangeId(e.target.value)}
              className="appearance-none bg-transparent outline-none h-full cursor-pointer text-[13px] text-[#3C5068] pl-3 pr-7 rounded-full"
              style={{ fontFamily: SANS }}
            >
              {priceRanges.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 w-4 h-4 pointer-events-none text-[#3C5068]" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Filtros — tablet/desktop (como antes) */}
      <div className="sticky top-0 z-20 hidden sm:block bg-[#FBF9F5]" style={{ height: u(37), paddingTop: u(11) }}>
        <div className="flex items-center justify-between mx-auto" style={{ width: u(545) }}>
          <div className="flex items-center" style={{ gap: u(3.6) }}>
            <button onClick={() => setActiveFilter('all')} className="cursor-pointer" style={pill(activeFilter === 'all')}>
              Ver todos <span className="opacity-60">({gifts.length})</span>
            </button>
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className="cursor-pointer" style={pill(activeFilter === f)}>
                {f} <span className="opacity-60">({gifts.filter((g) => g.filter === f).length})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center" style={{ gap: u(8) }}>
            <label
              className="flex items-center bg-white border border-[#E2E9F0]"
              style={{ height: u(16), width: u(109), padding: `0 ${u(8)}`, borderRadius: 999, gap: u(4) }}
            >
              <Search className="text-[#7389A0]" style={{ width: u(6), height: u(6) }} strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar regalo..."
                className="bg-transparent outline-none w-full text-[#3C5068] placeholder:text-[#7389A0]"
                style={{ fontFamily: SANS, fontSize: u(5) }}
              />
            </label>
            <div
              className="relative flex items-center bg-white border border-[#E2E9F0]"
              style={{ height: u(16), width: u(67), borderRadius: 999 }}
            >
              <select
                value={rangeId}
                onChange={(e) => setRangeId(e.target.value)}
                className="appearance-none bg-transparent outline-none w-full h-full cursor-pointer text-[#3C5068]"
                style={{ fontFamily: SANS, fontSize: u(5), padding: `0 ${u(14)} 0 ${u(8)}`, borderRadius: 999 }}
              >
                {priceRanges.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute pointer-events-none text-[#3C5068]" style={{ width: u(6), height: u(6), right: u(7) }} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de regalos — mobile: una tarjeta por fila, tamaños fijos en px para que se lean bien */}
      <div className="sm:hidden flex flex-col gap-8 px-4 pt-5 pb-12">
        {visible.map((g) => (
          <article key={g.id} className="w-full flex flex-col items-center text-center">
            <img
              src={g.image}
              alt={g.title}
              referrerPolicy="no-referrer"
              className="w-full object-cover rounded-xl"
              style={{ aspectRatio: '4 / 3' }}
            />
            <div className="pt-3">
              <p className="uppercase text-[#8A8A8A] text-[11px] tracking-[0.08em]" style={{ fontFamily: SANS }}>
                {g.category}
              </p>
              <h3 className="font-normal text-[#2B2B2B] text-[21px] leading-tight mt-1" style={{ fontFamily: SERIF }}>
                {g.title}
              </h3>
              <p className="font-bold text-[#2B2B2B] text-[15px] mt-1" style={{ fontFamily: SANS }}>
                {formatPrice(g.price)}
              </p>
            </div>
            <button
              onClick={() => setPaymentGift(g)}
              className="uppercase text-white w-full cursor-pointer whitespace-nowrap h-10 rounded text-[12px] mt-3"
              style={{ backgroundColor: '#16283D', fontFamily: SANS, letterSpacing: '0.03em' }}
            >
              Regalá
            </button>
          </article>
        ))}
      </div>

      {/* Grilla de regalos — tablet/desktop (como antes) */}
      <div className="hidden sm:grid sm:grid-cols-4 mx-auto" style={{ width: u(576), columnGap: u(21.33), rowGap: u(40), paddingTop: u(17), paddingBottom: u(69) }}>
        {visible.map((g) => (
          <article key={g.id} className="flex flex-col items-center text-center">
            <img
              src={g.image}
              alt={g.title}
              referrerPolicy="no-referrer"
              className="object-cover rounded-full"
              style={{ width: u(120), height: u(120) }}
            />
            <div style={{ padding: `0 ${u(8)}`, marginTop: u(12) }}>
              <p className="uppercase text-[#8A8A8A]" style={{ fontFamily: SANS, fontSize: u(3.6), letterSpacing: '0.08em', lineHeight: 1 }}>
                {g.category}
              </p>
              <h3 className="font-normal text-[#2B2B2B]" style={{ fontFamily: SERIF, fontSize: u(7), lineHeight: 1.1, marginTop: u(4) }}>
                {g.title}
              </h3>
              <p className="font-bold text-[#2B2B2B]" style={{ fontFamily: SANS, fontSize: u(6.05), lineHeight: 1, marginTop: u(4) }}>
                {formatPrice(g.price)}
              </p>
            </div>
            <button
              onClick={() => setPaymentGift(g)}
              className="uppercase text-white w-full cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: '#16283D', height: u(12), borderRadius: u(1.5), fontFamily: SANS, fontSize: u(4.2), letterSpacing: '0.03em', marginTop: u(12) }}
            >
              Regalá
            </button>
          </article>
        ))}
      </div>

      </section>

      {paymentGift && (
        <GiftPaymentModal
          giftTitle={paymentGift.title}
          unitPrice={paymentGift.price}
          quantity={1}
          onClose={() => setPaymentGift(null)}
        />
      )}
    </div>
  );
};
