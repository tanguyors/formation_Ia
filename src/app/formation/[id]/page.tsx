"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Zap,
  Clock,
  Target,
  Circle,
  Loader2,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Play,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Video,
  Wrench,
  Link2,
  Terminal,
  Cpu,
  DollarSign,
  Layout,
  Timer,
  Code2,
  Layers,
  Bot,
  Rocket,
  Shield,
} from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { useProgress } from '@/hooks/useProgress'
import { SectionRendererV2 } from '@/components/vibes/CourseVibe2'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`
}

const formatSessionNumber = (num: number): string => {
  return `S${num.toString().padStart(2, '0')}`
}

const getDayName = (day: number): string => {
  const days: Record<number, string> = {
    1: 'Lundi',
    2: 'Mercredi',
    3: 'Vendredi'
  }
  return days[day] || `Jour ${day}`
}

type Phase = 'briefing' | 'course'

interface Resource {
  id: string
  title: string
  url: string
  type: string
  sortOrder: number
}

interface Section {
  id: string
  title: string | null
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz'
  content: string
  codeLanguage: string | null
  sortOrder: number
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  article: FileText,
  repo: Github,
  video: Video,
  doc: BookOpen,
  tool: Wrench,
  other: Link2,
}

const RESOURCE_LABELS: Record<string, string> = {
  article: 'Article',
  repo: 'Repo GitHub',
  video: 'Vidéo',
  doc: 'Documentation',
  tool: 'Outil',
  other: 'Lien',
}

// Rotating icons for bento objective cards
const OBJECTIVE_ICONS = [Terminal, Cpu, Code2, Zap, Layers, Bot, Rocket, Shield, Layout, Timer]
// Bento card styles rotating
const BENTO_STYLES = [
  'col-span-2 bg-white border border-stone-200', // large white
  'col-span-1 bg-[#1C1917] text-white',          // dark
  'col-span-1 bg-white border border-stone-200',  // standard
  'col-span-1 bg-[#FFF7ED] border border-[#FED7AA]', // warm surface
  'col-span-1 bg-[#d97757] text-white',           // accent
  'col-span-2 bg-white border border-stone-200',  // large white again
  'col-span-1 bg-[#1C1917] text-white',
  'col-span-1 bg-[#d97757] text-white',
  'col-span-1 bg-white border border-stone-200',
  'col-span-2 bg-[#FFF7ED] border border-[#FED7AA]',
]

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { session, loading, error } = useSession(id)
  const { refresh } = useProgress()

  const [phase, setPhase] = useState<Phase>('briefing')
  const [showSuccess, setShowSuccess] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [quizData, setQuizData] = useState<{ questions: Array<{ id: string; questionText: string; questionType: 'multiple_choice' | 'true_false'; sortOrder: number; sectionId: string; options: Array<{ id: string; optionText: string; sortOrder: number }> }>; hasQuiz: boolean; alreadyPassed: boolean } | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/sessions/${id}/resources`)
      .then(res => res.ok ? res.json() : { resources: [] })
      .then(data => setResources(data.resources || []))
      .catch(() => setResources([]))

    fetch(`/api/sessions/${id}/sections`)
      .then(res => res.ok ? res.json() : { sections: [] })
      .then(data => setSections(data.sections || []))
      .catch(() => setSections([]))

    fetch(`/api/sessions/${id}/quiz`)
      .then(res => res.ok ? res.json() : { questions: [], hasQuiz: false, alreadyPassed: false })
      .then(data => setQuizData(data))
      .catch(() => setQuizData(null))
  }, [id])

  const handleQuizPassed = () => {
    setShowSuccess(true)
    refresh() // Refresh progress data
    setTimeout(() => router.push('/formation'), 2500)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCFA] font-mono flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#d97757] animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-widest text-stone-400">Chargement...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#FFFCFA] font-mono flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 mb-2">
          {error ? "Erreur de chargement" : "Session non trouvée"}
        </h1>
        <button
          onClick={() => router.push('/formation')}
          className="text-[#d97757] text-sm hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au parcours
        </button>
      </div>
    )
  }

  // If session is completed, go directly to course view
  const effectivePhase = session.userStatus === 'COMPLETED' ? 'course' : phase

  return (
    <div className="bg-[#FFFCFA] font-mono text-stone-900 selection:bg-[#FED7AA] selection:text-[#d97757]">

      <AnimatePresence mode="wait">
        {/* ═══════════════════════ PHASE 1: BRIEFING (BENTO GRID) ═══════════════════════ */}
        {effectivePhase === 'briefing' && (
          <motion.main
            key="briefing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="h-screen w-full flex flex-col overflow-hidden p-4 sm:p-6 gap-4"
          >
            {/* Compact header bar */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/formation')}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors border border-stone-200 group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg px-3 py-1">
                  <button className="text-stone-400 hover:text-[#1C1917] transition-colors"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-bold tracking-tighter">
                    {formatSessionNumber(session.sessionNumber)} / 12
                  </span>
                  <button className="text-stone-400 hover:text-[#1C1917] transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFF7ED] text-[#d97757] border border-[#FED7AA]">
                  WEEK {session.week}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-stone-500 border border-stone-200">
                  {formatDuration(session.durationMinutes)}
                </span>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#1C1917] text-white">
                  {getDayName(session.day)}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#d97757] text-white flex items-center gap-1">
                  <Zap size={10} /> +100 XP
                </span>
              </div>
            </div>

            {/* Session title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="shrink-0"
            >
              <p className="text-[10px] text-[#d97757] font-bold tracking-widest uppercase">
                Session {session.sessionNumber} — {getDayName(session.day)}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight">
                {session.title}
              </h1>
            </motion.div>

            {/* Bento Grid — objectives as visual cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 grid grid-cols-3 gap-3 sm:gap-4 min-h-0"
            >
              {session.objectives.map((objective, idx) => {
                const Icon = OBJECTIVE_ICONS[idx % OBJECTIVE_ICONS.length]
                const style = BENTO_STYLES[idx % BENTO_STYLES.length]
                const isDark = style.includes('bg-[#1C1917]')
                const isAccent = style.includes('bg-[#d97757]')

                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className={cn(
                      style,
                      'rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all cursor-default overflow-hidden relative group'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        isDark ? 'bg-stone-800' : isAccent ? 'bg-white/20' : 'bg-[#FFF7ED]'
                      )}>
                        <Icon size={16} className={cn(
                          isDark ? 'text-[#FED7AA]' : isAccent ? 'text-white' : 'text-[#d97757]'
                        )} />
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-widest',
                        isDark ? 'text-stone-500' : isAccent ? 'text-white/60' : 'text-stone-400'
                      )}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className={cn(
                      'text-sm sm:text-base font-bold leading-snug',
                      isDark ? 'text-white' : isAccent ? 'text-white' : 'text-stone-800'
                    )}>
                      {objective}
                    </p>
                    {/* Decorative big number */}
                    <span className={cn(
                      'absolute -bottom-2 -right-1 text-6xl font-black pointer-events-none select-none',
                      isDark ? 'text-stone-800' : isAccent ? 'text-white/10' : 'text-stone-100'
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Bottom bar: briefing + CTA */}
            <div className="shrink-0 flex items-center gap-4">
              {session.briefing && (
                <div className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 min-w-0">
                  <p className="text-[10px] text-[#d97757] font-bold uppercase tracking-widest mb-1">Briefing</p>
                  <p className="text-xs text-stone-500 truncate">{session.briefing}</p>
                </div>
              )}
              {session.userStatus === 'LOCKED' ? (
                <button
                  disabled
                  className="shrink-0 px-6 py-3 bg-stone-100 border border-stone-200 text-stone-400 rounded-xl flex items-center gap-2 cursor-not-allowed font-bold text-sm"
                >
                  <Lock size={16} /> VERROUILLÉ
                </button>
              ) : (
                <button
                  onClick={() => setPhase('course')}
                  className="shrink-0 px-6 py-3 bg-[#d97757] text-white rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-[#c4674a] shadow-lg shadow-[#d97757]/20 transition-all active:scale-[0.98]"
                >
                  <Play size={16} /> COMMENCER
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.main>
        )}

        {/* ═══════════════════════ PHASE 2: COURSE (FULLSCREEN) ═══════════════════════ */}
        {effectivePhase === 'course' && (
          <motion.div
            key="course"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Floating top-left: Back button */}
            <div className="fixed top-6 left-6 z-[60]">
              <button
                onClick={() => {
                  if (session.userStatus !== 'COMPLETED') {
                    setPhase('briefing')
                  } else {
                    router.push('/formation')
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-stone-700 rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all text-xs font-bold tracking-widest uppercase group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                {session.userStatus !== 'COMPLETED' ? 'Briefing' : 'Parcours'}
              </button>
            </div>

            {/* Floating top-right: Status indicator */}
            <div className="fixed top-6 right-6 z-[60]">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full font-bold text-xs tracking-widest uppercase shadow-lg"
                  >
                    <Trophy size={14} className="animate-bounce" />
                    MISSION ACCOMPLIE !
                  </motion.div>
                ) : session.userStatus === 'COMPLETED' ? (
                  <div key="completed" className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-green-400 text-xs font-bold tracking-widest uppercase">
                    <CheckCircle2 size={14} />
                    Terminée
                  </div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Fullscreen Course Viewer */}
            {sections.length > 0 ? (
              <SectionRendererV2
                sections={sections}
                sessionId={session.id}
                quizData={quizData}
                onQuizPassed={handleQuizPassed}
              />
            ) : (
              <div className="h-screen w-full bg-[#1C1917] flex flex-col items-center justify-center text-stone-400 font-mono">
                <Play size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-bold text-white">Contenu à venir</p>
                <p className="text-[10px] uppercase tracking-widest mt-2">Les slides seront disponibles bientôt</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-[#FFF7ED]/30 to-transparent pointer-events-none -z-10" />
    </div>
  )
}
