/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { envStatus } from "./nexusflow-tool-utils"

export default tool({
  description: "Prepare GA4 reporting requirements or call a configured GA4 reporting endpoint.",
  args: {
    propertyId: tool.schema.string().optional().describe("GA4 property ID"),
    report: tool.schema.string().default("acquisition").describe("Requested report type"),
  },
  async execute(args) {
    return [
      "GA4 reporter",
      "",
      envStatus(["GA4_PROPERTY_ID", "GOOGLE_APPLICATION_CREDENTIALS"]),
      "",
      `Property: ${args.propertyId ?? process.env.GA4_PROPERTY_ID ?? "not provided"}`,
      `Report: ${args.report}`,
      "",
      "Recommended dimensions: sessionDefaultChannelGroup, sourceMedium, landingPagePlusQueryString.",
      "Recommended metrics: sessions, engagedSessions, conversions, totalRevenue, eventCount.",
    ].join("\n")
  },
})
