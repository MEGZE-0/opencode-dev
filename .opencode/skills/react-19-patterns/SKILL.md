---
name: react-19-patterns
title: React 19 tactical patterns
version: 1.0.0
last-updated: 2026-06-12
description: React 19 tactical patterns for NexusFlow specialist agents.
tags: [nexusflow, tactical, specialist]
applies-to: ["frontend-engineer", "react-specialist"]
---

# React 19 tactical patterns

## Core Concepts

- This skill is tactical and should be loaded only when the task directly matches its domain.
- The steps below are ordered; do not skip earlier decision steps.
- Prefer existing repo conventions over generic framework defaults.

## Steps

1. Choose Server Actions for form mutations that can run on the server.
2. Use `useOptimistic` only for reversible optimistic UI.
3. Place Suspense boundaries at latency boundaries, not decorative component boundaries.

## Output Requirements

- State which step drove the recommendation.
- Include exact files, tools, metrics, or schema affected.
- Hand off work outside this domain to the right specialist.
