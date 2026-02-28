"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  CheckCircle2,
  Terminal,
  Trophy,
  Zap,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface Exercise {
  id: string;
  title: string;
  difficulty: number;
  time: string;
  xp: number;
  instructions: string;
  code: string;
}

// --- Mock Data ---

const EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    title: "Installer Claude Code",
    difficulty: 1,
    time: "5 min",
    xp: 50,
    instructions: "Commencez par installer l'outil en ligne de commande via NPM. Une fois l'installation terminée, vérifiez que la version est correctement installée.",
    code: "npm install -g @anthropic-ai/claude-code && claude --version"
  },
  {
    id: "ex-2",
    title: "Premier prompt dans le terminal",
    difficulty: 1,
    time: "10 min",
    xp: 75,
    instructions: "Lancez votre premier prompt interactif pour générer une logique métier simple directement depuis votre CLI.",
    code: "claude \"Crée une fonction fibonacci en TypeScript\""
  },
  {
    id: "ex-3",
    title: "Utiliser le mode Plan",
    difficulty: 2,
    time: "15 min",
    xp: 100,
    instructions: "Le mode plan permet d'analyser un fichier avant modification. Utilisez-le pour préparer un refactoring de vos utilitaires.",
    code: "claude\n/plan Refactorer utils.ts"
  },
  {
    id: "ex-4",
    title: "Créer un fichier CLAUDE.md",
    difficulty: 2,
    time: "20 min",
    xp: 125,
    instructions: "Le fichier CLAUDE.md sert de guide de style pour l'IA. Créez-le pour définir les conventions de nommage de votre projet.",
    code: "# Projet CODEX\n## Conventions\n- Utiliser TypeScript\n- Prettier pour le formatage"
  },
  {
    id: "ex-5",
    title: "Débugger avec Claude Code",
    difficulty: 3,
    time: "25 min",
    xp: 150,
    instructions: "Identifiez une fuite de mémoire ou un problème d'expiration de token en demandant une analyse contextuelle à l'agent.",
    code: "claude \"Bug dans auth.ts, tokens expirent trop tôt\""
  }
];

// --- Components ---

const Badge = ({
  label,
  isUnlocked,
  variant = "locked"
}: {
  label: string;
  isUnlocked: boolean;
  variant: "success" | "active" | "locked";
}) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-600",
    active: "bg-[#F97316]/50 border-[#F97316]/25 text-[#F97316] animate-pulse",
    locked: "bg-slate-100 border-slate-200 text-slate-400"
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-sans flex items-center gap-2 transition-all duration-500",
      isUnlocked ? styles[variant === "active" ? "active" : "success"] : styles.locked,
      !isUnlocked && "opacity-60"
    )}>
      {isUnlocked ? (
        variant === "success" ? <CheckCircle2 size={12} /> : <Zap size={12} />
      ) : (
        <Lock size={12} />
      )}
      {label}
    </div>
  );
};

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[...Array(3)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={cn(i < count ? "fill-[#F97316] text-[#F97316]" : "text-slate-200")}
      />
    ))}
  </div>
);

export default function PracticeVibeChallenge() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const totalXpAvailable = EXERCISES.reduce((acc, curr) => acc + curr.xp, 0);
  const currentXp = EXERCISES.reduce((acc, curr) => completedIds.has(curr.id) ? acc + curr.xp : acc, 0);
  const progressPercent = (completedIds.size / EXERCISES.length) * 100;

  const handleToggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < EXERCISES.length) {
      const nextId = EXERCISES[nextIndex].id;
      cardRefs.current[nextId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (completedIds.size === EXERCISES.length && EXERCISES.length > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completedIds]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 selection:bg-[#F97316]/100">
      {/* --- HUD / Progress Header --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400">Secteur: Formation</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <h1 className="text-sm font-bold text-slate-900">Maîtriser Claude Code</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold tracking-tight text-[#F97316]">
                {currentXp} <span className="text-xs uppercase font-medium text-slate-400">XP</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex-1 min-w-[120px]">
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-400 mb-1">
                  <span>Progression</span>
                  <span>{completedIds.size}/{EXERCISES.length} complétés</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-[#F97316]"
                    transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              label="Premier Pas"
              isUnlocked={completedIds.size >= 1}
              variant={completedIds.size === 1 ? "active" : "success"}
            />
            <Badge
              label="En Route"
              isUnlocked={completedIds.size >= 3}
              variant={completedIds.size === 3 ? "active" : "success"}
            />
            <Badge
              label="Maître Pratique"
              isUnlocked={completedIds.size === EXERCISES.length}
              variant={completedIds.size === EXERCISES.length ? "active" : "success"}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10 space-y-8">
        {/* --- Intro Section --- */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#F97316]/50 text-[#F97316] rounded-lg">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cas Pratique — Semaine 1 · Lundi</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Objectif : Automatisation locale avec agents autonomes</p>
            </div>
          </div>
        </section>

        {/* --- Challenge Cards --- */}
        <div className="space-y-6">
          {EXERCISES.map((ex, index) => {
            const isCompleted = completedIds.has(ex.id);
            const isLocked = index > 0 && !completedIds.has(EXERCISES[index - 1].id);

            return (
              <motion.div
                key={ex.id}
                ref={(el) => { cardRefs.current[ex.id] = el; }}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "relative group bg-white border rounded-xl overflow-hidden transition-all duration-500",
                  isCompleted ? "border-green-600/20 shadow-sm" : "border-slate-200",
                  isLocked ? "opacity-50 grayscale bg-slate-50" : "hover:shadow-md hover:scale-[1.01]",
                  !isCompleted && !isLocked && "border-[#F97316]/200/50"
                )}
              >
                {/* Status Indicator Bar */}
                <div className={cn(
                  "absolute top-0 left-0 bottom-0 w-1 transition-colors duration-500",
                  isCompleted ? "bg-green-500" : isLocked ? "bg-slate-300" : "bg-[#F97316]"
                )} />

                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400">0{index + 1}</span>
                      <h3 className={cn(
                        "text-base font-bold tracking-tight",
                        isCompleted ? "text-green-700" : "text-slate-900"
                      )}>
                        {ex.title}
                      </h3>
                      {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {ex.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-[#F97316]" />
                        {ex.xp} XP
                      </div>
                      <StarRating count={ex.difficulty} />
                    </div>
                  </div>

                  {isLocked && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-200/50 rounded-md text-[9px] uppercase tracking-widest text-slate-500">
                      <Lock size={12} /> Verrouillé
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Instructions</h4>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {ex.instructions}
                    </p>
                  </div>

                  {/* Code Zone */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Terminal</h4>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                    </div>
                    <div className="bg-[#F97316]/5 border border-[#F97316]/20 rounded-lg p-4 font-mono text-sm overflow-x-auto relative group/code">
                      <code className="text-[#F97316] whitespace-pre-wrap">
                        <span className="text-slate-400 mr-2">$</span>
                        {ex.code}
                      </code>
                      <button
                        className="absolute right-3 top-3 opacity-0 group-hover/code:opacity-100 transition-opacity bg-white border border-[#F97316]/200 text-[#F97316] p-1.5 rounded hover:bg-[#F97316]/50"
                        title="Copier"
                        onClick={() => navigator.clipboard.writeText(ex.code)}
                      >
                        <Terminal size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400">
                    {isCompleted ? "Félicitations, quête validée !" : "Prêt pour le déploiement ?"}
                  </div>

                  <div className="flex items-center gap-3">
                    {index < EXERCISES.length - 1 && isCompleted && (
                      <button
                        onClick={() => scrollToNext(index)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#F97316] font-bold hover:underline py-2 px-3"
                      >
                        Exercice suivant <ArrowRight size={14} />
                      </button>
                    )}

                    <button
                      disabled={isLocked}
                      onClick={() => handleToggleComplete(ex.id)}
                      className={cn(
                        "px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                        isCompleted
                          ? "bg-slate-100 text-slate-500 border border-slate-200"
                          : "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-sm active:scale-95",
                        isLocked && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {isCompleted ? "Refaire" : "Marquer comme fait"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* --- Completion Celebration Overlay --- */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border-2 border-[#F97316] rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-4 max-w-sm mx-4"
            >
              <div className="w-16 h-16 bg-[#F97316]/100 text-[#F97316] rounded-full flex items-center justify-center">
                <Sparkles size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Module Terminé !</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">
                  Vous avez maîtrisé le secteur <span className="text-[#F97316]">Claude Code</span>.
                  <br />+{totalXpAvailable} XP récoltés.
                </p>
              </div>
              <div className="w-full h-1 bg-[#F97316]/100 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5 }}
                  className="h-full bg-[#F97316]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Simple Footer --- */}
      <footer className="mt-20 border-t border-slate-100 py-10 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">CODEX_AI Formation · Système Pratique v1.0</p>
      </footer>
    </div>
  );
}
