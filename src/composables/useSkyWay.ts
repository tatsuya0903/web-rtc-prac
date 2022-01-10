import { onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Peer, { MediaConnection, PeerConstructorOption } from 'skyway-js'

export interface Payload {
  apiKey: string
  myPeerId: string | null
  theirPeerId: string | null
  callbackOpened: () => void
  callbackCalled: () => void
  callbackClosed: () => void
  callbackError: (message: string) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSkyWay = (payload: Payload) => {
  const myPeerId = ref<string | null>(payload.myPeerId)
  const theirPeerId = ref<string | null>(payload.theirPeerId)
  const myMediaStream = ref<MediaStream | null>(null)
  const theirMediaStream = ref<MediaStream | null>(null)
  const localMediaConnection = ref<MediaConnection | null>(null)

  const options: PeerConstructorOption = {
    key: payload.apiKey,
    debug: 3,
  }
  const peer = payload.myPeerId === null ? new Peer(options) : new Peer(payload.myPeerId, options)
  peer.on('open', () => {
    myPeerId.value = peer.id

    payload.callbackOpened()
  })
  //着信処理
  peer.on('call', (mediaConnection: MediaConnection) => {
    theirPeerId.value = mediaConnection.remoteId
    mediaConnection.answer(myMediaStream.value ?? undefined)
    mediaConnection.on('stream', (stream) => {
      theirMediaStream.value = stream
    })
    mediaConnection.on('close', () => {
      payload.callbackClosed()
    })

    localMediaConnection.value = mediaConnection

    payload.callbackCalled()
  })
  peer.on('error', (err) => {
    payload.callbackError(err.message)
  })
  peer.on('close', () => {
    payload.callbackClosed()
  })

  watch(
    () => myMediaStream.value,
    (value: MediaStream | null) => {
      if (value !== null) {
        localMediaConnection.value?.replaceStream(value)
      }
    },
  )

  const executeCall = (): boolean => {
    const peerId = theirPeerId.value
    if (peerId === null) {
      return false
    }
    const mediaConnection = peer.call(peerId, myMediaStream.value ?? undefined)
    mediaConnection.on('stream', (stream) => {
      theirMediaStream.value = stream
    })
    mediaConnection.on('close', () => {
      payload.callbackClosed()
    })

    localMediaConnection.value = mediaConnection

    return true
  }

  const executeClose = (): void => {
    localMediaConnection.value?.close(true)
  }

  onBeforeUnmount(() => {
    localMediaConnection.value?.close(true)
    peer.destroy()
  })

  return {
    myPeerId,
    myMediaStream,
    theirPeerId,
    theirMediaStream,
    executeCall,
    executeClose,
  }
}
