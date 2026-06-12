/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { httpClient, json, loadCredential, toolError } from "./nexusflow-tool-utils"

export const inputSchema = tool.schema.object({
  action: tool.schema.enum(["fetch-products", "update-metafields", "publish-section"]),
  shop: tool.schema.string().optional(),
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
  description: "Typed Shopify Admin API helper for products, metafields, and publish planning.",
  args: inputSchema.shape,
  async execute(args) {
    try {
      const shop = args.shop ?? process.env.SHOPIFY_SHOP_DOMAIN
      if (!shop) return json({ ok: false, code: "MISSING_SHOP", message: "Set SHOPIFY_SHOP_DOMAIN or pass shop." })
      if (args.dryRun) return json({ ok: true, dryRun: true, action: args.action, shop })
      const client = httpClient(`https://${shop}`, {
        "X-Shopify-Access-Token": loadCredential("SHOPIFY_ADMIN_ACCESS_TOKEN", "https://admin.shopify.com/settings/apps"),
      })
      const result =
        args.action === "fetch-products"
          ? await client.get("/admin/api/2025-01/products.json")
          : await client.post("/admin/api/2025-01/graphql.json", args.payload)
      return json({ ok: true, action: args.action, result })
    } catch (error) {
      return json(toolError(error))
    }
  },
})
