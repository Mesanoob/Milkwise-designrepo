---
name: milkwise-sg-design
description: Use this skill to generate well-branded interfaces and assets for MilkWise SG, an independent baby formula comparison and price calculator website for Singapore parents. Contains essential design guidelines, color tokens (cream pastels + sage), Inter / JetBrains Mono type stack, asset library (logo, product photos, real dataset of 76 formulas), and a working website UI kit with home / compare / calculator / nutrition / parents / about screens.
user-invocable: true
---

# MilkWise SG — Design Skill

You are designing for **MilkWise SG**, an independent baby formula comparison and price calculator website for Singapore parents (ages 26–42, mostly browsing on mobile, often sleep-deprived).

> **Tagline.** Formula facts, clearly laid out.

## How to use this skill

1. **Read `README.md` at the root of this skill** — it covers brand at a glance, content fundamentals (voice / tone), and visual foundations (color, type, spacing, motion).
2. **Open `colors_and_type.css`** — every design token (color, type, spacing, radius, shadow, motion) lives there as a CSS custom property and is dark-mode aware via `prefers-color-scheme`. Import this file once and use the `--mw-*` variables.
3. **Pull from `assets/`** — `logo-mark.svg` (baby-bottle mark), `logo-wordmark.svg`, and real product photographs in `assets/products/`. Never re-draw the logo; copy the SVG.
4. **Use real data from `data/formulas.json`** — 76 real Singapore-stocked products with stage, brand, price, scoop size, ingredient flags. Wire your prototypes to this file rather than inventing dummy products.
5. **Reuse components from `ui_kits/website/`** — `atoms.jsx` exposes `LogoMark`, `Wordmark`, `Button`, `Pill`, `Tag`, `Badge`, `StageBadge`, `Icon` (Lucide-backed), formatters (`fmtSGD`, `fmtPerGram`), and section primitives. Higher-level screens (`Home`, `Compare`, `HeadToHead`, `Calculator`, `NutritionGuide`, `ForNewParents`, `About`) demonstrate full patterns. `styles.css` carries the kit-local CSS.

## What you're outputting

- **For visual artifacts** (slides, mocks, throwaway prototypes) → produce static HTML files that link `colors_and_type.css` and any kit components you need. Copy assets out so the file is portable.
- **For production code** → lift the tokens (CSS vars) and component patterns (React function components in `ui_kits/website/`) and reimplement against the user's stack.

## House rules

- **Three families.** Cream/off-white surfaces (`--mw-bg`, `--mw-bg-panel`, `--mw-bg-card`). Sage accent (`--mw-accent`). Warm pastels (cream, butter, clay, dusty blue) for chips, cards, badges. Forest green and clinical white are off-brand.
- **Numbers in mono.** Every price, ratio, and per-unit figure uses `--mw-font-mono` (JetBrains Mono) with `font-variant-numeric: tabular-nums`.
- **Display in SF.** Hero, section openers, and product names use `--mw-font-display` (SF Pro Display, falling back to Inter Tight). Bold (700) on hero, semibold (600) on headings.
- **Honest voice.** Second person ("you", "your baby"). No marketing adjectives — call them out as marketing instead. Always show the source of any health claim.
- **No emoji in product UI.** Only in long-form content or as the ⚠️ / ℹ️ disclaimer glyphs.
- **Dark mode is auto.** Tokens flip under `@media (prefers-color-scheme: dark)`. Test in both.
- **120px sections, 4px base.** Use the `--mw-s-*` scale. On mobile, sections collapse to 64px.

## When invoked without context

Ask:
- Which page or component? (home, compare, head-to-head, calculator, nutrition, parents, about — or new)
- What's the deliverable — static mock, click-thru prototype, slide, or production component?
- Light, dark, or both?
- Which data should drive the UI? (default to `data/formulas.json`)

Then design as an expert who already knows the brand. Surprise the user with restraint, not maximalism.
