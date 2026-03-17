import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';
import { googleLogout } from '@react-oauth/google';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartLevel = useStore(state => state.modelCart.length);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoginModalOpen, setLoginModalOpen } = useAuthStore();

  const handleLogout = () => {
    googleLogout();
    logout();
    if (pathname === '/profile') {
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    if (pathname === '/' && hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  const handleLinkClick = (e, path) => {
    if (path.startsWith('/#')) {
      const targetId = path.substring(2);
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: t('nav.about'), path: '/#about' },
    { name: t('nav.courses'), path: '/courses' },
    { name: t('nav.staff'), path: '/#staff' },
    { name: t('nav.models'), path: '/models' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.inscriptions'), path: '/inscriptions' },
    { name: t('nav.contact'), path: '/#contact' },
  ];

  const isTransparent = pathname === '/' && !isScrolled && !isOpen;

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent' 
        : 'bg-brand-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`font-serif text-2xl font-bold tracking-widest transition-colors ${
              isTransparent ? 'text-brand-white' : 'text-brand-black'
            }`}>
              NATASHA<br/><span className="text-sm font-sans tracking-tight">MODELS ACADEMY</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gray-400 ${
                  isTransparent ? 'text-brand-white' : 'text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button onClick={toggleLanguage} className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border transition-colors ${
              isTransparent 
                ? 'border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black' 
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}>
              {t('nav.switch_lang')}
            </button>

            {user ? (
              <div className="flex items-center gap-4 group">
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                  <span className={`text-xs font-bold uppercase tracking-widest hidden lg:block transition-colors ${isTransparent ? 'text-brand-white' : 'text-brand-black'}`}>
                    {user.given_name || user.name.split(' ')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className={`transition-colors hover:text-red-500 ${isTransparent ? 'text-brand-white' : 'text-brand-black'}`} title="Log out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setLoginModalOpen(true)} 
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 border transition-colors flex items-center gap-2 ${
                isTransparent 
                  ? 'border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black' 
                  : 'bg-black border-black text-white hover:bg-white hover:text-black'
              }`}>
                <UserIcon className="w-4 h-4" /> LOGIN
              </button>
            )}

            {user && (
              <Link to="/requests" className={`relative transition-colors ${
                isTransparent ? 'text-brand-white hover:text-gray-300' : 'text-black hover:text-gray-600'
              }`}>
                <ShoppingBag className="w-5 h-5" />
                {cartLevel > 0 && (
                  <span className={`absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isTransparent ? 'bg-brand-white text-brand-black' : 'bg-black text-white'
                  }`}>
                    {cartLevel}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
             {user && (
               <Link to="/requests" className={`relative transition-colors p-2 ${
                 isTransparent ? 'text-brand-white' : 'text-black'
               }`}>
                <ShoppingBag className="w-6 h-6" />
                {cartLevel > 0 && (
                  <span className={`absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isTransparent ? 'bg-brand-white text-brand-black' : 'bg-black text-white'
                  }`}>
                    {cartLevel}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors p-2 -mr-2 ${
                isTransparent ? 'text-brand-white hover:text-gray-300' : 'text-black hover:text-gray-600'
              }`}
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-white h-[calc(100vh-80px)] overflow-y-auto flex flex-col pt-4 px-6 space-y-2 pb-10">
          {user ? (
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-2">
               <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 overflow-hidden group">
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                  <div className="flex flex-col truncate">
                     <span className="text-sm font-bold uppercase tracking-widest text-black truncate group-hover:text-gray-600">{user.name}</span>
                     <span className="text-xs text-gray-500 truncate">{user.email}</span>
                  </div>
               </Link>
               <button onClick={() => { handleLogout(); setIsOpen(false); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          ) : (
            <button 
              onClick={() => { setLoginModalOpen(true); setIsOpen(false); }} 
              className="w-full text-center text-sm font-bold uppercase tracking-widest px-4 py-4 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-2"
            >
              <UserIcon className="w-4 h-4" /> LOGIN / REGISTER
            </button>
          )}

          {navLinks.map((link) => (
             <Link
              key={link.name}
              to={link.path}
              onClick={(e) => handleLinkClick(e, link.path)}
              className="text-2xl font-serif font-bold text-black border-b border-gray-200 py-4 block w-full active:bg-gray-50 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button onClick={toggleLanguage} className="self-start text-sm font-bold uppercase tracking-widest px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors mt-4">
             {t('nav.switch_text')}
          </button>
        </div>
      )}
    </nav>
  );
}
