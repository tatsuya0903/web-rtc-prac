import store from '@/store'
import { computed } from '@vue/composition-api'
import Peer, { MediaConnection, PeerError } from 'skyway-js'
import { PayloadCall, PayloadInit } from '@/store/modules/peer'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStorePeer = () => {
  const peer = computed<Peer | null>(() => store.getters['peer/data'])
  const peerId = computed<string | null>(() => peer.value?.id ?? null)
  const yourMediaStream = computed<MediaStream | null>(() => store.getters['peer/yourMediaStream'])
  const mediaConnection = computed<MediaConnection | null>(
    () => store.getters['peer/mediaConnection'],
  )
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
  return {
    peer,
    init,
    call,
    send,
    close,
    peerId,
    yourMediaStream,
    yourPeerId,
    mediaConnection,
  }
}
