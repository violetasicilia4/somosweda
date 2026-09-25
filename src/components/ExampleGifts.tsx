import React, { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// Pantalla "Regalos" del ejemplo. Copia del diseño de referencia (frame de 710px de
// ancho): todas las medidas están en "u", 1u = 1px a 710px de ancho del frame, que a
// 1440px de viewport equivale a 2.028px. Se achica proporcionalmente por debajo y no
// crece por encima de 1440px.
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

const heroButton =
  'uppercase border transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center';

interface ExampleGiftsProps {
  onNavigate: (screen: 'home' | 'gifts' | 'rsvp') => void;
}

export const ExampleGifts: React.FC<ExampleGiftsProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [rangeId, setRangeId] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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

  const setQty = (id: string, delta: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));

  const pill = (active: boolean): React.CSSProperties => ({
    height: u(16),
    padding: `0 ${u(9)}`,
    borderRadius: 999,
    fontFamily: SANS,
    fontSize: u(5.4),
    backgroundColor: active ? '#2A1A0D' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#5A4A40',
    border: active ? '1px solid #2A1A0D' : '1px solid #EFEAE2',
  });

  return (
    <div className="min-h-screen bg-white" style={{ ['--u' as string]: 'min(2.028px, 0.14085vw)' }}>
      {/* Barra superior */}
      <header
        className="flex items-center justify-between bg-[#FBF9F5]"
        style={{ height: u(32), padding: `0 ${u(37)}` }}
      >
        <div className="flex items-center" style={{ gap: u(6) }}>
          <span className="font-semibold text-[#2A1A0D]" style={{ fontFamily: SANS, fontSize: u(8.2), lineHeight: 1 }}>
            WEDA
          </span>
          <span
            className="uppercase text-[#5A4A40] border border-[#D8D2C8]"
            style={{ fontFamily: SANS, fontSize: u(3.6), letterSpacing: '0.06em', padding: `${u(1.6)} ${u(3.5)}`, borderRadius: u(1.5), lineHeight: 1 }}
          >
            Lista de regalos
          </span>
        </div>
        <div className="flex items-center text-[#2A1A0D]" style={{ gap: u(6) }}>
          <span className="italic" style={{ fontFamily: SERIF, fontSize: u(9.3), lineHeight: 1 }}>
            Milagros &amp; Juan
          </span>
          <span className="text-[#8A7A6E]" style={{ fontSize: u(6), lineHeight: 1 }}>·</span>
          <span className="text-[#5A4A40]" style={{ fontFamily: SANS, fontSize: u(5.3), letterSpacing: '0.04em', lineHeight: 1 }}>
            24 · 10 · 2026
          </span>
        </div>
      </header>

      {/* Hero: misma foto, oscurecida 30% */}
      <section className="relative w-full overflow-hidden" style={{ height: u(346) }}>
        <img
          src="/ejemplo-hero.webp"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-x-0 z-10 flex flex-col items-center text-center text-white" style={{ top: u(173) }}>
          <h1 className="font-normal" style={{ fontFamily: SERIF, fontSize: u(42.8), lineHeight: 1 }}>
            Milagros &amp; Juan
          </h1>
          <p className="text-white/90" style={{ fontFamily: SANS, fontSize: u(7.5), letterSpacing: '0.05em', lineHeight: 1, marginTop: u(10) }}>
            24 · 10 · 2026
          </p>
          <div className="bg-white/50" style={{ width: u(25), height: 1, marginTop: u(11) }}></div>

          <div className="flex items-center" style={{ gap: u(7), marginTop: u(19) }}>
            <button
              id="gifts-info-btn"
              onClick={() => onNavigate('home')}
              className={`${heroButton} text-white border-white/70 hover:bg-white/10`}
              style={{ fontFamily: SANS, fontSize: u(5.6), height: u(18), padding: `0 ${u(12.5)}`, letterSpacing: '0.04em' }}
            >
              Información
            </button>
            <button
              id="gifts-confirm-btn"
              onClick={() => onNavigate('rsvp')}
              className={`${heroButton} text-white border-white/70 hover:bg-white/10`}
              style={{ fontFamily: SANS, fontSize: u(5.6), height: u(18), padding: `0 ${u(12.5)}`, letterSpacing: '0.04em' }}
            >
              Confirmar asistencia
            </button>
            <button
              id="gifts-gifts-btn"
              className={`${heroButton} bg-white text-[#2A1A0D] border-white`}
              style={{ fontFamily: SANS, fontSize: u(5.6), height: u(18), padding: `0 ${u(12.5)}`, letterSpacing: '0.04em' }}
            >
              Regalos
            </button>
          </div>

          <span className="uppercase text-white/80" style={{ fontFamily: SANS, fontSize: u(3.8), letterSpacing: '0.12em', lineHeight: 1, marginTop: u(14) }}>
            Explorar regalos
          </span>
          <ChevronDown className="text-white/80" style={{ width: u(7), height: u(7), marginTop: u(4) }} strokeWidth={1.5} />
        </div>
      </section>

      {/* Filtros */}
      <div className="bg-[#FBF9F5]" style={{ height: u(37), paddingTop: u(11) }}>
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
              className="flex items-center bg-white border border-[#EFEAE2]"
              style={{ height: u(16), width: u(109), padding: `0 ${u(8)}`, borderRadius: 999, gap: u(4) }}
            >
              <Search className="text-[#8A6A55]" style={{ width: u(6), height: u(6) }} strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar regalo..."
                className="bg-transparent outline-none w-full text-[#5A4A40] placeholder:text-[#8A7A6E]"
                style={{ fontFamily: SANS, fontSize: u(5) }}
              />
            </label>
            <div
              className="relative flex items-center bg-white border border-[#EFEAE2]"
              style={{ height: u(16), width: u(67), borderRadius: 999 }}
            >
              <select
                value={rangeId}
                onChange={(e) => setRangeId(e.target.value)}
                className="appearance-none bg-transparent outline-none w-full h-full cursor-pointer text-[#5A4A40]"
                style={{ fontFamily: SANS, fontSize: u(5), padding: `0 ${u(14)} 0 ${u(8)}`, borderRadius: 999 }}
              >
                {priceRanges.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute pointer-events-none text-[#5A4A40]" style={{ width: u(6), height: u(6), right: u(7) }} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de regalos */}
      <div className="mx-auto grid grid-cols-4" style={{ width: u(576), columnGap: u(21.33), rowGap: u(32), paddingTop: u(17), paddingBottom: u(69) }}>
        {visible.map((g) => (
          <article key={g.id} className="relative" style={{ height: u(198) }}>
            <img src={g.image} alt={g.title} referrerPolicy="no-referrer" className="w-full object-cover" style={{ height: u(128), borderRadius: u(5) }} />
            <div style={{ padding: `0 ${u(8)}` }}>
              <p className="uppercase text-[#8A7A6E]" style={{ fontFamily: SANS, fontSize: u(3.6), letterSpacing: '0.08em', lineHeight: 1, marginTop: u(9) }}>
                {g.category}
              </p>
              <h3 className="font-normal text-[#2A1A10]" style={{ fontFamily: SERIF, fontSize: u(7), lineHeight: 1.1, marginTop: u(4) }}>
                {g.title}
              </h3>
              <p className="font-bold text-[#3A3330]" style={{ fontFamily: SANS, fontSize: u(6.05), lineHeight: 1, marginTop: u(4) }}>
                {formatPrice(g.price)}
              </p>
            </div>
            <div className="absolute flex items-center" style={{ left: u(8), right: u(8), top: u(186), gap: u(4) }}>
              <div className="flex items-center bg-[#F6F3EC]" style={{ height: u(12), width: u(47), borderRadius: u(2) }}>
                <button onClick={() => setQty(g.id, -1)} aria-label="Quitar uno" className="text-[#8A7A6E] cursor-pointer flex-1" style={{ fontSize: u(6), lineHeight: 1 }}>−</button>
                <span className="bg-white text-center text-[#2A1A10] h-full flex items-center justify-center" style={{ fontFamily: SANS, fontSize: u(5), width: u(16) }}>
                  {quantities[g.id] ?? 1}
                </span>
                <button onClick={() => setQty(g.id, 1)} aria-label="Agregar uno" className="text-[#8A7A6E] cursor-pointer flex-1" style={{ fontSize: u(6), lineHeight: 1 }}>+</button>
              </div>
              <button
                className="uppercase text-white flex-1 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: '#081034', height: u(12), borderRadius: u(1.5), fontFamily: SANS, fontSize: u(4.2), letterSpacing: '0.03em' }}
              >
                Agregar al regalo
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative overflow-hidden text-[#F7F1E4]" style={{ backgroundColor: '#29180E', height: u(291), padding: `${u(46)} ${u(37)} 0` }}>
        <div className="grid" style={{ gridTemplateColumns: `${u(230)} ${u(141)} ${u(138)} 1fr` }}>
          <div>
            <span style={{ fontFamily: SANS, fontSize: u(8.5), lineHeight: 1 }} className="block">WEDA</span>
            <p className="text-[#F7F1E4]/60" style={{ fontFamily: SANS, fontSize: u(5.3), lineHeight: u(10), marginTop: u(16), maxWidth: u(175) }}>
              La plataforma contemporánea para organizar tu casamiento de punta a punta. Creada con orgullo para celebraciones con sentido y belleza.
            </p>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(4), letterSpacing: '0.08em', lineHeight: 1 }}>Herramientas</h4>
            <ul className="text-[#F7F1E4]/80" style={{ fontFamily: SANS, fontSize: u(5.1), marginTop: u(9) }}>
              {['Sitio Web', 'Lista de Invitados', 'Confirmación RSVP', 'Regalos Digitales'].map((t) => (
                <li key={t} style={{ height: u(14.5), lineHeight: 1 }}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(4), letterSpacing: '0.08em', lineHeight: 1 }}>Compañía</h4>
            <ul className="text-[#F7F1E4]/80" style={{ fontFamily: SANS, fontSize: u(5.1), marginTop: u(9) }}>
              {['Sobre Nosotros', 'Blog Editorial', 'Contacto'].map((t) => (
                <li key={t} style={{ height: u(14.5), lineHeight: 1 }}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(4), letterSpacing: '0.08em', lineHeight: 1 }}>Contacto &amp; Soporte</h4>
            <p className="text-[#F7F1E4]" style={{ fontFamily: SANS, fontSize: u(5.35), fontWeight: 600, lineHeight: 1, marginTop: u(8) }}>hola@weda.com.ar</p>
            <p className="text-[#F7F1E4]/55" style={{ fontFamily: SANS, fontSize: u(5.85), lineHeight: u(9.2), marginTop: u(8), maxWidth: u(128) }}>
              ¿Tenés dudas? Nuestro atelier de soporte está disponible de lunes a viernes de 9 a 18 hs.
            </p>
          </div>
        </div>

        <div className="absolute bg-[#F7F1E4]/10" style={{ left: u(37), right: u(37), top: u(145), height: 1 }}></div>

        <span
          aria-hidden="true"
          className="absolute select-none pointer-events-none text-[#F7F1E4]/[0.035]"
          style={{ fontFamily: SANS, fontSize: u(82.2), lineHeight: 1, left: u(37), top: u(173.5), fontWeight: 400 }}
        >
          WEDA
        </span>

        <div className="absolute flex items-center justify-between text-[#F7F1E4]/45" style={{ left: u(37), right: u(37), bottom: u(24), fontFamily: SANS, fontSize: u(5.26) }}>
          <span>© 2026 Weda Casamientos. Todos los derechos reservados.</span>
          <span className="flex" style={{ gap: u(10.5) }}>
            <span>Políticas de Privacidad</span>
            <span>Términos del Servicio</span>
          </span>
        </div>
      </footer>
    </div>
  );
};
