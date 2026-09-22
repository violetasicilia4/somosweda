import React, { useRef, useState } from 'react';
import { WeddingData, AppView } from '../types';
import { coverPresets } from '../data/initialData';
import { Heart, Calendar, MapPin, Check, Plus, Minus, Upload } from 'lucide-react';

interface CreateWeddingModalProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onNavigate: (view: AppView) => void;
}

export const CreateWeddingModal: React.FC<CreateWeddingModalProps> = ({
  wedding,
  onUpdateWedding,
  onNavigate,
}) => {
  const [coupleName, setCoupleName] = useState(wedding.coupleName || 'Sofía & Martín');
  const [weddingDate, setWeddingDate] = useState(wedding.weddingDate || '2027-11-15');
  const [locationQuery, setLocationQuery] = useState('Estancia La Linda, Pilar, Buenos Aires');
  const [locationDetected, setLocationDetected] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [bannerImage, setBannerImage] = useState(wedding.bannerImage || coverPresets[0].url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWedding({
      coupleName,
      weddingDate,
      venue: locationQuery.split(',')[0] || 'Estancia La Linda',
      address: locationQuery,
      bannerImage,
    });
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-gray-50 flex flex-col justify-center items-center px-4 py-10 font-sans">
      {/* Container Box */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10">
        {/* Brand header */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="text-3xl font-bold tracking-tight text-gray-900 cursor-pointer inline-block hover:opacity-85 transition-opacity"
          >
            Weda
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Creemos tu boda</h1>
          <p className="text-sm text-gray-500">Necesitamos algunos datos para empezar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre de la pareja */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nombre de la pareja
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <input
                id="couple-name-input"
                type="text"
                required
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                placeholder="Sofía & Martín"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Fecha principal del evento */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Fecha principal del evento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="wedding-date-input"
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Ubicación
            </label>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="wedding-location-input"
                type="text"
                required
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setLocationDetected(e.target.value.length > 3);
                }}
                placeholder="Buscar dirección o ubicación..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>

            {/* Map Preview box matching Screenshot 9 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="px-3.5 py-2 bg-gray-100/80 border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>Seleccionar ubicación</span>
                <span className="text-gray-400">Modelo estático</span>
              </div>

              {/* Map grid schematic preview */}
              <div className="relative h-44 w-full bg-[#f4f3ef] overflow-hidden flex items-center justify-center">
                {/* SVG Map roads grid */}
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect width="60" height="60" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
                      <line x1="0" y1="30" x2="60" y2="30" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="30" y1="0" x2="30" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <line x1="0" y1="80" x2="100%" y2="80" stroke="#cbd5e1" strokeWidth="6" />
                  <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#cbd5e1" strokeWidth="5" />
                  <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#e2e8f0" strokeWidth="4" />
                </svg>

                {/* Central pin badge */}
                {locationDetected && (
                  <div className="relative z-10 flex flex-col items-center animate-fade-in">
                    <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5 mb-1.5">
                      <span>Ubicación detectada</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-gray-900/30 rounded-full blur-[1px] mt-0.5"></div>
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="absolute right-3 bottom-3 flex flex-col bg-white border border-gray-200 rounded-md shadow-xs overflow-hidden z-10">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                    className="p-1.5 hover:bg-gray-100 text-gray-700 border-b border-gray-100"
                    title="Acercar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
                    className="p-1.5 hover:bg-gray-100 text-gray-700"
                    title="Alejar"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Foto principal */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Foto principal
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {coverPresets.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setBannerImage(preset.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    bannerImage === preset.url ? 'border-gray-900 ring-2 ring-gray-900/15' : 'border-transparent hover:border-gray-300'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {bannerImage === preset.url && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="w-full py-2 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-600 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-gray-400" />
              <span>Subir su propia foto</span>
            </button>
          </div>

          <button
            id="create-wedding-btn"
            type="submit"
            className="w-full py-3.5 bg-gray-950 hover:bg-black text-white font-medium rounded-lg text-sm transition-all shadow-xs cursor-pointer mt-4"
          >
            Crear boda
          </button>
        </form>
      </div>
    </div>
  );
};
