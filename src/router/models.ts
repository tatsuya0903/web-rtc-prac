import { Location } from 'vue-router'

export const RouteNames = {
  Home: 'Home',
  Login: 'Login',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]
export class RouteLocations {
  static toLogin(): Location {
    return {
      name: RouteNames.Login,
    }
  }
  static toHome(
    apiKey: string | null,
    myPeerId: string | null,
    theirPeerId: string | null,
  ): Location {
    return {
      name: RouteNames.Home,
      query: {
        apiKey: apiKey,
        myPeerId: myPeerId,
        theirPeerId: theirPeerId,
      },
    }
  }
}
