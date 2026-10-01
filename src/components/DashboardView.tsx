import React, { useState } from 'react';
import {
  WeddingData,
  GiftItem,
  WeddingEvent,
  DashboardTab,
  AppView,
  ReceivedGift,
  CuentaSection,
  ManualGuest,
  ManualGuestStatus,
  WeddingPlan,
} from '../types';
import { formatLongDate } from '../utils/format';
import { getPlanDetails, getHighestPlan, planRank, withPlanChange, isPlanAtLeast } from '../utils/plan';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { HomeChecklistView } from './dashboard/HomeChecklistView';
import { GiftRegistryView } from './dashboard/GiftRegistryView';
import { RsvpView } from './dashboard/RsvpView';
import { MicrositeBuilderView } from './dashboard/MicrositeBuilderView';
import { AccountView } from './dashboard/AccountView';
import { HelpView } from './dashboard/HelpView';
import {
  ExternalLink,
  Check,
  CreditCard,
  Globe,
  Menu,
  ArrowRight,
} from 'lucide-react';

interface DashboardViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  events: WeddingEvent[];
  manualGuests: ManualGuest[];
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
  onAddManualGuest: (guest: Omit<ManualGuest, 'id'>) => void;
  onUpdateManualGuestStatus: (id: string, status: ManualGuestStatus) => void;
  onDeleteManualGuest: (id: string) => void;
  onImportManualGuests: (guests: Omit<ManualGuest, 'id'>[]) => void;
  onOpenMicrosite: () => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wedding,
  gifts,
  receivedGifts = [],
  events,
  manualGuests,
  onUpdateWedding,
  onAddGift,
  onDeleteGift,
  onUpdateGift,
  onUpdateReceivedGift,
  onAddManualGuest,
  onUpdateManualGuestStatus,
  onDeleteManualGuest,
  onImportManualGuests,
  onOpenMicrosite,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('inicio');
  // Menú lateral: fijo en escritorio, cajón deslizable en pantallas chicas
  const [menuOpen, setMenuOpen] = useState(false);
  const [cuentaSection, setCuentaSection] = useState<CuentaSection>('datos');
  // Paso 5 del checklist: se completa al abrir "Ver tu lista"
  const [siteViewed, setSiteViewed] = useState(false);

  // Publish modal state. "compare" es el paso previo que aparece cuando lo que
  // configuraron usa funcionalidades de un plan más alto que el actual; "pay" es el
  // pago único de siempre.
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [publishStep, setPublishStep] = useState<'compare' | 'pay'>('pay');
  const [isPublishingInProgress, setIsPublishingInProgress] = useState(false);
  // La cuenta de cobro (dónde reciben el dinero de los regalos) se carga en el paso 2
  // del checklist — no tiene que ver con el pago del plan, así que no se muestra acá.
  const isPaymentConfigured = Boolean(
    wedding.bankAlias?.trim() || wedding.bankCbu?.trim() || wedding.mercadoPagoAlias?.trim()
  );

  // Mismos requisitos que el checklist: al menos 5 regalos y la cuenta de cobro cargada
  const giftsReady = gifts.length >= 5;
  const canPublish = isPaymentConfigured && giftsReady;

  const isPublished = wedding.status === 'PUBLICADO';

  // El header, la barra de prueba y el modal de publicación son globales a todo el
  // dashboard — en Evento/Evento Plus no pueden seguir hablando solo de "tu lista"
  // mientras el usuario mira RSVP o Tu sitio, así que el sustantivo usado en esos
  // lugares depende del plan (ver también HomeChecklistView, que tiene la misma lógica).
  const isEventPlan = isPlanAtLeast(wedding.plan, 'invitados-rsvp');
  const siteNoun = isEventPlan ? 'sitio' : 'lista';

  // Regalos recibidos que todavía esperan un agradecimiento — badge de Regalos
  const pendingReceivedCount = receivedGifts.filter((r) => !r.isThanked).length;

  // El pago es por plan, ya no por plazo: un solo precio, un solo pago.
  const plan = getPlanDetails(wedding.plan);
  // El plan más alto que la pareja probó/configuró alguna vez (nunca baja, aunque
  // después cambien a uno más chico). Se usa para las pantallas de "Probar/Restaurar" y
  // para exigir el plan correcto recién al momento de publicar.
  const highestPlan = getHighestPlan(wedding);
  const requiresUpgradeToPublish = planRank(highestPlan) > planRank(wedding.plan ?? 'regalos');
  const highestPlanDetails = getPlanDetails(highestPlan);

  // Cambiar de plan es instantáneo, gratis y nunca borra nada: solo determina qué
  // secciones se muestran desbloqueadas. Se usa en todo el dashboard (sidebar, pantallas
  // de "Probar X", Cuenta > Explorar planes).
  const handleSelectPlan = (newPlan: WeddingPlan) => {
    onUpdateWedding(withPlanChange(wedding, newPlan));
  };

  // Todas las pestañas son siempre navegables — nunca se bloquea la navegación en sí.
  // Cada pestaña decide internamente si muestra su contenido o una pantalla de
  // "Probar/Restaurar" según el plan actual (ver utils/plan.ts).
  const goTo = (tab: DashboardTab, section?: CuentaSection) => {
    setActiveTab(tab);
    setMenuOpen(false);
    if (tab === 'cuenta' && section) setCuentaSection(section);
  };

  const openSite = () => {
    setSiteViewed(true);
    onOpenMicrosite();
  };

  const handleOpenPublishModal = () => {
    // Si lo que configuraron usa funcionalidades de un plan más alto que el actual
    // (por ejemplo: armaron el Micrositio Premium y después volvieron a Evento), no se
    // pierde nada — pero para publicar hace falta ese plan. Se lo mostramos recién acá,
    // nunca antes.
    setPublishStep(requiresUpgradeToPublish ? 'compare' : 'pay');
    setIsPaymentModalOpen(true);
  };

  // Publicación de la lista (prototipo: el pago está simulado). El pago es por plan,
  // pago único, sin plazo ni fecha de vencimiento.
  const handleExecutePayment = () => {
    setIsPublishingInProgress(true);
    setTimeout(() => {
      onUpdateWedding({
        status: 'PUBLICADO',
        setupProgress: 100,
        publishedAt: new Date().toISOString(),
      });
      setIsPublishingInProgress(false);
      setIsPaymentModalOpen(false);
      setActiveTab('inicio');
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => goTo(tab)}
        wedding={wedding}
        pendingReceivedCount={pendingReceivedCount}
        onLogout={() => onNavigate('landing')}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOP CONTEXT BAR */}
        <header className="bg-white/90 backdrop-blur-xs border-b border-gray-200 px-4 sm:px-8 py-3 sticky top-0 z-30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="lg:hidden p-1.5 -ml-1.5 rounded-xl text-gray-700 hover:bg-gray-100 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-gray-900 truncate min-w-0">{wedding.coupleName}</span>
            <span className="text-gray-300 hidden md:inline">•</span>
            <span className="text-xs text-gray-500 hidden md:inline whitespace-nowrap">{formatLongDate(wedding.weddingDate)}</span>

            {/* Status badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isPublished ? 'Publicado' : 'Borrador'}
            </span>
            {!isPublished && (
              <span className="text-[11px] text-gray-500 hidden 2xl:inline">
                Tu {siteNoun} no es {isEventPlan ? 'público' : 'pública'} hasta que {isEventPlan ? 'lo' : 'la'} publiques.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openSite}
              aria-label={`Ver tu ${siteNoun}`}
              className="whitespace-nowrap uppercase px-2.5 sm:px-3 py-1.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Ver tu {siteNoun}</span>
            </button>

            {!isPublished ? (
              <button
                type="button"
                onClick={handleOpenPublishModal}
                className="whitespace-nowrap uppercase px-3 sm:px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Publicar tu {siteNoun}</span>
                <span className="sm:hidden">Publicar</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 rounded-xl flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>En vivo</span>
              </div>
            )}
          </div>
        </header>

        {/* BARRA DE PRUEBA: discreta, siempre visible, sin lenguaje de venta agresivo */}
        <div className="bg-[#FBF9F5] border-b border-gray-200 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
            <span className="font-semibold text-gray-800 whitespace-nowrap">
              Estás probando {plan.name}
            </span>
            <span className="text-gray-400 hidden sm:inline">·</span>
            <span className="text-gray-500 hidden sm:inline whitespace-nowrap">
              Sin tarjeta de crédito · Sin compromiso · Pagás solo al publicar
            </span>
          </div>
          <button
            type="button"
            onClick={() => goTo('cuenta', 'plan')}
            className="uppercase whitespace-nowrap font-semibold text-gray-700 hover:text-gray-900 underline decoration-gray-300 cursor-pointer"
          >
            Ver planes
          </button>
        </div>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          {activeTab === 'inicio' && (
            <HomeChecklistView
              wedding={wedding}
              gifts={gifts}
              receivedGifts={receivedGifts}
              manualGuests={manualGuests}
              isPaymentConfigured={isPaymentConfigured}
              siteViewed={siteViewed}
              onGoTo={goTo}
              onOpenSite={openSite}
              onPublish={handleOpenPublishModal}
            />
          )}

          {activeTab === 'regalos' && (
            <GiftRegistryView
              wedding={wedding}
              gifts={gifts}
              receivedGifts={receivedGifts}
              onAddGift={onAddGift}
              onDeleteGift={onDeleteGift}
              onUpdateGift={onUpdateGift}
              onUpdateReceivedGift={onUpdateReceivedGift}
              onUpdateWedding={onUpdateWedding}
              onOpenMicrosite={openSite}
            />
          )}

          {activeTab === 'rsvp' && (
            <RsvpView
              wedding={wedding}
              onSelectPlan={handleSelectPlan}
              manualGuests={manualGuests}
              onAddManualGuest={onAddManualGuest}
              onUpdateManualGuestStatus={onUpdateManualGuestStatus}
              onDeleteManualGuest={onDeleteManualGuest}
              onImportManualGuests={onImportManualGuests}
            />
          )}

          {activeTab === 'sitio' && (
            <MicrositeBuilderView
              wedding={wedding}
              events={events}
              gifts={gifts}
              onUpdateWedding={onUpdateWedding}
              onOpenMicrosite={openSite}
              onSelectPlan={handleSelectPlan}
            />
          )}

          {activeTab === 'ayuda' && <HelpView />}

          {activeTab === 'cuenta' && (
            <AccountView
              wedding={wedding}
              onUpdateWedding={onUpdateWedding}
              section={cuentaSection}
              onSectionChange={setCuentaSection}
            />
          )}
        </main>
      </div>

      {/* ================= MODAL: PUBLICAR TU LISTA ================= */}
      {isPaymentModalOpen && publishStep === 'compare' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 animate-fade-in text-center space-y-4">
            <span className="w-11 h-11 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mx-auto">
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-gray-900">Necesitás {highestPlanDetails.name} para publicar</h3>
              <p className="text-sm text-gray-500">
                Tu evento usa funcionalidades de <strong className="text-gray-700">{highestPlanDetails.name}</strong>,
                que no están en tu plan actual ({plan.name}). No se perdió nada de lo que configuraste.
              </p>
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSelectPlan(highestPlan);
                  setPublishStep('pay');
                }}
                className="uppercase w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal cursor-pointer transition-colors"
              >
                Continuar con {highestPlanDetails.name}
              </button>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="uppercase w-full py-2 text-xs font-normal text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Seguir explorando
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && publishStep === 'pay' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-gray-100 animate-fade-in space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  Un solo pago
                </span>
                <h3 className="font-bold text-lg text-gray-900">Publicar tu {siteNoun}</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-semibold text-gray-700">Tu plan</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    goTo('cuenta', 'plan');
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Cambiar plan
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>{plan.name}</span>
                  <span className="text-base">{plan.price}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Pago único, sin plazos ni renovaciones. Tu {siteNoun} queda {isEventPlan ? 'activo' : 'activa'} desde que {isEventPlan ? 'lo' : 'la'} publiques.
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin comisión por regalo: el dinero va directo a tu cuenta</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={isPublishingInProgress || !canPublish}
                onClick={handleExecutePayment}
                className="uppercase w-full py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishingInProgress ? (
                  <span>Publicando tu {siteNoun}...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar {plan.price} y publicar tu {siteNoun}</span>
                  </>
                )}
              </button>
              {!canPublish && !isPublishingInProgress && (
                <p className="text-[11px] text-center text-amber-700">
                  {!isPaymentConfigured
                    ? 'Cargá tu cuenta de cobro para poder publicar.'
                    : `Sumá al menos 5 regalos a tu lista de regalos para poder publicar (tenés ${gifts.length}).`}
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="uppercase w-full py-2 text-xs font-normal text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Seguir en borrador
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
