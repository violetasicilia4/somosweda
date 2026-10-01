import React, { useEffect, useRef, useState } from 'react';
import { WeddingData, WeddingEvent } from '../types';
import { ExampleGifts } from './ExampleGifts';
import { ExampleRsvp } from './ExampleRsvp';
import { ExampleBackButton } from './ExampleBackButton';
import { ExampleHero } from './ExampleHero';
import {
  getMicrositeFeatures,
  MICROSITE_SECTION_ORDER,
  DEFAULT_LODGING_INFO,
  DEFAULT_TRANSPORT_INFO,
  DEFAULT_GALLERY_IMAGES,
} from '../utils/microsite';
import { getStoredWedding, getStoredWeddingEvents } from '../utils/weddingStore';
import { Church, Gem, Landmark, Music, Shirt, Hotel, Bus, Navigation } from 'lucide-react';

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
  fontSize: u(8),
  letterSpacing: '0.08em',
  color: '#786C63',
  lineHeight: 1.2,
};

const headingStyle: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: u(34),
  lineHeight: 1.1,
  color: '#1C1005',
  marginTop: u(14),
};

const bodyStyle: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: u(20.8),
  lineHeight: u(26.5),
  color: '#463936',
  maxWidth: u(392),
  marginTop: u(18),
};

// Hace aparecer con un fade cada bloque de la página la primera vez que entra en pantalla
// al scrollear. Cada bloque de adentro es "position: sticky" (ver más abajo, el efecto de
// ir apilando una sección por encima de la anterior) — un sticky solo puede "pegarse" si su
// contenedor directo es más alto que él mismo, así que esto NO puede envolver la sección en
// un <div> propio (quedaría del mismo alto exacto que la sección, sin margen para pegarse, y
// rompería el apilado). Por eso clona la sección que recibe como hijo y le mete el ref/estilo
// directo, en vez de agregar un wrapper.
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

  if (screen === 'gifts') {
    return (
      <>
        <ExampleGifts onNavigate={setScreen} />
        <ExampleBackButton />
      </>
    );
  }

  if (screen === 'rsvp') {
    return (
      <>
        <ExampleRsvp onNavigate={setScreen} />
        <ExampleBackButton />
      </>
    );
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
          className="sticky top-0 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '79vh', padding: `${u(58)} ${u(24)}`, backgroundColor: '#FBF9F5' }}
        >
          <h2 className="font-normal" style={{ ...headingStyle, marginTop: 0 }}>¡Nos casamos!</h2>
          <p style={bodyStyle}>
            Queremos compartir este camino con ustedes.
          </p>
        </section>
      </Reveal>
    ),

    giftCta: (
      <Reveal key="giftCta">
        <section
          className="sticky top-0 relative w-full flex items-center justify-center"
          style={{ minHeight: '85vh', backgroundColor: '#2D1A0E' }}
        >
          <div className="relative flex flex-col items-center text-center" style={{ padding: `${u(24)} ${u(24)}` }}>
            <h2 className="font-normal" style={{ ...headingStyle, color: '#F5F0EA' }}>¿Nos querés sorprender?</h2>
            <p style={{ ...bodyStyle, fontSize: u(15.5), lineHeight: u(22), color: '#F5F0EA' }}>
              Armamos una lista con algunas ideas, por si querés darnos una mano con lo que viene.
            </p>
            <button
              type="button"
              onClick={() => setScreen('gifts')}
              className="uppercase cursor-pointer"
              style={{
                fontFamily: SANS,
                fontSize: u(11),
                letterSpacing: '0.04em',
                color: '#2A1A0D',
                backgroundColor: '#F5F0EA',
                padding: `${u(13)} ${u(28)}`,
                borderRadius: u(2),
                marginTop: u(24),
              }}
            >
              Ver lista de regalos
            </button>
          </div>
        </section>
      </Reveal>
    ),

    events: (
      <React.Fragment key="events">
      <Reveal>
      <section className="sticky top-0 w-full grid grid-cols-1 sm:grid-cols-2 items-stretch sm:min-h-[85vh]">
        {/* Izquierda: panel liso color papel, sin foto, con "Cronograma" en cursiva al centro.
            Padding simétrico arriba/abajo para que quede centrado dentro de este bloque.
            En mobile (columnas apiladas), el bloque de al lado arranca con padding-top 0
            (ver pt-0 sm:pt-* ahí abajo) — así el borde inferior de ESTE bloque queda pegado
            a la barra de íconos, y "Cronograma" termina centrado entre el borde superior
            blanco y la barra de íconos, sin tener que calcular nada entre los dos bloques. */}
        <div
          className="relative flex items-center justify-center"
          style={{ backgroundColor: '#FFFFFF', padding: `${u(32)} ${u(24)}` }}
        >
          <span className="italic font-normal" style={{ fontFamily: SERIF, fontSize: u(32), color: '#1C1005' }}>
            Cronograma
          </span>
        </div>

        {/* Derecha: el cronograma. padding-top responsive aparte (no en el "u" fluido): 0 en
            mobile para la cuenta de arriba, un valor fijo normal desde el breakpoint sm en
            adelante donde las columnas ya están lado a lado y no hace falta ese ajuste. */}
        <div
          className="flex flex-col items-center text-center bg-white pt-0 sm:pt-10 sm:justify-center"
          style={{ paddingLeft: u(32), paddingRight: u(32), paddingBottom: u(48) }}
        >
          {/* Caja con un ícono por tipo de evento, como resumen rápido arriba de la lista */}
          <div
            className="flex items-center justify-evenly w-full"
            style={{ maxWidth: u(420), border: '1px solid #E4DCCF', borderRadius: u(4), padding: `${u(18)} ${u(32)}` }}
          >
            {eventList.map((ev) => {
              const Icon = ev.iconType === 'church' ? Church : ev.iconType === 'ring' ? Gem : ev.iconType === 'civil' ? Landmark : CheersIcon;
              return <Icon key={ev.id} style={{ width: u(22), height: u(22) }} color="#463936" strokeWidth={1.3} />;
            })}
          </div>

          {/* Lista vertical, un bloque por evento con su ícono, separados por una línea */}
          <div className="w-full text-left mx-auto" style={{ maxWidth: u(420), marginTop: u(12) }}>
            {eventList.map((ev, i) => {
              const Icon = ev.iconType === 'church' ? Church : ev.iconType === 'ring' ? Gem : ev.iconType === 'civil' ? Landmark : CheersIcon;
              return (
                <div key={ev.id}>
                  <div className="flex items-start" style={{ gap: u(20), paddingTop: u(32), paddingBottom: u(32) }}>
                    <span className="shrink-0 flex items-center justify-center" style={{ width: u(40), height: u(40) }}>
                      <Icon style={{ width: u(26), height: u(26) }} color="#463936" strokeWidth={1.3} />
                    </span>
                    <div>
                      <h3
                        className="uppercase font-semibold"
                        style={{ fontFamily: SANS, fontSize: u(14), letterSpacing: '0.04em', color: '#1C1005' }}
                      >
                        {ev.title}
                      </h3>
                      <p style={{ fontFamily: SANS, fontSize: u(13), color: '#463936', marginTop: u(10), lineHeight: 1.6 }}>
                        {ev.date}<br />{ev.time}
                      </p>
                      <p style={{ fontFamily: SANS, fontSize: u(13), color: '#463936', marginTop: u(8) }}>{ev.locationName}</p>
                      {ev.address && (
                        <p style={{ fontFamily: SANS, fontSize: u(13), color: '#463936', marginTop: u(2), lineHeight: 1.5 }}>{ev.address}</p>
                      )}
                    </div>
                  </div>
                  {i < eventList.length - 1 && <div style={{ borderTop: '1px solid #E4DCCF' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Dress code como sección propia, justo después del Cronograma — antes vivía
          adentro de "Guía para invitados", lo sacamos de ahí (ver más abajo). */}
      <Reveal>
      <section
        className="sticky top-0 flex flex-col items-center justify-center text-center"
        style={{ minHeight: '55vh', padding: `${u(56)} ${u(24)}`, backgroundColor: '#FBF9F5' }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{ width: u(44), height: u(44), borderRadius: '50%', backgroundColor: '#F3ECE1', color: '#463936' }}
        >
          <Shirt style={{ width: u(19), height: u(19) }} />
        </span>
        <span className="uppercase" style={{ ...eyebrowStyle, marginTop: u(16) }}>Dress code</span>
        <h2 className="font-normal" style={{ ...headingStyle, marginTop: u(8) }}>
          {wedding.dressCode || 'Elegante / Cocktail'}
        </h2>
      </section>
      </Reveal>

      {/* CTA a RSVP, debajo de Dress code. Separado del módulo "Cronograma" en sí: solo
          aparece si el módulo "Confirmar asistencia" está tildado en Tu sitio. */}
      {features.rsvp && (
        <Reveal>
        <section
          className="sticky top-0 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '63vh', padding: `${u(56)} ${u(24)} ${u(72)}`, backgroundColor: '#FFFFFF' }}
        >
          <h2 className="font-normal" style={{ ...headingStyle, marginTop: 0 }}>
            Este día no sería lo mismo sin vos
          </h2>
          <button
            type="button"
            onClick={() => setScreen('rsvp')}
            className="uppercase cursor-pointer"
            style={{
              fontFamily: SANS,
              fontSize: u(11),
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              backgroundColor: '#2D1A0E',
              padding: `${u(13)} ${u(28)}`,
              borderRadius: u(2),
              marginTop: u(24),
            }}
          >
            Confirmar asistencia
          </button>
        </section>
        </Reveal>
      )}
      </React.Fragment>
    ),

    gallery: (
      <Reveal key="gallery">
        <section className="sticky top-0 w-full bg-[#FBF9F5]">
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

    guestInfo: (
      <React.Fragment key="guestInfo">
        {[
          { icon: Hotel, label: 'Hospedaje', value: wedding.lodgingInfo || DEFAULT_LODGING_INFO, bg: '#FFFFFF', h: '65vh' },
          { icon: Navigation, label: 'Ubicación', value: wedding.mapLocation || `${wedding.venue || 'Estancia La Linda'}, ${wedding.city || 'Pilar, Buenos Aires'}`, bg: '#FBF9F5', h: '65vh' },
          { icon: Bus, label: 'Transporte', value: wedding.transportInfo || DEFAULT_TRANSPORT_INFO, bg: '#FFFFFF', h: '92vh' },
        ].map(({ icon: Icon, label, value, bg, h }) => (
          <Reveal key={label}>
            <section
              className="sticky top-0 flex flex-col items-center justify-center text-center"
              style={{ minHeight: h, padding: `${u(56)} ${u(24)}`, backgroundColor: bg }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{ width: u(44), height: u(44), borderRadius: '50%', backgroundColor: '#F3ECE1', color: '#463936' }}
              >
                <Icon style={{ width: u(19), height: u(19) }} />
              </span>
              <span className="uppercase" style={{ ...eyebrowStyle, marginTop: u(16) }}>{label}</span>
              <h2
                className="font-normal"
                style={{ fontFamily: SERIF, fontSize: u(24), lineHeight: 1.35, color: '#1C1005', marginTop: u(10), maxWidth: u(480) }}
              >
                {value}
              </h2>
            </section>
          </Reveal>
        ))}
      </React.Fragment>
    ),

    music: (
      <Reveal key="music">
        <section
          className="sticky top-0 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '65vh', padding: `${u(24)} ${u(24)} ${u(90)}`, backgroundColor: '#FBF9F5' }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: u(44), height: u(44), borderRadius: '50%', backgroundColor: '#1C1005', color: '#fff' }}
          >
            <Music style={{ width: u(19), height: u(19) }} />
          </span>
          <h2 className="font-normal" style={{ ...headingStyle, marginTop: u(18) }}>Tu música, nuestra playlist</h2>
          <p style={{ ...bodyStyle, fontSize: u(15.5), lineHeight: u(22) }}>
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
  return (
    <div className="min-h-screen bg-[#FBF9F5]" style={{ ['--u' as string]: 'clamp(0.66px, 0.09506vw, 1px)' }}>
      <ExampleBackButton />
      <ExampleHero active="home" onNavigate={setScreen} />

      {features.giftRegistry && sections.giftRegistry}
      {MICROSITE_SECTION_ORDER.filter((key) => key !== 'story' && key !== 'giftRegistry' && features[key]).map((key) => sections[key])}
      {features.giftRegistry && sections.giftCta}
    </div>
  );
};
