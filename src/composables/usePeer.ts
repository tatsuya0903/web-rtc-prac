import store from '@/store'
import { computed } from '@vue/composition-api'
import Peer, { MediaConnection, PeerError } from 'skyway-js'
import { PayloadCall, PayloadChangeCamera, PayloadInit, State } from '@/store/modules/peer'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePeer = () => {
  const peer = computed<Peer | null>(() => store.getters['peer/data'])
  const peerId = computed<string | null>(() => peer.value?.id ?? null)
  const myMediaStream = computed<MediaStream | null>(() => store.getters['peer/myMediaStream'])
  const yourMediaStream = computed<MediaStream | null>(() => store.getters['peer/yourMediaStream'])
  const mediaConnection = computed<MediaConnection | null>(
    () => store.getters['peer/mediaConnection'],
  )
  const cameraDeviceId = computed<string | null>(() => store.getters['peer/cameraDeviceId'])
  const yourPeerId = computed(() => mediaConnection.value?.remoteId ?? null)
  const init = async (payload: PayloadInit): Promise<PeerError | null> => {
    return store.dispatch('peer/init', payload)
  }
  const call = async (payload: PayloadCall): Promise<boolean> => {
    return store.dispatch('peer/call', payload)
  }
  const send = async (text: string): Promise<boolean> => {
    return store.dispatch('peer/send', text)
  }
  const close = async (): Promise<boolean> => {
    return store.dispatch('peer/close')
  }
  const changeCamera = async (payload: PayloadChangeCamera): Promise<boolean> => {
    return store.dispatch('peer/changeCamera', payload)
  }
  return {
    peer,
    init,
    call,
    send,
    close,
    changeCamera,
    peerId,
    myMediaStream,
    yourMediaStream,
    yourPeerId,
    mediaConnection,
    cameraDeviceId,
  }
}
