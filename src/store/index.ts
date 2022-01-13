import Vue from 'vue'
import Vuex from 'vuex'
import { peer } from '@/store/modules/peer'

Vue.use(Vuex)

export type RootState = {}
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    peer,
  },
})
