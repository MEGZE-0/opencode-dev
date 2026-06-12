/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { envStatus } from "./nexusflow-tool-utils"

function readVariables(input: string | undefined) {
  if (!input) return undefined
  try {
    return JSON.parse(input) as Record<string, unknown>
  } catch {
    return undefined
  }
}

export default tool({
  description: "Run a Shopify Admin GraphQL query when SHOPIFY_SHOP and SHOPIFY_ADMIN_TOKEN are configured.",
  args: {
    query: tool.schema.string().describe("GraphQL query or mutation"),
    variables: tool.schema.string().optional().describe("Optional JSON variables"),
    shop: tool.schema.string().optional().describe("Shop domain, defaults to SHOPIFY_SHOP"),
  },
  async execute(args) {
    const shop = args.shop ?? process.env.SHOPIFY_SHOP
    if (!shop || !process.env.SHOPIFY_ADMIN_TOKEN) {
      return ["Shopify GraphQL is not configured.", "", envStatus(["SHOPIFY_SHOP", "SHOPIFY_ADMIN_TOKEN"])].join("\n")
    }

    const response = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: args.query, variables: readVariables(args.variables) }),
    })
    return JSON.stringify(await response.json(), null, 2)
  },
})
