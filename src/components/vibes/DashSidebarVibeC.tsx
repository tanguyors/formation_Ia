"use client";

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Play,
  Lock,
  Lightbulb,
  Trophy,
  MessageSquare,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashSidebarVibeC: React.FC = () => {
  const sessions = [
    {
      id: 1,
      day: "Lundi",
      title: "Introduction aux LLM",
      duration: "45min",
      status: "completed",
      icon: CheckCircle2
    },
    {
      id: 2,
      day: "Mercredi",
      title: "Prompts & Context",
      duration: "60min",
      status: "current",
      icon: Play
    },
    {
      id: 3,
      day: "Vendredi",
      title: "Workflow Claude.md",
      duration: "90min",
      status: "locked",
      icon: Lock
    }
  ];

  return (
    <aside className="w-96 h-full bg-[#FFF7ED] border-r border-stone-200 font-mono overflow-y-auto">
      <div className="p-8 flex flex-col gap-8">

        {/* SECTION 1: WEEK HEADER */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold">
                Semaine 1
              </span>
              <h2 className="text-sm font-bold text-stone-900 mt-1">
                Maîtriser Claude Code
              </h2>
            </div>
            <span className="text-[10px] text-stone-400">1/3 SESSIONS</span>
          </div>

          <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "33.33%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#d97757]"
            />
          </div>
        </section>

        {/* SECTION 2: WEEKLY SCHEDULE */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-stone-400" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              Agenda de la semaine
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative overflow-hidden bg-white border rounded-xl p-4 transition-all duration-300 ${
                  session.status === 'current'
                    ? 'border-[#d97757] shadow-sm ring-1 ring-[#d97757]/10'
                    : 'border-stone-200'
                } ${session.status === 'locked' ? 'opacity-60' : 'opacity-100'}`}
              >
                {session.status === 'current' && (
                  <motion.div
                    animate={{ opacity: [0.02, 0.05, 0.02] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-[#d97757]"
                  />
                )}

                <div className="relative z-10 flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    session.status === 'completed' ? 'bg-green-50 text-[#16A34A]' :
                    session.status === 'current' ? 'bg-orange-50 text-[#d97757]' :
                    'bg-stone-50 text-stone-400'
                  }`}>
                    {session.status === 'current' ? (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <session.icon size={16} fill="currentColor" fillOpacity={0.2} />
                      </motion.div>
                    ) : (
                      <session.icon size={16} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        session.status === 'current' ? 'text-[#d97757]' : 'text-stone-400'
                      }`}>
                        {session.day}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400">
                        <Clock size={10} />
                        {session.duration}
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-stone-800 truncate">
                      {session.title}
                    </h3>
                  </div>
                </div>

                {session.status === 'current' && (
                  <div className="mt-3 pt-3 border-t border-orange-50 flex items-center justify-between">
                    <span className="text-[9px] text-[#d97757] font-bold">EN COURS</span>
                    <ChevronRight size={12} className="text-[#d97757]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CONSEIL DU JOUR */}
        <section>
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 rounded-md">
                <Lightbulb size={14} className="text-[#d97757]" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-stone-900 font-bold">
                Conseil du jour
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed italic">
              &quot;Utilisez /plan pour réfléchir avant de coder&quot;
            </p>
          </div>
        </section>

        {/* SECTION 4: VOTRE RANG */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-stone-400" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              Classement AI
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-stone-900 tracking-tight">
                  #42
                </span>
                <span className="text-[9px] text-stone-400 uppercase tracking-tighter">
                  SUR 156 ÉLÈVES
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-8">
                {[30, 45, 60, 40, 75, 55, 90, 40].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-t-full ${i === 4 ? 'bg-[#d97757]' : 'bg-stone-200'}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="h-1 w-full bg-stone-100 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-[#d97757]/30 left-0"
                style={{ width: '42%' }}
              />
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#d97757] shadow-[0_0_8px_rgba(217,119,87,0.5)]"
                style={{ left: '42%' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[8px] text-stone-400">TOP 30%</span>
              <span className="text-[8px] text-stone-400">+3 RANGS</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: DISCORD QUICK LINK */}
        <section className="mt-auto">
          <a
            href="#"
            className="flex items-center justify-between group p-3 bg-stone-900 rounded-xl transition-all hover:bg-stone-800"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-stone-800 rounded-lg text-white group-hover:text-indigo-400 transition-colors">
                <MessageSquare size={14} />
              </div>
              <span className="text-[10px] font-bold text-stone-200 uppercase tracking-wider">
                Communauté Discord
              </span>
            </div>
            <ChevronRight size={14} className="text-stone-500 group-hover:text-white transition-colors" />
          </a>
        </section>

      </div>
    </aside>
  );
};

export default DashSidebarVibeC;
