interface ImportMetaEnv {
  readonly NEXUSFLOW_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:nexusflow-server" {
  export namespace Server {
    export const listen: typeof import("../../../nexusflow/dist/types/src/node").Server.listen
    export type Listener = import("../../../nexusflow/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../nexusflow/dist/types/src/node").Config.get
    export type Info = import("../../../nexusflow/dist/types/src/node").Config.Info
  }
  export namespace Log {
    export const init: typeof import("../../../nexusflow/dist/types/src/node").Log.init
  }
  export namespace Database {
    export const getPath: typeof import("../../../nexusflow/dist/types/src/node").Database.getPath
    export const Client: typeof import("../../../nexusflow/dist/types/src/node").Database.Client
  }
  export namespace JsonMigration {
    export type Progress = import("../../../nexusflow/dist/types/src/node").JsonMigration.Progress
    export const run: typeof import("../../../nexusflow/dist/types/src/node").JsonMigration.run
  }
  export const bootstrap: typeof import("../../../nexusflow/dist/types/src/node").bootstrap
}
