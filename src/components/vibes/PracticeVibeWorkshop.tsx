"use client";

// REQUIRED DEPENDENCIES:
// - lucide-react (npm install lucide-react)
// - framer-motion (npm install framer-motion)
// - clsx (npm install clsx)
// - tailwind-merge (npm install tailwind-merge)

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Terminal,
  Lock,
  Trophy,
  ArrowLeft,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---

type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';

interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  instructions: string[];
  successCriteria: string[];
  terminalCommands: string[];
}

// --- MOCK DATA ---

const EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    title: "Installer Claude Code",
    difficulty: "Débutant",
    instructions: [
      "Pour commencer cette quête, vous devez forger vos outils.",
      "Installez l'interface de ligne de commande officielle d'Anthropic.",
      "Vérifiez ensuite que la version est correctement installée sur votre machine."
    ],
    successCriteria: [
      "Le package @anthropic-ai/claude-code est installé globalement",
      "La commande `claude --version` renvoie un numéro de version valide"
    ],
    terminalCommands: [
      "npm install -g @anthropic-ai/claude-code",
      "claude --version"
    ]
  },
  {
    id: 'ex-2',
    title: "Premier prompt dans le terminal",
    difficulty: "Débutant",
    instructions: [
      "Maintenant que l'outil est prêt, interagissons avec l'IA directement depuis votre environnement.",
      "Lancez une requête simple pour tester la réactivité de l'agent.",
      "Observez comment Claude structure sa réponse dans le terminal."
    ],
    successCriteria: [
      "Une réponse est générée sans erreur de connexion",
      "Le fichier demandé est visualisable"
    ],
    terminalCommands: [
      "claude \"Crée une fonction fibonacci en TypeScript\""
    ]
  },
  {
    id: 'ex-3',
    title: "Utiliser le mode Plan",
    difficulty: "Intermédiaire",
    instructions: [
      "Le mode Plan permet à Claude de réfléchir avant d'agir sur vos fichiers.",
      "Activez l'interface interactive.",
      "Demandez un plan de refactorisation pour un fichier imaginaire `utils.ts`."
    ],
    successCriteria: [
      "Le mode /plan est activé",
      "Les étapes de modification sont listées par l'IA"
    ],
    terminalCommands: [
      "claude",
      "/plan Refactorer le fichier utils.ts"
    ]
  },
  {
    id: 'ex-4',
    title: "Créer un fichier CLAUDE.md",
    difficulty: "Intermédiaire",
    instructions: [
      "Pour que l'agent comprenne vos rituels de code, il lui faut un guide.",
      "Créez un fichier `CLAUDE.md` à la racine de votre projet.",
      "Définissez les conventions de nommage et les commandes de build."
    ],
    successCriteria: [
      "Fichier CLAUDE.md présent à la racine",
      "Sections 'Build commands' et 'Code style' remplies"
    ],
    terminalCommands: [
      "touch CLAUDE.md",
      "echo \"# Project Conventions\n\n## Build\nnpm run build\" >> CLAUDE.md"
    ]
  },
  {
    id: 'ex-5',
    title: "Débugger avec Claude Code",
    difficulty: "Avancé",
    instructions: [
      "L'épreuve finale : identifiez une faille dans un système d'authentification.",
      "Soumettez le problème à Claude en lui donnant le contexte du fichier `auth.ts`.",
      "Appliquez la correction suggérée automatiquement."
    ],
    successCriteria: [
      "Le bug d'expiration des tokens est identifié",
      "Le code de correction est validé et appliqué"
    ],
    terminalCommands: [
      "claude \"Il y a un bug dans auth.ts, les tokens expirent trop tôt\""
    ]
  }
];

// --- COMPONENTS ---

const Badge = ({ children, variant = 'locked' }: { children: React.ReactNode, variant?: 'completed' | 'active' | 'locked' | 'urgent' }) => {
  const variants = {
    completed: "bg-green-50 border-green-200 text-green-600",
    active: "bg-[#F97316]/50 border-[#F97316]/25 text-[#F97316] animate-pulse",
    locked: "bg-slate-100 border-slate-200 text-slate-400",
    urgent: "bg-red-50 border-red-200 text-red-500",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-widest border transition-all duration-300",
      variants[variant]
    )}>
      {children}
    </span>
  );
};

export default function PracticeVibeWorkshop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isAllDone, setIsAllDone] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentExercise = EXERCISES[currentIndex];
  const progressPercent = ((completedIds.size) / EXERCISES.length) * 100;
  const isCurrentCompleted = completedIds.has(currentExercise.id);

  const handleNext = () => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleComplete = () => {
    const next = new Set(completedIds);
    if (next.has(currentExercise.id)) {
      next.delete(currentExercise.id);
    } else {
      next.add(currentExercise.id);
    }
    setCompletedIds(next);

    if (next.size === EXERCISES.length) {
      setTimeout(() => setIsAllDone(true), 600);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isAllDone) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white border border-slate-200 rounded-xl p-8 shadow-md text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">QUÊTE ACCOMPLIE !</h1>
          <p className="text-slate-500 mb-8">
            Vous avez maîtrisé les bases de Claude Code. Votre arsenal de développeur augmenté est désormais prêt pour le Secteur 2.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#F97316]/5 p-4 rounded-lg border border-[#F97316]/20">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">XP GAGNÉS</div>
              <div className="text-xl font-bold text-[#F97316]">+1 250</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">EXERCICES</div>
              <div className="text-xl font-bold text-green-600">5 / 5</div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#F97316] text-white rounded-lg font-bold hover:bg-[#ea580c] transition-colors flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            RETOUR AU PARCOURS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-slate-900">
      {/* HEADER / HUD */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">CODEX_AI Formation</span>
            <h1 className="text-sm font-bold text-slate-800">Cas Pratique — Maîtriser Claude Code</h1>
          </div>
          <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-widest">
            <span className="text-[#F97316]">Semaine 1</span>
            <span>·</span>
            <span>Lundi</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-col items-end gap-1.5 w-48 hidden sm:flex">
            <div className="flex justify-between w-full text-[9px] text-slate-400 uppercase tracking-tighter">
              <span>Progression Quête</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#F97316]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {EXERCISES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-[#F97316] scale-125" :
                  completedIds.has(EXERCISES[i].id) ? "bg-green-500" : "bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: INSTRUCTIONS */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-white border-r border-slate-200 p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                  Objectif {currentIndex + 1} / {EXERCISES.length}
                </span>
                <Badge variant={currentExercise.difficulty === 'Débutant' ? 'active' : currentExercise.difficulty === 'Intermédiaire' ? 'completed' : 'urgent'}>
                  {currentExercise.difficulty}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">
                {currentExercise.title}
              </h2>

              <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                  {currentExercise.instructions.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="pt-8">
                  <h3 className="text-[10px] text-slate-400 uppercase tracking-widest mb-4">Critères de réussite</h3>
                  <ul className="space-y-3">
                    {currentExercise.successCriteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className={cn(
                          "mt-1 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                          isCurrentCompleted ? "bg-green-50 border-green-500 text-green-500" : "border-slate-300 group-hover:border-slate-400"
                        )}>
                          {isCurrentCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <span className={cn("transition-colors", isCurrentCompleted ? "text-slate-400 line-through" : "text-slate-600")}>
                          {criteria}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === EXERCISES.length - 1}
                    className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={toggleComplete}
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
                    isCurrentCompleted
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-sm hover:scale-[1.02]"
                  )}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      TERMINÉ
                    </>
                  ) : (
                    "MARQUER COMME FAIT"
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: TERMINAL / CODE */}
        <div className="hidden lg:flex flex-col w-1/2 bg-[#1C1917] p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-400 tracking-wider">zsh — codex-ai-lab</span>
              </div>
            </div>
            <div className="text-[9px] text-slate-500 flex items-center gap-2 uppercase tracking-widest">
              <Zap className="w-3 h-3 text-[#F97316]/60" />
              Connected: Session_Alpha
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 font-mono text-sm custom-scrollbar">
            <div className="text-slate-500 opacity-50 mb-4">
              # Initialisation de l&apos;environnement de quête...<br />
              # Connexion au serveur Anthropic établie.<br />
              # Prêt pour l&apos;exécution.
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentExercise.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {currentExercise.terminalCommands.map((cmd, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -left-4 top-3 w-1 h-0.5 bg-[#F97316]/40 group-hover:w-2 transition-all" />
                    <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Commande {i + 1}</span>
                        <button
                          onClick={() => copyToClipboard(cmd, i)}
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copier la commande"
                        >
                          {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <code className="text-[#F97316] flex items-start gap-3">
                        <span className="text-slate-600 select-none">$</span>
                        {cmd}
                      </code>
                    </div>
                  </div>
                ))}

                {isCurrentCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-green-500/5 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest font-bold">Sortie standard validée</span>
                    </div>
                    <div className="mt-2 text-slate-400 text-xs italic">
                      L&apos;agent Claude a confirmé l&apos;exécution de l&apos;objectif. Prêt pour l&apos;étape suivante.
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* MOBILE WARNING / FOOTER */}
      <footer className="lg:hidden border-t border-slate-200 bg-white p-4 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
          Utilisez un terminal desktop pour exécuter les commandes.
        </p>
      </footer>
    </div>
  );
}
