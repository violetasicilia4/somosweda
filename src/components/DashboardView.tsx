import React, { useState } from 'react';
import {
  WeddingData,
  Guest,
  GiftItem,
  WeddingEvent,
  DashboardTab,
  AppView,
  ReceivedGift
} from '../types';
import { pricingPlans } from '../data/initialData';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { GiftRegistryView } from './dashboard/GiftRegistryView';
import { GuestManagementView } from './dashboard/GuestManagementView';
import { MicrositeBuilderView } from './dashboard/MicrositeBuilderView';
import { ReceivedGiftsView } from './dashboard/ReceivedGiftsView';
import { PlanBillingView } from './dashboard/PlanBillingView';
import { AccountView } from './dashboard/AccountView';
import { HelpView } from './dashboard/HelpView';
import { CobrosView } from './dashboard/CobrosView';
import {
  ExternalLink,
  Sparkles,
  Check,
  CreditCard,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  wedding: WeddingData;
  guests: Guest[];
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  events: WeddingEvent[];
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onUpdateGuestStatus: (guestId: string, status: Guest['status']) => void;
  onDeleteGuest: (guestId: string) => void;
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
  onOpenMicrosite: () => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wedding,
  guests,
  gifts,
  receivedGifts = [],
  events,
  onUpdateWedding,
  onAddGuest,
  onUpdateGuestStatus,
  onDeleteGuest,
  onAddGift,
  onDeleteGift,
  onUpdateGift,
  onUpdateReceivedGift,
  onOpenMicrosite,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('regalos');

  // Publish modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPublishingInProgress, setIsPublishingInProgress] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<'essential' | 'premium' | 'signature'>(
    wedding.selectedPlan || 'premium'
  );
  // Los datos de cobro se piden acá, recién al publicar — nunca antes, para no
  // trabar la construcción de la lista de regalos con una tarea administrativa.
  const [isEditingCobro, setIsEditingCobro] = useState(false);
  const isPaymentConfigured = Boolean(wedding.bankAlias?.trim() || wedding.mercadoPagoAlias?.trim());

  // Plan chosen inside the Publish modal (plan selection no longer lives in onboarding)
  const currentPlan = pricingPlans.find(p => p.id === selectedPlanId) || pricingPlans[1];

  // Received gifts still waiting on a thank-you — drives the sidebar badge
  const pendingReceivedCount = receivedGifts.filter(r => !r.isThanked).length;

  // Open the Publish modal, syncing the plan picker to whatever was last chosen in Plan y Facturación
  const handleOpenPublishModal = () => {
    setSelectedPlanId(wedding.selectedPlan || 'premium');
    setIsEditingCobro(false);
    setIsPaymentModalOpen(true);
  };

  // Early Payment & Publishing action
  const handleExecutePayment = () => {
    setIsPublishingInProgress(true);
    setTimeout(() => {
      onUpdateWedding({ selectedPlan: selectedPlanId, status: 'PUBLICADO', setupProgress: 100 });
      setIsPublishingInProgress(false);
      setIsPaymentModalOpen(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        wedding={wedding}
        pendingReceivedCount={pendingReceivedCount}
        onOpenMicrosite={onOpenMicrosite}
        onLogout={() => onNavigate('landing')}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOP CONTEXT BAR */}
        <header className="bg-white/90 backdrop-blur-xs border-b border-gray-200 px-6 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
              Boda en preparación:
            </span>
            <span className="text-xs font-bold text-gray-900 truncate">
              {wedding.coupleName}
            </span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-xs text-gray-500 hidden sm:inline">
              {wedding.weddingDate}
            </span>

            {/* Status badge */}
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              wedding.status === 'PUBLICADO'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {wedding.status === 'PUBLICADO' ? 'Boda Publicada' : 'Modo Borrador'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenMicrosite}
              className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span>Ver sitio web</span>
            </button>

            {wedding.status !== 'PUBLICADO' ? (
              <button
                type="button"
                onClick={handleOpenPublishModal}
                className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Publicar boda</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 rounded-lg flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>En vivo</span>
              </div>
            )}
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          {activeTab === 'regalos' && (
            <GiftRegistryView
              wedding={wedding}
              gifts={gifts}
              onAddGift={onAddGift}
              onDeleteGift={onDeleteGift}
              onUpdateGift={onUpdateGift}
              onOpenMicrosite={onOpenMicrosite}
            />
          )}

          {activeTab === 'micrositio' && (
            <MicrositeBuilderView
              wedding={wedding}
              events={events}
              gifts={gifts}
              onUpdateWedding={onUpdateWedding}
              onOpenMicrosite={onOpenMicrosite}
            />
          )}

          {activeTab === 'recibidos' && (
            <ReceivedGiftsView
              receivedGifts={receivedGifts}
              onUpdateReceivedGift={onUpdateReceivedGift}
            />
          )}

          {activeTab === 'invitados' && (
            <GuestManagementView
              wedding={wedding}
              guests={guests}
              onAddGuest={onAddGuest}
              onUpdateGuestStatus={onUpdateGuestStatus}
              onDeleteGuest={onDeleteGuest}
            />
          )}

          {activeTab === 'plan' && (
            <PlanBillingView
              wedding={wedding}
              onUpdateWedding={onUpdateWedding}
              onOpenEarlyPayment={handleOpenPublishModal}
            />
          )}

          {activeTab === 'cuenta' && (
            <AccountView
              wedding={wedding}
              onUpdateWedding={onUpdateWedding}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'ayuda' && (
            <HelpView />
          )}
        </main>
      </div>

      {/* ================= MODAL: PAGAR AHORA / PUBLICAR BODA ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 animate-fade-in space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  Publicación Definitiva
                </span>
                <h3 className="font-serif font-medium text-lg text-gray-900">
                  Publicar tu boda en Weda
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1"
              >
                Cerrar
              </button>
            </div>

            {/* Cómo van a cobrar los regalos — única vez que se pide, justo antes de publicar */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-gray-700">
                Cómo van a cobrar los regalos
              </span>
              {isPaymentConfigured && !isEditingCobro ? (
                <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Datos de cobro cargados</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingCobro(true)}
                    className="text-xs font-semibold text-emerald-800 underline shrink-0 cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              ) : (
                <CobrosView wedding={wedding} onUpdateWedding={onUpdateWedding} compact />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-semibold text-gray-700 mb-1.5">Elegí tu plan</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {pricingPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPlanId === plan.id
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200/80 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Plan {currentPlan.name}</span>
                  <span className="text-base font-mono">{currentPlan.price}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Pago único por el tiempo completo de organización de tu boda. Sin renovaciones automáticas ni comisiones por regalos.
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Micrositio en vivo en weda.app/boda/{wedding.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Recepción ilimitada de RSVPs y regalos directos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Soporte prioritario por WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={isPublishingInProgress || !isPaymentConfigured}
                onClick={handleExecutePayment}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishingInProgress ? (
                  <span>Activando boda...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar {currentPlan.price} y Publicar Boda</span>
                  </>
                )}
              </button>
              {!isPaymentConfigured && !isPublishingInProgress && (
                <p className="text-[11px] text-center text-amber-700">
                  Completá los datos de cobro para poder publicar.
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                Seguir probando en borrador (gratis)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
