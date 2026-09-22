import React, { useState } from 'react';
import { WeddingData, WeddingEvent, GiftItem } from '../../types';
import { 
  Eye, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Plus,
  Trash2,
  Edit3,
  X,
  Shirt,
  Hotel,
  Navigation,
  Bus,
  ChevronRight,
  PartyPopper,
  Church,
  Music,
  SlidersHorizontal,
  Gift,
  UserCheck,
  CheckSquare,
  Square,
  Volume2
} from 'lucide-react';

interface MicrositeBuilderViewProps {
  wedding: WeddingData;
  events: WeddingEvent[];
  gifts: GiftItem[];
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onOpenMicrosite: () => void;
}

export interface MicrositeFeaturesState {
  countdown: boolean;      // Cuenta regresiva
  story: boolean;          // Nuestra historia
  events: boolean;         // Cronograma de eventos
  guestInfo: boolean;      // Info para invitados (Dress code, hospedaje, mapa, transporte)
  gallery: boolean;        // Galería de fotos
  giftRegistry: boolean;   // Lista de regalos
  rsvp: boolean;           // Confirmación de asistencia (RSVP)
  music: boolean;          // Sugerir música para la fiesta
}

export const MicrositeBuilderView: React.FC<MicrositeBuilderViewProps> = ({
  wedding,
  events,
  gifts,
  onUpdateWedding,
  onOpenMicrosite,
}) => {
  // FEATURES SECTIONS TOGGLE STATE (Tildar o destildar módulos)
  const [features, setFeatures] = useState<MicrositeFeaturesState>({
    countdown: true,
    story: true,
    events: true,
    guestInfo: true,
    gallery: true,
    giftRegistry: true,
    rsvp: true,
    music: false,
  });

  const toggleFeature = (key: keyof MicrositeFeaturesState) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Modal states for focused editing
  const [activeModal, setActiveModal] = useState<
    'portada' | 'historia' | 'eventos' | 'info' | 'galeria' | null
  >(null);

  // Local editable values with live syncing to preview
  const [coupleName, setCoupleName] = useState(wedding.coupleName || 'Sofía & Martín');
  const [weddingDate, setWeddingDate] = useState(wedding.weddingDate || '2027-11-15');
  const [bannerImage, setBannerImage] = useState(
    wedding.bannerImage || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'
  );
  const [storyText, setStoryText] = useState(
    wedding.storyText ||
    'Nos conocimos hace 6 años y desde entonces supimos que queríamos caminar juntos para siempre. Nos llena de emoción celebrar este gran paso junto a las personas que más queremos en el mundo.'
  );
  const [dressCode, setDressCode] = useState(wedding.dressCode || 'Elegante / Cocktail');
  const [lodgingInfo, setLodgingInfo] = useState('Hoteles recomendados: Sheraton Pilar, Ibis Pilar y posadas boutique de la zona.');
  const [transportInfo, setTransportInfo] = useState('Combis de traslado ida y vuelta desde CABA (Plaza Italia) y estacionamiento con seguridad.');
  const [mapLocation, setMapLocation] = useState(`${wedding.venue || 'Estancia La Linda'}, ${wedding.city || 'Pilar, Buenos Aires'}`);

  // Gallery Photos
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Editable events list (initialized from props)
  const [eventList, setEventList] = useState<WeddingEvent[]>(
    events.length > 0 
      ? events 
      : [
          {
            id: 'ev1',
            title: 'Ceremonia Religiosa',
            date: '15 Noviembre 2027',
            time: '17:30 hs',
            locationName: 'Parroquia Nuestra Señora del Pilar',
            address: 'Junín 1904, Recoleta, CABA',
            description: 'Por favor llegar 15 minutos antes.',
            iconType: 'church',
          },
          {
            id: 'ev2',
            title: 'Recepción y Cena',
            date: '15 Noviembre 2027',
            time: '19:30 hs',
            locationName: 'Estancia La Linda',
            address: 'Ruta 8 Km 54, Pilar',
            description: 'Cocktail al atardecer y cena de 3 pasos.',
            iconType: 'party',
          },
        ]
  );

  // New event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Curated cover photo presets
  const photoPresets = [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      label: 'Romántico Luz Natural',
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
      label: 'Atardecer Dorado',
    },
    {
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80',
      label: 'Elegancia Minimal',
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
      label: 'Jardín Botánico',
    },
  ];

  // Save changes to parent state
  const handleSaveCover = () => {
    onUpdateWedding({
      coupleName,
      weddingDate,
      bannerImage,
    });
    setActiveModal(null);
  };

  const handleSaveStory = () => {
    onUpdateWedding({
      storyText,
    });
    setActiveModal(null);
  };

  const handleSaveInfo = () => {
    onUpdateWedding({
      dressCode,
    });
    setActiveModal(null);
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const item: WeddingEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      date: '15 Noviembre 2027',
      time: newEventTime || '01:30 hs',
      locationName: newEventLocation || wedding.venue,
      address: wedding.address,
      description: 'Música, baile y celebración.',
      iconType: 'party',
    };
    setEventList([...eventList, item]);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventLocation('');
  };

  const handleDeleteEvent = (id: string) => {
    setEventList(eventList.filter((e) => e.id !== id));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleDeleteGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  // Calculate dynamic progress based on active and configured features
  const activeFeaturesCount = Object.values(features).filter(Boolean).length;
  const totalPossibleFeatures = 8;
  const progressPercentage = Math.min(100, Math.round((activeFeaturesCount / totalPossibleFeatures) * 100));

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* ================= 1. HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Micrositio
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            Diseñá la experiencia que verán tus invitados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onOpenMicrosite}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200/90 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-gray-400" />
            <span>Vista previa</span>
          </button>

          <button
            type="button"
            onClick={onOpenMicrosite}
            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Abrir sitio</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 2. PROGRESS BAR & FEATURE STATUS ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Progreso del micrositio
            </span>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>Tu boda ya está tomando forma</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                {activeFeaturesCount} de {totalPossibleFeatures} secciones activas
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-gray-900">{progressPercentage}%</span>
            <span className="text-xs text-gray-400 font-medium">configurado</span>
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gray-900 h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>

        {/* Status items */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs">
          {/* Completo */}
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>Datos principales</span>
          </div>
          <div className={`flex items-center gap-1.5 font-medium ${features.events ? 'text-emerald-700' : 'text-gray-400'}`}>
            {features.events ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <span className="w-2 h-2 rounded-full border-2 border-gray-300" />
            )}
            <span>Eventos</span>
          </div>

          <span className="text-gray-300 hidden sm:inline">•</span>

          {/* Dinámicos según selección */}
          <div className={`flex items-center gap-1.5 font-medium ${features.gallery ? 'text-emerald-700' : 'text-gray-400'}`}>
            {features.gallery ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <span className="w-2 h-2 rounded-full border-2 border-gray-300" />
            )}
            <span>Galería</span>
          </div>

          <div className={`flex items-center gap-1.5 font-medium ${features.giftRegistry ? 'text-emerald-700' : 'text-gray-400'}`}>
            {features.giftRegistry ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <span className="w-2 h-2 rounded-full border-2 border-gray-300" />
            )}
            <span>Lista de regalos</span>
          </div>

          <div className={`flex items-center gap-1.5 font-medium ${features.rsvp ? 'text-emerald-700' : 'text-gray-400'}`}>
            {features.rsvp ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            ) : (
              <span className="w-2 h-2 rounded-full border-2 border-gray-300" />
            )}
            <span>RSVP</span>
          </div>
        </div>
      </div>

      {/* ================= FEATURE QUICK SELECTOR / TOGGLE BAR ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Módulos del sitio: tildá o destildá lo que querés mostrar
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">
            Hacé clic en cualquier feature para activarla u ocultarla
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* 1. Cuenta regresiva */}
          <button
            type="button"
            onClick={() => toggleFeature('countdown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.countdown
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.countdown ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Cuenta regresiva</span>
          </button>

          {/* 2. Nuestra historia */}
          <button
            type="button"
            onClick={() => toggleFeature('story')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.story
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.story ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Nuestra historia</span>
          </button>

          {/* 3. Cronograma */}
          <button
            type="button"
            onClick={() => toggleFeature('events')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.events
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.events ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Cronograma de eventos</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
              Desde Premium
            </span>
          </button>

          {/* 4. Info invitados */}
          <button
            type="button"
            onClick={() => toggleFeature('guestInfo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.guestInfo
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.guestInfo ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Info invitados (Dress code, mapa)</span>
          </button>

          {/* 5. Galería */}
          <button
            type="button"
            onClick={() => toggleFeature('gallery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.gallery
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.gallery ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Galería de fotos</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
              Desde Premium
            </span>
          </button>

          {/* 6. Lista de regalos */}
          <button
            type="button"
            onClick={() => toggleFeature('giftRegistry')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.giftRegistry
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.giftRegistry ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Lista de regalos</span>
          </button>

          {/* 7. Confirmación RSVP */}
          <button
            type="button"
            onClick={() => toggleFeature('rsvp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.rsvp
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.rsvp ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Confirmación RSVP</span>
          </button>

          {/* 8. Sugerir música */}
          <button
            type="button"
            onClick={() => toggleFeature('music')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5 border ${
              features.music
                ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {features.music ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>Música para la fiesta</span>
          </button>
        </div>
      </div>

      {/* ================= 3. MAIN TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ================= LEFT COLUMN (60%): EDITABLE CARDS WITH INDIVIDUAL TOGGLES ================= */}
        <div className="lg:col-span-7 space-y-6">

          {/* CARD 1: PORTADA & ENCABEZADO */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs hover:border-gray-300 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Portada principal
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  Fija en el sitio
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Countdown sub-toggle */}
                <button
                  type="button"
                  onClick={() => toggleFeature('countdown')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    features.countdown 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'
                  }`}
                  title="Tildar para mostrar u ocultar la cuenta regresiva"
                >
                  {features.countdown ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Cuenta regresiva activa</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-gray-400" />
                      <span>Cuenta regresiva oculta</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('portada')}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar portada</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* Photo thumbnail */}
              <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 relative">
                <img
                  src={bannerImage}
                  alt="Portada principal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  {coupleName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{weddingDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{wedding.venue || 'Estancia La Linda'}, {wedding.city || 'Pilar'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: NUESTRA HISTORIA (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-3 group ${
            features.story ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('story')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.story ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.story ? 'Destildar para ocultar de tu sitio' : 'Tildar para activar en tu sitio'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Nuestra historia
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    features.story 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                      : 'text-gray-500 bg-gray-100 border-gray-200'
                  }`}>
                    {features.story ? '✓ Activa' : '○ Oculta'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFeature('story')}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    features.story
                      ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {features.story ? 'Destildar' : 'Tildar y mostrar'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('historia')}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar historia</span>
                </button>
              </div>
            </div>

            {features.story ? (
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed italic relative">
                <p className="line-clamp-3">
                  "{storyText}"
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>Esta sección está oculta y no aparecerá en el sitio de tus invitados.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('story')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 3: EVENTOS (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.events ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('events')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.events ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.events ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Itinerario del día
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.events 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.events ? '✓ Activa' : '○ Oculta'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Eventos de la boda ({eventList.length})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFeature('events')}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    features.events
                      ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {features.events ? 'Destildar' : 'Tildar y mostrar'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('eventos')}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar eventos</span>
                </button>
              </div>
            </div>

            {features.events ? (
              <div className="space-y-2.5">
                {eventList.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    className="p-3.5 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                        {ev.iconType === 'church' ? (
                          <Church className="w-4 h-4" />
                        ) : (
                          <PartyPopper className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                          {ev.time} • {ev.locationName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shrink-0 shadow-2xs">
                      {ev.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>El itinerario no será visible en el sitio para los invitados.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('events')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 4: INFORMACIÓN PARA INVITADOS (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.guestInfo ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('guestInfo')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.guestInfo ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.guestInfo ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Guía para invitados
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.guestInfo 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.guestInfo ? '✓ Activa' : '○ Oculta'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Información clave (Dress code, hospedaje, mapa)
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFeature('guestInfo')}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    features.guestInfo
                      ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {features.guestInfo ? 'Destildar' : 'Tildar y mostrar'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('info')}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar información</span>
                </button>
              </div>
            </div>

            {features.guestInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dress Code */}
                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-150 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0 mt-0.5">
                    <Shirt className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Dress code
                    </span>
                    <span className="text-xs font-semibold text-gray-900 block truncate">
                      {dressCode}
                    </span>
                  </div>
                </div>

                {/* Hospedaje */}
                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-150 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0 mt-0.5">
                    <Hotel className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Hospedaje
                    </span>
                    <span className="text-xs font-semibold text-gray-900 block truncate">
                      Sheraton Pilar y posadas
                    </span>
                  </div>
                </div>

                {/* Mapa */}
                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-150 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0 mt-0.5">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Mapa & Ubicación
                    </span>
                    <span className="text-xs font-semibold text-gray-900 block truncate">
                      GPS Estancia La Linda
                    </span>
                  </div>
                </div>

                {/* Transporte */}
                <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-150 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0 mt-0.5">
                    <Bus className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Transporte
                    </span>
                    <span className="text-xs font-semibold text-gray-900 block truncate">
                      Combis desde CABA
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>La guía de dress code y ubicación estará oculta en el sitio.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('guestInfo')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 5: GALERÍA DE FOTOS (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.gallery ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('gallery')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.gallery ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.gallery ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Recuerdos visuales
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.gallery 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.gallery ? '✓ Activa' : '○ Oculta'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Galería de fotos ({galleryImages.length})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFeature('gallery')}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    features.gallery
                      ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {features.gallery ? 'Destildar' : 'Tildar y mostrar'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('galeria')}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200/80 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Administrar galería</span>
                </button>
              </div>
            </div>

            {features.gallery ? (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.slice(0, 4).map((img, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group/photo"
                  >
                    <img
                      src={img}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>La galería de fotos no aparecerá en el sitio de tus invitados.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('gallery')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 6: LISTA DE REGALOS (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.giftRegistry ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('giftRegistry')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.giftRegistry ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.giftRegistry ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Mesa de regalos
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.giftRegistry 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.giftRegistry ? '✓ Activa' : '○ Oculta'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-gray-600" />
                    <span>Lista de regalos ({gifts.length} regalos activos)</span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFeature('giftRegistry')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  features.giftRegistry
                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                }`}
              >
                {features.giftRegistry ? 'Destildar' : 'Tildar y mostrar'}
              </button>
            </div>

            {features.giftRegistry ? (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-between text-xs text-gray-600">
                <span>Tus invitados podrán elegir y transferir directo para sus regalos favoritos.</span>
                <span className="font-semibold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                  {wedding.bankAlias || 'boda.sofia.martin'}
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>El bloque de regalos no se mostrará a los invitados en el sitio.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('giftRegistry')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 7: CONFIRMACIÓN RSVP (TOGGLEABLE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.rsvp ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('rsvp')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.rsvp ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.rsvp ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Asistencia
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.rsvp 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.rsvp ? '✓ Activa' : '○ Oculta'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-600" />
                    <span>Confirmación de asistencia (RSVP)</span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFeature('rsvp')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  features.rsvp
                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-2xs'
                }`}
              >
                {features.rsvp ? 'Destildar' : 'Tildar y mostrar'}
              </button>
            </div>

            {features.rsvp ? (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150 text-xs text-gray-600">
                Los invitados podrán confirmar su presencia, indicar menú especial o restricciones alimentarias directamente desde el sitio.
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
                <span>El botón y formulario de confirmación de asistencia estarán ocultos.</span>
                <button 
                  type="button" 
                  onClick={() => toggleFeature('rsvp')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Activar
                </button>
              </div>
            )}
          </div>

          {/* CARD 8: MÚSICA / SUGERIR CANCIONES (BONUS TOGGLEABLE FEATURE) */}
          <div className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs space-y-4 group ${
            features.music ? 'border-gray-200/90 hover:border-gray-300' : 'border-dashed border-gray-300 bg-gray-50/40 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFeature('music')}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                    features.music ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}
                  title={features.music ? 'Destildar para ocultar' : 'Tildar para activar'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Interactividad
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      features.music 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                        : 'text-gray-500 bg-gray-100 border-gray-200'
                    }`}>
                      {features.music ? '✓ Activa' : '○ Opcional'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-600" />
                    <span>Sugerir música para el DJ</span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFeature('music')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  features.music
                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    : 'bg-gray-900 text-white border-gray-900 hover:bg-black shadow-2xs'
                }`}
              >
                {features.music ? 'Destildar' : '+ Tildar y activar'}
              </button>
            </div>

            {features.music ? (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150 text-xs text-gray-600 flex items-center justify-between">
                <span>Habilita un campo para que los invitados pidan temas que no pueden faltar en la fiesta.</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                  Visible en celular
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150 text-xs text-gray-500 flex items-center justify-between">
                <span>¿Querés que los invitados te propongan canciones para la fiesta? Podés tildar esta sección.</span>
                <button
                  type="button"
                  onClick={() => toggleFeature('music')}
                  className="font-semibold text-gray-900 underline cursor-pointer ml-2"
                >
                  Tildar ahora
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT COLUMN (40%): ALWAYS VISIBLE REAL SMARTPHONE PREVIEW ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3">
          
          {/* Status badge */}
          <div className="flex items-center gap-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {activeFeaturesCount} secciones activas
            </span>
          </div>

          {/* VISTA PREVIA: llama al sitio real, sin mockups ni simuladores */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="relative h-56 w-full">
              <img
                src={bannerImage}
                alt="Portada"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white space-y-1">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-gray-300">
                  Nos casamos
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                  {coupleName}
                </h2>
              </div>
            </div>
            <div className="p-5 space-y-3 text-center">
              <p className="text-xs text-gray-500">
                Este es el sitio real que van a ver sus invitados.
              </p>
              <button
                type="button"
                onClick={onOpenMicrosite}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver mi web</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ================= EDIT MODALS (FOCUSED & LIGHTWEIGHT) ================= */}

      {/* MODAL 1: EDITAR PORTADA */}
      {activeModal === 'portada' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Editar portada</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombres de la pareja
                </label>
                <input
                  type="text"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fecha de la boda
                </label>
                <input
                  type="text"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  placeholder="Ej. 15 de Noviembre, 2027"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Elegí una fotografía curada
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {photoPresets.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setBannerImage(photo.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        bannerImage === photo.url ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {bannerImage === photo.url && (
                        <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  O pegá la URL de tu imagen
                </label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCover}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR HISTORIA */}
      {activeModal === 'historia' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Editar nuestra historia</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Escribí unas palabras para tus invitados
              </label>
              <textarea
                rows={5}
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Compartí cómo se conocieron, un recuerdo especial o su mensaje de bienvenida..."
              />
              <span className="text-[11px] text-gray-400 block text-right">
                {storyText.length} caracteres
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveStory}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Guardar historia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDITAR EVENTOS */}
      {activeModal === 'eventos' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Editar eventos</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of existing events */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 block">
                Eventos actuales
              </span>
              {eventList.map((ev) => (
                <div key={ev.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{ev.title}</span>
                    <span className="text-[11px] text-gray-500">{ev.time} • {ev.locationName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add a new event */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
              <span className="text-xs font-bold text-gray-900 block">
                + Agregar nuevo evento (Ej. After Party)
              </span>
              <div>
                <input
                  type="text"
                  placeholder="Título (Ej. After Party / Brindis)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Horario (Ej. 01:30 hs)"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Lugar (Ej. Pista principal)"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEvent}
                className="w-full py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg"
              >
                Agregar evento
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDITAR INFORMACIÓN */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Editar información para invitados</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Código de vestimenta (Dress code)
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="Ej. Elegante / Cocktail / Black Tie"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hospedaje sugerido
                </label>
                <input
                  type="text"
                  value={lodgingInfo}
                  onChange={(e) => setLodgingInfo(e.target.value)}
                  placeholder="Hoteles o posadas cercanas..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Transporte y traslados
                </label>
                <input
                  type="text"
                  value={transportInfo}
                  onChange={(e) => setTransportInfo(e.target.value)}
                  placeholder="Información sobre combis o autos..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Dirección y Mapa
                </label>
                <input
                  type="text"
                  value={mapLocation}
                  onChange={(e) => setMapLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADMINISTRAR GALERÍA */}
      {activeModal === 'galeria' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Administrar galería de fotos</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-700 block">
                Fotos cargadas ({galleryImages.length})
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700">
                Sumar foto por enlace (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl"
                >
                  Sumar
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
