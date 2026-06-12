---
description: Optimize content for answer engines and AI search
agent: aeo-specialist
model: nexusflow/claude-sonnet-4-6
subtask: true
---

Execute this AEO optimization SOP.

1. Load `aeo`.
2. Extract the page topic, entities, audience, user questions, and current content structure.
3. Add or rewrite direct answer blocks, concise definitions, step lists, comparison tables, and question-led headings.
4. Identify FAQ, HowTo, Article, Organization, WebSite, or Breadcrumb schema opportunities.
5. Validate generated JSON-LD with `schema-validator`.
6. Ask `geo-specialist` for entity clarity and `seo-specialist` for organic search tradeoffs.
7. Return before/after content snippets, schema blocks, assumptions, and measurement plan.
