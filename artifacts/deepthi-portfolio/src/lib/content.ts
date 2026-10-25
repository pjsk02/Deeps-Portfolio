export const BASE = import.meta.env.BASE_URL;
export const asset = (p: string) => `${BASE}${p.replace(/^\//, '')}`;

export const profile = {
  name: 'Deepthi Ramesh',
  email: 'ramesh.dee@northeastern.edu',
  github: 'https://github.com/Deepthir13',
  linkedin: 'https://www.linkedin.com/in/deepthiramesh23/',
};

export type Evidence = 'observed' | 'reported' | 'synthetic' | 'illustrative';
export const evidenceLabel: Record<Evidence, string> = {
  observed: 'Explore the implementation',
  reported: 'Project documentation',
  synthetic: 'Synthetic / modeled data',
  illustrative: 'Illustrative demo',
};

export const experience = [
  {
    id: 'align',
    role: 'Data Analyst',
    org: 'Align Associates',
    dates: 'Jun 2023 — May 2024',
    lede: 'Operational analysis for commercial and finance leadership.',
    points: [
      'Analyzed operational data for commercial and finance leadership.',
      'Built SQL queries, Python anomaly-detection workflows and Power BI dashboards.',
      'Translated stakeholder needs into reproducible transformations and KPI models.',
      'Documented assumptions and worked across finance, commercial and operations.',
    ],
    tools: ['SQL', 'T-SQL', 'Python', 'pandas', 'scikit-learn', 'Power BI', 'Power Query', 'Azure DevOps', 'Excel'],
  },
  {
    id: 'vit',
    role: 'Research and Development Analyst',
    org: 'VIT Chennai',
    dates: 'Jan 2023 — Feb 2024',
    lede: 'Research data preparation, modeling and evaluation.',
    points: [
      'Prepared data and built machine-learning pipelines for research.',
      'Investigated factors with feature engineering and statistical analysis.',
      'Validated data with SQL and explained findings with Excel and R visualizations.',
    ],
    tools: ['Python', 'SQL', 'R', 'Excel', 'scikit-learn'],
  },
];

export const education = [
  { school: 'Northeastern University', program: "Master's in Information Systems", place: 'Boston' },
  { school: 'VIT Chennai', program: "Bachelor's in Computer Science and Engineering, specializing in Artificial Intelligence and Robotics", place: 'Chennai' },
];

export type Section = { h: string; body: string[] };
export type Project = {
  slug: string;
  n: string;
  title: string;
  original: string;
  category: string;
  tier: 'featured' | 'supporting' | 'archive';
  question: string;
  summary: string;
  source: string;
  sourceLabel: string;
  tools: string[];
  evidence: Evidence[];
  context?: string;
  sections: Section[];
  limits: string[];
  reviewed: string[];
};

export const projects: Project[] = [
  {
    slug: 'food-inspections',
    n: '01',
    title: 'Making food-inspection data comparable',
    original: 'Health Standards Compliance & Inspection Analytics Pipeline',
    category: 'Data engineering',
    tier: 'featured',
    question: 'How do you compare risk when two cities record inspections differently?',
    summary: 'Chicago and Dallas inspection data brought into one analytics pipeline: normalization, a dimensional model and BI outputs.',
    source: 'https://github.com/Deepthir13/Health-Standards-Compliance-Inspection-Analytics-Pipeline-',
    sourceLabel: 'Inspection pipeline repository on GitHub',
    tools: ['Snowflake', 'Azure Data Factory', 'Databricks', 'SQL', 'Power BI'],
    evidence: ['reported'],
    sections: [
      { h: 'The mismatch', body: [
        'Two cities, two shapes of the same idea. The repository describes roughly 290K Chicago rows and 79K Dallas rows, with Dallas spreading its data across 114 columns. Before anyone can ask "which restaurants are riskier," the records have to mean the same thing.',
         'These input sizes come from the project README. Source rows are not the same as unique inspections or violations; the model keeps those units separate.' ] },
      { h: 'Deciding the grain', body: [
        'The central modeling choice is one row per violation rather than one row per inspection. A single inspection can carry many violations; collapsing them early hides exactly the detail a risk comparison needs. Inspection-level and violation-level counts should never be added together.' ] },
      { h: 'The pipeline', body: [
        'Azure Data Factory moves the raw city extracts, transformation logic normalizes violation categories and results, and a dimensional model in Snowflake gives Power BI a consistent shape to report from.' ] },
    ],
    limits: ['Public-data project, rather than an operational inspection service.', 'Input sizes are documented in the repository; inspection and violation counts use different grains.'],
    reviewed: ['Repository README', 'Repository tree', 'Original portfolio description'],
  },
  {
    slug: 'glowmetric',
    n: '02',
    title: 'Choosing better campaign metrics',
    original: 'GlowMetric',
    category: 'Data analysis',
    tier: 'featured',
    question: 'Which campaign signals are useful enough to support a spending recommendation?',
    summary: 'Real YouTube API data, synthetic TikTok data and modeled spend combined in a SQL and Power BI analysis with an executive readout.',
    source: 'https://github.com/Deepthir13/GlowMetrics',
    sourceLabel: 'GlowMetrics repository on GitHub',
    tools: ['Python', 'SQLite', 'SQL', 'Power BI'],
    evidence: ['synthetic', 'reported'],
    context: 'A fictional-brand analytical challenge, not an employer or client engagement. The data is a mix of observed YouTube API data, synthetic TikTok data and modeled spend.',
    sections: [
      { h: 'Measurement before dashboards', body: [
        'The most useful part of this project is the discipline about what each number is: which values are observed, which are synthetic, which are modeled, and which metrics are only proxies for what a brand actually cares about.' ] },
      { h: 'What got built', body: [
        'A SQL feature layer, a measurement framework, a three-page Power BI dashboard and an executive readout. The dashboard pages are shown below exactly as exported.' ] },
      { h: 'Reading the recommendation in context', body: [
        'The efficiency comparisons and budget recommendation belong to a simulated scenario. Separating observed data from assumptions makes the recommendation easier to question, reproduce and improve. It is not a claim of realized savings or causal campaign lift.' ] },
    ],
    limits: ['Fictional brand; observed, synthetic and modeled inputs are combined.', 'Budget changes are scenario recommendations, not realized savings.', 'Original dashboard annotations are preserved; the CPE ratio and scorecard footer counts need reconciliation with the displayed values.'],
    reviewed: ['Repository README', 'Repository tree', 'Three dashboard exports'],
  },
  {
    slug: 'cloutwatch',
    n: '03',
    title: 'From creator data to a decision brief',
    original: 'Cloutwatch',
    category: 'Applied AI',
    tier: 'featured',
    question: 'How can analysis, risk checks and synthesis become a usable workflow?',
    summary: 'A creator-investment platform prototype with analytics and a Scout → Risk → Strategist agent workflow.',
    source: 'https://github.com/Deepthir13/Cloutwatch',
    sourceLabel: 'Cloutwatch repository on GitHub',
    tools: ['TypeScript', 'Next.js', 'Recharts', 'LLM agents', 'Streaming responses'],
    evidence: ['observed'],
    context: 'An applied-AI prototype exploring how distinct agent roles can make a recommendation easier to inspect.',
    sections: [
      { h: 'Three roles, one hand-off', body: [
        'The agent code defines named functions that each call a model with distinct inputs and prompts. Scout gathers and describes the creator signal. Risk looks for what could go wrong or what is missing. Strategist turns both into a recommendation.' ] },
      { h: 'Why split the work', body: [
         'Separating the steps makes each output inspectable. A reviewer can see what the risk pass flagged before deciding whether to use the strategy. The walkthrough below makes that review step explicit.' ] },
      { h: 'Around the agents', body: [
        'The project also covers analytics views, ROI reporting and meeting-intelligence features described in the README, built in Next.js with Recharts and streamed responses.' ] },
    ],
    limits: ['Prototype: server data is held in memory and resets on restart.', 'The portfolio walkthrough uses sample data and pre-written outputs, not live model calls.', 'Financial results and production use are outside this case study.'],
    reviewed: ['Repository README', 'Repository tree', 'lib/agents.ts'],
  },
  {
    slug: 'trip-sync',
    n: '04',
    title: 'Coordinating a group trip with AI',
    original: 'TripSync AI',
    category: 'Applied AI',
    tier: 'supporting',
    question: 'Where should a multi-agent planner use rules instead of a model?',
    summary: 'Group travel planning with specialized agent roles, shared preferences, budget checks and negotiation.',
    source: 'https://github.com/Deepthir13/TripSync-AI',
    sourceLabel: 'TripSync AI repository on GitHub',
    tools: ['TypeScript', 'Agent roles', 'Streaming progress'],
    evidence: ['observed'],
    sections: [
      { h: 'Specialists, not one oracle', body: [
        'Source constants define specialized roles for a group trip. Logistics and budget components are described as deterministic heuristics, which is the interesting decision: arithmetic and constraints stay in code, judgment calls go to a model.' ] },
    ],
    limits: ['Logistics and budget checks use deterministic heuristics, rather than treating every task as an LLM call.', 'Fairness is a design objective to evaluate, not a guaranteed outcome.'],
    reviewed: ['Repository README', 'Repository tree', 'shared/const.ts'],
  },
  {
    slug: 'lease-lens',
    n: '05',
    title: 'Grounding answers in a lease and state law',
    original: 'Lease Lens',
    category: 'Retrieval and AI',
    tier: 'supporting',
    question: 'Can an assistant keep "what my lease says" separate from "what the law says"?',
    summary: 'A retrieval-based lease assistant with separate document and state-law context.',
    source: 'https://github.com/Deepthir13/lease-lens',
    sourceLabel: 'Lease Lens repository on GitHub',
    tools: ['Python', 'ChromaDB', 'Local models', 'Retrieval'],
    evidence: ['observed'],
    sections: [
      { h: 'Two sources, kept apart', body: [
        'The reviewed retrieval code queries ChromaDB directly and keeps lease and state-law context separate, with source formatting so answers can point back to where they came from. The README describes a local-model-oriented application, and the repository includes test code.' ] },
    ],
    limits: ['Research prototype, not legal advice. Check answers against the original documents and qualified advice.', 'Local-model-oriented design; privacy depends on configuration and deployment.'],
    reviewed: ['Repository README', 'Repository tree', 'app/rag.py', 'tests/test_rag.py'],
  },
  {
    slug: 'ecommerce-funnel',
    n: '06',
    title: 'Understanding an e-commerce conversion funnel',
    original: 'E-Commerce Sales Analysis',
    category: 'Data engineering and analytics',
    tier: 'supporting',
    question: 'Where do shoppers drop out between viewing and buying?',
    summary: 'A Databricks, PySpark and Delta workflow with dimensional models, Spark SQL and funnel analytics.',
    source: 'https://github.com/Deepthir13/E-Commerce-Sales-Analysis',
    sourceLabel: 'E-commerce sales analysis repository on GitHub',
    tools: ['Databricks', 'PySpark', 'Delta Lake', 'Spark SQL', 'Looker Studio'],
    evidence: ['reported'],
    sections: [
      { h: 'Layers, then a funnel', body: [
        'Raw events move through Delta layers into dimensional models, and Spark SQL turns them into funnel stages a commercial team can read in Looker Studio.' ] },
    ],
    limits: ['Project implementation and setup are available in the repository.', 'Funnel results depend on the event definitions and the population included at each stage.'],
    reviewed: ['Repository README', 'Repository tree'],
  },
  {
    slug: 'cloud-bi',
    n: '07',
    title: 'From public data to a BI pipeline',
    original: 'End-to-End Data Analytics & Cloud BI Pipeline',
    category: 'Data engineering',
    tier: 'supporting',
    question: 'What has to happen between a raw public dataset and a dashboard someone can trust?',
    summary: 'An Alteryx, Azure Data Factory, Snowflake and Tableau analytics pipeline built on public data.',
    source: 'https://github.com/Deepthir13/End-to-End-Data-Analytics-Cloud-BI-Pipeline-',
    sourceLabel: 'Cloud BI pipeline repository on GitHub',
    tools: ['Alteryx', 'Azure Data Factory', 'Snowflake', 'SQL', 'Tableau'],
    evidence: ['reported'],
    sections: [
      { h: 'Prep, load, explain', body: [
        'Alteryx handles cleaning and preparation, ADF moves the data into Snowflake, and Tableau presents it. The repository includes Seattle pet-license and NYPD-related artifacts.' ] },
    ],
    limits: ['The repository contains separate public-dataset examples; their results should be interpreted separately.', 'This case study describes the preparation-to-reporting architecture.'],
    reviewed: ['Repository README', 'Repository tree', 'Original portfolio description'],
  },
  {
    slug: 'media-metadata',
    n: '08',
    title: 'Organizing complex media metadata',
    original: 'Media Content Insights & Metadata Analytics Platform',
    category: 'Data engineering',
    tier: 'archive',
    question: 'How do you model a title with many genres, languages and people?',
    summary: 'IMDb ingestion and multi-valued field normalization for metadata analytics.',
    source: 'https://github.com/Deepthir13/Media-Content-Insights-Metadata-Analytics-Platform-',
    sourceLabel: 'Media metadata repository on GitHub',
    tools: ['Azure Data Factory', 'Snowflake', 'Tableau'],
    evidence: ['reported'],
    sections: [{ h: 'Multi-valued fields', body: ['The README describes splitting multi-valued fields into proper relationships so counts by genre or person stay honest.'] }],
    limits: ['Repository scale figures describe input data; overlapping rows should not be interpreted as unique titles or people.'],
    reviewed: ['Repository README', 'Repository tree'],
  },
  {
    slug: 'supply-chain',
    n: '09',
    title: 'Investigating supply-chain delays',
    original: 'Supply Chain Delay Analysis',
    category: 'Data analysis and machine learning',
    tier: 'archive',
    question: 'Which orders are likely to breach their delivery window, and why?',
    summary: 'Python, regression, clustering and Excel analysis of a public Kaggle supply-chain dataset.',
    source: 'https://github.com/Deepthir13/Supply-Chain-Delay-Analysis',
    sourceLabel: 'Supply-chain delay analysis repository on GitHub',
    tools: ['Python', 'Random Forest', 'Clustering', 'Excel'],
    evidence: ['reported'],
    sections: [{ h: 'SLA breaches', body: ['SLA breach analysis, a regression model for delay and clustering of order patterns, with Excel outputs. Evaluation values are README-reported.'] }],
    limits: ['Public Kaggle dataset; model evaluation is documented in the repository.', 'Estimated delay costs and scenario recommendations are not realized customer savings.'],
    reviewed: ['Repository README', 'Repository tree'],
  },
];

export const publications = [
  { id: 'employee-attrition', short: 'Employee attrition factors', title: 'Evaluating Employee Attrition And Its Factors Using Machine Learning Approaches', venue: 'IEEE NMITCON 2023', doi: '10.1109/NMITCON58196.2023.10276069', url: 'https://ieeexplore.ieee.org/abstract/document/10276069', angle: 'Business-facing predictive analysis.' },
  { id: 'diabetes', short: 'Feature selection for diabetes prediction', title: 'A Novel Meta-heuristic Hybrid Machine learning Model for disseminating the factors corresponding to Type II Diabetes with devised clinical trials', venue: 'IEEE ICITIIT 2024', doi: '10.1109/ICITIIT61487.2024.10580444', url: 'https://ieeexplore.ieee.org/abstract/document/10580444', angle: 'Feature selection and model evaluation. Paper-reported results, not clinical deployment.' },
  { id: 'fake-news', short: 'Fake-news classification', title: 'Analysis of Online Fake News Using Machine Learning Techniques', venue: 'IEEE ICETITE 2024', doi: '10.1109/ic-ETITE58242.2024.10493794', url: 'https://ieeexplore.ieee.org/abstract/document/10493794', angle: 'Text classification and information quality.' },
  { id: 'train-occupancy', short: 'Weather-aware train occupancy', title: 'Predicting and Evaluating Train Occupancy in Belgium using Weather Data by developing Ensemble Stacking Classifier', venue: 'ICRTAC 2023 · IEEE Xplore', doi: '10.1109/ICRTAC59277.2023.10480805', url: 'https://ieeexplore.ieee.org/abstract/document/10480805', angle: 'Combining contextual data with prediction.' },
  { id: 'customer-feedback-rpa', short: 'Automating customer-feedback analysis', title: 'Customer Feedback Automation and Classification using Sentiment Analysis, Robotic Process Automation and Uipath', venue: 'ICRTDA 2023 · River Publishers', doi: null, url: 'https://www.riverpublishers.com/downloadchapter.php?file=RP_9788770040723C175.pdf', angle: 'Automation connected to a customer-feedback workflow.' },
];

export const capabilities = [
  { verb: 'Analyze', items: ['SQL', 'Python', 'pandas', 'Statistics', 'R', 'Excel'], proof: 'glowmetric' },
  { verb: 'Build data systems', items: ['Azure Data Factory', 'Snowflake', 'Databricks / PySpark', 'Dimensional modeling'], proof: 'food-inspections' },
  { verb: 'Explain', items: ['Power BI', 'Tableau', 'KPI definitions', 'Executive readouts'], proof: 'glowmetric' },
  { verb: 'Automate & experiment', items: ['Machine learning', 'UiPath RPA', 'Retrieval', 'Agent workflows'], proof: 'cloutwatch' },
];
