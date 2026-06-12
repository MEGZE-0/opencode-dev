/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { json, validateUrl } from "./nexusflow-tool-utils"

export const inputSchema = tool.schema.object({
  url: tool.schema.string(),
  minScore: tool.schema.number().default(0.9),
  dryRun: tool.schema.boolean().default(false),
})

export const outputSchema = tool.schema.object({
  ok: tool.schema.boolean(),
  url: tool.schema.string().optional(),
  scores: tool.schema.record(tool.schema.string(), tool.schema.number()).optional(),
  failedAudits: tool.schema.array(tool.schema.string()).optional(),
  error: tool.schema.unknown().optional(),
})

export default tool({
  description: "Run or plan a Lighthouse CI audit and return category scores and failed audits.",
  args: inputSchema.shape,
  async execute(args) {
    if (!validateUrl(args.url)) return json({ ok: false, code: "INVALID_URL", message: "Expected a valid URL." })
    if (args.dryRun) return json({ ok: true, dryRun: true, command: `lhci autorun --collect.url=${args.url}` })
    return json({
      ok: false,
      code: "LIGHTHOUSE_CI_NOT_EXECUTED",
      message: "Install and configure @lhci/cli to execute this tool in CI.",
      url: args.url,
      minScore: args.minScore,
    })
  },
})
