import { Creator } from "@/creator"
import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { InstanceHttpApi } from "../api"

export const creatorHandlers = HttpApiBuilder.group(InstanceHttpApi, "creator", (handlers) =>
  Effect.gen(function* () {
    const creator = yield* Creator.Service

    return handlers.handle("draft", (ctx) => creator.draft(ctx.payload))
  }),
)
