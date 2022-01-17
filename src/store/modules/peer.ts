import Peer, { DataConnection, MediaConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { Dialogs, DoneCancels } from '@/dialogs'
import { Snackbars } from '@/snackbars'

export interface State {
  data: Peer | null
  mediaConnection: MediaConnection | null
  dataConnection: DataConnection | null
  yourMediaStream: MediaStream | null
}
export type PayloadInit = {
  apiKey: string
  peerId: string | null
  mediaStream: MediaStream | null
}
export type PayloadCall = {
  peerId: string
  mediaStream: MediaStream | null
}
export type PayloadChangeCamera = {
  deviceId: string
}
const state: State = {
  data: null,
  mediaConnection: null,
  dataConnection: null,
  yourMediaStream: null,
}

const getters: GetterTree<State, RootState> = {
  data: (state: State): Peer | null => {
    return state.data
  },
  yourMediaStream: (state: State): MediaStream | null => {
    return state.yourMediaStream
  },
  mediaConnection: (state: State): MediaConnection | null => {
    return state.mediaConnection
  },
}

const actions: ActionTree<State, RootState> = {
  async init({ commit, state }, payload: PayloadInit): Promise<PeerError | null> {
    // DataConnectionの設定
    const setDataConnection = (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        Snackbars.todo('DataConnection >> open!!!')
      })
      dataConnection.on('data', (data) => {
        Snackbars.todo(`DataConnection >> data: ${JSON.stringify(data, null, '  ')}`)
      })
      dataConnection.on('close', () => {
        Snackbars.todo('DataConnection >> close!!!')
      })
      dataConnection.on('error', () => {
        Snackbars.todo('DataConnection >> error!!!')
      })
    }

    return new Promise<PeerError | null>((resolve) => {
      const peerId = payload.peerId
      const options: PeerConstructorOption = {
        key: payload.apiKey,
        debug: 3,
      }
      const peer = peerId === null ? new Peer(options) : new Peer(peerId, options)
      peer.on('open', () => {
        commit('data', peer)
        resolve(null)
      })
      peer.on('error', (err: PeerError) => {
        resolve(err)
      })

      peer.on('call', async (mediaConnection: MediaConnection) => {
        const peerId = mediaConnection.remoteId
        const result = await Dialogs.showCalled(`[${peerId}]から着信です`)
        if (result === DoneCancels.Done) {
          // 受話

          // メディアコネクションを確立
          mediaConnection.answer(payload.mediaStream ?? undefined)
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

          // データコネクションを確立
          const dataConnection = peer.connect(peerId)
          setDataConnection(dataConnection)

          commit('mediaConnection', mediaConnection)
          commit('dataConnection', dataConnection)
        } else {
          // 拒否
          mediaConnection.close(true)
        }
      })

      peer.on('connection', (dataConnection: DataConnection) => {
        setDataConnection(dataConnection)
        commit('dataConnection', dataConnection)
      })
    })
  },
  async call({ commit, state }, payload: PayloadCall): Promise<boolean> {
    const peer = state.data
    if (peer === null) {
      return false
    }

    const mediaConnection = peer.call(payload.peerId, payload.mediaStream ?? undefined)
    mediaConnection.on('stream', (stream) => {
      commit('yourMediaStream', stream)
    })
    mediaConnection.on('close', () => {
      alert('切断されました')
    })

    commit('mediaConnection', mediaConnection)
    return true
  },
  async send({ state }, text: string): Promise<boolean> {
    const dataConnection = state.dataConnection
    if (dataConnection === null) {
      await Snackbars.todo('送信エラー')
      return false
    }

    dataConnection.send(text)
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
}

const mutations: MutationTree<State> = {
  data(state: State, value: Peer | null) {
    state.data = value
  },
  mediaConnection(state: State, value: MediaConnection | null) {
    state.mediaConnection = value
  },
  dataConnection(state: State, value: DataConnection | null) {
    state.dataConnection = value
  },
  yourMediaStream(state: State, value: MediaStream | null) {
    state.yourMediaStream = value
  },
}

export const peer: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
