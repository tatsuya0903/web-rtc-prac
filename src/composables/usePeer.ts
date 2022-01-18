import { onBeforeUnmount, ref } from '@vue/composition-api'
import Peer, { PeerConstructorOption } from 'skyway-js'

export type Payload = {
  apiKey: string
  peerId?: string
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePeer = (payload: Payload) => {
  const peerId = ref<string | null>(null)
  const isOpen = ref<boolean>(false)

  const options: PeerConstructorOption = {
    key: payload.apiKey,
    debug: 3,
  }

  const peer = ref<Peer>(
    typeof payload.peerId === 'string' ? new Peer(payload.peerId, options) : new Peer(options),
  )

  peer.value.on('open', (id: string) => {
    peerId.value = id
    isOpen.value = true
  })

  onBeforeUnmount(() => {
    if (peer.value.open) {
      peer.value.destroy()
    }
  })

  return { peer, peerId, isOpen }
}
