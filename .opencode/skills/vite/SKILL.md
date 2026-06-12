---
name: vite
description: Use for Vite configuration, plugins, HMR, SSR, library mode, env handling, and monorepo builds.
---

Use this skill for Vite work.

Guidelines:
- Check package scripts and existing vite config before changing defaults.
- Keep plugin order deliberate and document surprising constraints.
- Use Vite env prefixes and mode handling rather than ad hoc process env reads in browser code.
- For libraries, verify entry points, externals, sourcemaps, and type output.
- For SSR, separate server-only dependencies from browser bundles.
- Validate changes with the package's typecheck or build command.
