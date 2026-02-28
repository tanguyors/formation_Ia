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
  FileCode,
  List,
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
      <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 bg-green-50 border-b border-green-100">
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3 bg-[#F97316]/5 border-b border-[#F97316]/10">
        <HelpCircle size={18} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold text-sm">Quiz de validation</span>
        <span className="ml-auto text-slate-400 text-xs">{Object.keys(selectedAnswers).length}/{questions.length}</span>
      </div>

      {results && score && (
        <div className={cn("px-6 py-3 border-b flex items-center justify-between", passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
          <div className="flex items-center gap-2">
            {passed ? <Trophy size={18} className="text-green-600" /> : <XCircle size={18} className="text-red-500" />}
            <span className={cn("font-bold text-sm", passed ? "text-green-700" : "text-red-600")}>{passed ? 'Réussi !' : 'Échoué'} — {score.score}/{score.total}</span>
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
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
        <div className="px-6 pb-6">
          <button onClick={handleSubmit} disabled={!allAnswered || submitting}
            className={cn("w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
              allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c]" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Vérification...</> : <><Check size={16} /> Valider</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Section Type Icons ──────────────────────────────────────

const typeIcon: Record<Section['type'], React.ReactNode> = {
  text: <BookOpen size={14} />,
  code: <Terminal size={14} />,
  exercise: <Gamepad2 size={14} />,
  tip: <Lightbulb size={14} />,
  warning: <AlertTriangle size={14} />,
  quiz: <HelpCircle size={14} />,
};

const typeLabels: Record<Section['type'], string> = {
  text: 'Contenu', code: 'Code', exercise: 'Exercice', tip: 'Astuce', warning: 'Attention', quiz: 'Quiz',
};

// ── MD Components (light theme) ─────────────────────────────

const mdComponents = {
  h1: ({ children }: any) => <h1 className="text-3xl font-sans font-black text-black mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-2xl font-sans font-bold text-black mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-xl font-sans font-bold text-slate-700 mb-2">{children}</h3>,
  p: ({ children }: any) => <p className="text-base font-sans leading-relaxed text-slate-700 mb-3">{children}</p>,
  strong: ({ children }: any) => <strong className="text-[#F97316] font-bold">{children}</strong>,
  ul: ({ children }: any) => <ul className="space-y-2 my-3">{children}</ul>,
  ol: ({ children }: any) => <ol className="space-y-2 my-3">{children}</ol>,
  li: ({ children }: any) => (
    <li className="flex items-start gap-2 text-base text-slate-700">
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

  // Determine right-panel content
  const isCodeSection = currentSection.type === 'code';

  // ── Left panel content renderer ───────────────────────────

  const renderLeftContent = () => {
    switch (currentSection.type) {
      case 'code':
        return (
          <div>
            {currentSection.title && <h2 className="text-2xl font-sans font-bold text-black mb-4">{currentSection.title}</h2>}
            <p className="text-slate-500 text-sm">Le code est affiché dans le panneau de droite.</p>
            <p className="text-slate-400 text-xs mt-2">Langage : {currentSection.codeLanguage || 'non spécifié'}</p>
          </div>
        );
      case 'exercise':
        return (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 size={20} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Exercice Pratique</span>
            </div>
            {currentSection.title && <h2 className="text-2xl font-sans font-bold text-black mb-4">{currentSection.title}</h2>}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{currentSection.content}</ReactMarkdown>
          </div>
        );
      case 'tip':
        return (
          <div className="border-l-4 border-[#F97316] pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-[#F97316]" />
              <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Astuce</span>
            </div>
            {currentSection.title && <h2 className="text-xl font-sans font-bold text-black mb-3">{currentSection.title}</h2>}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{currentSection.content}</ReactMarkdown>
          </div>
        );
      case 'warning':
        return (
          <div className="border-l-4 border-red-500 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-red-500" />
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Attention</span>
            </div>
            {currentSection.title && <h2 className="text-xl font-sans font-bold text-black mb-3">{currentSection.title}</h2>}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              ...mdComponents,
              p: ({ children }: any) => <p className="text-base font-sans leading-relaxed text-red-800/80 mb-3">{children}</p>,
              strong: ({ children }: any) => <strong className="text-red-600 font-bold">{children}</strong>,
            }}>{currentSection.content}</ReactMarkdown>
          </div>
        );
      case 'quiz':
        if (quizData?.hasQuiz && quizData.questions.length > 0 && sessionId) {
          return (
            <InteractiveQuiz
              questions={quizData.questions.filter(q => q.sectionId === currentSection.id)}
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
        return (
          <div>
            {currentSection.title && <h2 className="text-2xl font-sans font-bold text-black mb-4">{currentSection.title}</h2>}
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{currentSection.content}</ReactMarkdown>
          </div>
        );
    }
  };

  return (
    <main className="h-screen w-full flex flex-col font-sans bg-white text-black overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0}
            className={cn("p-1.5 rounded-lg transition-colors", currentIndex === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100")}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-500 font-medium">{currentIndex + 1} / {sortedSections.length}</span>
          <button onClick={handleNext} disabled={currentIndex === sortedSections.length - 1}
            className={cn("p-1.5 rounded-lg transition-colors", currentIndex === sortedSections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100")}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#F97316] rounded-full" animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }} />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {typeIcon[currentSection.type]}
          <span>{typeLabels[currentSection.type]}</span>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Content (60%) */}
        <div className="w-[60%] overflow-y-auto p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div key={currentSection.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}>
              {renderLeftContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px bg-slate-200" />

        {/* Right — Code / Outline (40%) */}
        <div className="w-[40%] bg-[#0F172A] flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {isCodeSection ? (
              <motion.div key={`code-${currentSection.id}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col h-full">
                {/* Code top bar */}
                <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-slate-500 text-xs uppercase tracking-widest">{currentSection.codeLanguage || 'code'}</span>
                  </div>
                  <button onClick={() => handleCopy(currentSection.content)} className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-all">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <pre className="flex-1 overflow-auto p-6 text-sm text-slate-200 leading-relaxed font-mono">
                  <code>{currentSection.content}</code>
                </pre>
              </motion.div>
            ) : (
              <motion.div key="outline"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col h-full">
                {/* Outline header */}
                <div className="shrink-0 flex items-center gap-2 px-5 py-3 border-b border-slate-700/50">
                  <List size={14} className="text-slate-500" />
                  <span className="text-slate-400 text-xs uppercase tracking-widest">Plan du cours</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {sortedSections.map((s, idx) => (
                    <button key={s.id} onClick={() => setCurrentIndex(idx)}
                      className={cn("w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all text-sm",
                        idx === currentIndex ? "bg-[#F97316]/10 text-[#F97316]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5")}>
                      <span className={cn("shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                        idx === currentIndex ? "bg-[#F97316] text-white" : "bg-slate-700 text-slate-400")}>{idx + 1}</span>
                      <span className="truncate">{s.title || typeLabels[s.type]}</span>
                      <span className="ml-auto shrink-0">{typeIcon[s.type]}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
