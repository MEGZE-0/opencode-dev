const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://nexusflow.ai" : `https://${stage}.nexusflow.ai`,
  console: stage === "production" ? "https://nexusflow.ai/auth" : `https://${stage}.nexusflow.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/nexusflow",
  discord: "https://nexusflow.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
