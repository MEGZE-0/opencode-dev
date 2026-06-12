/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"

export default tool({
  description: "Prepare or run a Lighthouse audit. Execution requires execute=true and shell permission.",
  args: {
    url: tool.schema.string().url().describe("URL to audit"),
    execute: tool.schema.boolean().default(false).describe("Actually run Lighthouse with bunx"),
  },
  async execute(args, context) {
    const command = `bunx lighthouse ${args.url} --quiet --chrome-flags="--headless" --output=json`
    if (!args.execute) return `Dry run only. Command:\n\n\`${command}\`\n\nSet execute=true to run it.`

    await context.ask({ permission: "bash", patterns: [command], always: [], metadata: {} })
    const proc = Bun.spawn(["bunx", "lighthouse", args.url, "--quiet", "--chrome-flags=--headless", "--output=json"], {
      cwd: context.directory,
      stdout: "pipe",
      stderr: "pipe",
    })
    return [
      `Exit code: ${await proc.exited}`,
      "",
      await new Response(proc.stdout).text(),
      await new Response(proc.stderr).text(),
    ].join("\n")
  },
})
