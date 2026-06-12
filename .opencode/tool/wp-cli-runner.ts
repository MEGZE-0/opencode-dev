/// <reference path="../env.d.ts" />
import { tool } from "@nexusflow/plugin"

export default tool({
  description: "Prepare or run a WP-CLI command. Execution requires execute=true and shell permission.",
  args: {
    command: tool.schema.string().describe("WP-CLI arguments after `wp`"),
    cwd: tool.schema.string().optional().describe("Working directory for the WordPress project"),
    execute: tool.schema.boolean().default(false).describe("Actually execute the command"),
  },
  async execute(args, context) {
    const command = `wp ${args.command}`
    if (!args.execute) return `Dry run only. Command:\n\n\`${command}\`\n\nSet execute=true to run it.`

    await context.ask({ permission: "bash", patterns: [command], always: [], metadata: {} })
    const proc = Bun.spawn(["wp", ...args.command.split(/\s+/)], {
      cwd: args.cwd ?? context.directory,
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
