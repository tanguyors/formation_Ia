'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
      <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50/50">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-green-100">
          <Trophy size={16} className="text-green-600" />
          <span className="text-green-700 font-bold text-sm">Quiz validé</span>
        </div>
        <div className="p-5 text-center">
          <CheckCircle2 size={28} className="text-green-500 mx-auto mb-2" />
          <p className="text-black font-bold text-sm">Module validé avec succès !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-[#F97316]/5 border-b border-[#F97316]/10">
        <HelpCircle size={16} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold text-sm">Quiz de validation</span>
        <span className="ml-auto text-slate-400 text-xs">{Object.keys(selectedAnswers).length}/{questions.length}</span>
      </div>

      {results && score && (
        <div className={cn("px-5 py-3 border-b flex items-center justify-between", passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
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

      <div className="p-5 space-y-5">
        {questions.map((question, qIndex) => {
          const result = results?.find(r => r.questionId === question.id);
          return (
            <div key={question.id} className="space-y-2">
              <p className="text-sm text-black font-bold">{qIndex + 1}. {question.questionText}</p>
              <div className="grid gap-1.5">
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
                      className={cn("w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-3", style, !results && "cursor-pointer")}>
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
        <div className="px-5 pb-5">
          <button onClick={handleSubmit} disabled={!allAnswered || submitting}
            className={cn("w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
              allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c]" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Vérification...</> : <><Check size={14} /> Valider</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────

const typeLabels: Record<Section['type'], string> = {
  text: 'Contenu', code: 'Code', exercise: 'Exercice', tip: 'Astuce', warning: 'Attention', quiz: 'Quiz',
};

const typeColors: Record<Section['type'], string> = {
  text: 'bg-slate-100 text-slate-600',
  code: 'bg-[#0F172A] text-slate-200',
  exercise: 'bg-[#F97316]/10 text-[#F97316]',
  tip: 'bg-amber-50 text-amber-600',
  warning: 'bg-red-50 text-red-600',
  quiz: 'bg-purple-50 text-purple-600',
};

const typeIcons: Record<Section['type'], React.ReactNode> = {
  text: <BookOpen size={12} />,
  code: <Terminal size={12} />,
  exercise: <Gamepad2 size={12} />,
  tip: <Lightbulb size={12} />,
  warning: <AlertTriangle size={12} />,
  quiz: <HelpCircle size={12} />,
};

const mdComponents = {
  h1: ({ children }: any) => <h1 className="text-2xl font-sans font-black text-black mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-sans font-bold text-black mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-sans font-bold text-slate-700 mb-2">{children}</h3>,
  p: ({ children }: any) => <p className="text-base font-sans leading-relaxed text-slate-600 mb-3">{children}</p>,
  strong: ({ children }: any) => <strong className="text-[#F97316] font-bold">{children}</strong>,
  ul: ({ children }: any) => <ul className="space-y-2 my-3">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-2 my-3">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex items-start gap-2 text-base text-slate-600">
      <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  code: ({ children }: any) => <code className="bg-slate-100 text-[#F97316] px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
  blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[#F97316] pl-4 my-4 text-base italic text-slate-500">{children}</blockquote>,
  table: ({ children }: any) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-200"><table className="w-full text-left text-sm">{children}</table></div>,
  thead: ({ children }: any) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
  th: ({ children }: any) => <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F97316]">{children}</th>,
  tr: ({ children }: any) => <tr className="border-b border-slate-100 last:border-0">{children}</tr>,
  td: ({ children }: any) => <td className="px-4 py-2 text-sm text-slate-600">{children}</td>,
};

// ── Main Export ──────────────────────────────────────────────

export function SectionRendererV2({
  sections, sessionId, quizData, onQuizPassed,
}: {
  sections: Section[]; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  const currentSection = sortedSections[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < sortedSections.length - 1) setCurrentIndex(i => i + 1);
  }, [currentIndex, sortedSections.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev]);

  if (!currentSection) return null;

  // ── Card content renderer ─────────────────────────────────

  const renderCardContent = (section: Section) => {
    switch (section.type) {
      case 'code':
        return (
          <div className="bg-[#0F172A] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-slate-500 text-xs">{section.codeLanguage || 'code'}</span>
              </div>
              <button onClick={() => handleCopy(section.content)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-all">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-5 text-sm overflow-x-auto text-slate-200 leading-relaxed font-mono">
              <code>{section.content}</code>
            </pre>
          </div>
        );

      case 'exercise':
        return (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F97316]/10">
              <Gamepad2 size={18} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Exercice Pratique</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
          </div>
        );

      case 'tip':
        return (
          <div className="border-l-4 border-[#F97316] pl-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Astuce</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
          </div>
        );

      case 'warning':
        return (
          <div className="border-l-4 border-red-500 pl-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-red-500" />
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Attention</span>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              ...mdComponents,
              p: ({ children }: any) => <p className="text-base font-sans leading-relaxed text-red-800/70 mb-3">{children}</p>,
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
          <div className="text-center py-6">
            <HelpCircle size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Quiz en cours de chargement...</p>
          </div>
        );

      default:
        return <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>;
    }
  };

  return (
    <main className="h-screen w-full flex flex-col font-sans bg-slate-50 text-black overflow-hidden">
      {/* Card stack area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative">
        {/* Background cards (2 behind) */}
        {[2, 1].map(offset => {
          const behindIndex = currentIndex + offset;
          if (behindIndex >= sortedSections.length) return null;
          return (
            <div key={`behind-${offset}`}
              className="absolute max-w-3xl w-full rounded-2xl bg-white border border-slate-200"
              style={{
                transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.04})`,
                opacity: 1 - offset * 0.3,
                zIndex: 10 - offset,
                height: '70vh',
              }}
            />
          );
        })}

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentSection.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
            style={{ maxHeight: '70vh' }}
          >
            {/* Card type badge — top-left */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", typeColors[currentSection.type])}>
                {typeIcons[currentSection.type]}
                {typeLabels[currentSection.type]}
              </div>
              {currentSection.title && (
                <span className="text-sm text-slate-400 font-medium truncate ml-4">{currentSection.title}</span>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {currentSection.title && (
                <h2 className="text-2xl md:text-3xl font-sans font-black text-black mb-6">{currentSection.title}</h2>
              )}
              {renderCardContent(currentSection)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav bar */}
      <div className="shrink-0 flex items-center justify-center gap-4 px-8 py-5 bg-white border-t border-slate-200">
        <button onClick={handlePrev} disabled={currentIndex === 0}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
            currentIndex === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100")}>
          <ChevronLeft size={18} /> Précédent
        </button>

        <div className="flex items-center gap-2">
          {sortedSections.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)}
              className={cn("h-2 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-8 bg-[#F97316]" : "w-2 bg-slate-200 hover:bg-slate-400")} />
          ))}
        </div>

        <button onClick={handleNext} disabled={currentIndex === sortedSections.length - 1}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
            currentIndex === sortedSections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100")}>
          Suivant <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}
