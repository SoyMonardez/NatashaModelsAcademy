import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useStore } from '../store/useStore';
import { useNotification } from '../store/useNotification';

export default function ModelDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [similarModels, setSimilarModels] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isBioOpen, setIsBioOpen] = useState(true);
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const { user, setLoginModalOpen } = useAuthStore();
  const { addToCart } = useStore();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/models/${id}`);
        if (!res.ok) throw new Error('Model not found');
        const data = await res.json();
        setModel(data);
        setActiveImage(data.images[0]?.url || '');

        const simRes = await fetch(`/api/models?category=${data.category}`);
        const simData = await simRes.json();
        setSimilarModels(simData.filter(m => m.id !== id).slice(0, 4));

        window.scrollTo(0, 0);
      } catch (err) {
        console.error(err);
        navigate('/models');
      } finally {
        setLoading(false);
      }
    };
    fetchModelData();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-white">
      <Loader2 className="animate-spin text-gray-300" size={48} />
    </div>
  );

  if (!model) return null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-brand-white min-h-screen pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8 md:mb-12 text-gray-500 hover:text-black transition-colors"
        >
          <Link to="/models" className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold">
            <ArrowLeft className="w-4 h-4" /> {t('model_detail.back')}
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <motion.div 
            className="w-full lg:w-5/12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-full aspect-[3/4] md:aspect-[4/5] max-h-[70vh] bg-gray-100 mb-4 overflow-hidden rounded-sm">
               <motion.img 
                 key={activeImage}
                 src={activeImage} 
                 alt={model.name} 
                 className="w-full h-full object-cover"
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5 }}
               />
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4">
               {model.images.map((img, index) => (
                 <button 
                   key={index}
                   onClick={() => setActiveImage(img.url)}
                   className={`relative overflow-hidden aspect-[3/4] cursor-pointer ${activeImage === img.url ? 'ring-2 ring-black ring-offset-2' : 'opacity-70 hover:opacity-100'} transition-all`}
                 >
                   <img src={img.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </motion.div>

          <div className="w-full lg:w-7/12 flex flex-col pt-4">
             <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
               <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">
                 {model.category}
               </span>
               <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase text-brand-black mb-8 leading-none">
                 {model.name}
               </h1>
               
               <div className="grid grid-cols-2 gap-8 border-t border-b border-gray-200 py-6 mb-10">
                 <div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">{t('model_detail.height')}</span>
                   <span className="text-3xl font-serif text-black">{model.height}m</span>
                 </div>
                 <div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">{t('model_detail.age')}</span>
                   <span className="text-3xl font-serif text-black">{model.age} <span className="text-xl font-sans font-normal text-gray-400">{t('model_detail.years')}</span></span>
                 </div>
               </div>

                {user ? (
                  <button 
                    onClick={() => {
                      addToCart(model);
                      showNotification('Modelo añadido a tu solicitud', 'success');
                    }}
                    className="w-full bg-black text-white px-8 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors flex items-center justify-center gap-2 mb-12 group"
                  >
                    {t('model_detail.booking')} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setLoginModalOpen(true)}
                    className="w-full bg-gray-100 text-gray-500 px-8 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 mb-12"
                  >
                    Login {t('model_detail.booking')}
                  </button>
                )}

               <div className="border-t border-gray-200 divide-y divide-gray-200">
                 <div className="py-6">
                   <button 
                     onClick={() => setIsStatsOpen(!isStatsOpen)}
                     className="w-full flex justify-between items-center text-left text-sm uppercase tracking-widest font-bold text-black focus:outline-none"
                   >
                     {t('model_detail.stats_title')}
                     {isStatsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                   </button>
                   <AnimatePresence>
                     {isStatsOpen && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="pt-6">
                           <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Medidas (Busto | Cintura | Cadera)</span>
                           <span className="text-lg text-black font-sans">{model.measurements || 'No especificadas'}</span>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               </div>
             </motion.div>
          </div>
        </div>

        {similarModels.length > 0 && (
          <div className="mt-32 border-t border-black pt-16">
            <h3 className="text-3xl font-sans font-bold tracking-tighter uppercase text-center mb-12">
              {t('model_detail.similar')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {similarModels.map(sim => (
                <Link to={`/models/${sim.id}`} key={sim.id} className="group block cursor-pointer">
                  <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                    <img src={sim.images[0]?.url || ''} alt={sim.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-bold text-center group-hover:text-gray-500 transition-colors">{sim.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-center">{sim.height}m</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
