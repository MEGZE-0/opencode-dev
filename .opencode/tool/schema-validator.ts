/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { asJson, markdownList } from "./nexusflow-tool-utils"

function readObject(input: string) {
  try {
    const parsed: unknown = JSON.parse(input)
    return typeof parsed === "object" && parsed !== null ? parsed : undefined
  } catch {
    return undefined
  }
}

export default tool({
  description: "Validate JSON-LD shape for schema.org readiness and report missing common fields.",
  args: {
    jsonld: tool.schema.string().describe("JSON-LD string to validate"),
  },
  async execute(args) {
    const parsed = readObject(args.jsonld)
    if (!parsed) return "Invalid JSON-LD: input must parse to a JSON object or array."

    const values = Array.isArray(parsed) ? parsed : [parsed]
    const issues = values.flatMap((item, index) => {
      if (typeof item !== "object" || item === null) return [`Item ${index + 1}: not an object.`]
      const record = item as Record<string, unknown>
      return [
        record["@context"] ? undefined : `Item ${index + 1}: missing @context.`,
        record["@type"] ? undefined : `Item ${index + 1}: missing @type.`,
        record.name ? undefined : `Item ${index + 1}: missing name where applicable.`,
      ].filter((issue): issue is string => issue !== undefined)
    })

    return [
      "# Schema Validation",
      "",
      issues.length ? markdownList(issues) : "- JSON-LD has the required top-level fields checked by this validator.",
      "",
      "Parsed input:",
      "```json",
      asJson(parsed),
      "```",
    ].join("\n")
  },
})
