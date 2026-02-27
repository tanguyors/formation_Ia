"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Clock, Trophy, Map, Lock, CheckCircle2 } from 'lucide-react';

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

const SessionModalVibe2: React.FC<Props> = ({ session, onClose, onLaunch }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const getStatusConfig = () => {
    switch (session.status) {
      case 'COMPLETED':
        return {
          label: "Module Termin\u00e9",
          colorClass: "bg-green-50 border-green-200 text-green-600",
          progressWidth: "100%",
          progressBg: "bg-[#16A34A]",
          ctaLabel: "REVOIR LA SESSION >",
          ctaClass: "bg-orange-50 text-[#F97316] hover:bg-orange-100 border border-[#F97316]/20",
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case 'CURRENT':
        return {
          label: "En Cours",
          colorClass: "bg-orange-50 border-[#F97316]/25 text-[#F97316] animate-pulse",
          progressWidth: "50%",
          progressBg: "bg-[#F97316]",
          ctaLabel: "LANCER LA SESSION >",
          ctaClass: "bg-[#F97316] text-white hover:bg-[#ea580c]",
          icon: <div className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
        };
      case 'LOCKED':
      default:
        return {
          label: "Acc\u00e8s Verrouill\u00e9",
          colorClass: "bg-stone-100 border-stone-200 text-stone-400",
          progressWidth: "0%",
          progressBg: "bg-stone-300",
          ctaLabel: "ACC\u00c8S REFUS\u00c9",
          ctaClass: "bg-stone-100 text-stone-400 cursor-not-allowed",
          icon: <Lock className="w-3 h-3" />
        };
    }
  };

  const config = getStatusConfig();
  const isLocked = session.status === 'LOCKED';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop with heavy blur for Glassmorphism effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1917]/20 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-stone-100/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: config.progressWidth }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full ${config.progressBg}`}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-white/50 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content Area */}
          <div className="p-8 sm:p-10">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border flex items-center gap-2 font-bold ${config.colorClass}`}>
                  {config.icon}
                  {config.label}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  {session.number} &middot; {session.day}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-tight">
                {session.title}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#F97316] mt-1 font-bold">
                {session.weekTitle}
              </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/40 border border-stone-200/50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Trophy className="w-4 h-4 text-[#F97316] mb-2" />
                <span className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">R&eacute;compense</span>
                <span className="text-sm font-bold text-stone-800">+{session.xp} XP</span>
              </div>
              <div className="bg-white/40 border border-stone-200/50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Clock className="w-4 h-4 text-[#F97316] mb-2" />
                <span className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">Dur&eacute;e</span>
                <span className="text-sm font-bold text-stone-800">{session.duration}</span>
              </div>
              <div className="bg-white/40 border border-stone-200/50 rounded-2xl p-4 flex flex-col items-center text-center">
                <Map className="w-4 h-4 text-[#F97316] mb-2" />
                <span className="text-[9px] text-stone-400 uppercase tracking-tighter mb-1">Secteur</span>
                <span className="text-sm font-bold text-stone-800">0{session.week}</span>
              </div>
            </div>

            {/* Briefing Section */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-[#F97316]" />
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-stone-800">
                  Briefing de Mission
                </h2>
              </div>
              <div className="bg-white/30 rounded-2xl p-6 border border-stone-200/30">
                <p className="text-sm text-stone-500 leading-relaxed italic">
                  &ldquo;{session.briefing}&rdquo;
                </p>
              </div>
            </section>

            {/* Action Area */}
            <footer className="flex flex-col gap-3">
              <button
                disabled={isLocked}
                onClick={onLaunch}
                className={`w-full py-4 rounded-xl text-xs font-bold tracking-widest transition-all transform flex items-center justify-center gap-2 ${config.ctaClass} ${!isLocked && 'active:scale-[0.98] hover:shadow-md'}`}
              >
                {config.ctaLabel}
              </button>
            </footer>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F97316]/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SessionModalVibe2;
