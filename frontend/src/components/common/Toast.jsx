import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotification } from '../../store/useNotification';

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[320px] max-w-md ${
              n.type === 'error' 
                ? 'bg-red-50/90 border-red-100 text-red-900' 
                : n.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900'
                : 'bg-white/90 border-gray-100 text-gray-900'
            }`}
          >
            <div className="flex-shrink-0">
              {n.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
              {n.type === 'success' && <CheckCircle className="text-emerald-500" size={20} />}
              {(n.type === 'info' || !n.type) && <Info className="text-blue-500" size={20} />}
            </div>
            
            <p className="flex-1 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              {n.message}
            </p>

            <button 
              onClick={() => removeNotification(n.id)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
