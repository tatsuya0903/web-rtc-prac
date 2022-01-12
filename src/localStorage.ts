import { ISettings, Settings } from '@/models/settings'

export const Keys = {
  Settings: 'SETTINGS',
} as const
export type Key = typeof Keys[keyof typeof Keys]
export class LocalStorage {
  static set settings(data: Settings) {
    this.save<ISettings>(Keys.Settings, data.toJson())
  }

  static get settings(): Settings {
    const data: ISettings | null = this.load<ISettings>(Keys.Settings)
    return data === null ? Settings.createDefault() : Settings.create(data)
  }
  static get apiKey(): string | null {
    return this.settings.apiKey
  }
  static set apiKey(value: string | null) {
    const settings = this.settings
    settings.apiKey = value
    this.settings = settings
  }

  static get myPeerId(): string | null {
    return this.settings.myPeerId
  }
  static set myPeerId(value: string | null) {
    const settings = this.settings
    settings.myPeerId = value
    this.settings = settings
  }

  private static save<T>(key: Key, data: T) {
    const json = JSON.stringify(data)
    localStorage.setItem(key, json)
  }
  private static load<T>(key: Key): T | null {
    const json = localStorage.getItem(key)
    if (json === null) {
      return null
    }
    return JSON.parse(json)
  }
}
