import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ShieldCheck, X, MapPin, Phone, Instagram, Youtube, Mail, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

function Counter({ from = 0, to, duration = 2.5, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTime = null;
      let animationFrame;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(easeOut * (to - from) + from);
        setValue(current);
        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        } else {
          setValue(to);
        }
      };
      animationFrame = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{prefix}{value}{suffix}</span>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const parallaxImage = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1.4, ease: [0.2, 0.65, 0.3, 0.9] } }
};

export default function Home() {
  const { t } = useTranslation();

  const EVENTS_IMAGES = [
    "/img/f29.jpeg", "/img/f30.jpeg", "/img/f31.jpeg", "/img/f32.jpeg", 
    "/img/f33.jpeg", "/img/f34.jpeg", "/img/f18.jpeg", "/img/f21.jpeg", 
    "/img/f14.jpeg", "/img/f22.jpeg", "/img/f23.jpeg", "/img/f20.jpeg"
  ];

  const COURSES_DATA = t('home.courses.courses_data', { returnObjects: true }) || [];


  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formStatus, setFormStatus] = useState('idle');
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would normally dispatch an API call
    // For now, just trigger the success modal
    setFormStatus('success');
  };
  return (
    <div className="w-full">
      {/* Hero Video - Edited Editorial Aesthetic */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4" id="inicio">
        <video 
          autoPlay loop muted playsInline preload="auto" poster="/img/portada.jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 grayscale opacity-90"
        >
          <source src="/img/Portada1.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[1]"></div>

        <motion.div 
          className="w-full relative z-10 mt-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl sm:text-8xl md:text-[10rem] text-brand-white font-sans font-bold uppercase tracking-tighter leading-none mb-4 md:mb-8"
          >
            NATASHA<br/>MODELS
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-white font-sans uppercase tracking-[0.4em] font-bold text-[10px] md:text-sm mb-12 max-w-2xl mx-auto px-4 mt-8 opacity-80"
          >
            {t('home.hero.welcome')}
          </motion.p>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.a 
          href="#about" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white hover:opacity-100 transition-opacity flex flex-col items-center gap-2 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">{t('home.hero.explore')}</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.a>
      </section>

      {/* Estadísticas */}
      <section className="bg-brand-white py-16 md:py-24 border-b border-gray-200 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto px-2 md:px-6 grid grid-cols-4 gap-2 md:gap-12 text-center text-brand-black"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl sm:text-2xl md:text-5xl font-serif font-bold mb-1 md:mb-3"><Counter prefix="+" to={1000} /></h3>
            <p className="text-[7px] sm:text-[9px] md:text-xs uppercase tracking-tighter md:tracking-widest text-gray-500 font-bold leading-tight break-words">{t('home.stats.graduates')}</p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl sm:text-2xl md:text-5xl font-serif font-bold mb-1 md:mb-3"><Counter to={12} /></h3>
            <p className="text-[7px] sm:text-[9px] md:text-xs uppercase tracking-tighter md:tracking-widest text-gray-500 font-bold leading-tight break-words">{t('home.stats.years_exp')}</p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl sm:text-2xl md:text-5xl font-serif font-bold mb-1 md:mb-3"><Counter to={25} suffix="+" /></h3>
            <p className="text-[7px] sm:text-[9px] md:text-xs uppercase tracking-tighter md:tracking-widest text-gray-500 font-bold leading-tight break-words">{t('home.stats.events')}</p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl sm:text-2xl md:text-5xl font-serif font-bold mb-1 md:mb-3"><Counter to={100} suffix="%" /></h3>
            <p className="text-[7px] sm:text-[9px] md:text-xs uppercase tracking-tighter md:tracking-widest text-gray-500 font-bold leading-tight break-words">{t('home.stats.inclusive')}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Academy Section - Editorial Stark Layout */}
      <section id="about" className="py-16 md:py-32 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 border-t border-black mt-12 md:mt-0 overflow-hidden">
         <motion.div 
          className="md:w-5/12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase leading-[0.9] mb-8 overflow-hidden">
            <motion.span className="block" variants={fadeInUp}>{t('home.about.title1')}</motion.span>
            <motion.span className="block" variants={fadeInUp}>{t('home.about.title2')}</motion.span>
            <motion.span className="block" variants={fadeInUp}>{t('home.about.title3')}</motion.span>
          </motion.h2>
          <motion.span variants={fadeInUp} className="text-[10px] uppercase tracking-[0.4em] font-bold text-black border-l-2 border-black pl-4 mb-8 block">{t('home.about.subtitle')}</motion.span>
          <motion.p variants={fadeInUp} className="text-gray-600 font-sans text-lg md:text-xl leading-relaxed mb-10">
            {t('home.about.desc')}
          </motion.p>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-4 border-b border-black pb-2 cursor-pointer group hover:opacity-70 transition-opacity">
            <span className="font-bold text-[10px] md:text-xs tracking-widest uppercase text-black">{t('home.about.link')}</span>
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </motion.div>
        </motion.div>
        <motion.div 
          className="md:w-7/12 w-full flex justify-end mt-4 md:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="w-full md:w-[85%] h-[400px] md:h-[750px] bg-gray-100 overflow-hidden relative group">
            <motion.img 
              variants={parallaxImage}
              src="/img/portada.jpeg" 
              alt="About Natasha" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* Cursos - List Layout */}
      <section id="cursos" className="py-16 md:py-32 bg-white">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 border-b border-black pb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-left w-full">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">{t('home.courses.subtitle')}</span>
                <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase">{t('home.courses.title')}</h2>
              </motion.div>
              <motion.span variants={fadeInUp} className="text-sm font-sans uppercase tracking-widest text-gray-400 mt-4 md:mt-0 text-left md:text-right w-full md:w-auto hover:text-black transition-colors">
                <Link to="/courses">{t('home.courses.view_all')}</Link>
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col w-full border-t border-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={staggerContainer}
            >
              {COURSES_DATA.map((course, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 md:py-12 border-b border-gray-200 group cursor-pointer hover:bg-gray-50 transition-colors px-2 md:px-0"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-center gap-6 md:gap-16 w-full md:w-auto mb-4 md:mb-0">
                    <span className="text-sm md:text-md font-sans font-bold text-gray-400 w-8">0{idx + 1}</span>
                    <h3 className="text-3xl md:text-5xl font-sans font-bold uppercase tracking-tight md:group-hover:pl-4 transition-all duration-300">
                      {course.title}
                    </h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 w-full md:w-auto pl-14 md:pl-0">
                     <p className="text-gray-500 text-sm md:text-md max-w-sm hidden md:block">
                       {course.desc}
                     </p>
                     <span className="uppercase tracking-[0.2em] text-[10px] font-bold border-b border-black pb-1 group-hover:text-gray-500 group-hover:border-gray-500 transition-all self-start md:self-auto">
                       {t('home.courses.discover')}
                     </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
         </div>
      </section>

      {/* Staff Section (Lookbook Style) */}
      <section id="staff" className="py-16 md:py-32 bg-white text-brand-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            className="mb-12 md:mb-24 flex flex-col md:flex-row justify-between md:items-end border-b border-black pb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            variants={staggerContainer}
          >
             <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-2 md:mb-0">{t('home.staff.title')}</motion.h2>
             <motion.span variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">{t('home.staff.subtitle')}</motion.span>
          </motion.div>
          
          <div className="flex flex-col gap-24 md:gap-32">
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-12 md:gap-24 group cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="w-full md:w-5/12 flex flex-col justify-center order-2 md:order-1 relative">
                <span className="text-[120px] md:text-[200px] leading-none font-serif text-gray-100 absolute -top-10 md:-top-32 -left-4 md:-left-12 -z-10 group-hover:text-gray-200 transition-colors">1</span>
                <span className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-2">No 01</span>
                <h3 className="font-sans text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none">Veronica<br/>Basso</h3>
                <p className="text-black font-sans uppercase tracking-[0.2em] text-xs font-bold mb-8 border-b border-black pb-4">
                   {t('home.staff.v_role')}
                </p>
                <p className="text-gray-500 font-sans text-base md:text-xl max-w-sm">
                  {t('home.staff.v_desc')}
                </p>
              </motion.div>
              <div className="w-full md:w-7/12 h-[350px] md:h-[800px] bg-gray-100 overflow-hidden order-1 md:order-2">
                <motion.img 
                  variants={parallaxImage}
                  src="/img/f26.jpeg" 
                  alt="Veronica Ayelen Basso" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row items-center gap-12 md:gap-24 group cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="w-full md:w-7/12 h-[350px] md:h-[800px] bg-gray-100 overflow-hidden">
                <motion.img 
                  variants={parallaxImage}
                  src="/img/natasha.jpeg" 
                  alt="Natacha Vila de Basso" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <motion.div variants={fadeInUp} className="w-full md:w-5/12 flex flex-col justify-center relative">
                <span className="text-[120px] md:text-[200px] leading-none font-serif text-gray-100 absolute -top-10 md:-top-32 right-0 md:-right-12 -z-10 group-hover:text-gray-200 transition-colors text-right">2</span>
                <span className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-2">No 02</span>
                <h3 className="font-sans text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none">Natacha<br/>Vila</h3>
                <p className="text-black font-sans uppercase tracking-[0.2em] text-xs font-bold mb-8 border-b border-black pb-4">
                   {t('home.staff.n_role')}
                </p>
                <p className="text-gray-500 font-sans text-base md:text-xl max-w-sm">
                  {t('home.staff.n_desc')}
                </p>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Eventos / Portfolio */}
      <section id="eventos" className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-8">
         <motion.div 
           className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 border-b border-black pb-8 gap-4 md:gap-6"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "0px" }}
           variants={staggerContainer}
         >
            <motion.div variants={fadeInUp}>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">{t('home.events.subtitle')}</span>
              <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase">
                {t('home.events.title')}
              </h2>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-gray-500 font-sans text-sm max-w-xs md:text-right hidden md:block">
              {t('home.events.desc')}
            </motion.p>
         </motion.div>

         {/* Hero Image in Gallery */}
         <motion.div 
           className="w-full h-[450px] md:h-[700px] bg-gray-100 overflow-hidden group cursor-pointer relative"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "0px" }}
         >
            <motion.img 
              key={activeEventIndex}
              initial={{ opacity: 0.6, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={EVENTS_IMAGES[activeEventIndex]} 
              alt={`Destacado ${activeEventIndex + 1}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all duration-700 flex flex-col justify-end p-10">
               <h4 className="text-white font-serif text-4xl mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{t('home.events.gallery')} {activeEventIndex + 1}</h4>
               <p className="text-white uppercase tracking-widest text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">{t('home.events.portfolio')}</p>
            </div>
         </motion.div>

         {/* Swiper Gallery */}
         <style>{`
            .event-swiper .swiper-slide {
                transition: all 0.5s ease;
                opacity: 0.4;
                transform: scale(0.9);
            }
            .event-swiper .swiper-slide-active {
                opacity: 1;
                transform: scale(1);
            }
            .swiper-pagination-bullet {
                width: 8px !important;
                height: 8px !important;
                border-radius: 50% !important;
                background: #d1d5db !important;
                opacity: 1 !important;
                transition: all 0.3s ease;
                margin: 0 4px !important;
            }
            .swiper-pagination-bullet-active {
                width: 32px !important;
                border-radius: 4px !important;
                background: #e5e7eb !important;
                position: relative;
                overflow: hidden;
            }
            .swiper-pagination-bullet-active::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: #000;
                animation: fillProgress 4s linear forwards;
            }
            @keyframes fillProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
         `}</style>
         <div className="w-full">
            <Swiper
              key="event-swiper-loop-fixed"
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.5}
              centeredSlides={true}
              loop={true}
              initialSlide={0}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              onSlideChange={(swiper) => setActiveEventIndex(swiper.realIndex)}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: true },
                1024: { slidesPerView: 3, centeredSlides: true },
                1280: { slidesPerView: 3, centeredSlides: true }
              }}
              className="pb-16 mt-8 event-swiper"
            >
              {EVENTS_IMAGES.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer group shadow-xl">
                    <img src={img} alt={`Event ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" loading="lazy" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
         </div>
      </section>

      {/* Map & Contact Teaser */}
      <section id="location" className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-8 w-full border-t border-black overflow-hidden">
         <motion.div 
           className="flex flex-col lg:flex-row gap-8 lg:gap-24"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "0px" }}
           variants={staggerContainer}
         >
            <motion.div variants={fadeInUp} className="w-full lg:w-5/12 flex flex-col justify-between">
               <div>
                 <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-6 block">{t('home.location.subtitle')}</span>
                 <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-8xl font-sans font-bold tracking-tighter uppercase mb-10 text-brand-black leading-none break-words" dangerouslySetInnerHTML={{__html: t('home.location.title').replace(' ', '<br/>')}}></h2>
               </div>
               
               <div className="w-full border-t border-black pt-6 md:pt-8 mb-10 md:mb-12">
                 <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 md:mb-0 md:w-1/3 flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-black" strokeWidth={2} /> {t('home.location.address')}
                   </p>
                   <p className="text-lg md:text-xl font-sans text-brand-black md:w-2/3 leading-tight whitespace-nowrap">173 Laprida, San Juan</p>
                 </div>
                 
                 <div className="flex flex-col md:flex-row md:items-center justify-between">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 md:mb-0 md:w-1/3 flex items-center gap-2">
                     <Phone className="w-4 h-4 text-black" strokeWidth={2} /> {t('home.location.phone')}
                   </p>
                   <p className="text-lg md:text-xl font-sans text-brand-black md:w-2/3 leading-tight whitespace-nowrap">+54 264 523 3264</p>
                 </div>
               </div>

               <Link to="/inscriptions" className="inline-block bg-black text-white px-10 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors w-full lg:w-max text-center">
                  {t('home.location.inscriptions_btn')}
               </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="w-full lg:w-7/12 h-[500px] lg:h-[700px]">
              <div className="w-full h-full relative group overflow-hidden bg-gray-100">
                <iframe 
                   src="https://www.google.com/maps/embed?pb=!4v1766633741317!6m8!1m7!1smzNqT6D4zS8OvujERwGKAw!2m2!1d-31.53527229195894!2d-68.52358241723796!3f173.4691761499551!4f-5.8006907712508!5f2.544987852952425" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0, filter: 'grayscale(100%) contrast(1.1) brightness(0.9)' }} 
                   allowFullScreen="" 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Google Maps"
                   className="w-full h-full transition-all duration-700 opacity-90 group-hover:opacity-100"
                 ></iframe>
                 <div className="absolute inset-0 z-10 pointer-events-none group-hover:bg-transparent bg-black/5 transition-colors duration-500"></div>
              </div>
            </motion.div>
         </motion.div>
      </section>

      {/* Contact Form & Socials */}
      <section id="contact" className="pb-16 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 w-full overflow-hidden">
         <motion.div 
           className="flex flex-col lg:flex-row gap-12 lg:gap-24 mt-16 md:mt-24 border-t border-black pt-16 md:pt-24"
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "0px" }}
           variants={staggerContainer}
         >
             <motion.div variants={fadeInUp} className="w-full lg:w-5/12 flex flex-col justify-between">
                 <div>
                   <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-6 md:mb-8 text-brand-black leading-none" dangerouslySetInnerHTML={{__html: t('home.contact.title').replace(' ', '<br/>')}}></h2>
                   <p className="text-gray-500 font-sans text-base md:text-lg mb-10 md:mb-12 lg:max-w-sm">
                     {t('home.contact.desc')}
                   </p>
                 </div>
                 
                 <div>
                   <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-6 block border-t border-black pt-6">{t('home.contact.socials')}</span>
                   <div className="flex gap-4 mb-4 flex-wrap">
                       <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors group">
                          <Youtube className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors"/>
                       </a>
                       <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors group">
                          <Instagram className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors"/>
                       </a>
                       <a href="https://wa.me/542645233264" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors group">
                          <FaWhatsapp className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors"/>
                       </a>
                       <a href="mailto:contacto@natashamodels.com" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors group">
                          <Mail className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors"/>
                       </a>
                       <a href="tel:+542645233264" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors group">
                          <Phone className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors"/>
                       </a>
                   </div>
                 </div>
             </motion.div>
             
             <motion.div variants={fadeInUp} className="w-full lg:w-7/12 mt-8 lg:mt-0">
                <form className="flex flex-col gap-10 md:gap-12" onSubmit={handleFormSubmit}>
                   <div className="flex flex-col md:flex-row gap-10 md:gap-8">
                       <div className="w-full relative group">
                         <input type="text" id="name" required className="w-full border-b border-gray-300 py-3 md:py-4 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                         <label htmlFor="name" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('home.contact.form_name')}</label>
                       </div>
                       
                       <div className="w-full relative group">
                         <input type="email" id="email" required className="w-full border-b border-gray-300 py-3 md:py-4 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                         <label htmlFor="email" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('home.contact.form_email')}</label>
                       </div>
                   </div>
                   
                   <div className="w-full relative group">
                     <input type="tel" id="phone" required className="w-full border-b border-gray-300 py-3 md:py-4 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors peer" placeholder=" " />
                     <label htmlFor="phone" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('home.contact.form_phone')}</label>
                   </div>
                   
                   <div className="w-full relative group mt-2 md:mt-4">
                     <textarea id="message" required rows="4" className="w-full border-b border-gray-300 py-3 md:py-4 bg-transparent outline-none uppercase tracking-widest text-xs font-bold text-black focus:border-black transition-colors resize-none peer" placeholder=" "></textarea>
                     <label htmlFor="message" className="absolute left-0 top-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-black">{t('home.contact.form_message')}</label>
                   </div>
                   
                   <button type="submit" className="self-end bg-black text-white px-12 md:px-16 py-5 md:py-6 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-white hover:text-black border border-black transition-colors w-full md:w-auto text-center mt-2 md:mt-4">
                     {t('home.contact.form_submit')}
                   </button>
                </form>
             </motion.div>
           </motion.div>
      </section>

      {/* Course Modal */}
      {selectedCourse && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedCourse(null)}
        >
          <div 
            className="bg-brand-white w-full max-w-2xl text-brand-black relative mt-auto mb-auto animate-fadeIn shadow-2xl p-10 md:p-14 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCourse(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6 text-brand-black" />
            </button>
            <h3 className="text-brand-black text-xs uppercase tracking-widest font-bold mb-4">{t('home.modals.course_detail')}</h3>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 capitalize">{selectedCourse.title}</h2>
            <div className="w-16 h-1 bg-black mb-8"></div>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed w-[95%]">
              {selectedCourse.desc}
            </p>

            <div className="mb-10">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">{t('home.modals.course_plan')}</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {selectedCourse.details.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <span className="mr-3 text-black text-lg leading-none">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-4 mt-10">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-4 border border-brand-black text-brand-black uppercase text-xs font-bold tracking-widest hover:bg-brand-black hover:text-white transition-colors"
                >
                  {t('home.modals.close')}
                </button>
                <Link 
                  to="/inscriptions"
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-4 bg-brand-black text-brand-white uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors"
                >
                  {t('home.modals.enroll')}
                </Link>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {formStatus === 'success' && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setFormStatus('idle')}
        >
          <div 
            className="bg-brand-white w-full max-w-lg text-brand-black relative p-12 border border-gray-200 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setFormStatus('idle')} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-brand-black" />
            </button>
            <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-black" strokeWidth={1} />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 tracking-tight uppercase" dangerouslySetInnerHTML={{__html: t('home.modals.msg_sent').replace(' ', '<br/>')}}></h2>
            <div className="w-12 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-gray-600 text-sm leading-relaxed mb-10 w-[90%] mx-auto">
              {t('home.modals.msg_desc')}
            </p>
            <button 
              onClick={() => setFormStatus('idle')}
              className="bg-black text-white px-10 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gray-900 transition-colors w-full"
            >
              {t('home.modals.accept')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
