"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Terminal,
  ShieldAlert,
  Clock,
  Zap,
  Lock,
  CheckCircle2,
  ExternalLink,
  Play,
  Cpu,
  Wifi,
  ArrowLeft,
  Trophy,
  FileText,
  Github,
  Video,
  BookOpen,
  Layout,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSession } from '@/hooks/useSession';
import { useProgress } from '@/hooks/useProgress';
import { SectionRendererV2 } from '@/components/vibes/CourseVibe2';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  sortOrder: number;
}

interface Section {
  id: string;
  title: string | null;
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz';
  content: string;
  codeLanguage: string | null;
  sortOrder: number;
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  article: FileText, repo: Github, video: Video, doc: BookOpen, tool: Layout, other: LinkIcon,
};

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
};

const getDayName = (day: number): string => {
  const days: Record<number, string> = { 1: 'Lundi', 2: 'Mercredi', 3: 'Vendredi' };
  return days[day] || `Jour ${day}`;
};

const TypingEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const characters = text.split("");
  return (
    <motion.span>
      {characters.map((char, i) => (
        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01, delay: delay + i * 0.03, ease: "linear" }}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const AsciiDivider = () => (
  <div className="text-stone-800 text-[10px] select-none py-4 font-mono overflow-hidden whitespace-nowrap">
    +-------------------------------------------------------------------------------------------------------+
  </div>
);

const StatusItem = ({ label, value, icon: Icon, accent = false }: { label: string; value: string | number; icon: React.ElementType; accent?: boolean }) => (
  <div className="flex items-center gap-3 px-4 border-r border-stone-800 last:border-r-0">
    <Icon size={14} className={accent ? "text-[#F97316]" : "text-stone-500"} />
    <div className="flex flex-col">
      <span className="text-[10px] text-stone-500 uppercase tracking-tighter">{label}</span>
      <span className={cn("text-xs font-bold", accent ? "text-[#F97316]" : "text-stone-300")}>{value}</span>
    </div>
  </div>
);

export default function SessionVibe2() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { session, loading, error } = useSession(id);
  const { refresh } = useProgress();

  const [phase, setPhase] = useState<'briefing' | 'course'>('briefing');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${id}/resources`).then(r => r.ok ? r.json() : { resources: [] }).then(d => setResources(d.resources || [])).catch(() => setResources([]));
    fetch(`/api/sessions/${id}/sections`).then(r => r.ok ? r.json() : { sections: [] }).then(d => setSections(d.sections || [])).catch(() => setSections([]));
    fetch(`/api/sessions/${id}/quiz`).then(r => r.ok ? r.json() : null).then(d => setQuizData(d)).catch(() => setQuizData(null));
  }, [id]);

  useEffect(() => { setIsLoaded(true); }, []);

  const handleQuizPassed = () => {
    setShowSuccess(true);
    refresh();
    setTimeout(() => router.push('/formation'), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] font-mono flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-widest text-stone-500">Initialisation...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0f172a] font-mono flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-900/30 border border-red-800 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          {error ? "ERREUR_SYSTÈME" : "SESSION_NOT_FOUND"}
        </h1>
        <button onClick={() => router.push('/formation')} className="text-[#F97316] text-sm hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> /FORMATION
        </button>
      </div>
    );
  }

  const effectivePhase = session.userStatus === 'COMPLETED' ? 'course' : phase;

  return (
    <AnimatePresence mode="wait">
      {effectivePhase === 'briefing' ? (
        <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <div className="min-h-screen bg-[#0f172a] text-stone-300 font-mono selection:bg-[#F97316]/30 selection:text-white overflow-x-hidden">
            {/* Scanline */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
              <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
              {/* Header */}
              <header className="flex items-center justify-between mb-8">
                <button onClick={() => router.push('/formation')} className="flex items-center gap-2 text-stone-500 hover:text-[#F97316] transition-colors group">
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs tracking-widest uppercase">/FORMATION</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest">SYSTEM ONLINE // CODEX_AI v4.0.2</span>
                  </div>
                  <div className="h-4 w-[1px] bg-stone-800" />
                  <div className="text-[10px] text-[#F97316] font-bold">
                    S{session.sessionNumber.toString().padStart(2, '0')} / 12
                  </div>
                </div>
              </header>

              {/* Status Bar */}
              <div className="w-full bg-[#1C1917] border border-stone-800 rounded-lg overflow-hidden flex flex-wrap mb-10 shadow-xl">
                <StatusItem label="SEMAINE" value={session.week} icon={Terminal} />
                <StatusItem label="JOUR" value={getDayName(session.day)} icon={Zap} />
                <StatusItem label="DURÉE" value={formatDuration(session.durationMinutes)} icon={Clock} />
                <StatusItem label="RECOMPENSE" value="+100 XP" icon={CheckCircle2} accent />
                <div className="ml-auto flex items-center px-6 bg-[#F97316]/5 text-[#F97316] text-[10px] font-bold border-l border-stone-800">
                  <Wifi size={14} className="mr-2" />
                  STATION_{session.sessionNumber.toString().padStart(3, '0')} CONNECTÉE
                </div>
              </div>

              {/* Hero */}
              <section className="mb-12">
                <div className="mb-2 text-[#F97316] text-xs font-bold tracking-[0.2em] opacity-80">
                  [ MISSION_PARAMETER_INITIALIZED ]
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight mb-4">
                  {isLoaded && <TypingEffect text={session.title.toUpperCase()} />}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-3 h-10 md:h-12 bg-[#F97316] ml-2 align-middle" />
                </h1>
                <div className="flex gap-2 text-[10px] text-stone-500 uppercase">
                  <span>{">"} BOOT_SEQUENCE: SUCCESS</span>
                  <span>{">"} ENCRYPT: AES-256</span>
                  <span>{">"} SOURCE: KERNEL_MAIN</span>
                </div>
              </section>

              <AsciiDivider />

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Left: Briefing */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="relative border border-stone-800 bg-[#1C1917]/40 p-6 rounded-xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#F97316]/40" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#F97316]/40" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#F97316]/40" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#F97316]/40" />

                    <div className="flex items-center gap-2 mb-4 text-[#F97316]">
                      <ShieldAlert size={16} />
                      <span className="text-[10px] font-bold tracking-widest uppercase">CONSIGNES_DU_BRIEFING</span>
                    </div>
                    <div className="text-stone-400 text-sm leading-relaxed">
                      <p className="first-letter:text-[#F97316] first-letter:text-2xl first-letter:font-bold">
                        {session.briefing}
                      </p>
                    </div>

                    {resources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-stone-800/50">
                        <div className="text-[10px] text-stone-500 mb-3 uppercase tracking-widest">Ressources_Externes</div>
                        <div className="flex flex-wrap gap-3">
                          {resources.map((res) => {
                            const Icon = RESOURCE_ICONS[res.type] || LinkIcon;
                            return (
                              <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-stone-400 hover:text-white hover:border-[#F97316]/50 transition-all">
                                <Icon size={12} />
                                {res.title}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Objectives */}
                <div className="lg:col-span-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Objectifs_Tactiques</div>
                      <div className="text-[10px] text-[#16A34A]">{session.objectives.length} CHARGÉS</div>
                    </div>
                    <div className="space-y-2">
                      {session.objectives.map((obj, idx) => (
                        <motion.div key={idx} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + idx * 0.1 }} className="flex items-start gap-4 p-4 bg-[#1C1917]/20 border border-stone-800/50 rounded-lg hover:border-stone-700 transition-colors group">
                          <span className="text-[#F97316] font-bold text-xs mt-0.5 group-hover:scale-110 transition-transform">
                            {">"} {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-sm text-stone-300 group-hover:text-white transition-colors">{obj}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-6 mt-16 pb-20">
                {session.userStatus === 'LOCKED' ? (
                  <div className="flex flex-col items-center gap-4 text-stone-600">
                    <div className="p-4 rounded-full bg-stone-900 border border-stone-800">
                      <Lock size={32} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold uppercase tracking-[0.3em]">ACCÈS REFUSÉ</div>
                      <div className="text-[10px] uppercase">TERMINEZ LES MISSIONS PRÉCÉDENTES</div>
                    </div>
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPhase('course')} className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[#F97316] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex items-center gap-4 px-12 py-5 bg-[#F97316] text-white rounded-lg font-black tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                      <Play size={20} fill="currentColor" />
                      <span>LANCER LA MISSION</span>
                      <div className="absolute inset-0 border-2 border-white/20 rounded-lg" />
                    </div>
                  </motion.button>
                )}
                <div className="flex items-center gap-8 text-[10px] text-stone-600 tracking-widest font-bold">
                  <div className="flex items-center gap-2"><Cpu size={12} /> ALLOCATION_CPU: 12%</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> MEMOIRE: OPTIMALE</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-stone-900 bg-[#0f172a] flex justify-between items-center z-20">
              <div className="text-[9px] text-stone-700 font-mono">
                CODEX_AI TERMINAL // SESSION_ID: {id?.slice(0, 8)} // WEEK_{session.week}
              </div>
              <div className="flex gap-4">
                <div className="w-24 h-1.5 bg-stone-900 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 2, ease: "easeOut" }} className="h-full bg-[#F97316]" />
                </div>
                <span className="text-[9px] text-stone-700 font-mono">DL_SYNC: 65%</span>
              </div>
            </footer>
          </div>
        </motion.div>
      ) : (
        <motion.div key="course" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative">
          <div className="fixed top-6 left-6 z-[60]">
            <button onClick={() => { if (session.userStatus !== 'COMPLETED') setPhase('briefing'); else router.push('/formation'); }} className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-slate-700 rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all text-xs font-bold tracking-widest uppercase group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              {session.userStatus !== 'COMPLETED' ? 'Briefing' : 'Parcours'}
            </button>
          </div>
          <div className="fixed top-6 right-6 z-[60]">
            <AnimatePresence mode="wait">
              {showSuccess && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full font-bold text-xs tracking-widest uppercase shadow-lg">
                  <Trophy size={14} className="animate-bounce" /> MISSION ACCOMPLIE !
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {sections.length > 0 ? (
            <SectionRendererV2 sections={sections} sessionId={session.id} quizData={quizData} onQuizPassed={handleQuizPassed} />
          ) : (
            <div className="h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center text-stone-400 font-mono">
              <Terminal size={48} className="mb-4 text-[#16A34A] animate-pulse" />
              <p className="text-lg font-bold text-white">[CONTENU_EN_COURS_DE_CHARGEMENT]</p>
              <p className="text-[10px] uppercase tracking-widest mt-2">Les modules seront disponibles bientôt</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
