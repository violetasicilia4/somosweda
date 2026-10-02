import React, { useEffect, useRef, useState } from 'react';
import { WeddingData, WeddingEvent } from '../types';
import { ExampleGifts } from './ExampleGifts';
import { ExampleRsvp } from './ExampleRsvp';
import { ExampleHero } from './ExampleHero';
import { RsvpFormCard } from './RsvpFormCard';
import {
  getMicrositeFeatures,
  DEFAULT_LODGING_INFO,
  DEFAULT_TRANSPORT_INFO,
  DEFAULT_GALLERY_IMAGES,
  buildDefaultHashtag,
} from '../utils/microsite';
import { getStoredWedding, getStoredWeddingEvents } from '../utils/weddingStore';
import { formatLongDate } from '../utils/format';
import { Church, Gem, Landmark, Music, Shirt, Bus, Navigation, ChevronDown, ArrowUpRight } from 'lucide-react';

// Lucide no tiene un ícono de "copas brindando" — se arma a mano, mismo trazo fino que
// el resto de los íconos de línea (Church, Gem, etc.) para que no desentone.
const CheersIcon: React.FC<{ style?: React.CSSProperties; color?: string; strokeWidth?: number }> = ({
  style,
  color = 'currentColor',
  strokeWidth = 1.3,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <g transform="rotate(-18 7 13)">
      <path d="M4.5 20.5h5" />
      <path d="M7 20.5V12.5" />
      <path d="M7 12.5L4.5 4h5L7 12.5Z" />
    </g>
    <g transform="rotate(18 17 13)">
      <path d="M14.5 20.5h5" />
      <path d="M17 20.5V12.5" />
      <path d="M17 12.5L14.5 4h5L17 12.5Z" />
    </g>
    <path d="M9.5 4.5l1-2.3M14.5 4.5l-1-2.3M12 3.2V1" />
  </svg>
);

// Página que se abre con "Ver ejemplo" en la landing. El header y la foto de portada son
// compartidos por las 3 pantallas (ver ExampleHero) para que no cambien de tamaño al
// navegar entre ellas. Lo de acá para abajo (pantalla "Información") sigue en su propio
// sistema de medidas "u": 1u = 1px a 1052px de ancho del viewport, se achica
// proporcionalmente por debajo y no crece por encima.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

const eyebrowStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: u(9.5),
  letterSpacing: '0.08em',
  color: '#6B6B6B',
  lineHeight: 1.2,
};

const headingStyle: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: u(40),
  lineHeight: 1.1,
  color: '#2B2B2B',
  marginTop: u(14),
};

const bodyStyle: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: u(20.8),
  lineHeight: u(26.5),
  color: '#3D3D3D',
  maxWidth: u(392),
  marginTop: u(18),
};

// Hace aparecer con un fade cada bloque de la página la primera vez que entra en pantalla
// al scrollear. Ya no queda ningún bloque "sticky" ni efecto de apilado: todo el scroll de
// la invitación (y el de RSVP/Regalá, que comparten el mismo header) es continuo, uno atrás
// del otro. Clona la sección que recibe como hijo y le mete el ref/estilo directo, en vez de
// envolverla en un <div>, para no agregar una capa extra de DOM.
const Reveal: React.FC<{ children: React.ReactElement<{ style?: React.CSSProperties }> }> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return React.cloneElement(children, {
    ref,
    style: {
      ...children.props.style,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
    },
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> });
};

interface ExampleViewProps {
  // Sirven de fallback: esta vista siempre se abre en una pestaña nueva (ver
  // App.tsx/weddingStore.ts), así que lo real se lee de localStorage — estos props solo
  // se usan si todavía no hay nada guardado ahí (primera vez que se abre en el browser).
  wedding: WeddingData;
  events: WeddingEvent[];
}

export const ExampleView: React.FC<ExampleViewProps> = ({ wedding: fallbackWedding, events: fallbackEvents }) => {
  const [wedding] = useState<WeddingData>(() => getStoredWedding() || fallbackWedding);
  const [events] = useState<WeddingEvent[]>(() => getStoredWeddingEvents() || fallbackEvents);
  const [screen, setScreen] = useState<'home' | 'gifts' | 'rsvp'>(() => {
    if (typeof window === 'undefined') return 'home';
    const requested = new URLSearchParams(window.location.search).get('screen');
    return requested === 'gifts' || requested === 'rsvp' ? requested : 'home';
  });
  // "Ver información" del bloque de hospedaje: abre la recomendación ahí mismo, mismo
  // patrón que "Confirmar asistencia" (nada de navegar a otro lado).
  const [lodgingOpen, setLodgingOpen] = useState(false);
  // El CTA "Confirmar asistencia" de "¿Venís?" abre el formulario ahí mismo, en vez de
  // navegar a la pantalla de RSVP (esa sigue existiendo, vía el botón de arriba del todo).
  const [rsvpInline, setRsvpInline] = useState(false);

  // Tocar un botón de navegación (Invitación / RSVP / Regalá) no solo cambia de pantalla:
  // también te salta directo al contenido de esa sección, pasando la foto de portada. Antes
  // cambiaba la pantalla pero te dejaba parado arriba de la misma foto de siempre, así que
  // tocar "RSVP" o "Regalá" se sentía como que "no pasó nada" hasta que arrastrabas el dedo
  // para descubrir que el formulario/la lista ya estaban ahí abajo. La foto mide 100dvh en
  // las 3 pantallas, así que alcanza con scrollear a esa altura — no hace falta esperar a
  // que termine de renderizar la pantalla nueva.
  const handleNavigate = (next: 'home' | 'gifts' | 'rsvp') => {
    setScreen(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  if (screen === 'gifts') {
    return <ExampleGifts onNavigate={handleNavigate} />;
  }

  if (screen === 'rsvp') {
    return <ExampleRsvp onNavigate={handleNavigate} />;
  }

  // Lo que está tildado en "Tu sitio" (módulo a módulo), con el orden fijo en el que
  // aparece acá abajo. Nada se saca de "Tu sitio" en el panel del organizador — sólo se
  // agrega o se saca de este sitio de ejemplo, que es lo que ven los invitados.
  const features = getMicrositeFeatures(wedding);
  const eventList = events.length > 0 ? events : [];
  const galleryImages = wedding.galleryImages && wedding.galleryImages.length > 0
    ? wedding.galleryImages
    : DEFAULT_GALLERY_IMAGES;

  const sections: Record<string, React.ReactNode> = {
    giftRegistry: (
      <Reveal key="giftRegistry">
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: '34vh', padding: `${u(28)} ${u(24)}`, backgroundColor: '#FFFFFF' }}
        >
          <h2 className="font-normal" style={{ ...headingStyle, fontSize: u(54), marginTop: 0 }}>¡Nos casamos!</h2>
          <p style={{ ...bodyStyle, fontSize: u(23), lineHeight: u(30), maxWidth: u(440), marginTop: u(16) }}>
            Queremos compartir este momento con ustedes.
          </p>
          <p
            className="uppercase"
            style={{ fontFamily: SANS, fontSize: u(12.5), letterSpacing: '0.1em', color: '#6B6B6B', marginTop: u(18) }}
          >
            {formatLongDate(wedding.weddingDate)}
          </p>
        </section>
      </Reveal>
    ),


    cronograma: (
      <Reveal key="cronograma">
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 items-stretch gap-y-4 sm:gap-y-0" style={{ backgroundColor: '#F3F3EA' }}>
        {/* Izquierda: foto de la pareja de fondo (misma foto del hero, con otro encuadre) —
            con "items-stretch" en la grilla de arriba, este panel se estira al alto de la
            columna derecha (más alta, por la lista de eventos), así que la foto cubre todo
            ese alto. En mobile (apiladas en una columna) el "gap-y-4" separa la foto de la
            tarjeta de abajo — antes quedaban pegadas. */}
        <div className="relative overflow-hidden" style={{ minHeight: u(220) }}>
          <img
            src="/cronograma-flores.webp"
            alt="Ramo de novia"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Derecha: el cronograma. padding-top responsive aparte (no en el "u" fluido): 0 en
            mobile para la cuenta de arriba, un valor fijo normal desde el breakpoint sm en
            adelante donde las columnas ya están lado a lado y no hace falta ese ajuste. */}
        <div
          className="flex flex-col items-center text-center pt-0 sm:pt-10 sm:justify-center pb-5 sm:pb-[calc(48*var(--u))]"
          style={{ backgroundColor: '#F3F3EA', paddingLeft: u(24), paddingRight: u(24) }}
        >
          {/* "Hoja de papel": tarjeta blanca con sombra suave que contiene el resumen de
              íconos + la lista de eventos, apoyada sobre el fondo papel de la columna. */}
          <div
            className="w-full"
            style={{
              maxWidth: u(460),
              backgroundColor: '#FFFFFF',
              borderRadius: u(6),
              boxShadow: '0 1px 3px rgba(28, 16, 5, 0.06), 0 12px 32px rgba(28, 16, 5, 0.08)',
              padding: `${u(32)} ${u(28)}`,
            }}
          >
          {/* Caja con un ícono por tipo de evento, como resumen rápido arriba de la lista */}
          <div
            className="flex items-center justify-evenly w-full"
            style={{ border: '1px solid #D8E3EC', borderRadius: u(4), padding: `${u(18)} ${u(32)}` }}
          >
            {eventList.map((ev) => {
              const Icon = ev.iconType === 'church' ? Church : ev.iconType === 'ring' ? Gem : ev.iconType === 'civil' ? Landmark : CheersIcon;
              return <Icon key={ev.id} style={{ width: u(22), height: u(22) }} color="#3D3D3D" strokeWidth={1.3} />;
            })}
          </div>

          {/* Lista vertical, un bloque por evento con su ícono, separados por una línea */}
          <div className="w-full text-left mx-auto" style={{ marginTop: u(12) }}>
            {eventList.map((ev, i) => {
              const Icon = ev.iconType === 'church' ? Church : ev.iconType === 'ring' ? Gem : ev.iconType === 'civil' ? Landmark : CheersIcon;
              return (
                <div key={ev.id}>
                  <div className="flex items-start" style={{ gap: u(20), paddingTop: u(32), paddingBottom: u(32) }}>
                    <span className="shrink-0 flex items-center justify-center" style={{ width: u(40), height: u(40) }}>
                      <Icon style={{ width: u(26), height: u(26) }} color="#3D3D3D" strokeWidth={1.3} />
                    </span>
                    <div>
                      <h3
                        className="uppercase font-semibold"
                        style={{ fontFamily: SANS, fontSize: u(14), letterSpacing: '0.04em', color: '#2B2B2B' }}
                      >
                        {ev.title}
                      </h3>
                      <p style={{ fontFamily: SANS, fontSize: u(13), color: '#3D3D3D', marginTop: u(10), lineHeight: 1.6 }}>
                        {ev.date}<br />{ev.time}
                      </p>
                      <p style={{ fontFamily: SANS, fontSize: u(13), color: '#3D3D3D', marginTop: u(8) }}>{ev.locationName}</p>
                      {ev.address && (
                        <p style={{ fontFamily: SANS, fontSize: u(13), color: '#3D3D3D', marginTop: u(2), lineHeight: 1.5 }}>{ev.address}</p>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address || ev.locationName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uppercase inline-flex items-center hover:opacity-70 transition-opacity"
                        style={{
                          fontFamily: SANS,
                          fontSize: u(10.5),
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          color: '#16283D',
                          marginTop: u(10),
                          gap: u(4),
                          borderBottom: '1px solid #16283D',
                          paddingBottom: u(2),
                        }}
                      >
                        Ver mapa
                        <ArrowUpRight style={{ width: u(12), height: u(12) }} strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                  {i < eventList.length - 1 && <div style={{ borderTop: '1px solid #D8E3EC' }} />}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>
      </Reveal>
    ),

    giftAndRsvp: (() => {
      const showGift = features.giftRegistry;
      const showRsvp = features.events && features.rsvp;
      return (
      <Reveal key="giftAndRsvp">
      <section className="w-full grid grid-cols-1 items-stretch">
        {/* Arriba: "¿Venís?" / confirmar asistencia. */}
        {showRsvp && (
        <div
          className={`flex flex-col items-center justify-center text-center ${rsvpInline ? 'sm:min-h-[78vh]' : 'min-h-[42vh] sm:min-h-[78vh]'}`}
          style={{ backgroundColor: '#FFFFFF', padding: `${u(40)} ${u(28)}` }}
        >
          <h2 className="font-normal text-[56px] sm:text-[calc(50*var(--u))]" style={{ ...headingStyle, fontSize: undefined, marginTop: 0 }}>¿Venís?</h2>
          <p style={{ fontFamily: SANS, fontSize: u(17.5), lineHeight: u(25), color: '#6B6B6B', marginTop: u(12) }}>
            Confirmá tu asistencia, es importante.
          </p>

          {rsvpInline ? (
            <>
              <RsvpFormCard u={u} />
              <button
                type="button"
                onClick={() => setRsvpInline(false)}
                className="uppercase cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: SANS,
                  fontSize: u(11),
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#1E3A5F',
                  marginTop: u(18),
                }}
              >
                Cerrar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setRsvpInline(true)}
              className="uppercase cursor-pointer"
              style={{
                fontFamily: SANS,
                fontSize: u(15),
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: '#F5F0EA',
                backgroundColor: '#16283D',
                padding: `${u(18)} ${u(40)}`,
                borderRadius: u(999),
                marginTop: u(28),
              }}
            >
              Confirmar asistencia
            </button>
          )}
        </div>
        )}

        {/* Abajo: "¿Nos querés sorprender?" / lista de regalos. */}
        {showGift && (
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: '#16283D', padding: `${u(64)} ${u(28)}` }}
        >
          <h2 className="font-normal text-[42px] sm:text-[calc(56*var(--u))]" style={{ ...headingStyle, fontSize: undefined, color: '#F5F0EA', marginTop: 0 }}>¿Nos querés sorprender?</h2>
          <p style={{ fontFamily: SANS, fontSize: u(18), lineHeight: u(26), maxWidth: u(360), color: '#F5F0EA', marginTop: u(12) }}>
            Armamos una lista con algunas ideas.
          </p>
          <button
            type="button"
            onClick={() => handleNavigate('gifts')}
            className="uppercase cursor-pointer"
            style={{
              fontFamily: SANS,
              fontSize: u(13),
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#16283D',
              backgroundColor: '#F5F0EA',
              padding: `${u(15)} ${u(30)}`,
              borderRadius: u(2),
              marginTop: u(24),
            }}
          >
            Ver lista de regalos
          </button>
        </div>
        )}
      </section>
      </Reveal>
      );
    })(),

    dressCode: (
      <Reveal key="dressCode">
      <section
        className="flex flex-col items-center justify-center text-center"
        style={{ minHeight: '42vh', padding: `${u(40)} ${u(24)}`, backgroundColor: '#FBF9F5' }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{ width: u(44), height: u(44), borderRadius: '50%', backgroundColor: '#E7EEF4', color: '#3D3D3D' }}
        >
          <Shirt style={{ width: u(19), height: u(19) }} />
        </span>
        <span className="uppercase" style={{ ...eyebrowStyle, marginTop: u(16) }}>Dress code</span>
        <h2 className="font-normal" style={{ ...headingStyle, marginTop: u(8) }}>
          {wedding.dressCode || 'Elegante / Cocktail'}
        </h2>
      </section>
      </Reveal>
    ),

    gallery: (
      <Reveal key="gallery">
        <section className="w-full bg-[#FBF9F5]">
          {/* Galería a pantalla completa: sin texto, sin padding ni límite de ancho, las
              fotos van de borde a borde. */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {galleryImages.slice(0, 8).map((img, i) => (
              <div key={i} className="overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                <img src={img} alt={`Recuerdo ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    ),

    hashtag: (
      <Reveal key="hashtag">
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: '40vh', padding: `${u(24)} ${u(24)}`, backgroundColor: '#FFFFFF' }}
        >
          <h2
            className="font-normal"
            style={{ fontFamily: SERIF, fontSize: u(58), lineHeight: 1, color: '#2B2B2B' }}
          >
            {wedding.hashtag || buildDefaultHashtag(wedding.partner1, wedding.partner2)}
          </h2>
          <p
            className="uppercase"
            style={{ fontFamily: SANS, fontSize: u(12.5), letterSpacing: '0.04em', color: '#6B6B6B', marginTop: u(14) }}
          >
            Copate con las fotitos
          </p>
        </section>
      </Reveal>
    ),

    lodging: (
        <Reveal key="lodging">
        <section
          className="relative w-full flex flex-col items-center justify-center text-center"
          style={{ minHeight: '42vh', backgroundColor: '#16283D', padding: `${u(56)} ${u(24)}` }}
        >
          <h2 className="font-normal" style={{ ...headingStyle, color: '#F5F0EA', marginTop: 0 }}>
            Dónde hospedarse
          </h2>
          <p className="italic" style={{ fontFamily: SERIF, fontSize: u(20), color: '#B5B5B5', marginTop: u(8) }}>
            (Nuestra recomendación)
          </p>

          {lodgingOpen ? (
            <p style={{ fontFamily: SANS, fontSize: u(16), lineHeight: u(23), color: '#F5F0EA', marginTop: u(20), maxWidth: u(380) }}>
              {wedding.lodgingInfo || DEFAULT_LODGING_INFO}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setLodgingOpen(true)}
              className="uppercase cursor-pointer inline-flex items-center"
              style={{
                fontFamily: SANS,
                fontSize: u(13),
                fontWeight: 600,
                letterSpacing: '0.03em',
                gap: u(6),
                color: '#16283D',
                backgroundColor: '#F5F0EA',
                padding: `${u(13)} ${u(24)}`,
                borderRadius: u(999),
                marginTop: u(24),
              }}
            >
              Ver información
              <ChevronDown style={{ width: u(14), height: u(14) }} />
            </button>
          )}
        </section>
        </Reveal>
    ),

    locationTransport: (
        <Reveal key="locationTransport">
        <section
          className="w-full flex flex-col items-center justify-center text-center"
          style={{ minHeight: '45vh', padding: `${u(48)} ${u(24)}`, backgroundColor: '#FFFFFF' }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 w-full"
            style={{ maxWidth: u(600), rowGap: u(36), columnGap: u(32) }}
          >
            {[
              { icon: Navigation, label: 'Ubicación', value: wedding.mapLocation || `${wedding.venue || 'Estancia La Linda'}, ${wedding.city || 'Pilar, Buenos Aires'}` },
              { icon: Bus, label: 'Transporte', value: wedding.transportInfo || DEFAULT_TRANSPORT_INFO },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <span
                  className="inline-flex items-center justify-center"
                  style={{ width: u(40), height: u(40), borderRadius: '50%', backgroundColor: '#E7EEF4', color: '#3D3D3D' }}
                >
                  <Icon style={{ width: u(17), height: u(17) }} />
                </span>
                <span className="uppercase" style={{ ...eyebrowStyle, marginTop: u(14) }}>{label}</span>
                <h2
                  className="font-normal"
                  style={{ fontFamily: SERIF, fontSize: u(22), lineHeight: 1.35, color: '#2B2B2B', marginTop: u(8) }}
                >
                  {value}
                </h2>
              </div>
            ))}
          </div>
        </section>
        </Reveal>
    ),

    music: (
      <Reveal key="music">
        <section
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: '48vh', padding: `${u(24)} ${u(24)} ${u(56)}`, backgroundColor: '#FBF9F5' }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: u(44), height: u(44), borderRadius: '50%', backgroundColor: '#16283D', color: '#fff' }}
          >
            <Music style={{ width: u(19), height: u(19) }} />
          </span>
          <h2 className="font-normal" style={{ ...headingStyle, marginTop: u(18) }}>Tu música, nuestra playlist</h2>
          <p style={{ ...bodyStyle, fontSize: u(17.5), lineHeight: u(25) }}>
            ¿Qué tema no puede faltar en la fiesta? Contanos y lo sumamos.
          </p>
        </section>
      </Reveal>
    ),
  };

  // El sistema "u" escalaba todo en proporción lineal al ancho del viewport, sin piso — por
  // debajo de los ~790px el texto se iba achicando de más (el cuerpo llegaba a ~7px en un
  // celular de 375px), ilegible. clamp() le pone un piso a partir de ahí: el layout/las
  // fotos se siguen achicando, pero el texto no baja de un tamaño legible.
  //
  // Orden de las secciones: en vez del orden fijo de "Tu sitio" (MICROSITE_SECTION_ORDER),
  // acá van ordenadas por qué tan usado está cada elemento en micrositios reales (ranking
  // sobre una muestra de 30 sitios) — primero lo que casi todos usan (regalos, cronograma,
  // RSVP), al final lo más raro. "¡Nos casamos!" queda primero igual, como intro de la
  // página (no es un "elemento" del ranking, es el saludo inicial).
  const orderedKeys: { key: string; show: boolean }[] = [
    { key: 'cronograma', show: features.events }, // #2 Info de ceremonia/fiesta
    // #1 y #4: "¿Nos querés sorprender?" (regalos) y "¿Venís?" (RSVP) van juntos en un
    // mismo bloque partido a la mitad, uno de cada lado — debajo de Cronograma.
    { key: 'giftAndRsvp', show: features.giftRegistry || (features.events && features.rsvp) },
    { key: 'music', show: features.music }, // #5 Playlist colaborativa
    { key: 'dressCode', show: features.events }, // #6 Dress code
    { key: 'lodging', show: features.guestInfo }, // #9 Hoteles / alojamiento cercano
    { key: 'hashtag', show: features.hashtag }, // #10 Hashtag para fotos
    { key: 'gallery', show: features.gallery }, // (fotos, va junto al hashtag)
    { key: 'locationTransport', show: features.guestInfo }, // #11 Transporte
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5]" style={{ ['--u' as string]: 'clamp(0.66px, 0.09506vw, 1px)' }}>
      <ExampleHero active="home" onNavigate={handleNavigate} />

      {features.giftRegistry && sections.giftRegistry}
      {orderedKeys.filter(({ show }) => show).map(({ key }) => sections[key])}
    </div>
  );
};
