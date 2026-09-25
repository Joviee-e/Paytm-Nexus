import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '../../context/NexusContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useNexus();

  if (!toastMessage) return null;

  const renderIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-nexus-cyan shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed top-[88px] left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none w-max max-w-[min(90vw,420px)]">
        <motion.div
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0E1528]/95 border border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs text-slate-200"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {renderIcon()}
          <span className="flex-1 font-medium">{toastMessage.text}</span>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
