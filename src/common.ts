export class Common {
  static createShareUrl(apiKey: string, theirPeerId: string): string {
    return `https://tatsuya0903.github.io/web-rtc-prac?apiKey=${apiKey}&theirPeerId=${theirPeerId}`
  }
}
