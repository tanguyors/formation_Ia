"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Cpu, ShieldCheck, Zap, ChevronRight, Lock, Users,
  Code2, Bot, Globe, ArrowRight, Quote, Briefcase,
  GraduationCap, User, TrendingUp
} from 'lucide-react';

// --- Components ---

const GradientBadge = ({ children, className = "", variant = "gradient" }: { children: React.ReactNode, className?: string, variant?: "gradient" | "glass" | "dark" | "success" }) => {
  const variants: Record<string, string> = {
    gradient: "bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-blue-500/20 text-blue-600",
    glass: "bg-white/50 backdrop-blur-sm border-gray-200/50 text-gray-500",
    dark: "bg-gray-950 border-gray-800 text-white",
    success: "bg-emerald-50 border-emerald-200/50 text-emerald-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase border inline-block ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const GradientTerminal = () => {
  const [text, setText] = useState("");
  const fullText = "claude > generate full-stack nextjs app with auth and supabase mcp...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl bg-gray-950 rounded-2xl overflow-hidden font-mono text-sm shadow-2xl shadow-blue-500/5">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-gray-800/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="text-gray-500 text-xs ml-2">bash &mdash; 80x24</div>
      </div>
      <div className="p-6 min-h-[160px]">
        <div className="flex gap-3">
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent font-bold">&gt;</span>
          <span className="text-gray-300">
            {text}
            <span className="inline-block w-2 h-4 bg-gradient-to-b from-blue-500 to-violet-500 ml-1 animate-pulse rounded-sm" />
          </span>
        </div>
        <AnimatePresence>
          {text.length === fullText.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="text-emerald-400">&#10004; Scaffolding complete.</div>
              <div className="text-gray-500">Installing dependencies (lucide, framer-motion, tailwind)...</div>
              <div className="text-gray-500">Connecting to Supabase MCP...</div>
              <div className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent font-bold">Ready on http://localhost:3000</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const GradientMarqueeLogos = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => {
  return (
    <div className="flex overflow-hidden select-none gap-12 group">
      <motion.div
        animate={{ x: reverse ? [0, -1000] : [-1000, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 items-center justify-around gap-12 min-w-full"
      >
        {items.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt="Partner Logo"
            className="h-8 w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
          />
        ))}
        {items.map((logo, idx) => (
          <img
            key={`dup-${idx}`}
            src={logo}
            alt="Partner Logo"
            className="h-8 w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
          />
        ))}
      </motion.div>
    </div>
  );
};

interface SessionData {
  id: string;
  day: string;
  title: string;
  desc: string;
  points: string[];
}

const GradientSessionCard = ({ session, weekTitle }: { session: SessionData, weekTitle: string }) => {
  return (
    <div className="flex-shrink-0 w-[400px] h-[500px] bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-500/20 transition-all duration-500" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{weekTitle}</span>
            <h3 className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-violet-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{session.title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center text-blue-600 font-bold text-sm">
            {session.id}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-500 text-sm leading-relaxed">{session.desc}</p>
          <div className="space-y-2">
            {session.points.map((pt: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                {pt}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent uppercase tracking-widest">{session.day}</span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Zap className="w-3 h-3" />
            <span>PRATIQUE INTENSIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Data ---

const LOGOS_ROW_1 = [
  "/logos/airbus.svg", "/logos/google.svg", "/logos/microsoft.svg",
  "/logos/amazon-aws.svg", "/logos/meta.svg", "/logos/thales.svg", "/logos/capgemini.svg"
];

const LOGOS_ROW_2 = [
  "/logos/dassault-systemes.svg", "/logos/ovhcloud.svg", "/logos/mistral-ai.svg",
  "/logos/datadog.svg", "/logos/criteo.svg", "/logos/bnp-paribas.svg", "/logos/societe-generale.svg"
];

const CURRICULUM = [
  {
    week: "MAÎTRISER CLAUDE CODE",
    sessions: [
      { id: "S1", day: "Lundi", title: "Setup & Premiers Pas", desc: "Configuration de l'environnement de travail nouvelle génération.", points: ["Installation Claude Code CLI", "Modèle de tokens : Opus/Sonnet/Haiku", "Plans Pro ($20) vs Max ($100-200)", "Scaffolder une app Next.js en 5 min", "Exercice : Portfolio en 15 min"] },
      { id: "S2", day: "Mercredi", title: "CLAUDE.md & Context Engineering", desc: "Comment transformer Claude en un architecte senior qui connaît votre codebase.", points: ["CLAUDE.md = cerveau persistant", "Context engineering = compétence n°1", "Slash commands (/init /compact /review...)", "Les hooks", "Atelier : CLAUDE.md complet + 3 hooks"] },
      { id: "S3", day: "Vendredi", title: "Vibe Coding vs Dev Assisté", desc: "Évitez les pièges de la génération de code massive et incontrôlée.", points: ["Vibe coding (dangereux) vs dev assisté (pro)", "45% de vulnérabilités", "Debug de code IA", "Challenge : Feature CRUD+UI+tests en 45 min"] }
    ]
  },
  {
    week: "MCP (MODEL CONTEXT PROTOCOL)",
    sessions: [
      { id: "S4", day: "Lundi", title: "Comprendre MCP", desc: "L'interface standard pour connecter l'IA à n'importe quel outil.", points: ["MCP = USB-C de l'IA", "Architecture client/serveur", "10 000+ serveurs ~2 000 vérifiés", "Sécurité : 43% failles injection", "Exercice : 3 serveurs MCP"] },
      { id: "S5", day: "Mercredi", title: "MCP en Pratique", desc: "Cas d'utilisation réels : bases de données, mémoire et tests.", points: ["Supabase MCP", "Memory MCP", "Sequential Thinking", "Playwright MCP", "Atelier : App complète via MCP"] },
      { id: "S6", day: "Vendredi", title: "Créer son serveur MCP", desc: "Développez vos propres outils personnalisés pour vos besoins spécifiques.", points: ["Spec MCP (Tasks OAuth Elicitation)", "tools resources prompts", "SDK TypeScript", "Challenge : Serveur MCP custom"] }
    ]
  },
  {
    week: "AGENTS IA",
    sessions: [
      { id: "S7", day: "Lundi", title: "Comprendre les Agents", desc: "De l'assistant passif à l'agent autonome qui exécute des tâches.", points: ["Agent vs chatbot vs workflow", "Patterns orchestrateur router pipeline", "Frameworks Claude Agent SDK LangGraph CrewAI", "Marché $7.84B→$52B", "Exercice : 3 agents open-source"] },
      { id: "S8", day: "Mercredi", title: "Claude Agent SDK", desc: "Exploitation profonde du SDK officiel d'Anthropic pour les agents.", points: ["Architecture et concepts", "Premier agent avec tools/guardrails/handoffs", "Subagents et multi-agent", "Atelier : Agent code review GitHub"] },
      { id: "S9", day: "Vendredi", title: "Agent Multi-Étapes", desc: "Gérer des workflows complexes sur de longues durées.", points: ["Production monitoring coûts", "Patterns avancés human-in-the-loop memory", "Challenge : Agent brief→wireframe→code→tests→deploy"] }
    ]
  },
  {
    week: "ASSEMBLER & DEVENIR DANGEREUX",
    sessions: [
      { id: "S10", day: "Lundi", title: "Workflow Pro Complet", desc: "Intégration finale de tous les outils vus précédemment.", points: ["Claude Code + MCP + Agents", "Workflow quotidien optimisé", "CI/CD IA + hooks Git", "Exercice : Workflow sur projet existant"] },
      { id: "S11", day: "Mercredi", title: "Projet Final Partie 1", desc: "Démarrage de la construction de votre application SaaS IA.", points: ["SaaS complet en 3h", "Next.js + Supabase + Claude Code + MCP + Agent", "Phase 1 : Archi BDD Auth API"] },
      { id: "S12", day: "Vendredi", title: "Projet Final + Certification", desc: "Finalisation, déploiement et validation des acquis.", points: ["UI tests deploy Vercel", "Agent IA custom", "SaaS déployé", "Certification CODEX_AI + badge SENTINELLE"] }
    ]
  }
];

// --- Main Page ---

export default function LandingVibeOption5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (scrollContentRef.current) {
      setScrollRange(scrollContentRef.current.scrollWidth - window.innerWidth);
    }
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-500/20 selection:text-blue-600">

      {/* --- HEADER (Glassmorphism) --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">CODEX_AI</span>
          </div>
          <a href="/login" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <Lock className="w-4 h-4" />
            Se connecter
          </a>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/3 w-96 h-96 bg-blue-400/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <GradientBadge>Formation Premium &mdash; Cohorte 2026</GradientBadge>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              L&apos;IA NE VOUS REMPLACERA PAS. <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">LE DEV QUI L&apos;UTILISE, SI.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
              4 semaines intensives pour maîtriser Claude Code, MCP et les agents IA autonomes.
              Ne subissez pas le futur, codez-le.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button disabled className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200/50">
                <Lock className="w-5 h-5" />
                INSCRIPTIONS FERM&Eacute;ES
              </button>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PROCHAINE COHORTE</span>
                <span className="text-sm font-semibold text-gray-600">Printemps 2026</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GradientTerminal />
          </motion.div>
        </div>
      </section>

      {/* --- LOGO WALL --- */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center space-y-2">
          <h2 className="text-xs font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent uppercase tracking-[0.3em]">ILS RECRUTENT DES DEVS IA. EN &Ecirc;TES-VOUS UN ?</h2>
          <p className="text-gray-400 text-sm italic">+340% de demande pour les profils maîtrisant les agents autonomes en 2025.</p>
        </div>
        <div className="space-y-12 overflow-hidden">
          <GradientMarqueeLogos items={LOGOS_ROW_1} />
          <GradientMarqueeLogos items={LOGOS_ROW_2} reverse />
        </div>
      </section>

      {/* --- CURRICULUM (Horizontal Scroll) --- */}
      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center relative">
          {/* Background gradient mesh for curriculum */}
          <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[120px]" />

          <div className="px-6 max-w-7xl mx-auto w-full mb-12 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight"
            >
              12 SESSIONS. 4 SEMAINES. <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">1 MUTATION.</span>
            </motion.h2>
          </div>

          <motion.div style={{ x }} className="flex gap-8 px-6 lg:px-[10%] relative z-10">
            <div ref={scrollContentRef} className="flex gap-8">
              {CURRICULUM.map((week, wIdx) => (
                <div key={wIdx} className="flex gap-8">
                  {week.sessions.map((session, sIdx) => (
                    <GradientSessionCard key={sIdx} session={session} weekTitle={week.week} />
                  ))}
                </div>
              ))}

              {/* --- CERTIFICATION CARD --- */}
              <div className="flex-shrink-0 w-[500px] h-[500px] bg-gray-950 rounded-3xl p-12 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/15 blur-[100px] -ml-24 -mb-24" />
                <div className="z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Certification CODEX_AI</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">
                    Validation des acquis par la mise en production d&apos;un agent IA complet.
                    Badge SENTINELLE délivré aux diplômés.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Durée</div>
                      <div className="text-xl font-bold">18h de Live</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Format</div>
                      <div className="text-xl font-bold">Full Remote</div>
                    </div>
                  </div>
                </div>
                <div className="z-10 pt-8 border-t border-gray-800 flex justify-between items-end">
                  <div className="text-sm font-bold tracking-tighter">COHORTE 2026</div>
                  <GradientBadge variant="gradient" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white border-none">SENTINELLE</GradientBadge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="bg-gray-950 py-12 overflow-hidden">
        <div className="flex overflow-hidden whitespace-nowrap gap-16">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center shrink-0"
          >
            {[1,2,3,4].map((i) => (
              <React.Fragment key={i}>
                <span className="text-gray-500 font-bold tracking-widest text-sm flex items-center gap-4">
                  <TrendingUp className="text-blue-500 w-5 h-5" />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">84%</span> STACK OVERFLOW 2025 ADOPTION
                </span>
                <span className="text-gray-500 font-bold tracking-widest text-sm flex items-center gap-4">
                  <TrendingUp className="text-violet-500 w-5 h-5" />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">41%</span> STATE OF CODE AUTOMATION INCREASE
                </span>
                <span className="text-gray-500 font-bold tracking-widest text-sm flex items-center gap-4">
                  <TrendingUp className="text-blue-500 w-5 h-5" />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">80%</span> GARTNER PREDICTED AI CONTRIBUTION
                </span>
                <span className="text-gray-500 font-bold tracking-widest text-sm flex items-center gap-4">
                  <TrendingUp className="text-violet-500 w-5 h-5" />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">+56%</span> PWC 2025 DEV PERFORMANCE
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FORMAT --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="text-center mb-20 space-y-4 relative z-10">
          <GradientBadge>Le format</GradientBadge>
          <h2 className="text-4xl font-bold text-gray-900">Pas de théorie creuse.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: Users, title: "Lives Interactifs", desc: "Sessions directes avec correction de bugs en temps réel. Pas de vidéos pré-enregistrées, du live pur." },
            { icon: Globe, title: "Plateforme Dédiée", desc: "Accès à vie à notre bibliothèque de prompts, serveurs MCP custom et replays HD." },
            { icon: Zap, title: "Projet Fil Rouge", desc: "Vous ne repartez pas avec des notes, mais avec un agent IA prêt pour la production." }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <GradientBadge variant="glass">Témoignages</GradientBadge>
              <h2 className="text-4xl font-bold text-gray-900">ILS ONT PASS&Eacute; LE CAP</h2>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center">
                <Quote className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Thomas R.", role: "Freelance Fullstack", text: "Avant CODEX_AI, je passais 6h sur une feature complexe. Maintenant, avec mes propres agents MCP, 2h max.", metric: "Productivité x3" },
              { name: "Sarah M.", role: "Dev Senior en ESN", text: "J'ai décroché un poste d'Architecte IA 3 mois après la formation. Le ROI est dément.", metric: "Promotion Architecte" },
              { name: "Karim B.", role: "Étudiant en alternance", text: "Mon premier agent IA autonome, construit en session 9, gère maintenant toute la documentation technique de mon entreprise.", metric: "Premier Agent Deployé" }
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Zap key={s} className="w-3 h-3 text-blue-500 fill-blue-500" />)}
                  </div>
                  <p className="text-gray-700 italic mb-8 leading-relaxed">&quot;{t.text}&quot;</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role}</div>
                    </div>
                    <GradientBadge variant="success">{t.metric}</GradientBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY NOW --- */}
      <section className="py-32 px-6 overflow-hidden relative">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                POURQUOI <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">MAINTENANT ?</span>
              </h2>
            </div>
            <div className="space-y-8">
              {[
                { n: "01", t: "La fenêtre de tir se referme.", d: "En 2026, savoir prompter ne sera plus un avantage, ce sera le minimum syndical." },
                { n: "02", t: "Le code généré par l'IA pollue les bases de données mondiales.", d: "Apprenez à filtrer, raffiner et architecturer plutôt que de simplement générer." },
                { n: "03", t: "Devenez un Full-Stack AI Developer.", d: "Capable de gérer seul ce qui demandait autrefois une équipe de 5 personnes." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <span className="text-2xl font-black bg-gradient-to-b from-blue-200 to-violet-200 bg-clip-text text-transparent">{item.n}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[400px] h-[400px] rounded-full flex items-center justify-center relative"
              style={{ border: "1px dashed", borderImage: "linear-gradient(to right, #3B82F6, #8B5CF6) 1" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-4 border border-white/30 rounded-2xl shadow-xl shadow-blue-500/10">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">2026</div>
                <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">L&apos;ère de l&apos;Agent</div>
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gray-950 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
              PR&Ecirc;T POUR LA <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">MUTATION ?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              12 sessions live, Full Remote, LUN/MER/VEN. <br />
              Accès privé sur invitation uniquement.
            </p>
            <div className="flex flex-col items-center gap-6">
              <button disabled className="px-12 py-5 bg-white/5 text-gray-500 border border-white/10 rounded-2xl font-bold flex items-center gap-3 cursor-not-allowed backdrop-blur-sm">
                <Lock className="w-5 h-5" />
                Inscriptions Fermées
              </button>
              <div className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
                Ouverture de la prochaine cohorte : Printemps 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-gray-100 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded flex items-center justify-center shadow-md shadow-blue-500/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">CODEX_AI</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <span className="hover:text-gray-900 transition-colors cursor-pointer">Plateforme privée</span>
            <span className="hover:text-gray-900 transition-colors cursor-pointer">Conditions</span>
            <span className="hover:text-gray-900 transition-colors cursor-pointer">Support</span>
          </div>
          <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            Accès sur invitation uniquement &mdash; 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
