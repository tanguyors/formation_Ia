"use client";
// REQUIRED DEPENDENCIES:
// - framer-motion (npm install framer-motion)
// - lucide-react (npm install lucide-react)
// - clsx (npm install clsx)
// - tailwind-merge (npm install tailwind-merge)

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Clock, Zap, MapPin, Lock, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

interface SessionModalProps {
  session: Session;
  onClose: () => void;
  onLaunch: () => void;
}

/**
 * SessionModalVibe1 - Bento Editorial Style
 * A refined, magazine-inspired preview modal with high-contrast typography
 * and a clean structural grid.
 */
export default function SessionModalVibe1({ session, onClose, onLaunch }: SessionModalProps) {

  // Prevent scroll when modal is open
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

  const isLocked = session.status === 'LOCKED';
  const isCompleted = session.status === 'COMPLETED';
  const isCurrent = session.status === 'CURRENT';

  // Config mapping based on status
  const statusConfig = {
    COMPLETED: {
      label: "Module Termin\u00e9",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle2,
      cta: "REVOIR LA SESSION >",
      progress: "w-full bg-green-500"
    },
    CURRENT: {
      label: "En Cours",
      color: "text-[#F97316]",
      bg: "bg-orange-50",
      border: "border-[#F97316]/25",
      icon: Zap,
      cta: "LANCER LA SESSION >",
      progress: "w-1/2 bg-[#F97316]"
    },
    LOCKED: {
      label: "Acc\u00e8s Verrouill\u00e9",
      color: "text-stone-400",
      bg: "bg-stone-100",
      border: "border-stone-200",
      icon: Lock,
      cta: "ACC\u00c8S REFUS\u00c9",
      progress: "w-0 bg-stone-300"
    }
  };

  const config = statusConfig[session.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200"
      >
        {/* Progress Bar (Top) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isCompleted ? "100%" : isCurrent ? "50%" : "0%" }}
            className={cn("h-full transition-all duration-1000 ease-out", config.progress)}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border",
              config.bg, config.color, config.border,
              isCurrent && "animate-pulse"
            )}>
              {config.label}
            </span>
            <span className="text-stone-400 text-[10px] uppercase tracking-widest">
              {session.number} &middot; {session.day}
            </span>
          </div>

          {/* Large Editorial Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-2 italic leading-tight">
            {session.title}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#F97316] font-bold mb-10">
            SEMAINE {session.week} : {session.weekTitle}
          </p>

          {/* Bento Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 border border-stone-200 p-4 rounded-lg group hover:border-[#F97316]/20 transition-colors">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Zap size={12} className="text-[#F97316]" />
                <span className="text-[9px] uppercase tracking-widest">R&eacute;compense</span>
              </div>
              <div className="text-lg font-bold text-stone-900">+{session.xp} XP</div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-4 rounded-lg group hover:border-[#F97316]/20 transition-colors">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Clock size={12} />
                <span className="text-[9px] uppercase tracking-widest">Dur&eacute;e</span>
              </div>
              <div className="text-lg font-bold text-stone-900">{session.duration}</div>
            </div>

            <div className="bg-slate-50 border border-stone-200 p-4 rounded-lg group hover:border-[#F97316]/20 transition-colors">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <MapPin size={12} />
                <span className="text-[9px] uppercase tracking-widest">Secteur</span>
              </div>
              <div className="text-lg font-bold text-stone-900">0{session.week}</div>
            </div>
          </div>

          {/* Briefing Content */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2 text-stone-900 mb-4">
              <Target size={16} className="text-[#F97316]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Briefing de Mission</h2>
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-stone-200" />
              <p className="text-sm text-stone-500 leading-relaxed">
                {session.briefing}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-stone-100">
            <button
              onClick={onLaunch}
              disabled={isLocked}
              className={cn(
                "w-full sm:w-auto px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3",
                isLocked
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : "bg-[#F97316] text-white hover:bg-[#ea580c] hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              )}
            >
              {isLocked && <Lock size={14} />}
              {config.cta}
            </button>
          </div>
        </div>

        {/* Locked Overlay Decoration */}
        {isLocked && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 scale-150">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap text-8xl font-black uppercase tracking-tighter">
                  ACC&Egrave;S RESTREINT ACC&Egrave;S RESTREINT ACC&Egrave;S RESTREINT
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
