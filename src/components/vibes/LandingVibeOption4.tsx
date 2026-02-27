"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Cpu, ShieldCheck, Zap, ChevronRight, Lock, Users,
  Code2, Bot, Globe, ArrowRight, Quote, Briefcase,
  GraduationCap, User, TrendingUp
} from 'lucide-react';

// --- Components ---

const Badge = ({ children, className = "", variant = "gold" }: { children: React.ReactNode, className?: string, variant?: "gold" | "dark" | "success" | "muted" }) => {
  const variants: Record<string, string> = {
    gold: "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]",
    dark: "bg-black border-black text-white",
    success: "bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C]",
    muted: "bg-gray-100 border-gray-200 text-gray-500"
  };

  return (
    <span className={`px-4 py-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase border ${variants[variant]} ${className}`}>
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
    <div className="w-full max-w-2xl bg-black border border-black shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-black border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#C9A84C]" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <div className="text-white/30 text-xs ml-2 font-sans tracking-widest uppercase">Terminal</div>
      </div>
      <div className="p-6 min-h-[160px]">
        <div className="flex gap-3">
          <span className="text-[#C9A84C]">&#9656;</span>
          <span className="text-white/80">
            {text}
            <span className="inline-block w-2 h-4 bg-[#C9A84C] ml-1 animate-pulse" />
          </span>
        </div>
        <AnimatePresence>
          {text.length === fullText.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="text-[#C9A84C]">&#10003; Scaffolding complete.</div>
              <div className="text-white/30">Installing dependencies (lucide, framer-motion, tailwind)...</div>
              <div className="text-white/30">Connecting to Supabase MCP...</div>
              <div className="text-[#C9A84C] font-bold">Ready on http://localhost:3000</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MarqueeLogos = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => {
  return (
    <div className="flex overflow-hidden select-none gap-16 group">
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
            className="h-8 w-auto grayscale opacity-30 hover:opacity-80 transition-all duration-500 cursor-pointer"
          />
        ))}
        {items.map((logo, idx) => (
          <img
            key={`dup-${idx}`}
            src={logo}
            alt="Partner Logo"
            className="h-8 w-auto grayscale opacity-30 hover:opacity-80 transition-all duration-500 cursor-pointer"
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

const SessionCard = ({ session, weekTitle }: { session: SessionData, weekTitle: string }) => {
  return (
    <div className="flex-shrink-0 w-[400px] h-[500px] bg-white border border-black/10 p-8 flex flex-col justify-between hover:border-black hover:shadow-lg hover:border-l-2 hover:border-l-[#C9A84C] transition-all group">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-[0.25em]">{weekTitle}</span>
            <h3 className="text-xl font-serif font-bold text-black group-hover:text-[#C9A84C] transition-colors">{session.title}</h3>
          </div>
          <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-gray-400 font-sans font-bold text-sm group-hover:border-[#C9A84C] group-hover:text-[#C9A84C] transition-colors">
            {session.id}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed font-sans">{session.desc}</p>
          <div className="space-y-2">
            {session.points.map((pt: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs text-gray-600 font-sans">
                <div className="w-1.5 h-px bg-[#C9A84C]" />
                {pt}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-black/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.25em] font-sans">{session.day}</span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-sans">
            <Zap className="w-3 h-3" />
            <span className="tracking-widest">PRATIQUE INTENSIVE</span>
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
    week: "MA\u00CETRISER CLAUDE CODE",
    sessions: [
      { id: "S1", day: "Lundi", title: "Setup & Premiers Pas", desc: "Configuration de l\u2019environnement de travail nouvelle g\u00e9n\u00e9ration.", points: ["Installation Claude Code CLI", "Mod\u00e8le de tokens : Opus/Sonnet/Haiku", "Plans Pro ($20) vs Max ($100-200)", "Scaffolder une app Next.js en 5 min", "Exercice : Portfolio en 15 min"] },
      { id: "S2", day: "Mercredi", title: "CLAUDE.md & Context Engineering", desc: "Comment transformer Claude en un architecte senior qui conna\u00eet votre codebase.", points: ["CLAUDE.md = cerveau persistant", "Context engineering = comp\u00e9tence n\u00b01", "Slash commands (/init /compact /review...)", "Les hooks", "Atelier : CLAUDE.md complet + 3 hooks"] },
      { id: "S3", day: "Vendredi", title: "Vibe Coding vs Dev Assist\u00e9", desc: "\u00c9vitez les pi\u00e8ges de la g\u00e9n\u00e9ration de code massive et incontr\u00f4l\u00e9e.", points: ["Vibe coding (dangereux) vs dev assist\u00e9 (pro)", "45% de vuln\u00e9rabilit\u00e9s", "Debug de code IA", "Challenge : Feature CRUD+UI+tests en 45 min"] }
    ]
  },
  {
    week: "MCP (MODEL CONTEXT PROTOCOL)",
    sessions: [
      { id: "S4", day: "Lundi", title: "Comprendre MCP", desc: "L\u2019interface standard pour connecter l\u2019IA \u00e0 n\u2019importe quel outil.", points: ["MCP = USB-C de l\u2019IA", "Architecture client/serveur", "10 000+ serveurs ~2 000 v\u00e9rifi\u00e9s", "S\u00e9curit\u00e9 : 43% failles injection", "Exercice : 3 serveurs MCP"] },
      { id: "S5", day: "Mercredi", title: "MCP en Pratique", desc: "Cas d\u2019utilisation r\u00e9els : bases de donn\u00e9es, m\u00e9moire et tests.", points: ["Supabase MCP", "Memory MCP", "Sequential Thinking", "Playwright MCP", "Atelier : App compl\u00e8te via MCP"] },
      { id: "S6", day: "Vendredi", title: "Cr\u00e9er son serveur MCP", desc: "D\u00e9veloppez vos propres outils personnalis\u00e9s pour vos besoins sp\u00e9cifiques.", points: ["Spec MCP (Tasks OAuth Elicitation)", "tools resources prompts", "SDK TypeScript", "Challenge : Serveur MCP custom"] }
    ]
  },
  {
    week: "AGENTS IA",
    sessions: [
      { id: "S7", day: "Lundi", title: "Comprendre les Agents", desc: "De l\u2019assistant passif \u00e0 l\u2019agent autonome qui ex\u00e9cute des t\u00e2ches.", points: ["Agent vs chatbot vs workflow", "Patterns orchestrateur router pipeline", "Frameworks Claude Agent SDK LangGraph CrewAI", "March\u00e9 $7.84B\u2192$52B", "Exercice : 3 agents open-source"] },
      { id: "S8", day: "Mercredi", title: "Claude Agent SDK", desc: "Exploitation profonde du SDK officiel d\u2019Anthropic pour les agents.", points: ["Architecture et concepts", "Premier agent avec tools/guardrails/handoffs", "Subagents et multi-agent", "Atelier : Agent code review GitHub"] },
      { id: "S9", day: "Vendredi", title: "Agent Multi-\u00c9tapes", desc: "G\u00e9rer des workflows complexes sur de longues dur\u00e9es.", points: ["Production monitoring co\u00fbts", "Patterns avanc\u00e9s human-in-the-loop memory", "Challenge : Agent brief\u2192wireframe\u2192code\u2192tests\u2192deploy"] }
    ]
  },
  {
    week: "ASSEMBLER & DEVENIR DANGEREUX",
    sessions: [
      { id: "S10", day: "Lundi", title: "Workflow Pro Complet", desc: "Int\u00e9gration finale de tous les outils vus pr\u00e9c\u00e9demment.", points: ["Claude Code + MCP + Agents", "Workflow quotidien optimis\u00e9", "CI/CD IA + hooks Git", "Exercice : Workflow sur projet existant"] },
      { id: "S11", day: "Mercredi", title: "Projet Final Partie 1", desc: "D\u00e9marrage de la construction de votre application SaaS IA.", points: ["SaaS complet en 3h", "Next.js + Supabase + Claude Code + MCP + Agent", "Phase 1 : Archi BDD Auth API"] },
      { id: "S12", day: "Vendredi", title: "Projet Final + Certification", desc: "Finalisation, d\u00e9ploiement et validation des acquis.", points: ["UI tests deploy Vercel", "Agent IA custom", "SaaS d\u00e9ploy\u00e9", "Certification CODEX_AI + badge SENTINELLE"] }
    ]
  }
];

// --- Main Page ---

export default function LandingVibeOption4() {
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
    <div className="min-h-screen bg-white font-sans selection:bg-[#C9A84C]/20 selection:text-[#C9A84C]">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <span className="font-serif font-bold text-black tracking-tight text-lg">CODEX_AI</span>
          </div>
          <a href="/login" className="flex items-center gap-2 text-sm font-semibold text-black hover:text-[#C9A84C] transition-colors tracking-widest uppercase font-sans">
            <Lock className="w-4 h-4" />
            Se connecter
          </a>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge>Formation Premium &mdash; Cohorte 2026</Badge>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-black leading-[1.05] tracking-tight">
              L&apos;IA NE VOUS REMPLACERA PAS. <br />
              <span className="text-[#C9A84C]">LE DEV QUI L&apos;UTILISE, SI.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed font-sans">
              4 semaines intensives pour ma&icirc;triser Claude Code, MCP et les agents IA autonomes.
              Ne subissez pas le futur, codez-le.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button disabled className="px-8 py-4 bg-black/5 text-gray-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed tracking-widest uppercase text-sm font-sans border border-black/10">
                <Lock className="w-5 h-5" />
                INSCRIPTIONS FERM&Eacute;ES
              </button>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] font-sans">PROCHAINE COHORTE</span>
                <span className="text-sm font-semibold text-black font-serif">Printemps 2026</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Terminal />
          </motion.div>
        </div>
      </section>

      {/* --- LOGO WALL --- */}
      <section className="py-20 border-y-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center space-y-2">
          <h2 className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.3em] font-sans">ILS RECRUTENT DES DEVS IA. EN &Ecirc;TES-VOUS UN ?</h2>
          <p className="text-gray-400 text-sm italic font-sans">+340% de demande pour les profils ma&icirc;trisant les agents autonomes en 2025.</p>
        </div>
        <div className="space-y-12 overflow-hidden">
          <MarqueeLogos items={LOGOS_ROW_1} />
          <MarqueeLogos items={LOGOS_ROW_2} reverse />
        </div>
      </section>

      {/* --- CURRICULUM (Horizontal Scroll) --- */}
      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="px-6 max-w-7xl mx-auto w-full mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-serif font-bold text-black tracking-tight"
            >
              12 SESSIONS. 4 SEMAINES. <br />
              <span className="text-[#C9A84C]">1 MUTATION.</span>
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
              <div className="flex-shrink-0 w-[500px] h-[500px] bg-black p-12 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 blur-[100px] -mr-32 -mt-32" />
                <div className="z-10">
                  <div className="w-16 h-16 bg-[#C9A84C] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(201,168,76,0.3)]">
                    <ShieldCheck className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold mb-4">Certification CODEX_AI</h3>
                  <p className="text-white/40 leading-relaxed mb-8 font-sans">
                    Validation des acquis par la mise en production d&apos;un agent IA complet.
                    Badge SENTINELLE d&eacute;livr&eacute; aux dipl&ocirc;m&eacute;s.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-1 font-sans">Dur&eacute;e</div>
                      <div className="text-xl font-serif font-bold text-[#C9A84C]">18h de Live</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-1 font-sans">Format</div>
                      <div className="text-xl font-serif font-bold text-[#C9A84C]">Full Remote</div>
                    </div>
                  </div>
                </div>
                <div className="z-10 pt-8 border-t border-white/10 flex justify-between items-end">
                  <div className="text-sm font-bold tracking-[0.2em] font-sans uppercase">COHORTE 2026</div>
                  <Badge variant="dark" className="bg-[#C9A84C] text-black border-[#C9A84C] font-sans">SENTINELLE</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="bg-black py-12 overflow-hidden border-y-2 border-[#C9A84C]/30">
        <div className="flex overflow-hidden whitespace-nowrap gap-16">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center shrink-0"
          >
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <span className="text-white font-bold tracking-widest text-sm flex items-center gap-4 font-sans">
                  <TrendingUp className="text-[#C9A84C] w-5 h-5" /> <span className="text-[#C9A84C]">84%</span> STACK OVERFLOW 2025 ADOPTION
                </span>
                <span className="text-white font-bold tracking-widest text-sm flex items-center gap-4 font-sans">
                  <TrendingUp className="text-[#C9A84C] w-5 h-5" /> <span className="text-[#C9A84C]">41%</span> STATE OF CODE AUTOMATION INCREASE
                </span>
                <span className="text-white font-bold tracking-widest text-sm flex items-center gap-4 font-sans">
                  <TrendingUp className="text-[#C9A84C] w-5 h-5" /> <span className="text-[#C9A84C]">80%</span> GARTNER PREDICTED AI CONTRIBUTION
                </span>
                <span className="text-white font-bold tracking-widest text-sm flex items-center gap-4 font-sans">
                  <TrendingUp className="text-[#C9A84C] w-5 h-5" /> <span className="text-[#C9A84C]">+56%</span> PWC 2025 DEV PERFORMANCE
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FORMAT --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <Badge>Le format</Badge>
          <h2 className="text-4xl font-serif font-bold text-black tracking-tight">Pas de th&eacute;orie creuse.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Lives Interactifs", desc: "Sessions directes avec correction de bugs en temps r\u00e9el. Pas de vid\u00e9os pr\u00e9-enregistr\u00e9es, du live pur." },
            { icon: Globe, title: "Plateforme D\u00e9di\u00e9e", desc: "Acc\u00e8s \u00e0 vie \u00e0 notre biblioth\u00e8que de prompts, serveurs MCP custom et replays HD." },
            { icon: Zap, title: "Projet Fil Rouge", desc: "Vous ne repartez pas avec des notes, mais avec un agent IA pr\u00eat pour la production." }
          ].map((item, idx) => (
            <div key={idx} className="p-8 border border-black/10 hover:border-black hover:shadow-lg hover:border-l-2 hover:border-l-[#C9A84C] transition-all group">
              <div className="w-12 h-12 border border-black/10 flex items-center justify-center text-[#C9A84C] mb-6 group-hover:bg-black group-hover:border-black transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-black mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- DIVIDER --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b-2 border-black" />
      </div>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <Badge variant="muted">T&eacute;moignages</Badge>
              <h2 className="text-4xl font-serif font-bold text-black tracking-tight">ILS ONT PASS&Eacute; LE CAP</h2>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-[#C9A84C]">
                <Quote className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Thomas R.", role: "Freelance Fullstack", text: "Avant CODEX_AI, je passais 6h sur une feature complexe. Maintenant, avec mes propres agents MCP, 2h max.", metric: "Productivit\u00e9 x3" },
              { name: "Sarah M.", role: "Dev Senior en ESN", text: "J\u2019ai d\u00e9croch\u00e9 un poste d\u2019Architecte IA 3 mois apr\u00e8s la formation. Le ROI est d\u00e9ment.", metric: "Promotion Architecte" },
              { name: "Karim B.", role: "\u00c9tudiant en alternance", text: "Mon premier agent IA autonome, construit en session 9, g\u00e8re maintenant toute la documentation technique de mon entreprise.", metric: "Premier Agent Deploy\u00e9" }
            ].map((t, idx) => (
              <div key={idx} className="p-8 bg-white border border-black/10 hover:border-black hover:shadow-lg transition-all group">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Zap key={s} className="w-3 h-3 text-[#C9A84C] fill-[#C9A84C]" />)}
                </div>
                <p className="text-gray-600 italic mb-8 leading-relaxed font-sans">&quot;{t.text}&quot;</p>
                <div className="flex items-center justify-between pt-6 border-t border-black/10">
                  <div>
                    <div className="font-serif font-bold text-black text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs font-sans">{t.role}</div>
                  </div>
                  <Badge variant="success">{t.metric}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY NOW --- */}
      <section className="py-32 px-6 overflow-hidden border-t-2 border-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-black leading-tight tracking-tight">
                POURQUOI <span className="text-[#C9A84C]">MAINTENANT ?</span>
              </h2>
            </div>
            <div className="space-y-8">
              {[
                { n: "01", t: "La fen\u00eatre de tir se referme.", d: "En 2026, savoir prompter ne sera plus un avantage, ce sera le minimum syndical." },
                { n: "02", t: "Le code g\u00e9n\u00e9r\u00e9 par l\u2019IA pollue les bases de donn\u00e9es mondiales.", d: "Apprenez \u00e0 filtrer, raffiner et architecturer plut\u00f4t que de simplement g\u00e9n\u00e9rer." },
                { n: "03", t: "Devenez un Full-Stack AI Developer.", d: "Capable de g\u00e9rer seul ce qui demandait autrefois une \u00e9quipe de 5 personnes." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="text-3xl font-serif font-black text-[#C9A84C]">{item.n}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-bold text-black">{item.t}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-md font-sans">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[400px] h-[400px] border-2 border-black/20 flex items-center justify-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4 border-2 border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                <Bot className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-5xl font-serif font-black text-black">2026</div>
                <div className="text-xs font-bold text-[#C9A84C] tracking-[0.3em] uppercase font-sans">L&apos;\u00e8re de l&apos;Agent</div>
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-black p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.05),transparent)]" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white tracking-tight">
              PR&Ecirc;T POUR LA <span className="text-[#C9A84C]">MUTATION ?</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto font-sans">
              12 sessions live, Full Remote, LUN/MER/VEN. <br />
              Acc&egrave;s priv&eacute; sur invitation uniquement.
            </p>
            <div className="flex flex-col items-center gap-6">
              <button disabled className="px-12 py-5 bg-white/5 text-white/30 border border-white/10 font-bold flex items-center gap-3 cursor-not-allowed tracking-widest uppercase text-sm font-sans">
                <Lock className="w-5 h-5" />
                Inscriptions Ferm&eacute;es
              </button>
              <div className="text-sm font-semibold text-[#C9A84C] flex items-center gap-2 font-sans tracking-widest">
                <div className="w-2 h-2 bg-[#C9A84C] animate-pulse" />
                Ouverture de la prochaine cohorte : Printemps 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <span className="font-serif font-bold text-black">CODEX_AI</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400 font-sans">
            <span className="hover:text-black transition-colors cursor-pointer">Plateforme priv&eacute;e</span>
            <span className="hover:text-black transition-colors cursor-pointer">Conditions</span>
            <span className="hover:text-black transition-colors cursor-pointer">Support</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] font-sans">
            Acc&egrave;s sur invitation uniquement &mdash; 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
