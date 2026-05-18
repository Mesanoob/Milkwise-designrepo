// MilkWise SG — Shared atoms & helpers (loaded first)
// Exposes globals consumed by every screen.

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ── Formatting ────────────────────────────────────────────────
const fmtSGD = (n) =>
  '$' + (n ?? 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSGD0 = (n) =>
  '$' + Math.round(n ?? 0).toLocaleString('en-SG');
const fmtPerGram = (n) =>
  '$' + (n ?? 0).toFixed(3);
const fmtCount = (n) =>
  (n ?? 0).toLocaleString('en-SG', { maximumFractionDigits: 1 });

// ── Brand mark ─ baby bottle emoji (system-native, works everywhere) ─
function LogoMark({ size = 28, className = '' }) {
  return (
    <span
      className={className}
      role="img"
      aria-label="MilkWise"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        lineHeight: 1,
        // Force the emoji-only font stack so OS color glyph is used
        fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne Color", sans-serif',
        // Slight vertical optical centering
        transform: 'translateY(-1px)',
      }}
    >🍼</span>
  );
}

function Wordmark({ size = 22 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size + 6} />
      <span style={{
        fontFamily: 'var(--mw-font-display)',
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '-0.02em',
        color: 'var(--mw-text)',
        lineHeight: 1,
      }}>MilkWise</span>
      <span className="mw-sg-pill">SG</span>
    </span>
  );
}

// ── Singapore flag (drawn inline) ────────────────────────────
function SGFlag({ size = 16 }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 24 16" style={{ borderRadius: 2, border: '1px solid var(--mw-border)' }}>
      <rect x="0" y="0" width="24" height="8" fill="#C0392B" />
      <rect x="0" y="8" width="24" height="8" fill="#FFFFFF" />
      <circle cx="5.6" cy="8" r="3" fill="#FFFFFF" />
      <circle cx="6.5" cy="8" r="2.4" fill="#C0392B" />
      <g fill="#FFFFFF" transform="translate(5.6 8)" fontSize="2.2">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <polygon
            key={i}
            points="0,-2 0.6,-0.6 2,-0.6 0.9,0.3 1.3,1.7 0,0.9 -1.3,1.7 -0.9,0.3 -2,-0.6 -0.6,-0.6"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>
    </svg>
  );
}

// ── Lucide icon helper (via window.lucide) ───────────────────
function Icon({ name, size = 16, stroke = 1.5, color = 'currentColor', style }) {
  const ref = useRef();
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: { width: size, height: size, 'stroke-width': stroke, stroke: color },
      });
    }
  }, [name, size, stroke, color]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} />;
}

// ── Buttons ──────────────────────────────────────────────────
function Button({ variant = 'solid', size = 'md', children, onClick, style, type = 'button', icon, iconTrailing }) {
  const cls = `mw-btn mw-btn-${variant} mw-btn-${size}`;
  return (
    <button type={type} className={cls} onClick={onClick} style={style}>
      {icon && <span className="mw-btn-icon">{icon}</span>}
      <span>{children}</span>
      {iconTrailing && <span className="mw-btn-icon trail">{iconTrailing}</span>}
    </button>
  );
}

// ── Pill / Tag / Badge ───────────────────────────────────────
function Pill({ active, children, onClick }) {
  return (
    <button type="button" className={`mw-pill ${active ? 'on' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
function Tag({ on, children }) {
  return <span className={`mw-tag ${on ? 'on' : 'off'}`}>{children}</span>;
}
function Badge({ variant = 'neutral', children }) {
  return <span className={`mw-badge mw-badge-${variant}`}>{children}</span>;
}
function StageBadge({ stage }) {
  return <span className="mw-stage-badge">{(stage || '').toUpperCase()}</span>;
}

// ── Layout primitives ────────────────────────────────────────
function Section({ id, eyebrow, title, children, bg, narrow }) {
  return (
    <section id={id} className={`mw-section ${bg ? 'mw-section-bg' : ''}`}>
      <div className={`mw-section-inner ${narrow ? 'narrow' : ''}`}>
        {eyebrow && <div className="mw-eyebrow">{eyebrow}</div>}
        {title && <h2 className="mw-section-title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }) {
  return <div className="mw-eyebrow">{children}</div>;
}

// ── Source badge ─────────────────────────────────────────────
function SourceBadge({ children }) {
  return <span className="mw-source-badge">{children}</span>;
}

// Export to window for cross-script access
Object.assign(window, {
  fmtSGD, fmtSGD0, fmtPerGram, fmtCount,
  LogoMark, Wordmark, SGFlag, Icon,
  Button, Pill, Tag, Badge, StageBadge,
  Section, Eyebrow, SourceBadge,
});
