---
description: Run a technical SEO, AEO, and GEO audit
agent: reporter
model: nexusflow/claude-opus-4-7
subtask: true
---

Execute this SEO audit SOP.

1. Crawl the target URL using `seo-audit`. Capture status code, redirect chain, title, meta description, heading structure, canonical, hreflang, robots directives, Open Graph, Twitter cards, image alt gaps, link counts, word count, and JSON-LD.
2. Run `lighthouse-runner` for mobile and desktop when a live URL is available. Capture LCP, INP, CLS, Performance, SEO, Accessibility, Best Practices, opportunities, and diagnostics.
3. Validate every structured data block with `schema-validator`.
4. Run `keyword-research` on the page primary topic. Capture search volume, keyword difficulty, CPC, SERP features, related terms, and top-ranking competitor pages.
5. Spawn `seo-specialist`, `aeo-specialist`, `geo-specialist`, and `local-seo-specialist` when local intent exists.
6. Produce the final report through `reporter` Template C.
7. Prioritize: Critical missing title/meta/canonical/indexability, High CWV or security-facing failures, Medium missing structured data or internal linking gaps, Low content and keyword refinements.
