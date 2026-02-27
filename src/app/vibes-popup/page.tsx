"use client";
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SessionModalVibe1 from '@/components/vibes/SessionModalVibe1';
import SessionModalVibe2 from '@/components/vibes/SessionModalVibe2';
import SessionModalVibe3 from '@/components/vibes/SessionModalVibe3';

const mockSession = {
  id: '1',
  number: 'S01',
  title: 'Setup & Premiers Pas',
  week: 1,
  weekTitle: 'MA\u00ceTRISER CLAUDE CODE',
  day: 'Lundi',
  status: 'COMPLETED' as const,
  briefing:
    "Bienvenue agent. Votre premi\u00e8re mission consiste \u00e0 initialiser votre environnement de d\u00e9veloppement IA. Vous apprendrez \u00e0 configurer Claude Code, \u00e0 authentifier vos terminaux et \u00e0 \u00e9tablir vos premi\u00e8res interactions avec les agents autonomes. La r\u00e9ussite de ce module d\u00e9bloquera l\u2019acc\u00e8s aux protocoles MCP avanc\u00e9s.",
  duration: '1h30',
  xp: 100,
};

const mockCurrent = {
  ...mockSession,
  id: '2',
  number: 'S02',
  title: 'CLAUDE.md & Context Engineering',
  status: 'CURRENT' as const,
  briefing:
    "Agent, votre deuxi\u00e8me mission porte sur la cr\u00e9ation de fichiers CLAUDE.md optimaux et la ma\u00eetrise du context engineering. Vous apprendrez \u00e0 configurer des instructions persistantes, \u00e0 utiliser les slash commands et les hooks pour automatiser votre workflow.",
};

const mockLocked = {
  ...mockSession,
  id: '3',
  number: 'S03',
  title: 'Workflows Avanc\u00e9s & Automatisation',
  status: 'LOCKED' as const,
  briefing:
    "Cette mission est verrouill\u00e9e. Terminez les missions pr\u00e9c\u00e9dentes pour d\u00e9bloquer l\u2019acc\u00e8s \u00e0 ce module sur les workflows avanc\u00e9s et l\u2019automatisation avec Claude Code.",
};

type VibeKey = null | '1' | '2' | '3';
type StatusKey = 'completed' | 'current' | 'locked';

export default function VibesPopupPage() {
  const [openVibe, setOpenVibe] = useState<VibeKey>(null);
  const [statusMode, setStatusMode] = useState<StatusKey>('completed');

  const sessionByStatus = {
    completed: mockSession,
    current: mockCurrent,
    locked: mockLocked,
  };

  const session = sessionByStatus[statusMode];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Sticky selector bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-slate-900">Pop-up Vibes Preview</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Status :</span>
            {(['completed', 'current', 'locked'] as StatusKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusMode(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  statusMode === s
                    ? 'bg-[#F97316] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vibe selector buttons */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm text-slate-500 mb-8 text-center">
          Cliquez sur un bouton pour ouvrir le pop-up dans le style correspondant. Changez le status en haut pour voir les 3 &eacute;tats (completed, current, locked).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { key: '1' as VibeKey, label: 'Vibe 1', subtitle: 'Bento Editorial', desc: 'Magazine, italic title, whitespace' },
            { key: '2' as VibeKey, label: 'Vibe 2', subtitle: 'Glassmorphism', desc: 'Frosted glass, blur, soft shadows' },
            { key: '3' as VibeKey, label: 'Vibe 3', subtitle: 'Minimal Notion', desc: 'Ultra-clean, Notion/Linear style' },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setOpenVibe(v.key)}
              className="group p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-[#F97316] hover:shadow-lg transition-all text-left"
            >
              <div className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-[#F97316] transition-colors">{v.label}</div>
              <div className="text-sm font-semibold text-[#F97316] mb-3">{v.subtitle}</div>
              <div className="text-xs text-slate-500">{v.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {openVibe === '1' && (
          <SessionModalVibe1
            session={session}
            onClose={() => setOpenVibe(null)}
            onLaunch={() => alert('Lancement session !')}
          />
        )}
        {openVibe === '2' && (
          <SessionModalVibe2
            session={session}
            onClose={() => setOpenVibe(null)}
            onLaunch={() => alert('Lancement session !')}
          />
        )}
        {openVibe === '3' && (
          <SessionModalVibe3
            session={session}
            onClose={() => setOpenVibe(null)}
            onLaunch={() => alert('Lancement session !')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
