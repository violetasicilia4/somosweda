import React, { useState, useRef } from 'react';
import { AppView } from '../types';
import { Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Wordmark } from './Wordmark';

interface AuthViewsProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({ currentView, onNavigate, onAuthSuccess }) => {
  // Shared state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  // Refs for 6-digit pin input
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...pinDigits];
    newDigits[index] = val;
    setPinDigits(newDigits);
    setPinError('');

    // Auto-focus next input
    if (val && index < 5) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess({ name: 'Milagros', email });
    onNavigate('dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setFormError('La contraseña tiene que tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptedTerms) {
      setFormError('Aceptá los términos y condiciones para continuar.');
      return;
    }
    setFormError('');
    onAuthSuccess({ name: fullName, email });
    onNavigate('create-wedding');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('verify-pin');
  };

  const handleVerifyPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('reset-password');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Contraseña actualizada con éxito');
    setTimeout(() => {
      onNavigate('login');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      {/* Centered Auth Box matching screenshots */}
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 sm:p-10 transition-all">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Wordmark onClick={() => onNavigate('landing')} className="hover:opacity-85 transition-opacity" />
        </div>

        {formError && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 text-center font-medium" role="alert">
            {formError}
          </div>
        )}

        {notice && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 text-center font-medium">
            {notice}
          </div>
        )}

        {/* VIEW: LOGIN */}
        {currentView === 'login' && (
          <div>
            <div className="text-center mb-7">
              <h1 className="text-xl font-normal text-gray-900 mb-1">Bienvenido nuevamente</h1>
              <p className="text-xs sm:text-sm text-gray-500">Ingresá para administrar tu evento.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-medium text-gray-500 hover:text-gray-900 underline transition-colors cursor-pointer"
                  >
                    Olvidé mi contraseña
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer mt-2"
              >
                Iniciar sesión
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-gray-400">
                o continuar con
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({ name: 'Milagros', email: 'milagros@gmail.com' });
                  onNavigate('dashboard');
                }}
                className="uppercase w-full py-2.5 px-4 border border-gray-300 rounded-lg text-xs sm:text-xs font-normal text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({ name: 'Juan', email: 'juan@icloud.com' });
                  onNavigate('dashboard');
                }}
                className="uppercase w-full py-2.5 px-4 border border-gray-300 rounded-lg text-xs sm:text-xs font-normal text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.79-11.88-14.24-5.35-8.24-9.64-17.65-12.87-28.23-3.23-10.59-4.85-20.73-4.85-30.43 0-14.65 3.82-26.68 11.45-36.08 7.64-9.4 17.06-14.2 28.27-14.41 5.37 0 11.16 1.41 17.37 4.23 6.22 2.82 10.15 4.34 11.8 4.54 1.34-.2 5.48-1.78 12.42-4.75 6.94-2.97 12.75-4.26 17.43-3.87 13.06 1.06 23.36 5.8 30.9 14.22-11.4 6.89-16.92 16.3-16.56 28.24.36 9.4 4.09 17.27 11.2 23.6 7.11 6.33 15.42 9.94 24.93 10.82-2.18 6.78-4.99 13.79-8.45 21.03zM119.22 33.15c0-7.39 2.66-14.33 7.98-20.82 5.33-6.49 12-10.89 20.02-13.2 1.05 7.84-.79 15.18-5.51 22.01-4.72 6.84-11.39 11.1-20.01 12.78-.71-.26-1.54-.48-2.48-.77z"/>
                </svg>
                Apple
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
              ¿Todavía no tenés una cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-semibold text-gray-900 underline hover:text-black cursor-pointer"
              >
                Crear cuenta
              </button>
            </p>
          </div>
        )}

        {/* VIEW: REGISTER */}
        {currentView === 'register' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-normal text-gray-900 mb-1">Creá tu cuenta</h1>
              <p className="text-xs sm:text-sm text-gray-500">Armá tu lista de regalos para tu casamiento.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Nombre completo
                </label>
                <input
                  id="register-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Correo electrónico
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Contraseña
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Creá una contraseña segura"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí tu contraseña"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 accent-gray-900 cursor-pointer"
                />
                <label htmlFor="register-terms" className="text-xs text-gray-600 cursor-pointer">
                  Acepto los términos y condiciones de uso
                </label>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer mt-2"
              >
                Crear cuenta
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-gray-400">
                o continuar con
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({ name: 'Milagros', email: 'milagros@gmail.com' });
                  onNavigate('create-wedding');
                }}
                className="uppercase w-full py-2.5 px-4 border border-gray-300 rounded-lg text-xs sm:text-xs font-normal text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continuar con Google
              </button>

              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({ name: 'Milagros', email: 'milagros@icloud.com' });
                  onNavigate('create-wedding');
                }}
                className="uppercase w-full py-2.5 px-4 border border-gray-300 rounded-lg text-xs sm:text-xs font-normal text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.79-11.88-14.24-5.35-8.24-9.64-17.65-12.87-28.23-3.23-10.59-4.85-20.73-4.85-30.43 0-14.65 3.82-26.68 11.45-36.08 7.64-9.4 17.06-14.2 28.27-14.41 5.37 0 11.16 1.41 17.37 4.23 6.22 2.82 10.15 4.34 11.8 4.54 1.34-.2 5.48-1.78 12.42-4.75 6.94-2.97 12.75-4.26 17.43-3.87 13.06 1.06 23.36 5.8 30.9 14.22-11.4 6.89-16.92 16.3-16.56 28.24.36 9.4 4.09 17.27 11.2 23.6 7.11 6.33 15.42 9.94 24.93 10.82-2.18 6.78-4.99 13.79-8.45 21.03zM119.22 33.15c0-7.39 2.66-14.33 7.98-20.82 5.33-6.49 12-10.89 20.02-13.2 1.05 7.84-.79 15.18-5.51 22.01-4.72 6.84-11.39 11.1-20.01 12.78-.71-.26-1.54-.48-2.48-.77z"/>
                </svg>
                Continuar con Apple
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              ¿Ya tenés una cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-gray-900 underline hover:text-black cursor-pointer"
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {currentView === 'forgot-password' && (
          <div>
            <div className="text-center mb-7">
              <h1 className="text-xl font-normal text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Ingresá tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Correo electrónico
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer mt-2"
              >
                Enviar enlace de recuperación
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-500">
              ¿Recordás tu contraseña?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-gray-900 underline hover:text-black cursor-pointer"
              >
                Volver a iniciar sesión
              </button>
            </p>
          </div>
        )}

        {/* VIEW: VERIFY PIN */}
        {currentView === 'verify-pin' && (
          <div>
            <div className="text-center mb-7">
              <h1 className="text-xl font-normal text-gray-900 mb-2">Ingresá el código de recuperación</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Te enviamos un código de 6 dígitos a tu email.
              </p>
            </div>

            <form onSubmit={handleVerifyPinSubmit} className="space-y-6">
              {/* 6 Segmented PIN boxes */}
              <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                {pinDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={pinRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-900 transition-all"
                  />
                ))}
              </div>

              <button
                id="verify-pin-btn"
                type="submit"
                className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer"
              >
                Verificar código
              </button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <p className="text-xs text-gray-500">
                ¿No recibiste el código?{' '}
                <button
                  type="button"
                  onClick={() => alert('Código reenviado a tu email: 482910')}
                  className="font-semibold text-gray-900 underline hover:text-black cursor-pointer"
                >
                  Reenviar código
                </button>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-medium text-gray-700 underline hover:text-black cursor-pointer"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RESET PASSWORD */}
        {currentView === 'reset-password' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-normal text-gray-900 mb-1">Creá una nueva contraseña</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Elegí una contraseña segura de la que puedas acordarte.
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="reset-new-password"
                  type="password"
                  required
                  placeholder="Tu contraseña"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-900 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  required
                  placeholder="Tu contraseña"
                  className="w-full px-2.5 h-[35px] bg-white border border-[#F1F1EF] rounded-lg text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              {/* Requisitos de seguridad matching mockup */}
              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 text-xs text-gray-500 space-y-1">
                <span className="font-semibold text-gray-700 block mb-1">Requisitos de seguridad:</span>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">•</span> Al menos 8 caracteres de longitud
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">•</span> Al menos una letra mayúscula
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">•</span> Al menos un número o carácter especial
                </p>
              </div>

              <button
                id="reset-password-submit-btn"
                type="submit"
                className="uppercase w-full h-[41px] bg-[#2D1A0E] hover:bg-[#1A0E08] text-white font-medium rounded-lg text-[12px] transition-all shadow-xs cursor-pointer mt-2"
              >
                Guardar nueva contraseña
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-medium text-gray-700 underline hover:text-black cursor-pointer"
              >
                Volver a iniciar sesión
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
