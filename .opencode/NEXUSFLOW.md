# NexusFlow Hive Technical Reference

## Architecture Diagram

```text
User message
  |
  v
Auto triggers + project-manager
  |
  +-- Orchestration: project-manager, planner, strategist
  |
  +-- Frontend: react, vite, nextjs, ui, typescript, testing, performance, accessibility
  +-- Backend: nodejs, php, laravel, supabase, database, api
  +-- Shopify: theme, sections, app, storefront, seo, analytics
  +-- WordPress: theme, sections, plugin, woocommerce, performance-seo
  +-- SEO/AEO/GEO: seo, aeo, geo, local-seo, content-seo
  +-- Branding: strategy, identity, copy, research
  +-- Growth: media, social, growth, analytics
  +-- GitHub/DevOps/Security: github, devops, security
  |
  v
reporter
  |
  v
Final unified deliverable
```

## Agent Lifecycle

1. A user message, workspace event, or file change is checked against `auto_triggers` in `.opencode/nexusflow.jsonc`.
2. Matching triggers select an agent, command, or named flow.
3. `project-manager` parses the request, identifies domains, emits `task_plan.md`, and assigns specialists.
4. Independent specialist tasks run in parallel through `task`; dependent tasks wait for their prerequisite artifacts.
5. Each specialist applies its skill context, produces its output contract, and runs quality gates.
6. Failed or empty subagent output is retried once with a narrowed prompt.
7. `reporter` receives all outputs, reconciles conflicts, marks gaps as `[PENDING]`, and chooses the right output template.
8. Final output is cleaned by the output-cleanup flow when applicable.

## Adding A New Agent

1. Create `.opencode/agent/[agent-name].md` for primary or specialist agents, or `.opencode/agents/[agent-name].md` for legacy-style subagents.
2. Include frontmatter: `mode`, `model`, `color`, and `tools` or `permission`.
3. Add sections: Identity & Scope, Responsibilities Checklist, Output Contract, Quality Gates, Collaboration Protocol.
4. Create or reference a skill under `.opencode/skills/`.
5. Register route conditions in `auto_triggers` or `flows` when it should run automatically.
6. Add the agent to the root `AGENTS.md` directory table.
7. Run the loader count check from `packages/nexusflow`.

## Adding A New Command

1. Create `.opencode/command/[command-id].md`.
2. Include frontmatter: `description`, `agent`, `model`, and `subtask`.
3. Write the command as an SOP with numbered steps, required tools, expected artifacts, and validation.
4. Add trigger rules in `.opencode/nexusflow.jsonc` when the command should auto-fire.
5. Add it to the command table in `AGENTS.md`.

## Adding A New Tool

1. Create `.opencode/tool/[tool-id].ts`.
2. Import `tool` from `@nexusflow/plugin`.
3. Import shared helpers from `./nexusflow-tool-utils`.
4. Include a `dryRun` argument where external calls or writes may happen.
5. Load credentials with `loadCredential` and return structured missing-credential errors.
6. Use `httpClient` for HTTP calls so retries, timeout, and errors are consistent.
7. Return structured JSON output.
8. Register the tool in `.opencode/nexusflow.jsonc`.
9. Validate by importing every `.opencode/tool/*.ts` module.

## Adding A New Skill

1. Create `.opencode/skills/[skill-name]/SKILL.md`.
2. Include frontmatter: `name`, `title`, `version`, `last-updated`, `description`, `applies-to`.
3. Add required sections: Core Concepts, Conventions & Standards, Patterns & Recipes, Anti-Patterns, Interoperability Notes, Debugging Reference.
4. Add at least five runnable examples and five wrong/correct anti-patterns.
5. Reference the skill in relevant agents.

## Debugging Parallel Flows

1. Check `task_plan.md` for assigned task IDs, dependencies, and expected artifacts.
2. Identify which agent failed by matching the missing artifact or `[PENDING]` marker.
3. Retry only the failed specialist with the original scoped prompt plus the missing output contract.
4. If two agents conflict, send both outputs to `reporter` with a conflict-resolution directive.
5. If a tool failed, import the module directly and check credential/env output before rerunning the full flow.

## Performance Tuning

- Use Opus-class models for orchestration, deep strategy, security, database architecture, brand identity, and complex UI.
- Use Sonnet-class models for implementation-heavy specialist tasks.
- Use Haiku/nano agents for narrow reporting, triage, analytics summaries, and repeatable checks.
- Keep subagent prompts scoped to their domain and expected artifact.
- Summarize large source files before passing them to multiple agents.
- Prefer one `reporter` aggregation pass instead of every agent restating the full context.

## Flow Catalog

| Flow | Shape |
|---|---|
| github-issue-triage | `triage` + `duplicate-pr` in parallel |
| github-pr-review | `duplicate-pr`, then `translate` when docs changed |
| seo-triple-threat | `seo-specialist` + `aeo-specialist` + `geo-specialist` + `local-seo-specialist`, aggregate with `reporter` |
| shopify-full-division | Shopify theme, section, SEO, analytics, aggregate with `reporter` |
| wordpress-full-division | WordPress theme, section, performance/SEO, aggregate with `reporter` |
| react-component-build | React, TypeScript, UI, accessibility, then frontend testing |
| shopify-full-deployment | Shopify + media + analytics launch flow |
| wordpress-brand-site | WordPress + brand + SEO launch flow |
| full-saas-build | Frontend + backend + brand + SEO + DevOps + security |
| output-cleanup | `rmslop`, then `spellcheck` |
