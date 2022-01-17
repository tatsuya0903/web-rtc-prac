import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { RouteNames } from '@/router/models'
import { LocalStorage } from '@/localStorage'
import ViewHome from '../views/ViewHome.vue'
import ViewRoom from '@/views/ViewRoom.vue'
import { Common } from '@/common'
import ViewTop from '@/views/ViewTop.vue'
import ViewCall from '@/views/ViewCall.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: RouteNames.Home,
    component: ViewHome,
  },
  {
    path: '/',
    name: RouteNames.Login,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewLogin.vue'),
  },
  {
    path: '/:apiKey',
    name: RouteNames.Top,
    component: ViewTop,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/call/:theirPeerId',
    name: RouteNames.Call,
    component: ViewCall,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
      theirPeerId: route.params.theirPeerId,
    }),
  },
  {
    path: '/:apiKey/rooms/:roomName?',
    name: RouteNames.Room,
    component: ViewRoom,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
      roomName: route.params.roomName ?? Common.createRoomName(),
    }),
  },
  {
    path: '*',
    redirect: { name: RouteNames.Login },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const apiKey: string | null = to.params.apiKey ?? null
  if (apiKey !== null) {
    const setting = LocalStorage.settings
    setting.apiKey = apiKey
    LocalStorage.settings = setting
  }
  next()
})

export default router
