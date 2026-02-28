"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  HelpCircle,
  Check,
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useProgress } from '@/hooks/useProgress';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuizOption { id: string; optionText: string; sortOrder: number; }
interface QuizQuestion { id: string; questionText: string; questionType: 'multiple_choice' | 'true_false'; sortOrder: number; sectionId: string; options: QuizOption[]; }
interface QuizResult { questionId: string; selectedOptionId: string; correctOptionId: string; isCorrect: boolean; }

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { refresh } = useProgress();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');

  useEffect(() => {
    if (!id) return;
    // Load quiz
    fetch(`/api/sessions/${id}/quiz`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.hasQuiz) {
          setQuestions(d.questions || []);
          setAlreadyPassed(d.alreadyPassed || false);
          setPassed(d.alreadyPassed || false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Load session title
    fetch(`/api/sessions/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.session?.title) setSessionTitle(d.session.title); })
      .catch(() => {});
  }, [id]);

  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (results) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${id}/quiz`, {
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
        refresh();
        setTimeout(() => router.push('/formation'), 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Retour au cours
          </button>
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest">Quiz de validation</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316]/5 border border-[#F97316]/10 rounded-full mb-6">
            <HelpCircle size={16} className="text-[#F97316]" />
            <span className="text-sm font-bold text-[#F97316]">Validation du module</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-black mb-3">{sessionTitle || 'Quiz'}</h1>
          <p className="text-slate-500">Réponds correctement à toutes les questions pour valider ce module.</p>
        </motion.div>

        {/* Already passed */}
        {alreadyPassed && !results && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Module déjà validé !</h2>
            <p className="text-slate-500 mb-8">Tu as déjà réussi ce quiz.</p>
            <button onClick={() => router.push('/formation')} className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#F97316] transition-colors">
              Retour au parcours
            </button>
          </motion.div>
        )}

        {/* Results banner */}
        {results && score && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-2xl p-6 mb-8 flex items-center justify-between", passed ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200")}>
            <div className="flex items-center gap-4">
              {passed ? <Trophy size={28} className="text-green-500" /> : <XCircle size={28} className="text-red-500" />}
              <div>
                <p className={cn("text-lg font-black", passed ? "text-green-700" : "text-red-600")}>
                  {passed ? 'Module validé !' : 'Pas encore...'}
                </p>
                <p className={cn("text-sm", passed ? "text-green-600" : "text-red-500")}>
                  {score.score}/{score.total} bonnes réponses
                  {passed && ' — Redirection en cours...'}
                </p>
              </div>
            </div>
            {!passed && (
              <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:text-black hover:border-black transition-colors">
                <RotateCcw size={14} /> Réessayer
              </button>
            )}
          </motion.div>
        )}

        {/* Questions */}
        {!alreadyPassed && (
          <div className="space-y-8">
            {questions.map((question, qIndex) => {
              const result = results?.find(r => r.questionId === question.id);
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * qIndex }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      result ? (result.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500") : "bg-slate-100 text-slate-600")}>
                      {result ? (result.isCorrect ? <Check size={16} /> : <XCircle size={16} />) : qIndex + 1}
                    </span>
                    <p className="text-sm font-bold text-black flex-1">{question.questionText}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {question.options.map(option => {
                      const isSelected = selectedAnswers[question.id] === option.id;
                      const isCorrectOption = result?.correctOptionId === option.id;
                      const isWrongSelection = result && isSelected && !result.isCorrect;

                      let style = 'border-slate-200 hover:border-[#F97316]/30 hover:bg-[#F97316]/5';
                      if (result) {
                        if (isCorrectOption) style = 'border-green-300 bg-green-50';
                        else if (isWrongSelection) style = 'border-red-300 bg-red-50';
                        else style = 'border-slate-100 opacity-40';
                      } else if (isSelected) style = 'border-[#F97316] bg-[#F97316]/5';

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(question.id, option.id)}
                          disabled={!!results}
                          className={cn("w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center gap-3", style, !results && "cursor-pointer")}
                        >
                          <div className={cn("shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            result ? (isCorrectOption ? "border-green-500 bg-green-500" : isWrongSelection ? "border-red-500 bg-red-500" : "border-slate-200")
                              : isSelected ? "border-[#F97316] bg-[#F97316]" : "border-slate-300")}>
                            {(isSelected || (result && isCorrectOption)) && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={cn(
                            result ? (isCorrectOption ? "text-green-700 font-bold" : isWrongSelection ? "text-red-500 line-through" : "text-slate-400") : isSelected ? "text-black font-medium" : "text-slate-600"
                          )}>
                            {option.optionText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            {/* Submit button */}
            {!results && questions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={cn("w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    allAnswered ? "bg-[#F97316] text-white hover:bg-[#ea580c] shadow-lg shadow-[#F97316]/20" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Vérification...</> : <><CheckCircle2 size={16} /> Valider mes réponses</>}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
