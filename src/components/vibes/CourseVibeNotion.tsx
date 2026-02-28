"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Check, Copy, Lightbulb, AlertTriangle, Terminal, BookOpen, ChevronRight, Menu, X, ArrowUp, HelpCircle, Trophy, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface Section { id: string; title: string | null; type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz'; content: string; codeLanguage: string | null; sortOrder: number; }
interface QuizOption { id: string; optionText: string; sortOrder: number; }
interface QuizQuestion { id: string; questionText: string; questionType: 'multiple_choice' | 'true_false'; sortOrder: number; sectionId: string; options: QuizOption[]; }
interface QuizData { questions: QuizQuestion[]; hasQuiz: boolean; alreadyPassed: boolean; }

const CodeBlock = ({ content, language }: { content: string; language?: string | null }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative my-8 group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-xl border-b border-slate-700">
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-600" /><div className="w-2.5 h-2.5 rounded-full bg-slate-600" /><div className="w-2.5 h-2.5 rounded-full bg-slate-600" /></div>
        <div className="flex items-center gap-3"><span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{language || 'code'}</span><button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition-colors">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
      </div>
      <pre className="bg-slate-900 p-5 overflow-x-auto text-slate-100 font-mono text-sm leading-relaxed rounded-b-xl border border-slate-800 border-t-0"><code>{content}</code></pre>
    </div>
  );
};

function InteractiveQuiz({ questions, sessionId, alreadyPassed, onQuizPassed }: { questions: QuizQuestion[]; sessionId: string; alreadyPassed: boolean; onQuizPassed: () => void }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passed, setPassed] = useState(alreadyPassed);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);
  const allAnswered = questions.every(q => selectedAnswers[q.id]);
  const handleSelect = (qid: string, oid: string) => { if (results) return; setSelectedAnswers(p => ({ ...p, [qid]: oid })); };
  const handleSubmit = async () => {
    if (!allAnswered || submitting) return; setSubmitting(true);
    try { const res = await fetch(`/api/sessions/${sessionId}/quiz`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: selectedAnswers }) }); if (!res.ok) throw new Error('Erreur'); const data = await res.json(); setResults(data.results); setScore({ score: data.score, total: data.totalQuestions }); setPassed(data.passed); if (data.passed) onQuizPassed(); } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };
  const handleRetry = () => { setSelectedAnswers({}); setResults(null); setScore(null); };
  if (passed && !results) return (<div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center flex flex-col items-center gap-4"><div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check size={24} /></div><h4 className="text-lg font-bold text-slate-900">Quiz validé</h4><p className="text-slate-500 text-sm">Session validée avec succès.</p></div>);
  return (
    <div className="space-y-8 my-12">
      <div className="flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">VÉRIFICATION DES ACQUIS</span><div className="h-px flex-1 bg-slate-200" /></div>
      {results && score && (<div className={cn("p-6 rounded-xl border w-full text-center", passed ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}><p className="font-bold text-lg mb-1">{passed ? "Félicitations !" : "Encore un petit effort..."}</p><p className="text-sm">Score : {score.score}/{score.total}</p>{!passed && <button onClick={handleRetry} className="mt-4 bg-[#F97316] text-white px-8 py-3 rounded-lg font-bold">RÉESSAYER</button>}</div>)}
      {!results && (<div className="space-y-6">{questions.map((q, i) => (<div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"><h4 className="text-base font-bold text-slate-900 mb-4"><span className="text-[#F97316] mr-2">{i + 1}.</span>{q.questionText}</h4><div className="space-y-2">{q.options.map(o => (<button key={o.id} onClick={() => handleSelect(q.id, o.id)} className={cn("w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3", selectedAnswers[q.id] === o.id ? "border-[#F97316] bg-orange-50/30" : "border-slate-200 hover:border-[#F97316]")}><div className={cn("mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0", selectedAnswers[q.id] === o.id ? "border-[#F97316] bg-[#F97316]" : "border-slate-300")}>{selectedAnswers[q.id] === o.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div><span className="text-sm text-slate-600">{o.optionText}</span></button>))}</div></div>))}<button onClick={handleSubmit} disabled={!allAnswered || submitting} className="w-full bg-[#F97316] text-white py-4 rounded-lg font-bold shadow-md hover:bg-[#ea580c] disabled:opacity-50 transition-all">{submitting ? "VALIDATION..." : "VÉRIFIER MES RÉPONSES"}</button></div>)}
    </div>
  );
}

export function SectionRendererV2({ sections, sessionId, quizData, onQuizPassed }: { sections: Section[]; sessionId?: string; quizData?: QuizData | null; onQuizPassed?: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  useEffect(() => { const h = () => setShowScrollTop(window.scrollY > 400); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); }, { threshold: [0.1], rootMargin: '-10% 0px -70% 0px' });
    Object.values(sectionRefs.current).forEach(r => { if (r) observer.observe(r); });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => { const el = sectionRefs.current[id]; if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' }); setIsSidebarOpen(false); } };

  const MD: any = {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">{children}</h3>,
    p: ({ children }: any) => <p className="text-slate-600 leading-relaxed mb-4 text-base">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc ml-5 mb-6 space-y-2 text-slate-600">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal ml-5 mb-6 space-y-2 text-slate-600">{children}</ol>,
    li: ({ children }: any) => <li className="pl-1 leading-relaxed">{children}</li>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-slate-200 pl-6 my-8 italic text-slate-500 text-lg">{children}</blockquote>,
    strong: ({ children }: any) => <strong className="text-[#F97316] font-bold">{children}</strong>,
    code: ({ children }: any) => <code className="bg-slate-100 text-[#F97316] px-1.5 py-0.5 rounded font-mono text-[0.9em]">{children}</code>,
    table: ({ children }: any) => <div className="overflow-x-auto my-8 rounded-xl border border-slate-200"><table className="w-full text-left text-sm">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-slate-50">{children}</thead>,
    th: ({ children }: any) => <th className="p-4 font-bold text-slate-900 border-b border-slate-200">{children}</th>,
    td: ({ children }: any) => <td className="p-4 border-b border-slate-100 text-slate-600">{children}</td>,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#F97316] z-[100] origin-left" style={{ scaleX }} />
      <div className="lg:hidden sticky top-1 z-50 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shadow-sm">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600"><Menu size={20} /></button>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">SOMMAIRE</span>
        <div className="w-8" />
      </div>
      <aside className={cn("fixed inset-y-0 left-0 w-[280px] bg-slate-50 border-r border-slate-200 z-[60] overflow-y-auto pt-8 transition-transform lg:translate-x-0", !isSidebarOpen && "max-lg:-translate-x-full")}>
        <div className="flex items-center justify-between px-6 mb-8 lg:hidden"><span className="font-bold">Navigation</span><button onClick={() => setIsSidebarOpen(false)} className="text-slate-400"><X size={20} /></button></div>
        <div className="px-4 space-y-1">
          <div className="px-2 mb-4"><span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">STRUCTURE DU COURS</span></div>
          {sortedSections.map((s, i) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className={cn("w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-all group", activeId === s.id ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-200/50")}>
              <span className={cn("mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full", activeId === s.id ? "bg-[#F97316]" : "bg-slate-300")} />
              <div className="flex-1 min-w-0"><p className={cn("text-sm leading-tight truncate", activeId === s.id ? "text-slate-900 font-semibold" : "text-slate-500")}>{s.title || `Partie ${i + 1}`}</p><span className="text-[9px] uppercase tracking-wider text-slate-400">{s.type}</span></div>
            </button>
          ))}
        </div>
      </aside>
      <main className="lg:ml-[280px] min-h-screen">
        <div className="max-w-[760px] mx-auto px-6 py-12 lg:py-24 space-y-0">
          {sortedSections.map((s, i) => (
            <section key={s.id} id={s.id} ref={el => { sectionRefs.current[s.id] = el; }} className="scroll-mt-24 mb-16">
              {s.type === 'text' && <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{s.content}</ReactMarkdown>}
              {s.type === 'code' && <CodeBlock content={s.content} language={s.codeLanguage} />}
              {s.type === 'tip' && (<div className="my-8 flex gap-4 p-6 rounded-xl bg-orange-50/50 border-l-4 border-[#F97316]"><Lightbulb size={24} className="text-[#F97316] shrink-0" /><div><span className="text-[10px] uppercase tracking-[0.2em] text-[#F97316] font-bold block mb-2">ASTUCE</span><div className="text-slate-700 text-[15px] leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{s.content}</ReactMarkdown></div></div></div>)}
              {s.type === 'warning' && (<div className="my-8 flex gap-4 p-6 rounded-xl bg-red-50/50 border-l-4 border-red-500"><AlertTriangle size={24} className="text-red-500 shrink-0" /><div><span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold block mb-2">ATTENTION</span><div className="text-slate-700 text-[15px] leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{s.content}</ReactMarkdown></div></div></div>)}
              {s.type === 'exercise' && (<div className="my-10 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"><div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2"><Terminal size={18} className="text-[#F97316]" /><span className="text-[11px] font-bold uppercase tracking-widest text-slate-900">EXERCICE PRATIQUE</span></div><div className="p-6 text-slate-700"><ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{s.content}</ReactMarkdown></div></div>)}
              {s.type === 'quiz' && quizData?.hasQuiz && sessionId && <InteractiveQuiz questions={quizData.questions.filter(q => q.sectionId === s.id)} sessionId={sessionId} alreadyPassed={quizData.alreadyPassed} onQuizPassed={onQuizPassed || (() => {})} />}
              {i < sortedSections.length - 1 && <div className="h-px bg-slate-100 w-full mt-16" />}
            </section>
          ))}
          <footer className="mt-20 pt-8 border-t border-slate-100 text-center"><p className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">FIN DE LA SESSION</p></footer>
        </div>
      </main>
      <AnimatePresence>{showScrollTop && (<motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#F97316] shadow-md"><ArrowUp size={20} /></motion.button>)}</AnimatePresence>
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
