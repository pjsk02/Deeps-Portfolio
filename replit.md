# Deepthi Ramesh — Data & AI Portfolio

A story-led portfolio for data analyst, data engineering and applied-AI roles, beginning with analyst experience and leading into projects, research and contact.

## Run & Operate

- Replit preview: use the managed `artifacts/deepthi-portfolio: web` workflow.
- `pnpm --filter @workspace/deepthi-portfolio run dev` — frontend development
- `pnpm --filter @workspace/deepthi-portfolio run build` — client assets plus prerendered HTML
- `pnpm --filter @workspace/deepthi-portfolio run serve` — preview the production build
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/scripts exec playwright test -c playwright.config.ts` — browser verification through the shared preview proxy; run against production preview for HTTP/SSR checks
- No database, authentication or AI API key is needed by this portfolio.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite, Wouter, Tailwind CSS
- Build-time rendering for all public routes; static hosting in production
- Self-hosted variable fonts and optimized local images
- The API/database and canvas scaffolds are unrelated to the portfolio's runtime and need not run.

## Where things live

- `artifacts/deepthi-portfolio/src/lib/content.ts` — approved public content and project links
- `artifacts/deepthi-portfolio/src/lib/site.ts` — route metadata, aliases and verified published-domain setting
- `artifacts/deepthi-portfolio/src/index.css` — light/dark tokens and motion rules
- `artifacts/deepthi-portfolio/src/pages/` — homepage, project pages, not-found page
- `artifacts/deepthi-portfolio/src/components/` — navigation, figures and optional interactions
- `scripts/tests/` and `scripts/qa/` — browser, accessibility, link and performance checks
- `docs/content-integrity.md` — evidence and editorial limits
- `generated-artifacts/` — ignored test results and diagnostic exports, never committed or published

## Architecture decisions

- The bot walkthrough is an explicitly labeled, deterministic illustration, not a live AI service. This avoids API costs, personal-data collection and unpredictable outputs.
- The game is optional and untimed, with a readable alternative. It must not gate the portfolio's content.
- Prerendered pages preserve useful content and distinct metadata without JavaScript. Do not replace the exact static route rewrites with a blanket SPA fallback: unknown pages should use `404.html`.
- No fabricated production URL: canonical URLs and the sitemap wait for the verified published domain.

## Product

Nine linked projects, five co-authored publications, analyst/research experience, education and direct contact links. Light/dark preferences persist; motion respects the system preference and an explicit visitor override. Optional AI walkthrough and retro pipeline game load only when needed.

## User preferences

Keep the portfolio creative and visually polished without generic AI decoration. Preserve the analyst-first story and use real evidence. Check links, redirects, displays, themes, keyboard/touch behavior and performance before presenting a release as ready.

## Gotchas

- Use artifact tools to change `artifact.toml`, never direct edits. The managed workflow supplies `PORT` and `BASE_PATH`.
- Build before using the production preview command.
- When adding a project route, update the artifact's exact static rewrites to its prerendered HTML.
- The old résumé link was broken; no replacement has been supplied. Startup, hackathon and organized-event chapters need approved facts before publication.
- `Deepthir13` is the portfolio subject's GitHub. The requested destination repository belongs to `pjsk02`; do not replace subject links with the repository owner's identity.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- The original-site research pack and audit were delivered separately and are retained in the local conversation transfer, not in the published site.
