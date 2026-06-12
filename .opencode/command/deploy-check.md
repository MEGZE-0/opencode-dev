---
description: Run a production deployment readiness check
agent: reporter
model: nexusflow/claude-haiku-4-5
subtask: true
---

Execute this deploy readiness SOP.

1. Identify target environment, branch, host, package, env vars, migrations, and rollback path.
2. Spawn `devops-specialist` for build, hosting, env var, health check, logging, monitoring, and rollback readiness.
3. Spawn `security-specialist` for secrets, auth, dependency, CSP/header, data exposure, and permission risks.
4. Spawn `performance-specialist` when the deploy affects user-facing web surfaces.
5. Spawn `github-specialist` when GitHub Actions, release automation, or branch protection is involved.
6. Run or request the exact validation commands from package directories.
7. Return a go/no-go decision with blockers, warnings, owner, and remediation command or file.
8. Merge through `reporter` Template C.
