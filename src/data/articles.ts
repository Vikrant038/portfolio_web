export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: "systems" | "ai" | "ops";
  categoryLabel: string;
  readTime: string;
  date: string;
  tags: string[];
  excerpt: string;
  takeaways: string[];
  fullBody: string;
  url?: string;
}

export const ARTICLES: Article[] = [
  {
    id: "google-sheets-house-of-cards",
    title: "The Google Sheets House of Cards",
    subtitle: "Why spreadsheets fail as CRMs and how to rebuild them with structured MQL schemas",
    category: "systems",
    categoryLabel: "Systems Architecture",
    readTime: "6 min read",
    date: "2026",
    tags: ["Systems Architecture", "Data Pipelines", "PostgreSQL", "Python", "Spreadsheet Teardown"],
    excerpt:
      "Spreadsheet formulas are not software: they are expressions that depend on the cells they point at. How one silent VLOOKUP failure shut down eight telecallers, and why we rebuilt our lead allocation system with structured validation layers and audit trails.",
    takeaways: [
      "Spreadsheets fail silently: a broken VLOOKUP returns blank instead of raising an error, corrupting downstream pipelines without warning.",
      "Replaced live multi-sheet chained formulas with an 8-sheet structured MQL data system with immutable IDs and single-source allocation.",
      "Lifted telecaller data quality by +30–40% and expanded follow-up touches from 3 → 10 per prospect."
    ],
    fullBody: `There's a particular kind of system that works beautifully right up until the moment it doesn't. Ours was one of them.

When I joined a B2B analytics startup as a Business Analyst intern, we were running a full B2B outreach CRM on Google Sheets. Eight field agents. Two pipeline stages. A clean-looking flow: master contact sheet → allocation → agent sheets → outcomes → dashboard → and then the whole structure repeated again for the qualified-leads stage.

On a whiteboard, it was elegant. Every stage handed off to the next. Everything connected. In practice, it was a house of cards that looked fine until someone breathed on it.

### The Morning It Fell Over

I remember the morning it became impossible to ignore. Eight agents logged in to start their calls. Their sheets were empty. Not "a few contacts missing" - empty. An allocation formula had quietly decided that an entire batch of fresh contacts was "already allocated," when it wasn't. So it allocated them nothing.

One silent failure, upstream. And because every stage was chained to the previous one through live spreadsheet formulas, the failure didn't stay contained. It rolled downhill. Stage 2 broke, so stage 4 had nothing to work with. We spent the morning manually reconstructing which contact was in which state, like detectives at a crime scene where the evidence kept rewriting itself.

That was the day I stopped seeing it as "a sheet that needs fixing" and started seeing it as a system that was fragile by design.

### Why Spreadsheet Formulas Aren't Software

Spreadsheet formulas are not software. They're expressions that depend entirely on the stability of the cells they point at.

A VLOOKUP that references a column someone renamed. A QUERY that expects a date in one format and gets another. A conditional that returns a blank instead of throwing an error - so it fails silently, confidently showing you wrong numbers with a straight face.

There was no validation layer. No audit trail. No way to ask "which formula broke first?" without an hour of tab-hopping. The system had no resilience because the building blocks themselves had none.

### The Rebuild

So we rebuilt it properly over the following weeks. PostgreSQL as the single source of truth. Python sync scripts running nightly via cron - reading from the sheets, writing to the database, handling the business logic in code instead of formulas. A Streamlit dashboard so managers could actually see and control the pipeline.

1. Business rules became code, not cell references.
2. Data validation moved into Python, where it could fail loudly and early.
3. Contacts moved through clear states (fresh → in_progress → shared_story → mql_in_progress → mql_qualified) driven by database flags, not by whatever a formula happened to return.
4. The pipeline ran every night without someone babysitting it.

The fragility didn't get patched. It disappeared, because the thing that caused it - logic living in formulas - was gone.

### The Lesson

If you're running real operations on spreadsheets, here's the honest test: what happens when one formula fails silently at 6 a.m.? If the answer is "the whole thing falls over and nobody knows why," you're not running a system. You're running a house of cards. Move the logic into code before the cards fall - not after.`,
  },
  {
    id: "fifteen-hour-problem",
    title: "The 15-Hour Problem: Cutting Call Analysis to 30 Min",
    subtitle: "Engineering a multi-stage LLM evaluation pipeline with structured JSON outputs",
    category: "ai",
    categoryLabel: "AI & LLM Systems",
    readTime: "5 min read",
    date: "2026",
    tags: ["LLM Pipelines", "Gemini API", "Prompt Engineering", "Automation"],
    excerpt:
      "Sales call analysis was consuming 15–18 hours per week of manual manager time. We engineered an automated LLM pipeline (transcription ingestion → gap analysis → rubrics grading → write-back) that reduced feedback turnaround to 30 minutes.",
    takeaways: [
      "Decomposed call evaluation into discrete single-responsibility LLM prompts rather than one monolithic evaluation prompt.",
      "Enforced strict JSON schemas with defensive regex fallbacks for deterministic scorecard parsing.",
      "Delivered ~97% time savings (18 hrs → 30 mins/week) while giving reps instant, constructive objection-handling coaching."
    ],
    fullBody: `Every week, somebody on our team paid a heavy tax. It was paid in hours, and it looked like this: listen to a batch of sales calls, note what went well and what went badly, write up feedback for each caller, spot the gaps, and hand it back so people could improve.

Important work. Genuinely. Coaching is how a sales team gets better.

It also ate 15 to 18 hours a week. Eighteen hours of a capable person's time spent mostly listening, typing, and reformatting - before a single minute went into the part that actually requires a human: the coaching itself.

### What I Built

I built an automated email-feedback pipeline with Gemini & Python. The flow is straightforward to describe and was fiddly to get right:

1. Ingest call audio and transcript metadata directly from the telecaller's master sheet.
2. Normalize transcripts and run speaker diarization to separate objections from value delivery.
3. Score the call deterministically against company ICP rubrics with strict JSON schemas.
4. Run gap analysis and draft personalized objection-handling coaching notes.
5. Write the scorecard and insights straight back to the right row in the master sheet.

A weekly process that took 15–18 hours now takes around 30 minutes.

### The Honest Part: AI Replaced the Typing, Not the Thinking

The AI did not replace the coach. It replaced the transcription and drafting. The mechanical 80% - pulling the call, structuring the notes, writing a first draft, flagging the obvious gaps - that's what got automated.

The 20% that needs a human is still a human's job. Someone reviews the feedback. Someone decides what to emphasise with which caller. Someone has the actual conversation where improvement happens.

What changed isn't that humans were removed. It's that the human's 15–18 hours got redirected - away from listening-and-typing and toward coaching-and-judgment. The expensive, mechanical part shrank to 30 minutes. The valuable, human part got more room.

### A Rule of Thumb for Automation

What percentage of this task is mechanical, and what percentage needs judgment?

If a task is 80% mechanical and 20% judgment - like call feedback - it's close to a perfect automation candidate. You automate the 80%, you protect the 20%, and you give people their hours back without giving up the thinking that makes the work good.`,
  },
  {
    id: "deterministic-lead-scoring",
    title: "Why Deterministic Math Beats Stochastic LLMs for Lead Scoring",
    subtitle: "Building architecture that speaks for itself: AST parsing, mathematical curves & LLM fallbacks",
    category: "systems",
    categoryLabel: "AI Engineering",
    readTime: "7 min read",
    date: "2026",
    tags: ["Architecture", "Deterministic Systems", "Lead Scoring", "TypeScript"],
    excerpt:
      "When evaluating whether a company is an Ideal Customer Profile (ICP), stochastic LLMs give unpredictable scores for identical inputs. Here is why we built a 6-stage deterministic mathematical engine with AST parsing and transparent score breakdown.",
    takeaways: [
      "Mathematical weighting curves (sigmoid for tenure, exponential decay for recency) guarantee 100% reproducible MQL scores.",
      "LLMs are used strictly for entity extraction and unstructured text parsing, never for final numerical scoring.",
      "Engineered with 90% per-file unit test coverage and failover across Groq, Gemini, and local mock fallbacks."
    ],
    fullBody: `When you ask an LLM 'Score this lead from 1 to 100,' you might get 82 today and 68 tomorrow for the exact same data. In revenue operations, stochastic unpredictability destroys trust between marketing and sales.

There's a category of tools that promise a lot but deliver inconsistency. When it comes to understanding data or architecture, you need something that tells you what is actually there, not what it guesses might be there.

### The Hybrid Architecture

In our Lead Scoring Engine, scoring is divided strictly into two distinct tiers:

1. Unstructured Extraction (LLM-Assisted): LLMs extract company size, technology stack, and funding from messy web profiles and raw text.
2. Deterministic Math (Pure Functions): Pure TypeScript functions apply weighted scoring algorithms across 4 transparent dimensions (Data Quality, Education, Experience, Analytical Rigor).
3. Sigmoid & Decay Curves: Mathematical curves (sigmoid for tenure, exponential decay for recency) guarantee 100% reproducible MQL scores every time.

### The Verified Results

By separating entity extraction from numerical scoring, the system achieves 317 passing tests, a 90% per-file test coverage floor, and mathematical certainty without stochastic drift.

The result is a system where sales reps can click any lead and see the exact mathematical rationale behind every single point, building complete organizational confidence.`,
  },
  {
    id: "valuable-bug-on-invoice",
    title: "The Most Valuable Bug Was on the Invoice",
    subtitle: "FinOps lessons from Deep Thought: Billing audits, credit optimization & migrating to Vertex AI",
    category: "ops",
    categoryLabel: "FinOps & Cloud",
    readTime: "5 min read",
    date: "2026",
    tags: ["FinOps", "Cloud Migration", "Vertex AI", "Cost Optimization"],
    excerpt:
      "How auditing unexpected credit-card charges on external LLM APIs led us to discover $27,000 in unused Google Cloud credits, prompting a complete profiling migration to Vertex AI.",
    takeaways: [
      "Engineers must monitor financial feedback loops just as closely as error logs and server metrics.",
      "Migrated the entire AI profiling fleet to Vertex AI, eliminating recurring credit card bills.",
      "Built client-side retry budgets and token budgeting gates to prevent runaway API expenditures."
    ],
    fullBody: `Our company-profiling pipeline was working. You fed it companies, it ran, it gave you back the research. Green lights all around. By every normal measure, there was nothing to fix.

And that's exactly why what I found was easy to miss.

While I was setting the pipeline up properly, I looked at how it was running - not just whether it ran. And I noticed it was billing a credit card for every single profiling job.

Then I noticed something else: there were 27,000 free credits sitting in the Google Cloud account, completely unused. We were paying out of pocket for something we already owned. The tool worked perfectly. It was just quietly burning money to do it.

### Why Nobody Had Seen It

When a tool produces the right output, we stop looking. 'It works' is where attention ends. We almost never ask the second question: what is it costing to work, and should it cost that?

Output is visible. Cost is invisible - until someone goes looking for it. The pipeline gave us research, so everyone saw research and moved on. The line item on a card statement doesn't show up in the output. It shows up later, somewhere else, where the person using the tool never looks.

That gap - between 'it works' and 'it works efficiently' - is where money quietly leaves a business.

### The Migration Playbook

Once I'd seen it, the fix took an afternoon:

1. API Abstraction Layer: Built a unified client interface so switching underlying LLM providers required changing one environment variable.
2. Vertex AI Migration: Migrated all lead research and classification jobs to Vertex AI, unlocking 27,000 unused credits.
3. Strict Rate Limiting & Token Budgets: Implemented token governors that capped request length and halted runaways before they incurred costs.

Within a short while, around 2,000 of those free credits had been put to use through the corrected setup - credits that, under the old configuration, would have been paid for in cash on top of the free balance we were ignoring.

The technical change was trivial. The valuable part wasn't the migration. It was the noticing.`,
  },
  {
    id: "graphify-structural-context",
    title: "Graphify: Giving LLMs Persistent Structural Context",
    subtitle: "Converting codebases into queryable knowledge graphs with AST parsing and subagent extraction",
    category: "ai",
    categoryLabel: "Knowledge Graphs & RAG",
    readTime: "8 min read",
    date: "2026",
    tags: ["Knowledge Graphs", "AST Parsing", "RAG", "Multi-Agent"],
    excerpt:
      "Naive vector search loses the hierarchical topology of codebases. Graphify combines deterministic Tree-sitter AST extraction with semantic LLM extraction to generate interactive, queryable codebase knowledge graphs.",
    takeaways: [
      "Layer 1 uses local Tree-sitter AST parsing to extract functions, classes, and call hierarchies with zero token cost.",
      "Layer 2 dispatches parallel subagents to extract semantic rationale from documentation with confidence tags (EXTRACTED, INFERRED, AMBIGUOUS).",
      "Produces three artifacts: GRAPH_REPORT.md, interactive visual graph.html, and a graph.json cache for instant agent lookups."
    ],
    fullBody: `When LLM coding assistants read code via flat embeddings, they miss deep call chains, module hierarchies, and semantic intent.

Graphify converts any codebase into a persistent, queryable knowledge graph using a dual-layer extraction model:

### Layer 1 - AST Extraction (Deterministic)

For every code file, Graphify runs Tree-sitter AST parsing to extract functions, classes, imports, and call relationships. This is fully deterministic - it finds exactly what's there, nothing more. There are no probabilities, no confidence intervals, no hallucinations. A function call is a function call. An import is an import.

This layer is free. It costs nothing in API tokens because it doesn't call any LLM. It runs locally, parses your code, and builds edges from the structure itself across 20+ programming languages.

### Layer 2 - Semantic Extraction (LLM-Assisted)

For documentation, notes, and non-code files, Graphify dispatches parallel subagents that read the content and extract named concepts, relationships, and rationale. Every extracted relationship is tagged with a confidence type:

1. EXTRACTED: explicitly present in the source (import, function call, citation)
2. INFERRED: reasonably derived from structure (confidence score 0.6–0.9)
3. AMBIGUOUS: uncertain, flagged for review (confidence score 0.1–0.3)

### The Production Outputs

After a single run, Graphify produces three artifacts:
1. graph.html: Interactive visualization with Louvain community detection.
2. graph.json: Persistent knowledge graph cache that survives across agent sessions.
3. GRAPH_REPORT.md: Plain-language architectural audit highlighting god nodes and circular dependencies.`,
  },
  {
    id: "intern-to-team-lead",
    title: "Intern to Team Lead in 7 Months: The Compounding Playbook",
    subtitle: "How systems thinking, automated feedback loops, and accountability shifted my trajectory",
    category: "ops",
    categoryLabel: "Leadership & Systems",
    readTime: "7 min read",
    date: "2026",
    tags: ["Leadership", "Systems Thinking", "Career Growth", "Deep Thought"],
    excerpt:
      "At Deep Thought Analytics, I went from Business Analyst Intern to AI Generalist Specialist to Team Lead of a 6-member team. The key was never working harder at manual tasks - it was building the systems that made the entire team faster.",
    takeaways: [
      "Identify the single highest-friction bottleneck in the company, build a tool to eliminate it, and document the playbook.",
      "Transitioned from individual contributor to defining team workflows, unblocking teammates, and moderating leadership sessions.",
      "Compounding leverage: when your code saves 10 team-hours every day, your impact scales with the team."
    ],
    fullBody: `In November, I joined a B2B analytics startup as a Business Analyst intern. My days were spreadsheets - scraping data, cleaning it, allocating it. Heads-down, individual work.

By May, I was leading a team of six people across two labs.

Seven months between those two bookends. I want to be honest about what actually happened in the middle, because the clean version - 'worked hard, got promoted' - leaves out everything that was genuinely useful.

### It Wasn't Talent. It Was a Question.

I got there through a single repeated habit: every time I caught myself doing something twice, I asked: 'Can a system do this instead of me?'

That one question, asked over and over, is the whole story. It turned into a phone-number cleaner that saved two hours a day. A telecaller allocation system that killed duplicates and saved another hour and a half. An AI feedback system that took a 12-hour weekly task down to thirty minutes. Six-plus AI tools that gave the team back eight to ten hours a day.

I didn't get promoted for working harder than everyone else. I got promoted for building systems that made everyone's work lighter.

### The Question Changes When You Lead

Becoming a team lead doesn't mean doing your old job faster. It means doing a different job, and unlearning the habits that made you good at the first one.

As an individual contributor, my question was: 'How do I finish this task?'
As a lead of six, the question became: 'How do I design the workflow so the task finishes itself - and the bottleneck disappears?'

I stopped scoring my day by what I shipped and started scoring it by what the team could ship without me in the loop. I defined workflows. I reviewed work and pointed out where things were getting stuck. I traced problems back to which stage owned them, so issues had an address.

### The Skill I Didn't Expect to Build

In my last month, my job included reaching out to founders - cold - to invite them to a roundtable. For a data person who is most comfortable behind a screen, this was deeply outside my natural habitat.

By the end of the month, five founders had said yes.

Every call chipped at a fear I didn't know ran so deep. I learned to lead with their problem instead of my pitch. I learned a 'no' isn't a verdict on you - it's just a no, and there's another call to make. The most valuable thing I built in my final month wasn't a tool. It was the version of myself that can pick up the phone.

### What I'm Taking With Me

1. Most problems are system problems, not people problems.
2. Activity isn't impact - quantify what you actually moved.
3. Ship the ugly version, then iterate against reality.
4. The boring automation usually beats the flashy one.
5. Technology is an enabler, not the answer.`,
  },
];
