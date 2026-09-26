import React from 'react';
import { DurationMonths } from '../../types';
import { durationOptions } from '../../data/initialData';
import { addMonths, formatARS, formatLongDate } from '../../utils/format';

interface DurationPickerProps {
  value: DurationMonths;
  onChange: (months: DurationMonths) => void;
}

// Selector único de duración: se usa en Cuenta > Duración y en el paso de publicar.
export const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange }) => {
  const selected = durationOptions.find((o) => o.months === value) ?? durationOptions[1];
  const activeUntil = addMonths(new Date(), selected.months);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Duración de tu lista">
        {durationOptions.map((o) => {
          const isSelected = o.months === value;
          return (
            <button
              key={o.months}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(o.months)}
              className={`relative text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {o.recommended && (
                <span className="absolute -top-2 left-3 uppercase text-[9px] font-semibold tracking-wide bg-gray-900 text-white px-2 py-0.5 rounded-full">
                  Recomendado
                </span>
              )}
              <span className="block text-sm font-semibold text-gray-900">{o.months} meses</span>
              <span className="block text-base font-bold text-gray-900 mt-1">{formatARS(o.price)}</span>
              <span className="block text-[11px] text-gray-500 mt-1.5 leading-snug">{o.note}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-600">
        Tu lista quedaría activa hasta el <span className="font-semibold text-gray-900">{formatLongDate(activeUntil)}</span>.
      </p>
      <p className="text-[11px] text-gray-500">Un solo pago. Sin suscripción. Sin comisión por regalo.</p>
    </div>
  );
};
