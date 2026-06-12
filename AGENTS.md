- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- The default branch in this repo is `dev`.
- Local `main` ref may not exist; use `dev` or `origin/dev` for diffs.

## Commits and PR Titles

Use conventional commit-style messages and PR titles: `type(scope): summary`.

Valid types are `feat`, `fix`, `docs`, `chore`, `refactor`, and `test`. Scopes are optional; use the affected package or area when helpful, e.g. `core`, `nexusflow`, `tui`, `app`, `desktop`, `sdk`, or `plugin`.

Examples: `fix(tui): simplify thinking toggle styling`, `docs: update contributing guide`, `chore(sdk): regenerate types`.

## Style Guide

### General Principles

- Keep things in one function unless composable or reusable
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity
- Prefer functional array methods (flatMap, filter, map) over for loops; use type guards on filter to maintain type inference downstream
- In `src/config`, follow the existing self-export pattern at the top of the file (for example `export * as ConfigAgent from "./agent"`) when adding a new config module.

Reduce total variable count by inlining when a value is only used once.

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context.

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassignment.

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### Control Flow

Avoid `else` statements. Prefer early returns.

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Complex Logic

When a function has several validation branches or supporting details, make the main function read as the happy path and move supporting details into small helpers below it.

```ts
// Good
export function loadThing(input: unknown) {
  const config = requireConfig(input)
  const metadata = readMetadata(input)
  return createThing({ config, metadata })
}

function requireConfig(input: unknown) {
  ...
}
```

- Keep helpers close to the code they support, below the main export when that improves readability.
- Do not over-abstract simple expressions into many single-use helpers; extract only when it names a real concept like `requireConfig` or `readMetadata`.
- Do not return `Effect` from helpers unless they actually perform effectful work. Synchronous parsing, validation, and option building should stay synchronous.
- Prefer Effect schema helpers such as `Schema.UnknownFromJsonString` and `Schema.decodeUnknownOption` over manual `JSON.parse` wrapped in `Effect.try` when parsing untrusted JSON strings.
- Add comments for non-obvious constraints and surprising behavior, not for obvious assignments or control flow.

### Schema Definitions (Drizzle)

Use snake_case for field names so column names don't need to be redefined as strings.

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

## Testing

- Avoid mocks as much as possible
- Test actual implementation, do not duplicate logic into tests
- Tests cannot run from repo root (guard: `do-not-run-tests-from-root`); run from package dirs like `packages/nexusflow`.

## Type Checking

- Always run `bun typecheck` from package directories (e.g., `packages/nexusflow`), never `tsc` directly.

## NexusFlow Agent Army

This workspace includes the NexusFlow Hive described in `prompt.md`. The local implementation lives under `.opencode/`:

- Agents: `.opencode/agent/*.md`
- Commands: `.opencode/command/*.md`
- Tools: `.opencode/tool/*.ts`
- Skills: `.opencode/skills/*/SKILL.md`
- Flow reference: `.opencode/NEXUSFLOW.md`

`project-manager` is the default primary agent for complex work. It should decompose multi-domain requests into parallel tracks, use specialist agents through `task`, track work with `todowrite`, and route multi-agent summaries through `reporter`.

Configured primary orchestration agents: `project-manager`, `planner`, `reporter`.

Specialist agents include frontend (`react-specialist`, `vite-specialist`, `nextjs-specialist`, `ui-designer`, `typescript-specialist`, `testing-frontend`, `performance-specialist`, `accessibility-specialist`), backend (`nodejs-specialist`, `php-specialist`, `laravel-specialist`, `supabase-specialist`, `database-architect`, `api-architect`), Shopify, WordPress, SEO/AEO/GEO, branding, growth, GitHub, DevOps, security, and strategy divisions.

Automatic command flows are represented by command prompts such as `commit`, `changelog`, `translate`, `learn`, `rmslop`, `spellcheck`, `seo-audit`, `brand-kit`, `shopify-section`, `wp-block`, `api-spec`, `perf-report`, `content-brief`, `ad-creative`, `aeo-optimize`, and `deploy-check`.

## NexusFlow Operator Manual

### Hive Overview

NexusFlow is a local multi-agent orchestration system. `project-manager` identifies domains, creates a dependency-aware plan, spawns specialists in parallel, and sends all outputs to `reporter` for a unified final deliverable.

### Quick Reference: Agent Directory

| Agent Name | Division | Mode | Model | Triggers |
|---|---|---|---|---|
| project-manager | Orchestration | primary | nexusflow/claude-opus-4-7 | complex multi-domain work |
| planner | Orchestration | primary | nexusflow/claude-sonnet-4-6 | task planning |
| reporter | Orchestration | primary | nexusflow/claude-haiku-4-5 | aggregation |
| strategist | Orchestration | subagent | nexusflow/gpt-5.4 | strategy before planning |
| triage | GitHub | primary | nexusflow/gpt-5.4-nano | GitHub issue opened |
| duplicate-pr | GitHub | primary | nexusflow/claude-haiku-4-5 | PR/issue duplicate search |
| coder | General | subagent | default | implementation execution |
| researcher | General | subagent | default | technical research |
| tester | General | subagent | default | validation |
| react-specialist | Frontend | subagent | nexusflow/claude-sonnet-4-6 | React/TSX |
| vite-specialist | Frontend | subagent | nexusflow/gpt-5.4-nano | Vite config/build |
| nextjs-specialist | Frontend | subagent | nexusflow/claude-sonnet-4-6 | Next.js App Router |
| ui-designer | Frontend | subagent | nexusflow/claude-opus-4-7 | UI/design system |
| typescript-specialist | Frontend | subagent | nexusflow/claude-sonnet-4-6 | strict TypeScript |
| testing-frontend | Frontend | subagent | nexusflow/gpt-5.4-nano | frontend tests |
| performance-specialist | Frontend | subagent | nexusflow/claude-sonnet-4-6 | performance/Lighthouse |
| accessibility-specialist | Frontend | subagent | nexusflow/claude-haiku-4-5 | WCAG/accessibility |
| nodejs-specialist | Backend | subagent | nexusflow/claude-sonnet-4-6 | Bun/Node/Hono |
| php-specialist | Backend | subagent | nexusflow/gpt-5.4 | PHP |
| laravel-specialist | Backend | subagent | nexusflow/claude-sonnet-4-6 | Laravel |
| supabase-specialist | Backend | subagent | nexusflow/claude-sonnet-4-6 | Supabase |
| database-architect | Backend | subagent | nexusflow/claude-opus-4-7 | schemas/migrations |
| api-architect | Backend | subagent | nexusflow/claude-sonnet-4-6 | API/OpenAPI |
| shopify-theme-specialist | Shopify | subagent | nexusflow/claude-sonnet-4-6 | Liquid/theme |
| shopify-section-builder | Shopify | subagent | nexusflow/claude-sonnet-4-6 | Shopify section |
| shopify-app-developer | Shopify | subagent | nexusflow/claude-opus-4-7 | Shopify app |
| shopify-storefront-specialist | Shopify | subagent | nexusflow/claude-sonnet-4-6 | Storefront API |
| shopify-seo-optimizer | Shopify | subagent | nexusflow/gpt-5.4 | Shopify SEO |
| shopify-analytics-specialist | Shopify | subagent | nexusflow/gpt-5.4-nano | Shopify analytics |
| wordpress-theme-developer | WordPress | subagent | nexusflow/claude-sonnet-4-6 | WP theme |
| wordpress-section-builder | WordPress | subagent | nexusflow/claude-sonnet-4-6 | Gutenberg block |
| wordpress-plugin-developer | WordPress | subagent | nexusflow/claude-sonnet-4-6 | WP plugin |
| wordpress-woocommerce-specialist | WordPress | subagent | nexusflow/claude-sonnet-4-6 | WooCommerce |
| wordpress-performance-seo | WordPress | subagent | nexusflow/gpt-5.4 | WP performance/SEO |
| seo-specialist | SEO/AEO/GEO | subagent | nexusflow/claude-opus-4-7 | SEO |
| aeo-specialist | SEO/AEO/GEO | subagent | nexusflow/claude-sonnet-4-6 | AI answers |
| geo-specialist | SEO/AEO/GEO | subagent | nexusflow/claude-sonnet-4-6 | generative search |
| local-seo-specialist | SEO/AEO/GEO | subagent | nexusflow/gpt-5.4 | local SEO |
| content-seo-writer | SEO/AEO/GEO | subagent | nexusflow/claude-sonnet-4-6 | content brief |
| brand-strategist | Branding | subagent | nexusflow/claude-opus-4-7 | brand strategy |
| brand-identity-generator | Branding | subagent | nexusflow/claude-opus-4-7 | identity system |
| copywriter | Branding | subagent | nexusflow/claude-sonnet-4-6 | copy |
| brand-researcher | Branding | subagent | nexusflow/gpt-5.4 | research |
| media-buyer | Growth | subagent | nexusflow/claude-opus-4-7 | ads |
| social-media-specialist | Growth | subagent | nexusflow/claude-sonnet-4-6 | social |
| growth-hacker | Growth | subagent | nexusflow/claude-sonnet-4-6 | growth loops |
| analytics-specialist | Growth | subagent | nexusflow/gpt-5.4 | analytics |
| github-specialist | GitHub/DevOps | subagent | nexusflow/claude-sonnet-4-6 | GitHub automation |
| devops-specialist | GitHub/DevOps | subagent | nexusflow/claude-sonnet-4-6 | deploy |
| security-specialist | GitHub/DevOps | subagent | nexusflow/claude-opus-4-7 | security/auth |
| frontend-engineer | High-level Specialist | subagent | nexusflow/claude-sonnet-4-6 | React 19 / Next.js 15 |
| ecommerce-specialist | High-level Specialist | subagent | nexusflow/claude-sonnet-4-6 | Shopify / WooCommerce |
| seo-strategist | High-level Specialist | subagent | nexusflow/claude-opus-4-7 | technical/local/AI SEO |
| content-writer | High-level Specialist | subagent | nexusflow/claude-sonnet-4-6 | SEO and UX copy |
| performance-engineer | High-level Specialist | subagent | nexusflow/claude-sonnet-4-6 | CWV/Lighthouse |
| devops-engineer | High-level Specialist | subagent | nexusflow/claude-sonnet-4-6 | CI/CD and rollback |
| quality-director | Quality | primary | nexusflow/claude-opus-4-7 | final quality gate |
| prompt-engineer | Quality | subagent | nexusflow/claude-opus-4-7 | prompt architecture |

### Auto-Trigger Cheat Sheet

| Trigger Condition | Auto-action | Result |
|---|---|---|
| commit request or staged changes | `commit` | conventional commit flow |
| changelog/release notes | `changelog` | release summary |
| GitHub issue opened | `github-issue-triage` | triage and duplicate search |
| PR opened | `github-pr-review` | duplicate and docs checks |
| deploy intent | `deploy-check` | go/no-go checklist |
| SEO/ranking/keywords | `seo-triple-threat` | SEO/AEO/GEO roadmap |
| Shopify/Liquid | `shopify-full-division` | Shopify specialist flow |
| WordPress/Woo/Gutenberg | `wordpress-full-division` | WordPress specialist flow |
| slow/Lighthouse/CWV | `perf-report` | performance audit |
| security/auth/secret | `security-specialist` | security review |

### Command Reference

| Command | Model | When It Fires | Output Artifact |
|---|---|---|---|
| commit | nexusflow/kimi-k2.5 | commit request | commit message and push |
| changelog | nexusflow/gpt-5.4 | release/change request | changelog |
| translate | nexusflow/claude-opus-4-7 | docs changed | localized docs |
| learn | default | session end | AGENTS.md learnings |
| rmslop | default | output cleanup | cleaned prose/code |
| spellcheck | default | output cleanup | spelling fixes |
| seo-audit | nexusflow/claude-opus-4-7 | SEO work | SEO audit |
| brand-kit | nexusflow/claude-opus-4-7 | brand work | brand kit |
| shopify-section | nexusflow/claude-sonnet-4-6 | Shopify section | Liquid section |
| wp-block | nexusflow/claude-sonnet-4-6 | Gutenberg block | block scaffold |
| api-spec | nexusflow/claude-sonnet-4-6 | API design | openapi.yaml |
| perf-report | nexusflow/gpt-5.4 | performance issue | perf-report.md |
| content-brief | nexusflow/claude-sonnet-4-6 | keyword/content work | content-brief.md |
| ad-creative | nexusflow/claude-opus-4-7 | ads | campaign pack |
| aeo-optimize | nexusflow/claude-sonnet-4-6 | AI search | AEO plan |
| deploy-check | nexusflow/claude-haiku-4-5 | deploy | go/no-go report |

### Tool Reference

| Tool | Required Env Vars | What It Does | Output Type |
|---|---|---|---|
| github-triage | GITHUB_TOKEN, ISSUE_NUMBER | assigns issues | GitHub result |
| github-pr-search | GITHUB_TOKEN | searches PRs | search result |
| seo-audit | none | crawls page SEO basics | JSON/report |
| schema-validator | none | validates JSON-LD shape | JSON/report |
| figma-fetch | FIGMA_ACCESS_TOKEN | fetches Figma metadata/tokens | JSON |
| shopify-graphql | SHOPIFY_SHOP_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN | calls Shopify GraphQL | JSON |
| wp-cli-runner | optional WP_CLI_* | runs or dry-runs WP-CLI | JSON/report |
| keyword-research | KEYWORD_PROVIDER optional | keyword/SERP research | JSON |
| brand-color-gen | none | generates palette/tokens | JSON/report |
| meta-ads-reporter | META_ADS_ACCESS_TOKEN, META_ADS_ACCOUNT_ID | campaign metrics | JSON |
| ga4-reporter | GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_KEY | GA4 metrics | JSON |
| lighthouse-runner | local lighthouse CLI | Lighthouse metrics | JSON/report |
| github-api | GITHUB_TOKEN | typed GitHub REST helper | JSON |
| lighthouse-ci | LHCI optional | Lighthouse CI planning/audit | JSON |
| ai-search | BRAVE_SEARCH_API_KEY optional | AI/search result collection | JSON |
| shopify-api | SHOPIFY_SHOP_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN | Shopify Admin helper | JSON |

### Skill Reference

| Skill | Injected Into | Last Updated |
|---|---|---|
| effect | nodejs, database, coder, tester | 2026-06-12 |
| react | React/frontend agents | 2026-06-12 |
| nextjs | Next.js agents | 2026-06-12 |
| vite | Vite/frontend agents | 2026-06-12 |
| supabase | Supabase/backend agents | 2026-06-12 |
| laravel | Laravel/PHP agents | 2026-06-12 |
| shopify-liquid | Shopify agents | 2026-06-12 |
| wordpress | WordPress agents | 2026-06-12 |
| seo | SEO agents | 2026-06-12 |
| aeo | AEO/GEO/content agents | 2026-06-12 |
| branding | branding/copy agents | 2026-06-12 |
| bun | backend/build/test agents | 2026-06-12 |
| hono | backend/API agents | 2026-06-12 |
| drizzle | database/backend agents | 2026-06-12 |
| solidjs | app/frontend agents | 2026-06-12 |
| tauri | desktop/devops agents | 2026-06-12 |
| openapi | API agents | 2026-06-12 |
| github-actions | GitHub/DevOps agents | 2026-06-12 |
| security | security/backend/devops agents | 2026-06-12 |
| analytics | analytics/growth agents | 2026-06-12 |
| conversion | growth/copy/commerce agents | 2026-06-12 |
| desktop | desktop/devops/security agents | 2026-06-12 |
| react-19-patterns | frontend-engineer, react-specialist | 2026-06-12 |
| nextjs-app-router | frontend-engineer, nextjs-specialist | 2026-06-12 |
| shopify-sections | ecommerce-specialist, shopify-section-builder | 2026-06-12 |
| shopify-hydrogen | ecommerce-specialist, shopify-storefront-specialist | 2026-06-12 |
| woocommerce-blocks | ecommerce-specialist, wordpress-woocommerce-specialist | 2026-06-12 |
| technical-seo | seo-strategist, seo-specialist | 2026-06-12 |
| local-seo | seo-strategist, local-seo-specialist | 2026-06-12 |
| design-systems | ui-designer, frontend-engineer | 2026-06-12 |
| web-performance | performance-engineer, performance-specialist | 2026-06-12 |
| testing-strategy | tester, quality-director | 2026-06-12 |
| git-workflow | github-specialist, devops-engineer | 2026-06-12 |
| github-api-usage | github-specialist | 2026-06-12 |
| ai-search-optimisation | seo-strategist, aeo-specialist, prompt-engineer | 2026-06-12 |
| prompt-quality | prompt-engineer, quality-director | 2026-06-12 |

### Claude Enhancement Brief

The detailed handoff report for Claude lives at `.opencode/NEXUSFLOW_CLAUDE_PROMPT_BRIEF.md`. It explains the current agent inventory, subagent roles, parallel flow behavior, automatic trigger behavior, skill/tool usage, fixture expectations, quality rubrics, templates, and exact requirements for Claude to write a much stronger orchestration prompt.

### Parallel Flow Patterns

```text
A Complex Multi-Domain: user -> project-manager -> parallel specialists -> reporter
B GitHub Issue: issue -> triage + duplicate-pr
C PR Docs: PR -> duplicate-pr -> translate -> optional deploy-check
D Session Learning: milestone -> learn -> AGENTS.md
E Content Delivery: output -> rmslop -> spellcheck
F Shopify Deployment: Shopify + SEO + analytics + media -> reporter
G WordPress Brand Site: WordPress + brand + SEO -> reporter
H SEO/AEO/GEO: seo + aeo + geo + local -> reporter
I Full SaaS: frontend + backend + brand + SEO + devops + security -> reporter
```

### Onboarding Checklist

- [ ] Install Bun matching `packageManager` in root `package.json`.
- [ ] Run `bun install`.
- [ ] Configure required provider and integration credentials.
- [ ] Read `.opencode/NEXUSFLOW.md`.
- [ ] Run `bun typecheck` from package directories, never root tests.
- [ ] Use conventional commit titles through the `commit` command.

### Glossary

- Hive: the complete NexusFlow multi-agent system.
- Division: a group of related specialist agents.
- Subagent: a scoped specialist spawned by `task`.
- Flow: a named parallel/sequential orchestration pattern.
- Skill: domain instructions loaded by an agent.
- Auto-trigger: declarative condition that fires an agent, command, or flow.
- Quality gate: validation an agent must run before handoff.
- Output contract: required artifacts an agent must return.
