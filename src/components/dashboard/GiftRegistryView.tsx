import React, { useState } from 'react';
import { GiftItem, WeddingData } from '../../types';
import { suggestedGiftsByCategory } from '../../data/initialData';
import {
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  X,
  Share2,
  Edit3,
  Lock,
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface GiftRegistryViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onOpenMicrosite: () => void;
}

// 5 Categorías pensadas desde la perspectiva de los novios — son los únicos
// "lotes" de regalos: todo lo que se puede sumar a la lista vive dentro de una.
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
  onDeleteGift,
  onUpdateGift,
  onOpenMicrosite,
}) => {
  // Sin gate de cobro acá: la lista se arma entera sin CBU, alias ni Mercado Pago.
  // Eso se pide recién al publicar la boda (ver el modal de publicación).

  // Category filter for the gift catalog
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

  // Share the real, working link to the gift list (opens straight on the "Regalos" screen)
  const handleSharePreview = () => {
    if (typeof window !== 'undefined') {
      const guestUrl = `${window.location.origin}${window.location.pathname}?guest=1`;
      navigator.clipboard.writeText(guestUrl);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
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

  // Create custom gift — siempre queda anclado a una categoría, como cualquier otro regalo
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

  const handleOpenCustomGift = () => {
    setCustomCategory(selectedCategory);
    setIsCustomGiftOpen(true);
  };

  // Tildar / destildar un regalo del catálogo: un solo gesto para sumar o sacar
  const handleToggleSuggestion = (item: { title: string; description: string; targetPrice: number; category: string; imageUrl: string }) => {
    const existing = gifts.find(g => g.title.toLowerCase().trim() === item.title.toLowerCase().trim());
    if (existing) {
      onDeleteGift(existing.id);
      return;
    }
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

        {/* Top Badges Row: Estado */}
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

      {/* 2. CTA PRINCIPAL: ver la experiencia pública real, sin simulaciones */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onOpenMicrosite}
            className="flex-1 sm:flex-none px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-sm font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver mi lista</span>
          </button>
          <button
            type="button"
            onClick={handleSharePreview}
            className="px-4 py-3.5 border border-gray-200 hover:bg-gray-50 rounded-2xl text-sm font-semibold text-gray-700 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">¡Enlace copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gray-500" />
                <span>Copiar enlace</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-gray-400">
          Así la ven tus invitados: la web pública real, no una simulación.
        </p>
      </div>

      {/* 3. UNA SOLA EXPERIENCIA: elegir categoría, tildar/destildar regalos y ver
          en todo momento lo que ya sumaste — sin secciones separadas ni pasos extra.
          No depende de tener métodos de cobro configurados. */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Armá tu lista de regalos
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Elegí una categoría y tildá los regalos que quieras recibir. Podés destildarlos cuando quieras y combinar todas las categorías.
          </p>
        </div>

          {/* Resumen liviano de lo ya elegido — siempre visible, se puede sacar desde acá */}
          {gifts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs font-bold text-gray-700 shrink-0">
                Tu lista ({gifts.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {gifts.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-2.5 pr-1.5 py-1 text-[11px] font-medium text-gray-700"
                  >
                    {g.title}
                    <button
                      type="button"
                      onClick={() => onDeleteGift(g.id)}
                      className="p-0.5 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-600 cursor-pointer transition-colors"
                      title="Sacar de la lista"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categorías: los únicos "lotes" de regalos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
            {REGISTRY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const itemsCount = (suggestedGiftsByCategory[cat.id] || []).length;
              const addedInCategory = gifts.filter(g => g.category === cat.name).length;
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
                      addedInCategory > 0
                        ? isSelected ? 'bg-emerald-400/90 text-emerald-950' : 'bg-emerald-100 text-emerald-700'
                        : isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {addedInCategory > 0 ? `${addedInCategory} ✓` : itemsCount}
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

          {/* Regalos de la categoría activa: tarjetas tildables, sin modal ni pasos extra */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(suggestedGiftsByCategory[selectedCategory] || []).map((item, idx) => {
              const checked = isGiftInList(item.title);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleSuggestion(item)}
                  className={`text-left bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs cursor-pointer ${
                    checked ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      checked ? 'bg-gray-900 border-gray-900' : 'bg-white/90 border-white'
                    }`}>
                      {checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1.5">
                      <span className="text-gray-500 font-medium">Aporte sugerido:</span>
                      <span className="font-bold text-gray-900">${item.targetPrice.toLocaleString()}</span>
                    </div>
                    {checked && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 pt-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Agregado a tu lista</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Regalos personalizados que la pareja cargó dentro de esta categoría */}
            {gifts.filter(g => g.isCustom && g.category === selectedCategory).map((gift) => (
              <div
                key={gift.id}
                className="relative bg-white rounded-2xl border-2 border-gray-900 overflow-hidden shadow-2xs"
              >
                <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                  <img
                    src={gift.imageUrl}
                    alt={gift.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                    Personalizado
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                    {gift.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {gift.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <span className="text-gray-500 font-medium">Aporte sugerido:</span>
                    <span className="font-bold text-gray-900">${gift.targetPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(gift)}
                      className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 text-gray-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteGift(gift.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Siempre disponible: un regalo puntual que no está en el catálogo */}
          <button
            type="button"
            onClick={handleOpenCustomGift}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 border border-dashed border-gray-300 hover:border-gray-400 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gray-400" />
            <span>Crear un regalo específico en "{selectedCategory}"</span>
          </button>
      </section>

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
