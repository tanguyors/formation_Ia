import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SESSIONS_DATA = [
  {
    week: 1, day: 1, sessionNumber: 1,
    title: "Setup & Premiers Pas",
    description: "Installation de Claude Code, configuration de l'environnement et premier projet assisté par IA. Comprendre les modèles, les plans et le système de contexte.",
    briefing: "Première mission, opérateur. Aujourd'hui tu vas installer ta nouvelle arme : Claude Code. Ce n'est pas un simple chatbot — c'est un agent IA qui vit dans ton terminal, lit ton code, crée des fichiers et exécute des commandes. À la fin de cette session, tu auras configuré ton environnement, compris comment fonctionne le système de contexte, et tu auras scaffoldé un projet complet en moins de 5 minutes. Bienvenue dans le futur du développement.",
    objectives: ["Installer et configurer Claude Code CLI", "Comprendre les modèles (Opus, Sonnet, Haiku) et choisir le bon plan", "Maîtriser les commandes essentielles et la navigation", "Comprendre le système de contexte (comment Claude lit ton code)", "Scaffolder un premier projet complet avec Claude Code"],
  },
  {
    week: 1, day: 2, sessionNumber: 2,
    title: "CLAUDE.md & Context Engineering",
    description: "Maîtriser le fichier CLAUDE.md et les règles de contexte",
    briefing: "Le CLAUDE.md est votre arme secrète. Apprenez à structurer vos instructions, définir des conventions de code et créer un contexte qui fait de Claude votre meilleur coéquipier.",
    objectives: ["Structure avancée du CLAUDE.md", "Context rules & patterns", "Conventions de code automatisées", "Templates réutilisables"],
  },
  {
    week: 1, day: 3, sessionNumber: 3,
    title: "Workflow 10x au quotidien",
    description: "Intégrer Claude Code dans votre workflow quotidien pour une productivité x10",
    briefing: "Passez à la vitesse supérieure. Découvrez les patterns de travail qui multiplient votre productivité : génération de code, refactoring assisté, debugging intelligent.",
    objectives: ["Patterns de génération de code", "Refactoring assisté par IA", "Debugging intelligent", "Automatisation des tâches répétitives"],
  },
  {
    week: 2, day: 1, sessionNumber: 4,
    title: "MCP : Le Protocole",
    description: "Comprendre le Model Context Protocol et son architecture",
    briefing: "MCP est le standard qui connecte l'IA à vos outils. Comprenez l'architecture client-serveur, les transports disponibles et comment MCP révolutionne l'intégration IA.",
    objectives: ["Architecture MCP client-serveur", "Protocole et transports", "Écosystème des serveurs MCP", "Cas d'usage concrets"],
  },
  {
    week: 2, day: 2, sessionNumber: 5,
    title: "Serveurs MCP en pratique",
    description: "Installer, configurer et utiliser des serveurs MCP existants",
    briefing: "Mettez les mains dans le cambouis. Installez des serveurs MCP populaires (filesystem, GitHub, Supabase) et connectez-les à Claude Code pour étendre ses capacités.",
    objectives: ["Installation de serveurs MCP", "Configuration et sécurité", "Intégration avec Claude Code", "Chaîner plusieurs serveurs"],
  },
  {
    week: 2, day: 3, sessionNumber: 6,
    title: "Créer son serveur MCP custom",
    description: "Développer un serveur MCP sur mesure pour vos besoins",
    briefing: "Allez plus loin : créez votre propre serveur MCP. De la spec au déploiement, construisez un outil IA qui résout un vrai problème de votre workflow.",
    objectives: ["SDK MCP TypeScript", "Définir des tools custom", "Gestion des resources", "Déploiement et distribution"],
  },
  {
    week: 3, day: 1, sessionNumber: 7,
    title: "Agents IA : Fondamentaux",
    description: "Comprendre et créer des agents IA autonomes",
    briefing: "Les agents sont le futur du développement. Comprenez comment ils fonctionnent, les patterns d'orchestration et créez votre premier agent autonome.",
    objectives: ["Architecture des agents IA", "Patterns d'orchestration", "Boucle agent (plan-execute-observe)", "Premier agent autonome"],
  },
  {
    week: 3, day: 2, sessionNumber: 8,
    title: "Subagents & Multi-agents",
    description: "Orchestrer plusieurs agents pour des tâches complexes",
    briefing: "Un seul agent c'est bien, une armée c'est mieux. Apprenez à décomposer des tâches complexes en sous-tâches et à orchestrer des agents spécialisés.",
    objectives: ["Subagents et délégation", "Communication inter-agents", "Stratégies de parallélisation", "Gestion des erreurs distribuée"],
  },
  {
    week: 3, day: 3, sessionNumber: 9,
    title: "Git Worktrees & Agent SDK",
    description: "Gestion avancée du code avec worktrees et Agent SDK",
    briefing: "Maîtrisez les worktrees Git pour travailler en parallèle et découvrez l'Agent SDK pour créer des agents Claude Code personnalisés et puissants.",
    objectives: ["Git worktrees en profondeur", "Claude Agent SDK", "Agents avec accès filesystem", "Pipeline de développement IA"],
  },
  {
    week: 4, day: 1, sessionNumber: 10,
    title: "Projet Full-AI : Architecture",
    description: "Concevoir un projet complet piloté par l'IA de bout en bout",
    briefing: "Semaine finale, projet ambitieux. Concevez l'architecture d'un vrai projet en utilisant tout ce que vous avez appris : Claude Code, MCP, Agents, le combo ultime.",
    objectives: ["Architecture full-AI", "Design system avec Gemini MCP", "Scaffolding automatisé", "Plan de développement IA-first"],
  },
  {
    week: 4, day: 2, sessionNumber: 11,
    title: "Projet Full-AI : Construction",
    description: "Construire le projet avec une armée d'agents",
    briefing: "C'est l'heure de construire. Déployez vos agents, connectez vos serveurs MCP et laissez l'IA générer du code de production pendant que vous orchestrez.",
    objectives: ["Développement assisté par agents", "Intégration MCP en production", "Tests automatisés par IA", "Revue de code IA-assistée"],
  },
  {
    week: 4, day: 3, sessionNumber: 12,
    title: "Patterns Avancés & Avenir",
    description: "Patterns de production avancés et vision du futur",
    briefing: "Dernière mission. Découvrez les patterns avancés pour la production, les custom hooks, les AI-scripts et préparez-vous pour le futur du développement IA.",
    objectives: ["Custom Hooks Claude Code", "AI-scripts de production", "Patterns de déploiement IA", "Roadmap personnelle IA-dev"],
  },
]

const BADGES_DATA = [
  { name: "Premier Pas", description: "Compléter la première session", icon: "🚀", condition: "complete_session_1", xpReward: 50 },
  { name: "Semaine 1", description: "Compléter toutes les sessions de la semaine 1", icon: "⚡", condition: "complete_week_1", xpReward: 100 },
  { name: "Connecteur", description: "Atteindre le niveau Connecteur", icon: "🔗", condition: "reach_level_connecteur", xpReward: 50 },
  { name: "MCP Master", description: "Compléter toutes les sessions MCP", icon: "🔌", condition: "complete_week_2", xpReward: 100 },
  { name: "Architecte", description: "Atteindre le niveau Architecte", icon: "🏗️", condition: "reach_level_architecte", xpReward: 50 },
  { name: "Agent Smith", description: "Compléter toutes les sessions Agents", icon: "🤖", condition: "complete_week_3", xpReward: 100 },
  { name: "Sentinelle", description: "Atteindre le niveau Sentinelle", icon: "👁️", condition: "reach_level_sentinelle", xpReward: 50 },
  { name: "Full Stack IA", description: "Compléter toute la formation", icon: "🏆", condition: "complete_all_sessions", xpReward: 200 },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Seed sessions
  for (const sessionData of SESSIONS_DATA) {
    await prisma.session.upsert({
      where: { sessionNumber: sessionData.sessionNumber },
      update: sessionData,
      create: {
        ...sessionData,
        date: new Date(2026, 8, 1 + (sessionData.sessionNumber - 1) * 2), // Placeholder dates
        isPublished: true,
      },
    })
  }
  console.log(`✅ ${SESSIONS_DATA.length} sessions seeded`)

  // Seed badges
  for (const badgeData of BADGES_DATA) {
    await prisma.badge.upsert({
      where: { name: badgeData.name },
      update: badgeData,
      create: badgeData,
    })
  }
  console.log(`✅ ${BADGES_DATA.length} badges seeded`)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
