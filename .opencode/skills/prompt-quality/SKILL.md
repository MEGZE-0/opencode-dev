---
name: prompt-quality
title: Prompt quality tactical patterns
version: 1.0.0
last-updated: 2026-06-12
description: Prompt quality tactical patterns for NexusFlow specialist agents.
tags: [nexusflow, tactical, specialist]
applies-to: ["prompt-engineer", "quality-director"]
---

# Prompt quality tactical patterns

## Core Concepts

- This skill is tactical and should be loaded only when the task directly matches its domain.
- The steps below are ordered; do not skip earlier decision steps.
- Prefer existing repo conventions over generic framework defaults.

## Steps

1. Define role, goal, scope, tools, skills, output schema, and refusal conditions.
2. Add injection resistance and ambiguity handling.
3. Connect prompts to fixtures and rubrics.

## Output Requirements

- State which step drove the recommendation.
- Include exact files, tools, metrics, or schema affected.
- Hand off work outside this domain to the right specialist.
