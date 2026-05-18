/**
 * MilkWise SG — design tokens, ported for Expo / React Native / NativeWind.
 *
 * Source of truth: ../colors_and_type.css (the `--mw-*` CSS custom properties).
 * Do NOT hand-edit hex values here without changing the CSS first — that file
 * is canonical. Raw values are also in ./tokens.json.
 *
 * Drop this into the milkwise repo as (or merged into) src/config/theme.ts.
 */

export const palette = {
  light: {
    bg: '#F7F3EA',
    bgPanel: '#EFE9DA',
    bgCard: '#FCF8EE',
    bgInverse: '#25241F',

    text: '#2A2823',
    textMuted: '#6E6A60',
    textFaint: '#9B9789',
    textInverse: '#F7F3EA',

    accent: '#6B9682',
    accentHover: '#547A68',     // -> use as the "pressed" state on native
    accentSoft: '#D6E3DA',      // best-value highlight
    accentTint: '#E8EFE9',      // row hover -> row pressed/selected

    cream: '#E8D4BC',
    creamSoft: '#F2E4CE',
    creamTint: '#FAF1DF',

    butter: '#F0DC9A',
    butterSoft: '#F8ECC4',

    clay: '#D4A893',
    claySoft: '#EBD4C5',

    info: '#7DA1B2',
    infoSoft: '#D8E3E8',

    danger: '#B07A78',
    dangerSoft: '#EAD4D2',

    warnBg: '#F8ECC4',
    warnText: '#7A5A1F',

    success: '#6B9682',

    border: '#DCD3BD',
    borderStrong: '#C0B79F',
    divider: '#E5DDC8',

    navBg: 'rgba(247,243,234,0.82)',
  },
  dark: {
    bg: '#1A1916',
    bgPanel: '#232220',
    bgCard: '#2A2925',
    bgInverse: '#F7F3EA',

    text: '#F0EBDD',
    textMuted: '#B5AF9F',
    textFaint: '#837E70',
    textInverse: '#1A1916',

    accent: '#9CC4AB',
    accentHover: '#B8D6C3',
    accentSoft: '#2F4A3B',
    accentTint: '#2A332E',

    cream: '#6B5A40',
    creamSoft: '#4A4030',
    creamTint: '#332D22',

    butter: '#C9B26B',
    butterSoft: '#443D24',

    clay: '#B08770',
    claySoft: '#4A3A30',

    info: '#A8C4D2',
    infoSoft: '#2A3640',

    danger: '#C99693',
    dangerSoft: '#4A332F',

    warnBg: '#443D24',
    warnText: '#E8D38C',

    success: '#9CC4AB',

    border: '#3A3833',
    borderStrong: '#524F47',
    divider: '#2F2D29',

    navBg: 'rgba(26,25,22,0.78)',
  },
} as const;

/** 4px base spacing scale (key === step number in the CSS). */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96, 30: 120,
} as const;

export const radius = {
  input: 8,
  card: 12,
  cardLg: 18,
  pill: 999,
  circle: 9999,
} as const;

/** Font family keys — register these exact names with expo-font / useFonts. */
export const fonts = {
  // Display / UI headings: Inter Tight 600 / 700
  display: 'InterTight',
  // Body / UI: Inter 400 / 500 / 600
  body: 'Inter',
  // Numerals & data (tabular): JetBrains Mono 400 / 500
  mono: 'JetBrainsMono',
} as const;

export const fontSize = {
  displayXl: 72, displayL: 56, displayM: 40,
  h1: 36, h2: 28, h3: 22, h4: 18,
  body: 16, bodyS: 14, caption: 13, micro: 11,
  dataXl: 56, dataL: 36, dataM: 22, dataS: 15,
} as const;

export const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: 1.08, snug: 1.2, normal: 1.5, relaxed: 1.7,
} as const;

/**
 * Tracking is expressed in `em` in CSS. React Native `letterSpacing` is in px,
 * so compute per use site: letterSpacing = trackingEm * fontSize.
 */
export const trackingEm = {
  tight: -0.022, // display headlines
  snug: -0.012,
  normal: 0,
  caps: 0.08, // small-caps eyebrow (also textTransform: 'uppercase')
} as const;
export const tracking = (em: number, size: number) => em * size;

export const motion = {
  // cubic-bezier(0.2, 0.6, 0.2, 1) — feed to Reanimated Easing.bezier(...)
  easeBezier: [0.2, 0.6, 0.2, 1] as const,
  durFast: 150,
  durBase: 200,
  durSlow: 320,
};

export const layout = {
  maxContent: 1200, // web/PWA only; native screens are full-width
  maxProse: 680,
  navH: 64,
  bannerH: 36,
} as const;

/**
 * CSS box-shadows -> RN. iOS uses shadow*; Android uses elevation.
 * NativeWind/RN-web map fine; on native pass these style objects directly.
 */
export const shadow = {
  light: {
    s1: { shadowColor: '#2A2823', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    s2: { shadowColor: '#2A2823', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 4 },
    s3: { shadowColor: '#2A2823', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.09, shadowRadius: 48, elevation: 12 },
  },
  dark: {
    s1: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.40, shadowRadius: 3, elevation: 1 },
    s2: { shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.50, shadowRadius: 20, elevation: 4 },
    s3: { shadowColor: '#000000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.60, shadowRadius: 48, elevation: 12 },
  },
  // 3px focus halo: render as a same-radius outer View, accent @ ~0.20 opacity.
  focusHaloOpacity: 0.2,
} as const;

/**
 * Hero mesh — the single biggest fidelity compromise on native.
 * CSS uses 6 stacked gradients + per-layer blend modes + a vignette, which RN
 * cannot reproduce. Recommended order of fidelity:
 *   1. Pre-render the prototype's mesh (light + dark) to a 2x PNG, ship as an
 *      asset, lay content on top. (Faithful — it's the design's own mesh.)
 *   2. react-native-svg radial gradients (close, no blend modes).
 *   3. expo-linear-gradient (loses the organic blobs — last resort).
 * Anchor colors below are lifted from --mw-mesh for the SVG/PNG route.
 */
export const heroMesh = {
  light: {
    base: ['#F2E4CE', '#F7F3EA', '#EBD4C5'], // 160deg linear stops
    blobs: ['rgba(217,168,116,0.55)', 'rgba(212,168,147,0.70)', 'rgba(196,142,130,0.55)', 'rgba(240,220,154,0.55)', 'rgba(165,110,90,0.45)'],
    vignette: 'rgba(110,70,50,0.18)',
  },
  dark: {
    base: ['#2A2520', '#1A1916', '#2F221C'],
    blobs: ['rgba(140,90,70,0.42)', 'rgba(120,80,70,0.55)', 'rgba(100,60,50,0.45)', 'rgba(160,130,70,0.30)', 'rgba(80,50,40,0.55)'],
    vignette: 'rgba(0,0,0,0.45)',
  },
} as const;

export type Scheme = keyof typeof palette;
export const theme = (s: Scheme) => ({
  colors: palette[s],
  shadow: shadow[s],
  heroMesh: heroMesh[s],
  space, radius, fonts, fontSize, weight, lineHeight, trackingEm, motion, layout,
});
