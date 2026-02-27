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
  Command,
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Loader2
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

interface QuizOption {
  id: string;
  optionText: string;
  sortOrder: number;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  sortOrder: number;
  sectionId: string;
  options: QuizOption[];
}

interface QuizResult {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
}

interface QuizData {
  questions: QuizQuestion[];
  hasQuiz: boolean;
  alreadyPassed: boolean;
}

const TypingTitle = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2 mb-8">
      <motion.h1
        className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-white uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {text}
      </motion.h1>
      <motion.div
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
        className="w-4 h-10 md:w-6 md:h-14 bg-[#F97316] shadow-[0_0_15px_rgba(217,119,87,0.6)]"
      />
    </div>
  );
};

const TerminalBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#1C1917]" />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#F97316 1px, transparent 1px), linear-gradient(90deg, #F97316 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
    <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
  </div>
);

// Interactive Quiz Component
function InteractiveQuiz({
  questions,
  sessionId,
  alreadyPassed,
  onQuizPassed,
}: {
  questions: QuizQuestion[];
  sessionId: string;
  alreadyPassed: boolean;
  onQuizPassed: () => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passed, setPassed] = useState(alreadyPassed);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);

  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (results) return; // Can't change after submit
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

      if (data.passed) {
        onQuizPassed();
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResults(null);
    setScore(null);
  };

  if (passed && !results) {
    return (
      <div className="bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-4 bg-green-500/10 border-b border-green-500/20">
          <Trophy size={20} className="text-green-400" />
          <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Quiz validé</span>
        </div>
        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <p className="text-xl text-white font-bold mb-2">Module validé avec succès !</p>
          <p className="text-slate-400">Vous avez répondu correctement à toutes les questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-[#F97316]/30 rounded-2xl shadow-2xl overflow-hidden">
      {/* Quiz Header */}
      <div className="flex items-center gap-3 px-8 py-4 bg-[#F97316]/10 border-b border-[#F97316]/20">
        <HelpCircle size={20} className="text-[#F97316]" />
        <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Quiz de validation</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-500 text-xs">
            {Object.keys(selectedAnswers).length}/{questions.length} répondues
          </span>
        </div>
      </div>

      {/* Results Banner */}
      {results && score && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            "px-8 py-4 border-b flex items-center justify-between",
            passed
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          )}
        >
          <div className="flex items-center gap-3">
            {passed ? (
              <Trophy size={24} className="text-green-400" />
            ) : (
              <XCircle size={24} className="text-red-400" />
            )}
            <div>
              <p className={cn("font-bold text-lg", passed ? "text-green-400" : "text-red-400")}>
                {passed ? "Quiz réussi !" : "Quiz échoué"}
              </p>
              <p className="text-slate-400 text-sm">
                Score : {score.score}/{score.total} — {passed ? "Toutes les réponses sont correctes !" : "Vous devez avoir tout juste pour valider."}
              </p>
            </div>
          </div>
          {!passed && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-all text-sm font-bold"
            >
              <RotateCcw size={14} />
              Réessayer
            </button>
          )}
        </motion.div>
      )}

      {/* Questions */}
      <div className="p-8 space-y-8">
        {questions.map((question, qIndex) => {
          const result = results?.find(r => r.questionId === question.id);

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Question Text */}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  result
                    ? result.isCorrect
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30"
                )}>
                  {result ? (
                    result.isCorrect ? <Check size={16} /> : <XCircle size={16} />
                  ) : (
                    qIndex + 1
                  )}
                </div>
                <p className="text-lg text-white font-bold leading-relaxed flex-1">
                  {question.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="grid gap-2 pl-12">
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[question.id] === option.id;
                  const isCorrectOption = result?.correctOptionId === option.id;
                  const isWrongSelection = result && isSelected && !result.isCorrect;

                  let optionStyle = "border-white/10 hover:border-[#F97316]/30 hover:bg-white/5";
                  if (result) {
                    if (isCorrectOption) {
                      optionStyle = "border-green-500/40 bg-green-500/10";
                    } else if (isWrongSelection) {
                      optionStyle = "border-red-500/40 bg-red-500/10";
                    } else {
                      optionStyle = "border-white/5 opacity-50";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-[#F97316]/50 bg-[#F97316]/10";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(question.id, option.id)}
                      disabled={!!results}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group",
                        optionStyle,
                        !results && "cursor-pointer"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        result
                          ? isCorrectOption
                            ? "border-green-500 bg-green-500"
                            : isWrongSelection
                              ? "border-red-500 bg-red-500"
                              : "border-white/20"
                          : isSelected
                            ? "border-[#F97316] bg-[#F97316]"
                            : "border-white/20 group-hover:border-white/40"
                      )}>
                        {(isSelected || (result && isCorrectOption)) && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      <span className={cn(
                        "text-base leading-relaxed flex-1",
                        result
                          ? isCorrectOption
                            ? "text-green-300 font-bold"
                            : isWrongSelection
                              ? "text-red-300 line-through"
                              : "text-slate-500"
                          : isSelected
                            ? "text-white"
                            : "text-slate-300"
                      )}>
                        {option.optionText}
                      </span>

                      {result && isCorrectOption && (
                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                      )}
                      {result && isWrongSelection && (
                        <XCircle size={16} className="text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!results && (
        <div className="px-8 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3",
              allAnswered
                ? "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg shadow-[#F97316]/30 active:scale-[0.98]"
                : "bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            )}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Check size={18} />
                Valider mes réponses ({Object.keys(selectedAnswers).length}/{questions.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export function SectionRendererV2({
  sections,
  sessionId,
  quizData,
  onQuizPassed,
}: {
  sections: Section[];
  sessionId?: string;
  quizData?: QuizData | null;
  onQuizPassed?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const sortedSections = useMemo(() =>
    [...sections].sort((a, b) => a.sortOrder - b.sortOrder),
  [sections]);

  const currentSection = sortedSections[currentIndex];
  const progress = ((currentIndex + 1) / sortedSections.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < sortedSections.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, sortedSections.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!currentSection) return null;

  const getIcon = (type: Section['type']) => {
    switch (type) {
      case 'text': return <BookOpen className="w-8 h-8 text-[#F97316]" />;
      case 'code': return <Terminal className="w-8 h-8 text-[#F97316]" />;
      case 'exercise': return <Gamepad2 className="w-8 h-8 text-[#F97316]" />;
      case 'tip': return <Lightbulb className="w-8 h-8 text-[#F97316]" />;
      case 'warning': return <AlertTriangle className="w-8 h-8 text-[#DC2626]" />;
      case 'quiz': return <HelpCircle className="w-8 h-8 text-[#F97316]" />;
      default: return <BookOpen className="w-8 h-8 text-[#F97316]" />;
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden font-sans text-[#E7E5E4] selection:bg-[#F97316]/30 selection:text-white">
      <TerminalBackground />

      {/* Progress Bar Top */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-900 z-50">
        <motion.div
          className="h-full bg-[#F97316] shadow-[0_0_15px_rgba(217,119,87,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />
      </div>

      {/* Header Info */}
      <div className="fixed top-8 left-8 right-8 flex justify-between items-start z-40 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 border border-slate-800 rounded-sm pointer-events-auto">
            <span className="text-[#F97316] animate-pulse uppercase text-sm font-bold tracking-widest">Live System</span>
            <div className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316]" />
          </div>
          <span className="text-slate-500 text-xs px-1">CODEX_AI_MODULE_01</span>
        </div>

        <div className="bg-black/40 backdrop-blur-md px-4 py-2 border border-slate-800 rounded-sm pointer-events-auto flex items-center gap-4">
          <span className="text-slate-400 text-sm">SECTION {currentIndex + 1} / {sortedSections.length}</span>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex gap-1">
            <div className={cn("w-2 h-2 rounded-full", currentIndex > 0 ? "bg-[#F97316]" : "bg-slate-800")} />
            <div className={cn("w-2 h-2 rounded-full", currentIndex < sortedSections.length - 1 ? "bg-slate-600 animate-pulse" : "bg-slate-800")} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-24 pt-24 pb-28 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="w-full max-w-5xl my-auto"
          >
            {/* Section Badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl shadow-[0_0_20px_rgba(217,119,87,0.1)]">
                {getIcon(currentSection.type)}
              </div>
              <span className="text-[#F97316] text-xl font-bold uppercase tracking-[0.2em]">
                {currentSection.type}
              </span>
            </div>

            {/* Typing Title */}
            {currentSection.title && <TypingTitle text={currentSection.title} />}

            {/* Dynamic Content Rendering */}
            <div className="relative group">
              {currentSection.type === 'code' ? (
                <div className="relative bg-[#1C1917] border border-[#F97316]/30 rounded-2xl overflow-hidden shadow-2xl group-hover:border-[#F97316]/60 transition-colors duration-500">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-black/20">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/30" />
                      <div className="w-3 h-3 rounded-full bg-orange-500/30" />
                      <div className="w-3 h-3 rounded-full bg-green-500/30" />
                    </div>
                    <span className="text-slate-500 text-xs tracking-widest uppercase">{currentSection.codeLanguage || 'terminal'}</span>
                    <button
                      onClick={() => handleCopy(currentSection.content)}
                      className="p-2 hover:bg-[#F97316]/10 rounded-lg text-slate-400 hover:text-[#F97316] transition-all"
                    >
                      {copied ? <Check size={18} className="text-[#16A34A]" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <pre className="p-8 text-lg overflow-x-auto text-[#FED7AA] leading-relaxed">
                    <code>{currentSection.content}</code>
                  </pre>
                </div>
              ) : currentSection.type === 'exercise' ? (
                <div className="bg-black/60 backdrop-blur-xl border border-[#F97316]/30 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-8 py-4 bg-[#F97316]/10 border-b border-[#F97316]/20">
                    <Command size={20} className="text-[#F97316]" />
                    <span className="text-[#F97316] font-bold uppercase tracking-widest text-sm">Mission Active</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#F97316] animate-pulse shadow-[0_0_8px_#F97316]" />
                  </div>
                  <div className="p-8 space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-[#F97316]">&gt;</span> {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-bold text-[#F97316] uppercase tracking-widest mt-6 mb-3">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-lg text-slate-300 leading-relaxed mb-3">{children}</p>
                        ),
                        ol: ({ children }) => (
                          <div className="grid gap-3 my-4">{children}</div>
                        ),
                        ul: ({ children }) => (
                          <div className="grid gap-3 my-4">{children}</div>
                        ),
                        li: ({ children }) => (
                          <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                            </div>
                            <span className="text-slate-300 text-base leading-relaxed flex-1">{children}</span>
                          </div>
                        ),
                        strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                        code: ({ children }) => <code className="bg-[#F97316]/15 text-[#FED7AA] px-2 py-0.5 rounded text-sm border border-[#F97316]/20">{children}</code>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6 rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                            <table className="w-full text-left">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-[#F97316]/10 border-b border-[#F97316]/20">{children}</thead>,
                        th: ({ children }) => <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#F97316]">{children}</th>,
                        tr: ({ children }) => <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">{children}</tr>,
                        td: ({ children }) => <td className="px-6 py-3 text-sm text-slate-300">{children}</td>,
                      }}
                    >
                      {currentSection.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : currentSection.type === 'tip' ? (
                <div className="relative overflow-hidden bg-orange-50/5 border-2 border-[#F97316]/20 p-10 rounded-3xl shadow-2xl">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Lightbulb size={120} className="text-[#F97316]" />
                   </div>
                   <div className="relative z-10 space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="text-lg md:text-xl leading-relaxed text-slate-300 mb-3">{children}</p>,
                        strong: ({ children }) => <strong className="text-[#F97316] font-extrabold">{children}</strong>,
                        code: ({ children }) => <code className="bg-[#F97316]/15 text-[#FED7AA] px-2 py-1 rounded-lg text-base border border-[#F97316]/20 block my-4 p-4">{children}</code>,
                        ul: ({ children }) => <div className="grid gap-3 my-4">{children}</div>,
                        li: ({ children }) => (
                          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                            <Lightbulb size={16} className="text-[#F97316] mt-1 shrink-0" />
                            <span className="text-slate-300 text-base leading-relaxed">{children}</span>
                          </div>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6 rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                            <table className="w-full text-left">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-[#F97316]/10 border-b border-[#F97316]/20">{children}</thead>,
                        th: ({ children }) => <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#F97316]">{children}</th>,
                        tr: ({ children }) => <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">{children}</tr>,
                        td: ({ children }) => <td className="px-6 py-3 text-sm text-slate-300">{children}</td>,
                      }}
                    >
                      {currentSection.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : currentSection.type === 'warning' ? (
                <div className="bg-red-950/20 border-2 border-red-500/30 p-10 rounded-3xl shadow-2xl">
                   <div className="flex items-center gap-4 mb-6 text-red-500">
                      <AlertTriangle size={32} />
                      <span className="font-bold uppercase tracking-[0.3em]">System Critical Warning</span>
                   </div>
                   <div className="space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="text-lg text-red-100/80 leading-relaxed mb-3">{children}</p>,
                        strong: ({ children }) => <strong className="text-red-400 font-bold">{children}</strong>,
                        ul: ({ children }) => <div className="grid gap-3 my-4">{children}</div>,
                        li: ({ children }) => (
                          <div className="flex items-start gap-3 bg-red-950/30 rounded-xl p-4 border border-red-500/20">
                            <AlertTriangle size={16} className="text-red-500 mt-1 shrink-0" />
                            <span className="text-red-100/80 text-base leading-relaxed">{children}</span>
                          </div>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6 rounded-2xl border border-red-500/20 bg-red-950/20 shadow-xl">
                            <table className="w-full text-left">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-red-500/10 border-b border-red-500/20">{children}</thead>,
                        th: ({ children }) => <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-red-400">{children}</th>,
                        tr: ({ children }) => <tr className="border-b border-red-500/10 last:border-0">{children}</tr>,
                        td: ({ children }) => <td className="px-6 py-3 text-sm text-red-100/70">{children}</td>,
                      }}
                    >
                      {currentSection.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : currentSection.type === 'quiz' ? (
                quizData?.hasQuiz && quizData.questions.length > 0 && sessionId ? (
                  <InteractiveQuiz
                    questions={quizData.questions.filter(q => q.sectionId === currentSection.id)}
                    sessionId={sessionId}
                    alreadyPassed={quizData.alreadyPassed}
                    onQuizPassed={onQuizPassed || (() => {})}
                  />
                ) : (
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <HelpCircle size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Quiz en cours de chargement...</p>
                  </div>
                )
              ) : (
                <div className="space-y-6 max-w-4xl">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <div className="flex items-center gap-4 mb-8 mt-4">
                          <div className="w-1.5 h-10 bg-[#F97316] rounded-full shadow-[0_0_10px_rgba(217,119,87,0.5)]" />
                          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{children}</h1>
                        </div>
                      ),
                      h2: ({ children }) => (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 mt-8">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316]" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{children}</h2>
                          </div>
                        </div>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-[#F97316] uppercase tracking-widest mt-6 mb-3 flex items-center gap-3">
                          <span className="text-[#F97316]/40">{'///'}</span> {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-lg md:text-xl leading-relaxed text-slate-300 mb-4">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <div className="grid gap-3 my-6">{children}</div>
                      ),
                      ol: ({ children }) => (
                        <div className="grid gap-3 my-6">{children}</div>
                      ),
                      li: ({ children }) => (
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#F97316]/30 transition-colors">
                          <div className="mt-1 shrink-0 w-6 h-6 rounded-lg bg-[#F97316]/20 flex items-center justify-center">
                            <ChevronRight size={14} className="text-[#F97316]" />
                          </div>
                          <span className="text-lg text-slate-300 leading-relaxed flex-1">{children}</span>
                        </div>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-[#F97316] font-extrabold">{children}</strong>
                      ),
                      code: ({ children }) => (
                        <code className="bg-[#F97316]/15 text-[#FED7AA] px-2 py-0.5 rounded-md text-[0.9em] border border-[#F97316]/20">{children}</code>
                      ),
                      blockquote: ({ children }) => (
                        <div className="border-l-4 border-[#F97316] bg-[#F97316]/5 rounded-r-xl p-6 my-6">
                          <div className="text-slate-300 text-lg italic">{children}</div>
                        </div>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                          <table className="w-full text-left">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-[#F97316]/10 border-b border-[#F97316]/20">{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#F97316]">{children}</th>
                      ),
                      tr: ({ children }) => (
                        <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">{children}</tr>
                      ),
                      td: ({ children }) => (
                        <td className="px-6 py-4 text-base text-slate-300">{children}</td>
                      ),
                    }}
                  >
                    {currentSection.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Navigation Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-full border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              currentIndex === 0
                ? "text-slate-700 cursor-not-allowed"
                : "text-white hover:bg-slate-800 hover:text-[#F97316]"
            )}
          >
            <ChevronLeft size={32} />
          </motion.button>

          <div className="h-8 w-px bg-slate-800 mx-2" />

          <div className="flex gap-2 px-2">
            {sortedSections.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  idx === currentIndex
                    ? "w-12 bg-[#F97316] shadow-[0_0_10px_#F97316]"
                    : "w-2 bg-slate-800 hover:bg-slate-600"
                )}
              />
            ))}
          </div>

          <div className="h-8 w-px bg-slate-800 mx-2" />

          <motion.button
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentIndex === sortedSections.length - 1}
            className={cn(
              "flex items-center gap-3 p-4 rounded-full transition-all duration-300",
              currentIndex === sortedSections.length - 1
                ? "text-slate-700 cursor-not-allowed"
                : "text-white hover:bg-slate-800 hover:text-[#F97316]"
            )}
          >
            {currentIndex === sortedSections.length - 1 ? (
              <span className="text-xs uppercase font-bold tracking-widest text-[#16A34A]">Module Fini</span>
            ) : (
              <ChevronRight size={32} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Side Decorative Metadata */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 flex-col gap-8 z-0 opacity-20 hidden lg:flex">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Memory Address</span>
          <span className="text-sm text-slate-300">0x0F4A92B1</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Bitrate</span>
          <span className="text-sm text-slate-300">128.4 KB/s</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Connection</span>
          <span className="text-sm text-green-500">ENCRYPTED</span>
        </div>
      </div>
    </main>
  );
}
