import React from 'react';
import { WeddingData, PricingPlan } from '../../types';
import { pricingPlans } from '../../data/initialData';
import { 
  ShieldCheck, 
  Check, 
  Sparkles, 
  CreditCard, 
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';

interface PlanBillingViewProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onOpenEarlyPayment: () => void;
}

export const PlanBillingView: React.FC<PlanBillingViewProps> = ({
  wedding,
  onUpdateWedding,
  onOpenEarlyPayment,
}) => {
  const currentPlanId = wedding.selectedPlan || 'premium';
  const currentPlan = pricingPlans.find(p => p.id === currentPlanId) || pricingPlans[1];

  const handleSelectPlan = (planId: 'essential' | 'premium' | 'signature') => {
    onUpdateWedding({ selectedPlan: planId });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* HEADER */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Plan y Facturación
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Transparencia absoluta. Sin suscripciones recurrentes ni costos ocultos.
        </p>
      </div>

      {/* CURRENT STATUS HERO CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Prueba gratuita activa</span>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                Plan seleccionado: {currentPlan.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">
                Podés configurar y probar todas las funcionalidades de Weda con tiempo ilimitado antes de publicar.
              </p>
            </div>

            <div className="text-xs sm:text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl inline-block">
              ✨ <span className="font-semibold">Solo pagarás cuando publiques tu boda.</span>
            </div>
          </div>

          <div className="md:w-64 bg-gray-50 border border-gray-200 rounded-2xl p-5 shrink-0 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold font-mono tracking-wider text-gray-400 block mb-1">
                Monto del plan
              </span>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {currentPlan.price || 'AR$ 180.000'}
              </div>
              <span className="text-xs text-gray-500 font-medium block mt-0.5">
                Pago único • Sin sorpresas
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenEarlyPayment}
              className="mt-4 w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              Pagar ahora
            </button>
          </div>
        </div>
      </div>

      {/* PLAN COMPARISON CARDS */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-base font-bold text-gray-900">Comparativa de Planes Weda</h3>
          <p className="text-xs text-gray-500">Elegí el plan que mejor se adapte a las necesidades de su boda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingPlans.map((plan) => {
            const isSelected = plan.id === currentPlanId;
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 min-h-[36px]">{plan.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="text-2xl font-bold text-gray-900 font-mono">{plan.price}</div>
                    <span className="text-[11px] text-gray-400">Pago único</span>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {isSelected ? (
                    <button
                      disabled
                      className="w-full py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-semibold cursor-default"
                    >
                      Plan seleccionado
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan.id as any)}
                      className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                    >
                      Elegir {plan.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
