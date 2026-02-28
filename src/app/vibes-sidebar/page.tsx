"use client";

import React, { useState } from 'react';
import DashSidebarVibeA from '@/components/vibes/DashSidebarVibeA';
import DashSidebarVibeB from '@/components/vibes/DashSidebarVibeB';
import DashSidebarVibeC from '@/components/vibes/DashSidebarVibeC';

const vibes = [
  { id: 'A', label: 'Profil & Badges', component: DashSidebarVibeA },
  { id: 'B', label: 'Timeline Verticale', component: DashSidebarVibeB },
  { id: 'C', label: 'Agenda Semaine', component: DashSidebarVibeC },
];

export default function VibesSidebarPage() {
  const [activeVibe, setActiveVibe] = useState('A');
  const ActiveComponent = vibes.find(v => v.id === activeVibe)!.component;

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono">
      {/* Tab selector */}
      <div className="sticky top-0 z-50 bg-white border-b border-stone-200 px-8 py-4 flex items-center gap-6">
        <h1 className="text-xs font-bold text-stone-900 uppercase tracking-widest mr-8">
          Sidebar Vibes
        </h1>
        {vibes.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveVibe(v.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeVibe === v.id
                ? 'bg-[#d97757] text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            Vibe {v.id} — {v.label}
          </button>
        ))}
      </div>

      {/* Preview: sidebar + mock main content */}
      <div className="flex h-[calc(100vh-64px)]">
        <ActiveComponent />

        {/* Mock main content area */}
        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight">VOTRE PARCOURS</h2>
            <p className="text-sm text-stone-500 mb-10">Traversez les secteurs pour maîtriser l&apos;architecture des agents.</p>

            {/* Mock session cards */}
            {[1, 2, 3, 4].map(week => (
              <div key={week} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#d97757] font-bold text-lg">{week}</div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">SECTEUR {week}</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map(s => (
                    <div key={s} className="h-40 rounded-xl border border-stone-200 bg-white p-5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-stone-400">S{String((week-1)*3+s).padStart(2,'0')}</span>
                        <div className="w-4 h-4 rounded-full bg-stone-100" />
                      </div>
                      <div>
                        <div className="h-3 w-3/4 bg-stone-100 rounded mb-2" />
                        <div className="h-2 w-1/2 bg-stone-50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
