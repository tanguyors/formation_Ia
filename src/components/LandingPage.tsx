"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import {
  Terminal as TerminalIcon,
  Zap,
  Users,
  Monitor,
  Cpu,
  ChevronRight,
  Lock,
  ShieldAlert,
  Target,
  Layers,
  Code2,
  AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ value, label, source }: { value: string; label: string; source: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
    >
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold mb-2">Donnée Critique</div>
        <motion.div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">
          {isInView ? value : "0%"}
        </motion.div>
        <p className="text-sm text-stone-500 leading-relaxed font-mono">{label}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-stone-100">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">Source: {source}</span>
      </div>
    </motion.div>
  );
};

const TerminalUI = () => {
  const [text, setText] = useState("");
  const fullText = "claude \"Refactor ce composant React pour utiliser le pattern Compound Components et optimiser les re-renders...\"";

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
    <div className="w-full max-w-2xl mx-auto bg-white border border-stone-200 rounded-xl shadow-md overflow-hidden font-mono text-xs md:text-sm">
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-stone-300" />
          <div className="w-3 h-3 rounded-full bg-stone-300" />
          <div className="w-3 h-3 rounded-full bg-stone-300" />
        </div>
        <div className="text-stone-400 flex items-center gap-2">
          <TerminalIcon size={14} />
          <span>Claude Code Terminal</span>
        </div>
      </div>
      <div className="p-6 min-h-[160px] bg-white text-stone-800">
        <div className="flex gap-3 mb-2">
          <span className="text-[#d97757] font-bold">→</span>
          <span className="text-stone-400">~/project</span>
        </div>
        <div className="flex gap-3">
          <span className="text-[#d97757] font-bold">$</span>
          <span className="leading-relaxed">
            {text}
            <span className="inline-block w-2 h-4 bg-[#d97757] ml-1 animate-pulse align-middle" />
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: text.length === fullText.length ? 1 : 0 }}
          className="mt-4 text-stone-400 italic"
        >
          {"> Analyse des fichiers locale..."}<br />
          {"> Génération du plan de refactorisation..."}<br />
          {"> Application des changements (12 fichiers modifiés)"}
        </motion.div>
      </div>
    </div>
  );
};

const WeekCard = ({ week, title, sessions }: { week: number; title: string; sessions: string[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: week * 0.1 }}
    className="bg-white border border-stone-200 rounded-xl p-6 hover:border-[#d97757]/30 transition-all flex flex-col h-full"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] uppercase tracking-widest bg-orange-50 text-[#d97757] px-2 py-1 rounded font-bold">Semaine 0{week}</span>
      <div className="w-2 h-2 rounded-full bg-[#d97757] animate-pulse" />
    </div>
    <h3 className="text-lg font-bold text-stone-900 mb-4 h-12 flex items-center">{title}</h3>
    <ul className="space-y-3 mb-6 flex-grow">
      {sessions.map((s, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
          <ChevronRight size={14} className="mt-1 flex-shrink-0 text-[#d97757]" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#FFFCFA] text-stone-900 font-mono selection:bg-orange-100 selection:text-[#d97757]">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#d97757] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <header className="fixed w-full top-0 z-40 bg-[#FFFCFA]/80 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d97757] rounded flex items-center justify-center text-white">
            <Cpu size={18} />
          </div>
          <span className="font-bold tracking-tighter text-stone-900">CODEX_AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[10px] uppercase tracking-widest text-stone-400">Statut: Opérationnel</span>
          <div className="flex items-center gap-2 bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
            <Lock size={12} className="text-[#d97757]" />
            Accès sur invitation
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#d97757] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                <AlertTriangle size={12} /> Alerte d&apos;obsolescence technique
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-8 leading-[1.1]">
                L&apos;IA ne vous <span className="text-[#d97757]">remplacera</span> pas. <br />
                <span className="italic">Le développeur qui l&apos;utilise, si.</span>
              </h1>
              <p className="text-stone-500 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                Le paradigme du code a changé. Les outils comme Claude Code redéfinissent la productivité.
                Ne restez pas bloqué dans l&apos;ère artisanale pendant que les ingénieurs IA construisent 10x plus vite.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
                  <div className="text-[10px] uppercase text-stone-400 mb-1">Session Prochaine</div>
                  <div className="text-stone-900 font-bold">Lundi, 18h30</div>
                </div>
                <div className="text-stone-400 text-sm italic max-w-xs">
                  &quot;L&apos;écart de productivité entre un dev manuel et un dev boosté à l&apos;IA devient irrécupérable.&quot;
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-orange-100/30 rounded-[2rem] -rotate-2 z-0" />
              <div className="relative z-10">
                <TerminalUI />
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20 bg-stone-50 border-y border-stone-200 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-stone-800 mb-2">L&apos;Inévitabilité en Chiffres</h2>
              <div className="h-1 w-20 bg-[#d97757]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard value="84%" label="des développeurs utilisent ou prévoient d'utiliser l'IA" source="Stack Overflow 2025" />
              <StatCard value="41%" label="du code mondial est désormais généré par l'IA" source="State of Code 2025" />
              <StatCard value="80%" label="des ingénieurs devront se former à l'IA d'ici 2027" source="Gartner" />
              <StatCard value="+56%" label="de prime salariale pour les compétences IA maîtrisées" source="PwC 2025" />
            </div>
          </div>
        </section>

        {/* PROGRAMME */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold">Le Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-4 mb-6">4 Semaines pour devenir &quot;AI-First&quot;</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Une immersion intensive axée sur la pratique réelle. 12 sessions de live-coding pour transformer votre workflow de A à Z.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeekCard week={1} title="Maîtriser Claude Code" sessions={["Setup & Configuration", "Gestion du CLAUDE.md", "Workflow quotidien 10x"]} />
            <WeekCard week={2} title="MCP : Connecter l'IA" sessions={["Protocole de Contexte", "Cas d'usage réels", "Serveur MCP custom"]} />
            <WeekCard week={3} title="Agents IA & Worktrees" sessions={["Gestion de Subagents", "Multi-worktree dev", "Agent SDK Patterns"]} />
            <WeekCard week={4} title="Assembler & Dominer" sessions={["Projet complet full-AI", "Hooks & Automatisations", "Patterns avancés"]} />
          </div>

          <div className="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-stone-800 font-bold">
              <Monitor className="text-[#d97757]" />
              <span>12 SESSIONS LIVE</span>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-orange-200" />
            <div className="flex items-center gap-4 text-stone-800 font-bold">
              <Zap className="text-[#d97757]" />
              <span>18 HEURES DE FORMATION</span>
            </div>
            <div className="h-px md:h-8 w-full md:w-px bg-orange-200" />
            <div className="flex items-center gap-4 text-stone-800 font-bold">
              <Users className="text-[#d97757]" />
              <span>COMMUNAUTÉ PRIVÉE</span>
            </div>
          </div>
        </section>

        {/* FORMAT */}
        <section className="py-20 bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold mb-4">Fonctionnement</span>
              <h2 className="text-3xl font-bold">Une expérience d&apos;apprentissage fluide</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="text-[#d97757]" size={28} />, title: "Lives Interactifs", desc: "1h30 chaque Lundi, Mercredi et Vendredi. Pas de monologues : théorie courte et 100% pratique en direct." },
                { icon: <Layers className="text-[#d97757]" size={28} />, title: "Plateforme Dédiée", desc: "Accès personnel aux replays, documentations techniques exclusives et trackeur de progression personnalisé." },
                { icon: <Code2 className="text-[#d97757]" size={28} />, title: "Projet Fil Rouge", desc: "Ne vous contentez pas d'écouter. Construisez une application complexe de A à Z en utilisant uniquement l'IA." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-stone-800/50 border border-stone-700 p-8 rounded-xl hover:bg-stone-800 transition-colors"
                >
                  <div className="mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid gap-6">
                {[
                  { icon: <ShieldAlert className="text-[#d97757]" />, title: "Anticiper l'obsolescence", desc: "Les développeurs qui ignorent l'IA voient leur valeur sur le marché s'effriter de jour en jour." },
                  { icon: <Target className="text-[#d97757]" />, title: "Précision chirurgicale", desc: "Apprenez à prompter pour le code, pas pour du texte. Maîtrisez le contexte pour des résultats parfaits." },
                  { icon: <Zap className="text-[#d97757]" />, title: "Output démultiplié", desc: "Passez de l'écriture manuelle laborieuse à l'orchestration de systèmes. Produisez 10x plus, avec moins de bugs." },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 bg-white border border-stone-100 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">{item.title}</h4>
                      <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-[10px] uppercase tracking-widest text-[#d97757] font-bold">Le Pourquoi</span>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mt-4 mb-8">Pourquoi maintenant ?</h2>
              <div className="space-y-6 text-stone-500 text-lg leading-relaxed">
                <p>
                  Nous traversons la plus grande révolution de l&apos;ingénierie logicielle depuis l&apos;invention d&apos;Internet. La vitesse de livraison devient le seul avantage compétitif durable.
                </p>
                <p>
                  Cette formation n&apos;est pas un cours théorique sur l&apos;IA. C&apos;est un <strong className="text-stone-800">bootcamp tactique</strong> conçu par des ingénieurs pour des ingénieurs. Nous ne vous apprenons pas à utiliser ChatGPT, nous vous apprenons à transformer votre machine en usine à logiciel pilotée par agent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-stone-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Lock size={120} />
            </div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="relative z-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt pour la mutation ?</h2>
              <p className="text-stone-400 mb-10 text-lg max-w-xl mx-auto">
                La plateforme est actuellement accessible uniquement via lien d&apos;invitation personnalisé. Si vous avez reçu votre clé d&apos;accès, connectez-vous pour commencer votre voyage.
              </p>
              <div className="inline-flex flex-col items-center gap-4">
                <div className="px-8 py-4 bg-[#d97757] text-white rounded-lg font-bold opacity-50 cursor-not-allowed transition-all">
                  Inscriptions Fermées
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">En attente de la prochaine vague d&apos;invitations</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-stone-200 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center text-white">
              <Cpu size={14} />
            </div>
            <span className="font-bold tracking-tighter text-stone-900">CODEX_AI</span>
          </div>
          <div className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold text-center">
            Plateforme privée — Accès sur invitation uniquement — {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <span className="text-stone-300 text-[10px] uppercase tracking-widest font-bold">Système v4.0.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
