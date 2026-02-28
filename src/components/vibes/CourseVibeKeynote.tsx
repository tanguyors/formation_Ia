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
      <div className="bg-white border border-green-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-4 bg-green-50 border-b border-green-100">
          <Trophy size={20} className="text-green-600" />
          <span className="text-green-700 font-bold uppercase tracking-widest text-sm">Quiz validé</span>
        </div>
        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <p className="text-xl text-black font-bold mb-2">Module validé avec succès !</p>
          <p className="text-slate-500">Vous avez répondu correctement à toutes les questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-3 px-8 py-4 bg-[#F97316]/5 border-b border-[#F97316]/10">
        <HelpCircle size={20} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Quiz de validation</span>
        <span className="ml-auto text-slate-400 text-xs">{Object.keys(selectedAnswers).length}/{questions.length} répondues</span>
      </div>

      {results && score && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className={cn("px-8 py-4 border-b flex items-center justify-between", passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
          <div className="flex items-center gap-3">
            {passed ? <Trophy size={24} className="text-green-600" /> : <XCircle size={24} className="text-red-500" />}
            <div>
              <p className={cn("font-bold text-lg", passed ? "text-green-700" : "text-red-600")}>{passed ? 'Quiz réussi !' : 'Quiz échoué'}</p>
              <p className="text-slate-500 text-sm">Score : {score.score}/{score.total}</p>
            </div>
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-sm font-bold">
              <RotateCcw size={14} /> Réessayer
            </button>
          )}
        </motion.div>
      )}

      <div className="p-8 space-y-8">
        {questions.map((question, qIndex) => {
          const result = results?.find(r => r.questionId === question.id);
          return (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  result ? (result.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500") : "bg-[#F97316]/10 text-[#F97316]")}>
                  {result ? (result.isCorrect ? <Check size={16} /> : <XCircle size={16} />) : qIndex + 1}
                </div>
                <p className="text-lg text-black font-bold leading-relaxed flex-1">{question.questionText}</p>
              </div>
              <div className="grid gap-2 pl-12">
                {question.options.map(option => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  const isCorrectOption = result?.correctOptionId === option.id;
                  const isWrongSelection = result && isSelected && !result.isCorrect;
                  let style = 'border-slate-200 hover:border-[#F97316]/30 hover:bg-orange-50/50';
                  if (result) {
                    if (isCorrectOption) style = 'border-green-300 bg-green-50';
                    else if (isWrongSelection) style = 'border-red-300 bg-red-50';
                    else style = 'border-slate-100 opacity-50';
                  } else if (isSelected) style = 'border-[#F97316] bg-[#F97316]/5';
                  return (
                    <button key={option.id} onClick={() => handleSelect(question.id, option.id)} disabled={!!results}
                      className={cn("w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4", style, !results && "cursor-pointer")}>
                      <div className={cn("shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        result ? (isCorrectOption ? "border-green-500 bg-green-500" : isWrongSelection ? "border-red-500 bg-red-500" : "border-slate-200")
                          : isSelected ? "border-[#F97316] bg-[#F97316]" : "border-slate-300")}>
                        {(isSelected || (result && isCorrectOption)) && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={cn("text-base leading-relaxed flex-1",
                        result ? (isCorrectOption ? "text-green-700 font-bold" : isWrongSelection ? "text-red-500 line-through" : "text-slate-400")
                          : isSelected ? "text-black" : "text-slate-600")}>{option.optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!results && (
        <div className="px-8 pb-8">
          <button onClick={handleSubmit} disabled={!allAnswered || submitting}
            className={cn("w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3",
              allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Vérification...</> : <><Check size={18} /> Valider mes réponses ({Object.keys(selectedAnswers).length}/{questions.length})</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Keynote Section Content ─────────────────────────────────

function KeynoteSlide({ section, sessionId, quizData, onQuizPassed, onCopy, copied }: {
  section: Section; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void; onCopy: (t: string) => void; copied: boolean;
}) {
  const mdComponents = {
    h1: ({ children }: any) => <h1 className="text-4xl md:text-6xl font-sans font-black text-black mb-6 leading-tight">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-5xl font-sans font-bold text-black mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-sans font-bold text-slate-700 mb-3">{children}</h3>,
    p: ({ children }: any) => <p className="text-2xl font-sans leading-relaxed text-slate-700 mb-4">{children}</p>,
    strong: ({ children }: any) => <strong className="text-[#F97316] font-extrabold">{children}</strong>,
    ul: ({ children }: any) => <ul className="space-y-3 my-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="space-y-3 my-4">{children}</ol>,
    li: ({ children }: any) => (
      <li className="flex items-start gap-3 text-xl text-slate-700">
        <span className="mt-2 shrink-0 w-2 h-2 rounded-full bg-[#F97316]" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    code: ({ children }: any) => <code className="bg-slate-100 text-[#F97316] px-2 py-0.5 rounded text-lg font-mono">{children}</code>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[#F97316] pl-6 my-6 text-xl italic text-slate-500">{children}</blockquote>,
    table: ({ children }: any) => <div className="overflow-x-auto my-6 rounded-xl border border-slate-200"><table className="w-full text-left">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
    th: ({ children }: any) => <th className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#F97316]">{children}</th>,
    tr: ({ children }: any) => <tr className="border-b border-slate-100 last:border-0">{children}</tr>,
    td: ({ children }: any) => <td className="px-6 py-3 text-base text-slate-600">{children}</td>,
  };

  switch (section.type) {
    case 'code':
      return (
        <div className="bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50 bg-[#0F172A]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-slate-500 text-xs uppercase tracking-widest">{section.codeLanguage || 'code'}</span>
            <button onClick={() => onCopy(section.content)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
          <pre className="p-8 text-lg overflow-x-auto text-slate-200 leading-relaxed font-mono">
            <code>{section.content}</code>
          </pre>
        </div>
      );

    case 'exercise':
      return (
        <div className="bg-white border-2 border-[#F97316]/20 rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center gap-3 px-8 py-4 bg-[#F97316] text-white">
            <Gamepad2 size={20} />
            <span className="font-bold uppercase tracking-widest text-sm">Exercice Pratique</span>
          </div>
          <div className="p-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
          </div>
        </div>
      );

    case 'tip':
      return (
        <div className="border-l-4 border-[#F97316] bg-orange-50 rounded-r-2xl p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={24} className="text-[#F97316]" />
            <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Astuce</span>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
        </div>
      );

    case 'warning':
      return (
        <div className="border-l-4 border-red-500 bg-red-50 rounded-r-2xl p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-red-500" />
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Attention</span>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            ...mdComponents,
            p: ({ children }: any) => <p className="text-xl font-sans leading-relaxed text-red-900/80 mb-3">{children}</p>,
            strong: ({ children }: any) => <strong className="text-red-600 font-bold">{children}</strong>,
          }}>{section.content}</ReactMarkdown>
        </div>
      );

    case 'quiz':
      if (quizData?.hasQuiz && quizData.questions.length > 0 && sessionId) {
        return (
          <div className="max-w-4xl mx-auto">
            <InteractiveQuiz
              questions={quizData.questions.filter(q => q.sectionId === section.id)}
              sessionId={sessionId}
              alreadyPassed={quizData.alreadyPassed}
              onQuizPassed={onQuizPassed || (() => {})}
            />
          </div>
        );
      }
      return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-4xl mx-auto">
          <HelpCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Quiz en cours de chargement...</p>
        </div>
      );

    default:
      return (
        <div className="max-w-4xl mx-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{section.content}</ReactMarkdown>
        </div>
      );
  }
}

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
  const progress = ((currentIndex + 1) / sortedSections.length) * 100;

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

  const typeLabels: Record<Section['type'], string> = {
    text: 'Contenu', code: 'Code', exercise: 'Exercice', tip: 'Astuce', warning: 'Attention', quiz: 'Quiz',
  };

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans bg-white text-black">
      {/* Full-screen slide area */}
      <div className="h-full flex flex-col">
        {/* Top bar — subtle */}
        <div className="shrink-0 flex items-center justify-between px-8 py-4">
          <span className="text-sm text-slate-400 font-medium">
            {currentSection.title || typeLabels[currentSection.type]}
          </span>
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {sortedSections.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="shrink-0 h-0.5 bg-slate-100 mx-8">
          <motion.div className="h-full bg-[#F97316]" animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }} />
        </div>

        {/* Slide content — centered */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-20 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentSection.id}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full">
              {/* Title */}
              {currentSection.title && (
                <h1 className="text-4xl md:text-7xl font-sans font-black text-black mb-10 leading-[1.1] max-w-4xl mx-auto">
                  {currentSection.title}
                </h1>
              )}
              <KeynoteSlide section={currentSection} sessionId={sessionId} quizData={quizData}
                onQuizPassed={onQuizPassed} onCopy={handleCopy} copied={copied} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating nav pill at bottom */}
        <div className="shrink-0 flex justify-center pb-8">
          <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-xl px-5 py-3 rounded-full">
            <button onClick={handlePrev} disabled={currentIndex === 0}
              className={cn("p-2 rounded-full transition-colors", currentIndex === 0 ? "text-slate-300 cursor-not-allowed" : "text-black hover:bg-slate-100")}>
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1.5 px-2">
              {sortedSections.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)}
                  className={cn("h-2 rounded-full transition-all duration-300",
                    idx === currentIndex ? "w-8 bg-[#F97316]" : "w-2 bg-slate-200 hover:bg-slate-400")} />
              ))}
            </div>

            <button onClick={handleNext} disabled={currentIndex === sortedSections.length - 1}
              className={cn("p-2 rounded-full transition-colors",
                currentIndex === sortedSections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-black hover:bg-slate-100")}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
