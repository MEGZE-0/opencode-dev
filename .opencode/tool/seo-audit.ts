/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { markdownList } from "./nexusflow-tool-utils"

function pickMeta(html: string, name: string) {
  return html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1]
}

export default tool({
  description: "Run a lightweight technical SEO crawl for a URL and return title, metadata, headings, canonical, schema, and priority checks.",
  args: {
    url: tool.schema.string().url().describe("URL to audit"),
  },
  async execute(args) {
    const response = await fetch(args.url)
    const html = await response.text()
    const title = html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.trim() ?? "Missing"
    const h1 = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)].map((match) => match[1]?.replace(/<[^>]+>/g, "").trim())
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? "Missing"
    const jsonLdCount = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi)].length
    const checks = [
      title === "Missing" ? "Add a unique title tag." : undefined,
      !pickMeta(html, "description") ? "Add a compelling meta description." : undefined,
      h1.length !== 1 ? `Use exactly one H1; found ${h1.length}.` : undefined,
      canonical === "Missing" ? "Add a canonical URL." : undefined,
      jsonLdCount === 0 ? "Add JSON-LD structured data where relevant." : undefined,
      !html.includes('name="viewport"') ? "Add a responsive viewport meta tag." : undefined,
    ].filter((item): item is string => item !== undefined)

    return [
      `# SEO Audit: ${args.url}`,
      "",
      `Status: ${response.status}`,
      `Title: ${title}`,
      `Meta description: ${pickMeta(html, "description") ?? "Missing"}`,
      `Canonical: ${canonical}`,
      `H1 count: ${h1.length}`,
      `JSON-LD blocks: ${jsonLdCount}`,
      "",
      "## Priority Checks",
      checks.length ? markdownList(checks) : "- No obvious metadata issues found in the initial crawl.",
    ].join("\n")
  },
})
