# Deepthi Ramesh · Data & AI

A personal portfolio built around the questions behind the work: operational
analysis, trustworthy data pipelines, applied-AI workflows and research.

## What is included

- Analyst-first experience narrative and nine directly addressable case studies
- Five co-authored publications with original source links
- Light/dark themes and a persistent motion preference
- A lightweight, clearly labeled Scout → Risk → Strategist walkthrough
- An optional keyboard/touch pipeline game and a readable non-game alternative
- Prerendered public pages that remain useful without JavaScript
- Self-hosted fonts, optimized images and no runtime AI/backend dependency

## Development

Use Node.js 24 and pnpm 10.

```sh
pnpm install
pnpm --filter @workspace/deepthi-portfolio run dev
```

On Replit, start the existing portfolio workflow instead; it provides the port
and base path. In a normal local checkout, the development server defaults to
port 5173.

```sh
pnpm run typecheck
pnpm --filter @workspace/deepthi-portfolio run build
pnpm --filter @workspace/deepthi-portfolio run serve
```

The production output is `artifacts/deepthi-portfolio/dist/public`.
The other workspace scaffolds do not need to run for this portfolio.

## Verification

Browser tests use the shared Replit preview on port 80. Run them against the
portfolio's production-preview command to check prerendering and HTTP routing.

```sh
pnpm --filter @workspace/scripts exec playwright test -c playwright.config.ts
pnpm --filter @workspace/scripts exec node qa/external-links.mjs
pnpm --filter @workspace/scripts exec node qa/performance.mjs
```

On Replit the tests use the installed Chromium binary. Outside Replit, install a
Playwright Chromium browser and adjust the test base URL to your running server.
Generated reports and screenshots stay in the ignored `generated-artifacts/`
directory.

## Publishing

Publish the static output, not the development server. The artifact configuration
maps each public project route to its own generated HTML and supplies a custom
404 page. The portfolio does not require database credentials or an AI API key.

After the real published URL is known, paste it into the single editable
`publishedSiteUrl` value in the portfolio's `src/lib/site.ts` (for example
`'https://your-portfolio.replit.app'`) and republish. The build then adds
canonical URLs, `og:url`, absolute `og:image`/`twitter:image` links, a
`sitemap.xml` and its `robots.txt` reference. A build-time `VITE_SITE_URL`
value overrides the setting for check builds without committing an address.

The build rejects addresses that are not plain `https://` site origins and
rejects preview or local hosts, so a preview URL cannot be substituted. Do not
use the old Framer domain either. While the value is blank, these
domain-dependent tags and the sitemap are simply omitted.

## Content

Edit the portfolio's `src/lib/content.ts`. Startup collaborations, AI learning,
hackathons, organized events and the résumé link are edited in
`src/lib/story.ts`: replace the bracketed draft text, then change an entry's
`status` to `'published'`. Drafts appear only in the development preview, and
the build stops if a published entry still contains placeholders. Keep the subject's GitHub identity,
`Deepthir13`, distinct from the destination repository owner's identity.

See [content and evidence guidelines](docs/content-integrity.md). In particular,
GlowMetric is a fictional-brand exercise with mixed data, and the interactive
AI walkthrough is not live model execution. Do not add unverified business
results, invented startup details or a broken résumé link.

Font licenses are included in the portfolio's `public/licenses/` directory.
