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
import { useTheme } from '@/hooks/useTheme';

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
      <div className="border rounded-2xl shadow-sm overflow-hidden" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-green-border)' }}>
        <div className="flex items-center gap-2 px-6 py-3 border-b" style={{ background: 'var(--cx-green-bg)', borderColor: 'var(--cx-green-border)' }}>
          <Trophy size={18} style={{ color: 'var(--cx-green)' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--cx-green)' }}>Quiz validé</span>
        </div>
        <div className="p-6 text-center">
          <CheckCircle2 size={32} style={{ color: 'var(--cx-green)' }} className="mx-auto mb-2" />
          <p className="font-bold" style={{ color: 'var(--cx-text)' }}>Module validé avec succès !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl shadow-sm overflow-hidden" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)' }}>
      <div className="flex items-center gap-2 px-6 py-3 border-b" style={{ background: 'var(--cx-accent-bg)', borderColor: 'var(--cx-accent-border)' }}>
        <HelpCircle size={18} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold text-sm">Quiz de validation</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--cx-text-muted)' }}>{Object.keys(selectedAnswers).length}/{questions.length}</span>
      </div>

      {results && score && (
        <div className={cn("px-6 py-3 border-b flex items-center justify-between", passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
          <div className="flex items-center gap-2">
            {passed ? <Trophy size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
            <span className={cn("font-bold text-sm", passed ? "text-green-700" : "text-red-600")}>{passed ? 'Réussi' : 'Échoué'} — {score.score}/{score.total}</span>
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--cx-text-muted)' }}>
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
              <p className="text-sm font-bold" style={{ color: 'var(--cx-text)' }}>{qIndex + 1}. {question.questionText}</p>
              <div className="grid gap-2">
                {question.options.map(option => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  const isCorrectOption = result?.correctOptionId === option.id;
                  const isWrongSelection = result && isSelected && !result.isCorrect;
                  let style = 'hover:border-[#F97316]/30';
                  let inlineStyle: React.CSSProperties = { borderColor: 'var(--cx-border)' };
                  if (result) {
                    if (isCorrectOption) { style = 'border-green-300'; inlineStyle = { background: 'var(--cx-green-bg)', borderColor: 'var(--cx-green-border)' }; }
                    else if (isWrongSelection) { style = 'border-red-300 bg-red-50'; inlineStyle = {}; }
                    else { style = 'opacity-50'; inlineStyle = { borderColor: 'var(--cx-border)' }; }
                  } else if (isSelected) { style = 'border-[#F97316]'; inlineStyle = { background: 'var(--cx-accent-bg)' }; }
                  return (
                    <button key={option.id} onClick={() => handleSelect(question.id, option.id)} disabled={!!results}
                      className={cn("w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center gap-3", style, !results && "cursor-pointer")}
                      style={inlineStyle}>
                      <div className={cn("shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        result ? (isCorrectOption ? "border-green-500 bg-green-500" : isWrongSelection ? "border-red-500 bg-red-500" : "border-slate-200")
                          : isSelected ? "border-[#F97316] bg-[#F97316]" : "border-slate-300")}>
                        {(isSelected || (result && isCorrectOption)) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn(result ? (isCorrectOption ? "font-bold" : isWrongSelection ? "text-red-500 line-through" : "opacity-50") : "")}
                        style={{ color: result ? (isCorrectOption ? 'var(--cx-green)' : undefined) : isSelected ? 'var(--cx-text)' : 'var(--cx-text-secondary)' }}>
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
              allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c]" : "cursor-not-allowed")}
            style={!allAnswered ? { background: 'var(--cx-bg-alt)', color: 'var(--cx-text-muted)' } : undefined}>
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

function ImmersiveSection({ section, index, sessionId, quizData, onQuizPassed, isActive, dark }: {
  section: Section; index: number; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void;
  isActive: boolean; dark: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mdComponents = {
    h1: ({ children }: any) => <h1 className="text-3xl md:text-4xl font-sans font-black mb-5" style={{ color: 'var(--cx-text)' }}>{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl md:text-3xl font-sans font-bold mb-4" style={{ color: 'var(--cx-text)' }}>{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-sans font-bold mb-3" style={{ color: 'var(--cx-text-secondary)' }}>{children}</h3>,
    p: ({ children }: any) => <p className="text-lg font-sans leading-relaxed mb-4" style={{ color: 'var(--cx-text-secondary)' }}>{children}</p>,
    strong: ({ children }: any) => <strong className="text-[#F97316] font-bold">{children}</strong>,
    ul: ({ children }: any) => <ul className="space-y-2 my-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="space-y-2 my-4">{children}</ol>,
    li: ({ children }: any) => (
      <li className="flex items-start gap-3 text-lg" style={{ color: 'var(--cx-text-secondary)' }}>
        <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    code: ({ children }: any) => <code className="text-[#F97316] px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--cx-bg-alt)' }}>{children}</code>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[#F97316] pl-5 my-5 text-lg italic" style={{ color: 'var(--cx-text-muted)' }}>{children}</blockquote>,
    img: ({ src, alt }: any) => (
      <span className="block my-8 text-center">
        <img src={src} alt={alt || ''} className="inline-block rounded-2xl shadow-lg max-w-full h-auto max-h-[500px] object-contain" />
      </span>
    ),
    table: ({ children }: any) => <div className="overflow-x-auto my-5 rounded-xl border" style={{ borderColor: 'var(--cx-border)' }}><table className="w-full text-left">{children}</table></div>,
    thead: ({ children }: any) => <thead className="border-b" style={{ background: 'var(--cx-bg-alt)', borderColor: 'var(--cx-border)' }}>{children}</thead>,
    th: ({ children }: any) => <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#F97316]">{children}</th>,
    tr: ({ children }: any) => <tr className="border-b last:border-0" style={{ borderColor: 'var(--cx-border)' }}>{children}</tr>,
    td: ({ children }: any) => <td className="px-5 py-3 text-sm" style={{ color: 'var(--cx-text-secondary)' }}>{children}</td>,
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
          <div className="border-2 border-[#F97316]/20 rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--cx-surface)' }}>
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
          <div className="border-l-4 border-[#F97316] rounded-r-2xl p-6" style={{ background: dark ? 'rgba(249,115,22,0.08)' : 'rgba(255,237,213,0.5)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Astuce</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
          </div>
        );

      case 'warning':
        return (
          <div className="border-l-4 border-red-500 rounded-r-2xl p-6" style={{ background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(254,242,242,0.5)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-red-500" />
              <span className={cn("font-bold uppercase tracking-widest text-sm", dark ? "text-red-400" : "text-red-600")}>Attention</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              ...mdComponents,
              p: ({ children }: any) => <p className={cn("text-lg font-sans leading-relaxed mb-3", dark ? "text-red-300/70" : "text-red-800/70")}>{children}</p>,
              strong: ({ children }: any) => <strong className={cn("font-bold", dark ? "text-red-400" : "text-red-600")}>{children}</strong>,
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
            <HelpCircle size={40} className="mx-auto mb-3" style={{ color: 'var(--cx-text-muted)' }} />
            <p style={{ color: 'var(--cx-text-muted)' }}>Quiz en cours de chargement...</p>
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
            className="text-3xl md:text-5xl font-sans font-black mb-8"
            style={{ color: 'var(--cx-text)' }}
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

function ChapterNavbar({ chapters, onChapterClick, activeIndex, dark }: {
  chapters: ChapterInfo[];
  onChapterClick: (index: number) => void;
  activeIndex: number;
  dark: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // Auto-scroll active chapter into view
  useEffect(() => {
    if (isDragging.current) return;
    const activeElement = scrollContainerRef.current?.querySelector('[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  // Drag-to-scroll handlers
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      if (Math.abs(walk) > 3) hasDragged.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (chapters.length <= 1) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-[50vw]">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center backdrop-blur-md border rounded-full shadow-lg p-1 overflow-hidden"
        style={{ background: dark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)', borderColor: 'var(--cx-border)' }}
      >
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto px-1 py-0.5 [&::-webkit-scrollbar]:hidden cursor-grab"
          style={{ scrollbarWidth: 'none' }}
        >
          {chapters.map((chapter, idx) => {
            const isCompleted = !chapter.isActive && activeIndex > chapter.index;
            const isCurrent = chapter.isActive;
            const chapterNumber = (idx + 1).toString().padStart(2, '0');

            return (
              <button
                key={chapter.index}
                onClick={() => { if (!hasDragged.current) onChapterClick(chapter.index); }}
                data-active={isCurrent}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 group",
                  isCurrent
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-200"
                    : isCompleted
                      ? "text-[#F97316]"
                      : "bg-transparent"
                )}
                style={!isCurrent ? {
                  background: isCompleted ? 'var(--cx-accent-bg)' : undefined,
                  color: isCompleted ? undefined : 'var(--cx-text-secondary)'
                } : undefined}
              >
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <Check className={cn("w-3 h-3", isCurrent ? "text-white" : "text-[#F97316]")} strokeWidth={3} />
                  ) : (
                    <span className={cn("text-[10px] font-bold", isCurrent ? "text-orange-100" : "")} style={!isCurrent ? { color: 'var(--cx-text-muted)' } : undefined}>
                      {chapterNumber}
                    </span>
                  )}
                </div>
                <span className={cn("text-[11px] font-medium tracking-tight", isCurrent ? "text-white" : "")} style={!isCurrent ? { color: 'var(--cx-text)' } : undefined}>
                  {chapter.title.length > 18 ? chapter.title.slice(0, 16) + '…' : chapter.title}
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
  const { dark } = useTheme();

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
      className="relative w-full h-screen font-sans overflow-y-auto"
      style={{ background: 'var(--cx-bg)', color: 'var(--cx-text)' }}
    >
      {/* Chapter navigation bar — fixed top */}
      <ChapterNavbar chapters={chapters} onChapterClick={scrollToSection} activeIndex={activeIndex} dark={dark} />

      {/* Side progress dots — fixed right */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-center">
        {sortedSections.map((_, idx) => (
          <button key={idx} onClick={() => scrollToSection(idx)}
            className={cn("transition-all duration-500 rounded-full",
              idx === activeIndex ? "w-3 h-3 bg-[#F97316] shadow-lg shadow-[#F97316]/30" : "w-2 h-2")}
            style={idx !== activeIndex ? { background: 'var(--cx-text-muted)' } : undefined} />
        ))}
      </div>

      {/* Floating bottom nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 backdrop-blur-xl border shadow-xl px-5 py-3 rounded-full" style={{ background: dark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)', borderColor: 'var(--cx-border)' }}>
          <button onClick={() => scrollToSection(activeIndex - 1)} disabled={activeIndex === 0}
            className={cn("p-1.5 rounded-full transition-colors", activeIndex === 0 ? "cursor-not-allowed" : "")}
            style={{ color: activeIndex === 0 ? 'var(--cx-text-muted)' : 'var(--cx-text)' }}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium min-w-[60px] text-center" style={{ color: 'var(--cx-text-muted)' }}>
            {activeIndex + 1} / {sortedSections.length}
          </span>
          <button onClick={() => scrollToSection(activeIndex + 1)} disabled={activeIndex === sortedSections.length - 1}
            className={cn("p-1.5 rounded-full transition-colors", activeIndex === sortedSections.length - 1 ? "cursor-not-allowed" : "")}
            style={{ color: activeIndex === sortedSections.length - 1 ? 'var(--cx-text-muted)' : 'var(--cx-text)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

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
            dark={dark}
          />
        </div>
      ))}
    </main>
  );
}
