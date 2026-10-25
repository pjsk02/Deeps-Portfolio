import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="wrap py-20 md:py-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center" aria-labelledby="nf">
      <div>
        <p className="kicker">Error 404 · row not found</p>
        <h1 id="nf" className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">This join <em className="italic text-primary">returned nothing.</em></h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-lg">The page you asked for has no matching key. It may have moved, or the link had a typo.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ink" data-testid="link-404-home"><ArrowLeft size={16} />Back to the homepage</Link>
          <a href={`${import.meta.env.BASE_URL}#work`} className="btn btn-line" data-testid="link-404-work">Browse projects</a>
        </div>
      </div>
      <pre className="mono text-sm panel p-5 overflow-x-auto" aria-hidden="true">{`SELECT page
FROM   site
WHERE  url = :requested;

-- 0 rows
-- suggestion: try "/" or "/#work"`}</pre>
    </section>
  );
}
