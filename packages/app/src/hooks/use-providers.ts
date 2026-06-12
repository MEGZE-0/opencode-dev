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

function freeModels(provider: Provider) {
  if (provider.id !== "nexusflow") return {}
  return Object.fromEntries(
    Object.entries(provider.models).filter(
      ([id, model]) =>
        model.status !== "deprecated" && (!model.cost || model.cost.input === 0 || id.toLowerCase().includes("free")),
    ),
  )
}

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
      return Array.from(providers().all.values()).flatMap((provider: Provider) => {
        if (connected.has(provider.id)) return [provider]
        const models = freeModels(provider)
        if (Object.keys(models).length === 0) return []
        return [{ ...provider, models }]
      })
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
