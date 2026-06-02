import { useServerSync } from "@/context/server-sync"
import { decode64 } from "@/utils/base64"
import type { Provider } from "@nexusflow/sdk/v2"
import { useParams } from "@solidjs/router"
import { createMemo } from "solid-js"

export const popularProviders = [
  "nexusflow",
  "nexusflow-go",
  "anthropic",
  "github-copilot",
  "openai",
  "google",
  "openrouter",
  "vercel",
]
const popularProviderSet = new Set(popularProviders)

export function useProviders() {
  const serverSync = useServerSync()
  const params = useParams()
  const dir = createMemo(() => decode64(params.dir) ?? "")
  const providers = () => {
    if (dir()) {
      const [projectStore] = serverSync.child(dir())
      if (projectStore.provider_ready) return projectStore.provider
    }
    return serverSync.data.provider
  }
  return {
    all: () => providers().all,
    default: () => providers().default,
    popular: () =>
      Array.from(providers().all.values()).filter((provider: Provider) => popularProviderSet.has(provider.id)),
    connected: () => {
      const connected = new Set(providers().connected)
      return Array.from(providers().all.values()).filter((provider: Provider) => connected.has(provider.id))
    },
    paid: () => {
      const connected = new Set(providers().connected)
      return Array.from(providers().all).filter(
        ([id]) =>
          connected.has(id) &&
          (id !== "nexusflow" ||
            Object.values(providers().all.get(id)?.models ?? {}).some((model) => model.cost?.input)),
      )
    },
  }
}
