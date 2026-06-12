/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { mix, normalizeHex } from "./nexusflow-tool-utils"

export default tool({
  description: "Generate an accessible brand color palette from a seed color.",
  args: {
    seed: tool.schema.string().describe("Seed hex color"),
  },
  async execute(args) {
    const seed = normalizeHex(args.seed)
    return [
      "# Brand Palette",
      "",
      `Seed: ${seed}`,
      "",
      "| Token | Hex | Use |",
      "|---|---:|---|",
      `| primary | ${seed} | Primary actions and brand moments |`,
      `| primary_soft | ${mix(seed, "#FFFFFF", 0.72)} | Subtle backgrounds |`,
      `| primary_strong | ${mix(seed, "#000000", 0.24)} | Hover and active states |`,
      `| ink | ${mix(seed, "#000000", 0.78)} | Text on light surfaces |`,
      `| surface | ${mix(seed, "#FFFFFF", 0.9)} | Brand-tinted panels |`,
      `| contrast | #FFFFFF | Text on primary |`,
    ].join("\n")
  },
})
