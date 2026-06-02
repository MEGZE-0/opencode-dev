import type { ProviderID, ModelID } from "@/provider/schema"

export interface Task {
  readonly prompt: string
  readonly description: string
  readonly agent: string
  readonly background?: boolean
  readonly model?: {
    readonly providerID: ProviderID
    readonly modelID: ModelID
  }
}

export interface PlanInput {
  readonly text: string
  readonly agent: string
  readonly model?: {
    readonly providerID: ProviderID
    readonly modelID: ModelID
  }
  readonly background: boolean
}

const explicitParallelIntent = /\b(parallel|concurrent|simultaneous|background|independent|split(?:\s+up)?|decompose)\b/i
const taskishLine = /^\s*(?:[-*]|\d+[.)])\s+(.+?)\s*$/
const sentenceBoundary = /(?:\s*;\s*|\s+\band\b\s+)/i
const actionStart = /^(?:audit|build|check|create|design|find|fix|implement|inspect|list|locate|read|refactor|review|test|update|write)\b/i

export function plan(input: PlanInput) {
  const items = extractItems(input.text)
  if (items.length < 2) return []
  if (!explicitParallelIntent.test(input.text) && !hasTaskList(input.text)) return []

  return items.slice(0, 4).map((item) => ({
    prompt: [
      item,
      "",
      "Return concise findings, changed files if any, validation performed, and unresolved risks.",
    ].join("\n"),
    description: describe(item),
    agent: input.agent,
    background: input.background,
    ...(input.model ? { model: input.model } : {}),
  }))
}

function extractItems(text: string) {
  const list = text
    .split(/\r?\n/)
    .map((line) => line.match(taskishLine)?.[1]?.trim())
    .filter((item): item is string => Boolean(item && actionStart.test(item)))
  if (list.length > 1) return list

  if (!explicitParallelIntent.test(text)) return []
  return text
    .split(sentenceBoundary)
    .map((item) => item.trim())
    .filter((item) => item.length > 12 && actionStart.test(item))
}

function hasTaskList(text: string) {
  return text
    .split(/\r?\n/)
    .filter((line) => taskishLine.test(line))
    .length > 1
}

function describe(text: string) {
  return text
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .join(" ")
    .toLowerCase()
}

export * as AgentScheduler from "./scheduler"
