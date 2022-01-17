import Vue from 'vue'
import Vuex from 'vuex'
import { peer } from '@/store/modules/peer'
import { camera } from '@/store/modules/camera'

Vue.use(Vuex)

export type RootState = {}
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    peer,
    camera,
  },
})
