// Head-to-head comparison overlay — up to 3 products side-by-side.

const { useState, useEffect } = React;

function pickKey(productNutr, candidates) {
  if (!productNutr) return null;
  for (const c of candidates) if (productNutr[c]) return c;
  return null;
}

function HeadToHead({ products, onClose, onCalc }) {
  const [nutrition, setNutrition] = useState({});
  useEffect(() => {
    fetch('../../data/nutrition.json').then(r => r.json()).then(setNutrition).catch(() => {});
  }, []);

  if (!products || products.length === 0) return null;

  const bestIdx = (vals, low = true) => {
    if (vals.length < 2) return -1;
    const numeric = vals.map(v => typeof v === 'number' ? v : NaN);
    if (numeric.every(isNaN)) return -1;
    const sorted = [...numeric].map((v, i) => [v, i]).filter(([v]) => !isNaN(v));
    sorted.sort((a, b) => low ? a[0] - b[0] : b[0] - a[0]);
    return sorted[0][1];
  };

  const rows = [
    { section: 'Price data', accent: true, items: [
      ['Retail price', products.map(p => p.price), v => fmtSGD(v), true],
      ['Tin size', products.map(p => p.packSize + 'g'), v => v, null],
      ['$ / gram', products.map(p => p.pricePerGram), v => fmtPerGram(v), true],
      ['$ / scoop', products.map(p => p.pricePerScoop), v => fmtSGD(v), true],
      ['Scoops / tin', products.map(p => p.scoopsPerTin), v => '~' + Math.round(v), false],
      ['Malaysia (est. MYR)', products.map(p => Math.round(p.price * 3.05)), v => 'RM ' + v, null],
      ['Est. SG savings / tin', products.map(p => p.price * 0.28), v => fmtSGD(v) + ' / tin', false],
    ]},
    { section: 'Formula details', items: [
      ['Stage', products.map(p => p.stage), v => v, null],
      ['Milk source', products.map(p => milkSourceOf(p)), v => v, null],
      ['Manufactured in', products.map(p => p.manufacturedIn || '—'), v => v, null],
      ['Halal certified', products.map(p => p.halal), v => v, null],
      ['Organic', products.map(p => p.organic || 'No'), v => v, null],
    ]},
    { section: 'Ingredient highlights', items: [
      ['HMO / 2\u2032-FL', products.map(p => p.hmo && p.hmo !== 'No' ? '✓' : '—'), v => v, null],
      ['Probiotic strain', products.map(p => (p.probiotic && p.probiotic !== 'No') ? p.probiotic.slice(0, 22) : '—'), v => v, null],
      ['Palm oil', products.map(p => (p.palmOil && p.palmOil.toLowerCase().startsWith('yes')) ? '✓' : '—'), v => v, null],
      ['Partially hydrolysed (pHF)', products.map(p => (p.partiallyHydrolyzed && p.partiallyHydrolyzed.toLowerCase().startsWith('yes')) ? '✓' : '—'), v => v, null],
      ['Lactose-free', products.map(p => (p.lactoseFree && p.lactoseFree.toLowerCase().startsWith('yes')) ? '✓' : '—'), v => v, null],
      ['Main sugar', products.map(p => p.mainSugar || '—'), v => v, null],
    ]},
  ];

  // Lookup nutrition by product or short-name
  const productNutrLookups = products.map(p => {
    return nutrition[p.product]
      || nutrition[shortName(p.product)]
      || null;
  });
  const hasNutrition = productNutrLookups.some(n => n);

  const readNutrient = (productNutr, candidates) => {
    if (!productNutr) return null;
    const key = pickKey(productNutr, candidates);
    return key ? productNutr[key] : null;
  };
  const nutrientRow = (label, candidates) => {
    const cells = productNutrLookups.map(n => readNutrient(n, candidates));
    if (cells.every(c => !c)) return null;
    const unit = cells.find(c => c)?.unit || '';
    return {
      label,
      values: cells.map(c => c ? c.per100ml : NaN),
      fmt: v => isNaN(v) ? '—' : v + ' ' + unit,
    };
  };

  const nutritionRows = [
    nutrientRow('Energy', ['Energy']),
    nutrientRow('Protein', ['Protein']),
    nutrientRow('Fat', ['Fat', 'Total Fat']),
    nutrientRow('Carbohydrate', ['Carbohydrate', 'Total carbohydrate', 'Total Carbohydrates']),
    nutrientRow('DHA', ['DHA (Docosahexaenoic Acid)', 'DHA', 'Docosahexaenoic Acid (DHA)', 'Docosahexaenoic acid (DHA)']),
    nutrientRow('ARA', ['ARA (Arachidonic Acid)', 'Arachidonic Acid (ARA)', 'ARA']),
    nutrientRow('Calcium', ['Calcium']),
    nutrientRow('Iron', ['Iron']),
    nutrientRow('Vitamin D', ['Vitamin D3', 'Vitamin D', 'Vitamin D (Vitamin D3)']),
    nutrientRow('Vitamin C', ['Vitamin C']),
    nutrientRow('Choline', ['Choline', 'Choline chloride']),
    nutrientRow('Taurine', ['Taurine']),
  ].filter(Boolean);

  return (
    <div className="mw-compare-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="mw-eyebrow">Head-to-head</div>
          <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.022em', margin: '0 0 8px', color: 'var(--mw-text)' }}>
            {products.length === 1 ? 'Product detail' : `${products.length}-way comparison`}
          </h1>
          <p style={{ color: 'var(--mw-text-muted)', fontSize: 14, margin: 0 }}>
            {products.length > 1 ? 'Best value in each row highlighted.' : 'Full technical spec — nutrition values are per 100ml of prepared formula.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ghost" size="md" onClick={onClose} icon={<Icon name="arrow-left" size={14} />}>Back to results</Button>
          <Button variant="outline" size="md" icon={<Icon name="download" size={14} />}>Download PDF</Button>
          <Button variant="solid" size="md" onClick={onCalc} iconTrailing={<Icon name="arrow-right" size={14} />}>Open Calculator</Button>
        </div>
      </div>

      <div className="mw-compare-head" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mw-text-muted)' }}>
            Comparing
          </div>
        </div>
        {products.map(p => {
          const img = imageFor(p.brand, p.product);
          return (
            <div key={p.product}>
              {img && <div style={{ width: 64, height: 64, background: 'var(--mw-bg)', borderRadius: 6, padding: 4, marginBottom: 10 }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>}
              <div className="mw-compare-prod-name">{shortName(p.product)}</div>
              <div className="mw-compare-prod-brand">{p.brand} · {p.stage} · {p.packSize}g</div>
            </div>
          );
        })}
      </div>

      <table className="mw-compare-table" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0 }}>
        <tbody>
          {rows.flatMap((g, gi) => [
            <tr key={`sec-${gi}`} className={`section-header ${g.accent ? 'accent' : ''}`}>
              <td colSpan={products.length + 1}>{g.section}</td>
            </tr>,
            ...g.items.map(([label, vals, fmt, lowBetter]) => {
              const best = (lowBetter === null || products.length < 2) ? -1 : bestIdx(vals, lowBetter);
              return (
                <tr key={label}>
                  <td className="row-label">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={`num ${i === best ? 'best' : ''}`}>{fmt(v)}</td>
                  ))}
                </tr>
              );
            })
          ])}

          {hasNutrition && nutritionRows.length > 0 && (
            <>
              <tr className="section-header">
                <td colSpan={products.length + 1}>
                  Nutritional values · per 100ml prepared&nbsp;&nbsp;
                  <span style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 400, opacity: 0.7, fontSize: 11 }}>
                    Source · product packaging
                  </span>
                </td>
              </tr>
              {nutritionRows.map(r => (
                <tr key={r.label}>
                  <td className="row-label">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="num">{r.fmt(v)}</td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {products.length === 1 && productNutrLookups[0] && (
        <div className="mw-disclaim" style={{ background: 'var(--mw-info-soft)', color: 'var(--mw-info)', marginTop: 24 }}>
          <b>Full nutrient inventory for {shortName(products[0].product)} is on file.</b>
          {' '}<a style={{ borderBottom: '1px solid currentColor', cursor: 'pointer' }} onClick={() => alert('Full table view — to be wired up')}>See full {Object.keys(productNutrLookups[0]).length}-nutrient breakdown →</a>
        </div>
      )}

      <div className="mw-disclaim" style={{ marginTop: 16 }}>
        <b>Nutritional values</b> are based on prepared formula at standard dilution as stated on packaging.
        Values may differ by batch. {!hasNutrition && 'Nutrition data is not available for the selected product(s).'}
        This comparison is for informational purposes only and is not medical advice.
      </div>
    </div>
  );
}

Object.assign(window, { HeadToHead });
