import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Botón fijo para salir del ejemplo: el ejemplo se abre en una pestaña nueva y sus
// pantallas no tienen otra forma de volver a la landing.
export const ExampleBackButton: React.FC = () => {
  const goToLanding = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <button
      id="example-back-to-landing"
      type="button"
      onClick={goToLanding}
      className="fixed bottom-4 left-4 z-50 uppercase inline-flex items-center gap-2 h-9 px-4 bg-[#2D1A0E] text-white text-[11px] font-medium tracking-[0.04em] rounded-[2px] hover:bg-[#1A0E08] transition-colors cursor-pointer"
      style={{ fontFamily: "'Schibsted Grotesk', sans-serif" }}
    >
      <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span>Volver a la landing</span>
    </button>
  );
};
