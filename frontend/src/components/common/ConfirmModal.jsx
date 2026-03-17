import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-sm p-8 shadow-2xl border border-gray-100"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold uppercase tracking-tighter mb-2">{title}</h3>
            <p className="text-gray-500 text-xs uppercase tracking-widest leading-loose mb-8">{message}</p>
            
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 border border-gray-200 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-6 py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
