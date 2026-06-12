---
name: supabase
description: Use for Supabase Postgres, RLS, Auth, Realtime, Storage, Edge Functions, and pg_vector.
---

Use this skill for Supabase work.

Guidelines:
- Treat RLS as the primary security boundary and state policy assumptions explicitly.
- Prefer migrations over dashboard-only schema changes.
- Model auth flows, service-role use, and client anon access separately.
- Keep storage bucket policies aligned with database ownership.
- For realtime, identify publication scope and subscription filters.
- Validate SQL with realistic roles, not only owner privileges.
