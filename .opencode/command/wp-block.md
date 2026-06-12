---
description: Build or review a Gutenberg block
agent: wordpress-section-builder
model: nexusflow/claude-sonnet-4-6
subtask: true
---

Execute this Gutenberg block SOP.

1. Read the block brief: name, namespace, purpose, attributes, dynamic/static rendering, and editor controls.
2. Load `wordpress`.
3. Generate `blocks/[namespace]-[name]/block.json` with attributes, supports, styles, textdomain, category, icon, and editor/frontend assets.
4. Generate `edit.js` with `InspectorControls` for every attribute and correct `useBlockProps` usage.
5. Generate `save.js` for static blocks or `render.php` for dynamic blocks with escaped output.
6. Generate `style.scss`, `editor.scss`, `index.js`, and the PHP `register_block_type()` snippet.
7. Validate `block.json` parses, every attribute is used in `edit.js`, and all rendered output is escaped.
8. Ask `accessibility-specialist` for keyboard/focus concerns and `wordpress-performance-seo` for public-page impact.
