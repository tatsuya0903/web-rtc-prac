import { onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Peer, { MediaConnection, MeshRoom, PeerConstructorOption } from 'skyway-js'

export interface Payload {
  apiKey: string
  myPeerId: string | null
  roomName: string
  callbackOpened: () => void
  callbackCalled: () => void
  callbackClosed: () => void
  callbackError: (message: string) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRoom = (payload: Payload) => {
  const myPeerId = ref<string | null>(payload.myPeerId)
  const myMediaStream = ref<MediaStream | null>(null)
  const mediaStreams = ref<MediaStream[]>([])
  const localMediaConnection = ref<MediaConnection | null>(null)
  const room = ref<MeshRoom | null>(null)

  const options: PeerConstructorOption = {
    key: payload.apiKey,
    debug: 3,
  }
  const peer = payload.myPeerId === null ? new Peer(options) : new Peer(payload.myPeerId, options)
  peer.on('open', () => {
    myPeerId.value = peer.id

    payload.callbackOpened()

    room.value = createRoom()
  })
  peer.on('error', (err) => {
    payload.callbackError(err.message)
  })
  peer.on('close', () => {
    payload.callbackClosed()
  })

  const createRoom = (): any => {
    const room = peer.joinRoom(payload.roomName, { mode: 'mesh' })
    room.on('open', () => {
      console.log('room > open')
    })
    room.on('peerJoin', (peerId: string) => {
      console.log(`room >> peerJoin ${peerId}`)
    })
    room.on('peerLeave', (peerId: string) => {
      console.log(`room >> peerLeave ${peerId}`)
    })
    room.on('log', (logs: string[]) => {
      console.log(`room >> log`)
      console.log(`    logs ${JSON.stringify(logs, null, '')}`)
    })
    room.on('stream', (stream: MediaStream) => {
      console.log(`room >> stream`)
      mediaStreams.value.push(stream)
    })
    room.on('data', ({ src, data }) => {
      console.log(`room >> data`)
      console.log(`    src: ${src}`)
      console.log(`    data: ${data}`)
    })
    room.on('close', () => {
      console.log('room > close')
    })
    return room
  }

  watch(
    () => myMediaStream.value,
    (value: MediaStream | null) => {
      if (value !== null) {
        room.value?.replaceStream(value)
      }
    },
  )

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
    mediaStreams,
    executeClose,
  }
}
