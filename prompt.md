# Codex Task: Implement NexusFlow vNext Orchestration Upgrade

You are Codex operating inside the NexusFlow repository.

Your job is not to merely describe an orchestration upgrade. Your job is to inspect the existing repository, modify the necessary files, add missing configuration, improve automatic routing, strengthen subagent spawning, enforce parallel execution rules, wire skills/tools/templates/rubrics/fixtures into validation, and leave the repo in a PR-ready state.

Do not produce generic recommendations. Make concrete code/config/prompt/file changes.

---

## Mission

Upgrade NexusFlow so it can automatically:

1. Detect user intent.
2. Match intent to `auto_triggers`.
3. Select the correct named flow.
4. Spawn independent agents in parallel.
5. Keep dependent tasks sequential.
6. Scope context per agent.
7. Load only relevant skills per agent.
8. Restrict tools per agent.
9. Produce named artifacts.
10. Validate important artifacts through `quality-director`.
11. Consolidate final output through `reporter`.
12. Block vague, unsupported, unvalidated, or generic output.
13. Validate tools, skills, fixtures, templates, and rubrics.
14. Handle timeouts, empty outputs, conflicting outputs, missing agents, missing skills, missing tools, and missing credentials.

---

## Repository Source of Truth

Before editing anything, inspect the repo.

You must inspect at minimum:

* `.opencode/nexusflow.jsonc`
* `.opencode/agents/`
* `.opencode/skills/`
* `.opencode/fixtures/`
* `.opencode/templates/`
* `.opencode/rubrics/`
* any existing NexusFlow orchestration prompt files
* any test files related to routing, agent loading, fixtures, templates, or rubrics
* package/test/build configuration files

If a path does not exist, create it only if it is required for the upgrade and consistent with the repo structure.

Do not invent agent names as verified. Enumerate actual local files where possible.

---

## Known NexusFlow Inventory From Enhancement Brief

Existing loader-visible agents before this upgrade: `50`.

New high-level agents expected for the next enhancement layer: `8`.

Known primary/orchestration agents:

* `project-manager`
* `planner`
* `reporter`
* `quality-director`

Known strategy/prompting agents:

* `strategist`
* `prompt-engineer`

Known general subagents:

* `coder`
* `researcher`
* `tester`

Known specialist divisions:

* frontend
* backend
* ecommerce
* Shopify
* WordPress
* SEO/AEO/GEO
* branding
* growth
* analytics
* GitHub
* DevOps
* security

New high-level agents:

| Agent                  | Purpose                                         | Primary Collaborators                                                              |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| `frontend-engineer`    | React 19 and Next.js 15 App Router engineering  | `ui-designer`, `performance-engineer`, `testing-frontend`, `quality-director`      |
| `ecommerce-specialist` | Shopify Liquid/Hydrogen and WooCommerce blocks  | `seo-strategist`, `content-writer`, `performance-engineer`, `analytics-specialist` |
| `seo-strategist`       | Technical/local/AEO/GEO search strategy         | `content-writer`, `performance-engineer`, `quality-director`                       |
| `content-writer`       | SEO long-form and UX copy                       | `seo-strategist`, `copywriter`, `aeo-specialist`                                   |
| `performance-engineer` | Core Web Vitals and Lighthouse remediation      | `frontend-engineer`, `devops-engineer`, `quality-director`                         |
| `devops-engineer`      | CI/CD, deployment, rollback, infrastructure     | `github-specialist`, `security-specialist`, `performance-engineer`                 |
| `quality-director`     | Final quality validation and rubric enforcement | all specialists, `reporter`                                                        |
| `prompt-engineer`      | Agent/system prompt architecture                | `quality-director`, `project-manager`, all specialist owners                       |

If these agents already exist, update them carefully instead of duplicating them.

If an expected agent is missing, create it only if the repo convention supports agent files. Otherwise add a routing substitution rule to the orchestration config.

---

## Available Skills

Broad skills:

* `effect`
* `react`
* `nextjs`
* `vite`
* `supabase`
* `laravel`
* `shopify-liquid`
* `wordpress`
* `seo`
* `aeo`
* `branding`
* `bun`
* `hono`
* `drizzle`
* `solidjs`
* `tauri`
* `openapi`
* `github-actions`
* `security`
* `analytics`
* `conversion`
* `desktop`

Tactical skills:

* `react-19-patterns`
* `nextjs-app-router`
* `shopify-sections`
* `shopify-hydrogen`
* `woocommerce-blocks`
* `technical-seo`
* `local-seo`
* `design-systems`
* `web-performance`
* `testing-strategy`
* `git-workflow`
* `github-api-usage`
* `ai-search-optimisation`
* `prompt-quality`

Implement validation that prevents agents from loading irrelevant skills.

Rules:

* Each agent task must explicitly list `skills_loaded`.
* No agent may load more than 5 skills unless `project-manager` approves.
* If no skill applies, record `skills_loaded: []`.
* If a required skill is missing, record a skill gap artifact and degrade validation.

---

## Available Tools

Tools:

* `github-triage`
* `github-pr-search`
* `seo-audit`
* `schema-validator`
* `figma-fetch`
* `shopify-graphql`
* `wp-cli-runner`
* `keyword-research`
* `brand-color-gen`
* `meta-ads-reporter`
* `ga4-reporter`
* `lighthouse-runner`
* `github-api`
* `lighthouse-ci`
* `ai-search`
* `shopify-api`

Implement tool-gating rules:

* Each agent receives only the tools required for its task.
* Credentialed tools require a credential check before use.
* Missing credentials must produce a `blocked-tool` artifact.
* Tool outputs must not be fabricated.
* Final reports must separate observed tool evidence, inferred conclusions, and unverified assumptions.

---

## Files And Changes To Implement

Implement the upgrade in the repo using the existing project conventions.

At minimum, update or create the following logical pieces:

### 1. NexusFlow Orchestration Prompt

Create or update the core orchestration prompt used by NexusFlow.

The prompt must include:

* role and mission
* source-of-truth hierarchy
* agent inventory policy
* division map
* skills registry
* tool registry
* intent detection rules
* trigger-to-flow map
* flow-to-agent map
* concurrency policy
* dependency graph policy
* context-scoping policy
* artifact contracts
* agent handoff templates
* `quality-director` review rules
* `reporter` output templates
* failure handling rules
* validation gates
* anti-generic-output policy
* examples for at least 10 user prompts
* acceptance tests

The prompt must be strict, operational, and testable.

### 2. `.opencode/nexusflow.jsonc`

Enhance `auto_triggers`.

Add or strengthen triggers for these intent classes:

* `shopify_ecommerce_launch`
* `woocommerce_build`
* `nextjs_react_build`
* `frontend_component`
* `technical_seo`
* `local_seo`
* `aeo_geo_content`
* `content_strategy`
* `design_system`
* `branding`
* `analytics_reporting`
* `github_pr_review`
* `github_triage`
* `devops_deployment`
* `incident_rollback`
* `security_review`
* `prompt_architecture`
* `general_research`
* `general_coding`
* `quality_review_only`

Each trigger must include:

* matching signals
* excluded signals
* priority
* selected flow
* fallback agent
* required validation
* expected artifact type

### 3. Named Flows

Define or update named flows:

* `shopify-full-deployment`
* `react-component-build`
* `github-pr-review`
* `local-seo-audit`
* `ai-search-content-build`
* `woocommerce-checkout-build`
* `design-token-propagation`
* `incident-rollback`
* `technical-seo-remediation`
* `analytics-reporting`
* `security-review`
* `prompt-system-upgrade`

Each flow must define:

* entry condition
* initial coordinator
* parallel wave 1
* parallel wave 2 if needed
* sequential validation
* reporter handoff
* tools
* skills
* required artifacts
* rubrics
* templates
* blocking conditions
* fallback behavior

### 4. Agent Handoff Templates

Add reusable handoff templates for:

* `project-manager` to specialist
* specialist to specialist
* specialist to `quality-director`
* `quality-director` to specialist revision
* `quality-director` to `reporter`
* `reporter` to final user answer

Each template must include:

* `task_id`
* `flow`
* `owner_agent`
* `objective`
* `inputs`
* `dependencies`
* `allowed_tools`
* `skills_loaded`
* `required_artifact`
* `quality_gate`
* `handoff_to`
* `risks`
* `status`

### 5. Artifact Contracts

Add or update artifact schemas for:

* SEO brief
* content brief
* component spec
* performance report
* PR review comment
* Shopify section spec
* design token proposal
* incident report
* schema validation report
* Lighthouse report
* deployment plan
* rollback plan
* security review
* prompt quality report
* final report
* blocked-tool artifact
* skill-gap artifact
* degraded-validation artifact

Each artifact must include:

* `artifact_id`
* `artifact_type`
* `owner_agent`
* `flow`
* `task_id`
* `status`
* `inputs_used`
* `tools_used`
* `skills_loaded`
* `assumptions`
* `output`
* `evidence`
* `risks`
* `quality_gate`
* `handoff_to`

### 6. Quality Director Rules

Implement rules that make `quality-director` score outputs:

* `0–59`: fail, block final output
* `60–74`: weak, revision required
* `75–84`: acceptable with caveats
* `85–94`: strong
* `95–100`: exceptional

`quality-director` must check:

* correctness
* specificity
* evidence
* user constraint satisfaction
* tool-result grounding
* skill usage
* rubric compliance
* artifact completeness
* implementation feasibility
* missing risks
* contradictions
* final user usefulness

Block final output when:

* output is generic
* required artifacts are missing
* claims are unsupported
* tool results are fabricated
* validation evidence is missing
* rubric score is failing
* specialist disagreement is unresolved
* deployment/rollback lacks safeguards
* SEO/content lacks search intent and structure
* frontend lacks implementation/testing evidence
* DevOps lacks rollback/credential awareness

### 7. Reporter Templates

Add or update reporter templates for:

* implementation report
* SEO report
* content deliverable
* PR review
* launch report
* incident report
* quality-only review

Reporter must:

* merge validated artifacts
* preserve caveats
* expose blocked items
* include validation evidence
* avoid internal chatter
* avoid overstating confidence
* never hide failed checks

### 8. Fixtures

Ensure fixtures exist in `.opencode/fixtures/` for:

1. Shopify product launch
2. Next.js page build
3. Local SEO audit
4. Design system token propagation
5. GitHub PR performance review
6. AI search FAQ article
7. WooCommerce checkout block
8. Incident rollback

Each fixture must assert:

* input prompt
* detected intent
* selected flow
* expected parallel agents
* expected sequential agents
* expected skills
* expected tools
* expected artifacts
* expected quality rubric
* expected reporter template

### 9. Templates

Ensure templates exist in `.opencode/templates/` for:

* SEO brief
* content brief
* component spec
* performance report
* PR review comment
* Shopify section spec
* design token proposal
* incident report

Do not create empty placeholder templates. Each template must be useful and enforce professional structure.

### 10. Rubrics

Ensure rubrics exist in `.opencode/rubrics/` for:

* frontend
* SEO
* content
* design
* ecommerce
* DevOps
* prompt quality

Each rubric must include:

* scoring categories
* pass/fail thresholds
* evidence requirements
* automatic block conditions
* revision instructions

---

## Required Concurrency Model

Encode and enforce:

* Small task: 1–2 agents.
* Medium task: 3–5 agents.
* Large product task: 6–10 agents.
* Full launch task: 10–15 agents.
* Maximum safe parallel fan-out: 15 agents.
* If more than 15 agents are needed, force summarization through `project-manager` before spawning more.

Rules:

* No duplicate ownership.
* No unscoped fan-out.
* No agent receives full context unless necessary.
* No agent may self-expand scope.
* Independent nodes run in parallel.
* Dependent nodes wait for required artifacts.

---

## Dependency Graph Requirement

Every complex flow must create a DAG with:

* `task_id`
* `owner_agent`
* `inputs`
* `outputs`
* `dependencies`
* `tools`
* `skills`
* `artifact_name`
* `quality_gate`
* `status`

Rules:

* Cyclic dependencies are invalid.
* Missing dependency output blocks downstream execution.
* Conflicting upstream outputs route to `quality-director`.
* DAG must be preserved in orchestration trace.

---

## Required Example Behaviors

Implement enough routing/config/tests so these examples pass.

### Example 1: Shopify Product Launch

Prompt:

> Launch a new product on Shopify with SEO copy, schema markup, and performance audit.

Expected:

* Intent: `shopify_ecommerce_launch`
* Flow: `shopify-full-deployment`
* Parallel agents:

  * `ecommerce-specialist`
  * `shopify-theme-specialist`
  * `shopify-section-builder`
  * `seo-strategist`
  * `content-writer`
  * `performance-engineer`
  * `shopify-analytics-specialist`
* Tools:

  * `shopify-graphql`
  * `shopify-api`
  * `seo-audit`
  * `schema-validator`
  * `lighthouse-runner`
* Skills:

  * `shopify-sections`
  * `technical-seo`
  * `web-performance`
  * `conversion`
* Quality:

  * ecommerce rubric
  * SEO rubric
  * content rubric
  * performance/frontend rubric
* Final:

  * launch report

### Example 2: Next.js Performance Page

Prompt:

> Build a Next.js App Router page with streaming RSC, Suspense, and Lighthouse score >= 90.

Expected:

* Intent: `nextjs_react_build`
* Flow: `react-component-build`
* Parallel agents:

  * `frontend-engineer`
  * `nextjs-specialist`
  * `ui-designer`
  * `performance-engineer`
  * `typescript-specialist`
* Sequential agents:

  * `testing-frontend`
  * `quality-director`
* Skills:

  * `react-19-patterns`
  * `nextjs-app-router`
  * `web-performance`
  * `testing-strategy`
* Final:

  * implementation report with validation evidence

### Example 3: GitHub PR Performance Review

Prompt:

> Review this PR for performance regressions and post inline comments.

Expected:

* Intent: `github_pr_review`
* Flow: `github-pr-review`
* Parallel agents:

  * `github-specialist`
  * `performance-engineer`
  * `quality-director`
* Tools:

  * `github-api`
  * `github-pr-search`
  * `lighthouse-ci`
* Output:

  * inline review comments
  * quality score
  * merge/block decision

Add at least 7 more examples covering:

* local SEO audit
* AI search FAQ article
* WooCommerce checkout block
* design token propagation
* incident rollback
* technical SEO remediation
* prompt architecture upgrade

---

## Failure Handling To Implement

### Timeouts

* record timed-out agent
* preserve partial artifact
* continue independent branches
* escalate incomplete dependency to `project-manager`
* retry, substitute, or block based on dependency criticality

### Empty Output

* reject artifact
* retry once with stricter scoped prompt
* substitute nearest capable agent if retry fails
* block affected flow section if no substitute exists

### Conflicting Outputs

* route to `quality-director`
* compare evidence
* prefer tool-grounded or repo-grounded output
* request revision from weaker agent
* report unresolved conflict if not resolvable

### Missing Credentials

* do not call credentialed tool
* create `blocked-tool` artifact
* provide manual fallback
* continue non-credentialed work
* never fabricate tool output

### Missing Agent

* use nearest equivalent
* record substitution
* lower confidence
* send substitution to `quality-director`

### Missing Skill

* continue only if non-critical
* record skill gap
* mark quality gate degraded
* escalate if task depends on skill

### Missing Tool

* use equivalent fallback only if actually equivalent
* otherwise create manual checklist
* mark validation degraded

---

## Anti-Generic Output Enforcement

Implement a blocking rule.

A final output must fail if it:

* lacks named flow
* lacks named agents
* lacks task IDs for complex work
* lacks artifacts
* lacks validation evidence
* lacks quality score
* lacks tool/skill decisions
* ignores user constraints
* gives broad advice instead of executable output
* uses placeholders
* claims validation without validation basis

---

## Tests And Validation

After editing files, run the repo’s available checks.

Use the project’s existing package manager and test conventions.

Run relevant commands such as, depending on repo structure:

* install check if needed
* typecheck
* lint
* unit tests
* fixture validation tests
* routing tests
* schema validation tests

Do not assume commands. Inspect package files first.

If no tests exist, add minimal tests or validation scripts that verify:

1. fixtures load
2. templates load
3. rubrics load
4. required flows exist
5. required triggers exist
6. required artifact contracts exist
7. concurrency policy exists
8. example prompts route to expected flows

At least 8 acceptance tests must correspond to the fixture scenarios.

---

## Deliverables

When complete, provide a concise implementation report with:

1. Files inspected.
2. Files changed.
3. New files created.
4. Routing improvements implemented.
5. Agents/flows added or updated.
6. Skills/tools validation implemented.
7. Fixtures/templates/rubrics validation implemented.
8. Tests added or updated.
9. Commands run and results.
10. Known limitations.
11. Any degraded validation due to missing agents, missing credentials, missing tools, or missing repo conventions.

---

## Hard Constraints

* Do not fabricate tool results.
* Do not fabricate that tests passed.
* Do not delete existing configuration unless replacing it with a verified equivalent.
* Preserve existing repo style.
* Prefer small, reviewable changes.
* Keep JSON/JSONC valid.
* Keep Markdown prompt files structured and readable.
* Every new flow must be testable.
* Every generic fallback must record degraded validation.
* Final state must be PR-ready.

Begin by inspecting the repository structure, then implement the upgrade.
