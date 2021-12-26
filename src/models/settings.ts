export interface ISettings {
  apiKey?: string | null
  myPeerId?: string | null
  theirPeerId?: string | null
}

export class Settings {
  constructor(
    public apiKey: string | null,
    public myPeerId: string | null,
    public theirPeerId: string | null,
  ) {}

  public static createDefault(): Settings {
    return new Settings(null, null, null)
  }

  public static create(data: ISettings): Settings {
    return new Settings(data.apiKey ?? null, data.myPeerId ?? null, data.theirPeerId ?? null)
  }

  toJson(): ISettings {
    return {
      apiKey: this.apiKey,
      myPeerId: this.myPeerId,
      theirPeerId: this.theirPeerId,
    }
  }
}
