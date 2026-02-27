'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Section {
  id: string;
  title: string | null;
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz';
  content: string;
  codeLanguage: string | null;
  sortOrder: number;
}

const TYPE_CONFIG = {
  text: { icon: BookOpen, label: 'Leçon', color: 'text-stone-500' },
  code: { icon: Terminal, label: 'Code', color: 'text-[#d97757]' },
  exercise: { icon: Gamepad2, label: 'Mission', color: 'text-green-600' },
  tip: { icon: Lightbulb, label: 'Astuce', color: 'text-amber-500' },
  warning: { icon: AlertTriangle, label: 'Attention', color: 'text-red-500' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-blue-500' },
};

export function SectionRendererV3({ sections }: { sections: Section[] }) {
  const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeSection = sortedSections[activeIndex];
  const progress = ((activeIndex + 1) / sortedSections.length) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => Math.min(prev + 1, sortedSections.length - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedSections.length]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFFCFA] font-mono overflow-hidden text-stone-900">
      {/* Progress Bar Top */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-stone-200 z-50">
        <motion.div
          className="h-full bg-[#d97757]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* LEFT SIDEBAR (40%) */}
      <aside className="w-[40%] h-full bg-[#FFF7ED] border-r border-stone-200 flex flex-col pt-6">
        <div className="px-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-[#d97757] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              C_X
            </div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-stone-900">CODEX_AI</h1>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Table des matières</span>
            <span className="text-[10px] text-[#d97757] font-bold">{Math.round(progress)}% complété</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-12 space-y-1 custom-scrollbar">
          {sortedSections.map((section, index) => {
            const Config = TYPE_CONFIG[section.type] || TYPE_CONFIG.text;
            const isActive = activeIndex === index;

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={cn(
                  "relative w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-4 group",
                  isActive ? "bg-white shadow-md" : "hover:bg-orange-50/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-4 bottom-4 w-1 bg-[#d97757] rounded-full"
                  />
                )}

                <div className={cn(
                  "mt-1 p-2 rounded-lg transition-colors",
                  isActive ? "bg-orange-50 text-[#d97757]" : "text-stone-400 group-hover:text-stone-600"
                )}>
                  <Config.icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                      isActive
                        ? "border-orange-200 bg-orange-50 text-[#d97757]"
                        : "border-stone-200 text-stone-400"
                    )}>
                      {Config.label}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] text-green-600 font-bold"
                      >
                        LECTURE EN COURS
                      </motion.span>
                    )}
                  </div>
                  <h3 className={cn(
                    "text-sm font-bold leading-tight truncate",
                    isActive ? "text-stone-900" : "text-stone-500"
                  )}>
                    {section.title || `Section ${index + 1}`}
                  </h3>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-stone-200 bg-white/50 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="text-stone-600" />
            </button>
            <button
              onClick={() => setActiveIndex(prev => Math.min(sortedSections.length - 1, prev + 1))}
              disabled={activeIndex === sortedSections.length - 1}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} className="text-stone-600" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-stone-400">
            {activeIndex + 1} / {sortedSections.length}
          </span>
        </div>
      </aside>

      {/* RIGHT CONTENT (60%) */}
      <main
        ref={scrollContainerRef}
        className="w-[60%] h-full overflow-y-auto bg-white relative selection:bg-orange-100 selection:text-[#d97757]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-3xl mx-auto px-12 py-24"
          >
            {/* Header Content */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-stone-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d97757]">
                  Section {activeIndex + 1}
                </span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-stone-900 mb-6">
                {activeSection?.title || "Section sans titre"}
              </h2>
            </header>

            {/* Renderer Logic */}
            <div className="space-y-8">
              {activeSection.type === 'text' && (
                <div className="prose prose-stone max-w-none prose-p:text-stone-600 prose-p:leading-relaxed prose-headings:text-stone-900 prose-headings:font-bold prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-strong:text-stone-900">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeSection.content}
                  </ReactMarkdown>
                </div>
              )}

              {activeSection.type === 'code' && (
                <div className="relative group">
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-stone-900 text-[10px] text-stone-400 rounded-full flex items-center gap-2 z-10 border border-stone-700 shadow-xl">
                    <div className="flex gap-1.5 mr-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    {activeSection.codeLanguage || 'terminal'}
                  </div>

                  <div className="bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-stone-800 pt-8 pb-4">
                    <pre className="p-6 overflow-x-auto text-sm leading-relaxed text-stone-300">
                      <code>{activeSection.content}</code>
                    </pre>
                  </div>

                  <button
                    onClick={() => handleCopy(activeSection.content)}
                    className="absolute top-10 right-4 p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-stone-400 transition-all border border-white/10 active:scale-95"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              )}

              {activeSection.type === 'exercise' && (
                <div className="bg-white border-l-4 border-green-500 shadow-sm border border-stone-200 rounded-r-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Gamepad2 size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-stone-900">Mission à accomplir</h4>
                  </div>
                  <div className="prose prose-stone prose-sm max-w-none text-stone-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeSection.content}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
                    <button className="flex items-center gap-2 bg-[#d97757] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#c4674a] transition-all hover:translate-x-1">
                      Valider ma mission <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeSection.type === 'tip' && (
                <div className="bg-[#FFF7ED] border border-orange-200 rounded-xl p-8 flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-orange-100 flex items-center justify-center text-amber-500">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 mb-2 uppercase tracking-wide text-xs">Le conseil d&apos;expert</h4>
                    <div className="text-stone-700 text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {activeSection.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {activeSection.type === 'warning' && (
                <div className="bg-red-50/50 border border-red-200 rounded-xl p-8 flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-red-100 flex items-center justify-center text-red-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-2 uppercase tracking-wide text-xs">Point de vigilance</h4>
                    <div className="text-red-800/80 text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {activeSection.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <footer className="mt-24 pt-12 border-t border-stone-100 flex items-center justify-between">
              <div className="group cursor-pointer" onClick={() => activeIndex > 0 && scrollToSection(activeIndex - 1)}>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Précédent</span>
                <div className="flex items-center gap-2 text-stone-500 group-hover:text-stone-900 transition-colors">
                  <ChevronLeft size={16} />
                  <span className="text-sm font-bold">
                    {activeIndex > 0 ? (sortedSections[activeIndex - 1].title || "Section précédente") : "Début du cours"}
                  </span>
                </div>
              </div>

              <div className="text-right group cursor-pointer" onClick={() => activeIndex < sortedSections.length - 1 && scrollToSection(activeIndex + 1)}>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Suivant</span>
                <div className="flex items-center gap-2 text-stone-500 group-hover:text-[#d97757] transition-colors">
                  <span className="text-sm font-bold">
                    {activeIndex < sortedSections.length - 1 ? (sortedSections[activeIndex + 1].title || "Section suivante") : "Fin du module"}
                  </span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FED7AA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d97757;
        }
      `}</style>
    </div>
  );
}
