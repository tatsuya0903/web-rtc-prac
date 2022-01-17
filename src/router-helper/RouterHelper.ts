import { Location, Route } from 'vue-router'
import router from '@/router'
import { RouteLocations } from '@/router/models'

export class RouterHelper {
  static moveHome(apiKey: string | null, theirPeerId: string | null): Promise<Route> {
    const to = RouteLocations.toHome(apiKey, theirPeerId)
    return this.moveLocation(to)
  }
  static moveTop(apiKey: string): Promise<Route> {
    const to = RouteLocations.toTop(apiKey)
    return this.moveLocation(to)
  }
  static movePeer(apiKey: string, theirPeerId: string): Promise<Route> {
    const to = RouteLocations.toCall(apiKey, theirPeerId)
    return this.moveLocation(to)
  }
  static moveRoom(apiKey: string, roomName: string): Promise<Route> {
    const to = RouteLocations.toRoom(apiKey, roomName)
    return this.moveLocation(to)
  }

  private static async moveLocation(to: Location): Promise<Route> {
    return await router.push(to)
  }
}
