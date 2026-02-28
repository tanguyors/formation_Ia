"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

interface Section {
  id: string;
  title: string | null;
  type: 'text' | 'code' | 'exercise' | 'tip' | 'warning' | 'quiz';
  content: string;
  codeLanguage: string | null;
  sortOrder: number;
}

interface VibeProps {
  sections: Section[];
  sessionId?: string;
  quizData?: any;
  onQuizPassed?: () => void;
}

// Lazy-load each vibe to avoid bundle bloat
const CourseVibeNotion = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeNotion').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });
const CourseVibeKeynote = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeKeynote').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });
const CourseVibeSplitIDE = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeSplitIDE').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });
const CourseVibeStripeDocs = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeStripeDocs').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });
const CourseVibeImmersive = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeImmersive').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });
const CourseVibeCardStack = dynamic<VibeProps>(() => import('@/components/vibes/CourseVibeCardStack').then(m => ({ default: m.SectionRendererV2 })), { ssr: false });

const mockSections = [
  {
    id: 's1',
    title: 'Pourquoi Claude Code change tout',
    type: 'text' as const,
    content: `Claude Code n'est pas un chatbot avec un champ texte. C'est un **agent IA autonome** qui tourne directement dans ton terminal. Il peut :

- **Lire** tout ton codebase — fichiers, dossiers, dépendances, configs
- **Écrire** du code, créer des fichiers, modifier des fichiers existants
- **Exécuter** des commandes shell (npm, git, tests, build, déploiement...)
- **Raisonner** sur ton architecture et proposer des solutions globales
- **Corriger** ses propres erreurs quand quelque chose ne fonctionne pas

Concrètement, tu lui parles en langage naturel, et il agit sur ton projet comme un développeur junior très rapide.`,
    codeLanguage: null,
    sortOrder: 1,
  },
  {
    id: 's2',
    title: 'Installation et Configuration',
    type: 'code' as const,
    content: `# Installer Claude Code globalement
npm install -g @anthropic-ai/claude-code

# Vérifier l'installation
claude --version

# Se connecter à son compte
claude auth login

# Démarrer Claude Code dans un projet
cd mon-projet
claude`,
    codeLanguage: 'bash',
    sortOrder: 2,
  },
  {
    id: 's3',
    title: 'Astuce importante',
    type: 'tip' as const,
    content: `Utilisez toujours **claude config set** pour personnaliser votre expérience. Par exemple, \`claude config set --global theme dark\` active le thème sombre dans le terminal.

Les fichiers **CLAUDE.md** à la racine de votre projet permettent de donner des instructions persistantes à Claude Code — c'est du **context engineering**.`,
    codeLanguage: null,
    sortOrder: 3,
  },
  {
    id: 's4',
    title: 'Attention : les limites',
    type: 'warning' as const,
    content: `Claude Code consomme des tokens à chaque interaction. Plus votre codebase est gros, plus le contexte est coûteux. Pensez à utiliser des fichiers **.claudeignore** pour exclure les dossiers inutiles (node_modules, .git, dist, etc.).

Ne partagez **jamais** votre clé API dans un dépôt public.`,
    codeLanguage: null,
    sortOrder: 4,
  },
  {
    id: 's5',
    title: 'Exercice : Premier projet',
    type: 'exercise' as const,
    content: `## À vous de jouer !

1. Créez un nouveau dossier \`test-claude\`
2. Initialisez un projet avec \`npm init -y\`
3. Lancez Claude Code avec la commande \`claude\`
4. Demandez-lui : "Crée-moi un serveur Express basique avec un endpoint /hello"
5. Testez le résultat avec \`node index.js\` puis \`curl http://localhost:3000/hello\`

| Étape | Commande | Résultat attendu |
|-------|----------|-----------------|
| 1 | mkdir test-claude && cd test-claude | Dossier créé |
| 2 | npm init -y | package.json créé |
| 3 | claude | Terminal interactif |
| 4 | Prompt en langage naturel | Code généré |
| 5 | node index.js | Serveur démarré |`,
    codeLanguage: null,
    sortOrder: 5,
  },
  {
    id: 's6',
    title: 'Les Slash Commands essentielles',
    type: 'text' as const,
    content: `## Commandes à connaître

Claude Code offre des **slash commands** puissantes pour accélérer votre workflow :

### Navigation
- \`/help\` — Affiche l'aide complète
- \`/clear\` — Vide le contexte de conversation
- \`/compact\` — Compresse le contexte pour économiser des tokens

### Fichiers
- \`/add-dir\` — Ajoute un dossier au contexte
- \`/read\` — Lit un fichier spécifique

### Actions
- \`/commit\` — Crée un commit Git propre
- \`/review\` — Fait une code review de vos changements
- \`/test\` — Lance les tests et analyse les résultats

> "Les slash commands sont le raccourci entre la pensée et l'action." — Un dev productif`,
    codeLanguage: null,
    sortOrder: 6,
  },
];

type VibeKey = 1 | 2 | 3 | 4 | 5 | 6 | null;

const VIBES = [
  { key: 1 as VibeKey, label: 'Vibe 1', subtitle: 'Notion Document', desc: 'Scroll vertical, sidebar TOC, doc-style' },
  { key: 2 as VibeKey, label: 'Vibe 2', subtitle: 'Apple Keynote', desc: 'Slides plein écran, typo bold, transitions' },
  { key: 3 as VibeKey, label: 'Vibe 3', subtitle: 'Split Pane IDE', desc: 'Panneau blanc + panneau dark code' },
  { key: 4 as VibeKey, label: 'Vibe 4', subtitle: 'Stripe Docs', desc: 'Three-column, sidebar + TOC, dev-docs' },
  { key: 5 as VibeKey, label: 'Vibe 5', subtitle: 'Immersive Scroll', desc: 'Full-width, watermarks, parallax Apple' },
  { key: 6 as VibeKey, label: 'Vibe 6', subtitle: 'Card Stack', desc: 'Cartes empilées 3D, swipe navigation' },
];

export default function VibesCoursePage() {
  const [activeVibe, setActiveVibe] = useState<VibeKey>(null);

  if (activeVibe) {
    const VibeComponent = {
      1: CourseVibeNotion,
      2: CourseVibeKeynote,
      3: CourseVibeSplitIDE,
      4: CourseVibeStripeDocs,
      5: CourseVibeImmersive,
      6: CourseVibeCardStack,
    }[activeVibe];

    return (
      <div className="relative">
        {/* Floating back button */}
        <button
          onClick={() => setActiveVibe(null)}
          className="fixed top-4 left-4 z-[200] px-4 py-2 bg-white border border-slate-200 rounded-full shadow-lg text-sm font-bold text-slate-700 hover:text-[#F97316] hover:border-[#F97316] transition-all flex items-center gap-2"
        >
          <span>&larr;</span> Retour aux vibes
        </button>
        {VibeComponent && <VibeComponent sections={mockSections} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Course Vibes Preview</h1>
          <p className="text-slate-500">6 styles différents pour la partie cours. Clique pour tester en plein écran.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIBES.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveVibe(v.key)}
              className="group p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-[#F97316] hover:shadow-xl transition-all text-left"
            >
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-[#F97316] transition-colors">
                {v.label}
              </div>
              <div className="text-sm font-bold text-[#F97316] mb-3">{v.subtitle}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{v.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
