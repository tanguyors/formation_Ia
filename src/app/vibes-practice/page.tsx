"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const PracticeVibeWorkshop = dynamic(
  () => import("@/components/vibes/PracticeVibeWorkshop"),
  { ssr: false }
);
const PracticeVibeChallenge = dynamic(
  () => import("@/components/vibes/PracticeVibeChallenge"),
  { ssr: false }
);
const PracticeVibeTerminal = dynamic(
  () => import("@/components/vibes/PracticeVibeTerminal"),
  { ssr: false }
);

const VIBES = [
  { id: 1, name: "Workshop Lab", desc: "Split-screen : instructions + terminal", Component: PracticeVibeWorkshop },
  { id: 2, name: "Challenge Cards", desc: "Cartes gamifiées avec XP et badges", Component: PracticeVibeChallenge },
  { id: 3, name: "Terminal Mission", desc: "Immersif dark mode, missions + typing", Component: PracticeVibeTerminal },
];

export default function VibesPracticePage() {
  const [activeVibe, setActiveVibe] = useState(1);
  const ActiveComponent = VIBES.find((v) => v.id === activeVibe)?.Component;

  return (
    <div className="min-h-screen bg-stone-950 text-white font-mono">
      {/* Selector */}
      <div className="sticky top-0 z-[100] bg-stone-900/90 backdrop-blur-md border-b border-stone-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold tracking-tight">
            <span className="text-[#d97757]">PRACTICE</span> VIBES PREVIEW
          </h1>
          <div className="flex gap-2">
            {VIBES.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVibe(v.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeVibe === v.id
                    ? "bg-[#d97757] text-white shadow-lg"
                    : "bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700"
                }`}
              >
                Vibe {v.id}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-2 flex gap-6">
          {VIBES.map((v) => (
            <div
              key={v.id}
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                activeVibe === v.id ? "text-[#d97757]" : "text-stone-600"
              }`}
            >
              {v.name} — {v.desc}
            </div>
          ))}
        </div>
      </div>

      {/* Active Vibe */}
      <div className="border-t border-stone-800">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
