---
description: Produce a performance and Core Web Vitals report
agent: performance-specialist
model: nexusflow/gpt-5.4
subtask: true
---

Execute this performance SOP.

1. Run `lighthouse-runner` on the target URL and capture full JSON for mobile and desktop.
2. Analyze bundle output from Vite, Next.js, or the package build when available.
3. Identify LCP fixes: image optimization, preload hints, font loading, server response, critical CSS, and render blocking work.
4. Identify CLS fixes: intrinsic image dimensions, reserved layout space, font loading, injected content, and animation transforms.
5. Identify INP fixes: long tasks, hydration, event handlers, expensive renders, third-party scripts, and main-thread blocking.
6. Identify bundle fixes: largest chunks, duplicate deps, code splitting, unused exports, tree shaking gaps.
7. For each finding, propose a concrete code fix, not generic advice.
8. Spawn `performance-specialist` to implement or specify the top 3 critical fixes.
9. Output `perf-report.md` through `reporter` Template C.
