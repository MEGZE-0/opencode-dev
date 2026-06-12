---
name: testing-strategy
title: Testing tactical patterns
version: 1.0.0
last-updated: 2026-06-12
description: Testing tactical patterns for NexusFlow specialist agents.
tags: [nexusflow, tactical, specialist]
applies-to: ["tester", "quality-director"]
---

# Testing tactical patterns

## Core Concepts

- This skill is tactical and should be loaded only when the task directly matches its domain.
- The steps below are ordered; do not skip earlier decision steps.
- Prefer existing repo conventions over generic framework defaults.

## Steps

1. Use Vitest for unit behavior and Playwright for end-to-end workflows.
2. Use MSW only when external boundaries need deterministic tests.
3. Keep snapshots small and intentional.

## Output Requirements

- State which step drove the recommendation.
- Include exact files, tools, metrics, or schema affected.
- Hand off work outside this domain to the right specialist.
