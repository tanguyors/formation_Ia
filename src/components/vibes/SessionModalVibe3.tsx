"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Clock, Zap, Shield, ChevronRight } from 'lucide-react';

interface Session {
  id: string;
  number: string;
  title: string;
  week: number;
  weekTitle: string;
  day: string;
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED';
  briefing: string;
  duration: string;
  xp: number;
}

interface Props {
  session: Session;
  onClose: () => void;
  onLaunch: () => void;
}

const SessionModalVibe3: React.FC<Props> = ({ session, onClose, onLaunch }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isLocked = session.status === 'LOCKED';
  const isCompleted = session.status === 'COMPLETED';
  const isCurrent = session.status === 'CURRENT';

  const getStatusConfig = () => {
    switch (session.status) {
      case 'COMPLETED':
        return {
          label: 'Module Termin\u00e9',
          colorClass: 'bg-green-50 border-green-200 text-green-600',
          progressWidth: '100%',
          progressColor: 'bg-[#16A34A]',
          cta: 'REVOIR LA SESSION'
        };
      case 'CURRENT':
        return {
          label: 'En Cours',
          colorClass: 'bg-orange-50 border-[#F97316]/25 text-[#F97316] animate-pulse',
          progressWidth: '50%',
          progressColor: 'bg-[#F97316]',
          cta: 'LANCER LA SESSION'
        };
      case 'LOCKED':
      default:
        return {
          label: 'Acc\u00e8s Verrouill\u00e9',
          colorClass: 'bg-stone-100 border-stone-200 text-stone-400',
          progressWidth: '0%',
          progressColor: 'bg-stone-300',
          cta: 'ACC\u00c8S REFUS\u00c9'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[580px] bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200"
        >
          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: config.progressWidth }}
              className={`h-full ${config.progressColor} transition-all duration-700 ease-out`}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
          >
            <X size={18} />
          </button>

          <div className="p-8 md:p-10">
            {/* Header Metadata */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  {session.number} &middot; {session.day}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  Semaine {session.week}
                </span>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-widest ${config.colorClass}`}>
                {config.label}
              </div>
            </div>

            {/* Session Title */}
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-8 leading-tight">
              {session.title}
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-50 border border-stone-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <Zap size={14} className="text-[#F97316] mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">R&eacute;compense</span>
                <span className="text-xs font-bold text-stone-800">+{session.xp} XP</span>
              </div>
              <div className="bg-slate-50 border border-stone-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <Clock size={14} className="text-[#F97316] mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Dur&eacute;e</span>
                <span className="text-xs font-bold text-stone-800">{session.duration}</span>
              </div>
              <div className="bg-slate-50 border border-stone-200 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <Shield size={14} className="text-[#F97316] mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Secteur</span>
                <span className="text-xs font-bold text-stone-800">0{session.week}</span>
              </div>
            </div>

            {/* Briefing Section */}
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <Target size={14} className="text-stone-400" />
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-800">
                  Briefing de Mission
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-stone-200" />
                <p className="pl-6 text-sm text-stone-500 leading-relaxed text-justify">
                  {session.briefing}
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center space-y-4">
              <button
                disabled={isLocked}
                onClick={onLaunch}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 transition-all group
                  ${isLocked
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    : isCompleted
                      ? 'bg-white border border-[#F97316]/20 text-[#F97316] hover:bg-orange-50'
                      : 'bg-[#F97316] text-white hover:bg-[#ea580c] shadow-sm hover:shadow-md'
                  }`}
              >
                <span className="text-[11px] font-bold tracking-widest">{config.cta}</span>
                {!isLocked && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SessionModalVibe3;
