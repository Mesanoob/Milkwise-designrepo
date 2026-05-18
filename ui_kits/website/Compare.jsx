// Compare — top filter strip, image-list view, search, asc/desc sort.

const { useState, useMemo, useEffect, useRef } = React;

// ── Product → image mapping ─────────────────────────────────
const PRODUCT_IMG = {
  'Wyeth S26': 'wyeth-s26-gold-pro-stage1.jpg',
  'Bellamys Organic': 'bellamys-organic-infant-stage1.jpg',
  'HiPP': 'hipp-combiotic-organic-stage2.jpg',
  'Karihome': 'karihome-goat-milk-stage1.jpg',
  'Nature One Dairy': 'natureone-organic-stage1.jpg',
  'Enfamil': 'enfamil-pro-aplus-stage1.jpg',
  'Frisolac': 'frisolac-gold-stage1.jpg',
  'Frisolac Friso': 'frisolac-gold-stage1.jpg',
  'Aptamil': 'aptamil-gold-plus-syneo-stage1.jpg',
  'Dumex': 'dumex-dulac-stage1.jpg',
  'FairPrice Gold': 'fairprice-gold-stage1.jpg',
  'Nestle NAN': 'nestle-nan-optipro-stage1.jpg',
  'Nestle Lactogen': 'nestle-nan-optipro-stage1.jpg',
  'Abbott Grow': 'abbott-grow-stage1.jpg',
  'Abbott Isomil': 'similac-isomil-stage1.jpg',
  'Abbott Similac': 'similac-infantformula-stage1.jpg',
  'Nutramigen': 'similac-total-comfort-ha-stage1.jpg',
};
function imageFor(brand, product) {
  for (const key of Object.keys(PRODUCT_IMG)) {
    if (brand && brand.toLowerCase().startsWith(key.toLowerCase())) return `../../assets/products/${PRODUCT_IMG[key]}`;
  }
  return null;
}

// ── Classifiers ─────────────────────────────────────────────
function milkSourceOf(p) {
  if (p.soyBased && p.soyBased.toLowerCase().startsWith('yes')) return 'Soy';
  if ((p.brand || '').toLowerCase().includes('karihome') || (p.product || '').toLowerCase().includes('goat')) return 'Goat';
  if (p.partiallyHydrolyzed && p.partiallyHydrolyzed.toLowerCase().startsWith('yes')) return 'pHF';
  if ((p.product || '').toLowerCase().match(/nutramigen|amino acid|extensively/)) return 'eHF';
  return 'Cow';
}
function dietOf(p) {
  const flags = [];
  if (p.lactoseFree && p.lactoseFree.toLowerCase().startsWith('yes')) flags.push('lactose-free');
  if (p.ar && p.ar.toLowerCase().startsWith('yes')) flags.push('ar');
  if (p.ha && p.ha.toLowerCase().startsWith('yes')) flags.push('ha');
  if ((p.product || '').toLowerCase().match(/nutramigen|extensively/)) flags.push('ehf');
  if (p.partiallyHydrolyzed && p.partiallyHydrolyzed.toLowerCase().startsWith('yes')) flags.push('phf');
  if (!flags.length) flags.push('regular');
  return flags;
}
function tagsFor(p) {
  const t = [];
  t.push(milkSourceOf(p));
  if (p.organic && p.organic.toLowerCase().startsWith('yes')) t.push('Organic');
  if (p.hmo && p.hmo !== 'No' && p.hmo.length > 2) t.push('HMO');
  if (p.probiotic && p.probiotic !== 'No' && p.probiotic.length > 2) t.push('Probiotic');
  if (p.halal && p.halal.toLowerCase().startsWith('yes')) t.push('Halal');
  if (!p.palmOil || p.palmOil.toLowerCase().startsWith('no')) t.push('No Palm');
  return t.slice(0, 4);
}
function shortName(name) {
  return (name || '').replace(/(- Step \d+| - Stage \d+|Infant Milk Formula|Infant Formula|Milk Powder Formula)/gi, '').trim();
}

// ── Grid product card ───────────────────────────────────────
function ProductCard({ p, inTray, onCompare, onView }) {
  const img = imageFor(p.brand, p.product);
  const tags = tagsFor(p);
  return (
    <div className="mw-product-card">
      <div className="mw-pc-top">
        <span className="mw-pc-brand">{p.brand}</span>
        <StageBadge stage={p.stage} />
      </div>
      <div className="mw-pc-img" onClick={() => onView(p)} style={{ cursor: 'pointer' }}>
        {img ? <img src={img} alt={p.product} loading="lazy" /> : <div style={{ color: 'var(--mw-text-faint)', fontSize: 11 }}>No image</div>}
      </div>
      <div className="mw-pc-name" onClick={() => onView(p)} style={{ cursor: 'pointer' }}>{shortName(p.product)}</div>
      <div className="mw-pc-metrics">
        <div className="mw-pc-metric"><span className="l">$/gram</span><span className="v">{fmtPerGram(p.pricePerGram)}</span></div>
        <div className="mw-pc-metric"><span className="l">$/scoop</span><span className="v">{fmtSGD(p.pricePerScoop)}</span></div>
        <div className="mw-pc-metric"><span className="l">Tin size</span><span className="v">{p.packSize}g</span></div>
      </div>
      <div className="mw-pc-meta">
        <span><b>{fmtSGD(p.price)}</b> per tin</span>
        <span>·</span>
        <span>~{Math.round(p.scoopsPerTin)} scoops</span>
      </div>
      <div className="mw-pc-tags">
        {tags.map(t => <Tag key={t} on>{t}</Tag>)}
      </div>
      <div className="mw-pc-foot">
        <Button variant="ghost" size="sm" onClick={() => onView(p)}>View details →</Button>
        <Button variant={inTray ? 'outline' : 'solid'} size="sm" onClick={() => onCompare(p)}>
          {inTray ? '✓ Added' : '+ Compare'}
        </Button>
      </div>
    </div>
  );
}

// ── Image-rich list row (between grid and dense table) ──────
function ProductListRow({ p, inTray, onCompare, onView }) {
  const img = imageFor(p.brand, p.product);
  const tags = tagsFor(p);
  return (
    <div className="mw-list-row">
      <div className="mw-list-thumb" onClick={() => onView(p)}>
        {img ? <img src={img} alt={p.product} loading="lazy" /> : null}
      </div>
      <div className="mw-list-head">
        <div className="mw-list-brand">{p.brand}</div>
        <div className="mw-list-name" onClick={() => onView(p)}>{shortName(p.product)}</div>
        <div className="mw-list-tags">
          <StageBadge stage={p.stage} />
          {tags.slice(0, 4).map(t => <Tag key={t} on>{t}</Tag>)}
        </div>
      </div>
      <div className="mw-list-metric">
        <div className="l">Tin</div>
        <div className="v">{p.packSize}g</div>
      </div>
      <div className="mw-list-metric">
        <div className="l">$/gram</div>
        <div className="v">{fmtPerGram(p.pricePerGram)}</div>
      </div>
      <div className="mw-list-metric">
        <div className="l">$/scoop</div>
        <div className="v">{fmtSGD(p.pricePerScoop)}</div>
      </div>
      <div className="mw-list-metric">
        <div className="l">Price</div>
        <div className="v strong">{fmtSGD(p.price)}</div>
      </div>
      <div className="mw-list-actions">
        <Button variant="ghost" size="sm" onClick={() => onView(p)}>Details</Button>
        <Button variant={inTray ? 'outline' : 'solid'} size="sm" onClick={() => onCompare(p)}>
          {inTray ? '✓' : '+ Compare'}
        </Button>
      </div>
    </div>
  );
}

// ── Top filter strip (replaces the sidebar) ─────────────────
function FilterStrip({ filters, setFilters, query, setQuery, brands, suggestions, onPickSuggestion }) {
  const [showSug, setShowSug] = useState(false);
  const toggle = (k, v) => setFilters(f => {
    const cur = new Set(f[k]);
    cur.has(v) ? cur.delete(v) : cur.add(v);
    return { ...f, [k]: [...cur] };
  });
  const sortFlip = () => setFilters(f => ({ ...f, sortDir: f.sortDir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="mw-filter-strip">
      <div className="mw-fs-row mw-fs-search">
        <div className="mw-search">
          <Icon name="search" size={16} stroke={1.6} />
          <input
            type="search"
            placeholder="Search by brand or product name…"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSug(true); }}
            onFocus={() => setShowSug(true)}
            onBlur={() => setTimeout(() => setShowSug(false), 150)}
            aria-label="Search formulas"
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowSug(false); }} aria-label="Clear" className="mw-search-clear">×</button>
          )}
          {showSug && suggestions.length > 0 && (
            <div className="mw-suggest">
              {suggestions.slice(0, 8).map(s => (
                <button
                  key={s.product}
                  onMouseDown={e => { e.preventDefault(); onPickSuggestion(s); }}
                  className="mw-suggest-item"
                >
                  <span className="brand">{s.brand}</span>
                  <span className="prod">{shortName(s.product)}</span>
                  <span className="badge">{s.stage}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mw-fs-sort">
          <span className="mw-fs-label">Sort</span>
          <select
            className="mw-select"
            value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
            style={{ width: 'auto', minWidth: 160 }}
          >
            <option value="ppg">Price per gram</option>
            <option value="pps">Price per scoop</option>
            <option value="price">Tin price</option>
            <option value="size">Tin size</option>
            <option value="scoops">Scoops per tin</option>
            <option value="brand">Brand</option>
          </select>
          <button
            type="button"
            className="mw-sort-dir"
            onClick={sortFlip}
            aria-label={`Sort ${filters.sortDir === 'asc' ? 'ascending' : 'descending'}`}
            title={filters.sortDir === 'asc' ? 'Ascending — switch to descending' : 'Descending — switch to ascending'}
          >
            <Icon name={filters.sortDir === 'asc' ? 'arrow-up-narrow-wide' : 'arrow-down-wide-narrow'} size={16} />
          </button>
        </div>
      </div>

      <div className="mw-fs-row">
        <div className="mw-fs-group">
          <span className="mw-fs-label">Stage</span>
          <div className="mw-filter-pills">
            {['Stage 1','Stage 2','Stage 3'].map(s => (
              <Pill key={s} active={filters.stage.includes(s)} onClick={() => toggle('stage', s)}>{s}</Pill>
            ))}
          </div>
        </div>
        <div className="mw-fs-group">
          <span className="mw-fs-label">Milk source</span>
          <div className="mw-filter-pills">
            {[['Cow','Cow'],['Goat','Goat'],['Soy','Soy'],['pHF','pHF · partial'],['eHF','eHF · extensive']].map(([k,l]) => (
              <Pill key={k} active={filters.source.includes(k)} onClick={() => toggle('source', k)}>{l}</Pill>
            ))}
          </div>
        </div>
        <div className="mw-fs-group">
          <span className="mw-fs-label">Special</span>
          <div className="mw-filter-pills">
            {[['lactose-free','Lactose-free'],['ar','AR'],['ha','HA'],['regular','Regular']].map(([k,l]) => (
              <Pill key={k} active={filters.diet.includes(k)} onClick={() => toggle('diet', k)}>{l}</Pill>
            ))}
          </div>
        </div>
        <div className="mw-fs-group">
          <span className="mw-fs-label">Tin size</span>
          <div className="mw-filter-pills">
            {[400, 800, 850, 900, 1800].map(s => (
              <Pill key={s} active={filters.size.includes(s)} onClick={() => toggle('size', s)}>{s}g</Pill>
            ))}
          </div>
        </div>
        {(filters.stage.length + filters.source.length + filters.diet.length + filters.size.length > 0) && (
          <button
            className="mw-btn mw-btn-ghost mw-btn-sm"
            onClick={() => setFilters({ stage: [], source: [], diet: [], size: [], sort: filters.sort, sortDir: filters.sortDir })}
            style={{ color: 'var(--mw-accent)', alignSelf: 'flex-end', paddingBottom: 8 }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

// ── Compare tray (kept) ─────────────────────────────────────
function CompareTray({ items, onRemove, onOpen, onClear }) {
  if (items.length === 0) return null;
  return (
    <div className="mw-tray">
      <div className="mw-tray-inner">
        <span className="mw-tray-label">Compare ({items.length}/3)</span>
        <div className="mw-tray-items">
          {items.map(p => {
            const img = imageFor(p.brand, p.product);
            return (
              <div className="mw-tray-chip" key={p.product}>
                <span className="thumb">{img && <img src={img} alt="" />}</span>
                <span>{p.brand}</span>
                <button className="x" onClick={() => onRemove(p)} aria-label="Remove">×</button>
              </div>
            );
          })}
          {items.length < 3 && <div className="mw-tray-add">+ Add</div>}
        </div>
        <Button variant="ghost" size="sm" style={{ color: 'var(--mw-text-faint)' }} onClick={onClear}>Clear</Button>
        <Button variant="solid" size="md" onClick={onOpen} iconTrailing={<Icon name="arrow-right" size={14} />}>
          Compare Now
        </Button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────
function Compare({ formulas, tray, setTray, onOpenCompare }) {
  const [filters, setFilters] = useState({
    stage: ['Stage 1'], source: [], diet: [], size: [],
    sort: 'ppg', sortDir: 'asc',
  });
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');

  const matchesQuery = (p, q) => {
    if (!q) return true;
    const hay = (p.brand + ' ' + p.product).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(t => hay.includes(t));
  };

  const filtered = useMemo(() => {
    let f = formulas.slice();
    if (query) f = f.filter(p => matchesQuery(p, query));
    if (filters.stage.length) f = f.filter(p => filters.stage.includes(p.stage));
    if (filters.source.length) f = f.filter(p => filters.source.includes(milkSourceOf(p)));
    if (filters.diet.length) f = f.filter(p => {
      const dp = dietOf(p);
      return filters.diet.some(d => dp.includes(d));
    });
    if (filters.size.length) f = f.filter(p => filters.size.some(s => Math.abs(p.packSize - s) < 30));
    const cmp = {
      'ppg':    (a, b) => a.pricePerGram - b.pricePerGram,
      'pps':    (a, b) => a.pricePerScoop - b.pricePerScoop,
      'price':  (a, b) => a.price - b.price,
      'size':   (a, b) => a.packSize - b.packSize,
      'scoops': (a, b) => a.scoopsPerTin - b.scoopsPerTin,
      'brand':  (a, b) => a.brand.localeCompare(b.brand),
    };
    f.sort(cmp[filters.sort]);
    if (filters.sortDir === 'desc') f.reverse();
    return f;
  }, [formulas, filters, query]);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query || query.length < 1) return [];
    return formulas.filter(p => matchesQuery(p, query)).slice(0, 12);
  }, [formulas, query]);

  const inTray = new Set(tray.map(p => p.product));
  const toggleCompare = (p) => {
    if (inTray.has(p.product)) setTray(tray.filter(x => x.product !== p.product));
    else if (tray.length < 3) setTray([...tray, p]);
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--mw-max-content)', margin: '0 auto', padding: '32px 32px 16px' }}>
        <div className="mw-eyebrow">Compare</div>
        <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 600, letterSpacing: '-0.022em', margin: '0 0 8px', color: 'var(--mw-text)' }}>
          {formulas.length || 76} Singapore-stocked formulas
        </h1>
        <p style={{ color: 'var(--mw-text-muted)', fontSize: 15, maxWidth: '60ch', margin: 0 }}>
          Filter, sort, and compare ingredients and price-per-gram. Add up to three to the tray to see side-by-side.
        </p>
      </div>

      <div style={{ maxWidth: 'var(--mw-max-content)', margin: '0 auto', padding: '0 32px' }}>
        <FilterStrip
          filters={filters}
          setFilters={setFilters}
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          onPickSuggestion={(p) => { setQuery(''); onOpenCompare([p]); }}
        />

        <div className="mw-method-note" style={{ marginTop: 18, marginBottom: 12 }}>
          <Icon name="info" size={16} stroke={1.6} />
          <span>
            <b>Prices are sourced from major Singapore retailers</b> (FairPrice, Guardian, Watsons, Lazada, Shopee).
            Indicative only. Last updated 14 May 2026.
          </span>
        </div>

        <div className="mw-results-header">
          <div className="mw-results-count">
            Showing <b>{filtered.length}</b> of {formulas.length} formulas
          </div>
          <div className="mw-view-toggle">
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
              <Icon name="rows-3" size={14} /> List
            </button>
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>
              <Icon name="layout-grid" size={14} /> Grid
            </button>
            <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')}>
              <Icon name="table-2" size={14} /> Table
            </button>
          </div>
        </div>

        {view === 'grid' && (
          <div className="mw-grid">
            {filtered.map(p => (
              <ProductCard key={p.product} p={p} inTray={inTray.has(p.product)} onCompare={toggleCompare} onView={() => onOpenCompare([p])} />
            ))}
          </div>
        )}

        {view === 'list' && (
          <div className="mw-list">
            {filtered.map(p => (
              <ProductListRow key={p.product} p={p} inTray={inTray.has(p.product)} onCompare={toggleCompare} onView={() => onOpenCompare([p])} />
            ))}
          </div>
        )}

        {view === 'table' && (
          <div style={{ overflowX: 'auto', background: 'var(--mw-bg-card)', border: '1px solid var(--mw-border)', borderRadius: 8 }}>
            <table style={{ width: '100%', minWidth: 920, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--mw-bg-panel)' }}>
                  {['', 'Brand','Product','Stage','Source','Tin size','Price','$/g','$/scoop','Scoops'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: ['Brand','Product'].includes(h) ? 'left' : (h === '' ? 'left' : 'right'), fontFamily: 'var(--mw-font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--mw-text-muted)' }}>{h}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const img = imageFor(p.brand, p.product);
                  return (
                    <tr key={p.product} style={{ background: i % 2 === 1 ? 'var(--mw-bg)' : 'transparent', borderTop: '1px solid var(--mw-divider)' }}>
                      <td style={{ padding: '8px 12px', width: 48 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--mw-bg)', borderRadius: 4, padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--mw-font-body)', fontSize: 13, fontWeight: 600, color: 'var(--mw-text)' }}>{p.brand}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--mw-text-muted)', cursor: 'pointer' }} onClick={() => onOpenCompare([p])}>{shortName(p.product).slice(0, 44)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, textAlign: 'right' }}><StageBadge stage={p.stage} /></td>
                      <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right', color: 'var(--mw-text)' }}>{milkSourceOf(p)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: 'var(--mw-font-mono)', textAlign: 'right', color: 'var(--mw-text)' }}>{p.packSize}g</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--mw-font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, textAlign: 'right', color: 'var(--mw-text)', fontWeight: 600 }}>{fmtSGD(p.price)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--mw-font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, textAlign: 'right', color: 'var(--mw-text)' }}>{fmtPerGram(p.pricePerGram)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--mw-font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, textAlign: 'right', color: 'var(--mw-text)' }}>{fmtSGD(p.pricePerScoop)}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--mw-font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 13, textAlign: 'right', color: 'var(--mw-text)' }}>~{Math.round(p.scoopsPerTin)}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                        <button className="mw-btn mw-btn-outline mw-btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => toggleCompare(p)}>
                          {inTray.has(p.product) ? '✓' : '+'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--mw-text-muted)' }}>
            <div style={{ fontFamily: 'var(--mw-font-display)', fontSize: 22, fontWeight: 600, color: 'var(--mw-text)', marginBottom: 8 }}>No formulas match these filters</div>
            <div style={{ fontSize: 14 }}>Try clearing some filters or your search term.</div>
          </div>
        )}
      </div>
    </>
  );
}

Object.assign(window, { Compare, CompareTray, milkSourceOf, dietOf, tagsFor, imageFor, shortName });
