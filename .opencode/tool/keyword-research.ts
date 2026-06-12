/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { markdownList } from "./nexusflow-tool-utils"

export default tool({
  description: "Generate keyword research seed clusters and report API readiness.",
  args: {
    seed: tool.schema.string().describe("Seed keyword or topic"),
    market: tool.schema.string().default("US").describe("Target market or locale"),
  },
  async execute(args) {
    const modifiers = ["best", "near me", "pricing", "reviews", "alternatives", "how to", "for small business"]
    return [
      `# Keyword Research: ${args.seed}`,
      "",
      `Market: ${args.market}`,
      `External API: ${process.env.KEYWORD_RESEARCH_API_KEY ? "configured" : "not configured; generated seed expansion only"}`,
      "",
      "## Seed Cluster",
      markdownList(modifiers.map((modifier) => `${modifier} ${args.seed}`)),
      "",
      "## Intent Map",
      markdownList(["Informational: how-to and comparison queries", "Commercial: pricing, reviews, alternatives", "Local: near-me and location-modified variants"]),
    ].join("\n")
  },
})
