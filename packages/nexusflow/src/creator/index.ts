import path from "path"
import { AppFileSystem } from "@nexusflow/core/filesystem"
import { Context, Effect, Layer, Schema } from "effect"
import { InstanceState } from "@/effect/instance-state"
import { Provider } from "@/provider/provider"
import { Skill } from "@/skill"

export const Kind = Schema.Literals(["agent", "skill"]).annotate({ identifier: "CreatorKind" })
export type Kind = Schema.Schema.Type<typeof Kind>

export const DraftInput = Schema.Struct({
  kind: Kind,
  name: Schema.String,
  description: Schema.String,
  write: Schema.optional(Schema.Boolean),
}).annotate({ identifier: "CreatorDraftInput" })
export type DraftInput = Schema.Schema.Type<typeof DraftInput>

export const DraftFile = Schema.Struct({
  path: Schema.String,
  content: Schema.String,
}).annotate({ identifier: "CreatorDraftFile" })
export type DraftFile = Schema.Schema.Type<typeof DraftFile>

export const DraftResult = Schema.Struct({
  kind: Kind,
  name: Schema.String,
  model: Schema.Struct({
    providerID: Schema.String,
    modelID: Schema.String,
    tier: Schema.Literals(["compact", "standard"]),
  }),
  files: Schema.Array(DraftFile),
  written: Schema.Boolean,
}).annotate({ identifier: "CreatorDraftResult" })
export type DraftResult = Schema.Schema.Type<typeof DraftResult>

export interface Interface {
  readonly draft: (input: DraftInput) => Effect.Effect<DraftResult>
}

export class Service extends Context.Service<Service, Interface>()("@nexusflow/Creator") {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service
    const provider = yield* Provider.Service
    const skill = yield* Skill.Service

    const draft = Effect.fn("Creator.draft")(function* (input: DraftInput) {
      const ctx = yield* InstanceState.context
      const model = yield* provider.defaultModel().pipe(Effect.orDie)
      const slug = toSlug(input.name)
      const tier = modelTier(model.modelID)
      const files =
        input.kind === "agent"
          ? agentFiles(ctx.worktree, slug, input.description, tier)
          : skillFiles(ctx.worktree, slug, input.description, tier)

      if (input.write === true) {
        yield* Effect.forEach(files, (file) => fs.writeWithDirs(file.path, file.content), {
          concurrency: "unbounded",
          discard: true,
        }).pipe(Effect.orDie)
        if (input.kind === "skill") yield* skill.reload()
      }

      return {
        kind: input.kind,
        name: slug,
        model: {
          providerID: model.providerID,
          modelID: model.modelID,
          tier,
        },
        files,
        written: input.write === true,
      }
    })

    return Service.of({ draft })
  }),
)

export const defaultLayer = layer.pipe(
  Layer.provide(AppFileSystem.defaultLayer),
  Layer.provide(Provider.defaultLayer),
  Layer.provide(Skill.defaultLayer),
)

function toSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "generated"
}

function modelTier(modelID: string): "compact" | "standard" {
  return /\b(3b|7b|8b|mini|small|flash|haiku|lite)\b/i.test(modelID) ? "compact" : "standard"
}

function agentFiles(worktree: string, name: string, description: string, tier: "compact" | "standard") {
  return [
    {
      path: path.join(worktree, ".nexusflow", "agents", `${name}.md`),
      content: [
        "---",
        `description: ${JSON.stringify(description || `Generated ${name} agent`)}`,
        "mode: subagent",
        "tools:",
        "  read: true",
        "  grep: true",
        "  glob: true",
        "  bash: false",
        "---",
        "",
        tier === "compact"
          ? "Keep responses short, inspect only the highest-signal files, and return concrete findings."
          : "Work systematically, gather enough context before acting, and return concrete findings with file references and validation notes.",
        "",
      ].join("\n"),
    },
  ]
}

function skillFiles(worktree: string, name: string, description: string, tier: "compact" | "standard") {
  return [
    {
      path: path.join(worktree, "skills", name, "SKILL.md"),
      content: [
        "---",
        `name: ${JSON.stringify(name)}`,
        `description: ${JSON.stringify(description || `Use this skill for ${name} workflows.`)}`,
        "---",
        "",
        "Use this skill when the request matches the description.",
        tier === "compact"
          ? "Prefer one direct command and summarize only the result."
          : "Inspect the local context first, choose the smallest reliable command sequence, and summarize commands, outputs, and follow-up risks.",
        "",
        "If helper scripts are needed, run them from this skill's `scripts/` directory.",
        "",
      ].join("\n"),
    },
    {
      path: path.join(worktree, "skills", name, "scripts", "README.md"),
      content: ["# Helper Scripts", "", "Place small workflow-specific scripts here.", ""].join("\n"),
    },
  ]
}

export * as Creator from "."
