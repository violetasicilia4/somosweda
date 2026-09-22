import React from 'react';
import { MessageCircle, HelpCircle, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      q: '¿Cómo cobro el dinero de los regalos?',
      a: 'Tus invitados transfieren directamente a tu CBU, Alias o Mercado Pago. Weda no retiene dinero ni cobra comisiones porcentuales sobre tus regalos.',
    },
    {
      q: '¿Cuándo debo pagar el plan de Weda?',
      a: 'Tenés tiempo ilimitado para diseñar tu micrositio y configurar regalos e invitados. Solo se abona el pago único cuando decidís publicar la boda para tus invitados.',
    },
    {
      q: '¿Los invitados necesitan crearse una cuenta para ver la web o confirmar?',
      a: 'No. El acceso para tus invitados es 100% libre, sin contraseñas ni descargas. Ingresan con su enlace y confirman en 15 segundos.',
    },
    {
      q: '¿Puedo personalizar el enlace o dominio?',
      a: 'Sí, todas las bodas cuentan con un enlace corto tipo weda.app/boda/nombre-y-nombre, y con el plan Signature podés conectar tu propio dominio .com.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900">
          Centro de Ayuda & Concierge Weda
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Estamos para acompañarte en cada detalle de la organización.
        </p>
      </div>

      {/* WhatsApp Concierge Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Asistencia por WhatsApp</span>
          </div>
          <h3 className="font-serif text-base font-medium text-gray-900">¿Tenés alguna consulta puntual?</h3>
          <p className="text-xs text-gray-600 max-w-md">
            Nuestro equipo de soporte y asesores de boda responde en minutos de lunes a sábados.
          </p>
        </div>

        <a
          href="https://wa.me/5491155551234?text=Hola%20Weda!%20Tengo%20una%20consulta%20sobre%20mi%20boda"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chatear con soporte</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-serif font-medium text-base text-gray-900">Preguntas Frecuentes</h3>

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
