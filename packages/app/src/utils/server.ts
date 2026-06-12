import { createOpencodeClient } from "@nexusflow/sdk/v2/client"
import type { ServerConnection } from "@/context/server"
import { decode64 } from "@/utils/base64"

export function authTokenFromCredentials(input: { username?: string; password: string }) {
  return btoa(`${input.username ?? "nexusflow"}:${input.password}`)
}

export function authFromToken(token: string | null) {
  const decoded = decode64(token ?? undefined)
  if (!decoded) return
  const separator = decoded.indexOf(":")
  if (separator === -1) return
  return {
    username: decoded.slice(0, separator) || "nexusflow",
    password: decoded.slice(separator + 1),
  }
}

export function createSdkForServer({
  server,
  ...config
}: Omit<NonNullable<Parameters<typeof createOpencodeClient>[0]>, "baseUrl"> & {
  server: ServerConnection.HttpBase
}) {
  // Embed credentials as ?auth_token= appended to each request URL via a
  // request interceptor. Chromium's renderer-process fetch silently strips the
  // Authorization header on cross-origin requests (file:// → http://127.0.0.1:PORT),
  // but query parameters are always preserved. The nexusflow server accepts
  // ?auth_token=<base64> as a first-class auth mechanism.
  const token = server.password
    ? authTokenFromCredentials({ username: server.username, password: server.password })
    : null

  const fetchWithAuth = ((input, init) => {
    const defaultFetch = config.fetch ? config.fetch.bind(globalThis) : globalThis.fetch.bind(globalThis)
    if (!token) return defaultFetch(input as any, init)

    if (input instanceof Request) {
      const url = new URL(input.url)
      url.searchParams.set("auth_token", token)

      const newInit: RequestInit & { duplex?: string } = {
        method: input.method,
        headers: input.headers,
        body: input.body,
        mode: input.mode,
        credentials: input.credentials,
        cache: input.cache,
        redirect: input.redirect,
        referrer: input.referrer,
        integrity: input.integrity,
        signal: input.signal,
      }
      if (input.body) newInit.duplex = "half"

      return defaultFetch(url.toString() as any, newInit)
    }

    const url = new URL(typeof input === "string" ? input : input.toString())
    url.searchParams.set("auth_token", token)
    return defaultFetch(url.toString() as any, init)
  }) as typeof fetch

  const client = createOpencodeClient({
    ...config,
    fetch: fetchWithAuth,
    headers: {
      ...(config.headers instanceof Headers ? Object.fromEntries(config.headers.entries()) : config.headers),
    },
    baseUrl: server.url,
  })

  return client
}
