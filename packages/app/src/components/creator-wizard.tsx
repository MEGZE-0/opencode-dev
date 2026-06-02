import { Button } from "@nexusflow/ui/button"
import { TextField } from "@nexusflow/ui/text-field"
import { showToast } from "@nexusflow/ui/toast"
import { createStore } from "solid-js/store"
import { For, Show } from "solid-js"
import { useSDK } from "@/context/sdk"

type CreatorKind = "agent" | "skill"

type DraftFile = {
  path: string
  content: string
}

type DraftResult = {
  kind: CreatorKind
  name: string
  model: {
    providerID: string
    modelID: string
    tier: "compact" | "standard"
  }
  files: DraftFile[]
  written: boolean
}

export function CreatorWizard() {
  const sdk = useSDK()
  const [store, setStore] = createStore({
    kind: "skill" as CreatorKind,
    name: "",
    description: "",
    write: false,
    loading: false,
    result: undefined as DraftResult | undefined,
  })

  const canSubmit = () => store.name.trim().length > 0 && store.description.trim().length > 0 && !store.loading

  function submit() {
    if (!canSubmit()) return
    setStore("loading", true)
    fetch(`${sdk.url}/creator/draft?directory=${encodeURIComponent(sdk.directory)}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: store.kind,
        name: store.name,
        description: store.description,
        write: store.write,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        return response.json() as Promise<DraftResult>
      })
      .then((result) => {
        setStore("result", result)
        showToast({
          variant: "success",
          title: result.written ? "Creator files written" : "Creator draft generated",
          description: `${result.name} using ${result.model.providerID}/${result.model.modelID}`,
        })
      })
      .catch((error: unknown) => {
        showToast({
          variant: "error",
          title: "Creator request failed",
          description: error instanceof Error ? error.message : String(error),
        })
      })
      .finally(() => setStore("loading", false))
  }

  return (
    <section class="flex h-full min-h-0 flex-col gap-4 bg-background-base p-4 text-text-base">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h2 class="text-16-medium text-text-strong">NexusFlow Creator</h2>
          <p class="mt-1 text-12-regular text-text-weak">Active-model agent and skill drafts</p>
        </div>
        <div class="hermes-thinking-ring" style={`--hermes-thinking-ring-speed: ${store.loading ? "520ms" : "1400ms"}`} />
      </div>

      <div class="flex gap-2">
        <Button
          type="button"
          size="small"
          variant={store.kind === "skill" ? "primary" : "secondary"}
          onClick={() => setStore("kind", "skill")}
        >
          Skill
        </Button>
        <Button
          type="button"
          size="small"
          variant={store.kind === "agent" ? "primary" : "secondary"}
          onClick={() => setStore("kind", "agent")}
        >
          Agent
        </Button>
      </div>

      <div class="grid gap-3">
        <TextField label="Name" value={store.name} onChange={(value) => setStore("name", value)} />
        <TextField
          label="Description"
          multiline
          value={store.description}
          onChange={(value) => setStore("description", value)}
        />
        <label class="flex items-center gap-2 text-12-regular text-text-weak">
          <input
            type="checkbox"
            checked={store.write}
            onChange={(event) => setStore("write", event.currentTarget.checked)}
          />
          Write files into this workspace
        </label>
      </div>

      <Button type="button" variant="primary" size="large" disabled={!canSubmit()} onClick={submit}>
        {store.loading ? "Generating" : "Generate"}
      </Button>

      <Show when={store.result}>
        {(result) => (
          <div class="min-h-0 flex-1 overflow-auto rounded-lg border border-border-base bg-background-weak hermes-glow">
            <div class="sticky top-0 flex items-center justify-between border-b border-border-weak bg-background-weak px-3 py-2">
              <span class="text-12-medium text-text-strong">{result().name}</span>
              <span class="text-11-regular text-text-weak">{result().model.tier}</span>
            </div>
            <div class="grid gap-3 p-3">
              <For each={result().files}>
                {(file) => (
                  <article class="rounded-md border border-border-weak bg-background-base">
                    <div class="border-b border-border-weak px-3 py-2 text-11-medium text-text-weak">{file.path}</div>
                    <pre class="max-h-72 overflow-auto p-3 text-12-regular text-text-base">{file.content}</pre>
                  </article>
                )}
              </For>
            </div>
          </div>
        )}
      </Show>
    </section>
  )
}
