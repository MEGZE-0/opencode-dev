import { Config, ConfigProvider, Context, Effect, Layer, Option } from "effect"
import { ConfigService } from "@/effect/config-service"

const bool = (name: string) => Config.boolean(name).pipe(Config.withDefault(false))
const positiveInteger = (name: string) =>
  Config.number(name).pipe(
    Config.map((value) => (Number.isInteger(value) && value > 0 ? value : undefined)),
    Config.orElse(() => Config.succeed(undefined)),
  )
const experimental = bool("NEXUSFLOW_EXPERIMENTAL")
const enabledByExperimental = (name: string) =>
  Config.all({ experimental, enabled: Config.boolean(name).pipe(Config.option) }).pipe(
    Config.map((flags) => Option.getOrElse(flags.enabled, () => flags.experimental)),
  )

export class Service extends ConfigService.Service<Service>()("@nexusflow/RuntimeFlags", {
  autoShare: bool("NEXUSFLOW_AUTO_SHARE"),
  pure: bool("NEXUSFLOW_PURE"),
  disableDefaultPlugins: bool("NEXUSFLOW_DISABLE_DEFAULT_PLUGINS"),
  disableChannelDb: bool("NEXUSFLOW_DISABLE_CHANNEL_DB"),
  disableEmbeddedWebUi: bool("NEXUSFLOW_DISABLE_EMBEDDED_WEB_UI"),
  disableExternalSkills: bool("NEXUSFLOW_DISABLE_EXTERNAL_SKILLS"),
  disableLspDownload: bool("NEXUSFLOW_DISABLE_LSP_DOWNLOAD"),
  skipMigrations: bool("NEXUSFLOW_SKIP_MIGRATIONS"),
  disableClaudeCodePrompt: Config.all({
    broad: bool("NEXUSFLOW_DISABLE_CLAUDE_CODE"),
    direct: bool("NEXUSFLOW_DISABLE_CLAUDE_CODE_PROMPT"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  disableClaudeCodeSkills: Config.all({
    broad: bool("NEXUSFLOW_DISABLE_CLAUDE_CODE"),
    direct: bool("NEXUSFLOW_DISABLE_CLAUDE_CODE_SKILLS"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  enableExa: Config.all({
    experimental,
    enabled: bool("NEXUSFLOW_ENABLE_EXA"),
    legacy: bool("NEXUSFLOW_EXPERIMENTAL_EXA"),
  }).pipe(Config.map((flags) => flags.experimental || flags.enabled || flags.legacy)),
  enableParallel: Config.all({
    enabled: bool("NEXUSFLOW_ENABLE_PARALLEL"),
    legacy: bool("NEXUSFLOW_EXPERIMENTAL_PARALLEL"),
  }).pipe(Config.map((flags) => flags.enabled || flags.legacy)),
  enableExperimentalModels: bool("NEXUSFLOW_ENABLE_EXPERIMENTAL_MODELS"),
  enableQuestionTool: bool("NEXUSFLOW_ENABLE_QUESTION_TOOL"),
  experimentalScout: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_SCOUT"),
  experimentalBackgroundSubagents: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_BACKGROUND_SUBAGENTS"),
  experimentalLspTy: bool("NEXUSFLOW_EXPERIMENTAL_LSP_TY"),
  experimentalLspTool: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_LSP_TOOL"),
  experimentalOxfmt: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_OXFMT"),
  experimentalPlanMode: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_PLAN_MODE"),
  experimentalEventSystem: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_EVENT_SYSTEM"),
  experimentalWorkspaces: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_WORKSPACES"),
  experimentalIconDiscovery: enabledByExperimental("NEXUSFLOW_EXPERIMENTAL_ICON_DISCOVERY"),
  outputTokenMax: positiveInteger("NEXUSFLOW_EXPERIMENTAL_OUTPUT_TOKEN_MAX"),
  bashDefaultTimeoutMs: positiveInteger("NEXUSFLOW_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS"),
  experimentalNativeLlm: bool("NEXUSFLOW_EXPERIMENTAL_NATIVE_LLM"),
  experimentalWebSockets: bool("NEXUSFLOW_EXPERIMENTAL_WEBSOCKETS"),
  client: Config.string("NEXUSFLOW_CLIENT").pipe(Config.withDefault("cli")),
}) {}

export type Info = Context.Service.Shape<typeof Service>

const emptyConfigLayer = Service.defaultLayer.pipe(
  Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown({}))),
  Layer.orDie,
)

export const layer = (overrides: Partial<Info> = {}) =>
  Layer.effect(
    Service,
    Effect.gen(function* () {
      const flags = yield* Service
      return Service.of({ ...flags, ...overrides })
    }),
  ).pipe(Layer.provide(emptyConfigLayer))

export const defaultLayer = Service.defaultLayer.pipe(Layer.orDie)

export * as RuntimeFlags from "./runtime-flags"
