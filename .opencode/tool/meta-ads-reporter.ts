/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"
import { envStatus } from "./nexusflow-tool-utils"

export default tool({
  description: "Fetch or outline Meta Ads campaign reporting.",
  args: {
    accountId: tool.schema.string().optional().describe("Meta ad account ID"),
    datePreset: tool.schema.string().default("last_30d").describe("Meta Ads date preset"),
  },
  async execute(args) {
    if (!process.env.META_ACCESS_TOKEN || !args.accountId) {
      return [
        "Meta Ads reporting is not configured.",
        "",
        envStatus(["META_ACCESS_TOKEN"]),
        "",
        "Recommended metrics: spend, impressions, CPM, CTR, CPC, purchases, CPA, ROAS, frequency, creative fatigue.",
      ].join("\n")
    }

    const fields = "campaign_name,spend,impressions,cpm,ctr,cpc,actions,action_values"
    const response = await fetch(
      `https://graph.facebook.com/v20.0/act_${args.accountId}/insights?date_preset=${args.datePreset}&fields=${fields}`,
      { headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` } },
    )
    return JSON.stringify(await response.json(), null, 2)
  },
})
