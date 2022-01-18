import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { RouteNames } from '@/router/models'
import { LocalStorage } from '@/localStorage'
import ViewHome from '../views/ViewHome.vue'
import ViewRoom from '@/views/ViewRoom.vue'
import { Common } from '@/common'
import ViewTop from '@/views/ViewTop.vue'
import ViewCall from '@/views/ViewCall.vue'
import ViewSample1 from '@/views/ViewSample1.vue'
import ViewSample5 from '@/views/ViewSample5.vue'
import ViewSample4 from '@/views/ViewSample4.vue'
import ViewSample3 from '@/views/ViewSample3.vue'
import ViewSample2 from '@/views/ViewSample2.vue'

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
    path: '/:apiKey/sample1',
    name: RouteNames.Sample1,
    component: ViewSample1,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample2',
    name: RouteNames.Sample2,
    component: ViewSample2,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample3',
    name: RouteNames.Sample3,
    component: ViewSample3,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample4',
    name: RouteNames.Sample4,
    component: ViewSample4,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample5',
    name: RouteNames.Sample5,
    component: ViewSample5,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
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
