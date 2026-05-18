# MilkWise SG — Design System

> *Formula facts, clearly laid out.*

This design system supports **MilkWise SG**, an independent baby formula comparison and price calculator website for Singapore parents. The site is a calm, trustworthy reference — not an e-commerce store, not a medical platform — that lets parents compare ~120 formula products by ingredients, price-per-gram, price-per-scoop, and cross-border savings vs. Malaysia.

The audience is parents aged 26–42 in Singapore, mostly browsing on phones, often sleep-deprived. Every page must earn its complexity by being faster, calmer, and more honest than any other source they could land on.

---

## Running the website locally

The website UI kit (`ui_kits/website/index.html`) is the primary deliverable: a
click-through prototype across Home / Compare / Calculator / Nutrition / For New
Parents / About, wired to the real 76-product dataset.

It loads data via `fetch()` and transpiles JSX in the browser, so it must be
served over HTTP — opening the file directly with `file://` will not work. From
the repo root:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/ui_kits/website/index.html
```

Outbound network access is required: React, Babel, Lucide, and the Inter /
JetBrains Mono fonts load from CDNs. Everything else (tokens, components, data,
product photos) is local in this repo.

---

## What's in this folder

```
README.md                 ← you are here
SKILL.md                  ← agent-skill front matter for Claude Code reuse
colors_and_type.css       ← the only source of truth for tokens
fonts/                    ← (substituted via Google Fonts CDN — see Type below)
assets/
  logo-mark.svg           ← leaf-droplet mark, green on transparent
  logo-wordmark.svg       ← horizontal mark + wordmark + "SG" pill
  products/               ← 17 representative formula tin photographs
data/
  formulas.json           ← 76 real product records extracted from the master xlsx
preview/                  ← design-system cards (consumed by the Design System tab)
ui_kits/
  website/                ← UI kit for the marketing + product site
```

The xlsx file `uploads/Baby_Milk_Master_Comparison_Updated.xlsx` was provided by the user; it contains 76 formula products across 3 sheets (Product Overview, Web Research, Nutritional Data). We extracted the Product Overview to `data/formulas.json` for use in the UI kit.

---

## Brand at a glance

- **Tagline.** Formula facts, clearly laid out.
- **Mood.** Refined minimalism with warmth. Apple-level whitespace × ui.com systematic grids × a soft cream undertone so it never feels clinical.
- **Voice.** Direct, reassuring, practical. Zero brand promotion. Zero judgment about feeding choices. Acknowledges that parents are tired and overwhelmed.
- **Visual axis.** Warm off-white (#FAFAF8) page, forest green (#1A6B4A) accent, near-black text, mono numerals, generous spacing, 8px card radius. No glossy gradients, no stock-photo cuteness, no fake urgency.

---

## Content fundamentals

**Voice & person.** Second person ("you", "your baby"). The site speaks *to* the parent as a calm peer — never *at* them as an expert. The implicit narrator is another parent who has done the research, not a brand or a doctor.

**Tone targets.**
- *Honest* — the site openly states what it isn't (not medical advice, not affiliated, not sponsored). It calls out marketing language as marketing language.
- *Practical* — every page leads with what to *do*, not what to know.
- *Reassuring* — no language that amplifies anxiety. Acknowledge the emotional reality of choosing formula without being saccharine.
- *Specific* — numbers, not adjectives. "$0.048 per gram", not "great value".

**Casing.** Sentence case for headlines and buttons. Title Case is reserved for the wordmark, page titles in the H1 slot, and proper nouns. SHOUTING CAPS appear only inside a small-caps eyebrow label (letter-spacing 0.12em).

**Pronouns.** "We" is the editorial team (used sparingly in About / Methodology). "You" is the reader. "Your baby" — never "the baby" or "the child", which feel clinical. Avoid "mum / dad" by default — many caregivers are neither.

**Numbers & currency.** SGD prices always written as `$42.90` (no leading SGD), with mono-spaced tabular numerals so columns align. Malaysia prices: `RM 89`. Per-gram and per-scoop figures use 3 decimals (`$0.048`) so micro-differences are legible. Percentages use `%`, ranges use an en-dash (`6–8 feeds/day`), times use `~` for "approximately".

**Disclaimers** are written as one sentence in plain English and lead the page where they apply, never tucked into the footer alone. The amber `#FEF3C7` band is the only place they live visually.

**Emoji.** Used sparingly as section glyphs in long-form content (🐄 🐐 🌿 🧪 for milk sources, ⚠️ for disclaimers, ℹ️ for footnotes, ✅ / ⚠️ for the green/red flag callouts). They never appear inside the product database or the comparison table. If a section can carry an icon from the iconography set instead, prefer that.

**Examples (lifted from the brief, lightly normalized).**

- Hero — *"Every tin. Every ingredient. Every dollar."* / *"The most complete formula comparison resource for Singapore parents."*
- Stats — *"120+ formulas tracked"*, *"0 sponsored listings"*.
- Pull quote — *"All formula sold in Singapore must meet regulatory minimums. The base nutritional adequacy is guaranteed."*
- Disclaimer — *"MilkWise SG is an independent, non-sponsored resource. We are not affiliated with any formula brand. This site is not medical advice."*
- Empathy line — *"There is no judgment here — fed is best."*

What we don't say:
- "Game-changing", "revolutionary", "world's best".
- "Closest to breastmilk", "premium nutrition", "scientifically advanced" (these are the marketing tropes the site critiques).
- "Trust us" — we explain methodology instead.

---

## Visual foundations

**Surfaces.** Three stacked greys: `--mw-bg #FAFAF8` (page), `--mw-bg-panel #F2F1EE` (stats bands, alternating table rows, calculator inputs), and `--mw-bg-card #FFFFFF` (only where a card needs to lift above the page). The page is never pure `#FFFFFF` — that's the clinical look we're actively avoiding.

**Color.** Forest green (`#1A6B4A`) is the only chromatic accent and it earns every use: primary CTAs, brand mark, "best value" cell highlights, savings figures, active nav underline. The blue (`#2C6E9B`) is reserved for *data callouts* — info badges, source pills — never for actions. Amber (`#FEF3C7` / `#92400E`) is *only* for the medical / pricing disclaimer band. Red (`#C0392B`) appears only on hard alerts inside disclaimers. Everything else is the warm-neutral spine.

**Type.** Serif display (Fraunces, sub for Canela / Freight) for hero headlines and editorial section openers; grotesque (Geist, sub for Söhne / GT America) for everything else; mono (Geist Mono) for all numbers and table cells. Numbers always use `font-variant-numeric: tabular-nums` so columns line up across rows. Display sizes use negative tracking (`-0.02em`); body uses 0; small-caps eyebrows use `+0.12em` + uppercase.

**Spacing.** 4px base. Sections use 120px top/bottom on desktop, 64px on mobile. Components default to 24px / 48px gaps. The numerical scale (`--mw-s-1` through `--mw-s-30`) is exposed in `colors_and_type.css`.

**Radii.** Three sizes: 4px on inputs, 8px on cards, 24px on pills and badges. Nothing rounder than a pill — no super-circles, no glassmorphism blobs.

**Shadows.** Very light, warm-tinted. Two-step elevation only: `0 1px 3px rgba(17,17,16,0.06)` (resting card) and `0 4px 16px rgba(17,17,16,0.08)` (hovered / floating tray). A third deeper one (`0 12px 40px / 0.10`) exists for modals only. No drop shadows on type. No inset shadows.

**Borders.** A single hairline `--mw-border #E4E3DF` does ~90% of separation work. We hover-promote a card border to `--mw-accent #1A6B4A` (still 1px) rather than thickening it — that's the brand's signature interaction.

**Backgrounds & imagery.** No stock baby photos. No formula-tin lifestyle shots. The hero uses an abstract warm gradient mesh — soft sage + cream organic blobs — and that's the only "decorative" image we allow. Real product photography is treated as data: square crops on `--mw-bg-card`, never bled, never tinted. (Note: Singapore retail tin photos carry a mandated "Breastfeeding is best for babies" watermark — we keep it, since redacting it would misrepresent the source image.)

**Animation.** Restrained. 200ms transitions on every interactive surface, `cubic-bezier(0.2, 0.6, 0.2, 1)` ease (defined as `--mw-ease`). The nav fades from transparent → blurred-warm-white on scroll. Calculator result numbers count up on first render. Cards translate-up 4px on hover. No bouncing, no spinning, no parallax. Respect `prefers-reduced-motion`.

**Hover states.**
- *Cards* → border-color promotes to `--mw-accent`, shadow steps from 1 → 2, lifts 4px on translate-Y.
- *Buttons (filled)* → background `--mw-accent-hover #155538` (~10% darker).
- *Buttons (outlined / ghost)* → background fills with `--mw-accent-tint #EEF5F1`.
- *Nav links* → text color fades to `--mw-accent` over 200ms; active state adds a 2px green underline.
- *Table rows* → background `--mw-accent-tint`.
- All hover effects are gated by `@media (hover: hover)` so touch devices don't flash them.

**Press states.** Filled buttons darken one extra step and inset-shift by 1px (no scale-shrink). Inputs gain `--mw-shadow-focus` (a 3px green halo at 18% opacity).

**Transparency & blur.** Used only on the sticky top nav — `rgba(250,250,248,0.85)` with `backdrop-filter: blur(12px)` once the user has scrolled past the hero. Never on cards. Never on text.

**Layout rules.**
- Page max-width: 1200px (`--mw-max-content`).
- Long-form prose max-width: 680px (`--mw-max-prose`).
- Sidebar filter column: 280px on desktop, collapses to a bottom sheet at ≤768px.
- Navbar is sticky at 64px tall; disclaimer banner sits in a separate 36px row below it (dismissible).
- All number columns use tabular-nums and right-align.
- Tables on mobile scroll horizontally with a fade-out right-edge indicator and a sticky first column.

**What the brand is *not*.**
- Not gradient-heavy. The hero mesh is the only one and it's soft.
- Not emoji-heavy in product UI.
- Not maximalist with iconography — see below.
- Not photo-driven. Type and data carry the page.

---

## Dark mode

The token system supports two flip mechanisms:

- **Automatic** — `@media (prefers-color-scheme: dark)` honors the user's OS setting.
- **Manual** — set `data-theme="dark"` (or `"light"`) on the `<html>` element to force a mode; this always wins. The website UI kit exposes a toggle in the top nav, persists the choice in `localStorage`, and seeds initial state from the OS preference.

All palette tokens, shadows, the hero mesh, and the disclaimer band flip together. Component-level CSS uses tokens throughout — no hard-coded hex values remain in the kit.

## Iconography

The brand mark itself is the **🍼 emoji** (Unicode U+1F37C, Baby Bottle). It renders natively on every modern OS via the system color-emoji font stack, scales crisply at any size, ships with no licensing, and is recognised instantly. The `LogoMark` React component renders it inside a `<span>` with the emoji-only font stack forced (`"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"`) so the color glyph always wins over text emoji. `assets/logo-mark.svg` keeps a vector fallback (the emoji wrapped in an SVG `<text>` element) for export contexts that need a file path.

For UI icons the kit uses **Lucide** from CDN at 1.5–1.6px stroke, sized to match adjacent cap-height. Icons inherit `currentColor` so they tint with surrounding text.

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="leaf" stroke-width="1.5"></i>
```

Where icons appear:
- **Brand mark** — 🍼 emoji, top-left of every page; inside the wordmark.
- **Nav** — Lucide `menu`/`x` on mobile, `sun`/`moon` for the theme toggle.
- **Buttons** — at most a trailing chevron (`→`) on CTAs; otherwise text-only.
- **Compare / Calculator chrome** — Lucide glyphs (`search`, `calculator`, `book-open`, `info`, `sliders-horizontal`, `layout-grid`, `table-2`, `arrow-right`, `download`, `chevron-down`).
- **Section openers in long-form content** — the "milk source" cards use four emoji (🐄 🐐 🌿 🧪) as illustrative content, by design.
- **Disclaimers** — `⚠️` and `ℹ️` are the only emoji that appear in the chrome.

**Substitution flag.** Lucide is the working icon set, not a brand decision. Swap the CDN script tag if the team prefers a different family — the stroke weight discipline (≈1.5px) is the brand-level constraint, not the specific library.

---

## Type — substitution flag

The site is designed around **Apple SF Pro Display / SF Pro Text** (UI) and **JetBrains Mono** (data). SF Pro is licensed only for Apple platforms, so the stack picks it up natively on macOS/iOS and substitutes Inter Tight / Inter from Google Fonts everywhere else. The earlier serif direction (Canela / Freight / Fraunces) was retired during the design review — the brand is now SF-style end to end.

| Role    | Stack head            | Free substitute (Google)     |
|---------|-----------------------|------------------------------|
| Display | SF Pro Display        | **Inter Tight** 600 / 700    |
| Body    | SF Pro Text           | **Inter** 400 / 500 / 600    |
| Mono    | (uses JetBrains Mono) | **JetBrains Mono** 400 / 500 |

**→ Action for the team:** if you license SF Pro for non-Apple platforms (or want the bundled feel on every device), drop the `.woff2` files into `fonts/` and add an `@font-face` block. The CSS variables list SF first, so the swap is transparent.

---

## Index

- **Tokens** — `colors_and_type.css`
- **Brand marks** — `assets/logo-mark.svg`, `assets/logo-wordmark.svg`
- **Product photography** — `assets/products/*.jpg` (17 representative tins; full set of 73 in `uploads/` if needed)
- **Real product data** — `data/formulas.json` (76 products with stage, brand, price, scoop size, ingredients flags)
- **Preview cards** — `preview/*.html` (consumed by the Design System tab)
- **Website UI kit** — `ui_kits/website/index.html` and component JSX files
- **Skill manifest** — `SKILL.md`
