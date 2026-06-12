export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = {
    sm: { mark: 32, wordmark: 18, tagSize: 9,  gap: 8 },
    md: { mark: 42, wordmark: 24, tagSize: 10, gap: 10 },
    lg: { mark: 54, wordmark: 30, tagSize: 12, gap: 12 },
  }[size];

  const r   = s.mark / 2;
  const cx  = r;
  const cy  = r;

  /* bowl curve sits in lower 55% of the circle */
  const bowlY   = cy + r * 0.05;
  const bowlW   = r * 0.80;
  const bowlD   = `M ${cx - bowlW} ${bowlY} Q ${cx} ${cy + r * 0.62} ${cx + bowlW} ${bowlY}`;

  /* three steam wisps above the bowl */
  const steamBase = cy - r * 0.10;
  const wisp = (dx: number) =>
    `M ${cx + dx} ${steamBase} Q ${cx + dx + r * 0.12} ${steamBase - r * 0.28} ${cx + dx} ${steamBase - r * 0.55}`;

  const sw  = Math.max(2, s.mark * 0.065);   /* stroke width scales with mark */
  const rad = Math.round(s.mark * 0.26);      /* icon corner radius */

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, userSelect: 'none' }}>
      {/* ── Icon mark ── */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox={`0 0 ${s.mark} ${s.mark}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rounded-square background */}
        <rect width={s.mark} height={s.mark} rx={rad} fill="#FF5A1F" />

        {/* Bowl arc */}
        <path d={bowlD} stroke="white" strokeWidth={sw} strokeLinecap="round" fill="none" />

        {/* Steam wisps */}
        {[-bowlW * 0.42, 0, bowlW * 0.42].map((dx, i) => (
          <path key={i} d={wisp(dx)} stroke="white" strokeWidth={sw * 0.78} strokeLinecap="round" fill="none" />
        ))}
      </svg>

      {/* ── Wordmark ── */}
      <div style={{ lineHeight: 1 }}>
        <span style={{ fontSize: s.wordmark, fontWeight: 700, letterSpacing: '-0.03em', color: 'inherit' }}>
          Foody<span style={{ color: '#FF5A1F' }}>.</span>
        </span>
        {size === 'lg' && (
          <p style={{ fontSize: s.tagSize, color: 'var(--color-text-secondary, #888)', marginTop: 3, letterSpacing: '0.04em' }}>
            fresh food · fast delivery
          </p>
        )}
      </div>
    </div>
  );
}
