# Visual reference images

Pixel references for the RN port. Captured from the actual prototype
(`ui_kits/website/`) via headless Chrome at `deviceScaleFactor: 2`, with
React/Babel/Lucide and the Inter / Inter Tight / JetBrains Mono fonts vendored
locally so the renders are faithful (no system-font substitution).

## `screens/` — full-page captures

`{page}-{theme}-{width}.png` — fullPage (entire scroll height).

- pages: `home`, `compare`, `calculator`, `nutrition`, `parents`, `about`
- themes: `light`, `dark`
- widths: `desktop` (1280px), `mobile` (390px)
- plus `headtohead-{theme}-desktop.png`

These are the acceptance target: each ported RN screen should match its
counterpart in layout, spacing, type, color, and dark-mode behaviour. Mobile
captures show the responsive rules (collapsed nav, stacked inputs/cards,
full-width CTAs) you must reproduce on native.

Caveat: `headtohead-*` shows the **single-product detail** state of the
HeadToHead view (price block, formula details, ingredient highlights,
nutrition disclaimer). The 2–3-product side-by-side and the compare
tray/grid/table interactions are best seen by running the prototype live
(`python3 -m http.server` → `ui_kits/website/index.html`); the static shots
can't cover every interactive state.

## `hero-mesh/` — clean background plates

`hero-mesh-{theme}-{w}x{h}.png` — the hero gradient mesh with **nothing on
top**, rendered from the exact `--mw-mesh` / `--mw-mesh-vignette` tokens +
grain overlay (the same CSS as `.mw-hero-mesh`).

This is the recommended drop-in solution for the hero background on native
(RN can't reproduce the 6-layer blended CSS gradient — see INTEGRATION.md §6).
Ship the light + dark plate as an `Image`/background and lay hero content over
it. Three sizes are provided; pick by target aspect ratio, or regenerate any
size from `ui_kits/website/_mesh.html?theme=light|dark` (a dependency-free
generator kept in the repo for exactly this).

## Regenerating

`ui_kits/website/_mesh.html` is committed and standalone. The full screen
capture used vendored libs/fonts (gitignored, not committed) because this
environment blocks the CDNs the prototype normally uses; rebuild that vendor
set from npm if you need to re-capture screens.
