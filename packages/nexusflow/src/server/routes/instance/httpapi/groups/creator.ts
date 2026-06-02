import { Creator } from "@/creator"
import { HttpApi, HttpApiEndpoint, HttpApiGroup, OpenApi } from "effect/unstable/httpapi"
import { Authorization } from "../middleware/authorization"
import { InstanceContextMiddleware } from "../middleware/instance-context"
import { WorkspaceRoutingMiddleware, WorkspaceRoutingQuery } from "../middleware/workspace-routing"
import { described } from "./metadata"

const root = "/creator"

export const CreatorApi = HttpApi.make("creator")
  .add(
    HttpApiGroup.make("creator")
      .add(
        HttpApiEndpoint.post("draft", `${root}/draft`, {
          query: WorkspaceRoutingQuery,
          payload: Creator.DraftInput,
          success: described(Creator.DraftResult, "Generated creator draft"),
        }).annotateMerge(
          OpenApi.annotations({
            identifier: "creator.draft",
            summary: "Draft agent or skill",
            description: "Generate active-model-aware NexusFlow agent or skill files, optionally writing them to disk.",
          }),
        ),
      )
      .annotateMerge(
        OpenApi.annotations({
          title: "creator",
          description: "Agent and skill creation routes.",
        }),
      )
      .middleware(InstanceContextMiddleware)
      .middleware(WorkspaceRoutingMiddleware)
      .middleware(Authorization),
  )
  .annotateMerge(
    OpenApi.annotations({
      title: "opencode experimental HttpApi",
      version: "0.0.1",
      description: "Experimental HttpApi surface for selected instance routes.",
    }),
  )
