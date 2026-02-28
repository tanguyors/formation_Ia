"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Trophy,
  Zap,
  Target,
  Shield,
  Code,
  Terminal,
  ChevronRight,
  Lock,
  Workflow
} from 'lucide-react';

const DashSidebarVibeA = () => {
  const user = {
    role: "OPÉRATEUR",
    level: 1,
    xp: 100,
    maxXp: 1200,
    sessionsDone: 1,
    totalSessions: 12
  };

  const badges = [
    { id: 1, label: "Premier Module", icon: Target, earned: true },
    { id: 2, label: "Streak 3 jours", icon: Zap, earned: true },
    { id: 3, label: "Quiz Parfait", icon: Trophy, earned: false },
    { id: 4, label: "Terminal Master", icon: Terminal, earned: false },
    { id: 5, label: "Code Architect", icon: Code, earned: false },
    { id: 6, label: "System Shield", icon: Shield, earned: false },
  ];

  const nextSession = {
    title: "Maîtriser les fondamentaux de Claude Code",
    meta: "Semaine 1 • Lundi",
    status: "PROCHAINE ÉTAPE"
  };

  return (
    <aside className="w-96 h-full min-h-screen bg-[#FFF7ED] border-r border-stone-200 p-8 flex flex-col gap-10 font-mono select-none">

      {/* 1. PROFIL & XP */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm overflow-hidden">
              <User size={28} className="text-stone-400 translate-y-1" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#d97757] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#FFF7ED]">
              LVL {user.level}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-0.5">Grade Actuel</span>
            <h2 className="text-lg font-bold text-stone-900 leading-none tracking-tight">{user.role}</h2>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold">Progression XP</span>
            <span className="text-[10px] text-stone-500">{user.xp} / {user.maxXp} XP</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(user.xp / user.maxXp) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#d97757]"
            />
          </div>
        </div>
      </section>

      {/* 2. INVENTAIRE DES BADGES */}
      <section className="flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Inventaire des Badges</h3>
          <span className="text-[10px] text-stone-400">2/6</span>
        </header>

        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={badge.earned ? { scale: 1.05, y: -2 } : {}}
              className={`
                aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 p-2 transition-all
                ${badge.earned
                  ? 'bg-white border-orange-200 shadow-sm'
                  : 'bg-stone-50 border-stone-200 opacity-60'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${badge.earned ? 'bg-orange-50 text-[#d97757]' : 'bg-stone-100 text-stone-400'}
              `}>
                {badge.earned ? <badge.icon size={18} /> : <Lock size={14} />}
              </div>
              <span className={`text-[8px] text-center font-bold uppercase tracking-tighter leading-tight px-1
                ${badge.earned ? 'text-stone-700' : 'text-stone-400'}
              `}>
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PROCHAINE SESSION CARD */}
      <section className="mt-auto">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-[#d97757]/30 transition-colors group">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-[#d97757]/20 text-[#d97757] text-[9px] font-bold tracking-widest w-fit animate-pulse">
              {nextSession.status}
            </span>
            <h4 className="text-sm font-bold text-stone-800 leading-snug pt-1">
              {nextSession.title}
            </h4>
            <p className="text-[10px] text-stone-500">
              {nextSession.meta}
            </p>
          </div>

          <button className="w-full bg-[#d97757] hover:bg-[#c4674a] text-white text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95">
            CONTINUER LA QUÊTE
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 4. FOOTER STATS */}
      <footer className="pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between text-stone-400">
          <div className="flex items-center gap-2">
            <Workflow size={14} />
            <span className="text-[10px] uppercase tracking-widest font-medium">Secteurs explorés</span>
          </div>
          <span className="text-[11px] font-bold text-stone-600">
            {user.sessionsDone}/{user.totalSessions}
          </span>
        </div>
        <div className="mt-3 w-full h-1 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-700"
            style={{ width: `${(user.sessionsDone / user.totalSessions) * 100}%` }}
          />
        </div>
      </footer>

    </aside>
  );
};

export default DashSidebarVibeA;
