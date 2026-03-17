import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useNotification } from '../store/useNotification';

const DEPARTAMENTOS_SAN_JUAN = [
  "Capital", "Rawson", "Chimbas", "Rivadavia", "Santa Lucía", 
  "Pocito", "Caucete", "Jáchal", "Albardón", "Sarmiento", 
  "25 de Mayo", "San Martín", "Calingasta", "9 de Julio", 
  "Angaco", "Valle Fértil", "Iglesia", "Zonda", "Ullum"
];

const COUNTRY_CODES = [
  { code: "+54", country: "🇦🇷 AR" },
  { code: "+56", country: "🇨🇱 CL" },
  { code: "+598", country: "🇺🇾 UY" },
  { code: "+55", country: "🇧🇷 BR" },
  { code: "+595", country: "🇵🇾 PY" },
  { code: "+591", country: "🇧🇴 BO" },
  { code: "+51", country: "🇵🇪 PE" },
  { code: "+57", country: "🇨🇴 CO" },
  { code: "+52", country: "🇲🇽 MX" },
  { code: "+1", country: "🇺🇸 US/CA" },
  { code: "+34", country: "🇪🇸 ES" }
];

export default function Inscriptions() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    fecha_nacimiento: '',
    edad: '',
    sexo: '',
    codigo_pais: '+54',
    telefono: '',
    origen_tipo: '', // 'san_juan', 'otra_provincia', 'otro_pais'
    departamento: '',
    provincia: '',
    pais: ''
  });

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const settings = await res.json();
          const openSetting = settings.find(s => s.key === 'isInscriptionOpen');
          if (openSetting) setIsOpen(openSetting.value === 'true');
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Calcular edad automáticamente
  useEffect(() => {
    if (formData.fecha_nacimiento) {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, edad: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, edad: '' }));
    }
  }, [formData.fecha_nacimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 4) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INSCRIPTION',
          data: formData
        })
      });

      if (response.ok) {
        setDirection(1);
        setStep(4); // Success step
      } else {
        showNotification('Error al enviar la inscripción', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Error de conexión', 'error');
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center items-center mb-10 gap-2 md:gap-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${step === num ? 'bg-black text-white' : step > num ? 'bg-gray-300 text-gray-600' : 'border border-gray-300 text-gray-400'}`}>
              {step > num ? <Check className="w-4 h-4" /> : num}
            </div>
            {num < 3 && (
              <div className={`w-8 md:w-16 h-[1px] ml-2 md:ml-4 transition-colors duration-300 ${step > num ? 'bg-black' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">{t('inscriptions.subtitle')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tighter uppercase text-brand-black">
            {t('inscriptions.title')}
          </h1>
          {step < 4 && (
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm md:text-base">
              {t('inscriptions.desc')}
            </p>
          )}
        </div>

        {/* Steps Indicators */}
        {step < 4 && renderStepIndicators()}

        {/* Formulario con Animación */}
        <div className="bg-white border border-black p-6 md:p-12 relative overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !isOpen ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
               <X className="w-16 h-16 text-gray-300 mb-6" />
               <h2 className="text-2xl md:text-3xl font-sans font-bold uppercase mb-4 tracking-tighter">Inscripciones Cerradas</h2>
               <p className="text-gray-500 max-w-sm">Lo sentimos, las inscripciones para el próximo ciclo están cerradas actualmente. Síguenos en nuestras redes para enterarte de la próxima apertura.</p>
               <button onClick={() => window.history.back()} className="mt-8 border-b border-black text-xs font-bold uppercase tracking-widest pb-1">Volver</button>
            </div>
          ) : (
          <AnimatePresence custom={direction} mode="wait">
            
            {/* --- PASO 1 --- */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
                  {t('inscriptions.step1')}
                </h2>
                
                <div className="space-y-6">
                  <div className="relative group">
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                    <label htmlFor="nombre" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('inscriptions.name')}</label>
                  </div>
                  
                  <div className="relative group">
                    <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                    <label htmlFor="dni" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('inscriptions.dni')}</label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full relative group">
                      <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                      <label htmlFor="fecha_nacimiento" className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.dob')}</label>
                    </div>

                    <div className="w-full relative group">
                      <input type="text" id="edad" name="edad" value={formData.edad} readOnly className="w-full border-b border-gray-300 py-3 bg-gray-50 outline-none uppercase tracking-widest text-xs font-bold text-gray-500 peer" placeholder=" " />
                      <label htmlFor="edad" className="absolute left-0 -top-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('inscriptions.age')}</label>
                    </div>
                  </div>

                  <div className="relative pt-4">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">{t('inscriptions.sex')}</span>
                     <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold">
                          <input type="radio" name="sexo" value="Femenino" checked={formData.sexo === 'Femenino'} onChange={handleChange} className="accent-black" />
                          {t('inscriptions.female')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold">
                          <input type="radio" name="sexo" value="Masculino" checked={formData.sexo === 'Masculino'} onChange={handleChange} className="accent-black" />
                          {t('inscriptions.male')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold">
                          <input type="radio" name="sexo" value="Otro" checked={formData.sexo === 'Otro'} onChange={handleChange} className="accent-black" />
                          {t('inscriptions.other')}
                        </label>
                     </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={nextStep}
                    disabled={!formData.nombre || !formData.dni || !formData.fecha_nacimiento || !formData.sexo}
                    className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('inscriptions.next')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- PASO 2 --- */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
                  {t('inscriptions.step2')}
                </h2>
                
                <div className="space-y-6">
                  <div className="relative pt-4">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">{t('inscriptions.origin')}</span>
                     <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold border p-4 hover:bg-gray-50 transition-colors">
                          <input type="radio" name="origen_tipo" value="san_juan" checked={formData.origen_tipo === 'san_juan'} onChange={handleChange} className="accent-black w-4 h-4" />
                          {t('inscriptions.from_sj')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold border p-4 hover:bg-gray-50 transition-colors">
                          <input type="radio" name="origen_tipo" value="otra_provincia" checked={formData.origen_tipo === 'otra_provincia'} onChange={handleChange} className="accent-black w-4 h-4" />
                          {t('inscriptions.from_prov')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-bold border p-4 hover:bg-gray-50 transition-colors">
                          <input type="radio" name="origen_tipo" value="otro_pais" checked={formData.origen_tipo === 'otro_pais'} onChange={handleChange} className="accent-black w-4 h-4" />
                          {t('inscriptions.from_country')}
                        </label>
                     </div>
                  </div>

                  {formData.origen_tipo === 'san_juan' && (
                    <div className="relative group pt-4">
                      <select name="departamento" value={formData.departamento} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors appearance-none cursor-pointer">
                        <option value="" disabled>{t('inscriptions.dep_placeholder')}</option>
                        {DEPARTAMENTOS_SAN_JUAN.map(dep => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </select>
                      <label className="absolute left-0 -top-2 text-[10px] md:text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.dep')}</label>
                      <ChevronDownIcon className="w-4 h-4 absolute right-0 top-3 pointer-events-none" />
                    </div>
                  )}

                  {formData.origen_tipo === 'otra_provincia' && (
                    <div className="relative group pt-4">
                      <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder={t('inscriptions.prov_placeholder')} />
                      <label className="absolute left-0 -top-2 text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.prov')}</label>
                    </div>
                  )}

                   {formData.origen_tipo === 'otro_pais' && (
                    <div className="relative group pt-4">
                      <input type="text" name="pais" value={formData.pais} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder={t('inscriptions.country_placeholder')} />
                      <label className="absolute left-0 -top-2 text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.country')}</label>
                    </div>
                  )}

                </div>

                <div className="mt-auto pt-12 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="border border-black text-black px-6 py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t('inscriptions.back')}
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.origen_tipo || (formData.origen_tipo==='san_juan' && !formData.departamento) || (formData.origen_tipo==='otra_provincia' && !formData.provincia) || (formData.origen_tipo==='otro_pais' && !formData.pais)}
                    className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('inscriptions.next')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- PASO 3 --- */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
                  {t('inscriptions.step3')}
                </h2>
                
                <div className="space-y-8">
                   <p className="text-gray-500 text-sm">{t('inscriptions.phone_desc')}</p>
                   
                   <div className="flex gap-4 items-end">
                      <div className="w-1/3 md:w-1/4 relative group">
                        <select name="codigo_pais" value={formData.codigo_pais} onChange={handleChange} className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors appearance-none cursor-pointer">
                          {COUNTRY_CODES.map(c => (
                            <option key={c.code} value={c.code}>{c.country} ({c.code})</option>
                          ))}
                        </select>
                        <label className="absolute left-0 -top-2 text-[10px] md:text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.country_code')}</label>
                        <ChevronDownIcon className="w-4 h-4 absolute right-0 top-3 pointer-events-none" />
                      </div>
                      
                      <div className="w-2/3 md:w-3/4 relative group">
                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder="Ej: 264 123 4567" />
                        <label htmlFor="telefono" className="absolute left-0 -top-2 text-[10px] md:text-[10px] font-bold uppercase tracking-widest text-black">{t('inscriptions.phone')}</label>
                      </div>
                   </div>
                   
                   <div className="p-4 bg-gray-50 border border-gray-200 mt-6">
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-2">{t('inscriptions.summary')}</p>
                      <p className="text-sm font-sans">{formData.nombre} ({formData.edad} {t('inscriptions.years')}) - {formData.origen_tipo === 'san_juan' ? 'San Juan ('+formData.departamento+')' : formData.origen_tipo === 'otra_provincia' ? formData.provincia : formData.pais}</p>
                   </div>
                </div>

                <div className="mt-auto pt-12 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="border border-black text-black px-6 py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t('inscriptions.back')}
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!formData.telefono}
                    className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('inscriptions.finish')} <Check className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- PASO 4: ÉXITO --- */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                className="flex flex-col h-full items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-4xl font-sans font-bold uppercase tracking-tighter mb-4">
                  {t('inscriptions.success_title')}
                </h2>
                <p className="text-gray-500 max-w-md mx-auto" dangerouslySetInnerHTML={{ __html: t('inscriptions.success_desc', { nombre: formData.nombre, phone: formData.codigo_pais + ' ' + formData.telefono }) }} />
                <button 
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      nombre: '', dni: '', fecha_nacimiento: '', edad: '', sexo: '',
                      codigo_pais: '+54', telefono: '', origen_tipo: '', departamento: '', provincia: '', pais: ''
                    });
                  }}
                  className="mt-10 border-b border-black text-black uppercase tracking-widest text-xs font-bold pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                >
                  {t('inscriptions.another')}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
}

// Icono chevron para los select
function ChevronDownIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
