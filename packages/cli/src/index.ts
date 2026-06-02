#!/usr/bin/env bun

import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as NodeServices from "@effect/platform-node/NodeServices"
import * as Effect from "effect/Effect"
import * as Command from "effect/unstable/cli/Command"

const cli = Command.make("nexusflow", {}, () => Effect.void).pipe(
  Command.withDescription("NexusFlow command line interface"),
)

Command.run(cli, { version: "local" }).pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain)
