import { existsSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { $ } from "bun"

const server = path.join(import.meta.dir, "../../nexusflow/dist/node/node.js")
const inputs = [
  path.join(import.meta.dir, "../../nexusflow/src"),
  path.join(import.meta.dir, "../../nexusflow/migration"),
  path.join(import.meta.dir, "../../nexusflow/script/build-node.ts"),
]

if (existsSync(server) && Math.max(...inputs.map(newest)) <= statSync(server).mtimeMs) {
  console.log("nexusflow node bundle is current")
  process.exit(0)
}

await $`bun --cwd ../nexusflow script/build-node.ts`

function newest(target: string): number {
  const stat = statSync(target)
  if (!stat.isDirectory()) return stat.mtimeMs
  return Math.max(stat.mtimeMs, ...readdirSync(target).map((item) => newest(path.join(target, item))))
}
