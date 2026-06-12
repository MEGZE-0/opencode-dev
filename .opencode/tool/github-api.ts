/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { httpClient, json, loadCredential, toolError } from "./nexusflow-tool-utils"

export const inputSchema = tool.schema.object({
  action: tool.schema.enum(["list-issues", "create-pr", "post-review-comment", "fetch-file-tree"]),
  owner: tool.schema.string(),
  repo: tool.schema.string(),
  payload: tool.schema.record(tool.schema.string(), tool.schema.unknown()).default({}),
  dryRun: tool.schema.boolean().default(false),
})

export const outputSchema = tool.schema.object({
  ok: tool.schema.boolean(),
  action: tool.schema.string().optional(),
  result: tool.schema.unknown().optional(),
  error: tool.schema.unknown().optional(),
})

export default tool({
  description: "Typed GitHub REST helper for issues, PRs, review comments, and file trees.",
  args: inputSchema.shape,
  async execute(args) {
    try {
      if (args.dryRun) return json({ ok: true, dryRun: true, action: args.action, repo: `${args.owner}/${args.repo}` })
      const client = httpClient("https://api.github.com", {
        Authorization: `Bearer ${loadCredential("GITHUB_TOKEN", "https://github.com/settings/tokens")}`,
        Accept: "application/vnd.github+json",
      })
      const result =
        args.action === "list-issues"
          ? await client.get(`/repos/${args.owner}/${args.repo}/issues`)
          : args.action === "fetch-file-tree"
            ? await client.get(`/repos/${args.owner}/${args.repo}/git/trees/HEAD?recursive=1`)
            : args.action === "create-pr"
              ? await client.post(`/repos/${args.owner}/${args.repo}/pulls`, args.payload)
              : await client.post(`/repos/${args.owner}/${args.repo}/pulls/${String(args.payload.pull_number)}/comments`, args.payload)
      return json({ ok: true, action: args.action, result })
    } catch (error) {
      return json(toolError(error))
    }
  },
})
