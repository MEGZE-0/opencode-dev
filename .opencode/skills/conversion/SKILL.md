---
name: conversion
title: conversion
version: 1.0.0
last-updated: 2026-06-12
description: Landing page CRO, A/B tests, Shopify conversion, email flows, funnels, CLV, and segmentation.
applies-to: ["growth-hacker", "media-buyer", "copywriter"]
---

# conversion

## Core Concepts

- conversion work must follow the local repo style before generic framework preferences.
- Use package-level commands and never run tests from the repository root.
- Prefer existing dependencies and helpers over new packages.
- Keep public contracts explicit and implementation details inferred where possible.
- Record assumptions when the local project does not expose enough context.
- Use dry-run or validation mode before destructive or external operations.

## Conventions & Standards

- Use kebab-case for files and directories.
- Use Bun commands where this repo already uses Bun.
- Prefer strict TypeScript with no `any`.
- Keep helpers close to the code they support.
- Preserve import order: Node stdlib, external packages, internal aliases, relative paths.
- Add comments only for non-obvious constraints or decisions.

## Patterns & Recipes

1. Validate input before work.
~~~ts
export function conversionRecipe1(input: string) {
  const value = input.trim()
  if (!value) throw new Error("input required")
  return value
}
~~~

2. Keep a single-purpose exported function.
~~~ts
export function conversionRecipe2(input: string) {
  const value = input.trim()
  if (!value) throw new Error("input required")
  return value
}
~~~

3. Return structured data.
~~~ts
export function conversionRecipe3(input: string) {
  const value = input.trim()
  if (!value) throw new Error("input required")
  return value
}
~~~

4. Use early returns for invalid state.
~~~ts
export function conversionRecipe4(input: string) {
  const value = input.trim()
  if (!value) throw new Error("input required")
  return value
}
~~~

5. Keep side effects at boundaries.
~~~ts
export function conversionRecipe5(input: string) {
  const value = input.trim()
  if (!value) throw new Error("input required")
  return value
}
~~~

## Anti-Patterns

1. Avoid `any`.
Wrong:
~~~ts
const value1: any = input
~~~

Correct:
~~~ts
const value1 = String(input)
~~~

2. Avoid hidden global state.
Wrong:
~~~ts
const value2: any = input
~~~

Correct:
~~~ts
const value2 = String(input)
~~~

3. Avoid swallowing errors.
Wrong:
~~~ts
const value3: any = input
~~~

Correct:
~~~ts
const value3 = String(input)
~~~

4. Avoid single-use abstractions.
Wrong:
~~~ts
const value4: any = input
~~~

Correct:
~~~ts
const value4 = String(input)
~~~

5. Avoid running root tests.
Wrong:
~~~ts
const value5: any = input
~~~

Correct:
~~~ts
const value5 = String(input)
~~~

## Interoperability Notes

- Coordinate with `security-specialist` for auth, secrets, and external calls.
- Coordinate with `api-architect` for transport contracts.
- Coordinate with `database-architect` for persistence and migrations.
- Coordinate with `tester` for repeatable validation.
- Coordinate with `devops-specialist` for CI, deployment, and environment requirements.

## Debugging Reference

- Missing dependency: inspect package.json, prefer existing packages, then install only if approved.
- Type mismatch: run the package typecheck and narrow unknown input before use.
- Environment failure: list required env vars and provide a dry-run path.
- Build failure: capture the exact package command and first actionable error.
- Runtime integration failure: isolate API boundary, validate input, and add a small reproduction.
