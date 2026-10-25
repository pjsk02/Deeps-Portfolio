import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Ctx = { theme: Theme; toggleTheme: () => void; motion: boolean; toggleMotion: () => void };
const PrefsCtx = createContext<Ctx | null>(null);

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

export function PrefsProvider({ children }: { children: ReactNode }) {
  // Stable server/first-client snapshots avoid hydration mismatches. The tiny
  // head script has already applied the visitor's colors before first paint.
  const [theme, setTheme] = useState<Theme>('light');
  const [motion, setMotion] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    setMotion(root.getAttribute('data-motion') !== 'off');
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute('content', theme === 'dark' ? '#231815' : '#F5EFC6');
      });
      document.documentElement.setAttribute('data-app-ready', 'true');
    }
  }, [theme, ready]);
  useEffect(() => { if (ready) document.documentElement.setAttribute('data-motion', motion ? 'on' : 'off'); }, [motion, ready]);

  // follow system changes only until the visitor chooses explicitly
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = (e: MediaQueryListEvent) => {
      if (!['light', 'dark'].includes(store.get('dr-theme') ?? '')) setTheme(e.matches ? 'dark' : 'light');
    };
    const motionChange = (e: MediaQueryListEvent) => {
      if (!['on', 'off'].includes(store.get('dr-motion') ?? '')) setMotion(!e.matches);
    };
    mq.addEventListener('change', fn);
    rm.addEventListener('change', motionChange);
    return () => { mq.removeEventListener('change', fn); rm.removeEventListener('change', motionChange); };
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => { const n = t === 'dark' ? 'light' : 'dark'; store.set('dr-theme', n); return n; }), []);
  const toggleMotion = useCallback(() => setMotion((m) => { store.set('dr-motion', m ? 'off' : 'on'); return !m; }), []);

  return <PrefsCtx.Provider value={{ theme, toggleTheme, motion, toggleMotion }}>{children}</PrefsCtx.Provider>;
}

export function usePrefs() {
  const c = useContext(PrefsCtx);
  if (!c) throw new Error('usePrefs outside provider');
  return c;
}

/** true while element is on screen AND the tab is visible */
export function useActive<T extends Element>(margin = '0px') {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    const v = () => setVisible(!document.hidden);
    v();
    document.addEventListener('visibilitychange', v);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', v); };
  }, [margin]);
  return [ref, onScreen && visible] as const;
}

/** one-shot: becomes true once the element nears the viewport */
export function useNear<T extends Element>(margin = '400px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);
  return [ref, near] as const;
}
