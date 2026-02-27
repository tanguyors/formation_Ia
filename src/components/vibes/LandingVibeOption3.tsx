"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Cpu, ShieldCheck, Zap, ChevronRight, Lock, Users,
  Code2, Bot, Globe, ArrowRight, Quote, Briefcase,
  GraduationCap, User, TrendingUp
} from 'lucide-react';

// --- Components ---

const Badge = ({ children, className = "", variant = "teal" }: { children: React.ReactNode; className?: string; variant?: "teal" | "muted" | "success" }) => {
  const base = "px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase border";
  const variants: Record<string, string> = {
    teal: "bg-white border-gray-200 text-[#0891B2]",
    muted: "bg-gray-50 border-gray-100 text-gray-400",
    success: "bg-white border-gray-200 text-[#0891B2]"
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
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
    <div className="w-full max-w-2xl bg-gray-50 rounded-xl border border-gray-200 overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        </div>
        <div className="text-gray-400 text-xs ml-2">terminal</div>
      </div>
      <div className="p-6 min-h-[160px]">
        <div className="flex gap-3">
          <span className="text-[#0891B2]">$</span>
          <span className="text-gray-600">
            {text}
            <span className="inline-block w-[2px] h-4 bg-[#0891B2] ml-1 animate-pulse" />
          </span>
        </div>
        <AnimatePresence>
          {text.length === fullText.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="text-[#0891B2]">Done.</div>
              <div className="text-gray-400">Installing dependencies...</div>
              <div className="text-gray-400">Connecting to Supabase MCP...</div>
              <div className="text-[#0891B2] font-medium">Ready on http://localhost:3000</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MarqueeLogos = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
  return (
    <div className="flex overflow-hidden select-none gap-16">
      <motion.div
        animate={{ x: reverse ? [0, -1000] : [-1000, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 items-center justify-around gap-16 min-w-full"
      >
        {items.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt="Partner Logo"
            className="h-7 w-auto grayscale opacity-30 hover:opacity-60 transition-opacity duration-500"
          />
        ))}
        {items.map((logo, idx) => (
          <img
            key={`dup-${idx}`}
            src={logo}
            alt="Partner Logo"
            className="h-7 w-auto grayscale opacity-30 hover:opacity-60 transition-opacity duration-500"
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

const SessionCard = ({ session, weekTitle }: { session: SessionData; weekTitle: string }) => {
  return (
    <div className="flex-shrink-0 w-[400px] h-[500px] bg-white border border-gray-100 rounded-2xl p-8 flex flex-col justify-between hover:shadow-sm transition-all duration-500 group">
      <div>
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">{weekTitle}</span>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight group-hover:text-[#0891B2] transition-colors duration-300">{session.title}</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 font-medium text-xs">
            {session.id}
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-gray-500 text-sm leading-relaxed">{session.desc}</p>
          <div className="space-y-2.5">
            {session.points.map((pt: string, i: number) => (
              <div key={i} className="flex items-start gap-3 text-xs text-gray-500">
                <div className="w-1 h-1 rounded-full bg-[#0891B2] mt-1.5 shrink-0" />
                {pt}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#0891B2] uppercase tracking-widest">{session.day}</span>
          <div className="flex items-center gap-1 text-[10px] text-gray-300">
            <Zap className="w-3 h-3" />
            <span>PRATIQUE</span>
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
    week: "MAITRISER CLAUDE CODE",
    sessions: [
      { id: "S1", day: "Lundi", title: "Setup & Premiers Pas", desc: "Configuration de l'environnement de travail nouvelle generation.", points: ["Installation Claude Code CLI", "Modele de tokens : Opus/Sonnet/Haiku", "Plans Pro ($20) vs Max ($100-200)", "Scaffolder une app Next.js en 5 min", "Exercice : Portfolio en 15 min"] },
      { id: "S2", day: "Mercredi", title: "CLAUDE.md & Context Engineering", desc: "Comment transformer Claude en un architecte senior qui connait votre codebase.", points: ["CLAUDE.md = cerveau persistant", "Context engineering = competence n\u00b01", "Slash commands (/init /compact /review...)", "Les hooks", "Atelier : CLAUDE.md complet + 3 hooks"] },
      { id: "S3", day: "Vendredi", title: "Vibe Coding vs Dev Assiste", desc: "Evitez les pieges de la generation de code massive et incontr\u00f4lee.", points: ["Vibe coding (dangereux) vs dev assiste (pro)", "45% de vulnerabilites", "Debug de code IA", "Challenge : Feature CRUD+UI+tests en 45 min"] }
    ]
  },
  {
    week: "MCP (MODEL CONTEXT PROTOCOL)",
    sessions: [
      { id: "S4", day: "Lundi", title: "Comprendre MCP", desc: "L'interface standard pour connecter l'IA a n'importe quel outil.", points: ["MCP = USB-C de l'IA", "Architecture client/serveur", "10 000+ serveurs ~2 000 verifies", "Securite : 43% failles injection", "Exercice : 3 serveurs MCP"] },
      { id: "S5", day: "Mercredi", title: "MCP en Pratique", desc: "Cas d'utilisation reels : bases de donnees, memoire et tests.", points: ["Supabase MCP", "Memory MCP", "Sequential Thinking", "Playwright MCP", "Atelier : App complete via MCP"] },
      { id: "S6", day: "Vendredi", title: "Creer son serveur MCP", desc: "Developpez vos propres outils personnalises pour vos besoins specifiques.", points: ["Spec MCP (Tasks OAuth Elicitation)", "tools resources prompts", "SDK TypeScript", "Challenge : Serveur MCP custom"] }
    ]
  },
  {
    week: "AGENTS IA",
    sessions: [
      { id: "S7", day: "Lundi", title: "Comprendre les Agents", desc: "De l'assistant passif a l'agent autonome qui execute des t\u00e2ches.", points: ["Agent vs chatbot vs workflow", "Patterns orchestrateur router pipeline", "Frameworks Claude Agent SDK LangGraph CrewAI", "Marche $7.84B\u2192$52B", "Exercice : 3 agents open-source"] },
      { id: "S8", day: "Mercredi", title: "Claude Agent SDK", desc: "Exploitation profonde du SDK officiel d'Anthropic pour les agents.", points: ["Architecture et concepts", "Premier agent avec tools/guardrails/handoffs", "Subagents et multi-agent", "Atelier : Agent code review GitHub"] },
      { id: "S9", day: "Vendredi", title: "Agent Multi-Etapes", desc: "Gerer des workflows complexes sur de longues durees.", points: ["Production monitoring co\u00fbts", "Patterns avances human-in-the-loop memory", "Challenge : Agent brief\u2192wireframe\u2192code\u2192tests\u2192deploy"] }
    ]
  },
  {
    week: "ASSEMBLER & DEVENIR DANGEREUX",
    sessions: [
      { id: "S10", day: "Lundi", title: "Workflow Pro Complet", desc: "Integration finale de tous les outils vus precedemment.", points: ["Claude Code + MCP + Agents", "Workflow quotidien optimise", "CI/CD IA + hooks Git", "Exercice : Workflow sur projet existant"] },
      { id: "S11", day: "Mercredi", title: "Projet Final Partie 1", desc: "Demarrage de la construction de votre application SaaS IA.", points: ["SaaS complet en 3h", "Next.js + Supabase + Claude Code + MCP + Agent", "Phase 1 : Archi BDD Auth API"] },
      { id: "S12", day: "Vendredi", title: "Projet Final + Certification", desc: "Finalisation, deploiement et validation des acquis.", points: ["UI tests deploy Vercel", "Agent IA custom", "SaaS deploye", "Certification CODEX_AI + badge SENTINELLE"] }
    ]
  }
];

// --- Main Page ---

export default function LandingVibeOption3() {
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
    <div className="min-h-screen bg-white font-sans selection:bg-[#0891B2]/10 selection:text-[#0891B2]">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#0891B2]" />
            <span className="font-semibold text-gray-900 tracking-tight text-sm">CODEX_AI</span>
          </div>
          <a href="/login" className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors duration-300">
            <Lock className="w-3.5 h-3.5" />
            Se connecter
          </a>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <Badge>Formation Premium &mdash; Cohorte 2026</Badge>
            <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-[1.08] tracking-tight">
              L&apos;IA ne vous remplacera pas.{" "}
              <span className="text-[#0891B2]">Le dev qui l&apos;utilise, si.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              4 semaines intensives pour ma&icirc;triser Claude Code, MCP et les agents IA autonomes.
              Ne subissez pas le futur, codez-le.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button disabled className="px-7 py-3.5 bg-gray-50 text-gray-400 rounded-xl text-sm font-medium flex items-center gap-2 cursor-not-allowed border border-gray-100">
                <Lock className="w-4 h-4" />
                Inscriptions ferm&eacute;es
              </button>
              <div className="flex flex-col justify-center pl-1">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Prochaine cohorte</span>
                <span className="text-sm text-gray-500">Printemps 2026</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Terminal />
          </motion.div>
        </div>
      </section>

      {/* --- LOGO WALL --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 mb-14 text-center space-y-2">
          <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.3em]">Ils recrutent des devs IA. En &ecirc;tes-vous un ?</h2>
          <p className="text-gray-400 text-xs">+340% de demande pour les profils ma&icirc;trisant les agents autonomes en 2025.</p>
        </div>
        <div className="space-y-10 overflow-hidden">
          <MarqueeLogos items={LOGOS_ROW_1} />
          <MarqueeLogos items={LOGOS_ROW_2} reverse />
        </div>
      </section>

      {/* --- CURRICULUM (Horizontal Scroll) --- */}
      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="px-6 max-w-7xl mx-auto w-full mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                12 sessions. 4 semaines.{" "}
                <span className="text-[#0891B2]">1 mutation.</span>
              </h2>
            </motion.div>
          </div>

          <motion.div style={{ x }} className="flex gap-6 px-6 lg:px-[10%]">
            <div ref={scrollContentRef} className="flex gap-6">
              {CURRICULUM.map((week, wIdx) => (
                <div key={wIdx} className="flex gap-6">
                  {week.sessions.map((session, sIdx) => (
                    <SessionCard key={sIdx} session={session} weekTitle={week.week} />
                  ))}
                </div>
              ))}

              {/* --- CERTIFICATION CARD --- */}
              <div className="flex-shrink-0 w-[480px] h-[500px] bg-gray-900 rounded-2xl p-12 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="z-10">
                  <div className="w-14 h-14 bg-[#0891B2] rounded-xl flex items-center justify-center mb-8">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 tracking-tight">Certification CODEX_AI</h3>
                  <p className="text-gray-400 leading-relaxed text-sm mb-10">
                    Validation des acquis par la mise en production d&apos;un agent IA complet.
                    Badge SENTINELLE d&eacute;livr&eacute; aux dipl&ocirc;m&eacute;s.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dur&eacute;e</div>
                      <div className="text-lg font-semibold">18h de Live</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Format</div>
                      <div className="text-lg font-semibold">Full Remote</div>
                    </div>
                  </div>
                </div>
                <div className="z-10 pt-8 border-t border-gray-800 flex justify-between items-end">
                  <div className="text-xs font-medium tracking-tight text-gray-500">Cohorte 2026</div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase bg-[#0891B2] text-white">SENTINELLE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="bg-gray-900 py-10 overflow-hidden">
        <div className="flex overflow-hidden whitespace-nowrap gap-16">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center shrink-0"
          >
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <span className="text-gray-500 font-medium tracking-widest text-xs flex items-center gap-3">
                  <TrendingUp className="text-[#0891B2] w-4 h-4" /> 84% STACK OVERFLOW 2025 ADOPTION
                </span>
                <span className="text-gray-500 font-medium tracking-widest text-xs flex items-center gap-3">
                  <TrendingUp className="text-[#0891B2] w-4 h-4" /> 41% STATE OF CODE AUTOMATION INCREASE
                </span>
                <span className="text-gray-500 font-medium tracking-widest text-xs flex items-center gap-3">
                  <TrendingUp className="text-[#0891B2] w-4 h-4" /> 80% GARTNER PREDICTED AI CONTRIBUTION
                </span>
                <span className="text-gray-500 font-medium tracking-widest text-xs flex items-center gap-3">
                  <TrendingUp className="text-[#0891B2] w-4 h-4" /> +56% PWC 2025 DEV PERFORMANCE
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FORMAT --- */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-3">
          <Badge variant="muted">Le format</Badge>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Pas de th&eacute;orie creuse.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "Lives Interactifs", desc: "Sessions directes avec correction de bugs en temps r\u00e9el. Pas de vid\u00e9os pr\u00e9-enregistr\u00e9es, du live pur." },
            { icon: Globe, title: "Plateforme D\u00e9di\u00e9e", desc: "Acc\u00e8s \u00e0 vie \u00e0 notre biblioth\u00e8que de prompts, serveurs MCP custom et replays HD." },
            { icon: Zap, title: "Projet Fil Rouge", desc: "Vous ne repartez pas avec des notes, mais avec un agent IA pr\u00eat pour la production." }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all duration-500 group">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#0891B2] mb-6 group-hover:bg-[#0891B2]/5 transition-colors duration-300">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-40 px-6 border-y border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="space-y-3">
              <Badge variant="muted">T&eacute;moignages</Badge>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Ils ont pass&eacute; le cap</h2>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300">
                <Quote className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Thomas R.", role: "Freelance Fullstack", text: "Avant CODEX_AI, je passais 6h sur une feature complexe. Maintenant, avec mes propres agents MCP, 2h max.", metric: "Productivit\u00e9 x3" },
              { name: "Sarah M.", role: "Dev Senior en ESN", text: "J'ai d\u00e9croch\u00e9 un poste d'Architecte IA 3 mois apr\u00e8s la formation. Le ROI est d\u00e9ment.", metric: "Promotion Architecte" },
              { name: "Karim B.", role: "\u00c9tudiant en alternance", text: "Mon premier agent IA autonome, construit en session 9, g\u00e8re maintenant toute la documentation technique de mon entreprise.", metric: "Premier Agent Deploy\u00e9" }
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all duration-500">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Zap key={s} className="w-3 h-3 text-[#0891B2] fill-[#0891B2]" />)}
                </div>
                <p className="text-gray-600 text-sm mb-10 leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                  <span className="text-[10px] font-medium text-[#0891B2] tracking-wide">{t.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY NOW --- */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-14">
            <h2 className="text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
              Pourquoi{" "}
              <span className="text-[#0891B2]">maintenant ?</span>
            </h2>
            <div className="space-y-10">
              {[
                { n: "01", t: "La fen\u00eatre de tir se referme.", d: "En 2026, savoir prompter ne sera plus un avantage, ce sera le minimum syndical." },
                { n: "02", t: "Le code g\u00e9n\u00e9r\u00e9 par l\u2019IA pollue les bases de donn\u00e9es mondiales.", d: "Apprenez \u00e0 filtrer, raffiner et architecturer plut\u00f4t que de simplement g\u00e9n\u00e9rer." },
                { n: "03", t: "Devenez un Full-Stack AI Developer.", d: "Capable de g\u00e9rer seul ce qui demandait autrefois une \u00e9quipe de 5 personnes." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="text-xl font-semibold text-gray-200">{item.n}</span>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">{item.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-[360px] h-[360px] border border-gray-100 rounded-full flex items-center justify-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 border border-gray-100 rounded-xl">
                <Bot className="w-6 h-6 text-[#0891B2]" />
              </div>
            </motion.div>
            <div className="absolute text-center space-y-1">
              <div className="text-5xl font-semibold text-gray-900 tracking-tight">2026</div>
              <div className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">L&apos;&egrave;re de l&apos;Agent</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 px-6">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-semibold text-white tracking-tight">
              Pr&ecirc;t pour la{" "}
              <span className="text-[#0891B2]">mutation ?</span>
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              12 sessions live, Full Remote, LUN/MER/VEN.
              Acc&egrave;s priv&eacute; sur invitation uniquement.
            </p>
            <div className="flex flex-col items-center gap-5">
              <button disabled className="px-10 py-4 bg-white/5 text-gray-500 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 cursor-not-allowed">
                <Lock className="w-4 h-4" />
                Inscriptions Ferm&eacute;es
              </button>
              <div className="text-xs font-medium text-[#0891B2] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0891B2] animate-pulse" />
                Ouverture de la prochaine cohorte : Printemps 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0891B2]" />
            <span className="font-medium text-gray-900 text-sm">CODEX_AI</span>
          </div>
          <div className="flex gap-8 text-xs text-gray-400">
            <span className="hover:text-gray-900 transition-colors duration-300 cursor-pointer">Plateforme priv&eacute;e</span>
            <span className="hover:text-gray-900 transition-colors duration-300 cursor-pointer">Conditions</span>
            <span className="hover:text-gray-900 transition-colors duration-300 cursor-pointer">Support</span>
          </div>
          <div className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
            Acc&egrave;s sur invitation uniquement &mdash; 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
