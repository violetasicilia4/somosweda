import React from 'react';
import { MessageCircle, HelpCircle, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      q: '¿Cómo recibo el dinero de los regalos?',
      a: 'Tus invitados pagan con Mercado Pago o por transferencia bancaria, directo a tu cuenta. Weda nunca toca ni retiene el dinero y no cobra comisión por regalo.',
    },
    {
      q: '¿Cuándo pago?',
      a: 'Es un pago único, según cuánto tiempo querés mantener tu lista activa. Sin suscripción y sin comisión por regalo.',
    },
    {
      q: '¿Mis invitados necesitan crear una cuenta?',
      a: 'No. Entran con el enlace, confirman su asistencia y regalan en menos de un minuto.',
    },
    {
      q: '¿Puedo cambiar el enlace de mi lista?',
      a: 'Tu lista tiene un enlace corto con el formato weda.app/boda/nombre-y-nombre.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">
          Ayuda
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Respondemos tus dudas sobre tu lista de regalos.
        </p>
      </div>

      {/* Soporte */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Soporte</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">¿Tenés alguna consulta puntual?</h3>
          <p className="text-xs text-gray-600 max-w-md">
            Escribinos a hola@weda.com.ar o por WhatsApp. Respondemos de lunes a viernes de 9 a 18 hs.
          </p>
        </div>

        <a
          href="https://wa.me/5491155551234?text=Hola%20Weda!%20Tengo%20una%20consulta%20sobre%20mi%20boda"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Escribir por WhatsApp</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900">Preguntas frecuentes</h3>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 space-y-1.5 first:pt-2 last:pb-0">
              <h4 className="font-bold text-sm text-gray-900">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
