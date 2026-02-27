"use client";

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Import the 3 vibes as separate renderers
import { SectionRendererV1 } from '@/components/vibes/CourseVibe1';
import { SectionRendererV2 } from '@/components/vibes/CourseVibe2';
import { SectionRendererV3 } from '@/components/vibes/CourseVibe3';

// Sample sections to preview each vibe
const SAMPLE_SECTIONS = [
  {
    id: '1',
    title: 'Pourquoi Claude Code change tout',
    type: 'text' as const,
    content: "Claude Code n'est pas un chatbot avec un champ texte. C'est un **agent IA autonome** qui tourne directement dans ton terminal. Il peut :\n\n- **Lire** tout ton codebase (fichiers, dossiers, dépendances)\n- **Écrire** du code, créer des fichiers, modifier des fichiers existants\n- **Exécuter** des commandes shell (npm, git, tests, build...)\n- **Raisonner** sur ton architecture et proposer des solutions\n\nConcrètement, tu lui décris ce que tu veux en langage naturel, et il code pour toi. Pas du copier-coller de snippets — du vrai développement assisté, dans ton projet réel, avec ton stack.\n\n**84% des développeurs** utilisent déjà l'IA dans leur travail. Mais la plupart se limitent à du copier-coller depuis ChatGPT. Claude Code, c'est un tout autre niveau : l'IA **dans** ton éditeur, **dans** ton terminal, **dans** ton workflow.",
    codeLanguage: null,
    sortOrder: 1,
  },
  {
    id: '2',
    title: 'Installation de Claude Code',
    type: 'code' as const,
    content: '# Installer Claude Code globalement\nnpm install -g @anthropic-ai/claude-code\n\n# Vérifier l\'installation\nclaude --version\n\n# Se connecter à son compte\nclaude auth login\n\n# Lancer Claude Code dans un projet\ncd mon-projet\nclaude',
    codeLanguage: 'bash',
    sortOrder: 2,
  },
  {
    id: '3',
    title: 'Les 3 modes de Claude',
    type: 'text' as const,
    content: "## Opus — Le cerveau\nLe modèle le plus intelligent. Parfait pour l'architecture, les décisions complexes et le raisonnement profond. Plus lent, plus cher, mais imbattable sur la qualité.\n\n## Sonnet — L'équilibre\nLe sweet spot entre intelligence et vitesse. C'est celui que tu utiliseras 80% du temps. Rapide, précis, économique.\n\n## Haiku — La vitesse\nUltra-rapide et peu coûteux. Idéal pour les tâches simples : renommage, formatage, petites corrections. Ne lui demande pas de l'architecture.",
    codeLanguage: null,
    sortOrder: 3,
  },
  {
    id: '4',
    title: 'Exercice : Ton premier projet',
    type: 'exercise' as const,
    content: "## Mission\nScaffolder une application Next.js complète avec Claude Code en moins de 5 minutes.\n\n### Étapes :\n1. Crée un nouveau dossier `portfolio-ia`\n2. Lance `claude` dans ce dossier\n3. Donne-lui ce prompt : *\"Crée un portfolio de développeur avec Next.js, Tailwind CSS, une page d'accueil, une page projets et une page contact. Design moderne et responsive.\"*\n4. Observe comment il structure les fichiers\n5. Lance `npm run dev` et vérifie le résultat\n\n### Critères de succès :\n- L'app se lance sans erreur\n- Les 3 pages sont fonctionnelles\n- Le design est responsive",
    codeLanguage: null,
    sortOrder: 4,
  },
  {
    id: '5',
    title: 'Astuce : Le mode architecture',
    type: 'tip' as const,
    content: "Quand tu travailles sur un projet complexe, utilise le mode **plan** de Claude Code :\n\n```\nclaude --mode plan\n```\n\nDans ce mode, Claude analyse ton projet **avant** d'écrire du code. Il te propose un plan d'action détaillé que tu peux valider ou modifier avant l'exécution.\n\nC'est la différence entre un junior qui code d'abord et un senior qui réfléchit d'abord.",
    codeLanguage: null,
    sortOrder: 5,
  },
];

export default function VibesCoursPage() {
  const [activeVibe, setActiveVibe] = useState<number | null>(null);

  if (activeVibe !== null) {
    const renderers = [SectionRendererV1, SectionRendererV2, SectionRendererV3];
    const ActiveRenderer = renderers[activeVibe];
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-[100]">
          <button
            onClick={() => setActiveVibe(null)}
            className="px-6 py-3 bg-[#1C1917] text-white rounded-full font-mono text-sm font-bold hover:bg-[#d97757] transition-colors shadow-xl"
          >
            Retour aux vibes
          </button>
        </div>
        <ActiveRenderer sections={SAMPLE_SECTIONS} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1917] font-mono text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          VIBES <span className="text-[#d97757]">COURS</span>
        </h1>
        <p className="text-stone-400 text-xl">3 styles pour le viewer de cours. Clique pour tester avec du vrai contenu.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Keynote Fullscreen", desc: "Slides plein écran, grandes typos, fond qui change par type de section. Immersif et impactant." },
          { name: "Dark Terminal", desc: "Mode sombre immersif, curseur de typing, barre de nav flottante, ambiance hacker premium." },
          { name: "Split Screen", desc: "Sidebar table des matières à gauche, contenu à droite. Style documentation Stripe." },
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
              <h3 className="text-xl font-bold group-hover:text-[#d97757] transition-colors">{vibe.name}</h3>
            </div>
            <p className="text-stone-400 leading-relaxed">{vibe.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-[#d97757] text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Tester <ChevronRight size={16} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
