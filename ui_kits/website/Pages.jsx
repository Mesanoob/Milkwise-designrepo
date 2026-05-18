// Nutrition Guide + For New Parents + About — long-form editorial pages.

function NutritionGuide() {
  return (
    <div style={{ maxWidth: 'var(--mw-max-content)', margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="mw-eyebrow">Nutrition Guide</div>
      <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 52, fontWeight: 400, letterSpacing: '-0.025em', margin: '0 0 16px', lineHeight: 1.05, maxWidth: '16ch' }}>
        How much formula does your baby need?
      </h1>
      <p style={{ fontSize: 18, color: 'var(--mw-text-muted)', lineHeight: 1.6, maxWidth: '56ch', margin: '0 0 32px' }}>
        Age-based guidelines drawn from WHO recommendations and Singapore HPB. Always consult your paediatrician for personalised advice.
      </p>

      <div className="mw-disclaim">
        <b>⚠️ Population averages — not individual prescriptions.</b> Every baby is different. Appetite varies daily. Never force-feed or restrict based on these numbers without medical guidance.
      </div>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '48px 0 8px' }}>
        Feeding guide by age
      </h2>
      <div style={{ marginBottom: 14 }}>
        <SourceBadge>Source · WHO Infant Feeding Guidelines · HPB Singapore</SourceBadge>
      </div>

      <table className="mw-nut-table">
        <thead>
          <tr>
            <th>Age</th><th style={{ textAlign: 'right' }}>Feeds / day</th><th style={{ textAlign: 'right' }}>ml / feed</th><th style={{ textAlign: 'right' }}>Daily total</th><th style={{ textAlign: 'right' }}>Stage</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['0–1 month','8–12','45–90ml','400–600ml','Stage 1'],
            ['1–3 months','6–8','90–150ml','600–900ml','Stage 1'],
            ['3–6 months','5–6','150–210ml','800–1000ml','Stage 1'],
            ['6–9 months','3–5','180–240ml','600–900ml','Stage 2'],
            ['9–12 months','3–4','180–240ml','500–700ml','Stage 2'],
            ['1–2 years','2–3','200–240ml','350–500ml','Stage 3'],
            ['2–3 years','1–2','200–250ml','200–400ml','Stage 3/4'],
          ].map(row => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td className="num" style={{ textAlign: 'right' }}>{row[1]}</td>
              <td className="num" style={{ textAlign: 'right' }}>{row[2]}</td>
              <td className="num" style={{ textAlign: 'right', fontWeight: 500 }}>{row[3]}</td>
              <td style={{ textAlign: 'right' }}><StageBadge stage={row[4]} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 13, color: 'var(--mw-text-muted)', lineHeight: 1.55, margin: '14px 0 0' }}>
        Ranges are population averages. Introduce solids as directed by your paediatrician from ~6 months.
      </p>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '64px 0 16px' }}>
        Safe preparation
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          ['1', 'Boil & cool water to ~70°C', 'or use cooled boiled water per tin instructions'],
          ['2', 'Measure water into sterilised bottle', 'always water first, then powder'],
          ['3', 'Add level scoops', 'do not pack or heap; follow tin ratio exactly'],
          ['4', 'Cap and gently swirl', 'do not shake vigorously'],
          ['5', 'Cool to feeding temp, test on wrist', 'should feel warm, not hot'],
          ['6', 'Discard unused', 'within 2h at room temp / 24h refrigerated'],
        ].map(([n, t, d]) => (
          <div key={n} className="mw-card" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 11, color: 'var(--mw-accent)', letterSpacing: '0.1em', fontWeight: 600 }}>STEP {n.padStart(2,'0')}</div>
            <h3 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 18, fontWeight: 500, margin: '6px 0 8px', letterSpacing: '-0.01em' }}>{t}</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--mw-text-muted)', lineHeight: 1.55 }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <SourceBadge>Source · WHO/UNICEF Safe Preparation of Infant Formula</SourceBadge>
      </div>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em', margin: '64px 0 12px', color: 'var(--mw-text)' }}>
        pHF vs eHF — understanding "hydrolysed"
      </h2>
      <p style={{ fontSize: 15, color: 'var(--mw-text-muted)', lineHeight: 1.65, margin: '0 0 20px' }}>
        "Hydrolysed" means the protein has been chemically broken down into smaller pieces, making it easier to digest. There are two grades, and the distinction matters:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="mw-card" style={{ padding: 22, borderLeft: '3px solid var(--mw-accent)' }}>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 11, color: 'var(--mw-accent)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 }}>pHF · PARTIALLY HYDROLYSED</div>
          <h4 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 8px', color: 'var(--mw-text)' }}>For comfort & easier digestion</h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--mw-text-muted)', lineHeight: 1.6 }}>
            Protein chains are broken into smaller pieces — large enough that some intact protein remains. Often labelled "Gentle", "Comfort", or "HA" (hypoallergenic). Marketed for general gut comfort and (with limited evidence) for reducing allergy risk in family-history infants. Available over the counter.
          </p>
        </div>
        <div className="mw-card" style={{ padding: 22, borderLeft: '3px solid var(--mw-clay)' }}>
          <div style={{ fontFamily: 'var(--mw-font-mono)', fontSize: 11, color: 'var(--mw-clay)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 }}>eHF · EXTENSIVELY HYDROLYSED</div>
          <h4 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 8px', color: 'var(--mw-text)' }}>For confirmed milk protein allergy</h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--mw-text-muted)', lineHeight: 1.6 }}>
            Protein is broken down so thoroughly that the immune system typically does not recognise it as cow's milk protein. Prescribed (or recommended by a paediatrician) for confirmed cow's milk protein allergy (CMPA). More expensive; specific brands like Nutramigen LGG fall here.
          </p>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--mw-text-muted)', lineHeight: 1.6, margin: '0 0 8px' }}>
        Beyond eHF sits <b style={{ color: 'var(--mw-text)' }}>amino acid formula (AAF)</b> — proteins fully broken into individual amino acids, used for severe allergy when even eHF triggers a reaction. AAFs are specialist products and require medical supervision.
      </p>
      <SourceBadge>Source · HSA Singapore · AAP Clinical Report on Hydrolysed Formula</SourceBadge>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '64px 0 16px' }}>
        Key nutrients, plainly
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: 'var(--mw-bg-card)', border: '1px solid var(--mw-border)', borderRadius: 'var(--mw-r-card)' }}>
        {[
          ['DHA & ARA', 'Brain and eye development. All formulas sold in Singapore must include minimum DHA — premium claims are mostly marketing.'],
          ['Iron', 'Cognitive development and anaemia prevention. Particularly important from 6 months on.'],
          ['Calcium & Vitamin D', 'Bone development. Singapore\u2019s indoor lifestyle makes Vit D supplementation common.'],
          ['Prebiotics (GOS / FOS)', 'Feed beneficial gut bacteria. Sometimes called scGOS / lcFOS on labels.'],
          ['Probiotics', 'Live strains — B. lactis BB-12, B. breve M-16V are common. Evidence varies by strain.'],
          ['HMO (Human Milk Oligosaccharides)', 'Synthetic 2\u2032-FL most common. Evidence is early but growing.'],
          ['Partially hydrolysed protein', 'Easier digestion for sensitive babies; reduced (not eliminated) allergy risk.'],
          ['Palm olein oil', 'Energy source. Some concern about calcium absorption — neither uniformly bad nor good.'],
        ].map(([t, d], i) => (
          <div key={t} style={{ padding: '18px 22px', borderBottom: i < 7 ? '1px solid var(--mw-divider)' : 'none', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--mw-font-display)', fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>{t}</span>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--mw-text-muted)', lineHeight: 1.6 }}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ForNewParents() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="mw-eyebrow">For New Parents</div>
      <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 52, fontWeight: 400, letterSpacing: '-0.025em', margin: '0 0 20px', lineHeight: 1.05, textWrap: 'balance' }}>
        The formula aisle is overwhelming. Here's what actually matters.
      </h1>
      <p style={{ fontSize: 18, color: 'var(--mw-text-muted)', lineHeight: 1.6, margin: '0 0 40px' }}>
        As a new parent, you'll be surrounded by expensive packaging, latin ingredient names, and well-meaning conflicting advice. This page is a calm starting point — not a definitive guide, and definitely not medical advice.
      </p>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '48px 0 8px' }}>What the stages mean</h2>
      <p style={{ fontSize: 16, color: 'var(--mw-text-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
        Stage numbers are marketing conventions — not strict medical categories for healthy babies. The stage primarily reflects protein and iron adjustments for age.
      </p>

      <p className="mw-pullquote">
        Stage 3 and Stage 4 formulas are not medically required for healthy toddlers who eat a varied diet. They are a commercial product — not a necessity.
      </p>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '48px 0 16px' }}>Milk source, briefly</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          ['🐄', 'Cow milk', 'Most common globally. Well-researched. Most babies tolerate it well.'],
          ['🐐', 'Goat milk', 'Slightly different protein structure (A2). Some parents report easier digestion. Evidence growing.'],
          ['🌿', 'Soy', 'Lactose-free, plant-based. Used for galactosaemia or cultural reasons. Not first-line without medical advice.'],
          ['🧪', 'Hydrolysed / HA / Amino Acid', 'Proteins broken into smaller pieces. For suspected cow milk protein allergy. Most expensive category.'],
        ].map(([e, t, d]) => (
          <div className="mw-card" key={t} style={{ padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{e}</div>
            <h3 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 18, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{t}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--mw-text-muted)', lineHeight: 1.55 }}>{d}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '48px 0 16px' }}>What you're actually paying for</h2>
      <p style={{ fontSize: 16, color: 'var(--mw-text-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
        "Premium = better" is not always true for formula. Here's what drives price:
      </p>
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          ['Marketing & brand positioning', 'Often the largest component of premium pricing.'],
          ['Speciality ingredients (HMO, specific probiotics)', 'Some have supporting evidence; some are early-stage.'],
          ['Organic certification', 'Affects farming costs, not always nutritional outcome.'],
          ['Manufacturing region (EU vs non-EU)', 'EU-sourced formula often commands a premium.'],
          ['Proprietary blends', 'Branded ingredient names are often standard ingredients in a marketing package.'],
        ].map(([t, d]) => (
          <li key={t} style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--mw-divider)' }}>
            <b style={{ fontWeight: 500, color: 'var(--mw-text)' }}>{t}</b>
            <span style={{ fontSize: 14, color: 'var(--mw-text-muted)', lineHeight: 1.55 }}>{d}</span>
          </li>
        ))}
      </ul>

      <p className="mw-pullquote" style={{ marginTop: 40 }}>
        All formula sold in Singapore must meet regulatory minimums. The base nutritional adequacy is guaranteed. What you pay extra for — and whether it's worth it — is a much harder question.
      </p>
      <div><SourceBadge>Source · HSA Singapore Infant Formula Regulations</SourceBadge></div>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '48px 0 16px' }}>Green flags / Yellow flags</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="mw-card" style={{ padding: 20, borderLeft: '3px solid var(--mw-accent)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mw-accent)', marginBottom: 10 }}>✅ Worth considering</div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: 'var(--mw-text)', lineHeight: 1.7 }}>
            <li>Halal-certified (if required)</li>
            <li>Age-appropriate stage</li>
            <li>No known allergen to your baby</li>
            <li>Paediatrician-recommended</li>
            <li>Within budget for sustained use</li>
          </ul>
        </div>
        <div className="mw-card" style={{ padding: 20, borderLeft: '3px solid var(--mw-clay)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mw-clay)', marginBottom: 10 }}>⚠️ Think critically about</div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: 'var(--mw-text)', lineHeight: 1.7 }}>
            <li>"Closest to breastmilk" claims</li>
            <li>"Brain development" headline claims</li>
            <li>Stage 3/4 necessity for healthy toddlers</li>
            <li>Extreme price premiums without clinical evidence</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="mw-eyebrow">About</div>
      <h1 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 52, fontWeight: 400, letterSpacing: '-0.025em', margin: '0 0 20px', lineHeight: 1.05 }}>
        Built by a parent, for parents.
      </h1>

      <div className="mw-card" style={{ padding: 28, borderLeft: '3px solid var(--mw-accent)', margin: '16px 0 40px' }}>
        <p style={{ fontFamily: 'var(--mw-font-display)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.6, margin: 0, color: 'var(--mw-text)', fontWeight: 400 }}>
          MilkWise SG was created out of a personal experience: standing in the formula aisle at FairPrice with a newborn at home, completely overwhelmed by 40+ products and no clear way to compare them. The goal was simple — build the comparison tool that didn't exist.
        </p>
      </div>

      <p style={{ fontSize: 16, color: 'var(--mw-text-muted)', lineHeight: 1.7, margin: '0 0 20px' }}>
        No affiliate links. No brand partnerships. No sponsored placements. Just clean data.
      </p>
      <p style={{ fontSize: 16, color: 'var(--mw-text-muted)', lineHeight: 1.7, margin: '0 0 40px' }}>
        Formula feeding is a deeply personal choice — and it should be an informed one. Whether you're formula-feeding by necessity or by choice, you deserve a clear, trustworthy resource.
      </p>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '40px 0 16px' }}>Data methodology</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <div className="mw-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mw-text-muted)', marginBottom: 8 }}>Prices from</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--mw-text)' }}>NTUC FairPrice, Guardian, Watsons, Lazada SG, Shopee SG, RedMart, plus monthly physical-store checks. Malaysia: Watsons MY, Guardian MY, Shopee MY, JB store visits.</p>
        </div>
        <div className="mw-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mw-text-muted)', marginBottom: 8 }}>Nutrition from</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--mw-text)' }}>Product packaging (primary), brand official websites, all at standard dilution unless stated otherwise.</p>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--mw-font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: '40px 0 16px' }}>Terms & Conditions</h2>
      <div style={{ fontSize: 14, color: 'var(--mw-text)', lineHeight: 1.7 }}>
        {[
          ['1. Purpose and Scope', 'MilkWise SG is an independent, non-commercial information resource. Not affiliated with, sponsored by, or endorsed by any formula brand, retailer, or healthcare institution.'],
          ['2. Not Medical Advice', 'All content is for general informational purposes only. Nothing on this Site constitutes medical advice. Always consult a qualified healthcare professional.'],
          ['3. Pricing Accuracy', 'Prices are indicative and may have changed since last update. Always verify with retailers before purchase.'],
          ['4. Cross-Border Purchasing', 'Cross-border purchase of infant formula for personal consumption is generally permitted but subject to Singapore customs regulations.'],
          ['5. No Endorsement', 'Inclusion of a product on this Site does not constitute an endorsement. Exclusion does not imply inferiority.'],
          ['6. Limitation of Liability', 'MilkWise SG shall not be held liable for any loss, damage, or harm arising from reliance on information presented on this Site.'],
        ].map(([t, d]) => (
          <div key={t} style={{ marginBottom: 16 }}>
            <b style={{ fontWeight: 600, color: 'var(--mw-text)' }}>{t}</b>
            <p style={{ margin: '4px 0 0', color: 'var(--mw-text-muted)' }}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { NutritionGuide, ForNewParents, About });
