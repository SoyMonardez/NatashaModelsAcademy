import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../store/useNotification';

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const { showNotification } = useNotification();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Enviar el token al backend para verificar y sincronizar con la DB
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();

        if (response.ok) {
          login(data.user, data.token);
          showNotification(`Bienvenida, ${data.user.name}`, 'success');
          onClose();
        } else {
          showNotification(data.error || 'Autenticación con Google fallida', 'error');
        }
      } catch (err) {
        console.error('Error during Google Login:', err);
        showNotification('Error de conexión con el servidor', 'error');
      }
    },
    onError: (err) => console.log('Google login failed', err),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        showNotification(isLoginView ? `Bienvenida, ${data.user.name}` : 'Registro completado con éxito', 'success');
        onClose();
      } else {
        showNotification(data.error || 'Error de autenticación', 'error');
      }
    } catch (err) {
      console.error('Auth error:', err);
      showNotification('Error de conexión', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-brand-white w-full max-w-md p-8 md:p-10 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-serif font-bold tracking-tighter uppercase mb-2 text-center">
            {isLoginView ? t('auth.login_title') : t('auth.register_title')}
          </h2>
          <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-8">
            NATASHA MODELS ACADEMY
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLoginView && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t('auth.name')}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-300 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder={t('auth.email')}
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b border-gray-300 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b border-gray-300 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] transform transition-transform hover:-translate-y-1 mt-4"
            >
              {isLoginView ? t('auth.login_btn') : t('auth.register_btn')}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative px-4 bg-brand-white text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {t('auth.or')}
            </div>
          </div>

          <button
            onClick={() => handleGoogleLogin()}
            className="w-full mt-8 bg-white border border-gray-200 text-black py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t('auth.google_btn')}
          </button>

          <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
            {isLoginView ? t('auth.no_account') : t('auth.has_account')}{' '}
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-black border-b border-black md:hover:text-gray-600 md:hover:border-gray-600 transition-colors"
            >
              {isLoginView ? t('auth.register_link') : t('auth.login_link')}
            </button>
          </p>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
