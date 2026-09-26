import React from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  Gift,
  Landmark,
  Percent,
  PiggyBank,
  Users,
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
/* 2. CÓMO FUNCIONA — tres tarjetas                                    */
/* ------------------------------------------------------------------ */

const houseImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

// Tarjeta 1: fotos redondas de los regalos que se pueden pedir
const circleImages = [
  { src: '/deseo-cocina.webp', pos: '60% 60%' },
  { src: '/deseo-deco.webp', pos: '30% 50%' },
  { src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
  { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
  null,
  { src: '/deseo-joyeria.png', pos: '50% 38%' },
  { src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
  { src: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
];

const VisualWishes: React.FC = () => (
  <div className="rounded-[6px] bg-[#E9DFD3] p-3 aspect-square grid grid-cols-3 grid-rows-3 gap-2.5">
    {circleImages.map((c, i) =>
      c ? (
        <img
          key={i}
          src={c.src}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full rounded-full object-cover"
          style={{ objectPosition: c.pos }}
        />
      ) : (
        <span key={i} className="w-full h-full rounded-full bg-[#2D1A0E] text-white flex items-center justify-center">
          <Gift className="w-1/3 h-1/3" strokeWidth={1.4} />
        </span>
      )
    )}
  </div>
);

// Tarjeta 2: fondos de ahorro, en una grilla ordenada de 2 x 3 con una leve inclinación
const polaroids = [
  { src: houseImg, label: 'Casa propia', pos: '50% 50%' },
  { src: '/deseo-luna-de-miel.webp', label: 'Luna de miel', pos: '50% 50%' },
  { src: '/deseo-auto.webp', label: 'Auto nuevo', pos: '50% 60%' },
  { src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', label: 'Remodelar la cocina', pos: '50% 50%' },
  { src: '/deseo-escapada.png', label: 'Escapada de otoño', pos: '50% 62%' },
  { src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80', label: 'Taller de cerámica', pos: '50% 50%' },
];

const VisualMoney: React.FC = () => (
  <div className="rounded-[6px] bg-[#E5D3C4] aspect-square overflow-hidden relative">
    <div className="absolute -inset-[5%] grid grid-cols-2 grid-rows-3 gap-3 p-6 rotate-[-4deg]">
      {polaroids.map((p) => (
        <div key={p.label} className="bg-white p-1.5 rounded-[3px] flex flex-col min-h-0 shadow-[0_4px_12px_rgba(45,26,14,0.12)]">
          <div className="flex-1 min-h-0 overflow-hidden">
            <img
              src={p.src}
              alt=""
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ objectPosition: p.pos }}
            />
          </div>
          <p className="text-[10px] text-[#2A1A10] font-semibold pt-1.5 pb-0.5 truncate" style={{ fontFamily: SANS }}>{p.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// Tarjeta 3: tablet con la lista tal como la ve un invitado
const tabletGifts = [
  { name: 'Hotel en Mallorca', price: 'ARS 990.000', src: '/deseo-luna-de-miel.webp', pos: '50% 50%' },
  { name: 'Cena romántica', price: 'ARS 120.000', src: '/deseo-cena.webp', pos: '50% 78%' },
  { name: 'Pulsera de plata', price: 'ARS 180.000', src: '/deseo-joyeria.png', pos: '50% 38%' },
  { name: 'Fin de semana', price: 'ARS 320.000', src: '/deseo-escapada.png', pos: '50% 62%' },
  { name: 'Batidora de pie', price: 'ARS 450.000', src: '/deseo-cocina.webp', pos: '60% 60%' },
  { name: 'Mesa ratona', price: 'ARS 140.000', src: '/deseo-deco.webp', pos: '30% 50%' },
];

const VisualGuests: React.FC = () => (
  <div className="rounded-[6px] bg-[#EAD9BE] aspect-square flex items-center justify-center p-3">
    <div className="w-full h-full rounded-[14px] border-[6px] border-[#2D1A0E] bg-[#FBF9F5] px-3 pt-2.5 pb-2.5 flex flex-col overflow-hidden">
      <p className="text-center text-[17px] leading-none text-[#2A1A10]" style={{ fontFamily: SERIF }}>Milagros &amp; Juan</p>
      <p className="text-center text-[7px] uppercase tracking-[0.1em] text-[#8A7A6E] mt-1" style={{ fontFamily: SANS }}>Lista de regalos</p>
      <div className="mt-2 flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-1.5">
        {tabletGifts.map((g) => (
          <div key={g.name} className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden rounded-[3px]">
              <img src={g.src} alt="" loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: g.pos }} />
            </div>
            <p className="text-[9px] leading-tight text-[#2A1A10] mt-1 truncate" style={{ fontFamily: SERIF }}>{g.name}</p>
            <p className="text-[7px] font-bold text-[#3A3330] leading-tight" style={{ fontFamily: SANS }}>{g.price}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const HowItWorks: React.FC<{ onOpenExample: (screen?: ExampleScreen) => void }> = ({ onOpenExample }) => {
  const cards = [
    {
      title: 'Miles de regalos simbólicos para tu boda',
      visual: <VisualWishes />,
      text: 'Elegí entre objetos para tu casa, viajes, cenas, experiencias y más, adaptados a tu boda. Son regalos simbólicos: tus invitados pagan su valor y vos recibís el dinero.',
    },
    {
      title: 'Creá un fondo de ahorro para tus sueños',
      visual: <VisualMoney />,
      text: 'Ahorro para la casa propia, la luna de miel o lo que sueñen. Tus invitados pagan con Mercado Pago o transferencia, directo a tu cuenta y sin comisión.',
    },
    {
      title: 'Fácil para tus invitados y para vos',
      visual: <VisualGuests />,
      text: 'Ellos eligen el regalo y lo pagan en un minuto desde el celular, sin crear cuenta. Vos ves quién te regaló qué.',
    },
  ];
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-white px-4 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
          Todos tus regalos en <em>una sola lista</em>
        </h2>
        <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[520px] mx-auto leading-relaxed">
          Compartí un solo link con tus invitados y seguí todo desde tu panel.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {cards.map((c) => (
            <div key={c.title} className="bg-[#F4F0EB] rounded-[8px] px-5 sm:px-6 pt-6 pb-7 flex flex-col">
              <h3 className="text-center font-normal text-[#2A1A10] text-[26px] leading-[1.1] min-h-[56px] flex items-center justify-center text-balance" style={{ fontFamily: SERIF }}>
                {c.title}
              </h3>
              <div className="mt-5">{c.visual}</div>
              <p className="mt-5 text-center text-[15px] text-[#5A4C43] leading-relaxed">{c.text}</p>
            </div>
          ))}
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

        <div className="mt-8 text-center">
          <TextLink onClick={() => onOpenExample('gifts')}>Ver una lista de ejemplo</TextLink>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3. DINERO Y CONFIANZA                                               */
/* ------------------------------------------------------------------ */

export const MoneyTrust: React.FC = () => (
  <section className="bg-[#ECE6DF] px-4 sm:px-8 py-12 sm:py-16">
    <div className="max-w-[1100px] mx-auto">
      <Eyebrow>Dinero y confianza</Eyebrow>
      <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
        El dinero va <em>directo a tu cuenta</em>
      </h2>
      <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
        Un alias te deja el dinero. Weda, además, te cuenta quién te regaló qué. Tus invitados pagan directo a tu cuenta y el dinero nunca pasa por Weda.
      </p>

      {/* Flujo del dinero */}
      <div className="mt-8 max-w-[820px] mx-auto">
        <div className="flex items-stretch gap-2 sm:gap-4">
          <div className="flex-1 bg-white border border-[#DDD3C8] rounded-[4px] p-4 sm:p-5 text-center">
            <Users className="w-6 h-6 mx-auto text-[#8A6A55]" strokeWidth={1.5} />
            <p className="text-[14px] font-semibold text-[#2A1A10] mt-3">Tu invitado</p>
            <p className="text-[12px] text-[#6F625A] mt-1">Elige un regalo y paga</p>
          </div>
          <div className="flex flex-col items-center justify-center shrink-0 text-[#8A6A55] px-0.5 sm:px-2">
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.06em] mt-1 text-center max-w-[76px]" style={{ fontFamily: SANS }}>
              Pago directo
            </span>
          </div>
          <div className="flex-1 bg-[#2D1A0E] text-white rounded-[4px] p-4 sm:p-5 text-center">
            <Landmark className="w-6 h-6 mx-auto text-[#E7D3C0]" strokeWidth={1.5} />
            <p className="text-[14px] font-semibold mt-3">Tu cuenta</p>
            <p className="text-[12px] text-white/70 mt-1">Mercado Pago o transferencia</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 border border-dashed border-[#C4B4A4] rounded-[4px] py-3 px-4 text-center">
          <PiggyBank className="w-4 h-4 text-[#8A6A55] shrink-0" strokeWidth={1.5} />
          <p className="text-[12px] text-[#6F625A]" style={{ fontFamily: SANS }}>
            Weda solo registra el regalo en tu panel. No cobra comisión ni retiene el dinero.
          </p>
        </div>
      </div>

      {/* Tres garantías */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-[980px] mx-auto">
        {[
          { icon: Percent, title: 'Sin comisión por regalo', text: 'Weda no cobra nada por cada regalo que reciben.' },
          { icon: Landmark, title: 'Dinero directo a tu cuenta', text: 'Por Mercado Pago o transferencia. Nunca pasa por Weda.' },
          { icon: Eye, title: 'Seguimiento de cada regalo', text: 'Ves quién te regaló qué, cuánto y con qué mensaje.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex md:flex-col items-start md:items-center gap-4 md:text-center">
            <span className="w-12 h-12 rounded-full bg-[#2D1A0E] text-white flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[17px] font-semibold text-[#2A1A10] leading-snug">{title}</h3>
              <p className="mt-1.5 text-[14px] text-[#6F625A] leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 5. EJEMPLOS DE REGALOS                                              */
/* ------------------------------------------------------------------ */

const wish = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

interface WishTileData {
  category: string;
  image: string;
  pos: string;
  area: string;
  ratio: string;
  small?: boolean;
}

// Categorías de la lista (sin precios ni nombres de regalo): cada una tiene muchos regalos
// adentro. En escritorio se acomodan en una grilla de 5 columnas x 7 filas donde cada tile
// ocupa celdas exactas, así no quedan huecos. Proporciones de la referencia (1820 x 872):
// columnas 233/460/333/234/461 y filas 370/26/19/25/37/24/371; las filas finas hacen de
// canal entre tiles.
const wishTiles: WishTileData[] = [
  { category: 'Experiencias', image: '/deseo-vino.webp', pos: '50% 60%', area: '1 / 1 / 2 / 2', ratio: 'aspect-[3/4]', small: true },
  { category: 'Viajes', image: '/deseo-escapada.png', pos: '50% 62%', area: '1 / 2 / 2 / 3', ratio: 'aspect-[4/3]' },
  { category: 'Casamiento', image: wish('photo-1537633552985-df8429e8048b'), pos: '50% 50%', area: '1 / 3 / 4 / 4', ratio: 'aspect-[4/5]' },
  { category: 'Luna de miel', image: '/deseo-luna-de-miel.webp', pos: '50% 45%', area: '1 / 4 / 6 / 6', ratio: 'aspect-[4/3]' },
  { category: 'Cenas', image: '/deseo-cena.webp', pos: '50% 78%', area: '3 / 1 / 8 / 3', ratio: 'aspect-[4/3]' },
  { category: 'Casa propia', image: wish('photo-1560518883-ce09059eeffa'), pos: '50% 50%', area: '5 / 3 / 8 / 4', ratio: 'aspect-[3/4]' },
  { category: 'Objetos del hogar', image: '/deseo-cocina.webp', pos: '60% 60%', area: '7 / 4 / 8 / 5', ratio: 'aspect-[1/1]', small: true },
  { category: 'Proyectos personales', image: wish('photo-1565193566173-7a0ee3dbe261'), pos: '50% 50%', area: '7 / 5 / 8 / 6', ratio: 'aspect-[4/3]' },
];

const WishTile: React.FC<{ tile: WishTileData; compact?: boolean; className?: string; style?: React.CSSProperties }> = ({
  tile,
  compact = false,
  className = '',
  style,
}) => {
  const small = compact || tile.small;
  return (
    <div className={`relative overflow-hidden rounded-[6px] ${className}`} style={style}>
      <img
        src={tile.image}
        alt={tile.category}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: tile.pos }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 via-black/25 to-transparent"></div>
      <p
        className={`absolute left-2 bottom-2 md:left-3 md:bottom-3 right-2 text-white leading-tight ${
          small ? 'text-[13px] min-[480px]:max-md:text-[11px]' : 'text-[13px] md:text-[22px]'
        }`}
        style={{ fontFamily: SERIF }}
      >
        {tile.category}
      </p>
    </div>
  );
};

export const GiftExamples: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <section className="bg-[#F4F0EB] px-4 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
    <div className="max-w-[1100px] mx-auto">
      <Eyebrow>Regalos simbólicos</Eyebrow>
      <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
        Una lista para la vida que <em>están armando</em>
      </h2>
      <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
        Luna de miel, viajes, cenas, cosas para el hogar y más. Cada categoría tiene muchos regalos para elegir.
      </p>

      {/* Desde 480 px: la misma estructura de la referencia, sin huecos */}
      <div
        className="mt-8 hidden min-[480px]:grid w-full"
        style={{
          aspectRatio: '1820 / 872',
          gridTemplateColumns: '233fr 460fr 333fr 234fr 461fr',
          gridTemplateRows: '370fr 26fr 19fr 25fr 37fr 24fr 371fr',
          columnGap: '1.32%',
        }}
      >
        {wishTiles.map((t) => (
          <WishTile key={t.category} tile={t} style={{ gridArea: t.area }} />
        ))}
      </div>

      {/* Celular chico: dos columnas con alturas distintas */}
      <div className="mt-8 min-[480px]:hidden columns-2 gap-3">
        {wishTiles.map((t) => (
          <WishTile key={t.category} tile={t} compact className={`mb-3 break-inside-avoid ${t.ratio}`} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button type="button" onClick={onCreate} className={btnDark} style={{ fontFamily: SANS }}>
          Crear mi lista
        </button>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 6. PAREJAS FELICES                                                  */
/* ------------------------------------------------------------------ */

const happyCouples = [
  {
    initials: 'L&T',
    name: 'Lucía & Tomás',
    meta: 'Casados en marzo de 2026',
    quote:
      'Armamos la luna de miel en regalos chicos y cada invitado eligió el suyo. Vimos quién había regalado qué sin perseguir a nadie por WhatsApp. Fue elegante y fue fácil.',
  },
  {
    initials: 'A&N',
    name: 'Agustina & Nicolás',
    meta: 'Casados en noviembre de 2025',
    quote:
      'Mis tíos casi no usan tecnología y regalaron solos desde el celular en un minuto. Nadie nos preguntó cómo se hacía.',
  },
  {
    initials: 'J&M',
    name: 'Julieta & Matías',
    meta: 'Casados en enero de 2026',
    quote:
      'Armamos la lista alrededor de la casa propia y de un curso de cerámica. Se sintió como nosotros, no como un catálogo. Y pudimos agradecerle a cada persona por su nombre.',
  },
];

export const HappyCouples: React.FC = () => {
  const [featured, ...others] = happyCouples;
  return (
    <section className="py-12 sm:py-16 bg-[#F0E8D8] px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">Parejas felices</span>
          <h2 className="text-4xl sm:text-5xl font-normal text-[#2A2318] mt-3">Testimonios con amor.</h2>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 lg:gap-6">
          <figure className="bg-[#2D1A0E] text-[#F5F0EA] rounded-[8px] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="block text-[#A9795A] text-[90px] leading-[0.6] h-[44px]" style={{ fontFamily: SERIF }}>“</span>
              <blockquote className="mt-4 text-[clamp(24px,2.6vw,36px)] leading-[1.2]" style={{ fontFamily: SERIF }}>
                {featured.quote}
              </blockquote>
            </div>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F0E8D8] text-[#2A2318] font-semibold text-xs flex items-center justify-center shrink-0">
                {featured.initials}
              </span>
              <div>
                <p className="text-sm font-semibold">{featured.name}</p>
                <p className="text-xs text-[#F5F0EA]/60">{featured.meta}</p>
              </div>
            </figcaption>
          </figure>

          <div className="grid gap-5 lg:gap-6">
            {others.map((c) => (
              <figure key={c.name} className="bg-white rounded-[8px] p-7 sm:p-8 flex flex-col justify-between">
                <blockquote className="text-[20px] sm:text-[22px] leading-[1.25] text-[#2A2318]" style={{ fontFamily: SERIF }}>
                  “{c.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#F0E8D8] text-[#2A2318] font-semibold text-xs flex items-center justify-center shrink-0">
                    {c.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#2A2318]">{c.name}</p>
                    <p className="text-xs text-[#8A8072]">{c.meta}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
