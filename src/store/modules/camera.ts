import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'

export interface State {
  mediaStream: MediaStream | null
  deviceId: string | null
  devices: MediaDeviceInfo[] | null
}
const state: State = {
  mediaStream: null,
  deviceId: null,
  devices: null,
}

const getters: GetterTree<State, RootState> = {
  mediaStream: (state: State): MediaStream | null => {
    return state.mediaStream
  },
  deviceId: (state: State): string | null => {
    return state.deviceId
  },
  devices: (state: State): MediaDeviceInfo[] | null => {
    return state.devices
  },
}

const actions: ActionTree<State, RootState> = {
  async init({ commit }): Promise<void> {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
      (v) => v.kind === 'videoinput',
    )
    const deviceId = devices.length > 0 ? devices[0].deviceId : null
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: deviceId ?? undefined,
      },
      audio: true,
    })

    commit('mediaStream', mediaStream)
    commit('deviceId', deviceId)
    commit('devices', devices)
  },
  async change({ commit, state }): Promise<void> {
    const deviceId = state.deviceId
    const deviceIds = state.devices?.map((v) => v.deviceId) ?? null
    if (deviceId == null || deviceIds === null) {
      return
    }
    if (deviceIds.length < 2) {
      // 変更するカメラがないので終了
      return
    }
    const index = deviceIds.indexOf(deviceId)

    const indexMin = 0
    const indexMax = deviceIds.length - 1
    const nextIndex = index + 1 <= indexMax ? index + 1 : indexMin
    const nextDeviceId = deviceIds[nextIndex]

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: nextDeviceId ?? undefined,
      },
      audio: true,
    })

    commit('mediaStream', mediaStream)
    commit('deviceId', nextDeviceId)
  },
}

const mutations: MutationTree<State> = {
  mediaStream(state: State, value: MediaStream | null) {
    state.mediaStream = value
  },
  devices(state: State, value: MediaDeviceInfo[]) {
    state.devices = value
  },
  deviceId(state: State, value: string) {
    state.deviceId = value
  },
}

export const camera: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
