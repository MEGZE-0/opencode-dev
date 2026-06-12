export interface ToolErrorResult {
  ok: false
  error: {
    type: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface DryRunResult {
  ok: true
  dryRun: true
  description: string
  inputs: Record<string, unknown>
}

export interface ReportSection {
  title: string
  items: string[]
}

export class CredentialMissingError extends Error {
  constructor(
    readonly envVar: string,
    readonly docUrl: string,
  ) {
    super(`Missing credential: ${envVar}. Get it from ${docUrl}`)
  }
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly body: string,
  ) {
    super(`HTTP ${status} from ${url}`)
  }
}

export class ValidationError extends Error {
  constructor(message: string, readonly details: Record<string, unknown> = {}) {
    super(message)
  }
}

export function loadCredential(envVar: string, docUrl: string) {
  const value = process.env[envVar]
  if (value) return value
  throw new CredentialMissingError(envVar, docUrl)
}

export function missingCredential(envVar: string, docUrl: string): ToolErrorResult {
  return {
    ok: false,
    error: {
      type: "CredentialMissingError",
      message: `Missing ${envVar}. Create or retrieve it from ${docUrl}.`,
      details: { envVar, docUrl },
    },
  }
}

export function toolError(error: unknown): ToolErrorResult {
  if (error instanceof CredentialMissingError) return missingCredential(error.envVar, error.docUrl)
  if (error instanceof HttpError) {
    return {
      ok: false,
      error: {
        type: "HttpError",
        message: error.message,
        details: { status: error.status, url: error.url, body: error.body.slice(0, 1000) },
      },
    }
  }
  if (error instanceof ValidationError) {
    return {
      ok: false,
      error: { type: "ValidationError", message: error.message, details: error.details },
    }
  }
  return {
    ok: false,
    error: { type: "UnknownError", message: error instanceof Error ? error.message : String(error) },
  }
}

export function dryRun(description: string, inputs: Record<string, unknown>): DryRunResult {
  return { ok: true, dryRun: true, description, inputs }
}

export function validateUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function json(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function asJson(value: unknown) {
  return json(value)
}

export function markdownList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n")
}

export function envStatus(keys: string[]) {
  return keys.map((key) => `- ${key}: ${process.env[key] ? "set" : "missing"}`).join("\n")
}

export function formatReport(sections: ReportSection[]) {
  return sections.map((section) => [`## ${section.title}`, "", ...section.items.map((item) => `- ${item}`)].join("\n")).join("\n\n")
}

export function httpClient(baseUrl: string, headers: Record<string, string> = {}) {
  return {
    async get(path: string, init?: RequestInit) {
      return request(new URL(path, baseUrl).toString(), { ...init, method: "GET", headers: { ...headers, ...init?.headers } })
    },
    async post(path: string, body: unknown, init?: RequestInit) {
      return request(new URL(path, baseUrl).toString(), {
        ...init,
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers, ...init?.headers },
        body: JSON.stringify(body),
      })
    },
  }
}

async function request(url: string, init: RequestInit, attempt = 1): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await fetch(url, { ...init, signal: controller.signal })
    const text = await response.text()
    if (!response.ok) {
      if (attempt < 3 && response.status >= 500) {
        await wait(attempt)
        return request(url, init, attempt + 1)
      }
      throw new HttpError(response.status, url, text)
    }
    if (!text) return {}
    try {
      return JSON.parse(text) as unknown
    } catch {
      return { text }
    }
  } catch (error) {
    if (attempt < 3 && !(error instanceof HttpError)) {
      await wait(attempt)
      return request(url, init, attempt + 1)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function wait(attempt: number) {
  return new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt + Math.floor(Math.random() * 100)))
}

export function normalizeHex(input: string) {
  const value = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value
      .split("")
      .map((part) => `${part}${part}`)
      .join("")}`.toUpperCase()
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) return `#${value.toUpperCase()}`
  throw new ValidationError("Expected a 3- or 6-digit hex color.", { input })
}

export function hexToRgb(hex: string) {
  const value = normalizeHex(hex).slice(1)
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

export function rgbToHex(input: { r: number; g: number; b: number }) {
  return `#${[input.r, input.g, input.b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`
}

export function mix(hex: string, target: "#FFFFFF" | "#000000", amount: number) {
  const source = hexToRgb(hex)
  const next = hexToRgb(target)
  return rgbToHex({
    r: source.r + (next.r - source.r) * amount,
    g: source.g + (next.g - source.g) * amount,
    b: source.b + (next.b - source.b) * amount,
  })
}

export function contrastRatio(hexA: string, hexB: string) {
  const luminance = (hex: string) => {
    const rgb = hexToRgb(hex)
    const values = [rgb.r, rgb.g, rgb.b].map((value) => {
      const channel = value / 255
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * values[0]! + 0.7152 * values[1]! + 0.0722 * values[2]!
  }
  const light = Math.max(luminance(hexA), luminance(hexB))
  const dark = Math.min(luminance(hexA), luminance(hexB))
  return Number(((light + 0.05) / (dark + 0.05)).toFixed(2))
}
