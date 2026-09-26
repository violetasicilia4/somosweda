import React from 'react';

// Logotipo "Weda": una única definición para toda la app (landing, auth, panel, footer),
// así tipografía, tamaño, interlineado y espaciado son idénticos en todos lados.
const SANS = "'Schibsted Grotesk', sans-serif";

interface WordmarkProps {
  onClick?: () => void;
  tone?: 'dark' | 'light';
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({ onClick, tone = 'dark', className = '' }) => (
  <span
    onClick={onClick}
    role={onClick ? 'link' : undefined}
    className={`inline-block text-[28px] font-normal leading-normal uppercase tracking-normal ${
      tone === 'light' ? 'text-[#F7F1E4]' : 'text-[#2C1A0E]'
    } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{ fontFamily: SANS }}
  >
    Weda
  </span>
);
