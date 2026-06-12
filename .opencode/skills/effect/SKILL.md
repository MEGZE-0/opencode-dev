---
name: effect
title: effect
version: 2.0.0
last-updated: 2026-06-12
description: Work with Effect v4 / effect-smol TypeScript code in this repo.
applies-to: ["nodejs-specialist", "database-architect", "coder", "tester"]
---

# Effect

## Core Concepts

- Effect v4 / effect-smol APIs are the source of truth; do not rely on older v2/v3 examples.
- Use `Effect.gen(function* () { ... })` for multi-step workflows.
- Use `Effect.fn("Name")` or `Effect.fnUntraced(...)` for named service methods.
- Model domain failures with typed errors, not thrown generic exceptions.
- Distinguish failures, defects, and interruptions when reasoning about errors.
- Prefer Effect Schema over zod in Effect-first code paths.
- Keep layers explicit so dependencies are visible in tests and services.
- Use fibers for supervised concurrency, not ad hoc detached promises.

## Effect v3 vs v4 Differences

- Verify current imports and constructor names in repo code before adding APIs.
- Prefer the local `effect` package patterns already used in `packages/nexusflow/src`.
- Avoid legacy examples that use old module paths, old runtime constructors, or v3-only helpers.

## Effect-Smol Patterns

- Keep small workflows direct with `Effect.gen`.
- Keep synchronous parsing synchronous unless it actually performs effects.
- Use `Schema.decodeUnknownOption` for optional untrusted decoding.
- Keep service methods named with `Effect.fn` when they appear in spans or logs.

## Conventions & Standards

- Use branded schemas for IDs.
- Use `Schema.TaggedErrorClass` for typed domain errors.
- Keep HTTP handlers thin: decode, read context, call services, map errors.
- Prefer Effect-aware platform abstractions over raw promises in Effect services.
- Tests run from package directories, never repo root.

## Patterns & Recipes

1. Service method:
```ts
const load = Effect.fn("Thing.load")(function* (id: string) {
  return { id }
})
```

2. Schema decoding:
```ts
const Decoded = Schema.Struct({ id: Schema.String })
const result = Schema.decodeUnknownOption(Decoded)(input)
```

3. Typed error:
```ts
class MissingThing extends Schema.TaggedErrorClass<MissingThing>()("MissingThing", { id: Schema.String }) {}
```

4. Fiber concurrency:
```ts
const values = yield* Effect.all([taskA, taskB], { concurrency: 2 })
```

5. HTTP client boundary:
```ts
const response = yield* client.execute(request).pipe(Effect.catchTag("RequestError", Effect.fail))
```

## Anti-Patterns

1. Wrong:
```ts
const value: any = yield* effect
```
Correct:
```ts
const value = yield* effect
```

2. Wrong:
```ts
try { await run() } catch {}
```
Correct:
```ts
yield* runEffect.pipe(Effect.catchAll((error) => Effect.fail(error)))
```

3. Wrong:
```ts
JSON.parse(input)
```
Correct:
```ts
Schema.decodeUnknownOption(Schema.UnknownFromJsonString)(input)
```

4. Wrong:
```ts
Effect.promise(() => fetch(url))
```
Correct:
```ts
client.execute(HttpClientRequest.get(url))
```

5. Wrong:
```ts
Effect.forkDaemon(work)
```
Correct:
```ts
yield* Effect.forkScoped(work)
```

## Interoperability Notes

- Use with Bun for package commands and filesystem boundaries.
- Use with Hono by keeping handlers transport-thin.
- Use with Drizzle by isolating database effects in services.
- Use with OpenAPI by deriving or validating schemas at the API edge.

## Debugging Reference

- Missing layer: inspect service dependencies and provide the layer explicitly.
- Defect instead of failure: replace thrown errors with typed failures.
- Schema mismatch: print Effect schema issues with paths.
- Hung fiber: ensure scoped fibers are joined or interrupted.
- Flaky live test: use scoped fixtures and finalizers.
