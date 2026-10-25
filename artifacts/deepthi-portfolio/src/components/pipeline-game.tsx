import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'wouter';
import { RotateCcw, SkipForward, X } from 'lucide-react';

type Round = { prompt: string; rows: string[][]; choices: { t: string; ok: boolean; why: string }[] };

const rounds: Round[] = [
  {
    prompt: 'Two cities, one column. How do you handle the result values?',
    rows: [['city', 'result'], ['CHI', 'Pass w/ Conditions'], ['DAL', 'PASS-COND'], ['CHI', 'Fail']],
    choices: [
      { t: 'Map both vocabularies to one shared set of categories', ok: true, why: 'Same meaning, same label. Now the two cities can be compared.' },
      { t: 'Keep them as-is; the dashboard can sort it out', ok: false, why: 'The dashboard would count "Pass w/ Conditions" and "PASS-COND" as different outcomes.' },
      { t: 'Drop the Dallas rows', ok: false, why: 'That removes the comparison the question asked for.' },
    ],
  },
  {
    prompt: 'One inspection lists three violations. What should one row represent?',
    rows: [['insp_id', 'violations'], ['8812', '#3, #18, #41']],
    choices: [
      { t: 'One row per inspection, violations in a text field', ok: false, why: 'Counting violation types later would mean parsing text again and again.' },
      { t: 'One row per violation, linked to its inspection', ok: true, why: 'The right grain. Violation counts stay honest, and inspections can still be rolled up.' },
      { t: 'One row per restaurant', ok: false, why: 'Too coarse: every inspection’s detail disappears.' },
    ],
  },
  {
    prompt: 'The same row appears twice after loading. What first?',
    rows: [['city', 'insp_id', 'viol_id'], ['CHI', '8812', '3'], ['CHI', '8812', '3'], ['CHI', '8812', '18']],
    choices: [
      { t: 'Delete every row that looks similar', ok: false, why: 'Fuzzy deletion can remove real repeat inspections.' },
      { t: 'Ignore it — duplicates average out', ok: false, why: 'Duplicates inflate failure counts; they do not average out.' },
      { t: 'Deduplicate on city + inspection + violation, then log removals', ok: true, why: 'Remove the repeated violation 3, but keep violation 18. The key must match the grain; an inspection-only key would lose valid detail.' },
    ],
  },
];

type Props = { onExit: () => void };

export default function PipelineGame({ onExit }: Props) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const done = i >= rounds.length;
  const r = rounds[Math.min(i, rounds.length - 1)];

  useEffect(() => { box.current?.focus(); }, [i]);

  const choose = (n: number) => {
    if (pick !== null || done) return;
    setPick(n);
    if (r.choices[n].ok) setScore((s) => s + 1);
  };
  const next = () => { setPick(null); setI((x) => Math.min(rounds.length, x + 1)); };
  const reset = () => { setPick(null); setScore(0); setSkipped(false); setI(0); };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onExit(); return; }
    if (done || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[1-3]$/.test(e.key)) {
      e.preventDefault();
      choose(Number(e.key) - 1);
    }
    // Native buttons handle their own Enter key. Do not advance twice through
    // both the bubbling keydown and the button's generated click.
    if (e.key === 'Enter' && pick !== null && e.target === box.current) {
      e.preventDefault();
      next();
    }
  };

  return (
    <div ref={box} tabIndex={-1} onKeyDown={onKey} className="crt rounded-xl p-4 md:p-6 pixel outline-none border-4" role="region" aria-label="Fix the pipeline game" data-testid="widget-pipeline-game">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest">
        <span className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="whitespace-nowrap">Fix the pipeline</span>
          <span className="whitespace-nowrap">· {done ? 'complete' : `stage ${i + 1}/${rounds.length}`}</span>
          <span className="whitespace-nowrap">· score {score}</span>
        </span>
        <span className="game-accent">Synthetic example rows</span>
      </div>

      {!done ? (
        <div className="mt-4" aria-live="polite">
          <p className="text-base md:text-lg">&gt; {r.prompt}</p>
          <div className="mt-3 max-w-full overflow-x-auto" role="region" aria-label="Scrollable inspection example" tabIndex={0}>
            <table className="text-xs md:text-sm border game-line">
              <caption className="sr-only">Synthetic inspection rows for stage {i + 1}</caption>
              <thead><tr>{r.rows[0].map((c) => <th key={c} scope="col" className="px-2 py-1 text-left font-normal game-accent border-r game-line">{c}</th>)}</tr></thead>
              <tbody>{r.rows.slice(1).map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci} className="px-2 py-1 border-r game-line">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-2">
            {r.choices.map((c, n) => {
              const state = pick === null ? '' : c.ok ? 'game-correct' : pick === n ? 'game-incorrect' : 'opacity-50';
              return (
                <button key={n} type="button" onClick={() => choose(n)} disabled={pick !== null} data-testid={`button-game-choice-${n + 1}`}
                  className={`game-choice text-left px-3 py-3 min-h-[48px] border game-line text-sm ${state}`}>
                  [{n + 1}] {c.t}
                </button>
              );
            })}
          </div>
          {pick !== null && (
            <div className="mt-4 p-3 border border-dashed game-line text-sm">
              <p>{r.choices[pick].ok ? 'GOOD CALL.' : 'NOT QUITE.'} {r.choices[pick].why}</p>
              {!r.choices[pick].ok && <p className="mt-1 opacity-80">Better: {r.choices.find((c) => c.ok)!.t}.</p>}
              <button type="button" onClick={next} className="mt-3 px-3 py-2 game-action font-medium" data-testid="button-game-next">{i + 1 < rounds.length ? 'Next stage [Enter]' : 'See result [Enter]'}</button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 text-sm md:text-base" aria-live="polite">
          <p className="text-lg">&gt; {skipped ? 'SOLUTION PREVIEW.' : `PIPELINE CLEAN. ${score}/${rounds.length} first-try calls.`}</p>
          <p className="mt-2 opacity-90">Shared categories, the right grain, a logged dedup step: the same moves behind the food-inspection project.</p>
          <ol className="mt-3 list-decimal pl-5 space-y-2">{rounds.map((round) => <li key={round.prompt}>{round.choices.find((choice) => choice.ok)?.t}.</li>)}</ol>
          <Link href="/work/food-inspections" className="inline-block mt-3 underline underline-offset-4">See the real inspection pipeline</Link>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-1 px-3 py-2 border game-line" data-testid="button-game-reset"><RotateCcw size={13} />Reset</button>
        {!done && <button type="button" onClick={() => { setPick(null); setSkipped(true); setI(rounds.length); }} className="inline-flex min-h-11 items-center gap-1 px-3 py-2 border game-line" data-testid="button-game-skip"><SkipForward size={13} />Skip to result</button>}
        <button type="button" onClick={onExit} className="inline-flex min-h-11 items-center gap-1 px-3 py-2 border game-line" data-testid="button-game-exit"><X size={13} />Exit game [Esc]</button>
        <span className="self-center opacity-70">Keys 1–3 choose · no timer · no sound</span>
      </div>
    </div>
  );
}
