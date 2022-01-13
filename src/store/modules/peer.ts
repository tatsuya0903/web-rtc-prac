import Peer, { MediaConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import isRaw from '@vue/composition-api'
import { Dialogs, DoneCancels } from '@/dialogs'

export interface State {
  data: Peer | null
  mediaConnection: MediaConnection | null
  myMediaStream: MediaStream | null
  yourMediaStream: MediaStream | null
  cameraDeviceId: string | null
}
export type PayloadInit = {
  apiKey: string
  peerId: string | null
}
export type PayloadCall = {
  peerId: string
}
export type PayloadChangeCamera = {
  deviceId: string
}
const state: State = {
  data: null,
  mediaConnection: null,
  myMediaStream: null,
  yourMediaStream: null,
  cameraDeviceId: null,
}

const getters: GetterTree<State, RootState> = {
  data: (state: State): Peer | null => {
    return state.data
  },
  myMediaStream: (state: State): MediaStream | null => {
    return state.myMediaStream
  },
  yourMediaStream: (state: State): MediaStream | null => {
    return state.yourMediaStream
  },
  mediaConnection: (state: State): MediaConnection | null => {
    return state.mediaConnection
  },
  cameraDeviceId: (state: State): string | null => {
    return state.cameraDeviceId
  },
}
const actions: ActionTree<State, RootState> = {
  async init({ commit, state }, payload: PayloadInit): Promise<PeerError | null> {
    return new Promise<PeerError | null>((resolve) => {
      const peerId = payload.peerId
      const options: PeerConstructorOption = {
        key: payload.apiKey,
        debug: 3,
      }
      const peer = peerId === null ? new Peer(options) : new Peer(peerId, options)
      peer.once('open', () => {
        commit('data', peer)
        resolve(null)
      })
      peer.once('error', (err: PeerError) => {
        resolve(err)
      })

      peer.on('call', async (mediaConnection: MediaConnection) => {
        const result = await Dialogs.showCalled(`[${mediaConnection.remoteId}]から着信です`)
        if (result === DoneCancels.Done) {
          // 受話
          mediaConnection.answer(state.myMediaStream ?? undefined)
          mediaConnection.on('stream', (stream) => {
            state.yourMediaStream = stream
          })
          mediaConnection.on('close', () => {
            const mc = state.mediaConnection
            if (mc !== null) {
              mc.close(true)
              commit('mediaConnection', null)
            }
          })
          commit('mediaConnection', mediaConnection)
        } else {
          // 拒否
          mediaConnection.close(true)
        }
      })
    })
  },
  async call({ commit, state }, payload: PayloadCall): Promise<boolean> {
    const peer = state.data
    if (peer === null) {
      return false
    }

    const mediaConnection = peer.call(payload.peerId, state.myMediaStream ?? undefined)
    mediaConnection.on('stream', (stream) => {
      commit('yourMediaStream', stream)
    })
    mediaConnection.on('close', () => {
      alert('切断されました')
    })
    commit('mediaConnection', mediaConnection)
    return true
  },
  async close({ state, commit }): Promise<boolean> {
    const mc = state.mediaConnection
    if (mc === null) {
      return false
    }

    mc.close(true)

    commit('mediaConnection', null)
    return true
  },
  async changeCamera({ commit }, payload: PayloadChangeCamera): Promise<boolean> {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: payload.deviceId,
        },
        audio: false,
      })
      commit('cameraDeviceId', payload.deviceId)
      commit('myMediaStream', mediaStream)
      return true
    } catch (e) {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', e.message)
      return false
    }
  },
}

const mutations: MutationTree<State> = {
  data(state: State, value: Peer | null) {
    state.data = value
  },
  mediaConnection(state: State, value: MediaConnection | null) {
    state.mediaConnection = value
  },
  myMediaStream(state: State, value: MediaStream | null) {
    state.myMediaStream = value
  },
  yourMediaStream(state: State, value: MediaStream | null) {
    state.yourMediaStream = value
  },
  cameraDeviceId(state: State, value: string | null) {
    state.cameraDeviceId = value
  },
}

export const peer: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
