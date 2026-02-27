"use client";

import React, { useState } from "react";
import LandingVibeOption1 from "@/components/vibes/LandingVibeOption1";
import LandingVibeOption2 from "@/components/vibes/LandingVibeOption2";
import LandingVibeOption3 from "@/components/vibes/LandingVibeOption3";
import LandingVibeOption4 from "@/components/vibes/LandingVibeOption4";
import LandingVibeOption5 from "@/components/vibes/LandingVibeOption5";

const VIBES = [
  { id: 1, name: "ELECTRIC INDIGO", desc: "Blanc pur, indigo, Linear/Vercel", Component: LandingVibeOption1 },
  { id: 2, name: "DARK PREMIUM", desc: "Fond sombre, bleu/cyan, VS Code", Component: LandingVibeOption2 },
  { id: 3, name: "FROST MINIMAL", desc: "Blanc pur, teal, ultra-minimal Apple", Component: LandingVibeOption3 },
  { id: 4, name: "NOIR LUXURY", desc: "Blanc + noir + or, éditorial luxe", Component: LandingVibeOption4 },
  { id: 5, name: "GRADIENT TECH", desc: "Blanc, gradient bleu→violet, glass", Component: LandingVibeOption5 },
];

export default function VibesLandingPage() {
  const [activeVibe, setActiveVibe] = useState(1);
  const ActiveComponent = VIBES.find((v) => v.id === activeVibe)!.Component;

  return (
    <div>
      {/* Vibe Selector Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto">
          <span className="text-white/50 text-xs font-mono uppercase tracking-widest shrink-0 mr-2">
            VIBE:
          </span>
          {VIBES.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setActiveVibe(vibe.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeVibe === vibe.id
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {vibe.id}. {vibe.name}
            </button>
          ))}
          <span className="text-white/30 text-[10px] font-mono shrink-0 ml-auto">
            {VIBES.find((v) => v.id === activeVibe)?.desc}
          </span>
        </div>
      </div>

      {/* Active Vibe */}
      <div className="pt-[52px]">
        <ActiveComponent />
      </div>
    </div>
  );
}
