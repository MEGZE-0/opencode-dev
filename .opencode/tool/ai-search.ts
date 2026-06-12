/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { httpClient, json, loadCredential, toolError } from "./nexusflow-tool-utils"

export const inputSchema = tool.schema.object({
  query: tool.schema.string(),
  provider: tool.schema.enum(["brave", "perplexity", "mock"]).default("mock"),
  limit: tool.schema.number().default(5),
  dryRun: tool.schema.boolean().default(false),
})

export const outputSchema = tool.schema.object({
  ok: tool.schema.boolean(),
  results: tool.schema.array(tool.schema.object({ title: tool.schema.string(), url: tool.schema.string(), snippet: tool.schema.string(), confidence: tool.schema.number() })).optional(),
  error: tool.schema.unknown().optional(),
})

export default tool({
  description: "Query AI/search providers and return citation-friendly search results.",
  args: inputSchema.shape,
  async execute(args) {
    try {
      if (args.dryRun || args.provider === "mock") {
        return json({ ok: true, results: [{ title: args.query, url: "https://example.com", snippet: "Mock AI search result.", confidence: 0.5 }] })
      }
      const result = await httpClient("https://api.search.brave.com", {
        "X-Subscription-Token": loadCredential("BRAVE_SEARCH_API_KEY", "https://api.search.brave.com/app/keys"),
      }).get(`/res/v1/web/search?q=${encodeURIComponent(args.query)}&count=${args.limit}`)
      return json({ ok: true, results: result })
    } catch (error) {
      return json(toolError(error))
    }
  },
})
