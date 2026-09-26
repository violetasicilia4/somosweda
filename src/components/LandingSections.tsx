import React from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Landmark,
  PiggyBank,
  Users,
} from 'lucide-react';
import { durationOptions } from '../data/initialData';
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
  { src: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80', pos: '50% 50%' },
];

const VisualWishes: React.FC = () => (
  <div className="rounded-[6px] bg-[#E9DFD3] p-4 h-[300px] grid grid-cols-3 gap-2 place-content-center justify-items-center [container-type:inline-size]">
    {circleImages.map((c, i) =>
      c ? (
        <img
          key={i}
          src={c.src}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-[min(27cqw,84px)] aspect-square rounded-full object-cover"
          style={{ objectPosition: c.pos }}
        />
      ) : (
        <span key={i} className="w-[min(27cqw,84px)] aspect-square rounded-full bg-[#2D1A0E] text-white flex items-center justify-center">
          <Gift className="w-6 h-6" strokeWidth={1.4} />
        </span>
      )
    )}
  </div>
);

// Tarjeta 2: polaroids inclinadas con regalos de ejemplo
const polaroids = [
  { src: houseImg, label: 'Casa propia', pos: '50% 50%' },
  { src: '/deseo-luna-de-miel.webp', label: 'Luna de miel', pos: '50% 50%' },
  { src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80', label: 'Auto nuevo', pos: '50% 55%' },
];

const polaroidPos = [
  'left-[6%] top-[4%] rotate-[-7deg]',
  'right-[6%] top-[22%] rotate-[6deg]',
  'left-[8%] bottom-[3%] rotate-[-3deg]',
];

const VisualMoney: React.FC = () => (
  <div className="rounded-[6px] bg-[#E5D3C4] h-[300px] overflow-hidden relative">
    {polaroids.map((p, i) => (
      <div key={p.label} className={`absolute w-[41%] bg-white p-1.5 pb-0 rounded-[3px] shadow-[0_6px_16px_rgba(45,26,14,0.15)] ${polaroidPos[i]}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={p.src}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ objectPosition: p.pos }}
          />
        </div>
        <p className="text-[11px] text-[#2A1A10] font-semibold py-2" style={{ fontFamily: SANS }}>{p.label}</p>
      </div>
    ))}
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
  <div className="rounded-[6px] bg-[#EAD9BE] h-[300px] flex items-center justify-center p-3">
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
    <section id="como-funciona" className="scroll-mt-20 bg-white px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
          Todos tus regalos en <em>una sola lista</em>
        </h2>
        <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[520px] mx-auto leading-relaxed">
          Compartí un solo link con tus invitados y seguí todo desde tu panel.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {cards.map((c) => (
            <div key={c.title} className="bg-[#F4F0EB] rounded-[8px] px-5 sm:px-6 pt-8 pb-9 flex flex-col">
              <h3 className="text-center font-normal text-[#2A1A10] text-[26px] leading-[1.1] min-h-[58px] flex items-center justify-center text-balance" style={{ fontFamily: SERIF }}>
                {c.title}
              </h3>
              <div className="mt-6">{c.visual}</div>
              <p className="mt-6 text-center text-[15px] text-[#5A4C43] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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
  <section className="bg-[#ECE6DF] px-4 sm:px-8 py-16 sm:py-24">
    <div className="max-w-[1100px] mx-auto">
      <Eyebrow>Dinero y confianza</Eyebrow>
      <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
        El dinero va <em>directo a tu cuenta</em>
      </h2>
      <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
        Weda no toca tu plata: tus invitados pagan y vos ves cada regalo reflejado en tu panel.
      </p>

      {/* Flujo del dinero */}
      <div className="mt-12 max-w-[820px] mx-auto">
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
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 5. EJEMPLOS DE REGALOS                                              */
/* ------------------------------------------------------------------ */

const wish = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

interface WishTileData {
  category: string;
  name: string;
  price: number;
  image: string;
  pos: string;
  area: string;
  ratio: string;
  small?: boolean;
}

// Fotos y montos de ejemplo. En escritorio se acomodan en una grilla de 5 columnas x 7 filas
// donde cada tile ocupa celdas exactas, así no quedan huecos. Proporciones de la referencia
// (1820 x 872): columnas 233/460/333/234/461 y filas 370/26/19/25/37/24/371; las filas finas
// hacen de canal entre tiles.
const wishTiles: WishTileData[] = [
  { category: 'Noches de vino', name: 'Degustación en Mendoza', price: 85000, image: '/deseo-vino.webp', pos: '50% 60%', area: '1 / 1 / 2 / 2', ratio: 'aspect-[3/4]', small: true },
  { category: 'Escapadas', name: 'Fin de semana en las sierras', price: 320000, image: '/deseo-escapada.png', pos: '50% 62%', area: '1 / 2 / 2 / 3', ratio: 'aspect-[4/3]' },
  { category: 'Deco hogar', name: 'Mesa ratona de nogal', price: 140000, image: '/deseo-deco.webp', pos: '30% 50%', area: '1 / 3 / 4 / 4', ratio: 'aspect-[4/5]' },
  { category: 'Joyería', name: 'Pulsera de plata', price: 180000, image: '/deseo-joyeria.png', pos: '50% 38%', area: '1 / 4 / 6 / 6', ratio: 'aspect-[4/3]' },
  { category: 'Cenas de a dos', name: 'Cena romántica para dos', price: 120000, image: '/deseo-cena.webp', pos: '50% 78%', area: '3 / 1 / 8 / 3', ratio: 'aspect-[4/3]' },
  { category: 'Nuestra casa', name: 'Para nuestra casa propia', price: 1500000, image: wish('photo-1560518883-ce09059eeffa'), pos: '50% 50%', area: '5 / 3 / 8 / 4', ratio: 'aspect-[3/4]' },
  { category: 'Objetos de cocina', name: 'Batidora de pie', price: 450000, image: '/deseo-cocina.webp', pos: '60% 60%', area: '7 / 4 / 8 / 5', ratio: 'aspect-[1/1]', small: true },
  { category: 'Luna de miel', name: 'Noches en el lago de Como', price: 900000, image: '/deseo-luna-de-miel.webp', pos: '50% 50%', area: '7 / 5 / 8 / 6', ratio: 'aspect-[4/3]' },
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
        alt={tile.name}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: tile.pos }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="absolute inset-x-0 bottom-0 px-2 pb-2 md:px-3 md:pb-3 text-white" style={{ fontFamily: SANS }}>
        {!small && <p className="hidden md:block uppercase text-[9px] tracking-[0.1em] text-white/75">{tile.category}</p>}
        <p
          className={`leading-tight mt-0.5 ${small ? 'text-[11px] min-[480px]:max-md:text-[10px] md:text-[13px]' : 'text-[11px] md:text-[19px]'}`}
          style={{ fontFamily: SERIF }}
        >
          {tile.name}
        </p>
        <p className={`mt-1 whitespace-nowrap text-white/90 ${small ? 'text-[10px] min-[480px]:max-md:text-[8px] md:text-[11px]' : 'text-[9px] md:text-[11px]'}`}>{formatARS(tile.price)}</p>
      </div>
    </div>
  );
};

export const GiftExamples: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <section className="bg-[#F4F0EB] px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
    <div className="max-w-[1100px] mx-auto">
      <Eyebrow>Ejemplos de regalos</Eyebrow>
      <h2 className={h2Serif} style={{ fontFamily: SERIF }}>
        Una lista para la vida que <em>están armando</em>
      </h2>
      <p className="mt-4 text-center text-[15px] text-[#6F625A] max-w-[560px] mx-auto leading-relaxed">
        Cada regalo tiene su nombre y su precio. Tus invitados eligen el que quieran y te lo regalan.
      </p>

      {/* Desde 480 px: la misma estructura de la referencia, sin huecos */}
      <div
        className="mt-12 hidden min-[480px]:grid w-full"
        style={{
          aspectRatio: '1820 / 872',
          gridTemplateColumns: '233fr 460fr 333fr 234fr 461fr',
          gridTemplateRows: '370fr 26fr 19fr 25fr 37fr 24fr 371fr',
          columnGap: '1.32%',
        }}
      >
        {wishTiles.map((t) => (
          <WishTile key={t.name} tile={t} style={{ gridArea: t.area }} />
        ))}
      </div>

      {/* Celular chico: dos columnas con alturas distintas */}
      <div className="mt-10 min-[480px]:hidden columns-2 gap-3">
        {wishTiles.map((t) => (
          <WishTile key={t.name} tile={t} compact className={`mb-3 break-inside-avoid ${t.ratio}`} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>
        Regalos y precios de ejemplo.
      </p>
      <div className="mt-6 text-center">
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
      'Dividimos la luna de miel en regalos chicos y cada invitado eligió el que quería. Fue muchísimo más fácil que pedir plata de frente.',
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
      'Cada regalo aparecía con nombre y mensaje. Pudimos agradecer a cada persona sin llevar ninguna planilla.',
  },
];

export const HappyCouples: React.FC = () => (
  <section className="py-16 sm:py-24 bg-[#F0E8D8] px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="mb-14">
        <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">Parejas felices</span>
        <h2 className="text-3xl sm:text-4xl font-normal text-[#2A2318] mt-3">Testimonios con amor.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2A2318]/15 border-t border-[#2A2318]/15">
        {happyCouples.map((c, i) => (
          <div key={c.name} className={`pt-8 ${i === 0 ? 'md:pr-8' : i === 1 ? 'md:px-8' : 'md:pl-8'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2A2318] font-semibold text-xs shrink-0">
                {c.initials}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#2A2318]">{c.name}</h4>
                <p className="text-xs text-[#8A8072]">{c.meta}</p>
              </div>
            </div>
            <p className="text-sm text-[#5A5142] leading-relaxed">{c.quote}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 8. PREGUNTAS FRECUENTES                                             */
/* ------------------------------------------------------------------ */

const priceLine = durationOptions.map((o) => `${o.months} meses ${formatARS(o.price)}`).join(', ');

export const faqItems = [
  {
    q: '¿Cómo recibimos el dinero?',
    a: 'Tus invitados pagan con Mercado Pago o por transferencia bancaria, directo a tu cuenta. El dinero no pasa por Weda: Weda nunca lo toca ni lo retiene.',
  },
  {
    q: '¿Tiene comisión?',
    a: 'No. Weda no cobra comisión por regalo. El pago es único y todo lo que tus invitados te regalan es tuyo.',
  },
  {
    q: '¿Mis invitados necesitan una cuenta?',
    a: 'No. Entran con el enlace, eligen un regalo y lo pagan en menos de un minuto. Si querés, también pueden confirmar su asistencia desde ahí.',
  },
  {
    q: '¿Cómo sé quién me regaló qué?',
    a: 'Cada regalo queda registrado en tu panel, en Regalos, con el nombre del invitado, el regalo elegido, el monto y su mensaje. Desde ahí también podés agradecerle.',
  },
  {
    q: '¿Qué pasa si alguien no sube comprobante?',
    a: 'No pasa nada: el comprobante es opcional. El regalo queda como pendiente en tu panel hasta que confirmás en tu cuenta que el pago llegó, y ahí lo marcás como confirmado.',
  },
  {
    q: '¿Qué puedo pedir como regalo?',
    a: 'Lo que quieran construir juntos: la luna de miel, cosas para el hogar, proyectos futuros como la casa propia, experiencias o regalos simbólicos desde un monto chico. Vos armás la lista y ponés el monto de cada regalo.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: `Es un pago único, según cuánto tiempo querés mantener tu lista activa: ${priceLine}. Sin suscripción y sin comisión por regalo.`,
  },
  {
    q: '¿Qué pasa cuando vence mi lista?',
    a: 'Elegís la duración al publicar y siempre ves la fecha exacta de vencimiento. Al llegar a esa fecha, tu lista deja de estar visible para tus invitados.',
  },
  {
    q: '¿Es seguro?',
    a: 'Tus invitados no dejan datos de pago en Weda: pagan directo a tu cuenta. Y tu lista es privada, en borrador, hasta que decidís publicarla.',
  },
  {
    q: '¿Cómo contacto a soporte?',
    a: 'Escribinos a hola@weda.com.ar. Respondemos de lunes a viernes de 9 a 18 hs.',
  },
];

export const Faq: React.FC<{ openIndex: number | null; onToggle: (i: number) => void }> = ({ openIndex, onToggle }) => (
  <section id="preguntas" className="scroll-mt-20 bg-white px-4 sm:px-8 py-16 sm:py-24">
    <div className="max-w-[760px] mx-auto">
      <Eyebrow>Preguntas frecuentes</Eyebrow>
      <h2 className="text-center text-3xl sm:text-[40px] sm:leading-[1.15] font-normal text-[#2A1A10] text-balance">
        Sin letra chica.
      </h2>
      <div className="mt-12 border-t border-[#E9E8E4]">
        {faqItems.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="border-b border-[#E9E8E4]">
              <button
                type="button"
                onClick={() => onToggle(i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer"
              >
                <span className="text-[17px] text-[#2A1A10]">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8A6A55] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  strokeWidth={1.5}
                />
              </button>
              {open && <p className="pb-6 -mt-1 text-[15px] text-[#6F625A] leading-relaxed max-w-[640px]">{item.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
