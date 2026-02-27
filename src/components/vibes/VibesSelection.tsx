"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Terminal, Cpu, CreditCard, Zap, Layers,
  Clock, ArrowLeft, Calendar, MonitorPlay, Layout, Timer, ArrowUpRight,
  Globe, Code2, Play, Signal, Monitor, Command, Briefcase, Radio,
  Rocket, Trophy, PlayCircle
} from 'lucide-react';

// ============================================================
// VIBE 1 — APPLE KEYNOTE / MINIMAL GRID
// ============================================================
const Vibe1 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono text-[#1C1917] overflow-x-hidden">
      <nav className="bg-[#FFFCFA]/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-16 h-24 flex items-center justify-between">
          <button className="flex items-center gap-3 text-stone-500 hover:text-[#d97757] transition-colors group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-bold">Retour au programme</span>
          </button>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-tighter text-stone-400">Progression</span>
              <span className="text-sm font-bold tracking-widest">SESSION 1 / 12</span>
            </div>
            <div className="flex gap-2">
              <button className="p-4 bg-stone-100 text-stone-400 rounded-lg cursor-not-allowed"><ChevronLeft className="w-6 h-6" /></button>
              <button className="p-4 bg-white border border-stone-200 text-[#1C1917] rounded-lg hover:border-[#d97757] hover:text-[#d97757] transition-all"><ChevronRight className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-8 md:px-16 pt-16 pb-32">
        <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-[#FFF7ED] border border-[#FED7AA] text-[#d97757] rounded-full text-[10px] uppercase tracking-[0.2em] font-bold">Week 1 — MAÎTRISER CLAUDE CODE</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-12">
            Lundi <span className="text-stone-300 block md:inline">—</span><br />
            Setup & <span className="text-[#d97757]">Premiers Pas</span>
          </h1>
          <div className="flex flex-wrap gap-12 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center"><Clock className="w-5 h-5 text-[#d97757]" /></div>
              <div><p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none mb-1">Durée</p><p className="text-xl font-bold">1h30</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center"><Radio className="w-5 h-5 text-[#d97757]" /></div>
              <div><p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none mb-1">Format</p><p className="text-xl font-bold">Live Remote</p></div>
            </div>
          </div>
        </motion.section>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 group">
            <div className="h-full p-12 bg-white border border-stone-200 rounded-3xl hover:border-[#d97757]/30 transition-all duration-500 flex flex-col justify-between">
              <div className="w-20 h-20 bg-[#FFF7ED] rounded-2xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform duration-500"><Terminal className="w-10 h-10 text-[#d97757]" /></div>
              <div>
                <span className="text-[#d97757] text-6xl font-bold mb-4 block opacity-20">01</span>
                <h3 className="text-4xl font-bold tracking-tight mb-4">Installation de Claude Code (CLI) et configuration</h3>
                <p className="text-stone-500 text-lg leading-relaxed max-w-md">Préparez votre environnement de développement avec l&apos;outil officiel en ligne de commande.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="group">
            <div className="h-full p-12 bg-[#1C1917] text-white rounded-3xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-500">
              <div className="w-20 h-20 bg-stone-800 rounded-2xl flex items-center justify-center mb-12"><Cpu className="w-10 h-10 text-[#FED7AA]" /></div>
              <div>
                <span className="text-stone-600 text-6xl font-bold mb-4 block">02</span>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Tokens & Modes</h3>
                <p className="text-stone-400 text-base leading-relaxed">Différencier Opus, Sonnet et Haiku pour optimiser vos coûts et performances.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="group">
            <div className="h-full p-12 bg-white border border-stone-200 rounded-3xl flex flex-col justify-between hover:border-[#d97757]/30 transition-all">
              <div className="w-20 h-20 bg-[#FFF7ED] rounded-2xl flex items-center justify-center mb-12"><CreditCard className="w-10 h-10 text-[#d97757]" /></div>
              <div>
                <span className="text-[#d97757] text-6xl font-bold mb-4 block opacity-20">03</span>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Claude Pro vs Max</h3>
                <p className="text-stone-500 text-base leading-relaxed">Comparatif complet : $20/mois vs $100-200/mois — quel plan choisir selon vos besoins.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-2 group">
            <div className="h-full p-12 bg-[#FFF7ED] border border-[#FED7AA] rounded-3xl flex flex-col md:flex-row gap-12 items-center hover:shadow-xl transition-all duration-700">
              <div className="flex-1">
                <span className="text-[#d97757] text-6xl font-bold mb-4 block opacity-40">04</span>
                <h3 className="text-4xl font-bold tracking-tight mb-4">Scaffolder une App Next.js</h3>
                <p className="text-[#d97757]/80 text-xl font-bold mb-2">Objectif : 5 minutes.</p>
                <p className="text-stone-600 text-lg leading-relaxed">Démo live d&apos;une génération complète de projet avec structure de dossiers et auth.</p>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-white rounded-2xl flex items-center justify-center shadow-inner border border-[#FED7AA]">
                <Zap className="w-24 h-24 text-[#d97757] animate-pulse" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-3 group">
            <div className="p-16 bg-white border border-stone-200 rounded-[3rem] text-center flex flex-col items-center hover:border-[#d97757] transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8"><Briefcase className="w-32 h-32 text-stone-50 opacity-10 rotate-12" /></div>
              <div className="relative z-10">
                <span className="px-6 py-2 bg-[#d97757] text-white rounded-full text-xs font-bold uppercase tracking-widest mb-12 inline-block">Exercice Pratique</span>
                <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl">Créer un portfolio personnel avec Claude Code en moins de 15 min</h3>
                <p className="text-stone-500 text-xl max-w-2xl mx-auto leading-relaxed">Passez de l&apos;idée au déploiement. Un exercice chronométré pour valider votre maîtrise.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

// ============================================================
// VIBE 2 — DARK TERMINAL / HACKER
// ============================================================
const Vibe2 = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Setup & Premiers Pas";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => { setDisplayedText(fullText.slice(0, i)); i++; if (i > fullText.length) clearInterval(timer); }, 30);
    return () => clearInterval(timer);
  }, []);

  const topics = [
    { id: "CMD_01", title: "Installation de Claude Code (CLI) et configuration", time: "15 min", difficulty: 20, type: "Pratique", icon: Terminal, desc: "Initialisation de l'environnement et authentification API." },
    { id: "CMD_02", title: "Comprendre le modèle de tokens (Opus/Sonnet/Haiku)", time: "20 min", difficulty: 40, type: "Théorie", icon: Layers, desc: "Analyse des architectures de modèles et optimisation." },
    { id: "CMD_03", title: "Les plans Claude Pro ($20) vs Max ($100-200)", time: "10 min", difficulty: 10, type: "Théorie", icon: Zap, desc: "Comparatif des limites de débit et accès prioritaires." },
    { id: "CMD_04", title: "Scaffolder une app Next.js en 5 minutes", time: "25 min", difficulty: 70, type: "Pratique", icon: Monitor, desc: "Génération automatique avec App Router + Tailwind." },
    { id: "CMD_05", title: "Exercice : Portfolio personnel en <15 min", time: "20 min", difficulty: 90, type: "Exercice", icon: Code2, desc: "Challenge : du prompt initial au déploiement Vercel." },
  ];

  return (
    <div className="min-h-screen bg-[#1C1917] text-stone-200 font-mono pb-24">
      <nav className="sticky top-0 z-50 w-full border-b border-stone-800 bg-[#1C1917]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back to Syllabus</span>
          </button>
          <div className="flex items-center gap-4 text-sm">
            <button className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-500 hover:text-white"><ChevronLeft size={24} /></button>
            <span className="text-white font-bold">SESSION 1 <span className="text-stone-600">/ 12</span></span>
            <button className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-500 hover:text-white"><ChevronRight size={24} /></button>
          </div>
        </div>
      </nav>

      <header className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d97757 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-3 py-1 bg-[#d97757]/10 border border-[#d97757]/30 text-[#d97757] text-xs uppercase tracking-widest rounded-md">Week 1</span>
              <span className="text-stone-500 text-xs uppercase tracking-widest">— MAÎTRISER CLAUDE CODE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter max-w-4xl">{displayedText}<span className="animate-pulse">_</span></h1>
            <div className="flex flex-wrap items-center gap-10 pt-4">
              <div className="flex items-center gap-3"><div className="p-3 bg-stone-900 rounded-xl border border-stone-800"><Clock className="text-[#d97757]" size={28} /></div><div><div className="text-[10px] text-stone-500 uppercase tracking-widest">Duration</div><div className="text-xl text-white">1h30</div></div></div>
              <div className="flex items-center gap-3"><div className="p-3 bg-stone-900 rounded-xl border border-stone-800"><Signal className="text-[#d97757]" size={28} /></div><div><div className="text-[10px] text-stone-500 uppercase tracking-widest">Format</div><div className="text-xl text-white">Live Remote</div></div></div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3"><Command size={20} className="text-[#d97757]" /> COMMAND_LIST.sh</h2>
            <div className="text-xs text-stone-500">5 MODULES DETECTED</div>
          </div>
          <div className="space-y-6">
            {topics.map((topic, idx) => (
              <motion.div key={topic.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                className="group relative flex flex-col md:flex-row gap-6 p-8 bg-stone-900/40 border border-stone-800 rounded-xl hover:border-[#d97757]/40 hover:bg-stone-900/60 transition-all cursor-pointer">
                <div className="absolute top-0 left-8 -translate-y-1/2 px-3 py-1 bg-stone-900 border border-stone-800 rounded text-[10px] font-mono text-stone-500 group-hover:text-[#d97757] transition-colors">MODULE_{topic.id}</div>
                <div className="flex-shrink-0"><div className="w-16 h-16 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-[#d97757] group-hover:scale-110 transition-transform shadow-inner"><topic.icon size={32} /></div></div>
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-stone-700 text-stone-400 bg-stone-950">{topic.type}</span>
                    <h3 className="text-2xl font-mono text-white group-hover:text-[#d97757] transition-colors leading-tight">{topic.title}</h3>
                  </div>
                  <p className="text-stone-500 font-mono text-lg max-w-2xl">{topic.desc}</p>
                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-2 text-stone-400 font-mono text-sm"><Clock size={16} className="text-[#d97757]" /> {topic.time}</div>
                    <div className="flex gap-1 h-2 w-24">{[...Array(5)].map((_, i) => (<div key={i} className={`flex-1 rounded-sm ${i < (topic.difficulty / 20) ? "bg-[#d97757]" : "bg-stone-800"}`} />))}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center"><div className="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center text-stone-600 group-hover:border-[#d97757] group-hover:text-[#d97757] transition-all"><Play size={20} fill="currentColor" className="ml-1" /></div></div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-stone-900/40 border border-stone-800 rounded-2xl space-y-6">
            <h3 className="text-sm uppercase tracking-widest text-stone-400 border-b border-stone-800 pb-4">Mission Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500"><span>COMPLETION</span><span className="text-[#d97757]">8%</span></div>
              <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '8%' }} transition={{ duration: 1 }} className="h-full bg-[#d97757]" /></div>
            </div>
            <button className="w-full py-4 bg-[#d97757] hover:bg-[#c06649] text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"><Play size={20} fill="currentColor" /> REJOINDRE LE LIVE</button>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950 overflow-hidden">
            <div className="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/50" /></div>
              <span className="text-[10px] text-stone-500 ml-2 uppercase tracking-widest">codex-ai</span>
            </div>
            <div className="p-6 space-y-3 text-[11px] leading-relaxed">
              <p className="text-green-500">$ claude-code login</p>
              <p className="text-stone-400">[SUCCESS] User validated</p>
              <p className="text-green-500">$ claude-code init project_alpha</p>
              <p className="text-[#d97757]">Project ready at ./src/app</p>
              <div className="h-4 w-2 bg-stone-600 animate-pulse inline-block" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

// ============================================================
// VIBE 3 — BENTO GRID
// ============================================================
const Vibe3 = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono text-[#1C1917] p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-6">
          <button className="flex items-center gap-2 text-stone-400 hover:text-[#d97757] transition-colors group text-sm">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> RETOUR AU PROGRAMME
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#FFF7ED] text-[#d97757] border border-[#FED7AA] rounded-full text-[10px] uppercase tracking-[0.2em] font-bold">WEEK 1</span>
              <span className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2"><MonitorPlay size={12} /> LIVE REMOTE</span>
              <span className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2"><Timer size={12} /> 1H30</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-4 uppercase">Setup & <br /><span className="text-[#d97757]">Premiers Pas</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white border border-stone-200 p-2 rounded-xl">
          <button className="p-4 hover:bg-stone-50 rounded-lg transition-colors text-stone-400"><ChevronLeft size={24} /></button>
          <div className="px-6 py-2 border-x border-stone-100 flex flex-col items-center"><span className="text-2xl font-bold">01</span><span className="text-[10px] text-stone-400 uppercase tracking-widest">SUR 12</span></div>
          <button className="p-4 hover:bg-stone-50 rounded-lg transition-colors text-stone-400"><ChevronRight size={24} /></button>
        </div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-8 md:row-span-2 group">
          <div className="h-full p-12 bg-white border border-stone-200 rounded-2xl hover:shadow-xl hover:border-[#FED7AA] transition-all flex flex-col justify-between">
            <div className="space-y-4"><div className="w-16 h-16 bg-[#FFF7ED] rounded-2xl flex items-center justify-center text-[#d97757]"><Terminal size={32} /></div><h2 className="text-3xl font-bold uppercase leading-tight max-w-md">Installation de Claude Code (CLI) et configuration</h2><p className="text-stone-500 text-lg max-w-sm leading-relaxed">Maîtrisez l&apos;interface en ligne de commande pour une productivité décuplée.</p></div>
            <div className="mt-8 bg-stone-900 rounded-xl p-6 font-mono text-sm text-stone-300 relative">
              <div className="flex gap-1.5 mb-4"><div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-amber-500/50" /><div className="w-2 h-2 rounded-full bg-emerald-500/50" /></div>
              <code className="block"><span className="text-emerald-400">$</span> npm install -g @anthropic-ai/claude-code</code>
              <code className="block mt-2 opacity-60"><span className="text-emerald-400">$</span> claude auth login --key [••••••••]</code>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-4">
          <div className="h-full p-8 bg-white border border-stone-200 rounded-2xl hover:shadow-xl hover:border-[#FED7AA] transition-all flex flex-col gap-6">
            <div className="space-y-2"><Layers className="text-[#d97757]" size={28} /><h3 className="text-xl font-bold uppercase">Modèles & Tokens</h3></div>
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-100"><span className="font-bold">OPUS</span><span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-purple-50 text-purple-600 border border-purple-100">IQ Max</span></div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-100"><span className="font-bold">SONNET</span><span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#FFF7ED] text-[#d97757] border border-[#FED7AA]">Equilibre</span></div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-100"><span className="font-bold">HAIKU</span><span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100">Vitesse</span></div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-4">
          <div className="h-full p-8 bg-white border border-stone-200 rounded-2xl hover:shadow-xl hover:border-[#FED7AA] transition-all flex flex-col justify-between">
            <div className="space-y-4"><CreditCard className="text-[#d97757]" size={28} /><h3 className="text-xl font-bold uppercase leading-tight">Plans Claude Pro vs Max</h3></div>
            <div className="mt-8 space-y-4"><div className="flex items-baseline gap-2"><span className="text-4xl font-bold tracking-tighter">$20</span><span className="text-stone-400 text-sm">/ MOIS PRO</span></div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-[#d97757]" /></div></div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-7">
          <div className="h-full p-12 bg-stone-50 border border-stone-100 rounded-2xl hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d97757] text-white rounded-full text-[10px] font-bold tracking-widest uppercase"><Zap size={12} fill="white" /> RAPIDE</div>
              <h3 className="text-3xl font-bold uppercase leading-tight">Scaffolder une app Next.js</h3>
              <p className="text-stone-500">Générez une architecture robuste en quelques secondes avec l&apos;IA.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-stone-200 min-w-[180px]"><span className="text-7xl font-black text-[#d97757] tracking-tighter">5</span><span className="text-xl font-bold uppercase tracking-[0.2em] text-stone-300">MIN</span></div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-5">
          <div className="h-full p-8 bg-[#d97757] rounded-2xl text-white overflow-hidden relative group min-h-[220px] flex flex-col justify-between">
            <div className="flex justify-between items-start"><div className="p-3 bg-white/20 rounded-xl"><Timer size={28} /></div><ArrowUpRight size={32} className="opacity-40 group-hover:opacity-100 transition-all" /></div>
            <div className="space-y-2"><h3 className="text-2xl font-bold uppercase leading-tight">Exercice : Créer un portfolio complet</h3><p className="text-white/70 text-sm">Mise en pratique : déploiement en moins de 15 min chrono.</p></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

// ============================================================
// VIBE 4 — VERTICAL TIMELINE
// ============================================================
const Vibe4 = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const topics = [
    { id: 1, time: "15 min", type: "Théorie + Pratique", title: "Installation de Claude Code (CLI) et configuration", desc: "Apprenez à installer l'interface CLI officielle et configurer votre environnement local.", icon: Terminal },
    { id: 2, time: "15 min", type: "Théorie", title: "Comprendre le modèle de tokens et les modes", desc: "Exploration des différences entre Opus, Sonnet et Haiku.", icon: Layers },
    { id: 3, time: "10 min", type: "Théorie", title: "Les plans Claude Pro vs Max", desc: "Comparaison des abonnements ($20 vs $100-200/mois). Analyse du ROI.", icon: CreditCard },
    { id: 4, time: "20 min", type: "Pratique", title: "Scaffolder une app Next.js en 5 minutes", desc: "Utilisation des commandes avancées pour générer une structure de projet.", icon: Zap },
    { id: 5, time: "30 min", type: "Exercice", title: "Exercice : Créer un portfolio", desc: "Création complète d'un portfolio personnel optimisé SEO et responsive.", icon: Layout },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono text-[#1C1917]">
      <nav className="bg-[#FFFCFA]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-stone-500 hover:text-[#d97757] transition-colors font-bold group"><ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> RETOUR AU CURSUS</button>
          <div className="flex items-center gap-2"><span className="text-[#d97757] font-bold">01</span><div className="w-12 h-1 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-[#d97757] w-1/12" /></div><span className="text-stone-400">12</span></div>
        </div>
      </nav>

      <main className="pt-16 pb-48 px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4 mb-8">
              <span className="px-4 py-1.5 bg-stone-800 text-white rounded-full text-[10px] uppercase tracking-widest font-bold">WEEK 1</span>
              <span className="px-4 py-1.5 bg-[#FFF7ED] text-[#d97757] border border-[#FED7AA] rounded-full text-[10px] uppercase tracking-widest font-bold">MAÎTRISER CLAUDE CODE</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 leading-[0.9]">SESSION 1 <br /><span className="text-[#d97757]">Setup & Premiers Pas</span></motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-2xl"><Calendar className="text-[#d97757] w-6 h-6" /><div><div className="text-stone-400 text-xs uppercase tracking-widest">Date</div><div className="font-bold">Lundi</div></div></div>
              <div className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-2xl"><Clock className="text-[#d97757] w-6 h-6" /><div><div className="text-stone-400 text-xs uppercase tracking-widest">Durée</div><div className="font-bold">1h30</div></div></div>
              <div className="flex items-center gap-4 p-6 bg-white border border-stone-200 rounded-2xl"><MonitorPlay className="text-[#d97757] w-6 h-6" /><div><div className="text-stone-400 text-xs uppercase tracking-widest">Format</div><div className="font-bold">Live Remote</div></div></div>
            </motion.div>
          </header>

          <section ref={containerRef} className="relative">
            <div className="absolute left-[30px] top-8 bottom-8 w-1 bg-stone-100 rounded-full" />
            <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute left-[30px] top-8 bottom-8 w-1 bg-[#d97757] rounded-full z-0" />
            <div className="space-y-0">
              {topics.map((topic, index) => (
                <div key={topic.id} className="relative flex gap-12 pb-24 last:pb-0">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-100px" }} className="z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-[#d97757] text-[#d97757] font-mono text-2xl font-bold shadow-sm">{index + 1}</motion.div>
                    {index < topics.length - 1 && <div className="absolute top-16 bottom-0 w-1 bg-stone-200 rounded-full" />}
                  </div>
                  <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: 0.1 }} className="flex-grow group">
                    <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-[#FED7AA]">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="p-4 bg-[#FFF7ED] rounded-2xl text-[#d97757] w-fit group-hover:scale-110 transition-transform"><topic.icon className="w-8 h-8" /></div>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-4 py-1.5 rounded-full text-[12px] uppercase tracking-widest font-bold bg-[#FFF7ED] text-[#d97757] border border-[#FED7AA]">{topic.time}</span>
                          <span className="px-4 py-1.5 rounded-full text-[12px] uppercase tracking-widest font-bold bg-stone-100 text-stone-500">{topic.type}</span>
                        </div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 leading-tight">{topic.title}</h3>
                      <p className="text-xl text-[#78716C] leading-relaxed max-w-3xl">{topic.desc}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// ============================================================
// VIBE 5 — SLIDE DECK / PRESENTATION
// ============================================================
const Vibe5 = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const slides = [
    { id: 1, title: "Installation de Claude Code (CLI) et configuration", subtitle: "Votre premier pas dans l'ère de l'IA", duration: "15 min", icon: Terminal, tag: "SETUP" },
    { id: 2, title: "Comprendre le modèle de tokens et les modes (Opus/Sonnet/Haiku)", subtitle: "3 modes, 3 niveaux de puissance", duration: "15 min", icon: Cpu, tag: "ARCHITECTURE" },
    { id: 3, title: "Les plans Claude Pro ($20/mois) vs Max ($100-200/mois)", subtitle: "Investissement vs retour sur productivité", duration: "10 min", icon: CreditCard, tag: "PRICING" },
    { id: 4, title: "Premier projet : scaffolder une app Next.js en 5 minutes", subtitle: "De zéro à production en 5 minutes", duration: "20 min", icon: Rocket, tag: "BUILD" },
    { id: 5, title: "Exercice : Portfolio personnel en moins de 15 min", subtitle: "Votre première création avec l'IA", duration: "30 min", icon: Trophy, tag: "PRACTICE" },
  ];
  const paginate = (dir: number) => { const next = page + dir; if (next >= 0 && next < slides.length) setPage([next, dir]); };
  const current = slides[page];
  const variants = { enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0, scale: 0.95 }), center: { zIndex: 1, x: 0, opacity: 1, scale: 1 }, exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0, scale: 0.95 }) };

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono text-[#1C1917] flex flex-col overflow-hidden">
      <header className="w-full max-w-7xl mx-auto px-8 pt-12 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#FFF7ED] border border-[#FED7AA] text-[#d97757] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">WEEK 1 — MAÎTRISER CLAUDE CODE</span>
            <span className="flex items-center gap-2 text-stone-400 text-xs tracking-widest uppercase"><PlayCircle className="w-4 h-4" /> Live Remote</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">SESSION 1 — <span className="text-[#d97757]">&quot;Setup & Premiers Pas&quot;</span></h1>
          <div className="flex items-center gap-6 text-stone-500 font-medium"><span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Lundi</span><span className="flex items-center gap-2 text-[#d97757]"><Clock className="w-5 h-5" /> 1h30</span></div>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center px-4 md:px-12 py-8">
        <div className="absolute inset-x-4 md:inset-x-12 flex justify-between items-center z-10 pointer-events-none">
          <button onClick={() => paginate(-1)} disabled={page === 0} className={`p-6 rounded-xl bg-white border border-stone-200 shadow-sm transition-all pointer-events-auto ${page === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:border-[#FED7AA] active:scale-95'}`}><ChevronLeft className="w-10 h-10 text-[#d97757]" /></button>
          <button onClick={() => paginate(1)} disabled={page === slides.length - 1} className={`p-6 rounded-xl bg-white border border-stone-200 shadow-sm transition-all pointer-events-auto ${page === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:border-[#FED7AA] active:scale-95'}`}><ChevronRight className="w-10 h-10 text-[#d97757]" /></button>
        </div>

        <div className="relative w-full max-w-6xl aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/7]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div key={page} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 }, scale: { duration: 0.3 } }}
              className="absolute inset-0 bg-white border border-stone-200 rounded-2xl shadow-xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFF7ED] opacity-40 skew-x-12 translate-x-32 -z-10" />
              <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl flex items-center justify-center text-[#d97757] relative">
                <current.icon className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1.5} />
                <div className="absolute -top-4 -right-4 bg-[#d97757] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">{current.tag}</div>
              </div>
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-4"><span className="text-[#d97757] font-bold text-xl">SLIDE {current.id} / {slides.length}</span><div className="h-px w-12 bg-stone-200" /><span className="text-stone-400 font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> {current.duration}</span></div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1C1917] leading-tight uppercase">{current.title}</h2>
                </div>
                <p className="text-xl md:text-2xl text-stone-500 font-medium italic border-l-4 border-[#FED7AA] pl-6 py-2 max-w-2xl mx-auto md:mx-0">&quot;{current.subtitle}&quot;</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-8 pb-12 pt-6 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setPage([idx, idx > page ? 1 : -1])} className={`h-3 rounded-full transition-all duration-300 ${idx === page ? 'w-16 bg-[#d97757]' : 'w-3 bg-stone-200 hover:bg-stone-300'}`} />
          ))}
        </div>
      </footer>
    </div>
  );
};

// ============================================================
// MAIN PAGE — ALL 5 VIBES
// ============================================================
export default function VibesSelection() {
  const [activeVibe, setActiveVibe] = useState<number | null>(null);

  if (activeVibe !== null) {
    const vibes = [Vibe1, Vibe2, Vibe3, Vibe4, Vibe5];
    const ActiveComponent = vibes[activeVibe];
    return (
      <div>
        <div className="fixed top-4 right-4 z-[100] flex gap-2">
          <button onClick={() => setActiveVibe(null)} className="px-6 py-3 bg-[#1C1917] text-white rounded-full font-mono text-sm font-bold hover:bg-[#d97757] transition-colors shadow-xl">
            Retour aux vibes
          </button>
        </div>
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1917] font-mono text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">CHOISIS TON <span className="text-[#d97757]">VIBE</span></h1>
        <p className="text-stone-400 text-xl">5 styles différents pour afficher le contenu des sessions. Clique pour voir en pleine page.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name: "Apple Keynote", desc: "Minimal, grandes typos, grid asymétrique. Chaque sujet est un bloc visuel impactant." },
          { name: "Dark Terminal", desc: "Mode sombre hacker, modules en commandes, barres de difficulté, sidebar mission stats." },
          { name: "Bento Grid", desc: "Cartes de tailles variées façon Notion/Linear. Mix de couleurs, badges et visuels." },
          { name: "Timeline Vertical", desc: "Parcours guidé étape par étape avec ligne de progression animée au scroll." },
          { name: "Slide Deck", desc: "Un sujet par slide, transitions animées, navigation par flèches. Mode présentation." },
        ].map((vibe, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveVibe(i)}
            className="text-left p-8 bg-stone-900 border border-stone-800 rounded-2xl hover:border-[#d97757] transition-all group"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-[#d97757]/30 group-hover:text-[#d97757] transition-colors">{i + 1}</span>
              <h3 className="text-2xl font-bold group-hover:text-[#d97757] transition-colors">{vibe.name}</h3>
            </div>
            <p className="text-stone-400 leading-relaxed">{vibe.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-[#d97757] text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Voir en plein écran <ChevronRight size={16} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
