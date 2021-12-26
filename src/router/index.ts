import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/ViewHome.vue'

Vue.use(VueRouter)

export const RouteNames = {
  Home: 'Home',
  About: 'About',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: RouteNames.Home,
    component: Home,
  },
  {
    path: '/about',
    name: RouteNames.About,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewAbout.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
