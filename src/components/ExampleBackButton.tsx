import React from 'react';

// Antes era un botón grande "Volver a la landing": tenía sentido para quien entra desde
// "Ver ejemplo" en el landing (un prospecto probando el producto), pero este mismo
// componente se muestra también en el link real que un invitado recibe para ver el sitio
// de la boda (ver "Copiar enlace" en GiftRegistryView) — y ahí ese botón exponía el
// chrome de la plataforma ("volvé a nuestra landing") a alguien que solo quiere ver la
// invitación de sus amigos, rompiendo la sensación de sitio a medida. Se reemplaza por un
// crédito chico y discreto, como el "hecho con X" de cualquier constructor de sitios: no
// compite con el contenido de la boda, pero sigue dejando una salida para quien sí llegó
// como prospecto evaluando Weda.
export const ExampleBackButton: React.FC = () => {
  // Dentro del marco de la landing ("Probalo como invitado") no hace falta ningún link
  if (typeof window !== 'undefined' && window.self !== window.top) return null;

  const goToLanding = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <button
      id="example-back-to-landing"
      type="button"
      onClick={goToLanding}
      className="fixed bottom-4 left-4 z-50 inline-flex items-center h-7 px-3 bg-white/70 backdrop-blur-sm text-[#786C63] text-[10px] font-normal tracking-[0.02em] rounded-full border border-[#E9E2D6] hover:bg-white hover:text-[#2D1A0E] transition-colors cursor-pointer shadow-sm"
      style={{ fontFamily: "'Schibsted Grotesk', sans-serif" }}
    >
      Hecho con Weda
    </button>
  );
};
