import React, { useState } from 'react';

// Pantalla "Confirmar asistencia" del ejemplo. Copia del diseño de referencia (frame de
// 1219px de ancho): todas las medidas están en "u", 1u = 1px a 1219px de ancho del frame,
// que a 1440px de viewport equivale a 1.181px. Se achica proporcionalmente por debajo y no
// crece por encima de 1440px.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

const dietary = ['Sin restricciones', 'Celíaco', 'Vegetariano', 'Vegano', 'Sin lactosa', 'Menú infantil', 'Otro'];

const heroButton =
  'uppercase border transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: SANS,
  fontSize: u(11),
  fontWeight: 600,
  lineHeight: u(13),
  color: '#282018',
  marginBottom: u(8),
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: u(35),
  padding: `0 ${u(10)}`,
  border: '1px solid #F1F1EF',
  borderRadius: u(2),
  backgroundColor: '#FFFFFF',
  fontFamily: SANS,
  fontSize: u(11.85),
  color: '#282018',
  outline: 'none',
};

interface ExampleRsvpProps {
  onNavigate: (screen: 'home' | 'gifts' | 'rsvp') => void;
}

export const ExampleRsvp: React.FC<ExampleRsvpProps> = ({ onNavigate }) => {
  const [attending, setAttending] = useState(true);
  const [restrictions, setRestrictions] = useState<string[]>(['Sin restricciones']);

  const toggleRestriction = (r: string) => {
    setRestrictions((prev) => {
      if (r === 'Sin restricciones') return ['Sin restricciones'];
      const without = prev.filter((x) => x !== 'Sin restricciones');
      const next = without.includes(r) ? without.filter((x) => x !== r) : [...without, r];
      return next.length ? next : ['Sin restricciones'];
    });
  };

  const heroBtn: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: u(11.9),
    height: u(35),
    padding: `0 ${u(17.2)}`,
    letterSpacing: '0.04em',
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]" style={{ ['--u' as string]: 'min(1.1813px, 0.08203vw)' }}>
      {/* Barra superior */}
      <header
        className="flex items-center justify-between bg-[#FBF9F5]"
        style={{ height: u(59), padding: `0 ${u(68)}`, borderBottom: '1px solid #F0EFE9' }}
      >
        <div className="flex items-center" style={{ gap: u(12) }}>
          <span className="font-semibold text-[#22180E]" style={{ fontFamily: SANS, fontSize: u(16.5), lineHeight: 1 }}>
            WEDA
          </span>
          <span
            className="uppercase text-[#5A4C43] border border-[#B9AFA6] flex items-center justify-center"
            style={{ fontFamily: SANS, fontSize: u(6.5), letterSpacing: '0.06em', padding: `0 ${u(6)}`, height: u(12), borderRadius: u(2), lineHeight: 1 }}
          >
            Confirmar asistencia
          </span>
        </div>
        <div className="flex items-center" style={{ gap: u(28) }}>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#564A41] cursor-pointer hover:opacity-70 transition-opacity"
            style={{ fontFamily: SANS, fontSize: u(11), lineHeight: 1 }}
          >
            Volver al sitio
          </button>
          <button
            className="uppercase text-[#2D1A0E] border border-[#2D1A0E] font-semibold cursor-pointer hover:bg-[#2D1A0E]/5 transition-colors"
            style={{ fontFamily: SANS, fontSize: u(8.9), letterSpacing: '0.04em', width: u(79), height: u(25), borderRadius: u(2) }}
          >
            Mi cuenta
          </button>
        </div>
      </header>

      {/* Hero: misma foto, oscurecida 30% */}
      <section className="relative w-full overflow-hidden" style={{ height: u(542) }}>
        <img
          src="/ejemplo-hero.webp"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-x-0 z-10 flex flex-col items-center text-center text-white" style={{ top: u(286) }}>
          <h1 className="font-normal" style={{ fontFamily: SERIF, fontSize: u(81.1), lineHeight: 1 }}>
            Milagros &amp; Juan
          </h1>
          <p className="text-white/90" style={{ fontFamily: SANS, fontSize: u(13.4), letterSpacing: '0.05em', lineHeight: 1, marginTop: u(14.5) }}>
            24 · 10 · 2026
          </p>
          <div className="bg-white/50" style={{ width: u(50), height: 1, marginTop: u(22) }}></div>

          <div className="flex items-center" style={{ gap: u(14.5), marginTop: u(34) }}>
            <button
              id="rsvp-info-btn"
              onClick={() => onNavigate('home')}
              className={`${heroButton} text-white border-white/70 hover:bg-white/10`}
              style={heroBtn}
            >
              Información
            </button>
            <button
              id="rsvp-confirm-btn"
              className={`${heroButton} bg-white text-[#2A1A0D] border-white`}
              style={heroBtn}
            >
              Confirmar asistencia
            </button>
            <button
              id="rsvp-gifts-btn"
              onClick={() => onNavigate('gifts')}
              className={`${heroButton} text-white border-white/70 hover:bg-white/10`}
              style={heroBtn}
            >
              Regalos
            </button>
          </div>
        </div>
      </section>

      {/* Confirmación */}
      <section className="flex flex-col items-center" style={{ paddingTop: u(42), paddingBottom: u(101) }}>
        <h2 className="uppercase font-medium text-[#7B6F63]" style={{ fontFamily: SANS, fontSize: u(13), lineHeight: 1, position: 'relative', left: u(-3.5) }}>
          Confirmación
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white"
          style={{ width: u(589), marginTop: u(43), padding: `${u(40)} ${u(39)}`, border: '1px solid #E9E8E4', borderRadius: u(2) }}
        >
          <label htmlFor="rsvp-name" style={labelStyle}>Nombre y Apellido</label>
          <input id="rsvp-name" type="text" placeholder="Tu nombre completo" className="rsvp-field" style={fieldStyle} />

          <div className="grid grid-cols-2" style={{ columnGap: u(16.5), marginTop: u(16) }}>
            <div>
              <label htmlFor="rsvp-email" style={labelStyle}>Email</label>
              <input id="rsvp-email" type="email" placeholder="tu@email.com" className="rsvp-field" style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="rsvp-phone" style={labelStyle}>Teléfono</label>
              <input id="rsvp-phone" type="tel" placeholder="+54 9 11 ..." className="rsvp-field" style={fieldStyle} />
            </div>
          </div>

          <div style={{ marginTop: u(16) }}>
            <span style={labelStyle}>¿Asistirás al evento?</span>
            <div className="grid grid-cols-2" style={{ columnGap: u(10) }}>
              <button
                type="button"
                onClick={() => setAttending(true)}
                className="cursor-pointer transition-colors"
                style={{
                  height: u(42),
                  borderRadius: u(2),
                  fontFamily: SANS,
                  fontSize: u(11.8),
                  fontWeight: 600,
                  border: '1px solid ' + (attending ? '#2D1A0E' : '#F1F1EF'),
                  backgroundColor: attending ? '#2D1A0E' : '#FFFFFF',
                  color: attending ? '#FFFFFF' : '#544A42',
                }}
              >
                Sí, ¡con gusto voy!
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className="cursor-pointer transition-colors"
                style={{
                  height: u(42),
                  borderRadius: u(2),
                  fontFamily: SANS,
                  fontSize: u(11.5),
                  fontWeight: attending ? 400 : 600,
                  border: '1px solid ' + (attending ? '#F1F1EF' : '#2D1A0E'),
                  backgroundColor: attending ? '#FFFFFF' : '#2D1A0E',
                  color: attending ? '#544A42' : '#FFFFFF',
                }}
              >
                Lamentablemente no podré
              </button>
            </div>
          </div>

          <div style={{ marginTop: u(16) }}>
            <label htmlFor="rsvp-companion" style={labelStyle}>¿Venís con acompañante?</label>
            <input id="rsvp-companion" type="text" placeholder="Nombre de tu acompañante (opcional)" className="rsvp-field" style={fieldStyle} />
          </div>

          <div style={{ marginTop: u(16) }}>
            <span style={labelStyle}>Opciones dietarias / Restricciones</span>
            <div className="flex flex-wrap" style={{ gap: `${u(6)} ${u(12)}`, marginTop: u(11) }}>
              {dietary.map((d) => {
                const on = restrictions.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleRestriction(d)}
                    className="cursor-pointer transition-colors"
                    style={{
                      height: u(27),
                      padding: `0 ${u(10.1)}`,
                      borderRadius: 999,
                      fontFamily: SANS,
                      fontSize: u(11),
                      fontWeight: 500,
                      backgroundColor: on ? '#2D1A0E' : '#F4F0EB',
                      color: on ? '#FFFFFF' : '#5A4C43',
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: u(16) }}>
            <label htmlFor="rsvp-message" style={labelStyle}>Dejanos un mensaje para los novios</label>
            <textarea
              id="rsvp-message"
              placeholder="Escribí algo lindo o alguna observación..."
              className="rsvp-field"
              style={{ ...fieldStyle, height: u(85), padding: `${u(10)} ${u(10)}`, resize: 'none', display: 'block' }}
            />
          </div>

          <button
            type="submit"
            className="uppercase text-white w-full cursor-pointer hover:opacity-90 transition-opacity"
            style={{ marginTop: u(34), height: u(41), borderRadius: u(2), backgroundColor: '#2D1A0E', fontFamily: SANS, fontSize: u(12), fontWeight: 500 }}
          >
            Confirmar asistencia
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden text-[#F7F1E4]" style={{ backgroundColor: '#1A0E08', height: u(542), padding: `${u(85)} ${u(68)} 0` }}>
        <div className="grid" style={{ gridTemplateColumns: `${u(395)} ${u(225)} ${u(224)} 1fr` }}>
          <div>
            <span className="block" style={{ fontFamily: SANS, fontSize: u(17.1), lineHeight: 1, position: 'relative', top: u(1) }}>WEDA</span>
            <p className="text-[#F7F1E4]/55" style={{ fontFamily: SANS, fontSize: u(11), lineHeight: u(19), marginTop: u(28), maxWidth: u(330) }}>
              La forma más elegante de recibir regalos y gestionar invitados para tu casamiento. Hecho en Argentina.
            </p>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(8.6), lineHeight: 1 }}>Producto</h4>
            <ul className="text-[#F7F1E4]/70" style={{ fontFamily: SANS, fontSize: u(11), marginTop: u(16) }}>
              {['Cómo funciona', 'Ver un ejemplo', 'Crear mi lista'].map((t) => (
                <li key={t} style={{ height: u(27), lineHeight: 1 }}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(8.6), lineHeight: 1 }}>Ayuda</h4>
            <ul className="text-[#F7F1E4]/70" style={{ fontFamily: SANS, fontSize: u(11), marginTop: u(16) }}>
              {['Preguntas frecuentes', 'Contacto'].map((t) => (
                <li key={t} style={{ height: u(27), lineHeight: 1 }}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-[#F7F1E4]/45" style={{ fontFamily: SANS, fontSize: u(8.6), lineHeight: 1 }}>Contacto &amp; Soporte</h4>
            <p className="text-[#F7F1E4]" style={{ fontFamily: SANS, fontSize: u(11.7), fontWeight: 500, lineHeight: 1, marginTop: u(17) }}>hola@weda.com.ar</p>
            <p className="text-[#F7F1E4]/50" style={{ fontFamily: SANS, fontSize: u(11), lineHeight: u(18), marginTop: u(15), maxWidth: u(240) }}>
              ¿Tenés dudas? Escribinos. Respondemos de lunes a viernes de 9 a 18 hs.
            </p>
          </div>
        </div>

        <div className="absolute bg-[#F7F1E4]/10" style={{ left: u(68), right: u(68), top: u(270), height: 1 }}></div>

        <span
          aria-hidden="true"
          className="absolute select-none pointer-events-none text-[#F7F1E4]/[0.035]"
          style={{ fontFamily: SANS, fontSize: u(152), lineHeight: 1, left: u(67), top: u(324), fontWeight: 400 }}
        >
          WEDA
        </span>

        <div className="absolute flex items-center justify-between text-[#F7F1E4]/40" style={{ left: u(68), right: u(68), bottom: u(46), fontFamily: SANS, fontSize: u(11) }}>
          <span>© 2026 Weda. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};
