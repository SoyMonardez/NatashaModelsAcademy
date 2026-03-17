import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_SLIDES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop', title: 'ADDICTED TO FASHION.' },
  { id: 2, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop', title: 'SPRING IS AROUND THE CORNER' },
  { id: 3, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop', title: 'NEW RECRUITS 2024' },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === DUMMY_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-black">
      <AnimatePresence initial={false}>
        <motion.img
          key={current}
          src={DUMMY_SLIDES[current].url}
          alt="Carousel Slide"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 mix-blend-difference">
        <motion.h1 
          key={`title-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white font-serif text-5xl md:text-8xl tracking-tighter uppercase max-w-5xl leading-none"
        >
          {DUMMY_SLIDES[current].title}
        </motion.h1>
      </div>

      {/* Pagination indicators */}
      <div className="absolute bottom-10 right-10 flex flex-col space-y-2">
        {DUMMY_SLIDES.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 transition-all duration-500 bg-white ${current === idx ? 'w-8' : 'w-4 opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
}
