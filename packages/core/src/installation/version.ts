declare global {
  const NEXUSFLOW_VERSION: string
  const NEXUSFLOW_CHANNEL: string
}

export const InstallationVersion = typeof NEXUSFLOW_VERSION === "string" ? NEXUSFLOW_VERSION : "local"
export const InstallationChannel = typeof NEXUSFLOW_CHANNEL === "string" ? NEXUSFLOW_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
