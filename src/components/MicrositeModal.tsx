import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, GiftItem, WeddingEvent, ReceivedGift } from '../types';
import {
  X,
  Heart,
  Calendar,
  MapPin,
  Gift,
  Clock,
  Check,
  Sparkles,
  Copy,
  ExternalLink,
  ShieldCheck,
  UploadCloud,
  FileText,
  Building2,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';

interface MicrositeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wedding: WeddingData;
  events: WeddingEvent[];
  gifts: GiftItem[];
  isStandalone?: boolean;
  onGiftContribute?: (giftId: string, amount: number) => void;
  onAddReceivedGift?: (gift: Omit<ReceivedGift, 'id'>) => void;
}

export const MicrositeModal: React.FC<MicrositeModalProps> = ({
  isOpen,
  onClose,
  wedding,
  events,
  gifts,
  isStandalone = false,
  onGiftContribute,
  onAddReceivedGift,
}) => {
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState(1);
  const [rsvpDiet, setRsvpDiet] = useState('Ninguna');
  const [rsvpSong, setRsvpSong] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedCbu, setCopiedCbu] = useState(false);

  // Navegación interna del micrositio: la invitación y la lista de regalos
  // viven en pantallas separadas, como en Confites (MICROSITIO / REGALOS).
  const [micrositeView, setMicrositeView] = useState<'home' | 'gifts'>('home');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleGoToGifts = () => {
    setMicrositeView('gifts');
    scrollContainerRef.current?.scrollTo({ top: 0 });
  };

  const handleBackToHome = () => {
    setMicrositeView('home');
    scrollContainerRef.current?.scrollTo({ top: 0 });
  };

  // Gift Contribution Flow State (cart + step wizard, mirrors the "Regalá" flow)
  const [cartItems, setCartItems] = useState<GiftItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [giftFlowStep, setGiftFlowStep] = useState<'cart' | 'how' | 'data' | 'confirm' | 'payment'>('cart');
  const [giftShareMode, setGiftShareMode] = useState<'solo' | 'compartido' | null>(null);
  const [giverName, setGiverName] = useState('');
  const [giverEmail, setGiverEmail] = useState('');
  const [contributionAmount, setContributionAmount] = useState('15000');
  const [dedicationMessage, setDedicationMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'mercadopago'>('transferencia');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [contributionSuccess, setContributionSuccess] = useState(false);
  const [isProcessingMp, setIsProcessingMp] = useState(false);

  const cartTotal = cartItems.reduce((sum, g) => sum + g.targetPrice, 0);

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({ days: 420, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: 23, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(wedding.bankAlias || 'boda.sofia.martin');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleCopyCbu = () => {
    navigator.clipboard.writeText(wedding.bankCbu || '0000003100049281740291');
    setCopiedCbu(true);
    setTimeout(() => setCopiedCbu(false), 2000);
  };

  const handleAddToCart = (gift: GiftItem) => {
    setCartItems(prev => (prev.some(g => g.id === gift.id) ? prev : [...prev, gift]));
    setGiftFlowStep('cart');
    setIsCartModalOpen(true);
  };

  const handleRemoveFromCart = (giftId: string) => {
    setCartItems(prev => {
      const next = prev.filter(g => g.id !== giftId);
      if (next.length === 0) setIsCartModalOpen(false);
      return next;
    });
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
    if (contributionSuccess) {
      setCartItems([]);
      setContributionSuccess(false);
      setGiftFlowStep('cart');
      setGiftShareMode(null);
    }
  };

  const handleChooseShareMode = (mode: 'solo' | 'compartido') => {
    setGiftShareMode(mode);
    setContributionAmount(cartTotal.toString());
    setDedicationMessage('');
    setGiverName('');
    setGiverEmail('');
    setReceiptFileName('');
    setGiftFlowStep('data');
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === 'transferencia' && !receiptFileName) {
      alert('Por favor adjuntá o confirmá el comprobante de transferencia bancaria.');
      return;
    }

    if (paymentMethod === 'mercadopago') {
      setIsProcessingMp(true);
      setTimeout(() => {
        setIsProcessingMp(false);
        finalizeGiftSubmission('confirmado');
      }, 1000);
    } else {
      finalizeGiftSubmission('pendiente');
    }
  };

  const finalizeGiftSubmission = (status: 'pendiente' | 'confirmado') => {
    const amountNum = Number(contributionAmount) || cartTotal || 15000;

    cartItems.forEach((gift) => {
      const share = cartItems.length === 1
        ? amountNum
        : Math.round(amountNum * (gift.targetPrice / (cartTotal || 1)));

      if (onGiftContribute) {
        onGiftContribute(gift.id, share);
      }

      if (onAddReceivedGift) {
        onAddReceivedGift({
          giftId: gift.id,
          giftTitle: gift.title,
          giverName: giverName.trim() || 'Invitado anónimo',
          giverEmail: giverEmail.trim() || undefined,
          amount: share,
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod,
          receiptUrl: paymentMethod === 'transferencia' ? 'https://example.com/receipt.pdf' : undefined,
          receiptFileName: paymentMethod === 'transferencia' ? (receiptFileName || 'comprobante_banco.pdf') : undefined,
          status: status,
          dedicationMessage: dedicationMessage.trim() || undefined,
        });
      }
    });

    setContributionSuccess(true);
    setTimeout(() => {
      setContributionSuccess(false);
      setCartItems([]);
      setIsCartModalOpen(false);
      setGiftFlowStep('cart');
      setGiftShareMode(null);
    }, 2800);
  };

  const containerClass = isStandalone
    ? "min-h-screen bg-stone-100 flex flex-col font-sans"
    : "fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex justify-center p-2 sm:p-6 animate-fade-in";

  const cardClass = isStandalone
    ? "w-full max-w-5xl mx-auto bg-white min-h-screen flex flex-col shadow-xl border-x border-gray-200"
    : "relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[92vh]";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        {/* Top bar with real url and guest view label */}
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="ml-2 text-gray-300 font-mono text-[11px] hidden sm:inline">
              weda.ar/r/{wedding.slug || 'sofia-y-martin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isStandalone && (
              <button
                type="button"
                onClick={() => {
                  try {
                    window.open(`${window.location.origin}${window.location.pathname}?guest=1`, '_blank');
                  } catch {
                    // ignore
                  }
                }}
                className="uppercase hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-[11px] font-normal transition-colors cursor-pointer"
                title="Abrir en nueva pestaña"
              >
                <span>Abrir en nueva pestaña</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-semibold tracking-wide">
              {isStandalone ? 'WEB PÚBLICA EN VIVO' : 'EXPERIENCIA DE INVITADOS'}
            </span>

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              title={isStandalone ? "Volver al panel" : "Cerrar"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Microsite Body Scrollable */}
        <div ref={scrollContainerRef} className="overflow-y-auto flex-1 font-sans">
        {micrositeView === 'home' && (
        <>
          {/* Hero Banner */}
          <div className="relative h-80 sm:h-96 w-full flex items-center justify-center text-center p-6 text-white overflow-hidden">
            <img
              src={wedding.bannerImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"}
              alt="Boda"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/35"></div>

            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/90 mb-2">
                ¡Nos casamos!
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-white mb-3">
                {wedding.coupleName}
              </h1>
              <p className="text-sm sm:text-base text-white/90 font-light max-w-md mx-auto mb-6">
                15 de Noviembre de 2027 • Buenos Aires
              </p>

              {/* Countdown timer */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 bg-black/40 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
                <div>
                  <span className="block text-xl sm:text-2xl font-bold font-mono">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase text-white/70">Días</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold font-mono">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase text-white/70">Horas</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold font-mono">{timeLeft.minutes}</span>
                  <span className="text-[10px] uppercase text-white/70">Min</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold font-mono">{timeLeft.seconds}</span>
                  <span className="text-[10px] uppercase text-white/70">Seg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Couple Story & Dress Code */}
          <div className="py-12 px-6 max-w-2xl mx-auto text-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mx-auto mb-3" />
            <h2 className="text-2xl font-serif font-normal text-gray-900 mb-3">Nuestra Historia</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {wedding.storyText}
            </p>
            <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full text-xs text-gray-700 font-medium">
              <span>Código de Vestimenta:</span>
              <span className="font-semibold text-gray-900">{wedding.dressCode}</span>
            </div>
          </div>

          {/* Itinerary Events */}
          <div className="bg-stone-50 py-12 px-6 border-y border-stone-200">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-serif font-normal text-center text-gray-900 mb-8">
                Cuándo y Dónde
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{ev.title}</h3>
                    <p className="text-xs font-medium text-gray-700 mb-2">{ev.locationName}</p>
                    <p className="text-xs text-gray-500 mb-4">{ev.address}</p>
                    <p className="text-xs text-gray-600 mb-4 italic">{ev.description}</p>
                    
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(ev.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-black underline"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Ver en Google Maps
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="py-12 px-6 max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Confirmación de Asistencia
              </span>
              <h2 className="text-2xl font-serif font-normal text-gray-900 mt-1">
                ¿Nos acompañás?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Por favor confirmá tu asistencia antes del 15 de Octubre de 2027.
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-900 animate-fade-in">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-base mb-1">¡Gracias por confirmar!</h3>
                <p className="text-xs text-emerald-700">
                  Hemos registrado tu respuesta exitosamente. ¡Nos vemos en la fiesta!
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-emerald-800 underline"
                >
                  Editar respuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Ej. Camila Rodriguez"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ¿Asistís?
                    </label>
                    <select
                      value={rsvpAttending}
                      onChange={(e) => setRsvpAttending(e.target.value as 'yes' | 'no')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="yes">¡Sí, ahí estaré!</option>
                      <option value="no">No podré asistir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Acompañantes
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Restricción alimentaria (Opcional)
                  </label>
                  <input
                    type="text"
                    value={rsvpDiet}
                    onChange={(e) => setRsvpDiet(e.target.value)}
                    placeholder="Ninguna / Celíaco / Vegetariano"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="uppercase w-full py-3 bg-[#0f172a] hover:bg-black text-white font-normal rounded-lg text-xs sm:text-xs transition-all shadow-xs cursor-pointer mt-2"
                >
                  Enviar confirmación
                </button>
              </form>
            )}
          </div>

          {/* Teaser hacia la lista de regalos — no muestra los regalos acá, deriva a su propia pantalla */}
          <div className="bg-stone-50 py-12 px-6 border-t border-stone-200 text-center">
            <div className="max-w-md mx-auto">
              <Gift className="w-7 h-7 text-gray-700 mx-auto mb-3" />
              <h2 className="text-2xl font-serif font-normal text-gray-900">
                ¿Nos querés regalar algo?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Tu presencia es nuestro mejor regalo. Si querés hacernos un presente, armamos una lista con cariño para esta nueva etapa.
              </p>
              <button
                type="button"
                onClick={handleGoToGifts}
                className="uppercase mt-5 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal transition-all cursor-pointer shadow-xs"
              >
                <Gift className="w-4 h-4" />
                Ver lista de regalos
              </button>
            </div>
          </div>

          {/* Footer of the microsite */}
          <div className="py-8 text-center text-xs text-gray-400 bg-white border-t border-gray-100">
            <span>Diseñado con amor en Weda • {wedding.coupleName}</span>
          </div>
        </>
        )}

        {micrositeView === 'gifts' && (
        <div className="min-h-full">
          {/* Back to the invitation */}
          <div className="px-6 py-4 border-b border-stone-200 bg-white">
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a la invitación
            </button>
          </div>

          {/* Lista de Regalos / Datos bancarios */}
          <div className="bg-stone-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <Gift className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                <h2 className="text-2xl font-serif font-normal text-gray-900">
                  Lista de Regalos
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
                  Tu presencia es nuestro mejor regalo. Si deseás hacernos un presente, podés elegir un regalo simbólico o colaborar con nuestra luna de miel.
                </p>

                {/* Bank alias card */}
                <div className="mt-4 inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs">
                  <div className="text-left text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Alias CBU / Mercado Pago</span>
                    <span className="font-mono font-bold text-gray-900">{wedding.bankAlias}</span>
                  </div>
                  <button
                    onClick={handleCopyAlias}
                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors cursor-pointer"
                    title="Copiar alias"
                  >
                    {copiedAlias ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gifts Grid - Total collected amount is hidden per user request */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div key={gift.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-gray-300 transition-colors">
                    <div className="h-36 overflow-hidden relative">
                      <img
                        src={gift.imageUrl}
                        alt={gift.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                        {gift.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">{gift.title}</h4>
                        <p className="text-xs text-gray-500 mb-3">{gift.description}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-xs mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-gray-500 text-[11px]">Valor sugerido:</span>
                          <span className="font-bold text-gray-900">AR$ {gift.targetPrice.toLocaleString()}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(gift)}
                          className={`uppercase w-full py-2 rounded-lg text-xs font-normal transition-all cursor-pointer shadow-xs ${ cartItems.some(g => g.id === gift.id) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-gray-900 text-white hover:bg-black' }`}
                        >
                          {cartItems.some(g => g.id === gift.id) ? 'En tu carrito ✓' : 'Regalá'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
        </div>

        {/* Floating cart pill: reopens the wizard after "Agregar otro regalo" */}
        {cartItems.length > 0 && !isCartModalOpen && (
          <button
            type="button"
            onClick={() => setIsCartModalOpen(true)}
            className="uppercase fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-gray-900 hover:bg-black text-white pl-4 pr-3 py-3 rounded-full shadow-xl text-xs font-normal transition-all cursor-pointer animate-fade-in"
          >
            <Gift className="w-4 h-4" />
            Tu carrito de regalos
            <span className="bg-white text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
              {cartItems.length}
            </span>
          </button>
        )}

        {/* Modal for contributing to gifts: cart summary + 4-step wizard */}
        {isCartModalOpen && cartItems.length > 0 && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-fade-in">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full w-fit mb-1">
                    <Heart className="w-3 h-3 fill-rose-600" />
                    Regalo para {wedding.coupleName}
                  </div>
                  {giftFlowStep === 'cart' ? (
                    <h3 className="font-bold text-base text-gray-900">
                      {cartItems.length === 1 ? cartItems[0].title : `${cartItems.length} regalos elegidos`}
                    </h3>
                  ) : (
                    <h3 className="font-bold text-base text-gray-900">
                      {cartItems.length === 1 ? cartItems[0].title : `${cartItems.length} regalos`}
                    </h3>
                  )}
                </div>
                <button
                  onClick={handleCloseCartModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {contributionSuccess ? (
                <div className="py-8 text-center text-emerald-800 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-950">¡Muchas gracias, {giverName || 'Amigo/a'}!</h4>
                    <p className="text-xs text-emerald-800 mt-1">
                      Tu regalo y dedicatoria fueron enviados exitosamente a los novios.
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-medium">
                    {paymentMethod === 'transferencia'
                      ? '✓ Comprobante recibido. La pareja lo revisará en su panel.'
                      : '✓ Pago acreditado instantáneamente con Mercado Pago.'}
                  </div>
                </div>
              ) : giftFlowStep === 'cart' ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((gift) => (
                      <div key={gift.id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3">
                        <img
                          src={gift.imageUrl}
                          alt={gift.title}
                          className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{gift.title}</p>
                          <p className="text-[11px] text-gray-500">Cantidad: 1</p>
                          <p className="text-xs font-semibold text-gray-900">AR$ {gift.targetPrice.toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(gift.id)}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold shrink-0 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-bold">
                    <span>Total</span>
                    <span>AR$ {cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCartModalOpen(false)}
                    className="uppercase w-full py-2.5 border border-gray-300 rounded-lg text-xs font-normal text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    + Agregar otro regalo
                  </button>

                  <button
                    type="button"
                    onClick={() => setGiftFlowStep('how')}
                    className="uppercase w-full py-3 bg-gray-900 hover:bg-black text-white font-normal rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                  >
                    Continuar
                  </button>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="flex items-start justify-between mb-6 mt-2 px-1">
                    {([
                      { key: 'how', label: ['Elegir cómo', 'regalar'] },
                      { key: 'data', label: ['Cargar datos', 'personales'] },
                      { key: 'confirm', label: ['Confirmar', 'regalo'] },
                      { key: 'payment', label: ['Realizar', 'pago'] },
                    ] as const).map((step, idx, arr) => {
                      const order = arr.map(s => s.key);
                      const currentIdx = order.indexOf(giftFlowStep);
                      const isDone = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <React.Fragment key={step.key}>
                          <div className="flex flex-col items-center gap-1 text-center w-16">
                            <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${
                              isCurrent || isDone ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-400'
                            }`}>
                              {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span className={`text-[9px] leading-tight ${isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                              {step.label[0]}<br />{step.label[1]}
                            </span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`flex-1 h-px mx-0.5 mt-3.5 ${isDone ? 'bg-gray-900' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {giftFlowStep === 'how' && (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handleChooseShareMode('solo')}
                        className="w-full p-5 rounded-xl bg-gray-900 hover:bg-black text-white text-left transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-bold">Regalo solo</p>
                        <p className="text-[11px] text-white/70 mt-0.5">
                          Pagás vos el regalo completo (AR$ {cartTotal.toLocaleString()}).
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseShareMode('compartido')}
                        className="w-full p-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-left transition-colors cursor-pointer border border-gray-200"
                      >
                        <p className="text-sm font-bold">Regalo compartido</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Aportás una parte y otros invitados suman hasta completarlo.
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftFlowStep('cart')}
                        className="uppercase w-full py-2.5 border border-gray-300 rounded-lg text-xs font-normal text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Volver
                      </button>
                    </div>
                  )}

                  {giftFlowStep === 'data' && (
                    <form
                      onSubmit={(e) => { e.preventDefault(); setGiftFlowStep('confirm'); }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tu nombre o familia *
                        </label>
                        <input
                          type="text"
                          required
                          value={giverName}
                          onChange={(e) => setGiverName(e.target.value)}
                          placeholder="Ej: Familia Morales / Lucas y Flor"
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Email (opcional)
                        </label>
                        <input
                          type="email"
                          value={giverEmail}
                          onChange={(e) => setGiverEmail(e.target.value)}
                          placeholder="tuemail@ejemplo.com"
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Mensaje / Dedicatoria para la pareja ✨
                        </label>
                        <textarea
                          rows={2}
                          value={dedicationMessage}
                          onChange={(e) => setDedicationMessage(e.target.value)}
                          placeholder="¡Les deseamos toda la felicidad del mundo en esta nueva etapa!..."
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Monto a regalar (AR$)
                          {giftShareMode === 'solo' && (
                            <span className="text-gray-400 font-normal"> · regalo completo</span>
                          )}
                        </label>
                        <input
                          type="number"
                          required
                          min={1000}
                          step={1000}
                          value={contributionAmount}
                          onChange={(e) => setContributionAmount(e.target.value)}
                          disabled={giftShareMode === 'solo'}
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        {giftShareMode === 'compartido' && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Precio total del regalo: AR$ {cartTotal.toLocaleString()}. Podés aportar una parte.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Elegí tu forma de pago:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('transferencia')}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              paymentMethod === 'transferencia'
                                ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                              <Building2 className="w-4 h-4 text-emerald-700" />
                              <span>Transferencia</span>
                            </div>
                            <span className="text-[10px] text-gray-500">Banco / CVU (Subir comprobante)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('mercadopago')}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              paymentMethod === 'mercadopago'
                                ? 'border-gray-900 bg-blue-50/50 ring-1 ring-gray-900'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                              <span>Mercado Pago</span>
                            </div>
                            <span className="text-[10px] text-gray-500">Confirmación directa en el acto</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGiftFlowStep('how')}
                          className="uppercase flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-normal text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Volver
                        </button>
                        <button
                          type="submit"
                          className="uppercase flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-normal rounded-lg text-xs cursor-pointer"
                        >
                          Siguiente
                        </button>
                      </div>
                    </form>
                  )}

                  {giftFlowStep === 'confirm' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5 text-xs">
                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500 shrink-0">Regalo</span>
                          <span className="font-semibold text-gray-900 text-right">
                            {cartItems.map(g => g.title).join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Modalidad</span>
                          <span className="font-semibold text-gray-900">
                            {giftShareMode === 'solo' ? 'Regalo solo' : 'Regalo compartido'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">De parte de</span>
                          <span className="font-semibold text-gray-900">{giverName || '—'}</span>
                        </div>
                        {dedicationMessage && (
                          <div>
                            <span className="text-gray-500 block mb-0.5">Dedicatoria</span>
                            <span className="text-gray-800 italic">"{dedicationMessage}"</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Método de pago</span>
                          <span className="font-semibold text-gray-900">
                            {paymentMethod === 'transferencia' ? 'Transferencia bancaria' : 'Mercado Pago'}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2.5 mt-1">
                          <span className="font-bold text-gray-900">Monto a regalar</span>
                          <span className="font-bold text-gray-900">
                            AR$ {(Number(contributionAmount) || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGiftFlowStep('data')}
                          className="uppercase flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-normal text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={() => setGiftFlowStep('payment')}
                          className="uppercase flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-normal rounded-lg text-xs cursor-pointer"
                        >
                          Confirmar y pagar
                        </button>
                      </div>
                    </div>
                  )}

                  {giftFlowStep === 'payment' && (
                    <div className="space-y-4">
                      {paymentMethod === 'transferencia' ? (
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2.5 text-xs">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <div>
                              <span className="text-[10px] text-gray-400 block uppercase font-medium">Banco:</span>
                              <span className="font-semibold text-gray-900">{wedding.bankName || 'Banco Santander'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block uppercase font-medium">Titular:</span>
                              <span className="font-semibold text-gray-900">{wedding.bankHolder}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Alias:</span>
                              <span className="font-mono font-bold text-gray-900">{wedding.bankAlias}</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyAlias}
                              className="uppercase px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-normal text-gray-700 cursor-pointer"
                            >
                              {copiedAlias ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>

                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                            <div className="truncate mr-2">
                              <span className="text-[10px] text-gray-400 uppercase font-semibold block">CBU:</span>
                              <span className="font-mono text-xs text-gray-700">{wedding.bankCbu}</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyCbu}
                              className="uppercase px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-normal text-gray-700 cursor-pointer shrink-0"
                            >
                              {copiedCbu ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>

                          {/* Receipt Upload field */}
                          <div className="pt-1">
                            <label className="block text-xs font-semibold text-gray-800 mb-1">
                              Subir comprobante de transferencia *
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-white text-center hover:bg-gray-50 transition-colors">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                id="receipt-file-input"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setReceiptFileName(e.target.files[0].name);
                                  }
                                }}
                              />
                              <label
                                htmlFor="receipt-file-input"
                                className="cursor-pointer flex flex-col items-center justify-center gap-1"
                              >
                                <UploadCloud className="w-5 h-5 text-gray-400" />
                                {receiptFileName ? (
                                  <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{receiptFileName}</span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-xs text-gray-700 font-medium">
                                      Hacé clic para adjuntar comprobante (PDF o imagen)
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      O seleccioná un archivo de prueba
                                    </span>
                                  </>
                                )}
                              </label>
                              {!receiptFileName && (
                                <button
                                  type="button"
                                  onClick={() => setReceiptFileName('comprobante_transferencia_ok.pdf')}
                                  className="mt-1.5 text-[10px] text-emerald-700 underline font-semibold"
                                >
                                  + Adjuntar comprobante simulado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Mercado Pago instructions */
                        <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-blue-950">Mercado Pago Directo</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                              Acreditación Inmediata
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-800">
                            Alias Mercado Pago: <span className="font-mono font-bold">{wedding.mercadoPagoAlias || wedding.bankAlias}</span>
                          </p>
                          <p className="text-[11px] text-gray-600">
                            Al confirmar, se procesa la confirmación automática del regalo para que la pareja lo reciba confirmado.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGiftFlowStep('confirm')}
                          className="uppercase flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-normal text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmPayment}
                          disabled={isProcessingMp}
                          className="uppercase flex-[2] py-3 bg-gray-900 hover:bg-black text-white font-normal rounded-xl text-xs sm:text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isProcessingMp
                            ? 'Confirmando con Mercado Pago...'
                            : paymentMethod === 'transferencia'
                            ? `Confirmar regalo y comprobante (AR$ ${(Number(contributionAmount) || 0).toLocaleString()})`
                            : `Confirmar con Mercado Pago (AR$ ${(Number(contributionAmount) || 0).toLocaleString()})`}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
