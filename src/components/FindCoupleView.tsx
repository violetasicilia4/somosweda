import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { AppView } from '../types';
import { ExampleScreen } from './LandingSections';

interface FindCoupleViewProps {
  onNavigate: (view: AppView) => void;
  onOpenExample: (screen?: ExampleScreen) => void;
}

const SANS = "'Schibsted Grotesk', sans-serif";
const SERIF = "'Instrument Serif', serif";

// Listas de muestra: todas abren la lista de ejemplo del prototipo.
const coupleLists = [
  { name: 'Milagros & Juan', date: '24 de octubre de 2026', gifts: 24, image: '/ejemplo-hero.webp', pos: '50% 30%' },
  { name: 'Lucía & Tomás', date: '14 de marzo de 2026', gifts: 18, image: '/deseo-luna-de-miel.webp', pos: '50% 50%' },
  { name: 'Agustina & Nicolás', date: '22 de noviembre de 2025', gifts: 21, image: '/deseo-cena.webp', pos: '50% 78%' },
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
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="text-[28px] font-normal leading-normal uppercase text-[#2C1A0E] cursor-pointer"
            style={{ fontFamily: SANS }}
          >
            Weda
          </button>
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

      <main className="flex-1 bg-[#FBF9F5] px-4 sm:px-8 pt-12 sm:pt-20 pb-20">
        <div className="max-w-[1100px] mx-auto">
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
            className="mt-8 text-center font-normal text-[#2A1A10] text-[clamp(34px,4.4vw,56px)] leading-[1.05]"
            style={{ fontFamily: SERIF }}
          >
            Encontrá a <em>una pareja</em>
          </h1>
          <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[520px] mx-auto leading-relaxed">
            Buscá a la pareja que te invitó y entrá a su lista de regalos.
          </p>

          <div className="mt-8 max-w-[460px] mx-auto relative">
            <Search className="w-4 h-4 text-[#8A7A6E] absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá por nombre, por ejemplo Milagros"
              aria-label="Buscar una pareja"
              className="w-full h-12 pl-11 pr-4 bg-white border border-[#DDD3C8] rounded-[2px] text-[14px] text-[#2A1A10] placeholder:text-[#8A7A6E] focus:outline-none focus:border-[#2D1A0E]"
              style={{ fontFamily: SANS }}
            />
          </div>

          {results.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {results.map((c) => (
                <div key={c.name} className="bg-[#F4F0EB] rounded-[8px] overflow-hidden flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: c.pos }} />
                  </div>
                  <div className="p-5 flex flex-col items-center text-center">
                    <h2 className="font-normal text-[#2A1A10] text-[26px] leading-none" style={{ fontFamily: SERIF }}>{c.name}</h2>
                    <p className="mt-2 text-[12px] text-[#6F625A]" style={{ fontFamily: SANS }}>
                      {c.date} · {c.gifts} regalos
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenExample('gifts')}
                      className="mt-4 uppercase text-[12px] tracking-[0.04em] text-[#2D1A0E] border border-[#2D1A0E]/50 px-5 py-2.5 hover:bg-[#2D1A0E] hover:text-white transition-colors cursor-pointer"
                      style={{ fontFamily: SANS }}
                    >
                      Ver lista de regalos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-[15px] text-[#6F625A]">
              No encontramos esa lista. Pedile el enlace a la pareja que te invitó.
            </p>
          )}
          <p className="mt-8 text-center text-[11px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>Listas de ejemplo.</p>
        </div>
      </main>
    </div>
  );
};
