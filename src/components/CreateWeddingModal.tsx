import React, { useRef, useState } from 'react';
import { WeddingData, AppView } from '../types';
import { coverPresets } from '../data/initialData';
import { Heart, Calendar, Check, Upload } from 'lucide-react';

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
  // Solo tres datos para empezar; el lugar y el resto se completan después, desde Cuenta.
  const [coupleName, setCoupleName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [bannerImage, setBannerImage] = useState(coverPresets[0].url);
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
    const [partner1 = '', partner2 = ''] = coupleName.split('&').map((n) => n.trim());
    const slug = coupleName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' y ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    onUpdateWedding({
      coupleName: coupleName.trim(),
      partner1,
      partner2,
      weddingDate,
      venue: '',
      address: '',
      city: '',
      slug: slug || wedding.slug,
      bannerImage,
      status: 'BORRADOR',
      publishedAt: undefined,
    });
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-gray-50 flex flex-col justify-center items-center px-4 py-10 font-sans">
      {/* Container Box */}
      <div className="w-full max-w-xl bg-white border border-gray-200 p-6 sm:p-10">
        {/* Brand header */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="text-[28px] font-normal uppercase leading-normal text-gray-900 cursor-pointer inline-block hover:opacity-85 transition-opacity"
          >
            Weda
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-1.5">Creemos tu lista de regalos</h1>
          <p className="text-sm text-gray-500">Tres datos y tu lista queda lista para armar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre de la pareja */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-900 mb-2">
              Nombres de la pareja
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
                placeholder="Nombre 1 & Nombre 2"
                className="w-full pl-10 pr-3.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Fecha de la boda */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-900 mb-2">
              Fecha de la boda
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
                className="w-full pl-10 pr-3.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>
          </div>

          {/* Foto principal */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-900 mb-2">
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
              className="uppercase w-full py-2 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-xs font-normal text-gray-600 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-gray-400" />
              <span>Subir tu propia foto</span>
            </button>
          </div>

          <button
            id="create-wedding-btn"
            type="submit"
            className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer mt-4"
          >
            Crear mi lista
          </button>
        </form>
      </div>
    </div>
  );
};
