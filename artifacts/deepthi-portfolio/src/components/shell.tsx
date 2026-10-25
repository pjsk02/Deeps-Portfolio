import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Moon, Sun, X, Pause, Play, ArrowUpRight } from 'lucide-react';
import { BASE, profile } from '@/lib/content';
import { usePrefs } from '@/lib/prefs';
import { PageMetadata } from './page-metadata';

const nav = [
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
];

/**
 * Which primary section the reader is in, so the nav can show where they are.
 * Section positions are cached and refreshed only when the page resizes, so
 * scrolling reads scrollY alone and never forces a layout.
 */
function useCurrentSection(enabled: boolean) {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    if (!enabled) { setCurrent(''); return; }
    const ids = nav.map((n) => n.href.slice(1));
    let tops: number[] = [];
    let raf = 0;
    const measure = () => {
      tops = ids.map((id) => {
        const section = document.getElementById(id)?.closest('section');
        return section ? section.getBoundingClientRect().top + window.scrollY : Infinity;
      });
    };
    const update = () => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let found = '';
      tops.forEach((top, i) => { if (top <= line) found = ids[i]; });
      // The last section can be too short to reach the line; the page end counts as it.
      if (found && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) found = ids[ids.length - 1];
      setCurrent(found);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const remeasure = () => { measure(); schedule(); };
    const resize = new ResizeObserver(remeasure);
    resize.observe(document.body);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', remeasure);
    return () => { resize.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', remeasure); cancelAnimationFrame(raf); };
  }, [enabled]);
  return current;
}

function Controls() {
  const { theme, toggleTheme, motion, toggleMotion } = usePrefs();
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={toggleMotion} aria-pressed={!motion} data-testid="button-toggle-motion"
        aria-label={motion ? 'Turn motion off' : 'Turn motion on'} title={motion ? 'Motion on' : 'Motion off'}
        className="h-[44px] min-w-[44px] px-[10px] rounded-md inline-flex items-center justify-center gap-1.5 hover:bg-foreground/5 mono text-[0.7rem] uppercase tracking-wider">
        {motion ? <Pause size={15} /> : <Play size={15} />}<span className="hidden sm:inline">Motion {motion ? 'on' : 'off'}</span>
      </button>
      <button type="button" onClick={toggleTheme} data-testid="button-toggle-theme"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="h-[44px] w-[44px] rounded-md inline-flex items-center justify-center hover:bg-foreground/5">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [loc] = useLocation();
  const current = useCurrentSection(loc === '/');
  useEffect(() => setOpen(false), [loc]);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-foreground/10">
      <div className="wrap flex h-16 items-center justify-between gap-2 md:gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold" data-testid="link-home" aria-label="Deepthi Ramesh, home">
          <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="hsl(var(--primary))" /><path d="M14 44 L26 30 L36 37 L50 18" fill="none" stroke="hsl(var(--accent))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>Deepthi <span className="hidden min-[360px]:inline">Ramesh</span></span>
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-[0.95rem]">
          {nav.map((n) => {
            const here = current === n.href.slice(1);
            return (
              <a key={n.href} href={`${BASE}${n.href}`} aria-current={here ? 'location' : undefined}
                className={`relative py-1 hover:text-primary transition-colors after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-primary after:transition-transform ${here ? 'text-primary after:scale-x-100' : 'after:scale-x-0'}`}
                data-testid={`link-nav-${n.label.toLowerCase()}`}>{n.label}</a>
            );
          })}
        </nav>
        <div className="needs-js flex items-center gap-1">
          <Controls />
          <button ref={btn} type="button" className="md:hidden h-[44px] w-[44px] inline-flex items-center justify-center rounded-md hover:bg-foreground/5"
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)} data-testid="button-mobile-menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div className="no-js-only">
        <nav aria-label="Section navigation" className="md:hidden wrap flex flex-wrap gap-x-6 py-2">
          {nav.map((n) => <a key={n.href} href={`${BASE}${n.href}`} className="inline-flex min-h-11 items-center">{n.label}</a>)}
        </nav>
      </div>
      {open && (
        <div id="mobile-menu" ref={panel} className="md:hidden border-t border-foreground/10 bg-background">
          <nav aria-label="Mobile" className="wrap py-4 flex flex-col">
            {nav.map((n) => {
              const here = current === n.href.slice(1);
              return (
                <a key={n.href} href={`${BASE}${n.href}`} onClick={() => setOpen(false)} aria-current={here ? 'location' : undefined}
                  className={`py-3 text-xl font-display border-b border-foreground/10 flex items-center justify-between ${here ? 'text-primary' : ''}`}
                  data-testid={`link-mobile-${n.label.toLowerCase()}`}>{n.label}{here && <span className="mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">You are here</span>}</a>
              );
            })}
            <a href={`mailto:${profile.email}`} className="py-3 text-xl font-display">Email Deepthi</a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-foreground/15 mt-24">
      <div className="wrap py-10 flex flex-col md:flex-row gap-6 md:items-center justify-between text-sm">
        <p className="text-muted-foreground max-w-md">Deepthi Ramesh · Data analysis, engineering and applied AI.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><a className="link" href={`mailto:${profile.email}`} data-testid="link-footer-email">Email</a></li>
          <li><a className="link inline-flex items-center gap-1" href={profile.linkedin} target="_blank" rel="noreferrer" data-testid="link-footer-linkedin">LinkedIn <ArrowUpRight size={13} aria-hidden /></a></li>
          <li><a className="link inline-flex items-center gap-1" href={profile.github} target="_blank" rel="noreferrer" data-testid="link-footer-github">GitHub (Deepthir13) <ArrowUpRight size={13} aria-hidden /></a></li>
        </ul>
      </div>
    </footer>
  );
}

function ScrollProgress() {
  const { motion } = usePrefs();
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [motion]);
  if (!motion) return null;
  return <div ref={bar} className="progress" aria-hidden="true" style={{ transform: 'scaleX(0)' }} />;
}

function useReveal() {
  const [loc] = useLocation();
  useEffect(() => {
    // The initial view remains readable before JavaScript. Only future,
    // below-the-fold content opts into a reveal. Positions come from the
    // observer entries, so this never forces a layout per element on load.
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      else if (e.boundingClientRect.top >= window.innerHeight) e.target.classList.add('reveal-wait');
    }), { rootMargin: '0px 0px -8% 0px' });
    const t = setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el)), 30);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [loc]);
}

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  useReveal();
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
    else document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [loc]);
  return (
    <>
      <PageMetadata />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] btn btn-ink">Skip to content</a>
      <div className="sky" aria-hidden="true"><span className="s1" /><span className="s2" /><span className="s3" /></div>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
    </>
  );
}
