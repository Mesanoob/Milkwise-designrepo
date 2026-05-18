# Data mapping — design dataset → app catalogue

**Decision:** the milkwise app's hand-curated `products.json` (61) +
`productDetails.json` stay the source of truth. The design's
`data/formulas.json` (76) + `data/nutrition.json` are **reference only** — they
exist so you can see what fields each design component reads and what shape it
expects. Wire the ported components to *your* schema via a thin adapter; do not
import the design JSON.

## What the design components consume

`data/formulas.json` records (used by Compare, the cards/list/table, the
calculator product picker, and head-to-head):

| Design field | Type / example | Used for |
|---|---|---|
| `stage` | `"Stage 1"` | stage badge, stage filter |
| `brand` | `"Abbott Grow"` | brand line, brand filter, product image lookup |
| `product` | full product name | card/list/table title (`shortName()` trims it) |
| `origin` | `"USA (Abbott Laboratories, Illinois)"` | detail row |
| `manufacturedIn` | `"Singapore"` | detail row |
| `packSize` | grams, number `900` | tin-size metric + filter |
| `price` | SGD number `18.64` | price (mono, `fmtSGD`) |
| `pricePerGram` | number `0.0207…` | `$/g` metric (mono, `fmtPerGram`, 3dp) |
| `scoopSize` | grams `8.34` | calculator auto-fill |
| `waterPerScoop` | ml `60` | calculator ratio |
| `scoopsPerTin` | number `107.9` | `scoops/tin` metric |
| `pricePerScoop` | number `0.1728` | `$/scoop` metric |
| `milkOrigin` | string | detail row |
| `soyBased` | string | milk-source derivation |
| `halal` | `"Yes"`/`"No"` | tag pill |
| `lactoseFree` | `"Yes"`/`"No"` | diet filter / tag |
| `ar` | `"Yes"`/`"No"` | diet filter (anti-reflux) |
| `ha` | string | diet filter (split into pHF/eHF — see below) |
| `organic` | `"Yes"`/`"No"` | tag pill |
| `probiotic` | `"Yes"`/`"No"` | tag pill |
| `hmo` | `"Yes"`/`"No"` | tag pill |
| `partiallyHydrolyzed` | `"Yes"`/`"No"` | pHF derivation |
| `palmOil` | `"Yes"`/`"No"` | tag pill |
| `wheyCasein` | string | detail row |
| `mainSugar` | `"Lactose"` | detail row |
| `allergens` | string | detail row |
| `fillers` | string | detail row |

Derived helpers live in `ui_kits/website/Compare.jsx`: `milkSourceOf`,
`dietOf`, `tagsFor`, `imageFor`, `shortName`. Re-implement these as pure TS
functions against your model — they encode the brand's filtering/labelling
logic and are worth preserving exactly.

`data/nutrition.json` is keyed by product name → `{ Nutrient: { unit,
per100g, per100ml } }`. Head-to-head and the product detail nutrition table
read `per100ml` for Energy, Protein, Fat, Carbs, DHA, ARA, Calcium, Iron,
Vitamin D/C, Choline, Taurine.

## Adapter to write in milkwise

Create one mapping function so the design components stay schema-agnostic:

```ts
// maps YOUR products.json row -> the shape the ported components expect
function toFormulaModel(p: AppProduct): FormulaModel { … }
function toNutritionModel(d: AppProductDetails): NutritionModel { … }
```

Fill the table below against your real `products.json` / `productDetails.json`
(I don't have access to the milkwise repo, so these are the fields to confirm):

| design field | your products.json field | notes |
|---|---|---|
| `product` | `?` | |
| `brand` | `?` | drives product-image lookup |
| `price` | `?` | |
| `packSize` | `?` | grams |
| `pricePerGram` | `?` or derive `price / packSize` | derive if absent |
| `pricePerScoop` | `?` or derive | `price / scoopsPerTin` |
| `scoopsPerTin` | `?` or derive | `packSize / scoopSize` |
| `scoopSize`, `waterPerScoop` | `?` | calculator inputs |
| stage / source / diet flags | `?` | map to badge + filters |
| nutrition per-100ml | `productDetails.json` `?` | head-to-head table |

If a derived figure is missing in your data, compute it (the formulas above)
rather than dropping the metric — the per-gram / per-scoop columns are the
product's core value proposition.

**Catalogue size:** 61 (yours) vs 76 (design) is expected and fine — your
curated set wins. Product photos in `../assets/products/` cover 17 brands;
anything unmatched should fall back to a neutral placeholder, never a broken
image.
