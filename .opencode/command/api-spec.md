---
description: Design an API and produce an OpenAPI-oriented spec
agent: api-architect
model: nexusflow/claude-sonnet-4-6
subtask: true
---

Execute this OpenAPI SOP.

1. Scan route definition files: Express routers, Hono routes, Next.js route handlers, Laravel `routes/api.php`, and any OpenAPI fragments.
2. For each route, extract method, path, path params, query params, request body, response shape, auth requirement, rate limit, and error behavior.
3. Generate `openapi.yaml` using OpenAPI 3.1.
4. Define reusable `$ref` components for schemas, parameters, errors, and security schemes.
5. Include example request and response payloads for every endpoint.
6. Define global 400, 401, 403, 404, 422, and 500 error responses.
7. Validate the spec parses, all `$ref` values resolve, and no path parameter is undocumented.
8. Ask `database-architect` for persistence contracts and `security-specialist` for auth-sensitive routes.
