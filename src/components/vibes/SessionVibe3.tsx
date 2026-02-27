"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Link as LinkIcon,
  Video,
  Github,
  BookOpen,
  Zap,
  Clock,
  Calendar,
  Star,
  ArrowLeft,
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

const RESOURCE_LABELS: Record<string, string> = {
  article: 'Article', repo: 'Repository', video: 'Vidéo', doc: 'Documentation', tool: 'Outil', other: 'Lien',
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

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase border", className)}>
    {children}
  </div>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const Icon = RESOURCE_ICONS[resource.type] || LinkIcon;
  const label = RESOURCE_LABELS[resource.type] || 'Lien';
  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, borderColor: '#F97316' }}
      className="p-4 bg-white border border-stone-200 rounded-xl transition-all cursor-pointer group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-orange-50 transition-colors">
          <Icon size={18} className="text-stone-500 group-hover:text-[#F97316]" />
        </div>
        <span className="text-[9px] uppercase tracking-tighter text-stone-400 font-medium">{label}</span>
      </div>
      <h4 className="text-sm font-semibold text-stone-900 leading-tight">{resource.title}</h4>
    </motion.a>
  );
};

const MetaPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium flex items-center gap-1">
      <Icon size={12} /> {label}
    </span>
    <span className="text-sm font-semibold text-stone-900">{value}</span>
  </div>
);

export default function SessionVibe3() {
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
        <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-orange-100 selection:text-[#F97316]">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-50/50 blur-[120px]" />
              <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-stone-50 blur-[100px]" />
            </div>

            <div className="relative flex flex-col md:flex-row">
              {/* LEFT - STICKY HERO */}
              <div className="w-full md:w-1/2 md:h-screen md:sticky md:top-0 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-100">
                {/* Nav */}
                <nav className="flex items-center justify-between">
                  <button onClick={() => router.push('/formation')} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group">
                    <div className="p-1.5 rounded-lg border border-stone-200 group-hover:border-stone-400 transition-all">
                      <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Formation</span>
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-widest text-stone-400">
                      S{session.sessionNumber.toString().padStart(2, '0')} / 12
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 transition-colors"><ChevronLeft size={16} /></button>
                      <button className="p-1.5 rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                </nav>

                {/* Title */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="my-12 md:my-0">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-orange-50 border-orange-100 text-[#F97316]">SEMAINE {session.week}</Badge>
                    {session.userStatus === 'COMPLETED' && (
                      <Badge className="bg-green-50 border-green-100 text-green-600">TERMINÉ</Badge>
                    )}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.1] tracking-tighter mb-6">
                    {session.title}
                  </h1>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <button
                    disabled={isLocked}
                    onClick={() => setPhase('course')}
                    className={cn(
                      "w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl shadow-orange-500/10",
                      isLocked
                        ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 shadow-none"
                        : "bg-[#F97316] text-white hover:bg-[#EA580C] hover:scale-[1.01] active:scale-[0.98]"
                    )}
                  >
                    {isLocked ? (
                      <><Lock size={20} /> SESSION VERROUILLÉE</>
                    ) : (
                      <><Play size={20} fill="currentColor" /> LANCER LA SESSION</>
                    )}
                  </button>
                </motion.div>
              </div>

              {/* RIGHT - SCROLLABLE */}
              <div className="w-full md:w-1/2 p-8 md:p-16 space-y-16">
                {/* Metadata */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <MetaPill icon={Calendar} label="Jour" value={getDayName(session.day)} />
                  <MetaPill icon={Clock} label="Durée" value={formatDuration(session.durationMinutes)} />
                  <MetaPill icon={Star} label="Reward" value="+100 XP" />
                  <MetaPill icon={Zap} label="Session" value={`#${session.sessionNumber}`} />
                </section>

                {/* Objectives */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold tracking-tight">Objectifs de la session</h2>
                    <div className="h-px flex-1 bg-stone-100" />
                  </div>
                  <ul className="space-y-4">
                    {session.objectives.map((objective, idx) => (
                      <motion.li key={idx} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-orange-100 flex items-center justify-center text-[10px] font-bold text-[#F97316]">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed font-medium">{objective}</p>
                      </motion.li>
                    ))}
                  </ul>
                </section>

                {/* Briefing */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold tracking-tight">Le Briefing</h2>
                    <div className="h-px flex-1 bg-stone-100" />
                  </div>
                  <p className="text-lg text-stone-500 leading-relaxed">{session.briefing}</p>
                </section>

                {/* Resources */}
                {resources.length > 0 && (
                  <section className="pb-16">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-xl font-bold tracking-tight">Ressources & Outils</h2>
                      <div className="h-px flex-1 bg-stone-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {resources.map((res) => (
                        <ResourceCard key={res.id} resource={res} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
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
