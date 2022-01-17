import { Location } from 'vue-router'

export const RouteNames = {
  Home: 'Home',
  Login: 'Login',
  Top: 'Top',
  Call: 'Call',
  Room: 'Room',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]
export class RouteLocations {
  static toLogin(): Location {
    return {
      name: RouteNames.Login,
    }
  }
  static toHome(apiKey: string | null, theirPeerId: string | null): Location {
    return {
      name: RouteNames.Home,
      query: {
        apiKey: apiKey ?? undefined,
        theirPeerId: theirPeerId ?? undefined,
      },
    }
  }
  static toTop(apiKey: string): Location {
    return {
      name: RouteNames.Top,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toCall(apiKey: string, theirPeerId: string): Location {
    return {
      name: RouteNames.Call,
      params: {
        apiKey: apiKey,
        theirPeerId: theirPeerId,
      },
    }
  }
  static toRoom(apiKey: string, roomName: string): Location {
    return {
      name: RouteNames.Room,
      params: {
        apiKey: apiKey,
        roomName: roomName,
      },
    }
  }
}
