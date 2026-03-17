import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Camera, Save, LogOut, CheckCircle, User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-white px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-md"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
             <UserIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-3xl font-serif font-bold uppercase tracking-tighter mb-4">Acceso Restringido</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-10 leading-relaxed">
            Por favor, inicia sesión para acceder a tu panel de formación y gestionar tu información personal.
          </p>
          <button 
            onClick={() => useAuthStore.getState().setLoginModalOpen(true)}
            className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:-translate-y-1 active:scale-95 shadow-xl"
          >
            Iniciar Sesión Ahora
          </button>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold tracking-tighter uppercase mb-4"
          >
            {t('profile.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 uppercase tracking-[0.3em] text-xs"
          >
            {t('profile.subtitle')}
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-8">
            <div className="relative group mx-auto w-48 h-48 md:w-full md:h-auto aspect-square overflow-hidden rounded-full md:rounded-none border border-gray-200 bg-gray-50">
              <img 
                src={user.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} 
                alt={user.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button 
                onClick={handlePhotoClick}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="text-white text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('profile.edit_photo')}</span>
                </div>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="bg-black text-white p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-2">
                {t('profile.model_status')}
              </h3>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">{t('profile.status_active')}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">ID: {user.sub || user.email.split('@')[0].toUpperCase()}</p>
            </div>

            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 py-4 border border-black text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
            >
              <LogOut className="w-4 h-4" /> {t('profile.logout')}
            </button>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold uppercase tracking-tighter mb-8 border-b border-gray-100 pb-4">
                {t('profile.personal_info')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    {t('profile.full_name')}
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    {t('profile.email')}
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    {t('profile.phone')}
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+54 9 264 ..."
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    {t('profile.location')}
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ciudad, Provincia"
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="pt-6 flex items-center gap-4">
                  <button 
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 hover:-translate-y-1"
                  >
                    <Save className="w-4 h-4" /> {t('profile.save_changes')}
                  </button>

                  {isSaved && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-green-600 font-bold uppercase tracking-widest"
                    >
                      {t('profile.success_msg')}
                    </motion.span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
