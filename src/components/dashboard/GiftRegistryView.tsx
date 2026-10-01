import React, { useState } from 'react';
import { GiftItem, ReceivedGift, WeddingData } from '../../types';
import { suggestedGiftsByCategory } from '../../data/initialData';
import { CobrosView } from './CobrosView';
import { ReceivedGiftsView } from './ReceivedGiftsView';
import {
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  X,
  Share2,
  Edit3,
  ExternalLink,
  Plane,
  Home,
  Gem,
  Compass,
  PiggyBank,
  CheckCheck,
  Search,
  LayoutGrid,
  Rows3,
  Gift,
  Heart,
} from 'lucide-react';

interface GiftRegistryViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onOpenMicrosite: () => void;
}

// 5 Categorías pensadas desde la perspectiva de los novios — son los únicos
// "lotes" de regalos: todo lo que se puede sumar a la lista vive dentro de una.
interface CategoryMeta {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string;
}

const REGISTRY_CATEGORIES: CategoryMeta[] = [
  { id: 'Luna de miel', name: 'Luna de miel', icon: Plane, examples: 'Pasajes, hotel, excursiones, cena romántica' },
  { id: 'Proyectos futuros', name: 'Proyectos futuros', icon: PiggyBank, examples: 'Casa propia, remodelación, fondo para lo que viene' },
  { id: 'Regalos simbólicos', name: 'Regalos simbólicos', icon: Gem, examples: 'Un brindis, un café, flores, desde un monto chico' },
  { id: 'Casa y hogar', name: 'Casa y hogar', icon: Home, examples: 'Cafetera, vajilla, mesa comedor, sofá, sábanas' },
  { id: 'Salidas y experiencias', name: 'Salidas y experiencias', icon: Compass, examples: 'Degustación de vinos, spa, cocina, velero' },
]

export const GiftRegistryView: React.FC<GiftRegistryViewProps> = ({
  wedding,
  gifts,
  receivedGifts,
  onAddGift,
  onDeleteGift,
  onUpdateGift,
  onUpdateReceivedGift,
  onUpdateWedding,
  onOpenMicrosite,
}) => {
  // La lista se puede armar entera sin CBU, alias ni Mercado Pago — la cuenta de cobro
  // (más abajo, en esta misma pantalla) es donde se carga, pero no bloquea nada acá.
  // Sólo se exige tenerla cargada recién al publicar (ver el modal de publicación).
  const isPaymentConfigured = Boolean(
    wedding.bankAlias?.trim() || wedding.bankCbu?.trim() || wedding.mercadoPagoAlias?.trim()
  );
  // El módulo de Regalos tiene 3 solapas: la lista en sí, la cuenta de cobro y los
  // regalos recibidos (antes era un ítem aparte del sidebar — configurar el catálogo y
  // agradecer lo que llegó son dos momentos del mismo flujo, no dos secciones distintas).
  const [activeSubTab, setActiveSubTab] = useState<'lista' | 'cobro' | 'recibidos'>('lista');
  const pendingThanksCount = receivedGifts.filter((r) => !r.isThanked).length;

  // Category filter for the gift catalog
  const [selectedCategory, setSelectedCategory] = useState<string>('Luna de miel');
  // "Todos" muestra el catálogo entero sin agrupar; "Por categoría" es la navegación de
  // siempre. El buscador funciona en los dos modos.
  const [viewMode, setViewMode] = useState<'categorias' | 'todos'>('categorias');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Share the real, working link to the gift list (opens straight on the "Regalos" screen)
  const handleSharePreview = () => {
    if (typeof window !== 'undefined') {
      const guestUrl = `${window.location.origin}${window.location.pathname}?example=1`;
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

  // Atajo para cuando el catálogo de una categoría tiene muchos ítems (50-60):
  // sumarlos todos de una, en vez de tildar uno por uno. El tilde individual sigue disponible.
  const handleAddAllInCategory = (categoryId: string) => {
    const items = suggestedGiftsByCategory[categoryId] || [];
    const newOnes = items.filter(item => !isGiftInList(item.title));
    if (newOnes.length === 0) return;
    newOnes.forEach(item => {
      onAddGift({
        title: item.title,
        description: item.description,
        targetPrice: item.targetPrice,
        category: item.category,
        imageUrl: item.imageUrl,
      });
    });
    setAddedFeedback(`${newOnes.length} regalos de "${categoryId}" agregados a tu lista`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  // Complemento de "Agregar todos": sacar todos los de una categoría de una sola vez.
  const handleRemoveAllInCategory = (categoryId: string) => {
    const items = suggestedGiftsByCategory[categoryId] || [];
    let removedCount = 0;
    items.forEach(item => {
      const existing = gifts.find(g => g.title.toLowerCase().trim() === item.title.toLowerCase().trim());
      if (existing) {
        onDeleteGift(existing.id);
        removedCount++;
      }
    });
    if (removedCount === 0) return;
    setAddedFeedback(`${removedCount} regalos de "${categoryId}" sacados de tu lista`);
    setTimeout(() => setAddedFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-24">
      {/* Floating feedback toast */}
      {addedFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-950 text-white px-4 py-3 rounded-3xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-gray-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedFeedback}</span>
        </div>
      )}

      {/* 1. ENCABEZADO: sin foto de portada — todo el protagonismo es para la lista en sí */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {wedding.status === 'PUBLICADO' ? 'Publicada' : 'Borrador · solo vos la ves'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-gray-900 mt-0.5">
            Regalos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {gifts.length > 0
              ? <>Tenés <strong className="text-gray-900 font-bold">{gifts.length}</strong> regalo{gifts.length === 1 ? '' : 's'} en tu lista.</>
              : 'Elegí los regalos que quieras recibir — se arma en el momento, sin pasos extra.'}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenMicrosite}
            className="uppercase px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver tu lista</span>
          </button>
          <button
            type="button"
            onClick={handleSharePreview}
            className="uppercase px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl text-xs font-normal inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Copiar enlace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. SOLAPAS DEL MÓDULO: control segmentado, para que se note que "Cuenta de cobro"
          es otra pantalla adentro del mismo módulo, no una sección más de la lista. */}
      <div className="inline-flex p-1 bg-gray-100 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('lista')}
          className={`px-4 py-2.5 rounded-xl text-xs font-normal uppercase transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
            activeSubTab === 'lista' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Lista de regalos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('cobro')}
          className={`px-4 py-2.5 rounded-xl text-xs font-normal uppercase transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
            activeSubTab === 'cobro' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Cuenta de cobro</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full normal-case ${
              isPaymentConfigured
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {isPaymentConfigured ? 'Configurada' : 'Pendiente'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('recibidos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-normal uppercase transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
            activeSubTab === 'recibidos' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Recibidos</span>
          {pendingThanksCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full normal-case bg-rose-500 text-white">
              {pendingThanksCount}
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'cobro' && (
        <section>
          <CobrosView wedding={wedding} onUpdateWedding={onUpdateWedding} />
        </section>
      )}

      {activeSubTab === 'recibidos' && (
        <section>
          <ReceivedGiftsView receivedGifts={receivedGifts} onUpdateReceivedGift={onUpdateReceivedGift} />
        </section>
      )}

      {/* 3. CATÁLOGO INTERACTIVO: explorar por categoría o ver todo junto, tildar para
          sumar a la lista. */}
      {activeSubTab === 'lista' && (() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const allCatalogItems = Object.values(suggestedGiftsByCategory).flat();
        const baseItems = viewMode === 'categorias'
          ? (suggestedGiftsByCategory[selectedCategory] || [])
          : allCatalogItems;
        const visibleCatalogItems = normalizedQuery
          ? baseItems.filter((item) => item.title.toLowerCase().includes(normalizedQuery))
          : baseItems;
        const visibleCustomGifts = gifts.filter((g) => {
          if (!g.isCustom) return false;
          if (viewMode === 'categorias' && g.category !== selectedCategory) return false;
          if (normalizedQuery && !g.title.toLowerCase().includes(normalizedQuery)) return false;
          return true;
        });
        const noResults = visibleCatalogItems.length === 0 && visibleCustomGifts.length === 0;

        return (
          <section className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-gray-900">
                  Armá tu lista de regalos
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Mirá todo el catálogo junto o navegá por categoría, y buscá por nombre. Tildá para sumar, volvé a tocar para sacar.
                </p>
              </div>

              {/* Todos / Por categoría + buscador */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="inline-flex p-1 bg-gray-100 rounded-xl gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('todos')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-normal uppercase transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      viewMode === 'todos' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Todos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('categorias')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-normal uppercase transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      viewMode === 'categorias' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Rows3 className="w-3.5 h-3.5" />
                    <span>Por categoría</span>
                  </button>
                </div>

                <label className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar un regalo..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </label>
              </div>

              {/* Categorías: solo en modo "Por categoría" */}
              {viewMode === 'categorias' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {REGISTRY_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const itemsCount = (suggestedGiftsByCategory[cat.id] || []).length;
                    const addedInCategory = gifts.filter(g => g.category === cat.name).length;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-3xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                            : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
                          <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            addedInCategory > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : isSelected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {addedInCategory > 0 && <CheckCheck className="w-3 h-3" />}
                            {addedInCategory > 0 ? `${addedInCategory}/${itemsCount}` : itemsCount}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold leading-tight text-gray-900">
                            {cat.name}
                          </h3>
                          <p className="text-[10px] leading-snug line-clamp-1 mt-0.5 text-gray-400">
                            {cat.examples}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Encabezado de la selección activa: atajo para catálogos grandes y "crear
                  regalo específico", acá arriba para no perderse al fondo de la grilla. */}
              {(() => {
                const allAdded = baseItems.length > 0 && baseItems.every(item => isGiftInList(item.title));
                return (
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <h3 className="text-sm font-bold text-gray-900">
                      {viewMode === 'categorias' ? selectedCategory : 'Catálogo completo'}
                      <span className="text-gray-400 font-medium"> · {visibleCatalogItems.length} regalo{visibleCatalogItems.length === 1 ? '' : 's'}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      {viewMode === 'categorias' && (
                        allAdded ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveAllInCategory(selectedCategory)}
                            className="uppercase text-xs font-normal text-emerald-700 hover:text-rose-600 border border-emerald-200 hover:border-rose-200 hover:bg-rose-50 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Quitar todos</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddAllInCategory(selectedCategory)}
                            className="uppercase text-xs font-normal text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                            <span>Agregar todos</span>
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        onClick={handleOpenCustomGift}
                        className="uppercase text-xs font-normal text-gray-700 hover:text-gray-900 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-400" />
                        <span>Crear regalo</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Regalos: mismas tarjetas que ve el invitado en el ejemplo (foto cuadrada,
                  categoría, nombre en serif, monto), con el botón para sumarlo o sacarlo de
                  la lista, sin modal ni pasos extra */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                {visibleCatalogItems.map((item, idx) => {
                  const checked = isGiftInList(item.title);
                  return (
                    <article key={`${item.title}-${idx}`} className="flex flex-col">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded-xl bg-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleSuggestion(item)}
                          title={checked ? 'Quitar de la lista' : 'Agregar a la lista'}
                          className={`absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-colors cursor-pointer ${
                            checked ? 'bg-[#081034] text-white' : 'bg-[#1E3A8A] text-white hover:bg-[#173073]'
                          }`}
                        >
                          {checked ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Plus className="w-4 h-4" strokeWidth={2.25} />}
                        </button>
                      </div>
                      <div className="px-1 pt-3.5">
                        <p className="text-[10px] text-gray-500 truncate">{item.category}</p>
                        <h3 className="text-[13px] font-semibold text-[#282018] leading-snug truncate">{item.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">ARS {item.targetPrice.toLocaleString('es-AR')}</p>
                      </div>
                    </article>
                  );
                })}

                {/* Regalos personalizados que la pareja cargó */}
                {visibleCustomGifts.map((gift) => (
                  <article key={gift.id} className="flex flex-col">
                    <div className="relative">
                      <img
                        src={gift.imageUrl}
                        alt={gift.title}
                        className="w-full aspect-square object-cover rounded-xl bg-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-2.5 -right-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(gift)}
                          aria-label="Editar regalo"
                          className="w-9 h-9 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteGift(gift.id)}
                          aria-label="Eliminar regalo"
                          className="w-9 h-9 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    <div className="px-1 pt-3.5">
                      <p className="text-[10px] text-gray-500 truncate">Personalizado</p>
                      <h3 className="text-[13px] font-semibold text-[#282018] leading-snug truncate">{gift.title}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">ARS {gift.targetPrice.toLocaleString('es-AR')}</p>
                    </div>
                  </article>
                ))}

                {noResults && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-sm text-gray-500">No encontramos regalos para "{searchQuery}".</p>
                  </div>
                )}
              </div>
          </section>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL: CREAR REGALO PERSONALIZADO                                         */}
      {/* ========================================================================= */}
      {isCustomGiftOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Crear regalo</h3>
                <p className="text-xs text-gray-500">Ingresá el nombre, categoría y monto para este regalo.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomGiftOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-medium"
                  >
                    {REGISTRY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Monto ($) *
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="75000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCustomGiftOpen(false)}
                  className="uppercase px-4 py-2 text-xs font-normal text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="uppercase px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal transition-all shadow-xs cursor-pointer"
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
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Editar regalo</h3>
                <p className="text-xs text-gray-500">Modificá el nombre, descripción, categoría o monto.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGift(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-medium"
                  >
                    {REGISTRY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Monto ($) *
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900"
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
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-gray-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingGift(null)}
                  className="uppercase px-4 py-2 text-xs font-normal text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="uppercase px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal transition-all shadow-xs cursor-pointer"
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
