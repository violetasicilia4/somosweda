import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { AppView } from '../types';
import { ExampleScreen } from './LandingSections';
import { Wordmark } from './Wordmark';

interface FindCoupleViewProps {
  onNavigate: (view: AppView) => void;
  onOpenExample: (screen?: ExampleScreen) => void;
}

const SANS = "'Schibsted Grotesk', sans-serif";
const SERIF = "'Instrument Serif', serif";

// Listas de muestra: todas abren la lista de ejemplo del prototipo.
const coupleLists = [
  { name: 'Milagros & Juan', date: '24 · 10 · 2026', image: '/ejemplo-hero.webp', pos: '50% 30%' },
  { name: 'Lucía & Tomás', date: '14 · 03 · 2026', image: '/pareja-25.webp', pos: '50% 68%' },
  { name: 'Agustina & Nicolás', date: '22 · 11 · 2025', image: '/pareja-26.webp', pos: '50% 68%' },
  { name: 'Julieta & Matías', date: '17 · 01 · 2026', image: '/pareja-27.webp', pos: '50% 48%' },
  { name: 'Camila & Federico', date: '05 · 12 · 2026', image: '/pareja-28.webp', pos: '50% 62%' },
  { name: 'Valentina & Santiago', date: '28 · 02 · 2026', image: '/pareja-29.webp', pos: '62% 55%' },
  { name: 'Sofía & Martín', date: '11 · 04 · 2026', image: '/pareja-30.png', pos: '50% 50%' },
  { name: 'Florencia & Gonzalo', date: '19 · 09 · 2026', image: '/pareja-31.webp', pos: '50% 68%' },
  { name: 'Carolina & Ezequiel', date: '03 · 10 · 2025', image: '/pareja-32.webp', pos: '50% 45%' },
  { name: 'Paula & Lucas', date: '30 · 05 · 2026', image: '/pareja-33.png', pos: '50% 28%' },
  { name: 'Micaela & Bruno', date: '21 · 03 · 2026', image: '/pareja-34.webp', pos: '36% 100%' },
  { name: 'Romina & Pablo', date: '08 · 11 · 2026', image: '/pareja-35.webp', pos: '50% 42%' },
];

export const FindCoupleView: React.FC<FindCoupleViewProps> = ({ onNavigate, onOpenExample }) => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = coupleLists.filter((c) => c.name.toLowerCase().includes(q));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navBtn =
    'text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] hover:opacity-70 transition-opacity cursor-pointer';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2A1A10]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 sm:px-8 border-b border-[#EFE9E1]">
        <div className="max-w-5xl mx-auto h-14 sm:h-16 flex items-center justify-between">
          <Wordmark onClick={() => onNavigate('landing')} />
          <div className="flex items-center gap-5 sm:gap-7">
            <button type="button" onClick={() => onNavigate('login')} className={navBtn} style={{ fontFamily: SANS }}>
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] bg-white border border-[#2A2318]/40 px-5 py-2.5 hover:bg-[#F7F1E4] transition-colors cursor-pointer"
              style={{ fontFamily: SANS }}
            >
              Crear mi lista
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-[#FBF9F5] px-4 sm:px-8 pt-5 sm:pt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.04em] text-[#6F625A] hover:text-[#2A1A10] transition-colors cursor-pointer"
            style={{ fontFamily: SANS }}
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Volver</span>
          </button>

          <h1
            className="mt-2 text-center font-normal text-[#2A1A10] text-[clamp(30px,3.6vw,44px)] leading-[1.05]"
            style={{ fontFamily: SERIF }}
          >
            Encontrá a <em>una pareja</em>
          </h1>
          <p className="mt-3 text-center text-[14px] text-[#6F625A] max-w-[520px] mx-auto leading-relaxed">
            Buscá a la pareja que te invitó y entrá a su lista de regalos.
          </p>

          <div className="mt-6 max-w-[460px] mx-auto relative">
            <Search className="w-4 h-4 text-[#8A7A6E] absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá por nombre, por ejemplo Milagros"
              aria-label="Buscar una pareja"
              className="w-full h-11 pl-11 pr-4 bg-white border border-[#DDD3C8] rounded-[2px] text-[14px] text-[#2A1A10] placeholder:text-[#8A7A6E] focus:outline-none focus:border-[#2D1A0E]"
              style={{ fontFamily: SANS }}
            />
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {results.map((c) => (
                <div key={c.name} className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[190px] aspect-square rounded-full overflow-hidden ring-1 ring-[#DDD3C8]">
                    <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: c.pos }} />
                  </div>
                  <h2 className="mt-4 font-normal text-[#2A1A10] text-[22px] leading-tight" style={{ fontFamily: SERIF }}>{c.name}</h2>
                  <p className="mt-1.5 text-[11px] text-[#6F625A] leading-snug" style={{ fontFamily: SANS }}>
                    {c.date}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenExample('gifts')}
                    className="mt-3 uppercase text-[10px] tracking-[0.04em] text-[#2D1A0E] border border-[#2D1A0E]/50 px-3 py-2 hover:bg-[#2D1A0E] hover:text-white transition-colors cursor-pointer"
                    style={{ fontFamily: SANS }}
                  >
                    Ver lista de regalos
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-[15px] text-[#6F625A]">
              No encontramos esa lista. Pedile el enlace a la pareja que te invitó.
            </p>
          )}
          <p className="mt-6 text-center text-[11px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>Listas de ejemplo.</p>
        </div>
      </main>
    </div>
  );
};
