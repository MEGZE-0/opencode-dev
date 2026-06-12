---
description: Create a full brand strategy and identity kit
agent: reporter
model: nexusflow/claude-opus-4-7
subtask: true
---

Execute this brand identity SOP.

1. Extract brand inputs from context: industry, audience, offer, tone, competitors, existing colors, constraints, and channels.
2. Spawn `brand-strategist` to produce `brand-kit/positioning.md`.
3. Spawn `brand-identity-generator` in parallel to produce palette, typography, logo concept, `brand-kit/tokens.css`, and `brand-kit/tailwind.brand.config.js`.
4. Spawn `copywriter` in parallel to produce voice guide, vocabulary, anti-vocabulary, 3 taglines, elevator pitch, mission statement, CTAs, and sample website copy.
5. Spawn `brand-researcher` when competitor or naming evidence is missing.
6. Require palette output to include primary, secondary, accent, neutral, and semantic colors with HEX, HSL, and contrast notes.
7. Ask `reporter` to merge all artifacts into `brand-kit/README.md` using Template B.
