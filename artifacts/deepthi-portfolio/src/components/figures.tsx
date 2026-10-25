import { Maximize2 } from 'lucide-react';
import { asset } from '@/lib/content';

/** Two source schemas converging on one violation-grain fact table. */
export function InspectionFigure() {
  return (
    <svg viewBox="0 0 420 240" className="w-full h-auto" role="img" aria-label="Diagram: Chicago and Dallas inspection tables are normalized into one violation-level fact table that feeds a dashboard.">
      <g fontFamily="var(--app-font-mono)" fontSize="11" fill="hsl(var(--foreground))">
        <rect x="10" y="20" width="130" height="70" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <text x="22" y="40" fontWeight="600">chicago_raw</text>
        <text x="22" y="58" fill="hsl(var(--muted-foreground))">results: text</text>
        <text x="22" y="74" fill="hsl(var(--muted-foreground))">violations: list</text>
        <rect x="10" y="140" width="130" height="70" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <text x="22" y="160" fontWeight="600">dallas_raw</text>
        <text x="22" y="178" fill="hsl(var(--muted-foreground))">114 columns</text>
        <text x="22" y="194" fill="hsl(var(--muted-foreground))">wide layout</text>
        <path d="M140 55 C 180 55 172 115 198 115 M140 175 C 180 175 172 115 198 115" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        <rect x="198" y="85" width="134" height="60" rx="6" fill="hsl(var(--accent))" />
        <text x="210" y="108" fontWeight="600" fill="hsl(var(--accent-foreground))">fact_violation</text>
        <text x="210" y="126" fill="hsl(var(--accent-foreground))">1 row / violation</text>
        <path d="M332 115 H 350" stroke="hsl(var(--primary))" strokeWidth="2" />
        <rect x="350" y="90" width="60" height="50" rx="6" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <rect x="360" y="118" width="8" height="14" fill="hsl(var(--primary))" /><rect x="372" y="108" width="8" height="24" fill="hsl(var(--primary))" /><rect x="384" y="113" width="8" height="19" fill="hsl(var(--signal))" />
        <text x="210" y="230" textAnchor="middle" fill="hsl(var(--muted-foreground))">normalize → model → report</text>
      </g>
    </svg>
  );
}

export function AgentFigure() {
  const nodes = [['Scout', 'primary'], ['Risk', 'signal'], ['Strategist', 'accent'], ['Human', 'foreground']];
  return (
    <svg viewBox="0 0 420 120" className="w-full h-auto" role="img" aria-label="Diagram: Scout passes to Risk, Risk passes to Strategist, and a human approves the brief.">
      <g fontFamily="var(--app-font-mono)" fontSize="12">
        {nodes.map(([n, c], i) => (
          <g key={n} transform={`translate(${12 + i * 102} 30)`}>
            <rect width="88" height="54" rx="8" fill="hsl(var(--card))" stroke={`hsl(var(--${c}))`} strokeWidth="2.5" strokeDasharray={n === 'Human' ? '5 4' : undefined} />
            <text x="44" y="32" textAnchor="middle" fill="hsl(var(--foreground))">{n}</text>
            {i < 3 && <path d="M90 27 h10 m-5 -5 l5 5 -5 5" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.6" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Dashboard({ n, caption }: { n: 1 | 2 | 3; caption: string }) {
  const height = { 1: 675, 2: 716, 3: 714 }[n];
  const src = asset(`img/glowmetrics-page-${n}.jpeg`);
  return (
    <figure>
      <a href={src} target="_blank" rel="noreferrer" className="group block cursor-zoom-in rounded-lg" data-testid={`link-dashboard-full-${n}`}>
        <img src={src} alt={caption} loading="lazy" decoding="async" width={1280} height={height} className="w-full h-auto rounded-2xl border border-foreground/10 shadow-[0_18px_40px_-24px_hsl(var(--shadow)/.45)] group-hover:border-primary transition-colors" />
        <span className="mt-2 flex justify-end">
          <span className="inline-flex min-h-8 items-center gap-1.5 mono text-xs uppercase tracking-wider text-foreground underline decoration-accent decoration-2 underline-offset-4 group-hover:text-primary">
            <Maximize2 size={13} aria-hidden />View full size<span className="sr-only"> (opens in a new tab)</span>
          </span>
        </span>
      </a>
      <figcaption className="mt-2 flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
        <span className="ev ev-synthetic">Mixed real / synthetic / modeled data</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
