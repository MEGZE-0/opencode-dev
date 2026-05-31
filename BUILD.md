# OrchestraCode — Build & Release Guide

> **OrchestraCode** is a fork of [opencode](https://github.com/sst/opencode) rebranded and extended with multi-agent parallel orchestration, persistent memory, and a native desktop application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Layout](#project-layout)
3. [Development Setup](#development-setup)
4. [TUI / CLI (packages/opencode)](#tui--cli-packagesopencode)
5. [Desktop Application (packages/desktop)](#desktop-application-packagesdesktop)
6. [Agents & Orchestration](#agents--orchestration)
7. [Building for Release](#building-for-release)
8. [Pushing a GitHub Release](#pushing-a-github-release)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Bun** | ≥ 1.3 | `npm i -g bun` or `curl -fsSL https://bun.sh/install \| bash` |
| **Node.js** | ≥ 20 LTS | https://nodejs.org |
| **Git** | any | https://git-scm.com |
| **Electron** (for desktop) | bundled via npm | — |
| **electron-builder** | bundled via npm | — |

> On **Windows**, also install the [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the "Desktop development with C++" workload (needed by some native Node modules and Electron).

---

## Project Layout

```
Orchestra-code/
├── packages/
│   ├── opencode/          # Core TUI / CLI / server
│   │   ├── src/
│   │   │   ├── orchestrator/   # Multi-agent task orchestration
│   │   │   ├── memory/         # Persistent memory (user + project)
│   │   │   ├── repository/     # Repo intelligence for context
│   │   │   └── session/        # Session management & prompt engine
│   │   └── test/
│   └── desktop/           # Electron desktop application
│       ├── src/main/      # Electron main process
│       ├── src/preload/   # Preload scripts
│       ├── src/renderer/  # Web renderer (React)
│       └── electron-builder.config.ts
├── .opencode/
│   ├── opencode.jsonc     # Project config (orchestrator, agents, etc.)
│   └── agents/            # Custom specialist sub-agents
└── BUILD.md               # This file
```

---

## Development Setup

```bash
# 1. Clone
git clone https://github.com/MEGZE-0/Orchestra-code.git
cd Orchestra-code

# 2. Install dependencies (from repo root)
bun install

# 3. Verify core types compile
cd packages/opencode
bun run typecheck
```

---

## TUI / CLI (`packages/opencode`)

### Run in development

```bash
cd packages/opencode
bun run dev
```

This starts the TUI directly via `src/index.ts`.

### Type-check

```bash
cd packages/opencode
bun run typecheck
```

### Run tests

```bash
cd packages/opencode
bun test
```

> ⚠️ Tests **must** be run from the `packages/opencode` directory, not the repo root.

### Build (compile to JavaScript)

```bash
cd packages/opencode
bun run build
```

Output lands in `packages/opencode/dist/`.

---

## Desktop Application (`packages/desktop`)

The desktop app wraps the OpenCode TUI in an Electron shell.

### Development

```bash
cd packages/desktop
npm install          # or bun install
npm run dev          # starts Electron + TUI in watch mode
```

### Build distributables

```bash
cd packages/desktop
npm run build        # compiles renderer and main
npm run package      # packages with electron-builder
```

Built artifacts appear under `packages/desktop/dist/`:
- **Windows** → `OrchestraCode Setup X.Y.Z.exe` (NSIS installer)
- **macOS** → `OrchestraCode-X.Y.Z.dmg`
- **Linux** → `OrchestraCode-X.Y.Z.AppImage`

### Electron-builder config

See [`packages/desktop/electron-builder.config.ts`](packages/desktop/electron-builder.config.ts).
Key properties:
- `appId`: `com.orchestracode.app`
- `productName`: `OrchestraCode`
- `linux.category`: `Development`

---

## Agents & Orchestration

OrchestraCode automatically detects complex multi-step requests and spawns specialist sub-agents in parallel.

### Sub-agents

Custom agents live in `.opencode/agents/`. Each directory contains an `agent.jsonc`:

```
.opencode/agents/
├── researcher/
│   └── agent.jsonc    # Research & analysis agent
├── coder/
│   └── agent.jsonc    # Implementation agent
└── tester/
    └── agent.jsonc    # Testing & QA agent
```

### Orchestrator config

Edit `.opencode/opencode.jsonc`:

```jsonc
{
  "orchestrator": {
    "enabled": true,
    "complexityThreshold": 3   // 1–5; lower = more aggressive orchestration
  }
}
```

When a request scores above the threshold, OrchestraCode:
1. Decomposes the task into a dependency graph
2. Presents the plan to the user for approval
3. Executes approved tasks via parallel sub-agents
4. Synthesizes results into a final response

---

## Building for Release

### 1. Update version

```bash
# In packages/desktop/package.json
# Bump "version": "X.Y.Z"

# Optionally also bump packages/opencode/package.json
```

### 2. Type-check & test

```bash
cd packages/opencode
bun run typecheck
bun test
```

### 3. Build the desktop app

```bash
cd packages/desktop
npm run build
npm run package
```

### 4. Collect artifacts

| Platform | File |
|----------|------|
| Windows | `packages/desktop/dist/OrchestraCode Setup X.Y.Z.exe` |
| macOS | `packages/desktop/dist/OrchestraCode-X.Y.Z.dmg` |
| Linux | `packages/desktop/dist/OrchestraCode-X.Y.Z.AppImage` |

---

## Pushing a GitHub Release

### Prerequisites
- `gh` CLI installed: https://cli.github.com/
- Logged in: `gh auth login`

### Steps

```bash
# 1. Stage and commit all changes
git add -A
git commit -m "chore: release v1.0.0"

# 2. Tag the release
git tag v1.0.0

# 3. Push commits and tag
git push origin dev
git push origin v1.0.0

# 4. Create GitHub release with artifacts
gh release create v1.0.0 \
  --title "OrchestraCode v1.0.0" \
  --notes "## What's New
- Multi-agent parallel orchestration
- Persistent memory (user + project layer)
- Repository intelligence context injection
- Rebranded to OrchestraCode
- Native desktop application (Electron)" \
  packages/desktop/dist/"OrchestraCode Setup 1.0.0.exe" \
  packages/desktop/dist/OrchestraCode-1.0.0.dmg \
  packages/desktop/dist/OrchestraCode-1.0.0.AppImage
```

> 💡 On Windows, run `gh release create` from Git Bash or WSL to avoid PowerShell quoting issues with spaces in filenames.

### Using the GitHub UI instead

1. Go to https://github.com/MEGZE-0/Orchestra-code/releases/new
2. Choose tag: `v1.0.0`
3. Target: `dev` branch
4. Add title and release notes
5. Upload the build artifacts
6. Click **Publish release**

---

## Troubleshooting

### `bun` not found
Ensure Bun is on `PATH`. Restart your terminal after installing.

### `wrangler` install error on Windows
This is a known Bun-on-Windows issue with some npm packages moving cache files. Re-run `bun install` — it usually succeeds on the second attempt.

### Desktop app won't start
1. Ensure `packages/opencode` built successfully
2. Check that `dist/` exists in `packages/desktop`
3. Run `npm run dev` from `packages/desktop` and check the Electron console

### TypeScript errors in test files
Test files that use `SessionPrompt.layer` directly must provide `Question.Service` and optionally `Orchestrator.Service`. See the test setup in `test/session/prompt.test.ts` for the reference layer composition.
