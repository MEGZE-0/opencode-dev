---
name: shopify-sections
title: Shopify section tactical patterns
version: 1.0.0
last-updated: 2026-06-12
description: Shopify section tactical patterns for NexusFlow specialist agents.
tags: [nexusflow, tactical, specialist]
applies-to: ["ecommerce-specialist", "shopify-section-builder"]
---

# Shopify section tactical patterns

## Core Concepts

- This skill is tactical and should be loaded only when the task directly matches its domain.
- The steps below are ordered; do not skip earlier decision steps.
- Prefer existing repo conventions over generic framework defaults.

## Steps

1. Declare every merchant-editable value in schema.
2. Use Dynamic Sources for metafields when merchant content varies.
3. Validate all Liquid setting references against the schema block.

## Output Requirements

- State which step drove the recommendation.
- Include exact files, tools, metrics, or schema affected.
- Hand off work outside this domain to the right specialist.
