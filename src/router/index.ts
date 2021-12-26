import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import Home from '../views/ViewHome.vue'
import { RouteLocations, RouteNames } from '@/router/models'
import { LocalStorage } from '@/localStorage'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: RouteNames.Home,
    component: Home,
    props: (route: Route) => ({
      apiKey: route.query.apiKey ?? LocalStorage.apiKey,
      myPeerId: route.query.myPeerId ?? LocalStorage.myPeerId,
      theirPeerId: route.query.theirPeerId ?? LocalStorage.theirPeerId,
    }),
  },
  {
    path: '/login',
    name: RouteNames.Login,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewLogin.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const apiKey = typeof to.query.apiKey === 'string' ? to.query.apiKey : null
  const myPeerId = typeof to.query.myPeerId === 'string' ? to.query.myPeerId : null
  const theirPeerId = typeof to.query.theirPeerId === 'string' ? to.query.theirPeerId : null

  const setting = LocalStorage.settings
  if (apiKey !== null) {
    setting.apiKey = apiKey
  }
  if (myPeerId !== null) {
    setting.myPeerId = myPeerId
  }
  if (theirPeerId !== null) {
    setting.theirPeerId = theirPeerId
  }
  LocalStorage.settings = setting

  if (to.name === RouteNames.Home && setting.apiKey === null) {
    next(RouteLocations.toLogin())
    return
  }

  next()
})

export default router
