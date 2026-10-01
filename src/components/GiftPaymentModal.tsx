import React, { useRef, useState } from 'react';
import { Check, ChevronDown, Copy, User, Users, X } from 'lucide-react';

// Modal de "regalar" que se abre al apretar "Agregar al regalo" en la pantalla de
// Regalos del ejemplo. Replica el flujo de 4 pasos (elegir cómo regalar → datos
// personales → confirmar → realizar pago) + la pantalla final de subir comprobante,
// pero con la identidad visual de Weda (tipografías y colores que ya usa el resto
// del sitio) en vez de copiar el estilo de la referencia.
const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";
const BRAND = '#2D1A0E';

const formatPrice = (n: number) => `ARS ${n.toLocaleString('es-AR')}`;

interface GiftPaymentModalProps {
  giftTitle: string;
  unitPrice: number;
  quantity: number;
  coupleName?: string;
  onClose: () => void;
}

const STEPS = [
  { n: 1, label: 'Elegir cómo\nregalar' },
  { n: 2, label: 'Cargar datos\npersonales' },
  { n: 3, label: 'Confirmar\nregalo' },
  { n: 4, label: 'Realizar\npago' },
] as const;

// Datos de transferencia de ejemplo (ficticios, no reales) para la demo.
const BANK_DETAILS = [
  { label: 'Divisa', value: 'Peso Argentino' },
  { label: 'Tipo de Cuenta', value: 'Caja de ahorro' },
  { label: 'Nombre del Banco', value: 'Banco Galicia' },
  { label: 'Número de cuenta', value: '123-456789/0' },
  { label: 'CBU', value: '0070123430000012345678' },
  { label: 'Alias', value: 'mili.juan.boda' },
  { label: 'Titular', value: 'Milagros Fernández' },
  { label: 'Documento', value: '30.123.456' },
  { label: 'CUIT', value: '27-30123456-4' },
];

export const GiftPaymentModal: React.FC<GiftPaymentModalProps> = ({
  giftTitle,
  unitPrice,
  quantity,
  coupleName = 'Milagros & Juan',
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'receipt'>(1);
  const [mode, setMode] = useState<'solo' | 'compartido' | null>(null);
  const [dedicatoria, setDedicatoria] = useState('');
  const [participantes, setParticipantes] = useState('');
  const [email, setEmail] = useState('');
  const [monto, setMonto] = useState(String(unitPrice * quantity));
  const [metodoPago, setMetodoPago] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstName = participantes.trim().split(' ')[0] || 'invitado/a';
  const canContinueStep2 = participantes.trim() !== '' && email.trim() !== '' && metodoPago !== '';

  const selectMode = (m: 'solo' | 'compartido') => {
    setMode(m);
    setStep(2);
  };

  const handleCopy = () => {
    const text = BANK_DETAILS.map((d) => `${d.label}: ${d.value}`).join('\n');
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleFilePick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setStep('receipt');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={onClose}>
      <div
        className="relative bg-white w-full max-w-[600px] max-h-[92vh] overflow-y-auto rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#E3DDD3] flex items-center justify-center text-[#5A4A40] hover:bg-[#F6F3EC] cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.8} />
        </button>

        <div className="px-6 sm:px-10 pt-8 pb-8">
          {step !== 'receipt' && (
            <>
              <h2
                className="uppercase text-[14px] sm:text-[16px] tracking-[0.06em] text-[#22180E] pr-10"
                style={{ fontFamily: SANS, fontWeight: 600 }}
              >
                Regalo para {coupleName}
              </h2>

              {/* Tracker de pasos */}
              <div className="flex items-start justify-between mt-7 mb-8">
                {STEPS.map((s, i) => {
                  const current = step === s.n;
                  const done = typeof step === 'number' && step > s.n;
                  return (
                    <React.Fragment key={s.n}>
                      <div className="flex flex-col items-center text-center" style={{ width: 66 }}>
                        <span
                          className={`uppercase text-[8.5px] sm:text-[10px] leading-tight mb-2 ${current ? 'text-[#22180E]' : 'text-[#9C9086]'}`}
                          style={{ fontFamily: SANS, whiteSpace: 'pre-line' }}
                        >
                          {s.label}
                        </span>
                        <span
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] shrink-0 ${
                            done ? 'text-white' : current ? 'border border-[#22180E] text-[#22180E]' : 'border border-[#D9D2C8] text-[#9C9086]'
                          }`}
                          style={{ fontFamily: SANS, backgroundColor: done ? BRAND : 'transparent' }}
                        >
                          {done ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : s.n}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#E3DDD3] mt-[13px] sm:mt-[15px]" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}

          {/* Paso 1 — elegir cómo regalar */}
          {step === 1 && (
            <div>
              <p className="text-[13px] text-[#7B6F63] mb-4" style={{ fontFamily: SANS }}>
                {giftTitle} · {quantity} {quantity === 1 ? 'unidad' : 'unidades'} · {formatPrice(unitPrice * quantity)}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => selectMode('solo')}
                  className="flex flex-col items-center justify-center gap-3 py-10 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: BRAND, color: '#FFFFFF' }}
                >
                  <User className="w-7 h-7" strokeWidth={1.3} />
                  <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.05em]" style={{ fontFamily: SANS }}>
                    Regalo solo
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => selectMode('compartido')}
                  className="flex flex-col items-center justify-center gap-3 py-10 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: BRAND, color: '#FFFFFF' }}
                >
                  <Users className="w-7 h-7" strokeWidth={1.3} />
                  <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.05em]" style={{ fontFamily: SANS }}>
                    Regalo compartido
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Paso 2 — datos personales */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <textarea
                value={dedicatoria}
                onChange={(e) => setDedicatoria(e.target.value)}
                placeholder="Dedicatoria (opcional)"
                rows={3}
                className="w-full border border-[#E3DDD3] px-4 py-3 text-[14px] text-[#282018] outline-none resize-none placeholder:text-[#9C9086]"
                style={{ fontFamily: SANS }}
              />

              <div>
                <span className="block text-[11px] uppercase tracking-[0.05em] text-[#9C9086] mb-1.5" style={{ fontFamily: SANS }}>
                  Tipo de pago
                </span>
                <div className="w-full border border-[#E3DDD3] px-4 py-3 text-[14px] text-[#282018]" style={{ fontFamily: SANS }}>
                  Pago único
                </div>
              </div>

              <input
                value={participantes}
                onChange={(e) => setParticipantes(e.target.value)}
                placeholder={mode === 'compartido' ? 'Nombres de los participantes' : 'Tu nombre y apellido'}
                className="w-full border border-[#E3DDD3] px-4 py-3 text-[14px] text-[#282018] outline-none placeholder:text-[#9C9086]"
                style={{ fontFamily: SANS }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-[#E3DDD3] px-4 py-3 text-[14px] text-[#282018] outline-none placeholder:text-[#9C9086]"
                style={{ fontFamily: SANS }}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-stretch border border-[#E3DDD3] flex-1 min-w-0">
                  <span className="flex items-center px-4 bg-[#F6F3EC] text-[14px] text-[#282018] shrink-0" style={{ fontFamily: SANS }}>
                    AR$
                  </span>
                  <input
                    value={monto}
                    onChange={(e) => setMonto(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 min-w-0 px-4 py-3 text-[14px] text-[#282018] outline-none"
                    style={{ fontFamily: SANS }}
                  />
                </div>
                <div className="relative flex-1">
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="appearance-none w-full border border-[#E3DDD3] px-4 py-3 text-[14px] text-[#282018] outline-none cursor-pointer"
                    style={{ fontFamily: SANS }}
                  >
                    <option value="">Seleccioná un método de pago</option>
                    <option value="transferencia">Transferencia bancaria</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#5A4A40]" strokeWidth={2} />
                </div>
              </div>
              <span className="text-[11px] text-[#9C9086] -mt-2" style={{ fontFamily: SANS }}>
                Métodos de pago seleccionados por la pareja
              </span>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[#282018] text-[#282018] uppercase text-[12px] py-3 cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  disabled={!canContinueStep2}
                  onClick={() => setStep(3)}
                  className="flex-1 uppercase text-[12px] py-3 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{ fontFamily: SANS, backgroundColor: BRAND }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3 — confirmar regalo */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="border border-[#E3DDD3] divide-y divide-[#EFEAE2]">
                {[
                  ['Regalo', giftTitle],
                  ['Cantidad', String(quantity)],
                  ['Modalidad', mode === 'compartido' ? 'Regalo compartido' : 'Regalo solo'],
                  ['De parte de', participantes || '—'],
                  ['Email', email || '—'],
                  ['Dedicatoria', dedicatoria || '—'],
                  ['Monto', formatPrice(Number(monto) || 0)],
                  ['Método de pago', metodoPago === 'transferencia' ? 'Transferencia bancaria' : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[11px] uppercase tracking-[0.04em] text-[#9C9086] shrink-0" style={{ fontFamily: SANS }}>
                      {label}
                    </span>
                    <span className="text-[13.5px] text-[#282018] text-right break-words" style={{ fontFamily: SANS }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-[#282018] text-[#282018] uppercase text-[12px] py-3 cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 uppercase text-[12px] py-3 text-white cursor-pointer"
                  style={{ fontFamily: SANS, backgroundColor: BRAND }}
                >
                  Confirmar regalo
                </button>
              </div>
            </div>
          )}

          {/* Paso 4 — realizar pago */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="bg-[#F3EFE7] px-5 py-4">
                <p className="text-[13px] font-semibold text-[#282018] mb-1" style={{ fontFamily: SANS }}>
                  IMPORTANTE:
                </p>
                <p className="text-[13px] text-[#544A42] leading-relaxed" style={{ fontFamily: SANS }}>
                  Para finalizar, recordá hacer la transferencia y subir el comprobante. Es necesario que lo
                  adjuntes para que la pareja pueda identificar tu regalo fácilmente.
                </p>
              </div>

              <div className="relative border border-[#E3DDD3] px-5 py-4">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copiar datos"
                  className="absolute top-4 right-4 text-[#8A7A6E] hover:text-[#282018] cursor-pointer"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.8} />
                </button>
                {copied && (
                  <span className="absolute top-4 right-11 text-[11px] text-[#8A7A6E]" style={{ fontFamily: SANS }}>
                    ¡Copiado!
                  </span>
                )}
                <div className="flex flex-col gap-1.5">
                  {BANK_DETAILS.map((d) => (
                    <p key={d.label} className="text-[13px] text-[#282018]" style={{ fontFamily: SANS }}>
                      <span className="text-[#9C9086]">{d.label}:</span> {d.value}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 border border-[#282018] text-[#282018] uppercase text-[12px] py-3 cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleFilePick}
                  className="flex-1 uppercase text-[12px] py-3 text-white cursor-pointer"
                  style={{ fontFamily: SANS, backgroundColor: BRAND }}
                >
                  Subir comprobante
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {/* Comprobante de pago */}
          {step === 'receipt' && (
            <div className="flex flex-col items-center text-center py-6">
              <h2 className="font-normal text-[#22180E]" style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 6vw, 40px)', lineHeight: 1.1 }}>
                Comprobante
                <br />
                de Pago
              </h2>
              <p className="text-[15px] text-[#282018] mt-6" style={{ fontFamily: SANS }}>
                ¡Hola {firstName}!
              </p>
              <p className="text-[14px] text-[#6F625A] mt-2" style={{ fontFamily: SANS }}>
                {receiptFile ? 'Ya recibimos tu comprobante de pago para' : 'Subí el comprobante de pago de tu regalo para'}
              </p>
              <p className="text-[15px] text-[#282018] mt-1" style={{ fontFamily: SANS }}>
                <strong>{coupleName}</strong> de <strong>{formatPrice(Number(monto) || 0)}</strong>
              </p>

              {receiptFile ? (
                <div className="mt-7 flex items-center gap-2 text-[#2D1A0E]">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND }}>
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </span>
                  <span className="text-[13px]" style={{ fontFamily: SANS }}>
                    {receiptFile.name}
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleFilePick}
                    className="uppercase text-[12px] text-white px-8 py-3.5 mt-7 cursor-pointer"
                    style={{ fontFamily: SANS, backgroundColor: BRAND }}
                  >
                    Subir comprobante
                  </button>
                  <span className="text-[11px] text-[#9C9086] mt-3" style={{ fontFamily: SANS }}>
                    Formatos: Foto o PDF
                  </span>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="uppercase text-[12px] text-[#8A7A6E] mt-8 underline cursor-pointer"
                style={{ fontFamily: SANS }}
              >
                Cerrar
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
