import { Link, useParams } from 'wouter';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { BASE, projects, evidenceLabel } from '@/lib/content';
import { InspectionFigure, AgentFigure, Dashboard } from '@/components/figures';
import NotFound from './not-found';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const idx = projects.findIndex((p) => p.slug === slug);
  const p = projects[idx];

  if (!p) return <NotFound />;
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="wrap pt-8 pb-10">
      <a href={`${BASE}#work`} className="inline-flex items-center gap-2 text-sm hover:text-primary" data-testid="link-back-work"><ArrowLeft size={16} />Back to all work</a>

      <header className="mt-10 grid lg:grid-cols-[1fr_300px] gap-10 rule pt-6">
        <div>
          <p className="kicker">{p.n} · {p.category} · {p.tier}</p>
          <h1 className="font-display text-4xl md:text-6xl mt-3 leading-[1.02] tracking-tight">{p.title}</h1>
          <p className="mt-6 text-2xl font-medium max-w-2xl"><span className="mark">{p.question}</span></p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{p.summary}</p>
        </div>
        <aside className="lg:border-l lg:pl-6 border-foreground/20 space-y-5 text-sm">
          <div><p className="kicker mb-1">Project</p><p>{p.original}</p></div>
          <div><p className="kicker mb-1">Tools</p><p className="mono leading-6">{p.tools.join(' · ')}</p></div>
          <div><p className="kicker mb-2">Evidence</p><div className="flex flex-wrap gap-2">{p.evidence.map((e) => <span key={e} className={`ev ev-${e}`}>{evidenceLabel[e]}</span>)}</div></div>
          <a href={p.source} target="_blank" rel="noreferrer" className="btn btn-ink btn-sm" data-testid="link-project-source">{p.sourceLabel} <ArrowUpRight size={15} aria-hidden /></a>
        </aside>
      </header>

      {p.context && <p className="mt-10 p-4 border-l-4 border-[hsl(var(--signal))] bg-card max-w-3xl" data-testid="text-project-context"><strong>Context.</strong> {p.context}</p>}

      {p.slug === 'food-inspections' && <div className="mt-10 max-w-2xl rounded-xl border-2 border-foreground/80 bg-card p-5"><InspectionFigure /></div>}
      {p.slug === 'cloutwatch' && (
        <div className="mt-10 max-w-2xl rounded-xl border-2 border-foreground/80 bg-card p-5">
          <AgentFigure />
          <a href={`${BASE}#workbench`} className="link text-sm mt-3 inline-block" data-testid="link-open-workbench">Step through the illustrative walkthrough</a>
        </div>
      )}

      <div className="mt-12 grid lg:grid-cols-[1fr_300px] gap-10">
        <div className="space-y-10 max-w-2xl">
          {p.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl md:text-3xl">{s.h}</h2>
              {s.body.map((b) => <p key={b} className="mt-3 text-lg leading-relaxed">{b}</p>)}
            </section>
          ))}
        </div>
        <aside className="space-y-6">
          <section className="rounded-lg border border-foreground/20 bg-card p-5">
            <h2 className="kicker">Scope & considerations</h2>
            <ul className="mt-3 space-y-2 text-sm">{p.limits.map((l) => <li key={l} className="flex gap-2"><span className="text-[hsl(var(--signal))]" aria-hidden>—</span>{l}</li>)}</ul>
          </section>
          <section className="p-5">
            <h2 className="kicker">Supporting material</h2>
            <ul className="mt-2 text-sm mono space-y-1">{p.reviewed.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>
        </aside>
      </div>

      {p.slug === 'glowmetric' && (
        <section className="mt-14 space-y-10" aria-labelledby="dash">
          <h2 id="dash" className="font-display text-2xl md:text-3xl">The three dashboard pages</h2>
          <Dashboard n={1} caption="Page 1: program overview — views, engagements, spend, blended cost per engagement, and engagement rate by platform and tier." />
          <Dashboard n={2} caption="Page 2: creator scorecard — engagement, reach and modeled cost per engagement, with scale / optimize / cut recommendations. Original ratio and footer annotations need reconciliation with the displayed values." />
          <Dashboard n={3} caption="Page 3: funnel and formats — engagement comparisons by content format and funnel stage. The budget reallocation is a proposal for this fictional scenario, not realized savings." />
        </section>
      )}

      <nav aria-label="More projects" className="mt-20 grid sm:grid-cols-2 border-y-2 border-foreground/80">
        <Link href={`/work/${prev.slug}`} className="group p-5 sm:border-r border-b sm:border-b-0 border-foreground/20 hover:bg-accent/15" data-testid="link-prev-project">
          <span className="kicker inline-flex items-center gap-1"><ArrowLeft size={13} />Previous</span>
          <span className="block font-display text-xl mt-1">{prev.title}</span>
        </Link>
        <Link href={`/work/${next.slug}`} className="group p-5 text-right hover:bg-accent/15" data-testid="link-next-project">
          <span className="kicker inline-flex items-center gap-1">Next<ArrowRight size={13} /></span>
          <span className="block font-display text-xl mt-1">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
