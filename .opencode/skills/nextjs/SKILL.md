---
name: nextjs
description: Use for Next.js App Router, Server Components, Server Actions, metadata, routing, caching, and deployment behavior.
---

Use this skill for Next.js work.

Guidelines:
- Identify whether a file is server or client before adding imports or hooks.
- Keep client boundaries small and intentional.
- Use route handlers for API-like endpoints and Server Actions for form mutations when appropriate.
- Make caching decisions explicit: static, dynamic, revalidated, or no-store.
- Put SEO metadata close to route ownership.
- Validate edge/runtime assumptions before using Node-only APIs.
- Preserve accessibility and progressive enhancement in forms and navigation.
