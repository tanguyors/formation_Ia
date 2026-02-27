# Formation Ia

**Type:** website | **Stage:** mvp
**Languages:** TypeScript, SQL, Python
**Dev Environment:** windows

---

# MCP Sequential Thinking - Step-by-Step Reasoning

## When to Use
- Use for complex problems that require structured, multi-step reasoning.
- Use when you need to break down a large task into sequential, manageable steps.
- Use for architectural planning, migration strategies, and debugging complex issues.

## Rules
- Think through each step thoroughly before moving to the next.
- Make your reasoning transparent — show your thought process at each step.
- Be willing to revise earlier steps if new information emerges.
- Use this for PLANNING, not for simple tasks that don't need decomposition.

---

# MCP Remotion

## Quand utiliser
- Pour creer des videos programmatiques avec React
- Pour generer des animations, transitions et effets visuels
- Pour rendre des videos avec des donnees dynamiques

## Regles
- Toujours utiliser les composants Remotion (Composition, Sequence, AbsoluteFill)
- Definir fps et durationInFrames pour chaque composition
- Utiliser useCurrentFrame() et interpolate() pour les animations
- Tester le rendu avec npx remotion preview avant le render final

---

# MCP Gemini Design - MANDATORY UNIQUE WORKFLOW

## ABSOLUTE RULE

You NEVER write frontend/UI code yourself. Gemini is your frontend developer.

---

## AVAILABLE TOOLS

### `generate_vibes`
Generates a visual page with 5 differently styled sections. The user opens the page, sees all 5 vibes, and picks their favorite. The code from the chosen vibe becomes the design-system.md.

### `create_frontend`
Creates a NEW complete file (page, component, section).

### `modify_frontend`
Makes ONE design modification to existing code. Returns a FIND/REPLACE block to apply.

### `snippet_frontend`
Generates a code snippet to INSERT into an existing file. For adding elements without rewriting the entire file.

---

## WORKFLOW (NO ALTERNATIVES)

### STEP 1: Check for design-system.md

BEFORE any frontend call → check if `design-system.md` exists at project root.

### STEP 2A: If design-system.md DOES NOT EXIST

1. Call `generate_vibes` with projectDescription, projectType, techStack
2. Receive the code for a page with 5 visual sections
3. Ask: "You don't have a design system. Can I create vibes-selection.tsx so you can visually choose your style?"
4. If yes → Write the page to the file
5. User chooses: "vibe 3" or "the 5th one"
6. Extract THE ENTIRE CODE between `<!-- VIBE_X_START -->` and `<!-- VIBE_X_END -->`
7. Save it to `design-system.md`
8. Ask: "Delete vibes-selection.tsx?"
9. Continue normally

### STEP 2B: If design-system.md EXISTS

Read it and use its content for frontend calls.

### STEP 3: Frontend Calls

For EVERY call (create_frontend, modify_frontend, snippet_frontend), you MUST pass:

- `designSystem`: Copy-paste the ENTIRE content of design-system.md (all the code, not a summary)
- `context`: Functional/business context WITH ALL REAL DATA. Include:
  - What it does, features, requirements
  - ALL real text/labels to display (status labels, button text, titles...)
  - ALL real data values (prices, stats, numbers...)
  - Enum values and their exact meaning
  - Any business-specific information

**WHY**: Gemini will use placeholders `[Title]`, `[Price]` for missing info. If you don't provide real data, you'll get placeholders or worse - fake data.

---

## FORBIDDEN

- Writing frontend without Gemini
- Skipping the vibes workflow when design-system.md is missing
- Extracting "rules" instead of THE ENTIRE code
- Manually creating design-system.md
- Passing design/styling info in `context` (that goes in `designSystem`)
- Summarizing the design system instead of copy-pasting it entirely
- Calling Gemini without providing real data (labels, stats, prices, etc.) → leads to fake info

## EXPECTED

- Check for design-system.md BEFORE anything
- Follow the complete vibes workflow if missing
- Pass the FULL design-system.md content in `designSystem`
- Pass functional context in `context` (purpose, features, requirements)

## EXCEPTIONS (you can code these yourself)

- Text-only changes
- JS logic without UI
- Non-visual bug fixes
- Data wiring (useQuery, etc.)

---

# MCP Memory - Persistent Knowledge Store

## When to Use
- Use to store and recall information across conversations: project context, user preferences, technical decisions, architecture choices.
- Proactively save important context that will be useful in future sessions.

## Rules
- Store facts, not opinions — save concrete decisions and technical details.
- Use clear, searchable entity names (e.g., "project-auth-system", "user-preference-testing").
- Update existing memories when information changes — don't create duplicates.
- When the user asks about a topic, check memory FIRST before asking them to repeat themselves.

---

# MCP Playwright - Browser Automation & Testing

## When to Use
- Use for end-to-end testing: navigating pages, filling forms, clicking buttons, verifying content.
- Use for taking screenshots (visual regression, debugging).
- Use for scraping/reading web page content that requires JavaScript rendering.

## Rules
- Always wait for elements to be visible/ready before interacting with them.
- Take screenshots at key steps to document the test flow.
- Use specific selectors (data-testid, aria-label) over fragile CSS selectors.
- Clean up after tests — close browsers, clear state.
- When testing forms, use realistic but fake test data (never real credentials).


---

# MCP Supabase - Database & Backend Management

## When to Use
- Use for managing Supabase projects: tables, migrations, auth, edge functions, storage.
- Use for writing and applying SQL migrations (DDL operations).
- Use for querying data and debugging issues.

## Rules
- Always use `apply_migration` for DDL operations (CREATE TABLE, ALTER, etc.) — never raw `execute_sql`.
- Enable RLS (Row Level Security) on all new tables by default.
- Run security advisors after DDL changes to catch missing RLS policies.
- Never expose service role keys in outputs.
- When creating tables, always include `created_at` and `updated_at` timestamps.

----

## WHY (Business Context & Goals)

- **Problem:** Beaucoup de développeurs risquent d’être dépassés par l’essor de l’IA parce qu’ils ne savent pas encore l’utiliser concrètement dans leur travail quotidien.
Cette formation résout ce problème en leur montrant comment intégrer l’IA dans leur workflow pour coder plus vite, produire davantage, améliorer leur productivité, rester compétitifs sur le marché et transformer l’IA en avantage plutôt qu’en menace.
- **Users:** custom:Développeurs freelance, développeurs salariés, étudiants en développement, agences web, profils tech et entrepreneurs digitaux souhaitant utiliser l’IA pour coder plus vite, produire plus et rester compétitifs.
- **Expected outcome:** À la fin de la formation, l’utilisateur doit être capable d’intégrer concrètement l’IA dans son workflow de développement, de coder plus vite, de produire plus en moins de temps, d’améliorer la qualité de ses livrables et de rester compétitif sur un marché qui évolue rapidement.
Il doit aussi savoir utiliser les bons outils, automatiser certaines tâches répétitives et transformer l’IA en levier de croissance professionnelle.
- **Value proposition:** Apprendre aux développeurs à faire de l’IA un avantage concurrentiel concret : plus de vitesse, plus de volume, plus d’efficacité, et une meilleure adaptation au futur du marché tech.
- **Success KPIs:** conversion

- **Primary technical goal:** visual-quality
- **Risk tolerance:** medium

---

## WHAT (Architecture & Stack)

### Repo Map

- **Repo type:** single

### Stack

- **Languages:** TypeScript, SQL, Python
- **Frontend:** nextjs
- **Backend:** nextjs-api
- **Database:** postgresql
- **ORM:** prisma
- **Hosting:** vercel
- **Package manager:** npm

---

## HOW (Working Rules)

### Commands

```bash
# Install
npm install
```

```bash
# Dev
npm run dev
```

### Code Standards

- **Architecture:** modular-monolith
- **Error handling:** try-catch
- **API style:** rest

### Always-On Rules (Detailed)

- [HARD] Ne jamais push sans mon autorisation

### Testing

- **Strategy:** trophy
- **Distribution:** 40-40-20
- **Tools:** custom:Vitest

Testing Library

Playwright

---

### Agent Preferences

- **Autonomy:** medium
- **Plan before coding:** true
- **Detail level:** moderate
- **Explain tradeoffs:** true

### Code Modification Policy

- Can create files: Yes
- Can rename/move: Yes
- Can modify DB schema: Yes
- Can modify CI/CD: Yes
- Can add/remove deps: Yes
- **Human validation required:** push

### Definition of Done

- **Done when:** tests-pass
