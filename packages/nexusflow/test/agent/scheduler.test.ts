import { describe, expect, test } from "bun:test"
import { AgentScheduler } from "../../src/agent/scheduler"
import { ModelID, ProviderID } from "../../src/provider/schema"

describe("AgentScheduler", () => {
  test("does not route ordinary single prompts", () => {
    expect(
      AgentScheduler.plan({
        text: "Fix the failing typecheck in the app package.",
        agent: "general",
        background: true,
      }),
    ).toEqual([])
  })

  test("routes explicit parallel task lists", () => {
    const plan = AgentScheduler.plan({
      text: [
        "Run these in parallel:",
        "- Inspect the config loading path",
        "- Review the app theme stylesheet",
      ].join("\n"),
      agent: "general",
      background: true,
      model: {
        providerID: ProviderID.make("test"),
        modelID: ModelID.make("model"),
      },
    })

    expect(plan).toHaveLength(2)
    expect(plan[0]?.background).toBe(true)
    expect(plan[0]?.agent).toBe("general")
    expect(plan[0]?.model?.providerID).toBe(ProviderID.make("test"))
    expect(plan.map((task) => task.description)).toEqual([
      "inspect the config loading path",
      "review the app theme stylesheet",
    ])
  })
})
