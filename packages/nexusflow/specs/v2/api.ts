// @ts-nocheck

import { NexusFlow } from "@nexusflow/core"
import { ReadTool } from "@nexusflow/core/tools"

const nexusflow = NexusFlow.make({})

nexusflow.tool.add(ReadTool)

nexusflow.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

nexusflow.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

nexusflow.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await nexusflow.session.create({
  agent: "build",
})

nexusflow.subscribe((event) => {
  console.log(event)
})

await nexusflow.session.prompt({
  sessionID,
  text: "hey what is up",
})

await nexusflow.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await nexusflow.session.wait()

console.log(await nexusflow.session.messages(sessionID))
