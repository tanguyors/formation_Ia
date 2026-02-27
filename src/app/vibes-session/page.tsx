"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ChevronLeft, ChevronRight, Play, Clock, Zap, Calendar,
  FileText, Link as LinkIcon, Video, Github, BookOpen, CheckCircle2,
  Lock, Trophy, Layout, Terminal, ShieldAlert, Cpu, Wifi, Star, ExternalLink
} from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

// === MOCK DATA ===
const s = {
  id: "49a7d048-beca-4cf4-945a-1dab05815278",
  sessionNumber: 2,
  title: "CLAUDE.md & Context Engineering",
  week: 1,
  day: 2,
  durationMinutes: 90,
  briefing: "Le CLAUDE.md est votre arme secrète. Apprenez à structurer vos instructions, définir des conventions de code et créer un contexte qui fait de Claude votre meilleur coéquipier.",
  objectives: [
    "Le fichier CLAUDE.md : donner un cerveau persistant à l'IA",
    "Context engineering : structurer ses prompts pour du code fiable",
    "Les slash commands (/init, /compact, /review, /commit...)",
    "Les hooks : automatiser des actions sur chaque événement",
    "Créer un CLAUDE.md complet pour un projet réel"
  ],
  userStatus: "IN_PROGRESS" as const,
  xpReward: 100,
}

const RES = [
  { id: "1", title: "Generate-MD — Générateur de CLAUDE.md", type: "tool" },
  { id: "2", title: "Manage Claude's Memory — Doc officielle", type: "doc" },
  { id: "3", title: "Using CLAUDE.md Files — Blog Anthropic", type: "article" },
  { id: "4", title: "Hooks Reference — Doc officielle", type: "doc" },
  { id: "5", title: "Andrej Karpathy : Software Is Changing", type: "video" },
]

const ICONS: Record<string, React.ElementType> = { article: FileText, repo: Github, video: Video, doc: BookOpen, tool: Layout, other: LinkIcon }
const LABELS: Record<string, string> = { article: "Article", repo: "Repository", video: "Vidéo", doc: "Documentation", tool: "Outil" }

// =============================================
// VIBE 1 — BENTO EDITORIAL
// =============================================
function Vibe1() {
  const styles = ["bg-orange-50 border-orange-100 text-[#F97316]", "bg-stone-900 border-stone-800 text-white", "bg-white border-stone-200 text-stone-800", "bg-stone-100 border-stone-200 text-stone-600"]

  return (
    <div className="relative min-h-screen bg-white font-sans overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-stone-50 rounded-full blur-[100px] -z-10" />
      <header className="sticky top-[57px] z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-2 hover:bg-stone-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-stone-600" /></div>
            <div><span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block">Formation</span><span className="text-sm font-bold text-stone-900">CODEX_AI</span></div>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full">
            <ChevronLeft className="w-4 h-4 text-stone-400" /><span className="text-xs font-bold px-2 border-x border-stone-200 text-stone-600">S02 / 12</span><ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {[{ i: Calendar, l: "Semaine", v: "1" }, { i: Clock, l: "Durée", v: "1h30" }, { i: Trophy, l: "Récompense", v: "+100 XP" }].map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full">
                    <p.i className="w-3.5 h-3.5 text-[#F97316]" /><span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{p.l}</span><span className="text-xs font-bold text-stone-900">{p.v}</span>
                  </div>
                ))}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-stone-900 leading-[0.95] tracking-tighter uppercase italic">{s.title}</h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-xl">{s.briefing}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-stone-50 rounded-3xl p-8 border border-stone-200">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">Ressources & Matériel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RES.map(r => { const I = ICONS[r.type] || LinkIcon; return (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-lg group hover:border-[#F97316]/30 hover:bg-orange-50/30 transition-all">
                    <div className="flex items-center gap-3"><I className="w-4 h-4 text-stone-400 group-hover:text-[#F97316]" /><span className="text-sm font-medium text-stone-700">{r.title}</span></div>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </div>
                )})}
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Objectifs de mission</h2><div className="flex-1 h-px bg-stone-100" /></div>
              <div className="grid grid-cols-2 gap-4">
                {s.objectives.map((obj, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    className={cn("p-4 rounded-xl border flex flex-col justify-between min-h-[120px] hover:scale-[1.02] transition-transform", styles[i % styles.length])}>
                    <div className="flex justify-between items-start"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-current/20">0{i + 1}</div><Zap className="w-4 h-4 opacity-20" /></div>
                    <p className="text-sm font-bold leading-tight uppercase tracking-tight">{obj}</p>
                  </motion.div>
                ))}
                <div className="col-span-2 bg-gradient-to-br from-[#F97316] to-[#ea580c] rounded-xl p-6 text-white overflow-hidden relative">
                  <p className="text-2xl font-black italic uppercase leading-none mb-1">Prêt pour le déploiement ?</p>
                  <p className="text-xs text-white/80 uppercase tracking-widest">Session #2</p>
                  <Zap className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12" />
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-4 py-6 rounded-2xl font-black text-xl uppercase italic tracking-wider bg-stone-900 text-white hover:bg-[#F97316] hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)] shadow-xl transition-all duration-300">
              <Play className="w-6 h-6 fill-current" /> Lancer la mission
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// =============================================
// VIBE 2 — DARK TERMINAL
// =============================================
function Vibe2() {
  const Typing = ({ text, d = 0 }: { text: string; d?: number }) => (
    <motion.span>{text.split("").map((c, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01, delay: d + i * 0.03 }}>{c}</motion.span>)}</motion.span>
  )
  return (
    <div className="min-h-screen bg-[#0f172a] text-stone-300 font-mono selection:bg-[#F97316]/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.03]"><div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" /></div>
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-stone-500"><ChevronLeft size={18} /><span className="text-xs tracking-widest uppercase">/FORMATION</span></div>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.5)]" /><span className="text-[10px] text-stone-500 uppercase tracking-widest">SYSTEM ONLINE // CODEX_AI</span>
            <div className="h-4 w-[1px] bg-stone-800" /><span className="text-[10px] text-[#F97316] font-bold">S02 / 12</span>
          </div>
        </header>
        <div className="w-full bg-[#1C1917] border border-stone-800 rounded-lg overflow-hidden flex flex-wrap mb-10 shadow-xl">
          {[{ l: "SEMAINE", v: "1", ic: Terminal, a: false }, { l: "JOUR", v: "MERCREDI", ic: Zap, a: false }, { l: "DURÉE", v: "1h30", ic: Clock, a: false }, { l: "XP", v: "+100 XP", ic: CheckCircle2, a: true }].map((x, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-r border-stone-800 last:border-r-0">
              <x.ic size={14} className={x.a ? "text-[#F97316]" : "text-stone-500"} />
              <div><span className="text-[10px] text-stone-500 uppercase tracking-tighter block">{x.l}</span><span className={cn("text-xs font-bold", x.a ? "text-[#F97316]" : "text-stone-300")}>{x.v}</span></div>
            </div>
          ))}
          <div className="ml-auto flex items-center px-6 bg-[#F97316]/5 text-[#F97316] text-[10px] font-bold border-l border-stone-800"><Wifi size={14} className="mr-2" />STATION_002 CONNECTÉE</div>
        </div>
        <section className="mb-12">
          <div className="mb-2 text-[#F97316] text-xs font-bold tracking-[0.2em] opacity-80">[ MISSION_PARAMETER_INITIALIZED ]</div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight mb-4">
            <Typing text={s.title.toUpperCase()} /><motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-3 h-10 md:h-12 bg-[#F97316] ml-2 align-middle" />
          </h1>
          <div className="flex gap-2 text-[10px] text-stone-500 uppercase"><span>{">"} BOOT: SUCCESS</span><span>{">"} AES-256</span><span>{">"} KERNEL_MAIN</span></div>
        </section>
        <div className="text-stone-800 text-[10px] select-none py-4 font-mono overflow-hidden whitespace-nowrap">+-------------------------------------------------------------------------------------------------------+</div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-7">
            <div className="relative border border-stone-800 bg-[#1C1917]/40 p-6 rounded-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#F97316]/40" /><div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#F97316]/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#F97316]/40" /><div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#F97316]/40" />
              <div className="flex items-center gap-2 mb-4 text-[#F97316]"><ShieldAlert size={16} /><span className="text-[10px] font-bold tracking-widest uppercase">CONSIGNES_DU_BRIEFING</span></div>
              <p className="text-stone-400 text-sm leading-relaxed first-letter:text-[#F97316] first-letter:text-2xl first-letter:font-bold">{s.briefing}</p>
              <div className="mt-8 pt-6 border-t border-stone-800/50">
                <div className="text-[10px] text-stone-500 mb-3 uppercase tracking-widest">Ressources_Externes</div>
                <div className="flex flex-wrap gap-3">{RES.map(r => <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-stone-400 hover:text-white hover:border-[#F97316]/50 transition-all"><ExternalLink size={12} />{r.title}</div>)}</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-2"><span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Objectifs_Tactiques</span><span className="text-[10px] text-[#16A34A]">{s.objectives.length} CHARGÉS</span></div>
            {s.objectives.map((obj, i) => (
              <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 p-4 bg-[#1C1917]/20 border border-stone-800/50 rounded-lg hover:border-stone-700 transition-colors group">
                <span className="text-[#F97316] font-bold text-xs mt-0.5">{">"} {(i + 1).toString().padStart(2, "0")}</span>
                <span className="text-sm text-stone-300 group-hover:text-white transition-colors">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 mt-16 pb-20">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-[#F97316] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center gap-4 px-12 py-5 bg-[#F97316] text-white rounded-lg font-black tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Play size={20} fill="currentColor" /><span>LANCER LA MISSION</span><div className="absolute inset-0 border-2 border-white/20 rounded-lg" />
            </div>
          </motion.button>
          <div className="flex items-center gap-8 text-[10px] text-stone-600 tracking-widest font-bold"><div className="flex items-center gap-2"><Cpu size={12} /> CPU: 12%</div><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> MEM: OK</div></div>
        </div>
      </div>
    </div>
  )
}

// =============================================
// VIBE 3 — SPLIT HERO
// =============================================
function Vibe3() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-orange-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10"><div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-50/50 blur-[120px]" /><div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-stone-50 blur-[100px]" /></div>
      <div className="relative flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:h-screen md:sticky md:top-[57px] p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-100" style={{ height: "calc(100vh - 57px)" }}>
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-500"><div className="p-1.5 rounded-lg border border-stone-200"><ArrowLeft size={16} /></div><span className="text-sm font-medium">Formation</span></div>
            <div className="flex items-center gap-4"><span className="text-[10px] font-bold tracking-widest text-stone-400">S02 / 12</span><div className="flex gap-1"><div className="p-1.5 rounded-md border border-stone-200 text-stone-400"><ChevronLeft size={16} /></div><div className="p-1.5 rounded-md border border-stone-200 text-stone-400"><ChevronRight size={16} /></div></div></div>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-12 md:my-0">
            <div className="flex items-center gap-3 mb-6"><div className="px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase border bg-orange-50 border-orange-100 text-[#F97316]">SEMAINE 1</div></div>
            <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.1] tracking-tighter mb-6">{s.title}</h1>
          </motion.div>
          <button className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg bg-[#F97316] text-white hover:bg-[#EA580C] hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/10">LANCER LA SESSION <Play size={20} fill="currentColor" /></button>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-16 space-y-16">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ i: Calendar, l: "Jour", v: "Mercredi" }, { i: Clock, l: "Durée", v: "1h30" }, { i: Star, l: "Reward", v: "+100 XP" }, { i: Zap, l: "Session", v: "#2" }].map((p, idx) => (
              <div key={idx} className="flex flex-col gap-1"><span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium flex items-center gap-1"><p.i size={12} /> {p.l}</span><span className="text-sm font-semibold text-stone-900">{p.v}</span></div>
            ))}
          </section>
          <section>
            <div className="flex items-center gap-4 mb-8"><h2 className="text-xl font-bold tracking-tight">Objectifs de la session</h2><div className="h-px flex-1 bg-stone-100" /></div>
            <ul className="space-y-4">{s.objectives.map((obj, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-orange-100 flex items-center justify-center text-[10px] font-bold text-[#F97316]">{i + 1}</div>
                <p className="text-sm text-stone-600 leading-relaxed font-medium">{obj}</p>
              </motion.li>
            ))}</ul>
          </section>
          <section>
            <div className="flex items-center gap-4 mb-8"><h2 className="text-xl font-bold tracking-tight">Le Briefing</h2><div className="h-px flex-1 bg-stone-100" /></div>
            <p className="text-lg text-stone-500 leading-relaxed">{s.briefing}</p>
          </section>
          <section className="pb-16">
            <div className="flex items-center gap-4 mb-8"><h2 className="text-xl font-bold tracking-tight">Ressources & Outils</h2><div className="h-px flex-1 bg-stone-100" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{RES.map(r => { const I = ICONS[r.type] || LinkIcon; const l = LABELS[r.type] || "Lien"; return (
              <motion.div key={r.id} whileHover={{ y: -4, borderColor: "#F97316" }} className="p-4 bg-white border border-stone-200 rounded-xl transition-all group">
                <div className="flex items-start justify-between mb-3"><div className="p-2 bg-stone-50 rounded-lg group-hover:bg-orange-50 transition-colors"><I size={18} className="text-stone-500 group-hover:text-[#F97316]" /></div><span className="text-[9px] uppercase tracking-tighter text-stone-400 font-medium">{l}</span></div>
                <h4 className="text-sm font-semibold text-stone-900 leading-tight">{r.title}</h4>
              </motion.div>
            )})}</div>
          </section>
        </div>
      </div>
    </div>
  )
}

// =============================================
// SELECTEUR
// =============================================
const VIBES = [
  { id: 1, name: "BENTO EDITORIAL", desc: "Magazine, bento grid, titre géant italic" },
  { id: 2, name: "DARK TERMINAL", desc: "Hacker, dark, scanlines, typing effect" },
  { id: 3, name: "SPLIT HERO", desc: "Split-screen Notion/Linear, hero sticky" },
]

export default function VibesSessionPage() {
  const [selected, setSelected] = useState(1)
  return (
    <div className="font-sans">
      <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b-2 border-[#F97316] px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#F97316] shrink-0">VIBES</span>
          <div className="flex gap-2 flex-1">
            {VIBES.map(v => (
              <button key={v.id} onClick={() => setSelected(v.id)}
                className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", selected === v.id ? "bg-[#F97316] text-white shadow-lg shadow-orange-200/50" : "bg-stone-100 text-stone-600 hover:bg-stone-200")}>
                {v.id}. {v.name}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest hidden lg:block">{VIBES.find(v => v.id === selected)?.desc}</span>
        </div>
      </div>
      {selected === 1 && <Vibe1 />}
      {selected === 2 && <Vibe2 />}
      {selected === 3 && <Vibe3 />}
    </div>
  )
}
