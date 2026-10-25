type Props = { tone: 'ink' | 'gold' | 'clay'; label: string; active?: boolean; className?: string };

const fills = { ink: 'hsl(var(--primary))', gold: 'hsl(var(--accent))', clay: 'hsl(var(--signal))' };

/** Small original robot drawn in SVG; lives inside its scene only. */
export function Bot({ tone, label, active, className = '' }: Props) {
  const c = fills[tone];
  return (
    <svg viewBox="0 0 64 72" className={`${className} ${active ? 'bob' : ''}`} role="img" aria-label={label}>
      <line x1="32" y1="4" x2="32" y2="14" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="5" r="4" fill={active ? 'hsl(var(--accent))' : c} className={active ? 'blink' : ''} />
      <rect x="10" y="14" width="44" height="32" rx="9" fill={c} />
      <rect x="16" y="21" width="32" height="17" rx="5" fill="hsl(var(--background))" />
      <circle cx="25" cy="29.5" r="3" fill={c} />
      <circle cx="39" cy="29.5" r="3" fill={c} />
      <rect x="20" y="49" width="24" height="15" rx="4" fill={c} opacity=".85" />
      <rect x="6" y="51" width="10" height="5" rx="2.5" fill={c} opacity=".7" />
      <rect x="48" y="51" width="10" height="5" rx="2.5" fill={c} opacity=".7" />
      <rect x="22" y="65" width="7" height="6" rx="2" fill={c} />
      <rect x="35" y="65" width="7" height="6" rx="2" fill={c} />
    </svg>
  );
}
