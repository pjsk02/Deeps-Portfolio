# Portfolio verification

Verified on 25 October 2026 against the built, prerendered portfolio, served
through the Replit preview proxy.

## Result

**189 automated browser checks passed, with no failures, retries or skipped
checks.** The portfolio typecheck and production build also passed.

### Brighter look and scroll animations (25 October 2026)

At the user's request the page background moved from cream with a grid to a
sunlit near-white (#FFFDF6, a tint of the supplied cream) with soft drifting
blue, cream and blush glows; the grid and noise textures were removed. Cards
use cream, sky-blue and blush tints from the palette, buttons are rounded, and
a skills ticker runs under the hero. Sections now rise, slide or zoom in as
they scroll into view, groups of cards arrive one after another, and the
highlighter strokes and section rules sweep across. The Motion toggle and the
device's reduce-motion setting turn all of this off, and content stays visible
without JavaScript. The palette check now expects the new light background
and browser color (#FFFDF6).

### Problem check and usability fixes (25 October 2026)

A full review of every page found and fixed:

- **Diagram text overflow.** In the food-inspection diagram, “1 row / violation”
  ran past its box. The boxes were widened; a new check confirms every label
  sits inside its box in both themes.
- **Mismatched section numbers.** The section headings said Research 04 and
  Contact 05, but the jump links said 03 and 04. “How I work” no longer carries
  a number, so headings and jump links now agree. A check enforces this.
- **Where am I?** The header now highlights the section being read (desktop
  underline; “You are here” in the phone menu) and exposes it to screen readers.
  It is off on case-study pages.
- **Copy email.** A “Copy email” button sits beside the email link, with a
  spoken confirmation and a clear message if the browser blocks copying.
- **Phone layout.** The email address now breaks after the “@” rather than
  mid-word. The “More projects” GitHub link no longer leaves its arrow on a
  line by itself.
- **Dashboard screenshots.** Each one links to the full-size image in a new
  tab, labelled “View full size”, so the charts are readable on phones.
- **Draft chapters (development preview only).** The four placeholder chapters
  are now folded into one dashed “Preview only” panel instead of filling the
  Experience section. The live site is unchanged: drafts still never ship.

All external links were rechecked: every link loaded except the four IEEE
pages and LinkedIn, which block automated visits, as before. The new
full-size image links were checked to return real images.

Lighthouse was not used to score this update. On this machine the same built
files measured very differently from one run to the next, so a score would not
be meaningful. The added code is small: about 1 KB more gzipped JavaScript.
Scroll highlighting reads stored section positions instead of measuring the
page on every scroll.

### Editable chapters (25 October 2026)

The startup, AI-learning, hackathon and organized-event chapters were added as
editable drafts inside the Experience section, with an optional résumé button.

- Development preview: all four draft groups render with “Draft” labels and no
  horizontal overflow or page errors at 320 px light, 390 px dark and 1440 px
  light. The full browser suite (167 checks) passed against the dev server with
  drafts visible.
- Production build: no draft copy appears in the prerendered HTML, and no
  résumé button renders while its URL is blank. The 14 HTTP/404/no-JavaScript
  checks passed against the production preview.
- A deliberately published placeholder entry made the build fail with a clear
  error, confirming unfinished copy cannot ship.
- No new external links or downloads were added, so none needed checking. Check
  any evidence links and the résumé once real values are entered.

### AI-learning chapter published (25 October 2026)

The chapter introduction and the Oracle Generative AI certification entry are
now published; the startup, hackathon and event drafts remain preview-only.

- Typecheck and production build passed. The prerendered homepage contains the
  introduction and certification entry and no draft copy.
- Production preview at 390 px and 1440 px in light and dark: one chapter entry,
  no draft labels and no horizontal overflow.
- The browser suite passed all 167 checks that apply to the dev server (drafts
  visible); the 14 routing/404 checks need the production preview and were
  unaffected by this content-only change.
- Evidence link: Oracle's badge page loads (HTTP 302 to the verification page)
  and names Deepthi Ramesh, issued 31 October 2025.
- Résumé: none supplied, so the button stays hidden.

### Pages and displays

- Homepage, all nine project pages and the not-found page
- Light and dark themes at 320, 360, 390, 768, 1024 and 1440 pixels wide
- An additional 320-pixel check with enlarged text and the mobile menu open
- The full game at 320 pixels with enlarged text, with table scrolling
  contained inside the panel rather than widening the page
- Touch interactions at 320×740, 390×844, 768×1024, 1024×768 and 844×390,
  in both themes, including resizing the same session to the other orientation
- Image loading, page titles, heading visibility and horizontal overflow
- Automated accessibility checks for every page in both themes
- Additional accessibility checks for the interactive workflow in both themes
- Additional accessibility checks for incorrect/correct game feedback at
  phone and tablet sizes in both themes
- Visual review of the new palette on a phone, portrait/landscape tablets and
  the dark desktop homepage
- Exact palette values, favicon color and browser theme-color synchronization,
  including persisted manual theme changes

The latest update applies the user-supplied cream, burgundy, blue, soil and Java
brown palette across the interface. Original photographs and dashboard images
are deliberately unchanged. The game groups its stage/score labels, allows
contained table scrolling for enlarged text and gives its Next button a
44-pixel minimum height.

### Behavior

- Navigation, mobile menu, Escape, focus return and the skip-to-content link
- Theme/motion persistence, system preferences and unavailable browser storage
- Both workflow samples, manual progression, automatic progression, review,
  approval and reset
- Automatic progression pauses offscreen, when document visibility is hidden
  in the test, and when motion is disabled
- An additional browser check confirmed the robots' CSS animations pause
  offscreen and resume on return
- Every game choice, feedback, stage advancement, score, reset, skip and exit
- Keyboard and touch game controls, including the Enter-key regression
- Internal links and fragment targets, previous/next case-study destinations,
  browser history, legacy redirects and unknown-route recovery
- All ten public pages without JavaScript, with distinct prerendered metadata
- Self-hosted fonts and deferred loading of optional interactive code
- No uncaught application errors observed during these checks

## External links

Sixteen unique external destinations were checked in the preceding verification
pass. Those links were not changed by this palette/responsiveness update:

| Outcome | Count | Details |
| --- | ---: | --- |
| Reachable | 11 | Nine project repositories, the subject's GitHub profile, and the River Publishers paper/PDF redirect |
| Automated access restricted | 5 | Four IEEE pages and LinkedIn |

IEEE explicitly returned its “Unusual Traffic Detected” page with HTTP 418.
LinkedIn returned HTTP 999 after its redirect. These are **not counted as
successful page loads**, and they do not establish that the links are broken.

All four IEEE DOIs, paper titles and the subject's presence in their author
lists were independently confirmed through Crossref's registered metadata.
The email link's address and URI were checked; no email was sent.

## Performance

Baseline from one Lighthouse simulated-mobile lab run before the
palette/responsiveness update (not a new Lighthouse run):

| Measure | Result |
| --- | ---: |
| Performance | 88 / 100 |
| Accessibility | 100 / 100 |
| Best practices | 100 / 100 |
| SEO | 100 / 100 |
| First contentful paint | 2.9 seconds |
| Largest contentful paint | 3.2 seconds |
| Total blocking time | 30 milliseconds |
| Cumulative layout shift | 0.001 |
| Measured initial transferred resources | 417 KiB |

The current production build's initial JavaScript bundle is about 82.3 KB
gzipped. The optional workflow
and game are separate bundles of about 2.9 KB and 2.7 KB gzipped. Fonts are served
locally, images have intrinsic dimensions, and the first view does not depend
on animation initialization.

The current stylesheet is 38.0 KB uncompressed / 8.1 KB gzipped, down from the
earlier 106.7 KB by restricting generated styles to the actual application.
No dependencies were added for the palette or responsive adjustments.
No WebGL engine or live AI request is used. The drifting background glows are
three CSS gradients moved with transforms only, and stop when motion is off.

### Retained JavaScript memory

In the preceding verification pass, after five warm-up cycles, the game was
opened, answered, reset and closed forty
more times. Garbage-collected JavaScript heap increased from approximately
3.57 MiB to 3.76 MiB. DOM node and event-listener counts stayed unchanged across
both twenty-cycle batches; the second batch retained about 59 KiB more heap.

This is a limited repeated-interaction check, **not a measurement of total
browser RAM or proof that a long-running session can never leak memory**.

## Limits and release notes

- These are Chromium tests with desktop/mobile viewport and touch emulation,
  not physical iPhone, Safari or Firefox certification.
- Lighthouse is a lab measurement through a development preview proxy, not
  real-user Core Web Vitals or a guarantee on every device and connection.
- The published site has not yet been tested. Static-host routing and headers
  should be checked after publishing; the local production-preview server
  supplies HTTP redirects while static legacy pages use HTML redirects.
- The verified published domain is still needed for canonical URLs, absolute
  social metadata and a sitemap. No old Framer or preview domain was substituted.
  See "Search and social metadata" below for what is ready.

## Search and social metadata

Checked on 25 October 2026. The portfolio has **not been published yet**, so no
live-host checks were possible.

The published address is one editable value, `publishedSiteUrl`, in the
portfolio's `src/lib/site.ts`. It is intentionally blank. When it is set, the
build generates:

- a canonical link and `og:url` for the homepage and all nine case studies
  (no trailing slash on case studies, matching the 308 redirect);
- absolute `og:image` and `twitter:image` links, plus image size and alt text;
- a `sitemap.xml` listing those ten pages, referenced from `robots.txt`;
- the person's URL and image in the structured data;
- canonical links on the three legacy redirect pages pointing to the homepage.

The not-found page never receives a canonical link and stays `noindex`.

A check build used a placeholder test domain set only for that build, not
committed. It confirmed the generated tags, sitemap and structured data. In the
production preview, client-side navigation updated canonical and `og:url` from
the homepage to a case study, removed both on an unknown route, and restored
them after returning home, with no page errors. Trailing-slash and legacy routes
returned 308 redirects. The build rejected a `.replit.dev` preview address, an
`http://` address and an address with a path. The committed default build
omits the domain-dependent tags and the sitemap.

**Still to do after publishing:** set the address, republish, then check direct
case-study URLs, legacy redirects, the 404 status, images, headers and social
previews on the live host.
- The old résumé link was broken and has been omitted; the résumé button stays
  hidden until a URL is set in `src/lib/story.ts`. The AI-learning
  chapter shows the verified Oracle certification; startup, hackathon and event
  chapters are editable drafts awaiting approved details; no achievements were
  invented to fill them.

## Reproducing the checks

See the commands in the root README. Full browser reports, screenshots, raw
link responses and Lighthouse output are generated under
`generated-artifacts/`, which is deliberately excluded from Git and publishing.
