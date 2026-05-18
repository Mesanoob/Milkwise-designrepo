// Homepage — hero, stats, features, steps, disclaimer strip.

function Home({ onNav }) {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="mw-hero">
        <div className="mw-hero-mesh" />
        <div className="mw-hero-inner">
          <div className="mw-hero-eyebrow">Formula facts, clearly laid out</div>
          <h1 className="mw-hero-title">Every tin.<br/>Every ingredient.<br/>Every dollar.</h1>
          <p className="mw-hero-sub">
            The most complete formula comparison resource for Singapore parents.
            Compare 76 products side-by-side. Calculate what you'll actually spend.
            No affiliates, no sponsored placements.
          </p>
          <div className="mw-hero-ctas">
            <Button variant="solid" size="xl" onClick={() => onNav('compare')} iconTrailing={<Icon name="arrow-right" size={16} />}>
              Compare formulas
            </Button>
            <Button variant="outline" size="xl" onClick={() => onNav('calculator')} iconTrailing={<Icon name="arrow-right" size={16} />}>
              Try the Calculator
            </Button>
          </div>
        </div>
        <div className="mw-scroll-chev"><Icon name="chevron-down" size={16} /></div>
      </section>

      {/* Section 2 — Stats band */}
      <section style={{ background: 'var(--mw-bg-panel)' }}>
        <div className="mw-section-inner" style={{ padding: '0 32px' }}>
          <div className="mw-stats">
            <div className="mw-stat">
              <span className="mw-stat-num">120+</span>
              <span className="mw-stat-label">Formulas tracked</span>
            </div>
            <div className="mw-stat">
              <span className="mw-stat-num">SGD</span>
              <span className="mw-stat-label">Prices updated regularly</span>
            </div>
            <div className="mw-stat">
              <span className="mw-stat-num">0</span>
              <span className="mw-stat-label">Sponsored listings</span>
            </div>
            <div className="mw-stat">
              <span className="mw-stat-num">MY ↔ SG</span>
              <span className="mw-stat-label">Savings comparison built in</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Features */}
      <Section eyebrow="What you can do" title="Three calm tools, one decision.">
        <div className="mw-features">
          <div className="mw-feature mw-card interactive" onClick={() => onNav('compare')} style={{ cursor: 'pointer' }}>
            <div className="mw-feature-icon"><Icon name="search" size={22} /></div>
            <h3>Compare</h3>
            <p>Side-by-side ingredient and nutrition breakdown across any two or three formulas. Best-value cell highlighted, no marketing copy in sight.</p>
            <span style={{ color: 'var(--mw-accent)', fontSize: 13, fontWeight: 500 }}>Open comparison →</span>
          </div>
          <div className="mw-feature mw-card interactive" onClick={() => onNav('calculator')} style={{ cursor: 'pointer' }}>
            <div className="mw-feature-icon"><Icon name="calculator" size={22} /></div>
            <h3>Calculate</h3>
            <p>Monthly, yearly, and total spend with savings comparison vs. Malaysia. Adjust feeds, scoop size, and feeding mode in real time.</p>
            <span style={{ color: 'var(--mw-accent)', fontSize: 13, fontWeight: 500 }}>Open calculator →</span>
          </div>
          <div className="mw-feature mw-card interactive" onClick={() => onNav('nutrition')} style={{ cursor: 'pointer' }}>
            <div className="mw-feature-icon"><Icon name="book-open" size={22} /></div>
            <h3>Nutrition Guide</h3>
            <p>WHO and HPB-backed age-appropriate intake guidelines. Every figure carries a visible source. Not medical advice.</p>
            <span style={{ color: 'var(--mw-accent)', fontSize: 13, fontWeight: 500 }}>Read the guide →</span>
          </div>
        </div>
      </Section>

      {/* Section 4 — How it works */}
      <Section eyebrow="How it works" title="From overwhelmed to informed in three steps." bg>
        <div className="mw-steps">
          {[
            { n: '01', t: 'Search or filter', d: 'Narrow 76 formulas by stage, milk source, special diet, brand, and tin size.' },
            { n: '02', t: 'Compare side-by-side', d: 'Up to three products. Price per gram, price per scoop, ingredient flags.' },
            { n: '03', t: 'Calculate your real cost', d: 'Plug in your baby\u2019s feeding pattern. See monthly, yearly, and Malaysia savings.' },
          ].map(s => (
            <div className="mw-step" key={s.n}>
              <span className="mw-step-num">{s.n}</span>
              <div className="mw-step-content">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 5 — Disclaimer strip */}
      <div className="mw-strip">
        <div className="mw-strip-inner">
          <b>MilkWise SG is an independent, non-sponsored resource.</b> We are not affiliated with any formula brand. This site is not medical advice. All prices are indicative — verify with retailers before purchase. <a style={{ borderBottom: '1px solid currentColor', cursor: 'pointer' }} onClick={() => onNav('about')}>Read full Terms & Conditions →</a>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Home });
