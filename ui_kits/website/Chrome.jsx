// Chrome: top nav + disclaimer banner + footer.
const { useState, useEffect } = React;

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        width: 32, height: 32, padding: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        border: '1px solid var(--mw-border)',
        borderRadius: 999,
        color: 'var(--mw-text-muted)',
        cursor: 'pointer',
        transition: 'all 200ms var(--mw-ease)',
      }}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
    </button>
  );
}

function NavBar({ active, onNav, theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id: 'compare', label: 'Compare' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'nutrition', label: 'Nutrition Guide' },
    { id: 'parents', label: 'For New Parents' },
    { id: 'about', label: 'About' },
  ];
  const goto = (id) => { setMobileOpen(false); onNav(id); };
  return (
    <>
      <nav className="mw-nav">
        <div className="mw-nav-inner">
          <a className="mw-nav-brand" onClick={() => goto('home')} style={{ cursor: 'pointer' }}>
            <Wordmark size={20} />
          </a>
          <div className="mw-nav-links">
            {links.map(l => (
              <a key={l.id}
                 className={active === l.id ? 'active' : ''}
                 onClick={() => goto(l.id)}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="mw-nav-right">
            <SGFlag />
            <span>SGD</span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <button className="mw-nav-hamburger" aria-label="Menu" onClick={() => setMobileOpen(true)}>
            <Icon name="menu" size={22} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="mw-mobile-menu" role="dialog">
          <button className="mw-mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <Icon name="x" size={22} />
          </button>
          <div className="mw-mobile-links">
            {[{ id: 'home', label: 'Home' }, ...links].map(l => (
              <a key={l.id}
                 className={active === l.id ? 'active' : ''}
                 onClick={() => goto(l.id)}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="mw-mobile-footer">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <SGFlag /> SGD
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      )}
    </>
  );
}

function DisclaimerBanner({ onDismiss }) {
  return (
    <div className="mw-banner">
      <span>⚠️&nbsp;&nbsp;MilkWise SG is not a medical advice platform. Always consult your paediatrician.</span>
      <button className="close" onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  );
}

function Footer({ onNav }) {
  return (
    <>
    <footer className="mw-footer">
      <div className="mw-footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={28} />
            <span className="word">MilkWise</span>
            <span className="mw-sg-pill" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(247,243,234,0.7)', borderColor: 'rgba(255,255,255,0.12)' }}>SG</span>
          </div>
          <p className="tag">Formula facts, clearly laid out. An independent, non-sponsored resource for Singapore parents.</p>
        </div>
        <div>
          <h4>Tools</h4>
          <ul>
            <li><a onClick={() => onNav('compare')}>Compare</a></li>
            <li><a onClick={() => onNav('calculator')}>Calculator</a></li>
            <li><a onClick={() => onNav('nutrition')}>Nutrition Guide</a></li>
          </ul>
        </div>
        <div>
          <h4>Data Sources</h4>
          <ul>
            <li><a>FairPrice · Guardian</a></li>
            <li><a>Watsons · Lazada</a></li>
            <li><a>Shopee · RedMart</a></li>
            <li><a>WHO · HPB Singapore</a></li>
          </ul>
        </div>
        <div>
          <h4>About</h4>
          <ul>
            <li><a onClick={() => onNav('about')}>Our story</a></li>
            <li><a onClick={() => onNav('about')}>Methodology</a></li>
            <li><a onClick={() => onNav('about')}>Terms & Conditions</a></li>
            <li><a onClick={() => onNav('about')}>Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="mw-footer-bottom">
        © 2026 MILKWISE SG · BUILT FOR SINGAPORE PARENTS · NOT MEDICAL ADVICE
      </div>
    </footer>
    </>
  );
}

Object.assign(window, { NavBar, DisclaimerBanner, Footer });
