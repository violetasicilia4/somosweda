import React, { useState } from 'react';
import { AppView, WeddingPlan } from '../types';
import { Check, Gift, Layout, Users } from 'lucide-react';
import { PLAN_DETAILS } from '../utils/plan';
import { Wordmark } from './Wordmark';

interface ChoosePlanViewProps {
  onNavigate: (view: AppView) => void;
  onSelectPlan: (plan: WeddingPlan) => void;
}

// Los íconos se mapean acá porque los datos de PLAN_DETAILS (en utils/plan.ts) son
// compartidos con Cuenta > Tu plan y el modal de publicar, y ahí no hacen falta.
const PLAN_ICONS: Record<WeddingPlan, React.ComponentType<{ className?: string }>> = {
  regalos: Gift,
  'invitados-rsvp': Users,
  completo: Layout,
};

export const ChoosePlanView: React.FC<ChoosePlanViewProps> = ({ onNavigate, onSelectPlan }) => {
  const [selected, setSelected] = useState<WeddingPlan>('completo');

  const handleContinue = () => {
    onSelectPlan(selected);
    onNavigate('create-wedding');
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center px-4 py-8 sm:py-10 font-sans">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Wordmark onClick={() => onNavigate('landing')} className="hover:opacity-85 transition-opacity" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1.5">¿Qué querés crear?</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Elegí por dónde arrancar. Vas a poder cambiar y probar los demás cuando quieras, sin perder nada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_DETAILS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                role="button"
                tabIndex={0}
                id={`choose-plan-${plan.id}`}
                onClick={() => setSelected(plan.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(plan.id); }}
                className={`relative text-left bg-white rounded-xl p-5 flex flex-col transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#2D1A0E] shadow-[0_8px_24px_rgba(45,26,14,0.1)]'
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-4 uppercase text-[9px] tracking-[0.08em] bg-[#2D1A0E] text-white px-2.5 py-1 rounded-[2px]">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2D1A0E] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#2D1A0E] border-[#2D1A0E]' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                </div>

                <h3 className="mt-3 text-[15px] font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-[12px] text-gray-500 leading-snug min-h-[32px]">{plan.description}</p>

                <div className="mt-3">
                  <span className="text-[20px] font-semibold text-gray-900">{plan.price}</span>
                  <span className="text-[11px] text-gray-400"> / pago único</span>
                </div>

                <ul className="mt-4 space-y-1.5 pt-4 border-t border-gray-100">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-snug">
                      <Check className="w-3 h-3 mt-0.5 text-[#2D1A0E] shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  id={`choose-plan-${plan.id}-try`}
                  onClick={(e) => { e.stopPropagation(); setSelected(plan.id); }}
                  className={`uppercase mt-4 w-full min-h-11 flex items-center justify-center rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#2D1A0E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Probar esta versión
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            id="choose-plan-continue-btn"
            type="button"
            onClick={handleContinue}
            className="uppercase w-full max-w-xs h-11 bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[13px] transition-all shadow-xs cursor-pointer"
          >
            Continuar
          </button>
          <p className="text-[11px] text-gray-400">Sin tarjeta de crédito · Sin compromiso · Podés probar los demás cuando quieras</p>
        </div>
      </div>
    </div>
  );
};
