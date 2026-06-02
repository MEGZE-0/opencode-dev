import { Button } from "@nexusflow/ui/button"
import { IconButton } from "@nexusflow/ui/icon-button"
import { TextField } from "@nexusflow/ui/text-field"
import { createEffect, createMemo, For, onCleanup, onMount, Show } from "solid-js"
import { createStore, produce } from "solid-js/store"
import type * as Monaco from "monaco-editor"

export type EditorFile = {
  path: string
  content: string
  language?: string
  dirty?: boolean
}

export type EditorCommand = "create" | "delete" | "rename" | "move"

export type EditorTabsProps = {
  files: EditorFile[]
  activePath?: string
  onChange?: (file: EditorFile) => void
  onSave?: (file: EditorFile) => Promise<void> | void
  onCommand?: (command: EditorCommand, path: string) => void
  onInlinePrompt?: (input: { path: string; selection: string; instruction: string }) => Promise<string> | string
  onTabSelect?: (path: string) => void
  onTabClose?: (path: string) => void
}

export function EditorTabs(props: EditorTabsProps) {
  let container: HTMLDivElement | undefined
  const [store, setStore] = createStore({
    files: props.files,
    activePath: props.activePath ?? props.files[0]?.path,
    menu: undefined as { path: string; x: number; y: number } | undefined,
    inline: {
      open: false,
      instruction: "",
      preview: "",
      loading: false,
    },
  })
  const active = createMemo(() => store.files.find((file) => file.path === store.activePath) ?? store.files[0])

  let monaco: typeof Monaco | undefined
  let editor: Monaco.editor.IStandaloneCodeEditor | undefined
  let model: Monaco.editor.ITextModel | undefined
  let modelPath: string | undefined

  createEffect(() => {
    setStore("files", props.files)
    if (props.activePath) setStore("activePath", props.activePath)
  })

  onMount(() => {
    void import("monaco-editor").then((loaded) => {
      monaco = loaded
      const file = active()
      if (!container || !file) return
      modelPath = file.path
      model = loaded.editor.createModel(file.content, file.language ?? languageFromPath(file.path))
      editor = loaded.editor.create(container, {
        model,
        automaticLayout: true,
        fontFamily: "JetBrainsMono Nerd Font Mono, Fira Code, monospace",
        fontSize: 13,
        minimap: { enabled: false },
        theme: "vs-dark",
      })
      editor.addCommand(loaded.KeyMod.CtrlCmd | loaded.KeyCode.KeyK, () => {
        setStore("inline", "open", true)
        setStore("inline", "preview", "")
      })
      editor.onDidChangeModelContent(() => {
        const current = active()
        const value = editor?.getValue()
        if (!current || value === undefined) return
        setStore(
          "files",
          (file) => file.path === current.path,
          produce((file) => {
            file.content = value
            file.dirty = value !== props.files.find((item) => item.path === current.path)?.content
          }),
        )
        props.onChange?.({ ...current, content: value, dirty: true })
      })
    })
  })

  createEffect(() => {
    const file = active()
    if (!file || !monaco || !editor) return
    if (modelPath === file.path) return
    modelPath = file.path
    model?.dispose()
    model = monaco.editor.createModel(file.content, file.language ?? languageFromPath(file.path))
    editor.setModel(model)
  })

  onCleanup(() => {
    editor?.dispose()
    model?.dispose()
  })

  function save() {
    const file = active()
    if (!file) return
    void Promise.resolve(props.onSave?.(file)).then(() => {
      setStore(
        "files",
        (item) => item.path === file.path,
        produce((item) => {
          item.dirty = false
        }),
      )
    })
  }

  function selectedText() {
    const selection = editor?.getSelection()
    if (!selection || !model) return ""
    return model.getValueInRange(selection)
  }

  function runInlinePrompt() {
    const file = active()
    if (!file || !props.onInlinePrompt) return
    setStore("inline", "loading", true)
    Promise.resolve(
      props.onInlinePrompt({
        path: file.path,
        selection: selectedText(),
        instruction: store.inline.instruction,
      }),
    )
      .then((preview) => setStore("inline", "preview", preview))
      .finally(() => setStore("inline", "loading", false))
  }

  function command(commandName: EditorCommand) {
    const path = store.menu?.path
    if (!path) return
    props.onCommand?.(commandName, path)
    setStore("menu", undefined)
  }

  return (
    <section class="relative flex h-full min-h-0 flex-col overflow-hidden bg-background-base text-text-base">
      <div class="flex h-9 shrink-0 items-center gap-1 border-b border-border-base bg-background-weak px-2">
        <For each={store.files}>
          {(file) => (
            <button
              type="button"
              class="group flex h-7 max-w-56 items-center gap-2 rounded-md px-2 text-12-medium text-text-weak hover:bg-background-interactive-weak"
              classList={{
                "bg-background-interactive-base text-text-strong hermes-glow": file.path === active()?.path,
              }}
              onClick={() => {
                setStore("activePath", file.path)
                props.onTabSelect?.(file.path)
              }}
              onContextMenu={(event) => {
                event.preventDefault()
                setStore("menu", { path: file.path, x: event.clientX, y: event.clientY })
              }}
            >
              <span class="truncate">{file.path.split(/[\\/]/).at(-1)}</span>
              <Show when={file.dirty}>
                <span class="size-1.5 rounded-full bg-[#00f0ff]" />
              </Show>
              <IconButton
                type="button"
                icon="close-small"
                variant="ghost"
                size="small"
                class="ml-1 opacity-0 group-hover:opacity-100 hover:bg-background-interactive-strong"
                onClick={(e) => {
                  e.stopPropagation()
                  props.onTabClose?.(file.path)
                }}
              />
            </button>
          )}
        </For>
        <div class="ml-auto flex items-center gap-1">
          <IconButton
            type="button"
            icon="code"
            variant="ghost"
            aria-label="Open inline prompt"
            onClick={() => setStore("inline", "open", true)}
          />
          <IconButton type="button" icon="check" variant="ghost" aria-label="Save active file" onClick={save} />
        </div>
      </div>

      <div ref={container} class="min-h-0 flex-1 hermes-terminal-overlay" />

      <Show when={store.inline.open}>
        <div class="absolute inset-x-3 bottom-3 grid gap-2 rounded-lg border border-border-base bg-background-weak p-3 shadow-lg hermes-glow">
          <div class="flex items-center gap-2">
            <TextField
              label="Inline AI"
              hideLabel
              value={store.inline.instruction}
              onChange={(value) => setStore("inline", "instruction", value)}
              placeholder="Ask NexusFlow to edit the selection"
            />
            <Button type="button" variant="primary" disabled={store.inline.loading} onClick={runInlinePrompt}>
              {store.inline.loading ? "Running" : "Apply"}
            </Button>
            <IconButton
              type="button"
              icon="close-small"
              variant="ghost"
              aria-label="Close inline prompt"
              onClick={() => setStore("inline", "open", false)}
            />
          </div>
          <Show when={store.inline.preview}>
            <pre class="max-h-48 overflow-auto rounded-md border border-border-weak bg-background-base p-2 text-12-regular text-text-base">
              {store.inline.preview}
            </pre>
          </Show>
        </div>
      </Show>

      <Show when={store.menu}>
        {(menu) => (
          <div
            class="fixed z-50 grid min-w-36 gap-1 rounded-md border border-border-base bg-background-weak p-1 shadow-lg hermes-glow"
            style={{ left: `${menu().x}px`, top: `${menu().y}px` }}
          >
            <Button type="button" size="small" variant="ghost" icon="plus-small" onClick={() => command("create")}>
              Create
            </Button>
            <Button type="button" size="small" variant="ghost" icon="edit" onClick={() => command("rename")}>
              Rename
            </Button>
            <Button type="button" size="small" variant="ghost" icon="branch" onClick={() => command("move")}>
              Move
            </Button>
            <Button type="button" size="small" variant="ghost" icon="trash" onClick={() => command("delete")}>
              Delete
            </Button>
          </div>
        )}
      </Show>
    </section>
  )
}

function languageFromPath(path: string) {
  const extension = path.split(".").at(-1)
  if (extension === "ts" || extension === "tsx") return "typescript"
  if (extension === "js" || extension === "jsx") return "javascript"
  if (extension === "json" || extension === "jsonc") return "json"
  if (extension === "css") return "css"
  if (extension === "md" || extension === "mdx") return "markdown"
  return "plaintext"
}
