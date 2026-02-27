'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Terminal,
  Lightbulb,
  AlertTriangle,
  Gamepad2,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SectionType = 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz';

interface Section {
  id: string;
  title: string | null;
  type: SectionType;
  content: string;
  codeLanguage: string | null;
  sortOrder: number;
}

export function SectionRendererV1({ sections }: { sections: Section[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const totalSlides = sorted.length;
  const currentSection = sorted[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalSlides]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!sections || sections.length === 0) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number] }
    }),
  };

  const getThemeClasses = (type: SectionType) => {
    switch (type) {
      case 'code':
        return {
          bg: 'bg-[#1C1917]',
          text: 'text-white',
          accent: 'text-[#d97757]',
          icon: <Terminal className="w-12 h-12 text-[#d97757]" />,
          label: 'TERMINAL'
        };
      case 'exercise':
        return {
          bg: 'bg-[#FFF7ED]',
          text: 'text-stone-900',
          accent: 'text-[#d97757]',
          icon: <Gamepad2 className="w-12 h-12 text-[#d97757]" />,
          label: 'MISSION'
        };
      case 'tip':
        return {
          bg: 'bg-green-50',
          text: 'text-stone-900',
          accent: 'text-green-600',
          icon: <Lightbulb className="w-12 h-12 text-green-600" />,
          label: 'PRO TIP'
        };
      case 'warning':
        return {
          bg: 'bg-red-50',
          text: 'text-stone-900',
          accent: 'text-red-600',
          icon: <AlertTriangle className="w-12 h-12 text-red-600" />,
          label: 'ATTENTION'
        };
      case 'quiz':
        return {
          bg: 'bg-orange-50',
          text: 'text-stone-900',
          accent: 'text-[#d97757]',
          icon: <HelpCircle className="w-12 h-12 text-[#d97757]" />,
          label: 'QUIZ'
        };
      default:
        return {
          bg: 'bg-[#FFFCFA]',
          text: 'text-stone-900',
          accent: 'text-[#d97757]',
          icon: <BookOpen className="w-12 h-12 text-[#d97757]" />,
          label: 'LEÇON'
        };
    }
  };

  const theme = getThemeClasses(currentSection.type);

  return (
    <div className={cn("fixed inset-0 w-full h-full overflow-hidden font-mono select-none", theme.bg, "transition-colors duration-700")}>

      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-200/30 z-50">
        <motion.div
          className="h-full bg-[#d97757]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Floating Header */}
      <div className="absolute top-8 left-12 right-12 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-stone-200/20 rounded-lg shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">CODEX_AI</span>
          </div>
          <div className={cn("px-3 py-1 rounded-full border text-[10px] font-bold tracking-[0.2em]",
            currentSection.type === 'code' ? 'border-white/20 text-white/60' : 'border-[#d97757]/20 text-[#d97757]')}>
            {theme.label}
          </div>
        </div>
        <div className={cn("text-xs font-bold tracking-widest", currentSection.type === 'code' ? 'text-white/40' : 'text-stone-400')}>
          {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="relative w-full h-full flex items-center justify-center p-12 md:p-24">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSection.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 }
            }}
            className="w-full max-w-7xl h-full flex flex-col justify-center gap-8"
          >
            {/* Slide Header */}
            {currentSection.title && (
              <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible">
                <div className="flex items-center gap-6 mb-4">
                  <div className="p-4 bg-white shadow-xl rounded-2xl border border-stone-100">
                    {theme.icon}
                  </div>
                  <h1 className={cn("text-5xl md:text-7xl font-bold tracking-tighter leading-none", theme.text)}>
                    {currentSection.title}
                  </h1>
                </div>
              </motion.div>
            )}

            {/* Slide Body */}
            <motion.div
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-visible flex flex-col justify-center"
            >
              {currentSection.type === 'code' ? (
                <div className="relative group w-full max-w-5xl mx-auto">
                  <div className="bg-[#2A2624] px-6 py-4 rounded-t-2xl border-x border-t border-white/10 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="text-[10px] text-stone-500 font-bold tracking-widest uppercase">
                      {currentSection.codeLanguage || 'terminal'}
                    </div>
                  </div>

                  <div className="bg-[#1C1917] p-8 md:p-12 rounded-b-2xl border border-white/10 shadow-2xl overflow-hidden relative">
                    <pre className="text-xl md:text-2xl leading-relaxed overflow-x-auto text-orange-200/90 whitespace-pre-wrap">
                      <code>{currentSection.content}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(currentSection.content)}
                      className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95"
                    >
                      {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-stone-400" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-2xl max-w-none prose-stone">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="text-2xl md:text-3xl leading-relaxed font-medium mb-8 max-w-4xl">{children}</p>,
                      li: ({ children }) => <li className="text-xl md:text-2xl mb-4 list-none flex items-start gap-4 before:content-['→'] before:text-[#d97757] before:font-bold">{children}</li>,
                      strong: ({ children }) => <strong className="text-[#d97757] font-extrabold">{children}</strong>,
                      code: ({ children }) => <code className="bg-orange-100 text-[#d97757] px-2 py-0.5 rounded-md text-[0.9em]">{children}</code>,
                      h1: ({ children }) => <h1 className="text-4xl font-bold tracking-tight mb-6">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-3xl font-bold tracking-tight mb-4">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-2xl font-bold tracking-tight mb-3">{children}</h3>,
                      ul: ({ children }) => <ul className="space-y-3 mb-6">{children}</ul>,
                      ol: ({ children }) => <ol className="space-y-3 mb-6 list-decimal list-inside">{children}</ol>,
                    }}
                  >
                    {currentSection.content}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>

            {currentSection.type === 'exercise' && (
              <motion.div
                custom={2}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 p-6 bg-white border border-[#d97757]/20 rounded-2xl shadow-md max-w-xl self-start"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Objectif Actif</span>
                </div>
                <p className="text-lg text-stone-600 font-bold">Complétez cette mission pour débloquer la suite.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls - Side Arrows */}
      <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-center group/nav pointer-events-none">
        {currentIndex > 0 && (
          <button
            onClick={goToPrev}
            className="p-6 rounded-full bg-white/5 group-hover/nav:bg-white/20 backdrop-blur-sm border border-stone-200/10 text-stone-400 transition-all pointer-events-auto hover:scale-110 active:scale-90"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
        )}
      </div>

      <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-center group/nav pointer-events-none">
        {currentIndex < totalSlides - 1 && (
          <button
            onClick={goToNext}
            className="p-6 rounded-full bg-[#d97757] shadow-2xl text-white transition-all pointer-events-auto hover:scale-110 active:scale-90"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        )}
      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center items-center gap-4 z-50">
        <div className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-stone-200/20 rounded-full flex gap-3 items-center">
          {sorted.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentIndex === idx
                  ? "bg-[#d97757] w-8 shadow-[0_0_15px_rgba(217,119,87,0.5)]"
                  : "bg-stone-300 hover:bg-stone-400"
              )}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-12 text-[9px] font-bold tracking-[0.2em] text-stone-400 pointer-events-none opacity-50 uppercase">
        Utilisez les flèches du clavier pour naviguer
      </div>
    </div>
  );
}
