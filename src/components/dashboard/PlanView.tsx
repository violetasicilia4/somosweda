import React, { useState } from 'react';
import { WeddingData, WeddingPlan } from '../../types';
import { Check, Gift, Layout, Users } from 'lucide-react';
import { PLAN_DETAILS, withPlanChange } from '../../utils/plan';

interface PlanViewProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
}

const PLAN_ICONS: Record<WeddingPlan, React.ComponentType<{ className?: string }>> = {
  regalos: Gift,
  'invitados-rsvp': Users,
  completo: Layout,
};

export const PlanView: React.FC<PlanViewProps> = ({ wedding, onUpdateWedding }) => {
  const [justChanged, setJustChanged] = useState(false);
  const currentPlan = wedding.plan ?? 'regalos';

  const handleChangePlan = (plan: WeddingPlan) => {
    if (plan === currentPlan) return;
    onUpdateWedding(withPlanChange(wedding, plan));
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {justChanged && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Listo, ya estás probando este plan.</span>
        </div>
      )}

      <p className="text-sm text-gray-500 max-w-xl">
        Probá cualquier plan las veces que quieras, sin tarjeta de crédito y sin compromiso. Nada de lo que
        configures se pierde al cambiar — el pago real se hace recién al publicar tu lista.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLAN_DETAILS.map((plan) => {
          const Icon = PLAN_ICONS[plan.id];
          const isCurrent = currentPlan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleChangePlan(plan.id)}
              className={`relative text-left bg-white rounded-3xl p-5 flex flex-col transition-all cursor-pointer ${
                isCurrent ? 'border-2 border-gray-900 shadow-xs' : 'border border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.badge && !isCurrent && (
                <span className="absolute -top-2.5 right-4 uppercase text-[9px] tracking-[0.08em] bg-gray-900 text-white px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-2.5 right-4 uppercase text-[9px] tracking-[0.08em] bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Estás probando este
                </span>
              )}

              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCurrent ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Icon className="w-4.5 h-4.5" />
              </span>

              <h3 className="mt-3 text-[15px] font-semibold text-gray-900">{plan.name}</h3>
              <span className="mt-1 text-[18px] font-semibold text-gray-900">{plan.price}</span>

              <ul className="mt-4 space-y-1.5 pt-4 border-t border-gray-100">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-snug">
                    <Check className="w-3 h-3 mt-0.5 text-gray-900 shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {!isCurrent && (
                <span className="mt-4 uppercase text-center py-2 border border-gray-300 rounded-xl text-[11px] font-normal text-gray-700">
                  Probar esta versión
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
