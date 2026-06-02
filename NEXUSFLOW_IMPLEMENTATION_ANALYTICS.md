# NexusFlow Implementation Analytics

Date: 2026-06-02

## Executive Summary

This pass implements a validated NexusFlow feature slice across branding, config compatibility, autonomous routing scaffolding, creator tooling, Monaco editor scaffolding, Hermes UI styling, package identifier rewrites, dependency installation, SDK regeneration, and focused validation.

The codebase is not fully rebranded end-to-end yet. A source audit still finds 794 legacy `OpenCode` / `opencode` hits under primary source directories. Most remaining hits fall into categories that need staged migrations or external-service decisions: provider IDs, public URLs, CLI command names, storage keys, database/API names, localized translations, docs/prompts, installer paths, and test fixtures.

## Completed

- Installed workspace dependencies with Bun `1.3.14`; cache/temp were redirected to `E:\bun-cache` and `E:\bun-tmp` because the default C: cache path hit `ENOSPC`.
- Renamed the requested package identifiers and import/dependency references:
  - `@opencode-ai/core` -> `@nexusflow/core`
  - `@opencode-ai/ui` -> `@nexusflow/ui`
  - `@opencode-ai/sdk` -> `@nexusflow/sdk`
- Regenerated the JavaScript SDK after package/API changes.
- Updated core/runtime service tags for requested v2 and runtime namespaces, including agent, account, config, auth, skill, creator, and global services.
- Added NexusFlow config/auth compatibility while keeping legacy fallback:
  - `NEXUSFLOW_AUTH_CONTENT`
  - `NEXUSFLOW_*` aliases for existing `OPENCODE_*` runtime flags
  - `nexusflow.json` / `nexusflow.jsonc`
  - `.nexusflow/`
  - legacy `OPENCODE_*`, `opencode.json`, and `.opencode/` remain readable.
- Switched new project-generated paths to NexusFlow defaults for agents, plugin installs, and plan files.
- Added `experimental.auto_task_routing` plus `AgentScheduler` heuristic decomposition for explicit parallel task requests.
- Wired auto-routing into session prompt creation so enabled sessions emit background subtask parts and a synthesis prompt.
- Added scheduler tests for ordinary prompts and explicit parallel task lists.
- Added Creator backend service, HTTP API group, and layers for generating `.nexusflow/agents/<name>.md` or `skills/<name>/SKILL.md`.
- Added `Skill.reload()` and call it after Creator writes a skill pack.
- Added `CreatorWizard` SolidJS component for previewing/writing generated agent and skill files.
- Added Monaco-backed `EditorTabs` component with tabs, dirty state, save callback, context menu actions, and Ctrl/Cmd+K inline prompt flow.
- Added `monaco-editor` to the app dependency graph.
- Replaced app/shared favicon SVG assets and shared logo components with geometric NexusFlow marks.
- Updated high-visibility app branding: document title, desktop menu, Windows app menu, favicon metadata, manifest metadata, and English product strings.
- Added Hermes-inspired UI CSS: obsidian backgrounds, cyan accents, purple thinking ring, scanline terminal overlay, glow borders, and monospace defaults.

## Validation Results

- `bun install` from `E:\opencode-dev`: passed after redirecting Bun cache/temp to E:.
- `bun ./script/build.ts` from `E:\opencode-dev\packages\sdk\js`: passed.
- `bun test test/agent/scheduler.test.ts` from `E:\opencode-dev\packages\opencode`: passed.
- `bun typecheck` from `E:\opencode-dev\packages\core`: passed.
- `bun typecheck` from `E:\opencode-dev\packages\opencode`: passed.
- `bun typecheck` from `E:\opencode-dev\packages\app`: passed.
- `bun typecheck` from `E:\opencode-dev\packages\ui`: passed.
- `bun run build` from `E:\opencode-dev\packages\app`: passed.

## Build Warnings

- Vite still reports the existing Solid JSX import-source warning from `virtua`.
- Vite still reports mixed static/dynamic import chunking warnings.
- Vite still reports duplicate sourcemap emission for one generated asset.
- Vite still reports large chunks over 500 kB.
- None of these warnings failed the app build.

## Partially Completed

- Rebranding is implemented for package identifiers, runtime tags, NexusFlow defaults, selected visible app labels, and config/auth aliases. It is not yet a complete product-wide rename.
- Auto-task routing currently uses a deterministic safe planner rather than an LLM-built DAG with dependency edges.
- Background task emission is wired into prompts, but result-channel collection and self-consistency verification are still future work.
- Creator generation uses active/default model metadata to shape deterministic files, but it does not yet ask the active model to author arbitrary skill/agent content.
- Monaco editor exists as a reusable component, but it is not mounted into a full IDE route with real file-system CRUD wiring.
- Hermes CSS primitives exist, but the pulsing ring speed is not yet connected to live token generation rate.

## Not Completed

- Full global text rename across all locales, TUI screens, web docs, installation scripts, prompts, OAuth pages, API descriptions, and tests.
- Provider ID rename for `opencode` / `opencode-go`; those are still semantically external provider identifiers.
- Public domain/endpoint rename for `opencode.ai`, `api.opencode.ai`, `console.opencode.ai`, GitHub URLs, Discord invite URLs, package extension IDs, and install formulas.
- Database table/schema/storage-key migration from legacy names to NexusFlow names.
- CLI binary/command rename from `opencode` to a NexusFlow command.
- Production DAG executor with dependency ordering, cancellation, result streaming, retry policy, and final verifier/merger.
- Browser-level UI verification because the new Creator and Monaco components are not mounted in a route yet.

## Remaining Legacy-Name Categories

- Provider IDs and business offerings: `opencode`, `opencode-go`, `OpenCode Go`, `OpenCode Zen`.
- External URLs and package identifiers: `opencode.ai`, `api.opencode.ai`, `console.opencode.ai`, GitHub repo links, VS Code extension ID.
- User data and compatibility keys: localStorage prefixes, deep-link protocol, auth/config env legacy names.
- Project docs/prompts: customization skill docs, system prompts, initialize templates, repo clone wording.
- API/OpenAPI descriptions and internal exported type names such as `OpenCodeHttpApi`.
- Localized i18n files other than English.
- Tests and fixtures that intentionally assert legacy compatibility.

## Risk Notes

- Broadly replacing remaining `opencode` strings would break provider IDs, persisted user data, external links, installation flows, tests, and compatibility paths.
- Global data path now defaults to `nexusflow`; legacy data migration still needs a dedicated migration pass if existing users should retain history automatically.
- SDK regeneration touched generated files and OpenAPI output; review generated diffs before final commit.
- The workspace has a very large diff due package import rewrites across many packages and tests.

## Recommended Next Pass

- Add explicit migration utilities for global config/data/state from OpenCode paths to NexusFlow paths.
- Decide whether the CLI binary and deep-link protocol should remain backwards-compatible aliases or fully rename.
- Mount `CreatorWizard` and `EditorTabs` behind visible app routes, then run browser verification.
- Add Creator API tests using isolated temporary workspaces.
- Implement the real DAG executor and merger behind `experimental.auto_task_routing`.
- Split remaining rebrand work into safe buckets: user-visible strings, docs, tests, storage migrations, external endpoints, provider IDs, and installer/package distribution.
