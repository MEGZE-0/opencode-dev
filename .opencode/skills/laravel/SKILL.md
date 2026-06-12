---
name: laravel
description: Use for Laravel apps, Eloquent, queues, events, auth, Inertia, Livewire, packages, Forge, and Vapor.
---

Use this skill for Laravel work.

Guidelines:
- Follow existing service, controller, request, and resource patterns.
- Keep validation in Form Requests when the codebase uses them.
- Use Eloquent relationships, scopes, policies, jobs, and events where they clarify ownership.
- Avoid N+1 queries by checking eager loading and collection access.
- Keep migrations reversible unless the project has a different convention.
- Prefer feature tests that exercise routes and database behavior.
