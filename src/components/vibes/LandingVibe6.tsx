"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  Zap,
  ChevronRight,
  Lock,
  Users,
  Code2,
  Bot,
  Globe,
  ArrowRight,
  Quote,
  Briefcase,
  GraduationCap,
  User,
  TrendingUp
} from 'lucide-react';

// --- Types ---
interface Session {
  week: number;
  id: number;
  day: string;
  title: string;
  points: string[];
}

// --- Data ---
const SESSIONS: Session[] = [
  {
    week: 1, id: 1, day: "Lundi", title: "Setup & Premiers Pas",
    points: ["Installation Claude Code CLI", "Modèle de tokens : Opus/Sonnet/Haiku", "Plans Pro ($20) vs Max ($100-200)", "Scaffolder une app Next.js en 5 min", "Exercice : Portfolio en 15 min"]
  },
  {
    week: 1, id: 2, day: "Mercredi", title: "CLAUDE.md & Context Engineering",
    points: ["CLAUDE.md = cerveau persistant", "Context engineering = compétence n°1", "Slash commands (/init, /compact, /review...)", "Les hooks", "Atelier : CLAUDE.md complet + 3 hooks"]
  },
  {
    week: 1, id: 3, day: "Vendredi", title: "Vibe Coding vs Dev Assisté",
    points: ["Vibe coding (dangereux) vs dev assisté (pro)", "45% de vulnérabilités", "Debug de code IA", "Challenge : Feature CRUD+UI+tests en 45 min"]
  },
  {
    week: 2, id: 4, day: "Lundi", title: "Comprendre MCP",
    points: ["MCP = USB-C de l'IA", "Architecture client/serveur", "10 000+ serveurs, ~2 000 vérifiés", "Sécurité : 43% failles d'injection", "Exercice : 3 serveurs MCP"]
  },
  {
    week: 2, id: 5, day: "Mercredi", title: "MCP en Pratique",
    points: ["Supabase MCP", "Memory MCP", "Sequential Thinking", "Playwright MCP", "Atelier : App complète via MCP"]
  },
  {
    week: 2, id: 6, day: "Vendredi", title: "Créer son serveur MCP",
    points: ["Spec MCP (Tasks, OAuth, Elicitation)", "tools, resources, prompts", "SDK TypeScript", "Challenge : Serveur MCP custom"]
  },
  {
    week: 3, id: 7, day: "Lundi", title: "Comprendre les Agents",
    points: ["Agent vs chatbot vs workflow", "Patterns : orchestrateur, router, pipeline", "Frameworks : Claude Agent SDK, LangGraph, CrewAI", "Marché $7.84B→$52B", "Exercice : 3 agents open-source"]
  },
  {
    week: 3, id: 8, day: "Mercredi", title: "Claude Agent SDK",
    points: ["Architecture et concepts", "Premier agent avec tools/guardrails/handoffs", "Subagents et multi-agent", "Atelier : Agent code review GitHub"]
  },
  {
    week: 3, id: 9, day: "Vendredi", title: "Agent Multi-Étapes",
    points: ["Production : monitoring, coûts", "Patterns avancés : human-in-the-loop, memory", "Challenge : Agent brief→wireframe→code→tests→deploy"]
  },
  {
    week: 4, id: 10, day: "Lundi", title: "Workflow Pro Complet",
    points: ["Claude Code + MCP + Agents", "Workflow quotidien optimisé", "CI/CD IA + hooks Git", "Exercice : Workflow sur projet existant"]
  },
  {
    week: 4, id: 11, day: "Mercredi", title: "Projet Final Partie 1",
    points: ["SaaS complet en 3h", "Next.js + Supabase + Claude Code + MCP + Agent", "Phase 1 : Archi, BDD, Auth, API"]
  },
  {
    week: 4, id: 12, day: "Vendredi", title: "Projet Final + Certification",
    points: ["UI, tests, deploy Vercel", "Agent IA custom", "SaaS déployé", "Certification CODEX_AI + badge SENTINELLE"]
  }
];

const WEEK_TITLES = [
  "MAÎTRISER CLAUDE CODE",
  "MCP (MODEL CONTEXT PROTOCOL)",
  "AGENTS IA",
  "ASSEMBLER & DEVENIR DANGEREUX"
];

// --- Components ---

const TerminalDemo = () => {
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
    <div className="w-full max-w-2xl bg-[#1C1917] rounded-xl overflow-hidden shadow-2xl border border-stone-800 font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#262220] border-b border-stone-800">
        <div className="w-3 h-3 rounded-full bg-[#DC2626]/40" />
        <div className="w-3 h-3 rounded-full bg-[#FED7AA]/40" />
        <div className="w-3 h-3 rounded-full bg-[#16A34A]/40" />
        <span className="ml-2 text-stone-500 text-[10px] uppercase tracking-widest">codex_ai_terminal</span>
      </div>
      <div className="p-6 space-y-4 min-h-[280px]">
        <div className="flex gap-3">
          <span className="text-[#d97757]">$</span>
          <span className="text-stone-300">{text}<span className="animate-pulse">_</span></span>
        </div>
        <AnimatePresence>
          {text.length > 20 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 text-stone-400"
            >
              <div className="flex gap-2 items-center text-[#16A34A]">
                <ChevronRight size={14} />
                <span>Initializing project structure...</span>
              </div>
              <div className="flex gap-2 items-center">
                <ChevronRight size={14} />
                <span>Connecting to Supabase MCP server...</span>
              </div>
              <div className="flex gap-2 items-center">
                <ChevronRight size={14} />
                <span>Running sequential thinking agent...</span>
              </div>
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse" />
                  <span className="text-white text-xs">Generating: /components/AuthLayout.tsx</span>
                </div>
                <span className="text-[10px] text-stone-500">84%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SessionCard = ({ session }: { session: Session }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="flex-shrink-0 w-[400px] h-[500px] bg-white border border-stone-200 rounded-xl p-8 flex flex-col shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d97757] font-bold">
          Session {session.id} — {session.day}
        </span>
        <h3 className="text-2xl font-bold text-stone-900 leading-tight group-hover:text-[#d97757] transition-colors">
          {session.title}
        </h3>
      </div>
      <div className="p-2 rounded-lg bg-[#FFF7ED]">
        <Code2 size={20} className="text-[#d97757]" />
      </div>
    </div>

    <div className="flex-grow space-y-4">
      {session.points.map((point, idx) => (
        <div key={idx} className="flex gap-3 items-start">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-[#d97757] transition-colors flex-shrink-0" />
          <p className="text-sm text-stone-500 leading-relaxed">{point}</p>
        </div>
      ))}
    </div>

    <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-widest text-stone-400">Semaine {session.week} — {WEEK_TITLES[session.week - 1]}</span>
    </div>
  </motion.div>
);

const WeekSeparator = ({ week }: { week: number }) => (
  <div className="flex-shrink-0 flex items-center px-4">
    <div className="h-[300px] w-px bg-[#d97757]/20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFFCFA] py-8 -rotate-90 whitespace-nowrap">
        <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#d97757]/40">
          SEM. {week + 1} — {WEEK_TITLES[week]}
        </span>
      </div>
    </div>
  </div>
);

const LandingVibe6: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-92%"]);

  return (
    <div className="bg-[#FFFCFA] text-stone-900 font-mono selection:bg-[#d97757]/30">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-5 flex justify-between items-center bg-[#FFFCFA]/80 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="flex items-center gap-3">
          <div className="bg-[#d97757] p-2 rounded-lg">
            <Cpu className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-[#1C1917]">CODEX_AI</span>
        </div>
        <a href="/login" className="flex items-center gap-4 bg-[#FFF7ED] border border-[#FED7AA] px-6 py-3 rounded-full hover:bg-[#d97757] hover:border-[#d97757] hover:text-white transition-all group">
          <Lock className="w-5 h-5 text-[#d97757] group-hover:text-white" />
          <span className="text-xs uppercase tracking-widest text-[#d97757] font-bold group-hover:text-white">Se connecter</span>
        </a>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-[#d97757] blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%] w-64 h-64 rounded-full bg-[#FED7AA] blur-[120px]" />
        </div>

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10 pt-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]">
              <div className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d97757]">
                Formation Premium — Cohorte 2026
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-stone-900 leading-[0.9]">
              L&apos;IA NE VOUS<br />REMPLACERA PAS.<br />
              <span className="text-[#d97757]">LE DEV QUI L&apos;UTILISE, SI.</span>
            </h1>

            <p className="text-xl text-stone-500 max-w-lg leading-relaxed">
              4 semaines intensives pour maîtriser Claude Code, MCP et les agents IA autonomes. Ne subissez pas le futur, codez-le.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                disabled
                className="px-8 py-4 bg-stone-100 text-stone-400 rounded-xl font-bold flex items-center gap-3 cursor-not-allowed border border-stone-200"
              >
                INSCRIPTIONS FERMÉES
                <Lock size={18} />
              </button>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-400">Prochaine cohorte</span>
                <span className="text-sm font-bold text-stone-600">Printemps 2026</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block"
          >
            <TerminalDemo />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-stone-300"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll pour le programme</span>
          <div className="w-px h-12 bg-stone-200" />
        </motion.div>
      </section>

      {/* --- SECTION: LOGO WALL (MARKET DEMAND) --- */}
      <section className="py-24 bg-[#FFFCFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-[#d97757]/20 mb-4"
              >
                <TrendingUp className="w-3 h-3 text-[#d97757]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#d97757] uppercase">Marché en explosion</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-mono font-bold text-stone-900 leading-tight"
              >
                ILS RECRUTENT DES DEVS IA.<br />
                <span className="text-[#d97757]">EN ÊTES-VOUS UN ?</span>
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-md text-sm font-mono text-stone-500 leading-relaxed"
            >
              La demande pour des ingénieurs capables de piloter des agents et d&apos;intégrer des LLM a bondi de +340% en 12 mois. Les leaders de l&apos;industrie cherchent vos futures compétences.
            </motion.p>
          </div>
        </div>

        {/* Infinite Marquee 1 */}
        <div className="relative flex overflow-x-hidden border-y border-stone-100 bg-white py-6">
          <motion.div
            animate={{ x: [0, -1400] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 items-center px-8"
          >
            {[
              { name: "Airbus", logo: "/logos/airbus.svg" },
              { name: "Google", logo: "/logos/google.svg" },
              { name: "Microsoft", logo: "/logos/microsoft.svg" },
              { name: "Amazon AWS", logo: "/logos/amazon-aws.svg" },
              { name: "Meta", logo: "/logos/meta.svg" },
              { name: "Thales", logo: "/logos/thales.svg" },
              { name: "Capgemini", logo: "/logos/capgemini.svg" },
              { name: "Airbus", logo: "/logos/airbus.svg" },
              { name: "Google", logo: "/logos/google.svg" },
              { name: "Microsoft", logo: "/logos/microsoft.svg" },
              { name: "Amazon AWS", logo: "/logos/amazon-aws.svg" },
              { name: "Meta", logo: "/logos/meta.svg" },
              { name: "Thales", logo: "/logos/thales.svg" },
              { name: "Capgemini", logo: "/logos/capgemini.svg" },
            ].map((company, i) => (
              <img
                key={i}
                src={company.logo}
                alt={company.name}
                className="h-10 md:h-12 w-auto opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default flex-shrink-0"
              />
            ))}
          </motion.div>
        </div>

        {/* Infinite Marquee 2 (Reverse) */}
        <div className="relative flex overflow-x-hidden border-b border-stone-100 bg-white py-6">
          <motion.div
            animate={{ x: [-1400, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 items-center px-8"
          >
            {[
              { name: "Dassault Systèmes", logo: "/logos/dassault-systemes.svg" },
              { name: "OVHcloud", logo: "/logos/ovhcloud.svg" },
              { name: "Mistral AI", logo: "/logos/mistral-ai.svg" },
              { name: "Datadog", logo: "/logos/datadog.svg" },
              { name: "Criteo", logo: "/logos/criteo.svg" },
              { name: "BNP Paribas", logo: "/logos/bnp-paribas.svg" },
              { name: "Société Générale", logo: "/logos/societe-generale.svg" },
              { name: "Dassault Systèmes", logo: "/logos/dassault-systemes.svg" },
              { name: "OVHcloud", logo: "/logos/ovhcloud.svg" },
              { name: "Mistral AI", logo: "/logos/mistral-ai.svg" },
              { name: "Datadog", logo: "/logos/datadog.svg" },
              { name: "Criteo", logo: "/logos/criteo.svg" },
              { name: "BNP Paribas", logo: "/logos/bnp-paribas.svg" },
              { name: "Société Générale", logo: "/logos/societe-generale.svg" },
            ].map((company, i) => (
              <img
                key={i}
                src={company.logo}
                alt={company.name}
                className="h-10 md:h-12 w-auto opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default flex-shrink-0"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CURRICULUM SECTION (HORIZONTAL SCROLL) --- */}
      <section ref={containerRef} className="relative h-[600vh] bg-[#FFFCFA]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="px-8 mb-12 flex justify-between items-end max-w-7xl mx-auto w-full">
            <div className="space-y-4">
              <span className="text-[#d97757] text-[10px] uppercase tracking-[0.4em] font-bold block">LE CURRICULUM</span>
              <h2 className="text-5xl md:text-7xl font-bold text-[#1C1917] tracking-tighter leading-none">12 SESSIONS.<br />4 SEMAINES.<br />1 MUTATION.</h2>
            </div>
            <div className="hidden md:flex gap-4 items-center text-[#d97757] pb-2">
              <span className="text-sm font-bold uppercase tracking-widest">Scroll pour naviguer</span>
              <ArrowRight size={20} className="animate-[bounce-x_1s_infinite]" />
            </div>
          </div>

          <motion.div style={{ x }} className="flex gap-8 px-8 pl-[calc((100vw-1280px)/2)]">
            {SESSIONS.map((session) => (
              <React.Fragment key={session.id}>
                {session.id > 1 && session.id % 3 === 1 && (
                  <WeekSeparator week={session.week - 1} />
                )}
                <SessionCard session={session} />
              </React.Fragment>
            ))}

            {/* Summary Card */}
            <div className="flex-shrink-0 w-[450px] h-[500px] bg-[#1C1917] rounded-xl p-10 flex flex-col justify-between text-white border border-stone-800">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#d97757]/20 flex items-center justify-center border border-[#d97757]/30">
                  <ShieldCheck size={32} className="text-[#d97757]" />
                </div>
                <h3 className="text-3xl font-bold leading-tight">Certification<br />CODEX_AI</h3>
                <p className="text-stone-400 leading-relaxed">
                  Validation des acquis par la mise en production d&apos;un agent IA complet. Badge SENTINELLE délivré aux diplômés.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Durée</span>
                  <span className="text-xl font-bold">18h</span>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Sessions</span>
                  <span className="text-xl font-bold">12 Live</span>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Format</span>
                  <span className="text-xl font-bold">Remote</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <div className="bg-[#1C1917] py-12 overflow-hidden flex whitespace-nowrap border-y border-[#d97757]/30">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-24 items-center px-12">
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-bold text-white tracking-tighter">84%</span>
                <span className="text-stone-400 text-sm leading-tight uppercase tracking-widest">Stack Overflow<br />2025 adoption</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-bold text-[#d97757] tracking-tighter">41%</span>
                <span className="text-stone-400 text-sm leading-tight uppercase tracking-widest">State of Code<br />automation increase</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-bold text-white tracking-tighter">80%</span>
                <span className="text-stone-400 text-sm leading-tight uppercase tracking-widest">Gartner predicted<br />AI contribution</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-bold text-[#d97757] tracking-tighter">+56%</span>
                <span className="text-stone-400 text-sm leading-tight uppercase tracking-widest">PwC 2025<br />Dev performance</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* --- FORMAT SECTION --- */}
      <section className="py-32 px-6 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d97757]">Le Format</span>
            <h2 className="text-5xl font-bold tracking-tighter text-stone-900">Pas de théorie creuse.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Lives Interactifs", desc: "Sessions directes avec correction de bugs en temps réel. Pas de vidéos pré-enregistrées, du live pur." },
              { icon: Globe, title: "Plateforme Dédiée", desc: "Accès à vie à notre bibliothèque de prompts, serveurs MCP custom et replays haute définition." },
              { icon: Zap, title: "Projet Fil Rouge", desc: "Vous ne repartez pas avec des notes, mais avec un agent IA prêt pour la production." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="p-10 bg-[#FFFCFA] border border-stone-200 rounded-2xl space-y-6 transition-shadow hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FFF7ED] flex items-center justify-center border border-[#FED7AA]">
                  <feature.icon size={28} className="text-[#d97757]" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION: TESTIMONIALS (SOCIAL PROOF) --- */}
      <section className="py-24 bg-[#FFF7ED] border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#d97757] uppercase"
            >
              Retours d&apos;expérience
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-mono font-bold text-stone-900 mt-2"
            >
              ILS ONT PASSÉ LE CAP
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#d97757]" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-stone-900 text-sm">Thomas R.</h4>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-stone-400" />
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Freelance Fullstack</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="w-8 h-8 text-orange-100 absolute -top-4 -left-2 -z-0" />
                <p className="relative z-10 font-mono text-sm text-stone-600 leading-relaxed italic">
                  &quot;Avant CODEX_AI, je passais 6h sur une feature complexe. Maintenant, avec mes propres agents MCP, 2h max. Mes clients pensent que j&apos;ai embauché quelqu&apos;un pour scaler.&quot;
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-50">
                <span className="text-[10px] font-mono font-bold text-[#d97757] uppercase tracking-widest">Gain : Productivité x3</span>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl border border-[#d97757]/20 shadow-md hover:shadow-lg transition-all ring-1 ring-[#d97757]/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#d97757] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-stone-900 text-sm">Sarah M.</h4>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-stone-400" />
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Dev Senior en ESN</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="w-8 h-8 text-orange-100 absolute -top-4 -left-2 -z-0" />
                <p className="relative z-10 font-mono text-sm text-stone-600 leading-relaxed italic">
                  &quot;J&apos;ai décroché un poste d&apos;Architecte IA 3 mois après la formation. Les concepts d&apos;orchestration d&apos;agents ont fait toute la différence lors des entretiens techniques. Le ROI est dément.&quot;
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-50">
                <span className="text-[10px] font-mono font-bold text-green-600 uppercase tracking-widest">Résultat : Promotion Architecte</span>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#d97757]" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-stone-900 text-sm">Karim B.</h4>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-stone-400" />
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Étudiant en alternance</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="w-8 h-8 text-orange-100 absolute -top-4 -left-2 -z-0" />
                <p className="relative z-10 font-mono text-sm text-stone-600 leading-relaxed italic">
                  &quot;Mon premier agent IA autonome, construit en session 9, gère maintenant toute la documentation technique de mon entreprise. Mon maître d&apos;alternance n&apos;en revenait pas.&quot;
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-50">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">XP : Premier Agent Deployé</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHY NOW SECTION --- */}
      <section className="py-32 bg-[#1C1917] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full border-[60px] border-[#d97757] rounded-full translate-x-1/2 scale-150" />
        </div>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase">POURQUOI<br /><span className="text-[#d97757]">MAINTENANT ?</span></h2>

            <div className="space-y-8">
              {[
                { num: "01", text: "La fenêtre de tir se referme. En 2026, savoir prompter ne sera plus un avantage, ce sera le minimum syndical." },
                { num: "02", text: "Le code généré par l'IA pollue les bases de données mondiales. Apprenez à filtrer, raffiner et architecturer." },
                { num: "03", text: "Devenez un \"Full-Stack AI Developer\", capable de gérer seul ce qui demandait autrefois une équipe de 5." },
              ].map((arg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <span className="text-4xl font-bold text-[#d97757]/40 tracking-tighter">{arg.num}</span>
                  <p className="text-xl text-stone-400 leading-relaxed font-bold uppercase tracking-tight">{arg.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-80 h-80 rounded-full border-2 border-dashed border-stone-800"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-[#d97757]/30 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-[#d97757]/10 flex items-center justify-center">
                  <Bot size={64} className="text-[#d97757]" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-4xl font-bold mt-24">2026</span>
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#d97757]">L&apos;ère de l&apos;Agent</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-48 px-8 bg-[#FFFCFA] text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-24 border-4 border-[#1C1917] rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8"><Zap className="w-12 h-12 text-[#d97757]" /></div>
            <h2 className="text-6xl font-bold text-[#1C1917] mb-12 tracking-tighter leading-none uppercase">PRÊT POUR LA<br /><span className="text-[#d97757]">MUTATION ?</span></h2>
            <p className="text-xl text-[#78716C] mb-8 max-w-2xl mx-auto">
              12 sessions live, Full Remote, LUN/MER/VEN. Accès privé sur invitation uniquement.
            </p>
            <button disabled className="bg-stone-200 text-stone-500 cursor-not-allowed px-12 py-6 rounded-2xl text-xl font-bold uppercase tracking-[0.2em] flex items-center gap-4 mx-auto transition-all">
              <Lock className="w-6 h-6" />
              Inscriptions Fermées
            </button>
            <p className="mt-8 text-[10px] text-stone-400 uppercase tracking-widest font-bold">Ouverture de la prochaine cohorte : Printemps 2026</p>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-8 border-t border-[#E7E5E4] bg-[#FFF7ED]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="bg-[#1C1917] p-2 rounded-lg"><Cpu className="text-white w-6 h-6" /></div>
            <span className="text-xl font-bold tracking-tighter text-[#1C1917]">CODEX_AI</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#78716C] font-bold">Plateforme privée</span>
            <span className="text-xs uppercase tracking-[0.3em] text-[#A8A29E]">Accès sur invitation uniquement — 2026</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LandingVibe6;
