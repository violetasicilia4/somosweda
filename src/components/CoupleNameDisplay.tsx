import React from 'react';

interface CoupleNameDisplayProps {
  name: string;
  className?: string;
  scriptClassName?: string;
}

/**
 * Renderiza "Novio & Novia" con el "&" en el script de acento (Parisienne),
 * como el "entr&nós" de referencia: el resto del nombre se queda en Onest.
 */
export const CoupleNameDisplay: React.FC<CoupleNameDisplayProps> = ({
  name,
  className = '',
  scriptClassName = '',
}) => {
  const parts = name.split('&');
  if (parts.length !== 2) {
    return <span className={className}>{name}</span>;
  }

  return (
    <span className={className}>
      {parts[0].trim()}{' '}
      <span className={`font-script ${scriptClassName}`}>&amp;</span>{' '}
      {parts[1].trim()}
    </span>
  );
};
