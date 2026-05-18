// Expense Calculator — DOB-driven, product-aware, with benchmark + projection.

const { useState, useMemo, useEffect, useRef } = React;

// ── WHO/HPB feeding guidelines (population averages) ─────────
//  Returns the expected ml/day range for a given age in months.
//  Source: WHO Infant Feeding Guidelines + HPB Singapore.
const GUIDELINES = [
  { maxMo:  1, feeds: [ 8, 12], mlPerFeed: [ 45,  90], dailyMl: [400,  600], stage: 'Stage 1' },
  { maxMo:  3, feeds: [ 6,  8], mlPerFeed: [ 90, 150], dailyMl: [600,  900], stage: 'Stage 1' },
  { maxMo:  6, feeds: [ 5,  6], mlPerFeed: [150, 210], dailyMl: [800, 1000], stage: 'Stage 1' },
  { maxMo:  9, feeds: [ 3,  5], mlPerFeed: [180, 240], dailyMl: [600,  900], stage: 'Stage 2' },
  { maxMo: 12, feeds: [ 3,  4], mlPerFeed: [180, 240], dailyMl: [500,  700], stage: 'Stage 2' },
  { maxMo: 24, feeds: [ 2,  3], mlPerFeed: [200, 240], dailyMl: [350,  500], stage: 'Stage 3' },
  { maxMo: 36, feeds: [ 1,  2], mlPerFeed: [200, 250], dailyMl: [200,  400], stage: 'Stage 3/4' },
  { maxMo: 999,feeds: [ 0,  1], mlPerFeed: [200, 250], dailyMl: [  0,  250], stage: 'Stage 4' },
];

// Recommended solids meals/day from ~6 months (WHO complementary feeding)
const SOLIDS = [
  { maxMo:  6, mealsPerDay: 0, calsFromSolids: 0 },
  { maxMo:  8, mealsPerDay: 2, calsFromSolids: 200 },
  { maxMo: 12, mealsPerDay: 3, calsFromSolids: 300 },
  { maxMo: 24, mealsPerDay: 4, calsFromSolids: 550 },
  { maxMo: 36, mealsPerDay: 4, calsFromSolids: 750 },
  { maxMo: 999,mealsPerDay: 3, calsFromSolids: 950 },
];

function guidelineForAge(months) {
  return GUIDELINES.find(g => months <= g.maxMo) || GUIDELINES[GUIDELINES.length - 1];
}
function solidsForAge(months) {
  return SOLIDS.find(s => months <= s.maxMo) || SOLIDS[SOLIDS.length - 1];
}

function calcAge(dob, asOf = new Date()) {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b)) return null;
  let years = asOf.getFullYear() - b.getFullYear();
  let months = asOf.getMonth() - b.getMonth();
  let days = asOf.getDate() - b.getDate();
  if (days < 0) {
    months--;
    const prev = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) { years--; months += 12; }
  const totalMonths = years * 12 + months + days / 30;
  return { years, months, days, totalMonths };
}

// ── Count-up animation ──────────────────────────────────────
function CountUp({ value, format = (n) => n.toFixed(2), duration = 500 }) {
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(start + (end - start) * eased);
      if (k < 1) raf = requestAnimationFrame(step);
      else prev.current = end;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(v)}</>;
}

function Stepper({ value, onChange, step = 1, min = 0, max = 99 }) {
  return (
    <div className="mw-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - step))}>−</button>
      <input value={value} onChange={e => onChange(Math.max(min, Math.min(max, +e.target.value || 0)))} />
      <button type="button" onClick={() => onChange(Math.min(max, value + step))}>+</button>
    </div>
  );
}

// ── Calculator ──────────────────────────────────────────────
function Calculator({ formulas = [] }) {
  // Today (UI-stable, doesn't change on rerender)
  const today = useRef(new Date());
  const todayStr = today.current.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });

  // DOB — defaults to ~3 months ago (lets the calculator demo immediately)
  const defaultDob = (() => {
    const d = new Date(today.current);
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().slice(0, 10);
  })();
  const [dob, setDob] = useState(defaultDob);
  const age = useMemo(() => calcAge(dob, today.current), [dob]);
  const ageMo = age ? age.totalMonths : 0;
  const guideline = guidelineForAge(ageMo);
  const solidsRec = solidsForAge(ageMo);

  // Product database — pick or manual
  const [productKey, setProductKey] = useState('');
  const product = useMemo(() => formulas.find(p => p.product === productKey), [formulas, productKey]);

  // Feeding inputs (auto-filled by age, user can override)
  const [feedsPerDay, setFeedsPerDay] = useState(7);
  const [mlPerFeed, setMlPerFeed] = useState(120);

  // Apply age-based defaults when DOB changes
  useEffect(() => {
    if (!age) return;
    const g = guidelineForAge(age.totalMonths);
    setFeedsPerDay(Math.round((g.feeds[0] + g.feeds[1]) / 2));
    setMlPerFeed(Math.round((g.mlPerFeed[0] + g.mlPerFeed[1]) / 2));
  }, [dob]); // eslint-disable-line

  // Product / formula spec (override from product selection)
  const [scoopSize, setScoopSize] = useState(4.3);
  const [tinSize, setTinSize] = useState(900);
  const [pricePerTin, setPricePerTin] = useState(42.90);

  useEffect(() => {
    if (product) {
      if (product.scoopSize) setScoopSize(product.scoopSize);
      if (product.packSize) setTinSize(product.packSize);
      if (product.price) setPricePerTin(product.price);
    }
  }, [product]);

  // Feeding mode
  const [feedingMode, setFeedingMode] = useState('formula'); // 'formula' | 'mixed'
  const [breastFeedsShare, setBreastFeedsShare] = useState(2); // mixed: # of feeds replaced by breast

  // Solids (only matters if > 6 months)
  const [solidsMeals, setSolidsMeals] = useState(2);
  useEffect(() => {
    setSolidsMeals(solidsRec.mealsPerDay);
  }, [dob]); // eslint-disable-line

  // ── Calculations ────────────────────────────────────────
  const calc = useMemo(() => {
    const effectiveFormulaFeeds = feedingMode === 'mixed'
      ? Math.max(0, feedsPerDay - breastFeedsShare)
      : feedsPerDay;
    const dailyMlFormula = effectiveFormulaFeeds * mlPerFeed;
    // Powder per ml at standard 1 scoop / 30ml dilution
    const gramsPerMl = scoopSize / 30;
    const dailyGrams = dailyMlFormula * gramsPerMl;
    const dailyCost = (dailyGrams / tinSize) * pricePerTin;
    const monthlyCost = dailyCost * 30;
    const tinsPerMonth = (dailyGrams * 30) / tinSize;
    const yearlyCost = dailyCost * 365;
    const tinsPerYear = (dailyGrams * 365) / tinSize;
    return { dailyMlFormula, dailyGrams, dailyCost, monthlyCost, yearlyCost, tinsPerMonth, tinsPerYear };
  }, [feedsPerDay, mlPerFeed, breastFeedsShare, scoopSize, tinSize, pricePerTin, feedingMode]);

  // Benchmark — is current intake within guideline?
  const inRangeStatus = useMemo(() => {
    const intake = (feedingMode === 'mixed' ? Math.max(0, feedsPerDay - breastFeedsShare) : feedsPerDay) * mlPerFeed;
    const [lo, hi] = guideline.dailyMl;
    if (lo === 0 && hi === 0) return { label: 'No specific guideline for this age', tone: 'muted' };
    if (intake < lo * 0.85) return { label: 'Below typical range', tone: 'low', delta: Math.round(lo - intake) + ' ml/day under' };
    if (intake > hi * 1.15) return { label: 'Above typical range', tone: 'high', delta: Math.round(intake - hi) + ' ml/day over' };
    return { label: 'Within typical range', tone: 'in', delta: `${lo}–${hi} ml/day` };
  }, [feedsPerDay, mlPerFeed, breastFeedsShare, feedingMode, guideline]);

  // ── 24-month projection (past + future) ─────────────────
  const projection = useMemo(() => {
    if (!age) return [];
    const rows = [];
    const startMo = Math.max(0, Math.floor(age.totalMonths) - 11);
    const endMo = Math.min(36, Math.floor(age.totalMonths) + 12);
    for (let mo = startMo; mo <= endMo; mo++) {
      const g = guidelineForAge(mo);
      // Average of range — neutral retroactive estimate
      const expectedMl = (g.dailyMl[0] + g.dailyMl[1]) / 2;
      // After ~6mo, solids reduce formula intake by 10-50% per month
      const solidsCut = mo >= 6 ? Math.min(0.5, (mo - 6) * 0.06) : 0;
      const adjustedMl = expectedMl * (1 - solidsCut);
      const grams = adjustedMl * (scoopSize / 30);
      const tinsThisMonth = (grams * 30) / tinSize;
      const cost = tinsThisMonth * pricePerTin;
      rows.push({
        month: mo,
        isPast: mo < Math.floor(age.totalMonths),
        isNow: mo === Math.floor(age.totalMonths),
        stage: g.stage,
        expectedMl,
        adjustedMl,
        solidsCut,
        cost,
        tinsThisMonth,
      });
    }
    return rows;
  }, [age, scoopSize, tinSize, pricePerTin]);

  const pastSpend = projection.filter(r => r.isPast).reduce((s, r) => s + r.cost, 0);
  const futureSpend = projection.filter(r => !r.isPast).reduce((s, r) => s + r.cost, 0);

  // Solids check (>6mo)
  const solidsCheck = useMemo(() => {
    if (ageMo < 6) return null;
    // Rough rule: total daily calorie estimate = formula calories (~67 kcal / 100ml) + solids
    const formulaKcal = calc.dailyMlFormula * 0.67;
    const solidsKcal = solidsMeals * (solidsRec.calsFromSolids / Math.max(1, solidsRec.mealsPerDay));
    const total = formulaKcal + solidsKcal;
    // Recommended daily kcal estimate by age
    const targetKcal = ageMo < 9 ? 700 : ageMo < 12 ? 800 : ageMo < 24 ? 1000 : 1200;
    const ratio = total / targetKcal;
    return {
      formulaKcal: Math.round(formulaKcal),
      solidsKcal: Math.round(solidsKcal),
      totalKcal: Math.round(total),
      targetKcal,
      ratio,
      verdict: ratio < 0.85 ? 'under' : ratio > 1.20 ? 'over' : 'on-track',
    };
  }, [ageMo, calc.dailyMlFormula, solidsMeals, solidsRec]);

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <div style={{ maxWidth: 'var(--mw-max-content)', margin: '0 auto', padding: '32px 32px 16px' }}>
        <div className="mw-eyebrow">Calculator</div>
        <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 600, letterSpacing: '-0.022em', margin: '0 0 8px', color: 'var(--mw-text)' }}>
          What you'll actually spend.
        </h1>
        <p style={{ color: 'var(--mw-text-muted)', fontSize: 15, maxWidth: '60ch', margin: 0 }}>
          Enter your baby's date of birth — we use today's date (<b>{todayStr}</b>) to estimate spend so far and project forward, accounting for the transition to solids.
        </p>
      </div>

      <div className="mw-calc">
        {/* ── Inputs ─────────────────────────────────────── */}
        <div className="mw-calc-inputs">
          {/* DOB */}
          <div className="mw-field">
            <label className="mw-label">Baby's date of birth <small>cannot be in the future</small></label>
            <input
              type="date"
              className="mw-input"
              value={dob}
              max={today.current.toISOString().slice(0, 10)}
              onChange={e => setDob(e.target.value)}
            />
            {age && (
              <div className="mw-age-card">
                <div>
                  <div className="mw-age-num">
                    {age.years > 0 ? <><span className="n">{age.years}</span><span className="u">y</span> </> : null}
                    <span className="n">{age.months}</span><span className="u">mo</span>{' '}
                    <span className="n small">{age.days}</span><span className="u small">d</span>
                  </div>
                  <div className="mw-age-stage">Suggested {guideline.stage}</div>
                </div>
                <div className="mw-age-meta">
                  <div><b>{guideline.feeds[0]}–{guideline.feeds[1]}</b> feeds/day</div>
                  <div><b>{guideline.mlPerFeed[0]}–{guideline.mlPerFeed[1]} ml</b> per feed</div>
                  <div><b>{guideline.dailyMl[0]}–{guideline.dailyMl[1]} ml</b> daily total</div>
                </div>
              </div>
            )}
          </div>

          {/* Product picker */}
          <div className="mw-field">
            <label className="mw-label">Pick a formula <small>auto-fills scoop, tin size, price</small></label>
            <select className="mw-select" value={productKey} onChange={e => setProductKey(e.target.value)}>
              <option value="">— Manual entry —</option>
              {formulas.map(p => (
                <option key={p.product} value={p.product}>
                  {p.brand} · {shortName(p.product)} · {p.packSize}g · {fmtSGD(p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Feeding mode */}
          <div className="mw-field">
            <label className="mw-label">Feeding mode</label>
            <div className="mw-seg">
              {[['formula','Formula only'],['mixed','Formula + breast milk']].map(([k,l]) => (
                <button key={k} className={feedingMode === k ? 'on' : ''} onClick={() => setFeedingMode(k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Feed amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="mw-field">
            <div>
              <label className="mw-label">Total feeds/day <small>{guideline.feeds[0]}–{guideline.feeds[1]} typical</small></label>
              <Stepper value={feedsPerDay} onChange={setFeedsPerDay} min={0} max={14} />
            </div>
            <div>
              <label className="mw-label">ml/feed <small>{guideline.mlPerFeed[0]}–{guideline.mlPerFeed[1]} typical</small></label>
              <Stepper value={mlPerFeed} onChange={setMlPerFeed} step={10} min={30} max={300} />
            </div>
          </div>

          {feedingMode === 'mixed' && (
            <div className="mw-field">
              <label className="mw-label">Breast feeds per day <small>subtracts from formula feeds</small></label>
              <Stepper value={breastFeedsShare} onChange={setBreastFeedsShare} min={0} max={feedsPerDay} />
              <div style={{ fontSize: 12, color: 'var(--mw-text-muted)', marginTop: 6, fontFamily: 'var(--mw-font-mono)' }}>
                {Math.max(0, feedsPerDay - breastFeedsShare)} formula + {breastFeedsShare} breast = {feedsPerDay} feeds/day
              </div>
            </div>
          )}

          {/* Formula spec */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="mw-field">
            <div>
              <label className="mw-label">Scoop size <small>grams</small></label>
              <Stepper value={scoopSize} onChange={setScoopSize} step={0.1} min={3} max={12} />
            </div>
            <div>
              <label className="mw-label">Tin size <small>grams</small></label>
              <select className="mw-select" value={tinSize} onChange={e => setTinSize(+e.target.value)}>
                {[380,400,800,820,850,900,1650,1700,1800].map(s => <option key={s} value={s}>{s}g</option>)}
              </select>
            </div>
          </div>
          <div className="mw-field">
            <label className="mw-label">Price per tin <small>SGD</small></label>
            <div className="mw-input-prefix" data-prefix="$">
              <input className="mw-input" type="number" step="0.10" value={pricePerTin} onChange={e => setPricePerTin(+e.target.value || 0)} />
            </div>
          </div>

          {/* Solids — only when 6mo+ */}
          {ageMo >= 6 && (
            <div className="mw-field" style={{ background: 'var(--mw-cream-tint)', padding: 16, borderRadius: 8, border: '1px solid var(--mw-cream-soft)' }}>
              <label className="mw-label" style={{ marginBottom: 10 }}>
                Solid food meals/day
                <small>{solidsRec.mealsPerDay} typical at this age</small>
              </label>
              <Stepper value={solidsMeals} onChange={setSolidsMeals} min={0} max={6} />
              {solidsCheck && (
                <div className="mw-solids-status" data-tone={solidsCheck.verdict}>
                  <div className="head">
                    {solidsCheck.verdict === 'on-track' && '✓ On track'}
                    {solidsCheck.verdict === 'under' && '⚠️ Below target intake'}
                    {solidsCheck.verdict === 'over' && '⚠️ Above target intake'}
                  </div>
                  <div className="detail">
                    {solidsCheck.totalKcal} kcal/day from {solidsCheck.formulaKcal} formula + {solidsCheck.solidsKcal} solids ·
                    target ~{solidsCheck.targetKcal} kcal/day at this age
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Results ────────────────────────────────────── */}
        <div className="mw-calc-results">

          {/* Benchmark vs guideline */}
          <div className="mw-benchmark" data-tone={inRangeStatus.tone}>
            <div className="mw-benchmark-head">
              <div>
                <div className="mw-eyebrow" style={{ marginBottom: 4 }}>Intake benchmark</div>
                <div className="mw-benchmark-status">{inRangeStatus.label}</div>
                {inRangeStatus.delta && <div className="mw-benchmark-delta">{inRangeStatus.delta}</div>}
              </div>
              <div className="mw-benchmark-num">
                <CountUp value={calc.dailyMlFormula} format={n => Math.round(n).toLocaleString()} duration={400} />
                <span className="u">ml/day</span>
              </div>
            </div>
            <BenchmarkBar
              value={calc.dailyMlFormula}
              low={guideline.dailyMl[0]}
              high={guideline.dailyMl[1]}
            />
            <div className="mw-benchmark-axis">
              <span>0</span>
              <span style={{ color: 'var(--mw-accent)', fontWeight: 600 }}>
                Typical {guideline.dailyMl[0]}–{guideline.dailyMl[1]} ml
              </span>
              <span>{Math.max(guideline.dailyMl[1] * 1.5, 1500)}</span>
            </div>
          </div>

          {/* Result cards */}
          <div className="mw-result-grid">
            <div className="mw-result-card">
              <div className="l">Daily formula cost</div>
              <div className="v">$<CountUp value={calc.dailyCost} format={n => n.toFixed(2)} /></div>
              <div className="s">~{calc.tinsPerMonth.toFixed(1)} tins / month</div>
            </div>
            <div className="mw-result-card">
              <div className="l">Monthly cost (now)</div>
              <div className="v">$<CountUp value={calc.monthlyCost} format={n => n.toFixed(0)} /></div>
              <div className="s">at current feeding pattern</div>
            </div>
            <div className="mw-result-card">
              <div className="l">Spent so far</div>
              <div className="v">$<CountUp value={pastSpend} format={n => Math.round(n).toLocaleString('en-SG')} /></div>
              <div className="s">retroactive · {projection.filter(r => r.isPast).length} months</div>
            </div>
            <div className="mw-result-card">
              <div className="l">Projected (next 12 mo)</div>
              <div className="v">$<CountUp value={futureSpend} format={n => Math.round(n).toLocaleString('en-SG')} /></div>
              <div className="s">factors in transition to solids</div>
            </div>
          </div>

          {/* Spending chart */}
          <SpendingChart projection={projection} />

          {/* Singapore vs Malaysia */}
          <MalaysiaCompare price={pricePerTin} tinsPerYear={calc.tinsPerYear} />

          <p style={{ fontSize: 12, color: 'var(--mw-text-muted)', lineHeight: 1.55, margin: '8px 0 0' }}>
            All calculations are estimates based on typical usage. Actual consumption varies significantly by baby, growth spurts, and feeding schedules. This calculator is a planning tool only, not a prescription.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Benchmark bar (current intake vs guideline range) ──────
function BenchmarkBar({ value, low, high }) {
  const maxScale = Math.max(high * 1.5, value * 1.1, 1500);
  const valPct = Math.min(100, (value / maxScale) * 100);
  const loPct = (low / maxScale) * 100;
  const hiPct = (high / maxScale) * 100;
  return (
    <div className="mw-benchmark-bar">
      <div className="band" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
      <div className="marker" style={{ left: `calc(${valPct}% - 6px)` }} />
    </div>
  );
}

// ── Spending chart with past / now / future ─────────────────
function SpendingChart({ projection }) {
  if (!projection.length) return null;
  const max = Math.max(...projection.map(r => r.cost), 1);
  return (
    <div className="mw-chart">
      <div className="mw-chart-head">
        <div>
          <div className="mw-eyebrow" style={{ marginBottom: 4 }}>Monthly spend · 24-month window</div>
          <div style={{ fontFamily: 'var(--mw-font-body)', fontSize: 14, color: 'var(--mw-text-muted)' }}>
            Past 12 months retroactive · 12 months projected
          </div>
        </div>
        <div className="mw-chart-legend">
          <span><i style={{ background: 'var(--mw-text-faint)' }} /> Past</span>
          <span><i style={{ background: 'var(--mw-accent)' }} /> Now</span>
          <span><i style={{ background: 'var(--mw-clay)' }} /> Projected</span>
        </div>
      </div>
      <div className="mw-chart-bars-x">
        {projection.map(r => {
          const h = (r.cost / max) * 100;
          const cls = r.isNow ? 'now' : r.isPast ? 'past' : 'future';
          return (
            <div className={`mw-chart-col ${cls}`} key={r.month}>
              <div className="bar-wrap-x">
                <span className="bar-x" style={{ height: `${h}%` }} />
                {r.isNow && <span className="now-tag">now</span>}
              </div>
              <span className="m-label">{r.month}mo</span>
            </div>
          );
        })}
      </div>
      <div className="mw-chart-foot">
        Notice the projected curve flattens after ~6 months — that's the typical drop in formula intake as solids are introduced.
      </div>
    </div>
  );
}

// ── Malaysia comparison ─────────────────────────────────────
function MalaysiaCompare({ price, tinsPerYear }) {
  const myPriceMyr = Math.round(price * 3.05 * 0.72);
  const myPriceSgd = price * 0.72;
  const savePerTin = price - myPriceSgd;
  const annualSavings = savePerTin * tinsPerYear;
  return (
    <div className="mw-result-card">
      <div className="mw-eyebrow" style={{ marginBottom: 12 }}>Singapore vs Malaysia (estimate)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 11, color: 'var(--mw-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SG / tin</div>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 24, color: 'var(--mw-text)', marginTop: 4, fontWeight: 500 }}>{fmtSGD(price)}</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 11, color: 'var(--mw-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MY / tin (est.)</div>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 24, color: 'var(--mw-text)', marginTop: 4, fontWeight: 500 }}>RM {myPriceMyr}</div>
        </div>
      </div>
      <div className="mw-savings-card">
        <div style={{ fontFamily: 'var(--mw-font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Estimated annual savings</div>
        <div className="v">{fmtSGD0(annualSavings)}</div>
        <div style={{ fontSize: 12 }}>~28% less in MY · cross-border purchases for personal consumption are generally permitted but subject to SG customs.</div>
      </div>
    </div>
  );
}

Object.assign(window, { Calculator, calcAge, guidelineForAge, GUIDELINES });
