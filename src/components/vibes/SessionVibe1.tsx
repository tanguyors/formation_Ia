"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Zap,
  Calendar,
  FileText,
  Link as LinkIcon,
  Video,
  Github,
  BookOpen,
  CheckCircle2,
  Lock,
  Trophy,
  Layout,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSession } from '@/hooks/useSession';
import { useProgress } from '@/hooks/useProgress';
import { SectionRendererV2 } from '@/components/vibes/CourseVibe2';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

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

// --- Components ---

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  article: FileText,
  repo: Github,
  video: Video,
  doc: BookOpen,
  tool: Layout,
  other: LinkIcon,
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

const MetadataPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full">
    <Icon className="w-3.5 h-3.5 text-[#F97316]" />
    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{label}</span>
    <span className="text-xs font-bold text-stone-900">{value}</span>
  </div>
);

const ResourceItem = ({ resource }: { resource: Resource }) => {
  const Icon = RESOURCE_ICONS[resource.type] || LinkIcon;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-lg group hover:border-[#F97316]/30 hover:bg-orange-50/30 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="text-stone-400 group-hover:text-[#F97316] transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">{resource.title}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all" />
    </a>
  );
};

const ObjectiveCard = ({ text, index }: { text: string; index: number }) => {
  const styles = [
    "bg-orange-50 border-orange-100 text-[#F97316]",
    "bg-stone-900 border-stone-800 text-white",
    "bg-white border-stone-200 text-stone-800",
    "bg-stone-100 border-stone-200 text-stone-600",
  ];
  const style = styles[index % styles.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={cn(
        "p-4 rounded-xl border flex flex-col justify-between min-h-[120px] transition-transform hover:scale-[1.02]",
        style
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
          index % 2 === 0 ? "border-current/20" : "border-stone-500/20")}>
          0{index + 1}
        </div>
        <Zap className="w-4 h-4 opacity-20" />
      </div>
      <p className="text-sm font-bold leading-tight uppercase tracking-tight">
        {text}
      </p>
    </motion.div>
  );
};

// --- Main Page ---

export default function SessionVibe1() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { session, loading, error } = useSession(id);
  const { refresh } = useProgress();

  const [phase, setPhase] = useState<'briefing' | 'course'>('briefing');
  const [showSuccess, setShowSuccess] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${id}/resources`).then(r => r.ok ? r.json() : { resources: [] }).then(d => setResources(d.resources || [])).catch(() => setResources([]));
    fetch(`/api/sessions/${id}/sections`).then(r => r.ok ? r.json() : { sections: [] }).then(d => setSections(d.sections || [])).catch(() => setSections([]));
    fetch(`/api/sessions/${id}/quiz`).then(r => r.ok ? r.json() : null).then(d => setQuizData(d)).catch(() => setQuizData(null));
  }, [id]);

  const handleQuizPassed = () => {
    setShowSuccess(true);
    refresh();
    setTimeout(() => router.push('/formation'), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-widest text-stone-400">Chargement...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 mb-2">
          {error ? "Erreur de chargement" : "Session non trouvée"}
        </h1>
        <button onClick={() => router.push('/formation')} className="text-[#F97316] text-sm hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour au parcours
        </button>
      </div>
    );
  }

  const effectivePhase = session.userStatus === 'COMPLETED' ? 'course' : phase;
  const isLocked = session.userStatus === 'LOCKED';

  return (
    <AnimatePresence mode="wait">
      {effectivePhase === 'briefing' ? (
        <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          <div className="relative min-h-screen bg-white font-sans overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-stone-50 rounded-full blur-[100px] -z-10" />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => router.push('/formation')} className="p-2 hover:bg-stone-100 rounded-full transition-colors group">
                    <ArrowLeft className="w-5 h-5 text-stone-600 group-hover:text-[#F97316]" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Formation</span>
                    <span className="text-sm font-bold text-stone-900 tracking-tight">CODEX_AI</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full">
                  <ChevronLeft className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-900" />
                  <span className="text-xs font-bold px-2 border-x border-stone-200 text-stone-600">
                    S{session.sessionNumber.toString().padStart(2, '0')} / 12
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-900" />
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-12">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <MetadataPill icon={Calendar} label="Semaine" value={session.week} />
                      <MetadataPill icon={Clock} label="Durée" value={formatDuration(session.durationMinutes)} />
                      <MetadataPill icon={Trophy} label="Récompense" value="+100 XP" />
                      {session.userStatus === 'COMPLETED' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Terminé</span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-stone-900 leading-[0.95] tracking-tighter uppercase italic">
                      {session.title}
                    </h1>
                    <div className="max-w-xl">
                      <p className="text-lg text-stone-500 leading-relaxed">{session.briefing}</p>
                    </div>
                  </motion.div>

                  {/* Resources */}
                  {resources.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-stone-50 rounded-3xl p-8 border border-stone-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Ressources & Matériel</h3>
                        <div className="w-10 h-px bg-stone-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resources.map((res) => (
                          <ResourceItem key={res.id} resource={res} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column: Objectives */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Objectifs de mission</h2>
                      <div className="flex-1 h-px bg-stone-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {session.objectives.map((obj, i) => (
                        <ObjectiveCard key={i} text={obj} index={i} />
                      ))}
                      {/* CTA Card */}
                      <div className="col-span-2 bg-gradient-to-br from-[#F97316] to-[#ea580c] rounded-xl p-6 text-white overflow-hidden relative group">
                        <div className="relative z-10">
                          <p className="text-2xl font-black italic uppercase leading-none mb-1">Prêt pour le déploiement ?</p>
                          <p className="text-xs text-white/80 uppercase tracking-widest font-medium">Session #{session.sessionNumber}</p>
                        </div>
                        <Zap className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.div whileHover={{ y: -4 }} className="pt-4">
                    <button
                      disabled={isLocked}
                      onClick={() => setPhase('course')}
                      className={cn(
                        "w-full group relative flex items-center justify-center gap-4 py-6 rounded-2xl font-black text-xl uppercase italic tracking-wider transition-all duration-300",
                        isLocked
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                          : "bg-stone-900 text-white hover:bg-[#F97316] hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)] shadow-xl"
                      )}
                    >
                      {isLocked ? (
                        <><Lock className="w-6 h-6" /> Session Verrouillée</>
                      ) : (
                        <><Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> Lancer la mission</>
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </main>
          </div>
        </motion.div>
      ) : (
        <motion.div key="course" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative">
          {/* Floating Back */}
          <div className="fixed top-6 left-6 z-[60]">
            <button
              onClick={() => { if (session.userStatus !== 'COMPLETED') setPhase('briefing'); else router.push('/formation'); }}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-slate-700 rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all text-xs font-bold tracking-widest uppercase group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              {session.userStatus !== 'COMPLETED' ? 'Briefing' : 'Parcours'}
            </button>
          </div>
          {/* Success overlay */}
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
            <div className="h-screen w-full bg-[#1C1917] flex flex-col items-center justify-center text-slate-400 font-sans">
              <Play size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-bold text-white">Contenu à venir</p>
              <p className="text-[10px] uppercase tracking-widest mt-2">Les slides seront disponibles bientôt</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
