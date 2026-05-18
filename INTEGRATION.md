# Integrating the MilkWise SG design into the `milkwise` app

This repo (`milkwise-designrepo`) is the **design source of truth**. The
`milkwise` app (Expo SDK 54 · React Native 0.81 · Expo Router · TypeScript
strict · NativeWind, shipping Web PWA + iOS + Android) is the **consumer**.

The website here is a **React DOM prototype** (HTML/CSS, in-browser Babel). It
is the *visual spec*, not code to copy. The job is to reimplement those screens
in React Native, pixel-matched, using your existing token/data architecture.

---

## 1. Bridge the two repos

You can't `npm install` this; pull a curated reference into `milkwise`:

1. Copy these into the app under `design-reference/` (read-only, gitignored
   from the build, kept for the porting agent + visual diffing):
   - `colors_and_type.css` — canonical token values
   - `design-reference/tokens.ts` — RN/NativeWind-ready port of those tokens
   - `design-reference/tokens.json` — raw values (light + dark)
   - `design-reference/data-mapping.md` — design fields → your schema
   - `ui_kits/website/` — the runnable prototype (visual reference)
   - `assets/` — logo + 17 product photos
2. Add the CLAUDE.md block from §7 so the porting agent treats tokens as
   canonical and the prototype as the pixel target.
3. Run the prototype side-by-side while porting:
   `python3 -m http.server` in this repo →
   `localhost:8000/ui_kits/website/index.html`. Toggle dark mode (sun/moon,
   top-right) and check every screen at mobile width — that's your reference.
   Pre-captured pixel references (every page × light/dark × desktop/mobile,
   plus clean hero-mesh plates) are in `design-reference/screens/` and
   `design-reference/hero-mesh/` — see `design-reference/REFERENCE-IMAGES.md`.

Re-pull when this repo changes; it's the upstream.

---

## 2. Fonts (decision: adopt the design system)

Replace DM Sans / DM Serif Display. The system is **Inter + Inter Tight +
JetBrains Mono**, and *numerals are mono + tabular* — a core brand rule (price
columns must align).

```sh
npx expo install @expo-google-fonts/inter @expo-google-fonts/inter-tight \
  @expo-google-fonts/jetbrains-mono expo-font
```

| Role | Family (token key `fonts.*`) | Weights |
|---|---|---|
| Display / headings | Inter Tight (`display`) | 600, 700 |
| Body / UI | Inter (`body`) | 400, 500, 600 |
| Numerals / data | JetBrains Mono (`mono`) | 400, 500 |

- Load via `useFonts` at the root; gate render on `fontsLoaded`.
- Every price, ratio, per-gram/per-scoop, scoop count, calculator output →
  `fonts.mono` with `style={{ fontVariant: ['tabular-nums'] }}`.
- Update `src/config/theme.ts` and the NativeWind `fontFamily` config; remove
  the `@expo-google-fonts/dm-*` deps and any DM references.

---

## 3. Tokens

`design-reference/tokens.ts` is the port — colors (light+dark), spacing (4px
scale), radii, type scale, weights, line-heights, tracking, motion, RN shadow
equivalents, and hero-mesh anchor colors. Merge it into `src/config/theme.ts`.

Rules carried from the brand:
- **No hardcoded hex anywhere.** Reference token keys only. If a value is
  wrong, fix `colors_and_type.css` upstream, then re-port.
- **Dark mode** = OS preference seeded + manual toggle, persisted
  (AsyncStorage), mirroring the prototype. Drive NativeWind's color scheme
  from a theme context; the toggle is the sun/moon control in the nav.
- **Tracking** is in `em` in CSS; RN `letterSpacing` is px →
  `tracking(trackingEm.tight, fontSizePx)`.
- **Shadows**: two-step elevation (`s1` resting card, `s2` hover/float),
  `s3` modals only. No shadows on text. The 3px focus halo → a same-radius
  outer `View` at accent @ 0.2.
- Surfaces: page is `bg` (never pure white), `bgPanel` for bands/alt rows/
  inputs, `bgCard` only where a card lifts.

---

## 4. Component inventory → RN mapping

Prototype files in `ui_kits/website/` (read them; they encode the exact
layout/spacing). DOM → RN translation:

| Prototype (`*.jsx`) | RN target | Notes |
|---|---|---|
| `atoms.jsx` — Button, Pill, Tag, Badge, StageBadge, Section, Eyebrow, SourceBadge, formatters | shared `components/ui/*` + `lib/format.ts` | `fmtSGD/fmtPerGram/fmtCount` port verbatim. `<button>`→`Pressable`; `:hover`→`pressed`/selected. |
| `LogoMark` / `Wordmark` | `<Text>🍼</Text>` + text | emoji renders native; no SVG needed. SG flag → `react-native-svg` or a small asset. |
| `Icon` (Lucide CDN) | `lucide-react-native` | same set, `strokeWidth={1.5}`. Clean substitution. |
| `Chrome.jsx` — NavBar, DisclaimerBanner, Footer, ThemeToggle, mobile menu | Expo Router layout (`app/_layout`, header/tab bar) + a banner component | single-page `useState('home')` → file routes. Banner dismiss persists (AsyncStorage). Sticky translucent nav → header with `navBg`. |
| `Home.jsx` — hero, stats, features, steps, strip | `app/index` screen, `ScrollView` sections | hero mesh → §6. Count-up not used here. |
| `Compare.jsx` — search+autocomplete, filter strip, List/Grid/Table views, CompareTray | `app/compare` + `ProductsContext` | Table = horizontal `ScrollView` + sticky first column. Tray = persistent bottom bar. `milkSourceOf/dietOf/tagsFor/imageFor/shortName` → pure TS. |
| `HeadToHead.jsx` — side-by-side + nutrition table | `app/compare/[ids]` screen or modal | reads nutrition per-100ml; best-value cell highlight = `accentSoft` + ✓. Horizontal scroll, sticky product column. |
| `Calculator.jsx` — DOB picker, age auto-fill, product picker, mix feeding, solids, benchmark bar, spending chart | `app/calculator` | numbers count up on first render (Reanimated/Moti). Chart = RN `View` bars or `react-native-svg`; no chart lib. Date picker → platform picker. |
| `Pages.jsx` — NutritionGuide, ForNewParents, About | `app/nutrition`, `app/parents`, `app/about` | long-form; `maxProse` width on web, full-width native. Accordions → `Pressable` + layout animation. Source badges mandatory next to every data claim. |

Navigation: prototype's `page` state + `compareOpen` overlay → Expo Router
stack. Compare tray + selection persist via `ProductsContext` (you already
have it).

---

## 5. Screens — match these exactly

Use the prototype + `README.md`'s "Visual foundations" as the spec. Per screen,
verify against the running prototype in **both** themes at phone width:

- **Home** — hero (eyebrow, 3-line display headline, sub, two CTAs, scroll
  chevron), stats band on `bgPanel`, 3 feature cards, 3 numbered steps,
  disclaimer strip.
- **Compare** — search w/ autocomplete, top filter strip (stage, milk source
  pills, diet, brand, tin size, sort + asc/desc), List (default) / Grid /
  Table, results count, methodology note, bottom compare tray (max 3).
- **Head-to-head** — price block (best value = `accentSoft` + ✓), formula
  details, nutrition per-100ml table, ingredient tag pills (on=accent,
  off=outline), bottom action bar, disclaimer row.
- **Calculator** — see inventory; the post-6mo cost flattening in the
  projection chart is intentional, keep it.
- **Nutrition Guide** — amber-band disclaimer (`warnBg`/`warnText`), age
  table, prep steps, nutrient accordion, pHF vs eHF cards, every figure has a
  `SourceBadge`.
- **For New Parents** — editorial long-form, pull-quotes (2px `accent` left
  border), milk-source emoji cards (🐄 🐐 🌿 🧪 — allowed here by design),
  red/green-flag columns.
- **About** — founder note card, methodology, numbered T&C with anchors.

Copy/voice rules (from `README.md` → Content fundamentals) are part of the
design: second person, sentence case, mono tabular numbers, `$42.90` /
`RM 89` / `$0.048`, en-dash ranges, no marketing adjectives, disclaimers lead
the page. Don't paraphrase the disclaimer/empathy lines.

---

## 6. Known fidelity risks — flag, don't silently drop

- **Hero mesh** — biggest compromise. 6 stacked CSS gradients + per-layer
  blend modes + vignette don't exist in RN. Recommended: use the pre-rendered
  plates already in `design-reference/hero-mesh/` (light + dark, the design's
  own mesh — not invented art) as a background `Image`. Fallbacks:
  `react-native-svg` radial stack, then `expo-linear-gradient`. Anchor colors
  in `tokens.ts → heroMesh`; regenerate any size via
  `ui_kits/website/_mesh.html`.
- **Hover states** — no hover on touch. The brand's signature
  border→accent promote becomes a **press/selected** state. Keep `@media
  (hover:hover)` behavior only on web/PWA if cheap.
- **Backdrop blur nav** — `expo-blur` on native; acceptable to fall back to
  opaque `navBg` if perf suffers.
- **Tables** — no `<table>`; horizontal `ScrollView` + sticky first column,
  right-aligned mono numerals, fade-out right edge on mobile.
- **Count-up numbers** — Reanimated/Moti; gate on
  `AccessibilityInfo.isReduceMotionEnabled()` (brand respects reduced motion).

---

## 7. CLAUDE.md additions for the milkwise repo

```md
## Design system (MilkWise SG)

- Source of truth: `design-reference/` (pulled from milkwise-designrepo).
  `colors_and_type.css` / `tokens.ts` are canonical — NO hardcoded hex,
  reference token keys only. Visual target: the prototype in
  `design-reference/ui_kits/website/` (run it, diff against it, both themes).
- Fonts: Inter (body 400/500/600), Inter Tight (display 600/700),
  JetBrains Mono (all numerals, `fontVariant: ['tabular-nums']`). DM Sans /
  DM Serif are removed.
- Numbers: every price/ratio/per-unit is mono + tabular. Currency `$42.90`,
  `RM 89`, per-gram `$0.048` (3dp). Ranges use en-dash.
- Dark mode: OS-seeded + manual toggle, persisted. All tokens flip; no
  per-component hex.
- Voice: second person, sentence case, no marketing adjectives, disclaimers
  lead the page. Don't reword disclaimer/empathy copy.
- Every health/data claim carries a visible source badge.
- SHIPPING checks still apply: `npm run typecheck` = 0, WCAG AA contrast,
  ≥44px tap targets, no insecure storage.
```

---

## 8. Suggested sequence

1. Fonts + `theme.ts` token merge + dark-mode context/toggle → verify a
   throwaway screen in both themes.
2. Shared atoms (`Button/Pill/Tag/Badge/StageBadge/SourceBadge/Section`) +
   `format.ts` + icon wiring.
3. Chrome: Expo Router layout, nav, disclaimer banner, footer.
4. Data adapter (`data-mapping.md`) against your `products.json`.
5. Screens in order: Home → Compare → Head-to-head → Calculator → Nutrition
   → For New Parents → About.
6. Hero mesh asset, count-up animations, reduced-motion + a11y pass.
7. `npm run typecheck` (0), contrast/tap-target audit, dark-mode QA on
   device, web PWA smoke test.

Each step is independently shippable. Treat the running prototype as the
acceptance test for every screen.
