import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { RotateCcw, Play, StepForward, Check } from 'lucide-react';
import { Bot } from './bot';
import { useActive, usePrefs } from '@/lib/prefs';

const samples = {
  a: {
    label: 'Sample creator A — cooking, mid-tier',
    rows: [['Followers', '184k'], ['Avg. engagement', '6.1%'], ['Posts / 30 days', '22'], ['Sponsored share', '41%']],
    scout: 'Engagement is steady across 22 posts. Audience is mostly recipe saves, not comments.',
    risk: 'Sponsored share is high (41%). Two of five sampled posts are missing disclosure tags in the sample. Saves may not convert.',
    plan: 'Pilot one tagged campaign, measure saves-to-click before committing a larger budget.',
  },
  b: {
    label: 'Sample creator B — fitness, nano-tier',
    rows: [['Followers', '9.4k'], ['Avg. engagement', '12.7%'], ['Posts / 30 days', '9'], ['Sponsored share', '8%']],
    scout: 'Small, highly engaged audience. Comments are long and question-driven.',
    risk: 'Only 9 posts in 30 days: the engagement rate rests on a thin sample and could swing.',
    plan: 'Worth a low-cost test. Re-check engagement after another month before scaling.',
  },
};
type Key = keyof typeof samples;

const steps = [
  { who: 'Scout', tone: 'ink' as const, does: 'reads the creator signal' },
  { who: 'Risk', tone: 'clay' as const, does: 'looks for what could go wrong' },
  { who: 'Strategist', tone: 'gold' as const, does: 'drafts the brief' },
];

export default function AgentWalkthrough() {
  const [key, setKey] = useState<Key>('a');
  const [step, setStep] = useState(0); // 0 idle, 1..3 agents, 4 awaiting human, 5 approved
  const [auto, setAuto] = useState(false);
  const { motion } = usePrefs();
  const [ref, active] = useActive<HTMLDivElement>();
  const s = samples[key];

  useEffect(() => {
    if (!auto || !motion || !active || step >= 4) { if (step >= 4) setAuto(false); return; }
    const t = setTimeout(() => setStep((x) => x + 1), 1700);
    return () => clearTimeout(t);
  }, [auto, motion, active, step]);

  const run = () => { setStep(1); setAuto(motion); };
  const reset = () => { setStep(0); setAuto(false); };
  const outputs = [s.scout, s.risk, s.plan];

  return (
    <div ref={ref} className={`rounded-xl border-2 border-foreground/80 bg-card overflow-hidden ${active ? '' : 'paused'}`} data-testid="widget-agent-walkthrough">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b-2 border-foreground/80 bg-secondary/60">
        <p className="mono text-xs uppercase tracking-wider">Cloutwatch workflow · replay</p>
        <span className="ev ev-illustrative">Illustrative demo · sample data · no live AI</span>
      </div>

      <div className="p-4 md:p-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <fieldset>
            <legend className="kicker mb-2">1 · Pick a sample input</legend>
            <div className="flex flex-col gap-2">
              {(Object.keys(samples) as Key[]).map((k) => (
                <label key={k} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${key === k ? 'border-primary bg-primary/5' : 'border-foreground/20'}`}>
                  <input type="radio" name="sample" checked={key === k} onChange={() => { setKey(k); reset(); }} className="accent-[hsl(var(--primary))]" data-testid={`radio-sample-${k}`} />
                  <span className="text-sm">{samples[k].label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <table className="mt-4 w-full text-sm mono">
            <caption className="sr-only">Sample creator data</caption>
            <tbody>{s.rows.map(([a, b]) => <tr key={a} className="border-b border-foreground/10"><th scope="row" className="text-left font-normal py-1.5 text-muted-foreground">{a}</th><td className="text-right">{b}</td></tr>)}</tbody>
          </table>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="btn btn-ink btn-sm" onClick={run} data-testid="button-agent-run"><Play size={15} />Run walkthrough</button>
            <button type="button" className="btn btn-line btn-sm" disabled={step >= 4} onClick={() => { setAuto(false); setStep((x) => Math.min(4, x + 1)); }} data-testid="button-agent-next"><StepForward size={15} />Next step</button>
            <button type="button" className="btn btn-line btn-sm" onClick={reset} data-testid="button-agent-reset"><RotateCcw size={15} />Reset</button>
          </div>
        </div>

        <div>
          {/* robot stage: robots stay inside this box */}
          <div className="relative grid grid-cols-3 gap-2 rounded-lg p-3 bg-muted/60 border border-foreground/10" aria-hidden="true">
            {steps.map((st, i) => (
              <div key={st.who} className="flex flex-col items-center">
                <Bot tone={st.tone} label={st.who} active={step === i + 1 && motion} className={`w-12 h-14 transition-opacity duration-300 ${step === i + 1 ? 'opacity-100' : step > i + 1 ? 'opacity-70' : 'opacity-35'}`} />
                <span className="mono text-[0.68rem] uppercase mt-1">{st.who}</span>
              </div>
            ))}
          </div>
          <ol className="mt-4 space-y-2" aria-live="polite">
            {steps.map((st, i) => (
              <li key={st.who} className={`p-3 rounded-md border-l-4 ${step > i ? 'bg-background/70' : 'bg-muted/40 text-muted-foreground'}`} style={{ borderColor: step > i ? `hsl(var(--${st.tone === 'ink' ? 'primary' : st.tone === 'gold' ? 'accent' : 'signal'}))` : 'hsl(var(--border))' }}>
                <p className="mono text-xs uppercase">{i + 1}. {st.who} <span className="normal-case text-muted-foreground">— {st.does}</span></p>
                <p className="text-sm mt-1">{step > i ? outputs[i] : 'Waiting…'}</p>
              </li>
            ))}
            <li className={`p-3 rounded-md border-2 border-dashed ${step >= 4 ? 'border-foreground/50' : 'border-foreground/15 text-muted-foreground'}`}>
              <p className="mono text-xs uppercase">4. A person decides</p>
              {step === 5 ? <p className="text-sm mt-1 inline-flex items-center gap-1.5"><Check size={15} />Brief approved by a human reviewer (in this demo, you).</p>
                : step === 4 ? <button type="button" className="btn btn-ink btn-sm mt-2" onClick={() => setStep(5)} data-testid="button-agent-approve">Approve the brief</button>
                : <p className="text-sm mt-1">The workflow stops for review. Nothing is acted on automatically.</p>}
            </li>
          </ol>
        </div>
      </div>
      <p className="px-4 md:px-6 pb-5 text-xs text-muted-foreground">
        Pre-written outputs replay the documented Scout → Risk → Strategist order from the repository. The real agents call a model; this page does not.{' '}
        <Link href="/work/cloutwatch" className="link">Read the Cloutwatch case study</Link>
      </p>
    </div>
  );
}
