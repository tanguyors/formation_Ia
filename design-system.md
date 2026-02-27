# Design System — Cloud Tangerine

## Visual Identity
- **Theme**: Light mode, warm, clean, modern
- **Background**: Warm white (#FFFCFA)
- **Primary accent**: Terracotta/Orange (#d97757) — rgba(217, 119, 87) — hsl(15, 63, 60)
- **Success**: Green (#16A34A) for completed states
- **Live/Active**: Primary accent (#d97757) with pulse
- **Locked**: Light grey (#D6D3D1)
- **Urgent/Error**: Red (#DC2626)
- **Text**: Dark (#1C1917) for headings, stone-500 (#78716C) for body, stone-400 (#A8A29E) for muted
- **Font**: Monospace (font-mono) — system monospace or JetBrains Mono

## Color Palette
- `#FFFCFA` — main background (warm white)
- `#FFFFFF` — card backgrounds
- `#FFF7ED` — surface/sidebar background (warm tint)
- `#FED7AA` — light borders, progress track (orange-200)
- `#E7E5E4` — neutral borders (stone-200)
- `#d97757` — primary accent (terracotta orange)
- `rgba(217,119,87,0.06)` — accent background tint
- `rgba(217,119,87,0.2)` — accent border
- `rgba(217,119,87,0.25)` — active border (glow)
- `#1C1917` — primary text (stone-900)
- `#78716C` — secondary text (stone-500)
- `#A8A29E` — muted text (stone-400)
- `#16A34A` — success green
- `rgba(22,163,74,0.06)` — success background
- `rgba(22,163,74,0.2)` — success border
- `#DC2626` — error/urgent red
- `#D6D3D1` — locked/disabled grey (stone-300)
- `#FAF9F7` — locked background

## Effects & Animations
- **No glow/neon** — clean, subtle shadows instead
- **Shadows**: `shadow-sm`, `shadow-md` for cards on hover
- **Framer Motion**: opacity/y entrance animations, scale on hover
- **Pulse**: animate-pulse on active/live elements
- **Transitions**: `transition-all` with hover scale `hover:scale-[1.02]`

## Component Patterns

### Cards
```
- bg-white border border-stone-200 rounded-xl
- Hover: hover:shadow-md hover:scale-[1.02]
- Active: border-[#d97757]/25 shadow-[0_0_20px_rgba(217,119,87,0.1)]
- Completed: border-green-600/20
- Locked: opacity-50 bg-stone-50
```

### Buttons
```
- Primary: bg-[#d97757] text-white rounded-lg hover:bg-[#c4674a]
- Secondary: bg-orange-50 text-[#d97757] rounded-lg hover:bg-orange-100
- Outline: border border-[#d97757]/20 text-[#d97757]
- Disabled: bg-stone-100 text-stone-400 cursor-not-allowed
```

### Badges / Status
```
- Completed: bg-green-50 border-green-200 text-green-600
- Live/Active: bg-orange-50 border-[#d97757]/25 text-[#d97757] animate-pulse
- Locked: bg-stone-100 border-stone-200 text-stone-400
- Urgent: bg-red-50 border-red-200 text-red-500
- All: rounded-full, text-[10px] uppercase tracking-widest
```

### Headers / HUD
```
- bg-[#FFF7ED] or bg-white
- border-b border-stone-200 or border-orange-200
- Accent elements use #d97757
```

### Sidebar
```
- bg-[#FFF7ED] border-r border-stone-200
- Section titles: text-[10px] uppercase tracking-widest text-stone-400
- Active items: text-[#d97757]
```

### Progress Bars
```
- Track: bg-orange-200 (or bg-stone-200) rounded-full
- Fill: bg-[#d97757] rounded-full
- Height: h-2 to h-2.5
```

## Typography Scale
- **H1**: text-2xl font-bold tracking-tight text-stone-900
- **H2**: text-lg font-bold text-stone-800
- **Body**: text-sm text-stone-500
- **Labels**: text-[10px] uppercase tracking-widest text-stone-400
- **Micro**: text-[9px] text-stone-400
- **All text**: font-mono

## Spacing
- Section padding: p-6 to p-8
- Card padding: p-4 to p-5
- Gap: gap-3 to gap-4
- Rounded: rounded-lg to rounded-xl

## Tone & Copy Style
- French language
- Clean, professional but engaging
- RPG/gaming vocabulary: "Quête", "Secteur", "Inventaire", "XP"
- Status labels: uppercase tracking-widest
- No military/hacker vocabulary — more adventure/quest style

## Layout: Dungeon Map / Roguelike
- Sidebar left: Quest log, objectives, stats
- Top HUD: Avatar, rank, XP bar, inventory badges
- Main: 3-column grid (4 rows = 4 weeks)
- Sessions = rooms connected by corridors (dashed lines)
- Completed = green check, Current = pulsing accent, Locked = grey lock
- Click room = overlay panel with session details
