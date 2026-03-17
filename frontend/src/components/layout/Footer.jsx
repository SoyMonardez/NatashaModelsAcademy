import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-black text-brand-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-6 tracking-widest">NATASHA<br/>MODELS ACADEMY</h2>
            <p className="text-gray-400 max-w-sm mb-8 font-sans leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><TikTokIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-400">{t('footer.links')}</h3>
            <ul className="space-y-4">
              <li><Link to="/models" className="hover:text-gray-300 transition-colors uppercase text-sm tracking-wide">{t('nav.models')}</Link></li>
              <li><Link to="/courses" className="hover:text-gray-300 transition-colors uppercase text-sm tracking-wide">{t('nav.courses')}</Link></li>
              <li><Link to="/inscriptions" className="hover:text-gray-300 transition-colors uppercase text-sm tracking-wide">{t('nav.inscriptions')}</Link></li>
              <li><Link to="/news" className="hover:text-gray-300 transition-colors uppercase text-sm tracking-wide">{t('nav.news')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-400">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>contacto@natashamodels.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>San Juan, Argentina<br/>Av. Principal 123</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Natasha Models Academy. {t('footer.rights')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/legal" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
