'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
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
  HelpCircle,
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Interfaces ──────────────────────────────────────────────

interface Section {
  id: string;
  title: string | null;
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz';
  content: string;
  codeLanguage: string | null;
  sortOrder: number;
}

interface QuizOption { id: string; optionText: string; sortOrder: number; }
interface QuizQuestion { id: string; questionText: string; questionType: 'multiple_choice' | 'true_false'; sortOrder: number; sectionId: string; options: QuizOption[]; }
interface QuizData { questions: QuizQuestion[]; hasQuiz: boolean; alreadyPassed: boolean; }

interface QuizResult {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
}

// ── Interactive Quiz ────────────────────────────────────────

function InteractiveQuiz({
  questions, sessionId, alreadyPassed, onQuizPassed,
}: {
  questions: QuizQuestion[]; sessionId: string; alreadyPassed: boolean; onQuizPassed: () => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passed, setPassed] = useState(alreadyPassed);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);

  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (results) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setResults(data.results);
      setScore({ score: data.score, total: data.totalQuestions });
      setPassed(data.passed);
      if (data.passed) onQuizPassed();
    } catch (err) {
      console.error('Quiz submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => { setSelectedAnswers({}); setResults(null); setScore(null); };

  if (passed && !results) {
    return (
      <div className="bg-white border border-green-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 bg-green-50 border-b border-green-100">
          <Trophy size={18} className="text-green-600" />
          <span className="text-green-700 font-bold text-sm">Quiz validé</span>
        </div>
        <div className="p-6 text-center">
          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-black font-bold">Module validé avec succès !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-3 bg-[#F97316]/5 border-b border-[#F97316]/10">
        <HelpCircle size={18} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold text-sm">Quiz de validation</span>
        <span className="ml-auto text-slate-400 text-xs">{Object.keys(selectedAnswers).length}/{questions.length}</span>
      </div>

      {results && score && (
        <div className={cn("px-6 py-3 border-b flex items-center justify-between", passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
          <div className="flex items-center gap-2">
            {passed ? <Trophy size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
            <span className={cn("font-bold text-sm", passed ? "text-green-700" : "text-red-600")}>{passed ? 'Réussi' : 'Échoué'} — {score.score}/{score.total}</span>
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-black">
              <RotateCcw size={12} /> Réessayer
            </button>
          )}
        </div>
      )}

      <div className="p-6 space-y-6">
        {questions.map((question, qIndex) => {
          const result = results?.find(r => r.questionId === question.id);
          return (
            <div key={question.id} className="space-y-3">
              <p className="text-sm text-black font-bold">{qIndex + 1}. {question.questionText}</p>
              <div className="grid gap-2">
                {question.options.map(option => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  const isCorrectOption = result?.correctOptionId === option.id;
                  const isWrongSelection = result && isSelected && !result.isCorrect;
                  let style = 'border-slate-200 hover:border-[#F97316]/30';
                  if (result) {
                    if (isCorrectOption) style = 'border-green-300 bg-green-50';
                    else if (isWrongSelection) style = 'border-red-300 bg-red-50';
                    else style = 'border-slate-100 opacity-50';
                  } else if (isSelected) style = 'border-[#F97316] bg-[#F97316]/5';
                  return (
                    <button key={option.id} onClick={() => handleSelect(question.id, option.id)} disabled={!!results}
                      className={cn("w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center gap-3", style, !results && "cursor-pointer")}>
                      <div className={cn("shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        result ? (isCorrectOption ? "border-green-500 bg-green-500" : isWrongSelection ? "border-red-500 bg-red-500" : "border-slate-200")
                          : isSelected ? "border-[#F97316] bg-[#F97316]" : "border-slate-300")}>
                        {(isSelected || (result && isCorrectOption)) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn(result ? (isCorrectOption ? "text-green-700 font-bold" : isWrongSelection ? "text-red-500 line-through" : "text-slate-400") : isSelected ? "text-black" : "text-slate-600")}>
                        {option.optionText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!results && (
        <div className="px-6 pb-6">
          <button onClick={handleSubmit} disabled={!allAnswered || submitting}
            className={cn("w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
              allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c]" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Vérification...</> : <><Check size={16} /> Valider</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Terminal Typing Animation ───────────────────────────────

function TerminalTyping({ content, isActive }: { content: string; isActive: boolean }) {
  const lines = useMemo(() => content.split('\n'), [content]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset when section changes
  useEffect(() => {
    if (isActive && !hasPlayed) {
      setVisibleLines(0);
      setCharIndex(0);
      // Start animation after a short delay
      animationRef.current = setTimeout(() => {
        setVisibleLines(1);
      }, 300);
    }
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, [isActive, hasPlayed]);

  // Animate line by line
  useEffect(() => {
    if (!isActive || hasPlayed || visibleLines === 0) return;

    if (visibleLines <= lines.length) {
      const currentLine = lines[visibleLines - 1] || '';
      const isComment = currentLine.trimStart().startsWith('#');
      const isEmpty = currentLine.trim() === '';

      if (charIndex < currentLine.length) {
        // Type character by character
        const speed = isComment ? 8 : isEmpty ? 5 : 20;
        animationRef.current = setTimeout(() => setCharIndex(prev => prev + 3), speed);
      } else {
        // Move to next line
        if (visibleLines < lines.length) {
          const nextLine = lines[visibleLines] || '';
          const delay = nextLine.trim() === '' ? 50 : nextLine.trimStart().startsWith('#') ? 100 : 150;
          animationRef.current = setTimeout(() => {
            setVisibleLines(prev => prev + 1);
            setCharIndex(0);
          }, delay);
        } else {
          setHasPlayed(true);
        }
      }
    }

    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, [isActive, visibleLines, charIndex, lines, hasPlayed]);

  // If already played, show everything
  if (hasPlayed || !isActive) {
    return (
      <pre className="p-6 text-sm overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <code>{content}</code>
      </pre>
    );
  }

  return (
    <pre className="p-6 text-sm overflow-x-auto text-slate-200 leading-relaxed font-mono">
      <code>
        {lines.slice(0, visibleLines).map((line, i) => {
          const isCurrentLine = i === visibleLines - 1;
          const displayedText = isCurrentLine ? line.slice(0, charIndex) : line;
          const isComment = line.trimStart().startsWith('#');

          return (
            <React.Fragment key={i}>
              <span className={isComment ? 'text-slate-500' : ''}>
                {displayedText}
              </span>
              {isCurrentLine && (
                <span className="inline-block w-2 h-4 bg-[#F97316] ml-0.5 animate-pulse align-middle" />
              )}
              {'\n'}
            </React.Fragment>
          );
        })}
      </code>
    </pre>
  );
}

// ── Watermark labels ────────────────────────────────────────

const watermarkLabels: Record<Section['type'], string> = {
  text: 'TEXTE', code: 'CODE', exercise: 'EXERCICE', tip: 'ASTUCE', warning: 'ALERTE', quiz: 'QUIZ',
};

// ── Animated Section Wrapper (full-screen snap) ─────────────

function ImmersiveSection({ section, index, sessionId, quizData, onQuizPassed, isActive }: {
  section: Section; index: number; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void;
  isActive: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mdComponents = {
    h1: ({ children }: any) => <h1 className="text-3xl md:text-4xl font-sans font-black text-black mb-5">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl md:text-3xl font-sans font-bold text-black mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-sans font-bold text-slate-700 mb-3">{children}</h3>,
    p: ({ children }: any) => <p className="text-lg font-sans leading-relaxed text-slate-600 mb-4">{children}</p>,
    strong: ({ children }: any) => <strong className="text-[#F97316] font-bold">{children}</strong>,
    ul: ({ children }: any) => <ul className="space-y-2 my-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="space-y-2 my-4">{children}</ol>,
    li: ({ children }: any) => (
      <li className="flex items-start gap-3 text-lg text-slate-600">
        <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    code: ({ children }: any) => <code className="bg-slate-100 text-[#F97316] px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[#F97316] pl-5 my-5 text-lg italic text-slate-500">{children}</blockquote>,
    img: ({ src, alt }: any) => (
      <span className="block my-8 text-center">
        <img src={src} alt={alt || ''} className="inline-block rounded-2xl shadow-lg max-w-full h-auto max-h-[500px] object-contain" />
      </span>
    ),
    table: ({ children }: any) => <div className="overflow-x-auto my-5 rounded-xl border border-slate-200"><table className="w-full text-left">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
    th: ({ children }: any) => <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#F97316]">{children}</th>,
    tr: ({ children }: any) => <tr className="border-b border-slate-100 last:border-0">{children}</tr>,
    td: ({ children }: any) => <td className="px-5 py-3 text-sm text-slate-600">{children}</td>,
  };

  const renderContent = () => {
    switch (section.type) {
      case 'code':
        return (
          <div className="bg-[#0F172A] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-slate-500 text-xs font-mono flex items-center gap-1.5">
                  <Terminal size={12} />
                  {section.codeLanguage || 'code'}
                </span>
              </div>
              <button onClick={() => handleCopy(section.content)} className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-all">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <TerminalTyping content={section.content} isActive={isActive} />
          </div>
        );

      case 'exercise':
        return (
          <div className="bg-white border-2 border-[#F97316]/20 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-6 py-3 bg-[#F97316] text-white">
              <Gamepad2 size={18} />
              <span className="font-bold uppercase tracking-widest text-sm">Exercice Pratique</span>
            </div>
            <div className="p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
            </div>
          </div>
        );

      case 'tip':
        return (
          <div className="border-l-4 border-[#F97316] bg-orange-50/50 rounded-r-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Astuce</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
          </div>
        );

      case 'warning':
        return (
          <div className="border-l-4 border-red-500 bg-red-50/50 rounded-r-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-red-500" />
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Attention</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              ...mdComponents,
              p: ({ children }: any) => <p className="text-lg font-sans leading-relaxed text-red-800/70 mb-3">{children}</p>,
              strong: ({ children }: any) => <strong className="text-red-600 font-bold">{children}</strong>,
            }}>{section.content}</ReactMarkdown>
          </div>
        );

      case 'quiz':
        if (quizData?.hasQuiz && quizData.questions.length > 0 && sessionId) {
          return (
            <InteractiveQuiz
              questions={quizData.questions.filter(q => q.sectionId === section.id)}
              sessionId={sessionId}
              alreadyPassed={quizData.alreadyPassed}
              onQuizPassed={onQuizPassed || (() => {})}
            />
          );
        }
        return (
          <div className="text-center py-8">
            <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Quiz en cours de chargement...</p>
          </div>
        );

      default:
        return <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-20">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        {section.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl md:text-5xl font-sans font-black text-black mb-8"
          >
            {section.title}
          </motion.h2>
        )}
        {renderContent()}
      </motion.div>
    </div>
  );
}

// ── Chapter Navigation Bar ──────────────────────────────────

interface ChapterInfo {
  index: number;
  title: string;
  isActive: boolean;
}

function ChapterNavbar({ chapters, onChapterClick, activeIndex }: {
  chapters: ChapterInfo[];
  onChapterClick: (index: number) => void;
  activeIndex: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.querySelector('[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  if (chapters.length <= 1) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center max-w-full lg:max-w-4xl bg-white/70 backdrop-blur-md border border-slate-200 rounded-full shadow-lg p-1 overflow-hidden"
      >
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto px-1 py-0.5 scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {chapters.map((chapter, idx) => {
            const isCompleted = !chapter.isActive && activeIndex > chapter.index;
            const isCurrent = chapter.isActive;
            const chapterNumber = (idx + 1).toString().padStart(2, '0');

            return (
              <button
                key={chapter.index}
                onClick={() => onChapterClick(chapter.index)}
                data-active={isCurrent}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 group",
                  isCurrent
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-200"
                    : "bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                )}
              >
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <Check className={cn("w-3.5 h-3.5", isCurrent ? "text-white" : "text-[#F97316]")} strokeWidth={3} />
                  ) : (
                    <span className={cn("text-[10px] font-bold tracking-widest uppercase", isCurrent ? "text-orange-100" : "text-slate-400 group-hover:text-slate-500")}>
                      {chapterNumber}
                    </span>
                  )}
                </div>
                <span className={cn("text-xs font-semibold tracking-tight", isCurrent ? "text-white" : "text-slate-700")}>
                  {chapter.title.length > 30 ? chapter.title.slice(0, 28) + '…' : chapter.title}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────

export function SectionRendererV2({
  sections, sessionId, quizData, onQuizPassed,
}: {
  sections: Section[]; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const sortedSections = useMemo(() =>
    [...sections].filter(s => s.type !== 'quiz').sort((a, b) => a.sortOrder - b.sortOrder),
  [sections]);

  // Compute chapters from sections with titles
  const chapters = useMemo(() => {
    const chapterIndices = sortedSections
      .map((s, idx) => ({ index: idx, title: s.title }))
      .filter(s => s.title !== null);

    return chapterIndices.map((ch, i) => {
      const nextChapterIndex = i < chapterIndices.length - 1 ? chapterIndices[i + 1].index : sortedSections.length;
      const isActive = activeIndex >= ch.index && activeIndex < nextChapterIndex;
      return {
        index: ch.index,
        title: ch.title as string,
        isActive,
      };
    });
  }, [sortedSections, activeIndex]);

  const scrollToSection = useCallback((idx: number) => {
    if (idx < 0 || idx >= sortedSections.length) return;
    const el = document.getElementById(`immersive-section-${idx}`);
    if (!el) return;
    isScrolling.current = true;
    setActiveIndex(idx);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isScrolling.current = false; }, 800);
  }, [sortedSections.length]);

  // Smart wheel handler: snap for short sections, free scroll for tall ones
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) { e.preventDefault(); return; }

      const currentEl = container.querySelector('[data-active="true"]');
      const currentIdx = currentEl ? Number(currentEl.getAttribute('data-index')) : 0;
      const sectionEl = document.getElementById(`immersive-section-${currentIdx}`);
      if (!sectionEl) return;

      const viewportH = container.clientHeight;
      const sectionH = sectionEl.offsetHeight;
      const isTall = sectionH > viewportH + 20; // 20px tolerance

      if (!isTall) {
        // Short section: full snap (one scroll = next page)
        e.preventDefault();
        if (e.deltaY > 0 && currentIdx < sortedSections.length - 1) {
          scrollToSection(currentIdx + 1);
        } else if (e.deltaY < 0 && currentIdx > 0) {
          scrollToSection(currentIdx - 1);
        }
        return;
      }

      // Tall section: allow free scroll, snap at boundaries
      const sectionRect = sectionEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const atBottom = sectionRect.bottom <= containerRect.bottom + 15;
      const atTop = sectionRect.top >= containerRect.top - 15;

      if (e.deltaY > 0 && atBottom && currentIdx < sortedSections.length - 1) {
        e.preventDefault();
        scrollToSection(currentIdx + 1);
      } else if (e.deltaY < 0 && atTop && currentIdx > 0) {
        e.preventDefault();
        scrollToSection(currentIdx - 1);
      }
      // Otherwise: let normal scroll happen inside the tall section
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scrollToSection, sortedSections.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = Math.min(prev + 1, sortedSections.length - 1);
          scrollToSection(next);
          return next;
        });
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = Math.max(prev - 1, 0);
          scrollToSection(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scrollToSection, sortedSections.length]);

  // IntersectionObserver for dot sync on touch/trackpad
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sortedSections.forEach((_, idx) => {
      const el = document.getElementById(`immersive-section-${idx}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(idx); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [sortedSections]);

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen font-sans bg-white text-black overflow-y-auto"
    >
      {/* Chapter navigation bar — fixed top */}
      <ChapterNavbar chapters={chapters} onChapterClick={scrollToSection} activeIndex={activeIndex} />

      {/* Side progress dots — fixed right */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-center">
        {sortedSections.map((_, idx) => (
          <button key={idx} onClick={() => scrollToSection(idx)}
            className={cn("transition-all duration-500 rounded-full",
              idx === activeIndex ? "w-3 h-3 bg-[#F97316] shadow-lg shadow-[#F97316]/30" : "w-2 h-2 bg-slate-300 hover:bg-slate-400")} />
        ))}
      </div>

      {/* Floating bottom nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl px-5 py-3 rounded-full">
          <button onClick={() => scrollToSection(activeIndex - 1)} disabled={activeIndex === 0}
            className={cn("p-1.5 rounded-full transition-colors", activeIndex === 0 ? "text-slate-300 cursor-not-allowed" : "text-black hover:bg-slate-100")}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-500 font-medium min-w-[60px] text-center">
            {activeIndex + 1} / {sortedSections.length}
          </span>
          <button onClick={() => scrollToSection(activeIndex + 1)} disabled={activeIndex === sortedSections.length - 1}
            className={cn("p-1.5 rounded-full transition-colors", activeIndex === sortedSections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-black hover:bg-slate-100")}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Sections — min-h-screen, snap for short, free scroll for tall */}
      {sortedSections.map((section, idx) => (
        <div
          key={section.id}
          id={`immersive-section-${idx}`}
          data-index={idx}
          data-active={idx === activeIndex}
        >
          <ImmersiveSection
            section={section}
            index={idx}
            sessionId={sessionId}
            quizData={quizData}
            onQuizPassed={onQuizPassed}
            isActive={idx === activeIndex}
          />
        </div>
      ))}
    </main>
  );
}
