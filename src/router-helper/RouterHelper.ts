import { Location, Route } from 'vue-router'
import router from '@/router'
import { RouteLocations } from '@/router/models'

export class RouterHelper {
  static moveHome(
    apiKey: string,
    myPeerId: string | null,
    theirPeerId: string | null,
  ): Promise<Route> {
    const to = RouteLocations.toHome(apiKey, myPeerId, theirPeerId)
    return this.moveLocation(to)
  }

  private static async moveLocation(to: Location): Promise<Route> {
    return await router.replace(to)
  }
}
