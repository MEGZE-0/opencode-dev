import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.NEXUSFLOW_CHANNEL ?? "dev"}`

await $`cd ../nexusflow && bun script/build.ts`
await $`cd ../nexusflow && bun script/build-node.ts`
