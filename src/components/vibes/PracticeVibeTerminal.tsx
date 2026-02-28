"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  CheckCircle2,
  Lock,
  Play,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

type MissionStatus = 'done' | 'active' | 'locked';

export interface PracticeExercise {
  id: string;
  title: string;
  briefing: string;
  commands: string[];
  difficulty: string;
  duration: string;
  criteria?: string[];
  missionNumber: number;
}

export interface PracticeSessionInfo {
  id: string;
  title: string;
  week: number;
  dayLabel: string;
}

interface PracticeVibeTerminalProps {
  exercises?: PracticeExercise[];
  session?: PracticeSessionInfo;
  onBack?: () => void;
}

// --- Mock data for preview ---
const MOCK_EXERCISES: PracticeExercise[] = [
  { id: '1', missionNumber: 1, title: "Mission 1 : Installation", briefing: "Votre première mission : installer Claude Code et vérifier qu'il fonctionne. C'est la base de tout ce qui suit.", commands: ["npm install -g @anthropic-ai/claude-code", "claude --version"], difficulty: "Débutant", duration: "5 min" },
  { id: '2', missionNumber: 2, title: "Mission 2 : Premier Contact", briefing: "Maintenant que Claude Code est installé, il est temps d'établir le premier contact. Écrivez votre premier prompt.", commands: ["claude \"Crée une fonction fibonacci en TypeScript\""], difficulty: "Débutant", duration: "10 min" },
  { id: '3', missionNumber: 3, title: "Mission 3 : Mode Stratégique", briefing: "Le mode Plan vous permet de réfléchir avant d'agir. Activez-le et planifiez un refactoring.", commands: ["claude", "/plan Refactorer le fichier utils.ts"], difficulty: "Intermédiaire", duration: "15 min" },
  { id: '4', missionNumber: 4, title: "Mission 4 : Poser les Règles", briefing: "Un bon agent a besoin de directives. Créez votre fichier CLAUDE.md.", commands: ["touch CLAUDE.md && open CLAUDE.md"], difficulty: "Intermédiaire", duration: "20 min" },
  { id: '5', missionNumber: 5, title: "Mission 5 : Chasse aux Bugs", briefing: "Un bug critique se cache dans le code. Utilisez Claude Code pour le traquer.", commands: ["claude \"Bug dans auth.ts, les tokens expirent trop tôt\""], difficulty: "Avancé", duration: "25 min" },
];

// --- Sub-components ---

const TypingBriefing = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <p className="text-slate-600 leading-relaxed min-h-[80px] text-sm">
      {displayedText}
      {index < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 ml-1 bg-[#F97316] align-middle"
        />
      )}
    </p>
  );
};

export default function PracticeVibeTerminal({ exercises, session, onBack }: PracticeVibeTerminalProps) {
  const missions = exercises && exercises.length > 0 ? exercises : MOCK_EXERCISES;
  const sessionTitle = session?.title || 'Maîtriser Claude Code';
  const sessionLabel = session ? `Semaine ${session.week} · ${session.dayLabel}` : 'Semaine 1 · Lundi';

  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentMission = missions[currentMissionIdx];
  const totalMissions = missions.length;
  const progressPercent = (completedMissions.length / totalMissions) * 100;

  const handleComplete = () => {
    if (!completedMissions.includes(currentMission.id)) {
      setCompletedMissions([...completedMissions, currentMission.id]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const getStatus = (mission: PracticeExercise): MissionStatus => {
    if (completedMissions.includes(mission.id)) return 'done';
    if (missions[currentMissionIdx].id === mission.id) return 'active';
    return 'locked';
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-800 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            {onBack ? (
              <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                <ArrowLeft className="text-slate-600" size={20} />
              </button>
            ) : (
              <div className="p-2 bg-[#F97316]/10 rounded-xl">
                <Terminal className="text-[#F97316]" size={20} />
              </div>
            )}
            <div>
              <h1 className="text-sm font-black text-black tracking-tight">CODEX_AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#F97316] font-bold">Module Pratique</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              <span>Progression</span>
              <span>{completedMissions.length}/{totalMissions}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-[#F97316] rounded-full"
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {missions.map((m, idx) => {
            const status = getStatus(m);
            return (
              <button
                key={m.id}
                onClick={() => setCurrentMissionIdx(idx)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border border-transparent",
                  status === 'active' && "bg-white border-[#F97316]/20 text-[#F97316] shadow-sm",
                  status === 'done' && "text-green-600",
                  status === 'locked' && "text-slate-400 opacity-60"
                )}
              >
                <div className="flex items-center justify-center">
                  {status === 'done' ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : status === 'active' ? (
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping" />
                    </div>
                  ) : (
                    <Lock size={14} />
                  )}
                </div>
                <span className="text-xs font-medium truncate">{m.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Session</p>
            <p className="text-xs font-bold text-black">{sessionLabel}</p>
          </div>
        </div>
      </aside>

      {/* Main Mission Area */}
      <main className="flex-1 relative overflow-y-auto flex flex-col bg-white">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
              MISSION {currentMissionIdx + 1}/{totalMissions}
            </span>
            <h2 className="text-black font-black tracking-tight">Cas Pratique — {sessionTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            {currentMission.difficulty && (
              <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full border",
                currentMission.difficulty === 'Débutant' && "bg-green-50 text-green-600 border-green-200",
                currentMission.difficulty === 'Intermédiaire' && "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
                currentMission.difficulty === 'Avancé' && "bg-red-50 text-red-500 border-red-200"
              )}>
                {currentMission.difficulty} · {currentMission.duration}
              </span>
            )}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              EN COURS
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-8">

          {/* Briefing Card */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#F97316] font-bold">
              <ChevronRight size={14} />
              Briefing de mission
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <TypingBriefing key={currentMission.id} text={currentMission.briefing} />
            </div>
          </section>

          {/* Terminal / Code Zone */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <Terminal size={14} />
                Terminal de commande
              </div>
              <span className="text-[10px] text-slate-400">bash — 80x24</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-700/50 bg-slate-800/50">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed space-y-3">
                {currentMission.commands.map((cmd, i) => (
                  <div key={i} className="flex gap-3 text-slate-200">
                    <span className="text-[#F97316] select-none font-bold">&gt;</span>
                    <code className="whitespace-pre-wrap">{cmd}</code>
                  </div>
                ))}
                <div className="mt-4 text-slate-500 italic">
                  // En attente de validation...
                </div>
              </div>
            </div>
          </section>

          {/* Criteria */}
          {currentMission.criteria && currentMission.criteria.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <CheckCircle2 size={14} />
                Critères de réussite
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <ul className="space-y-3">
                  {currentMission.criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className={cn(
                        "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        completedMissions.includes(currentMission.id) ? "border-green-500 bg-green-50" : "border-slate-300"
                      )}>
                        {completedMissions.includes(currentMission.id) && (
                          <CheckCircle2 size={12} className="text-green-500" />
                        )}
                      </div>
                      <span className={cn(
                        completedMissions.includes(currentMission.id) ? "text-slate-400 line-through" : "text-slate-600"
                      )}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Action Zone */}
          <section className="flex justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={completedMissions.includes(currentMission.id)}
              className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 uppercase tracking-widest",
                completedMissions.includes(currentMission.id)
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg shadow-[#F97316]/20"
              )}
            >
              {completedMissions.includes(currentMission.id) ? (
                <>
                  <CheckCircle2 size={16} />
                  Objectif Atteint
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Mission accomplie
                </>
              )}
            </motion.button>
          </section>
        </div>

        {/* Footer info */}
        <footer className="p-6 text-[10px] text-slate-400 text-center border-t border-slate-100">
          PROTOCOLE DE FORMATION CODEX_AI
        </footer>

        {/* Success Overlay Flash */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/30 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="bg-white text-black px-10 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border-2 border-green-200"
              >
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-xl font-black tracking-tight">MISSION ACCOMPLIE</h3>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">Accès au niveau suivant débloqué</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 0 }}
                className="absolute inset-0 bg-[#F97316]"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
