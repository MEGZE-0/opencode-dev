---
description: Build or review a Shopify section
agent: shopify-section-builder
model: nexusflow/claude-sonnet-4-6
subtask: true
---

Execute this Shopify section SOP.

1. Read the section brief: name, purpose, target template, content blocks, merchant controls, responsive behavior, and interaction needs.
2. Load `shopify-liquid`.
3. Generate `sections/[name].liquid` with semantic HTML, Shopify BEM-style classes, complete Liquid rendering logic, and a full `{% schema %}` block.
4. Include settings and blocks for all merchant-editable copy, images, colors, links, products, collections, videos, and ranges.
5. Add `presets` with sensible defaults.
6. Scope CSS to `#shopify-section-{{ section.id }}`. Output `assets/section-[name].css` if CSS is substantial.
7. Use JavaScript only for real interaction; prefer vanilla JS or Alpine.js, never jQuery.
8. Validate schema JSON parses, every setting referenced in Liquid exists in schema, and no merchant-editable text is hardcoded.
9. Ask `accessibility-specialist` for interactive controls and `shopify-seo-optimizer` for product/collection SEO.
