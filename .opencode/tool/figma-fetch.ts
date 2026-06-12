/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { envStatus } from "./nexusflow-tool-utils"

export default tool({
  description: "Fetch Figma file or node metadata when FIGMA_TOKEN is configured.",
  args: {
    fileKey: tool.schema.string().describe("Figma file key"),
    nodeId: tool.schema.string().optional().describe("Optional Figma node ID"),
  },
  async execute(args) {
    if (!process.env.FIGMA_TOKEN) {
      return ["Figma fetch is not configured.", "", envStatus(["FIGMA_TOKEN"]), "", `Requested file: ${args.fileKey}`].join("\n")
    }

    const endpoint = args.nodeId
      ? `https://api.figma.com/v1/files/${args.fileKey}/nodes?ids=${encodeURIComponent(args.nodeId)}`
      : `https://api.figma.com/v1/files/${args.fileKey}`
    const response = await fetch(endpoint, { headers: { "X-Figma-Token": process.env.FIGMA_TOKEN } })
    return JSON.stringify(await response.json(), null, 2)
  },
})
