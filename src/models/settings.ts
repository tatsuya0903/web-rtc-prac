export interface ISettings {
  apiKey?: string | null
  myPeerId?: string | null
  yourPeerId?: string | null
  roomName?: string | null
}

export class Settings {
  constructor(
    public apiKey: string | null,
    public myPeerId: string | null,
    public yourPeerId: string | null,
    public roomName: string | null,
  ) {}

  public static createDefault(): Settings {
    return new Settings(null, null, null, null)
  }

  public static create(data: ISettings): Settings {
    return new Settings(
      data.apiKey ?? null,
      data.myPeerId ?? null,
      data.yourPeerId ?? null,
      data.roomName ?? null,
    )
  }

  toJson(): ISettings {
    return {
      apiKey: this.apiKey,
      myPeerId: this.myPeerId,
      yourPeerId: this.yourPeerId,
      roomName: this.roomName,
    }
  }
}
