import React, { useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  Circle,
  Eye,
  Gift,
  HelpCircle,
  Image as ImageIcon,
  Landmark,
  MapPin,
  Music,
  Percent,
  PiggyBank,
  Plus,
  Shirt,
  Users,
  X,
} from 'lucide-react';
import { formatARS } from '../utils/format';

const SANS = "'Schibsted Grotesk', sans-serif";
const SERIF = "'Instrument Serif', serif";

export type ExampleScreen = 'home' | 'gifts' | 'rsvp';

const btnDark =
  'text-[12px] font-normal leading-normal uppercase text-white bg-[#2D1A0E] px-6 py-3 hover:bg-[#1A0E08] transition-colors cursor-pointer';

const h2Serif = 'text-center font-normal text-[#2A1A10] text-[clamp(30px,3.6vw,48px)] leading-[1.1] text-balance';

const TextLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="uppercase text-[12px] tracking-[0.04em] text-[#2D1A0E] inline-flex items-center gap-2 border-b border-[#2D1A0E]/40 pb-1 hover:border-[#2D1A0E] transition-colors cursor-pointer"
    style={{ fontFamily: SANS }}
  >
    <span>{children}</span>
    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
  </button>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-center text-[11px] tracking-[0.1em] text-[#8A7A6E] uppercase mb-4" style={{ fontFamily: SANS }}>
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* 2. QUÉ INCLUYE WEDA — 4 bloques                                     */
/* ------------------------------------------------------------------ */

// Estructura calcada de la referencia: foto de ambiente de fondo a sangre + un panel
// blanco flotante grande, con un segundo elemento que se corta en el borde derecho
// para sugerir que hay más (mismo recurso que "Registry" y "Wedding website").
const IncludeOuter: React.FC<{ bg?: string; color?: string; pos?: string; blur?: boolean; children: React.ReactNode }> = ({
  bg,
  color,
  pos = '50% 50%',
  blur,
  children,
}) => (
  <div className="relative aspect-square rounded-[16px] overflow-hidden bg-[#EFEAE2]" style={color ? { backgroundColor: color } : undefined}>
    {bg && (
      <img
        src={bg}
        alt=""
        referrerPolicy="no-referrer"
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover ${blur ? 'scale-110 blur-[3px]' : ''}`}
        style={{ objectPosition: pos }}
      />
    )}
    {children}
  </div>
);

const ProductTile: React.FC<{ img: string; pos?: string; category: string; title: string; addButton?: boolean }> = ({
  img,
  pos = '50% 50%',
  category,
  title,
  addButton,
}) => (
  <div className="w-[78%] shrink-0">
    {/* El botón "+" vive fuera del contenedor con overflow-hidden de la foto, así no se corta */}
    <div className="relative">
      <div className="aspect-[1/0.8] rounded-[8px] overflow-hidden">
        <img src={img} alt={title} referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: pos }} />
      </div>
      {addButton && (
        <span className="absolute -bottom-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <Plus className="w-4 h-4" strokeWidth={2.25} />
        </span>
      )}
    </div>
    <p className="mt-2.5 text-[10px] text-[#8A7A6E] truncate" style={{ fontFamily: SANS }}>{category}</p>
    <p className="text-[13px] font-semibold text-[#282018] leading-snug" style={{ fontFamily: SANS }}>{title}</p>
  </div>
);

const IncludeGiftCard: React.FC = () => (
  <IncludeOuter bg="/terreno-regalos.png" pos="50% 40%" blur>
    <div className="absolute left-[7%] right-[-18%] top-[7%] bottom-[7%] bg-white rounded-[12px] overflow-hidden">
      <div className="h-full flex items-start gap-3 p-4">
        <ProductTile img="/deseo-set-cocina-2.png" pos="50% 40%" category="Casa y hogar" title="Set de cocina" addButton />
        <ProductTile img="/deseo-vino.webp" pos="50% 60%" category="Experiencias" title="Degustación en Mendoza" />
      </div>
    </div>
  </IncludeOuter>
);

const IncludeRsvpCard: React.FC = () => {
  const rows = [
    { name: 'Camila Rodríguez', detail: '+1 · Vegetariana', status: 'confirmado' as const },
    { name: 'Lucas Benítez', detail: 'Sin acompañantes · Celíaco', status: 'confirmado' as const },
    { name: 'Valentina Morales', detail: '+2', status: 'pendiente' as const },
  ];
  return (
    <IncludeOuter bg="/terreno-regalos.png" pos="50% 40%" blur>
      <div className="absolute inset-x-[8%] top-[6%] bottom-[-6%] bg-white rounded-[12px] overflow-hidden">
        <div className="p-3.5 divide-y divide-[#F1EEE7]">
          {rows.map((r) => {
            const s = rsvpStatus[r.status];
            const StatusIcon = s.icon;
            return (
              <div key={r.name} className="flex items-center justify-between gap-2 py-2.5 first:pt-0">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#282018] truncate" style={{ fontFamily: SANS }}>{r.name}</p>
                  <p className="text-[10px] text-[#8A7A6E] truncate" style={{ fontFamily: SANS }}>{r.detail}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full shrink-0 ${s.className}`} style={{ fontFamily: SANS }}>
                  <StatusIcon className="w-2.5 h-2.5" strokeWidth={2.25} />
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </IncludeOuter>
  );
};

// Mismo tamaño de recuadro que las otras dos tarjetas (aspect-[4/5]), pero la "web" de
// adentro es apaisada (16:11) y queda centrada, con el fondo asomando arriba, abajo y a
// los costados, para que se lea como una ventana de navegador y no como una foto.
const IncludeSiteCard: React.FC = () => (
  <IncludeOuter bg="/terreno-regalos.png" pos="50% 40%" blur>
    <div className="absolute inset-x-[3%] top-1/2 -translate-y-1/2 aspect-[16/13] bg-white rounded-[10px] overflow-hidden flex flex-col shadow-[0_10px_24px_rgba(45,26,14,0.18)]">
      <div className="h-7 shrink-0 bg-[#F4F0EB] border-b border-[#E9E8E4] flex items-center px-3 gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D8D2C8]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D8D2C8]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D8D2C8]"></span>
        <span className="ml-2 text-[9px] text-[#8A7A6E] truncate" style={{ fontFamily: SANS }}>weda.app/boda/milagros-y-juan</span>
      </div>
      <div className="relative flex-1">
        <img src="/ejemplo-hero.webp" alt="Milagros y Juan" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 22%' }} />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute inset-x-3 bottom-2.5 text-center text-white">
          <p className="text-[9px] font-semibold uppercase tracking-[0.04em] leading-none" style={{ fontFamily: SANS }}>Milagros &amp; Juan</p>
          <p className="mt-1 text-[8px]" style={{ fontFamily: SANS }}>24 · 10 · 2026</p>
        </div>
      </div>
    </div>
  </IncludeOuter>
);

export const WhatIncludes: React.FC<{ onCreate: () => void; onOpenExample: (screen?: ExampleScreen) => void }> = ({
  onCreate,
  onOpenExample,
}) => {
  const cards = [
    { title: 'Lista de regalos', text: 'Recibí regalos para la vida que están construyendo, sin comisión.', visual: <IncludeGiftCard />, onClick: onCreate },
    { title: 'Invitados y RSVP', text: 'Confirmaciones online, sin perseguir a nadie por WhatsApp.', visual: <IncludeRsvpCard />, onClick: onCreate },
    { title: 'Micrositio', text: 'Toda la información de tu casamiento en una sola página.', visual: <IncludeSiteCard />, onClick: () => onOpenExample('gifts') },
  ];
  return (
    <section className="bg-white px-4 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
      <div className="max-w-[1100px] mx-auto">
        <h2 className={h2Serif} style={{ fontFamily: SERIF, fontSize: 'clamp(24px,2.8vw,36px)' }}>
          Herramientas para <em>planificar tu casamiento</em>
        </h2>
        <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
          Invitados, RSVP, micrositio y regalos, todo desde un solo panel.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-start">
          {cards.map((card) => (
            <div key={card.title}>
              {card.visual}
              <button
                type="button"
                onClick={card.onClick}
                className="mt-4 inline-flex items-center gap-2 text-[16px] font-normal uppercase tracking-normal text-[#2A1A10] hover:opacity-70 transition-opacity cursor-pointer"
                style={{ fontFamily: SANS }}
              >
                {card.title}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <p className="mt-1.5 text-[14px] text-[#6F625A] leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3. LA LISTA DE REGALOS MODERNA — texto + collage de fotos            */
/* ------------------------------------------------------------------ */

const giftListPoints = [
  { icon: Gift, text: 'Miles de regalos simbólicos: casa, viajes, cenas y experiencias, adaptados a tu boda.' },
  { icon: PiggyBank, text: 'Fondos de ahorro para la luna de miel, la casa propia o lo que sueñen.' },
  { icon: Users, text: 'Tus invitados eligen y pagan en un minuto desde el celular, sin crear cuenta.' },
];

const GiftListCollage: React.FC = () => (
  <div className="relative aspect-square max-w-[420px] w-full mx-auto">
    <div className="absolute inset-[6%] bg-[#E5D3C4] rounded-[20px] rotate-[-2deg]"></div>
    <img
      src="/deseo-escapada.png"
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      className="absolute left-0 bottom-[6%] w-[62%] aspect-[3/4] object-cover rounded-[10px] rotate-[-4deg] shadow-[0_10px_24px_rgba(45,26,14,0.18)]"
      style={{ objectPosition: '50% 62%' }}
    />
    <img
      src="/deseo-cena.webp"
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      className="absolute right-[2%] top-[2%] w-[58%] aspect-[4/5] object-cover rounded-[10px] rotate-[3deg] shadow-[0_10px_24px_rgba(45,26,14,0.18)]"
      style={{ objectPosition: '50% 78%' }}
    />
    <span
      className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-[#2D1A0E] text-[#F5F0EA] flex items-center justify-center text-center text-[11px] leading-tight uppercase tracking-[0.02em] rotate-[8deg] shadow-[0_6px_16px_rgba(45,26,14,0.3)]"
      style={{ fontFamily: SANS }}
    >
      Sin
      <br />
      comisión
    </span>
  </div>
);

export const GiftListSection: React.FC<{ onOpenExample: (screen?: ExampleScreen) => void }> = ({ onOpenExample }) => {
  return (
    <section className="bg-white px-4 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <Eyebrow>Regalos</Eyebrow>
            <h2 className="font-normal text-[#2A1A10] text-[clamp(28px,3.2vw,42px)] leading-[1.1] text-balance" style={{ fontFamily: SERIF }}>
              La lista de regalos <em>moderna</em>
            </h2>
            <p className="mt-4 text-[15px] text-[#6F625A] leading-relaxed max-w-[440px]">
              Compartí un solo link y seguí todo desde tu panel.
            </p>
            <ul className="mt-7 space-y-4 max-w-[440px]">
              {giftListPoints.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 text-[#2D1A0E] shrink-0" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#2A1A10] leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <TextLink onClick={() => onOpenExample('gifts')}>Ver una lista de ejemplo</TextLink>
            </div>
          </div>
          <GiftListCollage />
        </div>

        {/* Cuarta idea, destacada: el seguimiento de quién regaló qué */}
        <div className="mt-4 lg:mt-5 bg-[#2D1A0E] rounded-[8px] px-6 sm:px-12 py-8 sm:py-10 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="text-[#F5F0EA]">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#E7D3C0]" style={{ fontFamily: SANS }}>Y además</span>
            <h3 className="mt-3 font-normal text-[clamp(28px,3vw,40px)] leading-[1.1]" style={{ fontFamily: SERIF }}>
              Saber quién te regaló qué
            </h3>
            <p className="mt-4 text-[15px] text-[#F5F0EA]/80 leading-relaxed max-w-[440px]">
              Cada regalo queda registrado con el nombre de quien lo hizo y su mensaje. Agradecés uno por uno y no perseguís a nadie por WhatsApp.
            </p>
          </div>
          <div className="bg-[#FBF9F5] rounded-[6px] p-4 sm:p-5 divide-y divide-[#EFE9E1]" style={{ fontFamily: SANS }}>
            {[
              ['CR', 'Camila Rodríguez', 'Noche de hotel en Como', '“¡Disfruten mucho!”', 'ARS 180.000'],
              ['LB', 'Lucas Benítez', 'Cena romántica para dos', '“Los queremos”', 'ARS 85.000'],
              ['FP', 'Familia Paz', 'Un café de especialidad', '“Un brindis por ustedes”', 'ARS 15.000'],
            ].map(([ini, who, what, msg, amount]) => (
              <div key={who} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="w-9 h-9 rounded-full bg-[#F0E8D8] text-[#2A1A10] text-[11px] font-semibold flex items-center justify-center shrink-0">
                  {ini}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#282018] truncate">{who}</p>
                  <p className="text-[11px] text-[#6F625A] truncate">{what}</p>
                  <p className="text-[11px] text-[#8A7A6E] italic truncate">{msg}</p>
                </div>
                <p className="text-[12px] font-bold text-[#3A3330] shrink-0">{amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confianza, en formato compacto: sin sección aparte */}
        <div className="mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: Percent, title: 'Sin comisión', text: 'Weda no cobra nada por cada regalo que reciben.' },
            { icon: Landmark, title: 'Dinero directo a tu cuenta', text: 'Mercado Pago o transferencia. Nunca pasa por Weda.' },
            { icon: Eye, title: 'Seguimiento de cada regalo', text: 'Ves quién te regaló qué, cuánto y con qué mensaje.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3.5">
              <Icon className="w-4.5 h-4.5 mt-0.5 text-[#2D1A0E] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-[14px] font-semibold text-[#2A1A10] leading-snug">{title}</h3>
                <p className="mt-1 text-[13px] text-[#6F625A] leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 4. MICROSITIO                                                       */
/* ------------------------------------------------------------------ */

const siteModules = [
  { icon: MapPin, label: 'Ubicación' },
  { icon: Calendar, label: 'Cronograma' },
  { icon: Shirt, label: 'Dress code' },
  { icon: Building2, label: 'Hoteles' },
  { icon: Music, label: 'Playlist' },
  { icon: ImageIcon, label: 'Galería' },
  { icon: HelpCircle, label: 'Preguntas frecuentes' },
];

const MicrositeVisual: React.FC = () => (
  <div className="rounded-[8px] border border-[#DDD3C8] bg-white overflow-hidden shadow-[0_16px_40px_rgba(45,26,14,0.1)]">
    <div className="h-9 bg-[#F4F0EB] border-b border-[#E9E8E4] flex items-center px-4 gap-1.5">
      <span className="w-2 h-2 rounded-full bg-[#D8D2C8]"></span>
      <span className="w-2 h-2 rounded-full bg-[#D8D2C8]"></span>
      <span className="w-2 h-2 rounded-full bg-[#D8D2C8]"></span>
      <span className="ml-3 text-[11px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>weda.app/boda/milagros-y-juan</span>
    </div>
    <div className="relative aspect-[16/9]">
      <img
        src="/ejemplo-hero.webp"
        alt="Milagros y Juan"
        referrerPolicy="no-referrer"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 22%' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 text-center text-white px-4">
        <p className="text-[clamp(22px,2.6vw,32px)] leading-none" style={{ fontFamily: SERIF }}>Milagros &amp; Juan</p>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: SANS }}>24 · 10 · 2026 · Buenos Aires</p>
      </div>
    </div>
    <div className="p-4 sm:p-5 grid grid-cols-2 gap-2">
      {siteModules.slice(0, 4).map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 bg-[#F4F0EB] rounded-[4px] px-3 py-2.5">
          <Icon className="w-3.5 h-3.5 text-[#8A6A55] shrink-0" strokeWidth={1.5} />
          <span className="text-[11px] text-[#2A1A10] truncate" style={{ fontFamily: SANS }}>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export const MicrositeSection: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <section className="bg-[#ECE6DF] px-4 sm:px-8 py-12 sm:py-16">
    <div className="max-w-[1100px] mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
      <div>
        <Eyebrow>Micrositio</Eyebrow>
        <h2 className="font-normal text-[#2A1A10] text-[clamp(28px,3.2vw,42px)] leading-[1.1] text-balance" style={{ fontFamily: SERIF }}>
          Un lugar para que tus invitados <em>encuentren todo</em>
        </h2>
        <p className="mt-4 text-[15px] text-[#6F625A] leading-relaxed max-w-[440px]">
          Ubicación, cronograma, dress code, hoteles y galería, en una página con la estética de tu casamiento. Tus invitados entran una vez y ya saben todo.
        </p>
        <div className="mt-7">
          <button type="button" onClick={onCreate} className={btnDark} style={{ fontFamily: SANS }}>
            Crear mi evento
          </button>
          <p className="mt-3 text-[12px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>
            Vos la armás en minutos. Ellos la ven en segundos.
          </p>
        </div>
      </div>
      <MicrositeVisual />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 5. RSVP Y GESTIÓN DE INVITADOS                                      */
/* ------------------------------------------------------------------ */

const rsvpGuests = [
  { name: 'Camila Rodríguez', detail: '+1 · Vegetariana', status: 'confirmado' as const },
  { name: 'Lucas Benítez', detail: 'Sin acompañantes · Celíaco', status: 'confirmado' as const },
  { name: 'Valentina Morales', detail: '+2', status: 'pendiente' as const },
  { name: 'Florencia & Gonzalo Paz', detail: '+1', status: 'no-asiste' as const },
];

const rsvpStatus = {
  confirmado: { icon: Check, label: 'Confirmado', className: 'bg-[#2D1A0E] text-white' },
  pendiente: { icon: Circle, label: 'Pendiente', className: 'bg-white border border-[#DDD3C8] text-[#6F625A]' },
  'no-asiste': { icon: X, label: 'No asiste', className: 'bg-transparent text-[#B3A99C] line-through decoration-1' },
};

const RsvpVisual: React.FC = () => (
  <div className="rounded-[6px] border border-[#DDD3C8] bg-white p-5 sm:p-6 divide-y divide-[#F1EEE7]">
    {rsvpGuests.map((g) => {
      const s = rsvpStatus[g.status];
      const StatusIcon = s.icon;
      return (
        <div key={g.name} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold text-[#282018] truncate ${g.status === 'no-asiste' ? 'opacity-60' : ''}`} style={{ fontFamily: SANS }}>{g.name}</p>
            <p className="text-[11px] text-[#8A7A6E] truncate" style={{ fontFamily: SANS }}>{g.detail}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full shrink-0 ${s.className}`} style={{ fontFamily: SANS }}>
            <StatusIcon className="w-3 h-3" strokeWidth={2.25} />
            {s.label}
          </span>
        </div>
      );
    })}
  </div>
);

const rsvpSummary = [
  { icon: Check, value: '87', label: 'confirmados', className: 'text-[#2D1A0E]' },
  { icon: Circle, value: '22', label: 'pendientes', className: 'text-[#8A7A6E]' },
  { icon: X, value: '11', label: 'no asisten', className: 'text-[#B3A99C]' },
];

const RsvpSummaryBar: React.FC = () => (
  <div className="rounded-[6px] border border-[#DDD3C8] bg-[#FBF9F5] px-5 py-4 mb-4">
    <p className="text-[13px] font-semibold text-[#2A1A10]" style={{ fontFamily: SANS }}>120 invitados</p>
    <div className="mt-2.5 flex items-center gap-5">
      {rsvpSummary.map((s) => (
        <span key={s.label} className={`inline-flex items-center gap-1.5 text-[12px] ${s.className}`} style={{ fontFamily: SANS }}>
          <s.icon className="w-3 h-3 shrink-0" strokeWidth={2.25} />
          <strong className="font-semibold">{s.value}</strong> {s.label}
        </span>
      ))}
    </div>
  </div>
);

export const RsvpSection: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <section className="bg-white px-4 sm:px-8 py-12 sm:py-16">
    <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
      <div className="md:order-2">
        <Eyebrow>Invitados y RSVP</Eyebrow>
        <h2 className="font-normal text-[#2A1A10] text-[clamp(28px,3.2vw,42px)] leading-[1.1] text-balance" style={{ fontFamily: SERIF }}>
          Menos mensajes. <em>Más organización.</em>
        </h2>
        <p className="mt-4 text-[15px] text-[#6F625A] leading-relaxed max-w-[440px]">
          Confirmaciones online, acompañantes, restricciones alimentarias y estado de respuesta en tiempo real.
        </p>
        <div className="mt-7">
          <button type="button" onClick={onCreate} className={btnDark} style={{ fontFamily: SANS }}>
            Crear mi evento
          </button>
        </div>
      </div>
      <div className="md:order-1">
        <RsvpSummaryBar />
        <RsvpVisual />
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 6. CÓMO FUNCIONA — timeline de 4 pasos                              */
/* ------------------------------------------------------------------ */

const timelineSteps = [
  'Creá tu evento',
  'Personalizalo',
  'Compartilo',
  'Recibí confirmaciones y regalos',
];

export const HowItWorksTimeline: React.FC = () => (
  <section id="como-funciona" className="scroll-mt-20 bg-[#F4F0EB] px-4 sm:px-8 py-6 sm:py-8">
    <div className="max-w-[820px] mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 gap-y-4">
      {timelineSteps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex w-7 h-7 rounded-full border border-[#2D1A0E] items-center justify-center text-[12px] text-[#2A1A10] shrink-0" style={{ fontFamily: SERIF }}>
              {i + 1}
            </span>
            <p className="text-[12px] sm:text-[13px] font-semibold text-[#2A1A10] leading-snug whitespace-nowrap">{step}</p>
          </div>
          {i < timelineSteps.length - 1 && (
            <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-[#2D1A0E]/30 shrink-0" strokeWidth={1.5} />
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 8. PLANES                                                           */
/* ------------------------------------------------------------------ */

interface PricingPlan {
  name: string;
  badge?: string;
  description: string;
  price: string;
  included?: string;
  features: string[];
  highlighted?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Lista de Regalos',
    description: 'Para parejas que solo quieren recibir regalos de forma simple.',
    price: 'AR$ 99.000',
    features: ['Lista de regalos personalizada', 'Regalos ilimitados', 'Fondos de regalo', 'URL personalizada'],
  },
  {
    name: 'Invitados y RSVP',
    description: 'Sumale confirmaciones online y gestión de invitados a tu lista.',
    price: 'AR$ 129.000',
    included: 'Todo lo incluido en Lista de Regalos',
    features: ['RSVP online', 'Gestión de invitados', 'Exportación a Excel'],
  },
  {
    name: 'Evento Completo',
    badge: 'Más elegido',
    description: 'Todo lo necesario para organizar y compartir tu casamiento, sin depender de WhatsApp ni Excel.',
    price: 'AR$ 159.000',
    included: 'Todo lo incluido en Invitados y RSVP',
    features: ['Micrositio completo', 'Galería de fotos', 'Ubicación y cronograma'],
    highlighted: true,
  },
];

const FeatureList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2.5">
    {items.map((f) => (
      <li key={f} className="flex items-start gap-2 text-[13px] text-[#2A1A10] leading-snug">
        <Check className="w-3.5 h-3.5 mt-0.5 text-[#2D1A0E] shrink-0" strokeWidth={2} />
        <span>{f}</span>
      </li>
    ))}
  </ul>
);

const PricingCTA: React.FC<{ onClick: () => void; highlighted?: boolean }> = ({ onClick, highlighted }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between rounded-full pl-5 pr-1.5 py-1.5 text-[13px] font-normal transition-colors cursor-pointer ${
      highlighted ? 'bg-[#2D1A0E] text-white hover:bg-[#1A0E08]' : 'bg-white border border-[#DDD3C8] text-[#2A1A10] hover:bg-[#FBF9F5]'
    }`}
    style={{ fontFamily: SANS }}
  >
    Crear mi evento
    <span
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        highlighted ? 'bg-white text-[#2D1A0E]' : 'bg-[#F4F0EB] text-[#2A1A10]'
      }`}
    >
      <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
    </span>
  </button>
);

export const Pricing: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <section id="planes" className="scroll-mt-20 bg-white px-4 sm:px-8 py-12 sm:py-16">
    <div className="max-w-[1060px] mx-auto">
      <Eyebrow>Planes</Eyebrow>
      <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
        La mayoría elige organizar <em>todo desde un solo lugar</em>
      </h2>
      <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
        Desde una lista de regalos simple hasta una experiencia completa para tus invitados.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-[20px] p-6 sm:p-7 flex flex-col ${
              plan.highlighted
                ? 'bg-white border-2 border-[#2D1A0E] shadow-[0_12px_32px_rgba(45,26,14,0.1)]'
                : 'bg-[#FBF9F5] border border-[#DDD3C8]'
            }`}
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-[15px] font-normal uppercase tracking-normal text-[#2A1A10]" style={{ fontFamily: SANS }}>
                {plan.name}
              </h3>
              {plan.badge && (
                <span
                  className="uppercase text-[9px] tracking-[0.08em] bg-[#2D1A0E] text-white px-2.5 py-1 rounded-[2px]"
                  style={{ fontFamily: SANS }}
                >
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] text-[#6F625A] leading-relaxed min-h-[52px]">{plan.description}</p>

            <div className="mt-5">
              <span className="text-[28px] font-normal leading-none text-[#2A1A10]" style={{ fontFamily: SANS }}>
                {plan.price}
              </span>
              <p className="text-[12px] text-[#8A7A6E] mt-1.5" style={{ fontFamily: SANS }}>
                Pago único
              </p>
            </div>

            <div className="mt-5">
              <PricingCTA onClick={onCreate} highlighted={plan.highlighted} />
            </div>

            <div className="mt-6 pt-6 border-t border-[#E9E2D6] space-y-4">
              {plan.included && (
                <p className="flex items-center gap-2 text-[13px] font-semibold text-[#2A1A10]">
                  <Check className="w-3.5 h-3.5 text-[#2D1A0E] shrink-0" strokeWidth={2} />
                  <span>{plan.included}</span>
                </p>
              )}
              <FeatureList items={plan.features} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 7. PAREJAS FELICES                                                  */
/* ------------------------------------------------------------------ */

const happyCouples = [
  {
    name: 'Lucía & Tomás',
    city: 'Buenos Aires',
    date: 'Marzo 2026',
    quote:
      'Armamos la luna de miel en regalos chicos y cada invitado eligió el suyo. Vimos quién había regalado qué sin perseguir a nadie por WhatsApp.',
  },
  {
    name: 'Agustina & Nicolás',
    city: 'Córdoba',
    date: 'Noviembre 2025',
    quote: 'Mis tíos casi no usan tecnología y regalaron solos desde el celular en un minuto. Nadie nos preguntó cómo se hacía.',
  },
  {
    name: 'Julieta & Matías',
    city: 'Mendoza',
    date: 'Enero 2026',
    quote: 'Armamos la lista alrededor de la casa propia y de un curso de cerámica. Se sintió como nosotros, no como un catálogo.',
  },
  {
    name: 'Camila & Franco',
    city: 'Rosario',
    date: 'Mayo 2026',
    quote: 'El micrositio nos ahorró cientos de mensajes. Los invitados entraban solos y ya sabían todo.',
  },
];

export const HappyCouples: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 336, behavior: 'smooth' });
  };
  return (
    <section className="py-12 sm:py-16 bg-[#F0E8D8] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">Parejas felices</span>
          <h2 className="text-4xl sm:text-5xl font-normal text-[#2A2318] mt-3" style={{ fontFamily: SERIF }}>
            Testimonios con amor.
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="w-10 h-10 rounded-full border border-[#2A2318]/20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2A2318]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="w-10 h-10 rounded-full border border-[#2A2318]/20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-[#2A2318]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 px-4 sm:px-6 snap-x snap-mandatory scroll-smooth scroll-px-4 sm:scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {happyCouples.map((c) => (
          <figure key={c.name} className="shrink-0 w-[280px] sm:w-[320px] bg-white rounded-[8px] p-7 flex flex-col snap-start">
            <span className="text-[#A9795A] text-[44px] leading-[0.6] h-[30px]" style={{ fontFamily: SERIF }}>
              “
            </span>
            <blockquote className="mt-4 text-[17px] leading-[1.4] text-[#2A2318] font-semibold flex-1" style={{ fontFamily: SANS }}>
              {c.quote}
            </blockquote>
            <figcaption className="mt-8">
              <p className="text-[14px] font-semibold text-[#A9542E]" style={{ fontFamily: SANS }}>
                {c.name}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A8072]" style={{ fontFamily: SANS }}>
                {c.city}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A8072]" style={{ fontFamily: SANS }}>
                {c.date}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
