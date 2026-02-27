'use client'

import React, { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  Gamepad2,
  BookOpen,
  HelpCircle,
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Section {
  id: string
  title: string | null
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz'
  content: string
  codeLanguage: string | null
  sortOrder: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mdComponents = {
  h1: ({ ...props }: any) => <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-4 mt-6 first:mt-0 font-mono" {...props} />,
  h2: ({ ...props }: any) => <h2 className="text-lg font-bold text-stone-800 mb-3 mt-5 font-mono" {...props} />,
  h3: ({ ...props }: any) => <h3 className="text-sm font-bold text-stone-800 mb-2 mt-4 uppercase tracking-wider font-mono" {...props} />,
  p: ({ ...props }: any) => <p className="text-sm text-stone-600 leading-relaxed mb-4 last:mb-0 font-mono" {...props} />,
  ul: ({ ...props }: any) => <ul className="list-none space-y-2 mb-4 font-mono" {...props} />,
  ol: ({ ...props }: any) => <ol className="list-decimal list-inside space-y-2 mb-4 text-sm text-stone-600 font-mono" {...props} />,
  li: ({ children, ...props }: any) => (
    <li className="text-sm text-stone-600 flex items-start gap-2.5 font-mono" {...props}>
      <span className="text-[#d97757] mt-1 shrink-0 font-bold">→</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ ...props }: any) => (
    <blockquote className="border-l-2 border-[#d97757]/30 pl-4 py-2 italic text-stone-500 mb-4 bg-orange-50/40 rounded-r-lg font-mono text-sm" {...props} />
  ),
  table: ({ ...props }: any) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-stone-200">
      <table className="w-full text-left text-sm font-mono" {...props} />
    </div>
  ),
  thead: ({ ...props }: any) => <thead className="bg-[#FFF7ED] border-b border-stone-200" {...props} />,
  th: ({ ...props }: any) => <th className="px-4 py-2.5 font-bold text-stone-800 text-xs" {...props} />,
  td: ({ ...props }: any) => <td className="px-4 py-2.5 border-b border-stone-100 text-stone-600 text-xs" {...props} />,
  strong: ({ ...props }: any) => <strong className="font-bold text-stone-900" {...props} />,
  a: ({ ...props }: any) => <a className="text-[#d97757] underline underline-offset-4 hover:text-[#c4674a] transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  code: ({ children, ...props }: any) => (
    <code className="bg-orange-50 text-[#d97757] px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
      {children}
    </code>
  ),
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const TYPE_ICONS: Record<string, React.ElementType> = {
  text: BookOpen,
  code: Terminal,
  exercise: Gamepad2,
  tip: Lightbulb,
  warning: AlertTriangle,
  quiz: HelpCircle,
}

const TYPE_LABELS: Record<string, string> = {
  text: 'Leçon',
  code: 'Terminal',
  exercise: 'Exercice',
  tip: 'Astuce',
  warning: 'Attention',
  quiz: 'Quiz',
}

const TYPE_BADGE_STYLES: Record<string, string> = {
  text: 'bg-stone-50 border-stone-200 text-stone-500',
  code: 'bg-stone-900 border-stone-700 text-stone-300',
  exercise: 'bg-orange-50 border-[#d97757]/25 text-[#d97757]',
  tip: 'bg-amber-50 border-amber-200 text-amber-600',
  warning: 'bg-red-50 border-red-200 text-red-500',
  quiz: 'bg-violet-50 border-violet-200 text-violet-500',
}

// ─── Slide content renderers ───

function CodeSlide({ content, language }: { content: string; language: string | null }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative w-full rounded-xl overflow-hidden border border-stone-800 shadow-lg">
      <div className="flex items-center px-4 h-9 bg-stone-800 border-b border-stone-700/50 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[10px] text-stone-500 font-bold uppercase tracking-widest font-mono">
          {language || 'terminal'}
        </span>
        <button
          onClick={handleCopy}
          className="ml-auto p-1.5 rounded-md text-stone-500 hover:text-stone-300 hover:bg-stone-700 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="bg-[#1C1917] p-5 overflow-x-auto">
        <pre className="font-mono text-[13px] text-stone-300 leading-relaxed whitespace-pre">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}

function ExerciseSlide({ content }: { content: string }) {
  return (
    <div className="bg-white border-l-4 border-[#d97757] rounded-xl shadow-md p-6 border-y border-r border-stone-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-orange-50 border border-[#d97757]/20 flex items-center justify-center text-[#d97757]">
          <Gamepad2 size={20} />
        </div>
        <div>
          <h3 className="text-stone-900 font-bold text-xs uppercase tracking-widest font-mono">Objectif de Mission</h3>
          <p className="text-[10px] text-stone-400 font-mono">Accomplis les tâches ci-dessous</p>
        </div>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

function TipSlide({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-5 flex gap-4 shadow-sm"
    >
      <div className="mt-0.5 shrink-0">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <Lightbulb size={18} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2 font-mono">Astuce d'expert</span>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}

function WarningSlide({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4 shadow-sm"
    >
      <div className="mt-0.5 shrink-0">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertTriangle size={18} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2 font-mono">Attention</span>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}

function QuizSlide({ title }: { title: string | null }) {
  return (
    <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-10 flex flex-col items-center text-center">
      <div className="p-4 bg-white rounded-full border border-stone-200 text-stone-400 mb-4 shadow-sm">
        <HelpCircle size={28} />
      </div>
      <h3 className="text-sm font-bold text-stone-800 font-mono mb-1">{title || 'Quiz'}</h3>
      <p className="text-xs text-stone-400 font-mono italic">Le module de quiz sera disponible prochainement.</p>
    </div>
  )
}

// ─── Slide transition variants ───

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.96,
  }),
}

const contentStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const contentItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
}

// ─── Main component ───

export function SectionRenderer({ sections }: { sections: Section[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder)

  const goNext = useCallback(() => {
    if (currentIndex < sorted.length - 1) {
      setDirection(1)
      setCurrentIndex(i => i + 1)
    }
  }, [currentIndex, sorted.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(i => i - 1)
    }
  }, [currentIndex])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  if (!sections || sections.length === 0) return null

  const slide = sorted[currentIndex]
  const total = sorted.length
  const progress = ((currentIndex + 1) / total) * 100
  const TypeIcon = TYPE_ICONS[slide.type] || BookOpen

  function renderContent(s: Section) {
    switch (s.type) {
      case 'code':
        return <CodeSlide content={s.content} language={s.codeLanguage} />
      case 'exercise':
        return <ExerciseSlide content={s.content} />
      case 'tip':
        return <TipSlide content={s.content} />
      case 'warning':
        return <WarningSlide content={s.content} />
      case 'quiz':
        return <QuizSlide title={s.title} />
      default:
        return (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {s.content}
          </ReactMarkdown>
        )
    }
  }

  return (
    <div className="relative w-full min-h-[65vh] flex flex-col font-mono rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">

      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(#d97757 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 z-50">
        <motion.div
          className="h-full bg-[#d97757] rounded-r-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      </div>

      {/* Slide content area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.25 },
            }}
            className="absolute inset-0 overflow-y-auto p-6 sm:p-10 md:p-12"
          >
            <motion.div
              variants={contentStagger}
              initial="hidden"
              animate="visible"
              className="max-w-[700px] mx-auto"
            >
              {/* Type badge */}
              <motion.div variants={contentItem} className="mb-5">
                <span className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border',
                  TYPE_BADGE_STYLES[slide.type] || TYPE_BADGE_STYLES.text
                )}>
                  <TypeIcon size={12} />
                  {TYPE_LABELS[slide.type] || 'Contenu'}
                </span>
              </motion.div>

              {/* Slide title */}
              {slide.title && (
                <motion.h2
                  variants={contentItem}
                  className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 mb-6 leading-tight"
                >
                  {slide.title}
                </motion.h2>
              )}

              {/* Slide body */}
              <motion.div variants={contentItem}>
                {renderContent(slide)}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation bar */}
      <div className="relative z-40 px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-sm border-t border-stone-100 flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all font-mono',
            currentIndex === 0
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-500 hover:text-[#d97757] hover:bg-orange-50 active:scale-95'
          )}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">PRÉCÉDENT</span>
        </button>

        {/* Dots + counter */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {sorted.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 hover:opacity-80',
                  idx === currentIndex ? 'w-6 bg-[#d97757]' : idx < currentIndex ? 'w-2 bg-[#d97757]/30' : 'w-2 bg-stone-200'
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-stone-400 font-bold font-mono tracking-wider">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === total - 1}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all font-mono shadow-sm active:scale-95',
            currentIndex === total - 1
              ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
              : 'bg-[#d97757] text-white hover:bg-[#c4674a] hover:shadow-md'
          )}
        >
          <span className="hidden sm:inline">SUIVANT</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
