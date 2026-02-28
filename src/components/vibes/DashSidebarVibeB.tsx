"use client";

import React from 'react';
import { Check, Lock, Play, Trophy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Session {
  id: string;
  number: string;
  title: string;
  week: string;
  day: string;
  status: 'completed' | 'current' | 'locked';
}

const SESSIONS: Session[] = [
  { id: '1', number: 'S01', title: 'Maîtriser les fondamentaux', week: 'Semaine 1', day: 'Lundi', status: 'completed' },
  { id: '2', number: 'S02', title: 'Configurer son environnement', week: 'Semaine 1', day: 'Mercredi', status: 'current' },
  { id: '3', number: 'S03', title: 'Techniques avancées', week: 'Semaine 1', day: 'Vendredi', status: 'locked' },
  { id: '4', number: 'S04', title: 'Introduction au MCP', week: 'Semaine 2', day: 'Lundi', status: 'locked' },
  { id: '5', number: 'S05', title: 'Serveurs MCP essentiels', week: 'Semaine 2', day: 'Mercredi', status: 'locked' },
  { id: '6', number: 'S06', title: 'Créer son serveur MCP', week: 'Semaine 2', day: 'Vendredi', status: 'locked' },
  { id: '7', number: 'S07', title: 'Comprendre les agents', week: 'Semaine 3', day: 'Lundi', status: 'locked' },
  { id: '8', number: 'S08', title: 'Claude Agent SDK', week: 'Semaine 3', day: 'Mercredi', status: 'locked' },
  { id: '9', number: 'S09', title: 'Agents avancés', week: 'Semaine 3', day: 'Vendredi', status: 'locked' },
  { id: '10', number: 'S10', title: 'Architecture complète', week: 'Semaine 4', day: 'Lundi', status: 'locked' },
  { id: '11', number: 'S11', title: 'Projet final', week: 'Semaine 4', day: 'Mercredi', status: 'locked' },
  { id: '12', number: 'S12', title: 'Certification', week: 'Semaine 4', day: 'Vendredi', status: 'locked' },
];

const ProgressRing = ({ current, total }: { current: number; total: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (current / total) * circumference;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-orange-200"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          className="text-[#d97757] transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-stone-900 font-mono">
        {current}/{total}
      </span>
    </div>
  );
};

export default function DashSidebarVibeB() {
  const completedCount = SESSIONS.filter(s => s.status === 'completed').length;

  return (
    <aside className="w-96 h-full bg-[#FFF7ED] border-r border-stone-200 font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">
            PARCOURS
          </h2>
          <p className="text-xs font-bold text-stone-900">CODEX_AI ACADEMY</p>
        </div>
        <ProgressRing current={completedCount} total={SESSIONS.length} />
      </div>

      {/* TIMELINE CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="relative ml-2">
          {/* Vertical Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-stone-200" />

          <div className="space-y-4">
            {SESSIONS.map((session) => (
              <div key={session.id} className="relative pl-8">
                {/* Node Dot */}
                <div
                  className={cn(
                    "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-[#FFF7ED] z-10 flex items-center justify-center transition-all duration-300",
                    session.status === 'completed' && "border-green-600 bg-green-50",
                    session.status === 'current' && "border-[#d97757] scale-110",
                    session.status === 'locked' && "border-stone-300 bg-stone-100"
                  )}
                >
                  {session.status === 'completed' && <Check className="w-2 h-2 text-green-600" />}
                  {session.status === 'current' && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#d97757]"
                    />
                  )}
                </div>

                {/* Session Content */}
                {session.status === 'current' ? (
                  <motion.div
                    layoutId="active-session"
                    className="bg-white border border-[#d97757]/25 rounded-xl p-4 shadow-sm shadow-[#d97757]/5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#d97757] tracking-widest uppercase">
                        {session.number} • EN COURS
                      </span>
                      <span className="text-[10px] text-stone-400">{session.week}</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 mb-1 leading-tight">
                      {session.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 mb-4 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      {session.day}
                    </p>
                    <button className="w-full py-2 bg-[#d97757] hover:bg-[#c4674a] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                      <Play className="w-3 h-3 fill-current" />
                      Reprendre
                    </button>
                  </motion.div>
                ) : (
                  <div className="py-0.5 group cursor-default">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-[9px] font-bold tracking-widest mb-0.5 transition-colors",
                          session.status === 'completed' ? "text-green-600" : "text-stone-400"
                        )}>
                          {session.number}
                        </span>
                        <h4 className={cn(
                          "text-xs font-medium transition-colors",
                          session.status === 'completed' && "text-stone-400 line-through decoration-stone-300",
                          session.status === 'locked' && "text-stone-400",
                        )}>
                          {session.title}
                        </h4>
                      </div>
                      {session.status === 'locked' && (
                        <Lock className="w-3 h-3 text-stone-300" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* End Certification Node */}
            <div className="relative pl-8 pt-4">
              <div className="absolute left-0 top-5 w-4 h-4 rounded-full border-2 border-stone-200 bg-stone-50 z-10 flex items-center justify-center">
                <Trophy className="w-2 h-2 text-stone-300" />
              </div>
              <div className="opacity-50">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest">FINAL</span>
                <h4 className="text-xs font-bold text-stone-900">Certification CODEX_AI</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 bg-stone-50 border-t border-stone-200">
        <div className="bg-white border border-stone-200 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:border-[#d97757]/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-orange-200" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-tighter font-bold">RECOMPENSE</p>
              <p className="text-[11px] text-stone-900 font-bold">Consulter les badges</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#d97757] transition-colors" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E7E5E4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D6D3D1;
        }
      `}} />
    </aside>
  );
}
