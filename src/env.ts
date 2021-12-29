export class Env {
  static get skyWayApiKey(): string | null {
    return process.env.VUE_APP_SKY_WAY_API_KEY ?? null
  }
  static get commitHash(): string | null {
    return process.env.VUE_APP_COMMIT_HASH ?? null
  }
}
