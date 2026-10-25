/**
 * Editable chapters: startup collaborations, AI learning, hackathons and
 * organized events, plus the public résumé link.
 *
 * How to edit
 * - Replace the bracketed placeholder text in an entry with approved facts.
 * - Change its `status` from 'draft' to 'published' to show it on the live site.
 * - Draft entries appear only in the development preview, marked “Draft”.
 *   Production builds leave them out.
 * - A published entry that still contains [bracketed placeholder] text, or is
 *   missing a title, role, dates or contribution, stops the build with an error
 *   so unfinished copy cannot be published by accident.
 * - Delete any draft you do not need. Add more by copying an entry with a new id.
 * - `outcomes`, `evidence` and `tools` are optional. Only list outcomes you can
 *   support; leave the array empty otherwise.
 */

export type ChapterKind = 'startup' | 'ai-learning' | 'hackathon' | 'event';

export type ChapterEntry = {
  id: string;
  kind: ChapterKind;
  status: 'draft' | 'published';
  title: string;
  role: string;
  org?: string;
  dates: string;
  summary: string;
  contributions: string[];
  outcomes?: string[];
  evidence?: { label: string; url: string }[];
  tools?: string[];
};

export const chapterKinds: { kind: ChapterKind; label: string }[] = [
  { kind: 'startup', label: 'Startup collaborations' },
  { kind: 'ai-learning', label: 'AI learning' },
  { kind: 'hackathon', label: 'Hackathons' },
  { kind: 'event', label: 'Events I organized' },
];

export const chapterIntro = {
  title: 'Beyond the analyst role',
  lede: 'Alongside the pipelines, models and dashboards of my analyst work, I have been building toward generative AI: learning how large language model applications are designed, grounded in data and evaluated.',
  status: 'published' as 'draft' | 'published',
};

export const chapters: ChapterEntry[] = [
  {
    id: 'startup-1',
    kind: 'startup',
    status: 'draft',
    title: '[Startup or product name]',
    role: '[Role]',
    org: '[Organization, if different from the title]',
    dates: '[Mon YYYY — Mon YYYY]',
    summary: '[What the team was building and the question you helped answer.]',
    contributions: ['[Specific thing you built, analyzed or led]', '[Another contribution]'],
    outcomes: [],
    evidence: [{ label: '[Evidence link label]', url: 'https://example.com/replace-me' }],
    tools: ['[Tool]'],
  },
  {
    id: 'ai-learning-oci-genai',
    kind: 'ai-learning',
    status: 'published',
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    role: 'Certified professional',
    org: 'Oracle',
    dates: 'Oct 2025',
    summary: 'A professional-level Oracle certification in building large language model applications with the OCI Generative AI service, taking my data work into generative AI.',
    contributions: [
      'Earned the credential covering large language model fundamentals and the OCI Generative AI service.',
      'Certification scope includes retrieval-augmented generation, semantic search, vector databases and LangChain for building, tracing, evaluating and deploying LLM applications.',
    ],
    outcomes: [],
    evidence: [
      {
        label: 'Verify on Oracle',
        url: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=94DB3368AD5F73CE6F8DDAAD2F2832D8DE8CE84ACAC08A1F54C9D780CC5D382A',
      },
    ],
    tools: ['OCI Generative AI', 'LangChain', 'Vector search'],
  },
  {
    id: 'hackathon-1',
    kind: 'hackathon',
    status: 'draft',
    title: '[Hackathon name]',
    role: '[Your role on the team]',
    dates: '[Mon YYYY]',
    summary: '[The problem your team tackled.]',
    contributions: ['[What you personally built or decided]'],
    outcomes: [],
    evidence: [],
    tools: [],
  },
  {
    id: 'event-1',
    kind: 'event',
    status: 'draft',
    title: '[Event name]',
    role: '[Organizer / co-organizer]',
    dates: '[Mon YYYY]',
    summary: '[Who the event was for and what it covered.]',
    contributions: ['[What you organized or ran]'],
    outcomes: [],
    evidence: [],
    tools: [],
  },
];

/**
 * Public résumé. Use either a full https:// URL or a file placed in
 * `public/` (for example 'resume.pdf'). Leave `url` empty to hide the button.
 */
export const resume = {
  url: '',
  label: 'Download résumé',
};

const placeholder = /\[[^\]]+\]/;
const showDrafts = import.meta.env.DEV;

function assertPublishable(e: ChapterEntry) {
  const required = [e.title, e.role, e.dates, e.summary, ...e.contributions];
  const all = [...required, e.org ?? '', ...(e.outcomes ?? []), ...(e.tools ?? []), ...(e.evidence ?? []).flatMap((x) => [x.label, x.url])];
  if (!e.title.trim() || !e.role.trim() || !e.dates.trim() || e.contributions.length === 0)
    throw new Error(`Published chapter "${e.id}" needs a title, role, dates and at least one contribution.`);
  if (all.some((s) => placeholder.test(s)) || (e.evidence ?? []).some((x) => x.url.includes('example.com')))
    throw new Error(`Published chapter "${e.id}" still contains placeholder text or links.`);
}

chapters.filter((e) => e.status === 'published').forEach(assertPublishable);
if (chapterIntro.status === 'published' && placeholder.test(chapterIntro.lede))
  throw new Error('The published chapter introduction still contains placeholder text.');

export const visibleChapters = chapters.filter((e) => e.status === 'published' || showDrafts);
export const showChapterIntro = chapterIntro.status === 'published' || showDrafts;

export const resumeHref = resume.url
  ? /^https?:\/\//.test(resume.url) ? resume.url : `${import.meta.env.BASE_URL}${resume.url.replace(/^\//, '')}`
  : '';
