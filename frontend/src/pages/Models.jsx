import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export default function Models() {
  const { t } = useTranslation();
  const CATEGORIAS = t('models.categories', { returnObjects: true }) || [];
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCatIndex, setActiveCatIndex] = useState(0);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        setModels(data);
      } catch (err) {
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  // Filtro
  const filteredModels = useMemo(() => {
    if (activeCatIndex === 0) return models;
    
    // List of static internal values for comparison
    const internalMapping = [
      'ALL',
      'ALTA COSTURA',
      'COMERCIAL',
      'EDITORIAL',
      'CURVY / PLUS SIZE',
      'FITNESS'
    ];
    
    // Normalize target category to an internal value
    const targetInternal = internalMapping[activeCatIndex];
    
    return models.filter(m => {
      const modelCat = m.category?.toUpperCase();
      return modelCat === targetInternal;
    });
  }, [activeCatIndex, models, CATEGORIAS]);

  // Animaciones Framer Motion
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-brand-white min-h-screen pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black pb-8 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">{t('models.subtitle')}</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold tracking-tighter uppercase text-brand-black leading-none">
              {t('models.title')}
            </h1>
          </div>
          
          <p className="text-gray-500 font-sans text-sm md:text-base max-w-sm mt-6 md:mt-0 md:text-right">
            {t('models.desc')}
          </p>
        </div>

        {/* Filtros Categoría */}
        <div className="flex flex-nowrap overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-3 md:gap-4 mb-16 pb-2">
          {CATEGORIAS.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCatIndex(idx)}
              className={`flex-none snap-center px-6 py-3 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all border whitespace-nowrap active:scale-95 ${
                activeCatIndex === idx 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 bg-transparent text-gray-500 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla de Modelos */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-300" size={48} />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode='popLayout'>
              {filteredModels.map(model => (
                <motion.div 
                  key={model.id}
                  layout
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative cursor-pointer block pb-4"
                >
                  <Link to={`/models/${model.id}`}>
                    {/* Imagen */}
                    <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden relative mb-6">
                      <img 
                        src={model.images[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} 
                        alt={model.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      />
                    
                    {/* Overlay Hover en Imagen */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-black px-6 py-3 uppercase tracking-widest text-[10px] md:text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {t('models.view_profile')}
                      </span>
                    </div>
                  </div>

                  {/* Info Inferior */}
                  <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-2 md:pb-4 group-hover:border-black transition-colors">
                    <div className="mb-1 md:mb-0">
                      <h3 className="text-xs sm:text-base md:text-2xl font-serif font-bold text-brand-black leading-none mb-1 md:mb-2 truncate w-full">{model.name}</h3>
                      <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-gray-500 truncate">{model.category}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-[8px] md:text-xs font-sans text-gray-400 block leading-none md:mb-1">{t('models.height')}</span>
                      <span className="text-[10px] md:text-sm font-bold font-sans text-black leading-none">{model.height}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {filteredModels.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">{t('models.no_models')}</p>
            <button 
              onClick={() => setActiveCatIndex(0)}
              className="mt-6 border-b border-black pb-1 text-xs uppercase font-bold tracking-widest"
            >
              {t('models.view_all')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
