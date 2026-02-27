"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Cpu, ShieldCheck, Zap, ChevronRight, Lock, Users,
  Code2, Bot, Globe, ArrowRight, Quote, Briefcase,
  GraduationCap, User, TrendingUp
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Badge = ({ children, className, variant = "indigo" }: { children: React.ReactNode, className?: string, variant?: "indigo" | "slate" | "error" | "success" }) => {
  const variants = {
    indigo: "bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]",
    slate: "bg-slate-100 border-slate-200 text-slate-500",
    error: "bg-red-50 border-red-100 text-red-600",
    success: "bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

const Terminal = () => {
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
    <div className="w-full max-w-2xl bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
        </div>
        <div className="text-slate-500 text-xs ml-2">bash — 80x24</div>
      </div>
      <div className="p-6 min-h-[160px]">
        <div className="flex gap-3">
          <span className="text-[#F97316]">➜</span>
          <span className="text-slate-300">
            {text}
            <span className="inline-block w-2 h-4 bg-[#F97316] ml-1 animate-pulse" />
          </span>
        </div>
        <AnimatePresence>
          {text.length === fullText.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="text-[#F97316]">✔ Scaffolding complete.</div>
              <div className="text-slate-500">Installing dependencies (lucide, framer-motion, tailwind)...</div>
              <div className="text-slate-500">Connecting to Supabase MCP...</div>
              <div className="text-[#F97316] font-bold">Ready on http://localhost:3000</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MarqueeLogos = ({ items, reverse = false, speed = 35 }: { items: string[], reverse?: boolean, speed?: number }) => {
  return (
    <div className="flex overflow-hidden select-none relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: reverse ? [0, -1400] : [-1400, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 items-center gap-20 min-w-full"
      >
        {[...items, ...items, ...items].map((logo, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.2, y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group/logo flex-shrink-0"
          >
            <div className="absolute -inset-4 rounded-2xl transition-all duration-500" />
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto opacity-40 hover:opacity-100 transition-all duration-500 cursor-pointer relative z-10"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const TickerBand = ({ items, reverse = false, speed = 25 }: { items: string[], reverse?: boolean, speed?: number }) => {
  return (
    <section className="bg-slate-950 py-5 overflow-hidden border-y border-slate-800">
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: reverse ? [-2000, 0] : [0, -2000] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
          className="flex items-center shrink-0"
        >
          {[1, 2, 3, 4].map((rep) => (
            <React.Fragment key={rep}>
              {items.map((item, idx) => (
                <span key={idx} className="text-slate-500 font-bold tracking-widest text-sm flex items-center gap-3 mx-8">
                  <span className="text-[#F97316]">◆</span> {item}
                </span>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface SessionData {
  id: string;
  day: string;
  title: string;
  desc: string;
  points: string[];
}

const SessionCard = ({ session, weekTitle }: { session: SessionData, weekTitle: string }) => {
  return (
    <div className="flex-shrink-0 w-[400px] h-[500px] bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#F97316]/20 transition-all group">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{weekTitle}</span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#F97316] transition-colors">{session.title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-sm">
            {session.id}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-slate-500 text-sm leading-relaxed">{session.desc}</p>
          <div className="space-y-2">
            {session.points.map((pt: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-1 h-1 rounded-full bg-[#F97316]" />
                {pt}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">{session.day}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
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

export default function LandingVibeOption1() {
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
    <div className="min-h-screen bg-white font-sans selection:bg-[#F97316]/20 selection:text-[#F97316]">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#F97316]" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">CODEX_AI</span>
          </div>
          <a href="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <Lock className="w-4 h-4" />
            Se connecter
          </a>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-slate-100 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-dashed border-[#F97316]/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-slate-100 rounded-full"
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#F97316]"
              style={{
                top: `${20 + (i * 12)}%`,
                left: `${10 + (i * 15)}%`,
              }}
            />
          ))}

          {/* Glowing orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#F97316] rounded-full blur-[200px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-slate-400 rounded-full blur-[150px]"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 pt-20">
          {/* Badge with staggered entrance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge>Formation Premium — Cohorte 2026</Badge>
          </motion.div>

          {/* Headline with word-by-word reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter"
            >
              L&apos;IA NE VOUS
              <br />
              REMPLACERA PAS.
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-[#F97316] leading-[0.9] tracking-tighter"
            >
              LE DEV QUI
              <br />
              L&apos;UTILISE, SI.
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          >
            4 semaines intensives pour maîtriser Claude Code, MCP et les agents IA autonomes.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <button disabled className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-bold flex items-center gap-3 cursor-not-allowed text-lg">
              <Lock className="w-5 h-5" />
              INSCRIPTIONS FERMÉES
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-sm font-semibold text-slate-500">Prochaine cohorte : <span className="text-slate-900">Printemps 2026</span></span>
            </div>
          </motion.div>

          {/* Terminal below */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="pt-8 max-w-2xl mx-auto"
          >
            <Terminal />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- LOGO WALL --- */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Top animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent origin-center"
        />

        <div className="max-w-7xl mx-auto px-6">
          {/* Compact header row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-14"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Ils recrutent des devs IA. <span className="text-[#F97316]">En êtes-vous un ?</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-sm font-bold text-[#F97316]">+340%</span>
              <span className="text-xs text-slate-400">de demande en profils IA autonomes</span>
            </div>
          </motion.div>

          {/* Logos with decorative separator */}
          <div className="space-y-8">
            <MarqueeLogos items={LOGOS_ROW_1} speed={30} />

            {/* Animated dot separator */}
            <div className="flex items-center gap-6 px-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200" />
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#F97316]"
                  />
                ))}
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
            </div>

            <MarqueeLogos items={LOGOS_ROW_2} reverse speed={30} />
          </div>
        </div>

        {/* Bottom animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent origin-center"
        />
      </section>

      {/* --- L'AVENIR APPARTIENT AUX DEVS IA --- */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <Badge>Réalité du marché</Badge>
                <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[0.95]">
                  Sans IA, vous êtes<br />
                  <span className="text-[#F97316]">déjà en retard.</span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  Aujourd&apos;hui, les juniors sans compétences IA ne sont plus recrutés. Demain, ce sera le tour des seniors. D&apos;ici 2028, aucun développeur ne décrochera un poste sans maîtriser les outils IA. Le compte à rebours a commencé.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: User, title: "Juniors : la porte se ferme.", text: "Les recruteurs exigent déjà des compétences IA pour les postes juniors. Sans elles, votre CV finit à la poubelle." },
                  { icon: Code2, title: "Seniors : vous êtes les prochains.", text: "Un senior sans IA produit moins qu'un junior qui la maîtrise. Le rapport de force s'inverse." },
                  { icon: TrendingUp, title: "Freelances : multipliez vos revenus.", text: "Gérez x50 chantiers en parallèle avec la même qualité. Plus de volume, plus de clients, plus de CA." },
                  { icon: Lock, title: "2028 : plus personne sans IA.", text: "Ne pas maîtriser l'IA sera comme ne pas savoir utiliser Git en 2015. Impensable pour un recruteur." },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F97316] transition-colors duration-300">
                      <item.icon className="w-5 h-5 text-[#F97316] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: visual stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 bg-slate-50 rounded-2xl border border-slate-100 col-span-2"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#F97316] animate-pulse" />
                  <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest">Freelances</span>
                </div>
                <div className="text-5xl font-black text-slate-900 mb-2">x50</div>
                <p className="text-slate-500 text-sm">projets gérables en parallèle grâce aux agents IA — même qualité, volume massif</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-slate-900 mb-2">0%</div>
                <p className="text-slate-500 text-sm">de postes juniors sans exigence IA d&apos;ici 2027</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-4xl font-black text-slate-900 mb-2">x10</div>
                <p className="text-slate-500 text-sm">la vitesse de livraison d&apos;un dev qui maîtrise les agents autonomes</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-8 bg-slate-900 rounded-2xl text-white col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F97316] uppercase tracking-widest mb-3">La réalité en 2028</div>
                    <div className="text-2xl font-bold mb-1">Pas d&apos;IA = pas de job.</div>
                    <p className="text-slate-400 text-sm">Comme ne pas connaître Git en 2015 ou JavaScript en 2010. Impensable.</p>
                  </div>
                  <Lock className="w-12 h-12 text-[#F97316] flex-shrink-0" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- BANDEAU 2 : PUNCHLINES --- */}
      <TickerBand
        reverse
        items={["UN DEV IA REMPLACE UNE ÉQUIPE DE 5", "LE CODE SE GÉNÈRE, LE SAVOIR S'ACQUIERT", "PROMPTER N'EST PLUS UN AVANTAGE — C'EST LE MINIMUM", "L'IA NE VOUS REMPLACERA PAS. LE DEV QUI L'UTILISE, SI."]}
        speed={35}
      />

      {/* --- FORMAT --- */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-16 items-end mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge>Le format</Badge>
              <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[0.95]">
                Pas de théorie creuse.<br />
                <span className="text-[#F97316]">Du concret.</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg text-slate-500 leading-relaxed"
            >
              Chaque session est un sprint de 1h30 en live. Vous codez, on corrige, vous repartez avec du code qui tourne en production. Pas de slides PowerPoint.
            </motion.p>
          </div>

          {/* Main format cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Users,
                title: "Lives Interactifs",
                desc: "Sessions directes avec correction de bugs en temps réel. Pas de vidéos pré-enregistrées, du live pur.",
                details: ["12 sessions de 1h30", "LUN / MER / VEN", "Replays disponibles 24h"],
                stat: "12",
                statLabel: "sessions live"
              },
              {
                icon: Globe,
                title: "Plateforme Dédiée",
                desc: "Accès à vie à notre bibliothèque de prompts, serveurs MCP custom et replays haute définition.",
                details: ["Bibliothèque de prompts", "Serveurs MCP pré-configurés", "Accès à vie"],
                stat: "∞",
                statLabel: "accès illimité"
              },
              {
                icon: Zap,
                title: "Projet Fil Rouge",
                desc: "Vous ne repartez pas avec des notes, mais avec un agent IA prêt pour la production.",
                details: ["SaaS complet déployé", "Agent IA autonome", "Certification CODEX_AI"],
                stat: "1",
                statLabel: "SaaS déployé"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="h-full p-10 bg-white border border-slate-200 rounded-2xl hover:border-[#F97316]/30 hover:shadow-xl transition-all duration-500">
                  {/* Stat watermark */}
                  <div className="absolute top-6 right-8 text-7xl font-black text-slate-50 group-hover:text-[#F97316]/5 transition-colors select-none">{item.stat}</div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center mb-8 group-hover:bg-[#F97316] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-500">
                      <item.icon className="w-7 h-7 text-[#F97316] group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{item.desc}</p>

                    {/* Detail list */}
                    <div className="space-y-3 pt-6 border-t border-slate-100">
                      {item.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                            <ChevronRight className="w-3 h-3 text-[#F97316]" />
                          </div>
                          <span className="text-sm text-slate-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden"
          >
            {[
              { value: "18h", label: "de formation live" },
              { value: "4 sem.", label: "de programme intensif" },
              { value: "100%", label: "remote & flexible" },
              { value: "À vie", label: "accès à la plateforme" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 text-center group hover:bg-slate-50 transition-colors">
                <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-[#F97316] transition-colors">{item.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BANDEAU 3 : OUTILS DE LA FORMATION --- */}
      <TickerBand items={["CLAUDE CODE CLI", "SUPABASE MCP", "PLAYWRIGHT MCP", "AGENT SDK", "SEQUENTIAL THINKING", "MEMORY MCP", "NEXT.JS 15", "PRISMA ORM", "VERCEL DEPLOY", "TYPESCRIPT"]} />

      {/* --- CURRICULUM (Horizontal Scroll) --- */}
      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="px-6 max-w-7xl mx-auto w-full mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight"
            >
              12 SESSIONS. 4 SEMAINES. <br />
              <span className="text-[#F97316]">1 MUTATION.</span>
            </motion.h2>
          </div>

          <motion.div style={{ x }} className="flex gap-8 px-6 lg:px-[10%]">
            <div ref={scrollContentRef} className="flex gap-8">
              {CURRICULUM.map((week, wIdx) => (
                <div key={wIdx} className="flex gap-8">
                  {week.sessions.map((session, sIdx) => (
                    <SessionCard key={sIdx} session={session} weekTitle={week.week} />
                  ))}
                </div>
              ))}

              {/* --- CERTIFICATION CARD --- */}
              <div className="flex-shrink-0 w-[500px] h-[500px] bg-slate-900 rounded-2xl p-12 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/20 blur-[100px] -mr-32 -mt-32" />
                <div className="z-10">
                  <div className="w-16 h-16 bg-[#F97316] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Certification CODEX_AI</h3>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    Validation des acquis par la mise en production d&apos;un agent IA complet.
                    Badge SENTINELLE délivré aux diplômés.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Durée</div>
                      <div className="text-xl font-bold">18h de Live</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Format</div>
                      <div className="text-xl font-bold">Full Remote</div>
                    </div>
                  </div>
                </div>
                <div className="z-10 pt-8 border-t border-slate-800 flex justify-between items-end">
                  <div className="text-sm font-bold tracking-tighter">COHORTE 2026</div>
                  <Badge variant="indigo" className="bg-[#F97316] text-white border-none">SENTINELLE</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- BANDEAU 4 : STATS MARCHÉ --- */}
      <TickerBand
        reverse
        items={["84% STACK OVERFLOW 2025 — ADOPTION IA", "41% AUTOMATISATION DU CODE EN HAUSSE", "80% GARTNER — CONTRIBUTION IA AU CODE", "+56% PERFORMANCE DEV — PWC 2025", "$7.84B → $52B MARCHÉ AGENTS IA"]}
        speed={30}
      />

      {/* --- WHY NOW --- */}
      <section className="py-32 px-6 overflow-hidden bg-white relative">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Subtle orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#F97316]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-slate-200/30 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]">Urgence</Badge>
              <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[0.95] tracking-tight">
                POURQUOI<br /><span className="text-[#F97316]">MAINTENANT ?</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Le marché n&apos;attend pas. Chaque mois qui passe élargit le fossé entre ceux qui maîtrisent l&apos;IA et les autres.
              </p>
            </motion.div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { value: "340%", label: "Hausse de la demande\nen ingénieurs IA", icon: TrendingUp },
              { value: "2026", label: "Année où prompter\ndevient le minimum", icon: Zap },
              { value: "1→5", label: "Un dev IA remplace\nune équipe de 5", icon: Users },
              { value: "45%", label: "Du code IA contient\ndes vulnérabilités", icon: ShieldCheck },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#F97316]/30 hover:shadow-lg transition-all duration-500">
                  <stat.icon className="w-5 h-5 text-[#F97316]/60 mb-4" />
                  <div className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">{stat.value}</div>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Arguments */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { n: "01", icon: Lock, t: "La fenêtre se referme.", d: "En 2026, savoir prompter ne sera plus un avantage — ce sera le minimum syndical. Les développeurs qui ne maîtrisent pas les agents IA seront dépassés." },
              { n: "02", icon: Code2, t: "Le code IA pollue.", d: "45% du code généré par IA contient des failles. Apprenez à filtrer, raffiner et architecturer au lieu de copier-coller aveuglément." },
              { n: "03", icon: Bot, t: "Devenez l'équipe de 5.", d: "Un Full-Stack AI Developer gère seul ce qui demandait autrefois une équipe entière. C'est le profil le plus recherché de 2026." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.15 }}
                className="relative group"
              >
                <div className="h-full p-10 rounded-2xl bg-white border border-slate-200 hover:border-[#F97316]/30 hover:shadow-lg transition-all duration-500">
                  {/* Number watermark */}
                  <div className="absolute top-6 right-8 text-8xl font-black text-slate-100 select-none">{item.n}</div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-6 group-hover:bg-[#F97316]/20 transition-colors">
                      <item.icon className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.t}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex items-center justify-center gap-4"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-300" />
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">2026 — L&apos;ère de l&apos;Agent</span>
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-300" />
          </motion.div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#F9731610,transparent)]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
              PRÊT POUR LA <span className="text-[#F97316]">MUTATION ?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              12 sessions live, Full Remote, LUN/MER/VEN. <br />
              Accès privé sur invitation uniquement.
            </p>
            <div className="flex flex-col items-center gap-6">
              <button disabled className="px-12 py-5 bg-white/5 text-slate-500 border border-white/10 rounded-2xl font-bold flex items-center gap-3 cursor-not-allowed">
                <Lock className="w-5 h-5" />
                Inscriptions Fermées
              </button>
              <div className="text-sm font-semibold text-[#F97316] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                Ouverture de la prochaine cohorte : Printemps 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="font-bold text-slate-900">CODEX_AI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Plateforme privée</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Conditions</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Support</span>
          </div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Accès sur invitation uniquement — 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
