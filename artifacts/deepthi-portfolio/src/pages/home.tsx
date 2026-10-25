import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Mail, Gamepad2, FileText, Copy, Check } from 'lucide-react';
import { asset, profile, experience, education, projects, publications, capabilities } from '@/lib/content';
import { chapterIntro, chapterKinds, resume, resumeHref, visibleChapters, type ChapterEntry } from '@/lib/story';
import { useNear } from '@/lib/prefs';
import { InspectionFigure, AgentFigure, Dashboard } from '@/components/figures';

const AgentWalkthrough = lazy(() => import('@/components/agent-walkthrough'));
const PipelineGame = lazy(() => import('@/components/pipeline-game'));

function Skeleton({ h }: { h: string }) {
  return <div role="status" className={`${h} rounded-xl border-2 border-dashed border-foreground/20 bg-muted/40`} aria-label="Loading interactive demo" />;
}

function SectionHead({ id, n, kicker, title }: { id: string; n?: string; kicker: string; title: ReactNode }) {
  return (
    <div className="reveal grid md:grid-cols-[180px_1fr] gap-3 md:gap-8 rule pt-5 mb-10">
      <p className="kicker">{n && <><span className="text-foreground">{n}</span> · </>}{kicker}</p>
      <h2 id={id} className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight scroll-mt-24">{title}</h2>
    </div>
  );
}

function Hero() {
  return (
    <section className="wrap pt-10 md:pt-16 pb-16" aria-labelledby="hero-name">
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-end">
        <div>
          <p className="kicker reveal">Data analyst · pipelines · applied AI</p>
          <h1 id="hero-name" className="reveal font-display mt-4 text-[clamp(3.2rem,10vw,8.2rem)] leading-[0.88] tracking-[-0.035em]">
            Deepthi<br /><em className="font-normal italic text-primary">Ramesh</em>
          </h1>
          <p className="reveal mt-8 text-2xl md:text-[2rem] leading-snug max-w-xl font-medium">
            I turn <span className="mark">messy data</span> into tools teams can use.
          </p>
          <p className="reveal mt-4 text-lg text-muted-foreground max-w-xl">
            Data analysis, reliable pipelines and applied-AI projects, each one built around a clear business question.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-ink" data-testid="link-explore-work">Explore my work <ArrowRight size={17} /></a>
            <a href={`mailto:${profile.email}`} className="btn btn-line" data-testid="link-hero-email"><Mail size={17} />Get in touch</a>
            {resumeHref && <a href={resumeHref} target="_blank" rel="noreferrer" className="btn btn-line" data-testid="link-hero-resume"><FileText size={17} />{resume.label}</a>}
          </div>
        </div>
        <figure className="reveal relative mx-auto w-full max-w-[380px]">
          <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[14px] bg-accent" aria-hidden="true" />
          <img src={asset('img/deepthi.jpg')} alt="Deepthi Ramesh smiling outdoors beside a lake, autumn hills behind her." width={480} height={595}
            fetchPriority="high" className="relative w-full aspect-[4/5] object-cover object-[50%_20%] rounded-[12px] border-2 border-foreground" />
          </div>
          <figcaption className="relative mt-5 mono text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
            <span>01 — behind the work</span><span>A little time outdoors.</span>
          </figcaption>
        </figure>
      </div>
      <nav aria-label="Jump to section" className="reveal mt-14 grid grid-cols-2 md:grid-cols-4 border-y-2 border-foreground/80">
        {[['01', 'Experience', '#experience', 'Where the analysis started'], ['02', 'Work', '#work', 'Nine projects, three in depth'], ['03', 'Research', '#research', 'Five published papers'], ['04', 'Contact', '#contact', 'Email, LinkedIn, GitHub']].map(([n, l, h, d], i) => (
          <a key={l} href={h} className={`group p-4 md:p-5 hover:bg-accent/25 ${i % 2 ? '' : 'border-r'} md:border-r last:border-r-0 border-foreground/20 ${i < 2 ? 'border-b md:border-b-0' : ''}`} data-testid={`link-jump-${l.toLowerCase()}`}>
            <span className="mono text-xs text-muted-foreground">{n}</span>
            <span className="block font-display text-xl md:text-2xl mt-1 group-hover:translate-x-1 transition-transform">{l}</span>
            <span className="block text-sm text-muted-foreground mt-1">{d}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}

function Experience() {
  return (
    <section className="wrap py-16" aria-labelledby="experience">
      <SectionHead id="experience" n="01" kicker="Decisions first" title={<>It started with <span className="mark">questions from finance and operations</span>.</>} />
      <div className="space-y-12">
        {experience.map((e) => (
          <article key={e.id} className="reveal grid md:grid-cols-[180px_1fr] gap-3 md:gap-8">
            <p className="mono text-sm text-muted-foreground pt-1">{e.dates}</p>
            <div className="grid lg:grid-cols-[1fr_280px] gap-6">
              <div>
                <h3 className="text-2xl font-semibold">{e.role} <span className="text-muted-foreground font-normal">· {e.org}</span></h3>
                <p className="font-display italic text-xl mt-2 text-primary">{e.lede}</p>
                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => <li key={p} className="flex gap-3"><span className="mt-2.5 h-1.5 w-3 bg-accent shrink-0" aria-hidden />{p}</li>)}
                </ul>
              </div>
              <div className="lg:border-l lg:pl-6 border-foreground/15">
                <p className="kicker mb-2">Used</p>
                <p className="mono text-sm leading-7">{e.tools.join(' · ')}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Chapters />
    </section>
  );
}

function ChapterGroups({ entries, draft = false }: { entries: ChapterEntry[]; draft?: boolean }) {
  return (
    <div className="space-y-12">
      {chapterKinds.map(({ kind, label }) => {
        const group = entries.filter((e) => e.kind === kind);
        if (group.length === 0) return null;
        return (
          <div key={kind} className="grid md:grid-cols-[180px_1fr] gap-3 md:gap-8" data-testid={`group-chapter-${kind}`}>
            <h4 className="font-display italic text-xl text-primary md:pt-1">{label}</h4>
            <div className="space-y-10">
              {group.map((e) => (
                <article key={e.id} className={`grid lg:grid-cols-[1fr_280px] gap-6 ${draft ? '' : 'reveal'}`} data-testid={`item-chapter-${e.id}`}>
                  <div className="min-w-0">
                    <p className="mono text-sm text-muted-foreground">{e.dates}</p>
                    <h5 className="text-xl md:text-2xl font-semibold mt-1 break-words">{e.title} <span className="text-muted-foreground font-normal">· {e.role}{e.org ? `, ${e.org}` : ''}</span></h5>
                    <p className="mt-2">{e.summary}</p>
                    <ul className="mt-4 space-y-2">
                      {e.contributions.map((c) => <li key={c} className="flex gap-3"><span className="mt-2.5 h-1.5 w-3 bg-accent shrink-0" aria-hidden />{c}</li>)}
                    </ul>
                    {e.outcomes && e.outcomes.length > 0 && (
                      <ul className="mt-4 space-y-1 border-l-4 border-[hsl(var(--signal))] pl-3 text-sm">
                        {e.outcomes.map((o) => <li key={o}>{o}</li>)}
                      </ul>
                    )}
                    {e.evidence && e.evidence.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {e.evidence.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noreferrer" className="link text-sm inline-flex items-center gap-1 break-all" data-testid={`link-chapter-evidence-${e.id}`}>{x.label} <ArrowUpRight size={14} aria-hidden /></a>)}
                      </div>
                    )}
                  </div>
                  {e.tools && e.tools.length > 0 && (
                    <div className="lg:border-l lg:pl-6 border-foreground/15">
                      <p className="kicker mb-2">Used</p>
                      <p className="mono text-sm leading-7">{e.tools.join(' · ')}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Chapters() {
  const published = visibleChapters.filter((e) => e.status === 'published');
  // Drafts exist only in the development preview; production builds drop them.
  const drafts = visibleChapters.filter((e) => e.status === 'draft');
  const introPublished = chapterIntro.status === 'published';
  if (published.length === 0 && drafts.length === 0) return null;
  return (
    <div className="mt-16" data-testid="section-chapters">
      <div className="reveal grid md:grid-cols-[180px_1fr] gap-3 md:gap-8 border-t border-foreground/20 pt-5 mb-8">
        <p className="kicker">Beyond the role</p>
        <div>
          <h3 id="beyond" className="font-display text-2xl md:text-4xl leading-tight scroll-mt-24">{chapterIntro.title}</h3>
          {introPublished && <p className="mt-3 text-muted-foreground max-w-2xl">{chapterIntro.lede}</p>}
        </div>
      </div>
      {published.length > 0 && <ChapterGroups entries={published} />}
      {drafts.length > 0 && (
        <details className="mt-10 rounded-xl border-2 border-dashed border-foreground/30 p-4 md:p-5" data-testid="details-chapter-drafts">
          <summary className="cursor-pointer mono text-xs uppercase tracking-widest text-[hsl(var(--signal))]">
            Preview only · {drafts.length} draft {drafts.length === 1 ? 'entry' : 'entries'} waiting for details · hidden on the live site
          </summary>
          {!introPublished && <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Intro draft:</span> {chapterIntro.lede}</p>}
          <div className="mt-6"><ChapterGroups entries={drafts} draft /></div>
        </details>
      )}
    </div>
  );
}

function Featured() {
  const [food, glow, clout] = projects;
  return (
    <section className="wrap py-16" aria-labelledby="work">
      <SectionHead id="work" n="02" kicker="Selected work" title={<>Three questions, followed <span className="mark">all the way through</span>.</>} />

      <article className="reveal grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center py-6">
        <div>
          <p className="kicker">{food.n} · {food.category}</p>
          <h3 className="font-display text-3xl md:text-4xl mt-2 leading-tight">{food.title}</h3>
          <p className="mt-4 text-xl font-medium">{food.question}</p>
          <p className="mt-3 text-muted-foreground">{food.summary}</p>
          <p className="mt-4 mono text-sm">{food.tools.join(' · ')}</p>
          <Link href={`/work/${food.slug}`} className="btn btn-ink mt-6" data-testid="link-case-food-inspections">See how the cities were made comparable <ArrowRight size={16} /></Link>
        </div>
        <div className="rounded-xl border-2 border-foreground/80 bg-card p-5"><InspectionFigure /><p className="mt-2 text-xs text-muted-foreground">Original schematic of the approach described in the repository.</p></div>
      </article>

      <article className="reveal py-14 mt-8 border-t border-foreground/15">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="kicker">{glow.n} · {glow.category}</p>
            <h3 className="font-display text-3xl md:text-4xl mt-2 leading-tight">{glow.title}</h3>
            <p className="mt-4 text-xl font-medium">{glow.question}</p>
            <p className="mt-3 text-muted-foreground">{glow.summary}</p>
            <p className="mt-4 p-3 border-l-4 border-[hsl(var(--signal))] bg-card text-sm">{glow.context}</p>
            <Link href={`/work/${glow.slug}`} className="btn btn-ink mt-6" data-testid="link-case-glowmetric">Read the measurement framework <ArrowRight size={16} /></Link>
          </div>
          <Dashboard n={1} caption="GlowMetric dashboard, page 1: program overview with views, engagements, spend and engagement rate by platform and creator tier." />
        </div>
      </article>

      <article className="reveal py-14 border-t border-foreground/15">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div>
            <p className="kicker">{clout.n} · {clout.category}</p>
            <h3 className="font-display text-3xl md:text-4xl mt-2 leading-tight">{clout.title}</h3>
            <p className="mt-4 text-xl font-medium">{clout.question}</p>
            <p className="mt-3 text-muted-foreground">{clout.summary} {clout.context}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/work/${clout.slug}`} className="btn btn-ink" data-testid="link-case-cloutwatch">See the agent hand-off <ArrowRight size={16} /></Link>
              <a href="#workbench" className="btn btn-line" data-testid="link-try-workbench">Try the walkthrough</a>
            </div>
          </div>
          <div className="rounded-xl border-2 border-foreground/80 bg-card p-5"><AgentFigure /></div>
        </div>
      </article>
    </section>
  );
}

function Workbench() {
  const [ref, near] = useNear<HTMLDivElement>();
  return (
    <section className="wrap py-12" aria-labelledby="workbench">
      <div className="reveal max-w-2xl mb-8">
        <p className="kicker">Workbench</p>
        <h2 id="workbench" className="font-display text-3xl md:text-4xl mt-2 scroll-mt-24">Watch a decision brief get built, one role at a time.</h2>
        <p className="mt-3 text-muted-foreground">A step-through of the Cloutwatch sequence using two invented creators. Step through it manually or let it play.</p>
      </div>
      <div ref={ref} className="needs-js">{near ? <Suspense fallback={<Skeleton h="h-[520px]" />}><AgentWalkthrough /></Suspense> : <Skeleton h="h-[520px]" />}</div>
      <div className="no-js-only border border-foreground/20 bg-card rounded-xl p-6">
        <AgentFigure />
        <p className="mt-3">Scout summarizes the signal. Risk checks the assumptions. Strategist drafts a recommendation. A person reviews the brief.</p>
        <p className="mt-2 text-sm">The interactive replay uses sample data and JavaScript; the project explanation is always available.</p>
        <Link href="/work/cloutwatch" className="link inline-block mt-4">Read the Cloutwatch case study</Link>
      </div>
    </section>
  );
}

function MoreWork() {
  const rest = projects.slice(3);
  return (
    <section className="wrap py-16" aria-labelledby="more-work">
      <div className="reveal flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mb-6">
        <h2 id="more-work" className="font-display text-2xl md:text-3xl whitespace-nowrap">More projects</h2>
        <a href={profile.github} target="_blank" rel="noreferrer" className="link text-sm inline-flex items-center gap-1 whitespace-nowrap" data-testid="link-github-all">All repositories on GitHub <ArrowUpRight size={14} aria-hidden /></a>
      </div>
      <ul className="reveal border-t-2 border-foreground/80">
        {rest.map((p) => (
          <li key={p.slug} className="border-b border-foreground/15">
            <Link href={`/work/${p.slug}`} className="group grid grid-cols-[40px_1fr_auto] md:grid-cols-[60px_1.3fr_1fr_auto] gap-4 items-center py-5 hover:bg-accent/15 px-1" data-testid={`link-project-${p.slug}`}>
              <span className="mono text-sm text-muted-foreground">{p.n}</span>
              <span>
                <span className="block text-lg md:text-xl font-semibold group-hover:text-primary">{p.title}</span>
                <span className="block text-sm text-muted-foreground mt-0.5 md:hidden">{p.category}</span>
              </span>
              <span className="hidden md:block text-sm text-muted-foreground">{p.question}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const solution = [
  ['Inconsistent result labels across cities', 'Map both vocabularies to one shared set of categories.'],
  ['One inspection, several violations', 'Model one row per violation, linked back to its inspection.'],
  ['Exact duplicate rows after loading', 'Deduplicate on city + inspection + violation, preserving different violations and logging removals.'],
];

function Game() {
  const [playing, setPlaying] = useState(false);
  const startBtn = useRef<HTMLButtonElement>(null);
  const exit = () => { setPlaying(false); requestAnimationFrame(() => startBtn.current?.focus()); };
  return (
    <section className="wrap py-12" aria-labelledby="game">
      <div className="reveal grid lg:grid-cols-[1fr_1.4fr] gap-10">
        <div>
          <p className="kicker">Optional · about 30 seconds</p>
          <h2 id="game" className="font-display text-3xl md:text-4xl mt-2 scroll-mt-24">Fix the pipeline.</h2>
          <p className="mt-3 text-muted-foreground">Three small cleaning decisions on synthetic inspection rows. No timer, no sound, nothing here that isn’t also written out below.</p>
          <details className="mt-6 rounded-lg border border-foreground/20 bg-card p-4" data-testid="details-game-solution">
            <summary className="cursor-pointer font-semibold">Skip the game: read the three decisions</summary>
            <ol className="mt-3 space-y-3 text-sm">
              {solution.map(([a, b], i) => <li key={a}><span className="mono text-muted-foreground">{i + 1}.</span> <strong>{a}.</strong> {b}</li>)}
            </ol>
          </details>
        </div>
        <div className="needs-js">
          {playing ? (
            <Suspense fallback={<Skeleton h="h-[420px]" />}><PipelineGame onExit={exit} /></Suspense>
          ) : (
            <div className="crt rounded-xl p-5 sm:p-8 min-h-[300px] flex flex-col items-start justify-center gap-4 pixel border-4">
              <p className="text-xs uppercase tracking-widest game-accent">Insert curiosity</p>
              <p className="text-2xl">&gt; 3 stages. 2 cities. 1 grain.</p>
              <button ref={startBtn} type="button" onClick={() => setPlaying(true)} onMouseEnter={() => import('@/components/pipeline-game')} onFocus={() => import('@/components/pipeline-game')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-3 game-action font-medium" data-testid="button-game-start">
                <Gamepad2 size={18} />Start the game
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="wrap py-16" aria-labelledby="capabilities">
      <SectionHead id="capabilities" kicker="How I work" title={<>Tools, grouped by <span className="mark">what they’re for</span>.</>} />
      <div className="grid sm:grid-cols-2 border-t-2 border-l border-foreground/20">
        {capabilities.map((c, i) => {
          const proof = projects.find((p) => p.slug === c.proof)!;
          return (
            <div key={c.verb} className="reveal p-6 md:p-8 border-r border-b border-foreground/20">
              <p className="mono text-xs text-muted-foreground">0{i + 1}</p>
              <h3 className="font-display text-2xl md:text-3xl mt-1">{c.verb}</h3>
              <p className="mt-3 leading-7">{c.items.join(' · ')}</p>
              <Link href={`/work/${proof.slug}`} className="link text-sm mt-4 inline-block" data-testid={`link-proof-${i}`}>Evidence: {proof.title}</Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Research() {
  return (
    <section className="wrap py-16" aria-labelledby="research">
      <SectionHead id="research" n="03" kicker="Research" title={<>Five papers on <span className="mark">prediction, evaluation and automation</span>.</>} />
      <p className="reveal md:ml-[212px] -mt-4 mb-8 text-muted-foreground max-w-2xl">My research spans business prediction, machine learning and workflow automation. Five co-authored publications, with links to the original papers.</p>
      <ol className="md:ml-[212px] border-t border-foreground/20">
        {publications.map((p, i) => (
          <li key={p.id} className="reveal border-b border-foreground/20 py-6 grid md:grid-cols-[1fr_auto] gap-4" data-testid={`item-publication-${p.id}`}>
            <div>
              <p className="mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')} · {p.venue}</p>
              <h3 className="text-xl font-semibold mt-1">{p.short}</h3>
              <p className="font-display italic mt-1 text-muted-foreground">{p.title}</p>
              <p className="text-sm mt-2">{p.angle}{p.doi && <span className="mono text-xs text-muted-foreground break-all"> · DOI {p.doi}</span>}</p>
            </div>
            <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-line btn-sm self-start" data-testid={`link-paper-${p.id}`} aria-label={`Read paper: ${p.short}`}>Read paper <ArrowUpRight size={15} aria-hidden /></a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Education() {
  return (
    <section className="wrap py-12" aria-labelledby="education">
      <div className="reveal grid md:grid-cols-[180px_1fr] gap-3 md:gap-8 rule pt-5">
        <h2 id="education" className="kicker">Education</h2>
        <ul className="grid md:grid-cols-2 gap-6">
          {education.map((e) => <li key={e.school}><p className="font-display text-2xl">{e.school}</p><p className="mt-1 text-muted-foreground">{e.program}</p><p className="mono text-xs mt-1">{e.place}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = setTimeout(() => setState('idle'), 2400);
    return () => clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setState('copied');
    } catch {
      setState('failed');
    }
  };
  return (
    <>
      <button type="button" onClick={copy} className="needs-js btn border-2 border-primary-foreground/60 hover:bg-primary-foreground/10" data-testid="button-copy-email">
        {state === 'copied' ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        {state === 'copied' ? 'Email copied' : state === 'failed' ? 'Copy unavailable' : 'Copy email'}
      </button>
      <span className="sr-only" role="status" aria-live="polite" data-testid="status-copy-email">
        {state === 'copied' ? 'Email address copied to clipboard.' : state === 'failed' ? `Copy unavailable. The address is ${profile.email}.` : ''}
      </span>
    </>
  );
}

function Contact() {
  return (
    <section className="wrap pt-16" aria-labelledby="contact">
      <div className="reveal rounded-2xl bg-primary text-primary-foreground p-8 md:p-14 relative overflow-hidden">
        <svg className="absolute right-0 bottom-0 w-2/3 opacity-25" viewBox="0 0 400 160" aria-hidden="true"><path d="M0 150 L80 110 L150 125 L230 60 L300 80 L400 10" fill="none" stroke="hsl(var(--accent))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <p className="mono text-xs uppercase tracking-widest opacity-80">04 · Contact</p>
        <h2 id="contact" className="font-display text-4xl md:text-6xl mt-3 max-w-3xl leading-[1.02] scroll-mt-24 relative">Have a messy question? <em className="italic">Send it over.</em></h2>
        <p className="mt-5 max-w-xl opacity-85 relative">Let’s talk about the data, systems or AI workflows your team is working on. Email is the simplest place to start.</p>
        <div className="mt-8 flex flex-wrap gap-3 relative">
          <a href={`mailto:${profile.email}`} className="btn bg-accent text-accent-foreground hover:opacity-90 text-left [overflow-wrap:anywhere]" data-testid="link-contact-email"><Mail size={17} className="shrink-0" /><span>{profile.email.split('@')[0]}@<wbr />{profile.email.split('@')[1]}</span></a>
          <CopyEmail />
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn border-2 border-primary-foreground/60 hover:bg-primary-foreground/10" data-testid="link-contact-linkedin">LinkedIn profile <ArrowUpRight size={16} aria-hidden /></a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn border-2 border-primary-foreground/60 hover:bg-primary-foreground/10" data-testid="link-contact-github">GitHub · Deepthir13 <ArrowUpRight size={16} aria-hidden /></a>
          {resumeHref && <a href={resumeHref} target="_blank" rel="noreferrer" className="btn border-2 border-primary-foreground/60 hover:bg-primary-foreground/10" data-testid="link-contact-resume"><FileText size={16} />{resume.label}</a>}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Featured />
      <Workbench />
      <MoreWork />
      <Game />
      <Capabilities />
      <Research />
      <Education />
      <Contact />
    </>
  );
}
