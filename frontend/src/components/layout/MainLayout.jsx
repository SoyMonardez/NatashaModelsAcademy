import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Lenis from 'lenis';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Smooth Scroll (Lenis) - Desktop Only for Performance
  useEffect(() => {
    // Check if it's a mobile/touch device
    const isMobile = ("matchMedia" in window && window.matchMedia("(max-width: 768px)").matches) || 
                     ("ontouchstart" in window) || 
                     (navigator.maxTouchPoints > 0);
    
    if (!isMobile) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-brand-white text-brand-black">
      <Navbar />
      <main className={`flex-grow ${pathname === '/' ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
