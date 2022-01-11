export class Common {
  static createShareUrl(apiKey: string, theirPeerId: string): string {
    return `https://tatsuya0903.github.io/web-rtc-prac?apiKey=${apiKey}&theirPeerId=${theirPeerId}`
  }

  static createRoomName(): string {
    const createCode = (len: number): string => {
      const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let r = ''
      for (let num = 1; num <= len; num++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    }
    return `${createCode(3)}-${createCode(4)}-${createCode(3)}`
  }
}
