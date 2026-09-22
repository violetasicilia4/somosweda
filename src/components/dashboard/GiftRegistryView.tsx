import React, { useState } from 'react';
import { GiftItem, WeddingData } from '../../types';
import { suggestedGiftsByCategory, predefinedGiftSets, GiftSet } from '../../data/initialData';
import { CobrosView } from './CobrosView';
import {
  Plus,
  Trash2,
  Check,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Lock,
  Calendar,
  MapPin,
  Wallet,
  Gift as GiftIcon,
} from 'lucide-react';

interface GiftRegistryViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onAddGiftsFromSet: (items: Omit<GiftItem, 'id'>[]) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onReorderGifts?: (newGifts: GiftItem[]) => void;
  onOpenMicrosite?: () => void;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
}

// 5 Categorías pensadas desde la perspectiva de los novios
interface CategoryMeta {
  id: string;
  name: string;
  emoji: string;
  examples: string;
}

const REGISTRY_CATEGORIES: CategoryMeta[] = [
  { id: 'Luna de miel', name: 'Luna de miel', emoji: '✈️', examples: 'Pasajes, hotel, excursiones, cena romántica' },
  { id: 'Casa y hogar', name: 'Casa y hogar', emoji: '🏠', examples: 'Cafetera, vajilla, mesa comedor, sofá, sábanas' },
  { id: 'La boda', name: 'La boda', emoji: '💍', examples: 'Fotógrafo, barra de tragos, flores, música y DJ' },
  { id: 'Salidas y experiencias', name: 'Salidas y experiencias', emoji: '🍽️', examples: 'Degustación de vinos, spa, cocina, velero' },
  { id: 'Aporte libre', name: 'Aporte libre', emoji: '💰', examples: 'Aporte libre para el futuro, casa propia, remodelación' },
];

export const GiftRegistryView: React.FC<GiftRegistryViewProps> = ({
  wedding,
  gifts,
  onAddGift,
  onAddGiftsFromSet,
  onDeleteGift,
  onUpdateGift,
  onReorderGifts,
  onOpenMicrosite,
  onUpdateWedding,
}) => {
  // Setup del registro: métodos de pago primero si todavía no están cargados,
  // igual que en Confites (pestañas con estado antes de poder compartir la lista).
  const isPaymentConfigured = Boolean(wedding.bankAlias?.trim() || wedding.mercadoPagoAlias?.trim());
  const [activeSection, setActiveSection] = useState<'pago' | 'lista'>(
    isPaymentConfigured ? 'lista' : 'pago'
  );

  // Category filter for suggested gifts catalog
  const [selectedCategory, setSelectedCategory] = useState<string>('Luna de miel');

  // Custom gift modal
  const [isCustomGiftOpen, setIsCustomGiftOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customPrice, setCustomPrice] = useState('75000');
  const [customCategory, setCustomCategory] = useState<string>('Casa y hogar');
  const [customImage, setCustomImage] = useState(
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80'
  );

  // Edit existing gift modal
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('Casa y hogar');
  const [editImage, setEditImage] = useState('');

  // Share feedback toast
  const [copiedShare, setCopiedShare] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  // Helper: check if gift is in active list
  const isGiftInList = (title: string) => {
    return gifts.some(g => g.title.toLowerCase().trim() === title.toLowerCase().trim());
  };

  // Helper: natural readable wedding date
  const formatWeddingDateNatural = (dateStr: string): string => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${day} de ${months[monthIndex]} de ${year}`;
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatWeddingDateNatural(wedding.weddingDate);

  // Share the real, working preview link (same URL "Ver mi web" opens)
  const handleSharePreview = () => {
    if (typeof window !== 'undefined') {
      const guestUrl = `${window.location.origin}${window.location.pathname}?guest=1`;
      navigator.clipboard.writeText(guestUrl);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  // Open the real microsite in a new tab — exactly what guests will see, no preview/simulation
  const handleViewMyWeb = () => {
    if (onOpenMicrosite) {
      onOpenMicrosite();
    }
  };

  // Reorder gifts
  const handleMoveGift = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gifts.length) return;
    const updated = [...gifts];
    const item = updated.splice(index, 1)[0];
    updated.splice(newIndex, 0, item);
    if (onReorderGifts) {
      onReorderGifts(updated);
    }
  };

  // Open Edit Modal for a gift
  const handleOpenEdit = (gift: GiftItem) => {
    setEditingGift(gift);
    setEditTitle(gift.title);
    setEditDesc(gift.description);
    setEditPrice(String(gift.targetPrice));
    setEditCategory(gift.category || 'Casa y hogar');
    setEditImage(gift.imageUrl);
  };

  // Save edited gift
  const handleSaveEditGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGift || !editTitle.trim()) return;
    if (onUpdateGift) {
      onUpdateGift(editingGift.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        targetPrice: Number(editPrice) || 75000,
        category: editCategory,
        imageUrl: editImage,
      });
    }
    setEditingGift(null);
    setAddedFeedback(`"${editTitle.trim()}" actualizado`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  // Create custom gift
  const handleCreateCustomGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onAddGift({
      title: customTitle.trim(),
      description: customDesc.trim() || 'Regalo seleccionado para nuestra boda.',
      targetPrice: Number(customPrice) || 75000,
      category: customCategory,
      imageUrl: customImage,
      isCustom: true,
    });

    setCustomTitle('');
    setCustomDesc('');
    setIsCustomGiftOpen(false);
    setAddedFeedback(`"${customTitle.trim()}" agregado a tu lista`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  // Add suggestion to list
  const handleAddSuggestion = (item: { title: string; description: string; targetPrice: number; category: string; imageUrl: string }) => {
    onAddGift({
      title: item.title,
      description: item.description,
      targetPrice: item.targetPrice,
      category: item.category,
      imageUrl: item.imageUrl,
    });
    setAddedFeedback(`"${item.title}" agregado a tu lista`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  // Predefined gift sets: "Elegí un estilo para tu lista", igual que los sets de Confites
  const isSetApplied = (set: GiftSet) => set.items.every(item => isGiftInList(item.title));

  const handleUseSet = (set: GiftSet) => {
    if (isSetApplied(set)) return;
    onAddGiftsFromSet(set.items);
    setAddedFeedback(`Set "${set.name}" agregado a tu lista`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  const handleGoToPersonalize = () => {
    setIsCustomGiftOpen(true);
  };


  return (
    <div className="space-y-8 animate-fade-in font-sans pb-24">
      {/* Floating feedback toast */}
      {addedFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-gray-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedFeedback}</span>
        </div>
      )}

      {/* 1. HERO SUPERIOR: compacto, para que la lista de regalos sea protagonista */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-gray-950 text-white min-h-[160px] sm:min-h-[190px] flex flex-col justify-between p-5 sm:p-6">
        {/* Background Wedding Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src={wedding.bannerImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'}
            alt={wedding.coupleName}
            className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
        </div>

        {/* Top Badges Row: Estado + acciones secundarias de previsualización */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
            {wedding.status === 'PUBLICADO' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sitio Público en Vivo</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Borrador Privado</span>
              </>
            )}
          </div>

          {/* Secundario a propósito: previsualizar no es la acción principal de esta pantalla */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleViewMyWeb}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abrir el micrositio real como invitado"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver mi web</span>
            </button>
            <button
              type="button"
              onClick={handleSharePreview}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar enlace público de la lista"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300 font-semibold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Hero Information: lo primero que la pareja identifica como "esto es mío" */}
        <div className="relative z-10 space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            Estás armando la lista de regalos de
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            {wedding.coupleName || 'Sofía & Martín'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/90 flex flex-wrap items-center gap-2 drop-shadow-xs">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-300" />
              {formattedDate}
            </span>
            {wedding.venue && (
              <>
                <span className="text-white/50">•</span>
                <span className="inline-flex items-center gap-1.5 text-white/85">
                  <MapPin className="w-3.5 h-3.5 text-amber-300/90" />
                  {wedding.venue}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* 2. SETUP: métodos de pago y lista, con estado de avance — como en Confites */}
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setActiveSection('pago')}
          className={`flex-1 min-w-[220px] flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSection === 'pago'
              ? 'bg-gray-900 border-gray-900 text-white shadow-xs'
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
          }`}
        >
          <Wallet className={`w-5 h-5 shrink-0 ${activeSection === 'pago' ? 'text-amber-300' : 'text-gray-400'}`} />
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-bold">Métodos de pago</span>
            <span className={`block text-[11px] ${activeSection === 'pago' ? 'text-white/70' : 'text-gray-500'}`}>
              CBU, alias y Mercado Pago
            </span>
          </span>
          {isPaymentConfigured ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('lista')}
          className={`flex-1 min-w-[220px] flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSection === 'lista'
              ? 'bg-gray-900 border-gray-900 text-white shadow-xs'
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
          }`}
        >
          <GiftIcon className={`w-5 h-5 shrink-0 ${activeSection === 'lista' ? 'text-amber-300' : 'text-gray-400'}`} />
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-bold">
              Lista de regalos {gifts.length > 0 && `(${gifts.length})`}
            </span>
            <span className={`block text-[11px] ${activeSection === 'lista' ? 'text-white/70' : 'text-gray-500'}`}>
              Elegí un set armado o personalizá el tuyo
            </span>
          </span>
          {gifts.length > 0 ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          )}
        </button>
      </div>

      {activeSection === 'pago' ? (
        <CobrosView wedding={wedding} onUpdateWedding={onUpdateWedding} />
      ) : (
        <>
          {/* 3. SECCIÓN: ELEGÍ UN ESTILO PARA TU LISTA — sets armados o personalizado, como en Confites */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Elegí un estilo para tu lista
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Empezá con un set ya armado y después sumá o sacá lo que quieras. También podés armar la tuya desde cero.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {predefinedGiftSets.map((set) => {
                const applied = isSetApplied(set);
                return (
                  <div key={set.id} className="flex flex-col items-center text-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleUseSet(set)}
                      disabled={applied}
                      className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        applied ? 'border-emerald-400' : 'border-transparent hover:border-gray-300'
                      }`}
                      title={applied ? 'Ya está en tu lista' : `Usar el set "${set.name}"`}
                    >
                      <img
                        src={set.items[0]?.imageUrl}
                        alt={set.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {applied && (
                        <div className="absolute inset-0 bg-emerald-900/50 flex items-center justify-center">
                          <Check className="w-7 h-7 text-white" />
                        </div>
                      )}
                    </button>
                    <div className="space-y-0.5">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {set.badge}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">
                        {set.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseSet(set)}
                      disabled={applied}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        applied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      {applied ? 'En tu lista ✓' : 'Usar este set'}
                    </button>
                  </div>
                );
              })}

              {/* Opción de personalizar, como el "Personalizar" de Confites */}
              <div className="flex flex-col items-center text-center gap-2.5">
                <button
                  type="button"
                  onClick={handleGoToPersonalize}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  title="Crear un regalo personalizado"
                >
                  <Plus className="w-7 h-7" />
                </button>
                <div className="space-y-0.5">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    A tu gusto
                  </span>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">
                    Personalizar
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleGoToPersonalize}
                  className="w-full py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 transition-all cursor-pointer"
                >
                  Crear regalo
                </button>
              </div>
            </div>
          </section>

          {/* 4. SECCIÓN: IDEAS PARA AGREGAR A TU LISTA */}
          <section id="ideas-para-agregar" className="space-y-5 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Ideas para agregar a tu lista
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Inspiración organizada por momentos. Sumá ideas a tu lista en un solo clic.
                </p>
              </div>

              <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full self-start sm:self-auto">
                Seleccioná una categoría:
              </span>
            </div>

            {/* 5 CATEGORÍAS CERCANAS AL PENSAMIENTO DE LOS NOVIOS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {REGISTRY_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const itemsCount = (suggestedGiftsByCategory[cat.id] || []).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {itemsCount}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {cat.name}
                      </h3>
                      <p className={`text-[10px] leading-snug line-clamp-1 mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                        {cat.examples}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* GRID DE SUGERENCIAS DE LA CATEGORÍA ACTIVA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(suggestedGiftsByCategory[selectedCategory] || []).map((item, idx) => {
                const alreadyAdded = isGiftInList(item.title);
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                      alreadyAdded 
                        ? 'border-emerald-200 bg-emerald-50/15' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 pt-2 border-t border-gray-100 space-y-2 bg-gray-50/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Aporte sugerido:</span>
                        <span className="text-xs font-bold text-gray-900">
                          ${item.targetPrice.toLocaleString()}
                        </span>
                      </div>

                      {alreadyAdded ? (
                        <div className="w-full py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ya está en tu lista</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSuggestion(item)}
                          className="w-full py-1.5 bg-white hover:bg-gray-900 text-gray-900 hover:text-white border border-gray-300 hover:border-gray-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar a mi lista</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

      {/* 5. SECCIÓN: NUESTRA LISTA DE REGALOS — solo aparece una vez que hay algo que mostrar */}
      {gifts.length > 0 && (
      <section className="space-y-5 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Nuestra lista de regalos
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {gifts.length} {gifts.length === 1 ? 'regalo' : 'regalos'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Elegí los regalos, experiencias o aportes que les gustaría recibir para esta nueva etapa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomGiftOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>+ Agregar otro</span>
          </button>
        </div>

        {/* LISTA DE REGALOS ACTIVOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gifts.map((gift, index) => (
                  <div
                    key={gift.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo with category badge */}
                      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                        <img
                          src={gift.imageUrl}
                          alt={gift.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide text-white shadow-2xs">
                          {gift.category || 'Regalo'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="p-4 space-y-1">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                          {gift.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {gift.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Aporte sugerido & Actions */}
                    <div className="p-3.5 pt-2 border-t border-gray-100 space-y-2.5 bg-gray-50/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Aporte sugerido:</span>
                        <span className="text-sm font-bold text-gray-900">
                          ${gift.targetPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                        {/* Reorder controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveGift(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded-lg border transition-colors ${
                              index === 0
                                ? 'text-gray-300 border-gray-200/50 cursor-not-allowed'
                                : 'text-gray-600 border-gray-200 hover:bg-white cursor-pointer'
                            }`}
                            title="Subir posición"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveGift(index, 'down')}
                            disabled={index === gifts.length - 1}
                            className={`p-1 rounded-lg border transition-colors ${
                              index === gifts.length - 1
                                ? 'text-gray-300 border-gray-200/50 cursor-not-allowed'
                                : 'text-gray-600 border-gray-200 hover:bg-white cursor-pointer'
                            }`}
                            title="Bajar posición"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit & Remove buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(gift)}
                            className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Editar regalo"
                          >
                            <Edit3 className="w-3 h-3 text-gray-400" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteGift(gift.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Eliminar de la lista"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
      </section>
      )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREAR REGALO PERSONALIZADO                                         */}
      {/* ========================================================================= */}
      {isCustomGiftOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Crear regalo</h3>
                <p className="text-xs text-gray-500">Ingresá el nombre, categoría y aporte sugerido para este regalo.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomGiftOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomGift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre del regalo *
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="ej: Cafetera espresso o Pasajes para nuestra luna de miel"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descripción o detalle (opcional)
                </label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="ej: Para compartir los desayunos de cada mañana juntos."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-medium"
                  >
                    {REGISTRY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Aporte sugerido ($) *
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="75000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL de foto
                </label>
                <input
                  type="url"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCustomGiftOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Agregar a mi lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR REGALO                                                      */}
      {/* ========================================================================= */}
      {editingGift && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Editar regalo</h3>
                <p className="text-xs text-gray-500">Modificá el nombre, descripción, categoría o aporte sugerido.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGift(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre del regalo *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descripción o detalle
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-medium"
                  >
                    {REGISTRY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Aporte sugerido ($) *
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL de foto
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingGift(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
