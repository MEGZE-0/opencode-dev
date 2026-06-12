# NexusFlow Claude Prompt Brief

Use this report to write a super detailed enhancement prompt for Claude. The goal is to make NexusFlow automatic routing, subagent spawning, parallel execution, skill loading, and quality validation much stronger.

## Current Hive Inventory

### Agent Counts

- Existing loader-visible agents before this brief: 50
- New high-level agents added for the next enhancement layer: 8
- Current local agent files:
  - Primary/orchestration: `project-manager`, `planner`, `reporter`, `quality-director`
  - Strategy/prompting: `strategist`, `prompt-engineer`
  - General subagents: `coder`, `researcher`, `tester`
  - Specialist divisions: frontend, backend, ecommerce, Shopify, WordPress, SEO/AEO/GEO, branding, growth, analytics, GitHub, DevOps, security

### New High-Level Agents Added

| Agent | Purpose | Primary Collaborators |
|---|---|---|
| `frontend-engineer` | React 19 and Next.js 15 App Router engineering | `ui-designer`, `performance-engineer`, `testing-frontend`, `quality-director` |
| `ecommerce-specialist` | Shopify Liquid/Hydrogen and WooCommerce blocks | `seo-strategist`, `content-writer`, `performance-engineer`, `analytics-specialist` |
| `seo-strategist` | Technical/local/AEO/GEO search strategy | `content-writer`, `performance-engineer`, `quality-director` |
| `content-writer` | SEO long-form and UX copy | `seo-strategist`, `copywriter`, `aeo-specialist` |
| `performance-engineer` | Core Web Vitals and Lighthouse remediation | `frontend-engineer`, `devops-engineer`, `quality-director` |
| `devops-engineer` | CI/CD, deployment, rollback, infrastructure | `github-specialist`, `security-specialist`, `performance-engineer` |
| `quality-director` | Final quality validation and rubric enforcement | all specialists, `reporter` |
| `prompt-engineer` | Agent/system prompt architecture | `quality-director`, `project-manager`, all specialist owners |

## Skills Available

The hive now has broad skills and tactical skills.

Broad skills include:

- `effect`
- `react`
- `nextjs`
- `vite`
- `supabase`
- `laravel`
- `shopify-liquid`
- `wordpress`
- `seo`
- `aeo`
- `branding`
- `bun`
- `hono`
- `drizzle`
- `solidjs`
- `tauri`
- `openapi`
- `github-actions`
- `security`
- `analytics`
- `conversion`
- `desktop`

Tactical skills added for automatic specialist use:

- `react-19-patterns`
- `nextjs-app-router`
- `shopify-sections`
- `shopify-hydrogen`
- `woocommerce-blocks`
- `technical-seo`
- `local-seo`
- `design-systems`
- `web-performance`
- `testing-strategy`
- `git-workflow`
- `github-api-usage`
- `ai-search-optimisation`
- `prompt-quality`

## Tool Inventory

Existing and new tools:

- `github-triage`
- `github-pr-search`
- `seo-audit`
- `schema-validator`
- `figma-fetch`
- `shopify-graphql`
- `wp-cli-runner`
- `keyword-research`
- `brand-color-gen`
- `meta-ads-reporter`
- `ga4-reporter`
- `lighthouse-runner`
- `github-api`
- `lighthouse-ci`
- `ai-search`
- `shopify-api`

## How Agents Are Automatically Called

Automatic calling is described in `.opencode/nexusflow.jsonc` through `auto_triggers`.

### Trigger Flow

1. User message or workspace event arrives.
2. `auto_triggers` are checked by priority.
3. Matching trigger fires one of:
   - a command, such as `seo-audit`
   - a single agent, such as `security-specialist`
   - a named flow, such as `shopify-full-division`
4. `project-manager` decomposes complex work into task IDs.
5. Independent agents are spawned in parallel with scoped prompts.
6. Dependent agents wait for required outputs.
7. `quality-director` should review important outputs against rubrics.
8. `reporter` merges final outputs into one user-facing deliverable.

### Example: Shopify Product Launch

Prompt:

`Launch a new product on Shopify with SEO copy, schema markup, and performance audit`

Expected automatic behavior:

1. Trigger: Shopify/ecommerce intent.
2. Flow: `shopify-full-deployment`.
3. Parallel agents:
   - `ecommerce-specialist`
   - `shopify-theme-specialist`
   - `shopify-section-builder`
   - `seo-strategist`
   - `content-writer`
   - `performance-engineer`
   - `shopify-analytics-specialist`
4. Tools:
   - `shopify-graphql`
   - `shopify-api`
   - `seo-audit`
   - `schema-validator`
   - `lighthouse-runner`
5. Skills:
   - `shopify-sections`
   - `technical-seo`
   - `web-performance`
   - `conversion`
6. Review:
   - `quality-director` scores against ecommerce, SEO, content, performance rubrics.
7. Final:
   - `reporter` produces one launch report.

### Example: Next.js Performance Page

Prompt:

`Build a Next.js App Router page with streaming RSC, Suspense, and Lighthouse score >= 90`

Expected automatic behavior:

1. Trigger: React/Next.js/performance intent.
2. Flow: `react-component-build`.
3. Parallel agents:
   - `frontend-engineer`
   - `nextjs-specialist`
   - `ui-designer`
   - `performance-engineer`
   - `typescript-specialist`
4. Sequential validation:
   - `testing-frontend`
   - `quality-director`
5. Skills:
   - `react-19-patterns`
   - `nextjs-app-router`
   - `web-performance`
   - `testing-strategy`
6. Final:
   - `reporter` outputs implementation summary and validation evidence.

### Example: PR Review

Prompt:

`Review this PR for performance regressions and post inline comments`

Expected automatic behavior:

1. Trigger: GitHub PR review intent.
2. Flow: `github-pr-review`.
3. Parallel agents:
   - `github-specialist`
   - `performance-engineer`
   - `quality-director`
4. Tools:
   - `github-api`
   - `github-pr-search`
   - `lighthouse-ci`
5. Output:
   - inline review comments
   - quality score
   - merge/block decision

## Parallel Capacity Model

The current system can run many agents together conceptually. Recommended concurrency rules for Claude to encode:

- Small task: 1-2 agents.
- Medium task: 3-5 agents.
- Large product task: 6-10 agents.
- Full launch task: 10-15 agents.
- Maximum safe parallel fan-out: 15 agents before summarization is required.

Parallel agents should only receive scoped context:

- what they own
- what they must output
- dependencies
- tools allowed
- skills to load
- quality gates

They should not all receive the entire full user request unless absolutely needed.

## Artifacts Added For Stronger Prompting

### Fixtures

Location: `.opencode/fixtures/`

Fixtures describe expected automatic routing for 8 scenarios:

1. Shopify product launch
2. Next.js page build
3. Local SEO audit
4. Design system token propagation
5. GitHub PR performance review
6. AI search FAQ article
7. WooCommerce checkout block
8. Incident rollback

### Templates

Location: `.opencode/templates/`

Templates define expected professional output structures for:

- SEO brief
- content brief
- component spec
- performance report
- PR review comment
- Shopify section spec
- design token proposal
- incident report

### Rubrics

Location: `.opencode/rubrics/`

Rubrics define quality scoring for:

- frontend
- SEO
- content
- design
- ecommerce
- DevOps
- prompt quality

## What Claude Should Enhance Next

Claude should write a new super prompt that forces all future agents to:

1. Automatically detect intent and map it to triggers.
2. Select the right flow.
3. Spawn all independent agents in parallel.
4. Keep dependent tasks sequential.
5. Load only relevant skills per agent.
6. Use only relevant tools per agent.
7. Produce named artifacts.
8. Send important outputs to `quality-director`.
9. Send all final work to `reporter`.
10. Block generic, vague, unsupported, or unvalidated output.

## Claude Prompt Requirements

The prompt Claude writes must include:

- A full inventory of agents and subagents.
- A division map.
- A trigger-to-flow map.
- A flow-to-agent map.
- A max-concurrency policy.
- A dependency graph policy.
- A context-scoping policy.
- Agent handoff templates.
- Quality-director review rules.
- Reporter output templates.
- Examples for at least 10 user prompts.
- Failure handling for timeouts, empty outputs, conflicting outputs, and missing credentials.
- Validation gates for tools, skills, fixtures, templates, and rubrics.

## Copy/Paste Instruction For Claude

Write a super detailed NexusFlow orchestration prompt that upgrades automatic agent calling, subagent spawning, parallel execution, skill loading, tool use, artifact creation, quality review, and final reporting. Use this report as source material. Make the prompt strict, operational, testable, and impossible to satisfy with generic output.
