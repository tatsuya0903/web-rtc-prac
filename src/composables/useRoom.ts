import { onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Peer, { MediaConnection } from 'skyway-js'
import * as stream from 'stream'

export interface Payload {
  peer: Peer
  roomName: string
  stream: MediaStream | null
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRoom = (payload: Payload) => {
  const myMediaStream = ref<MediaStream | null>(null)
  const mediaStreams = ref<MediaStream[]>([])
  const localMediaConnection = ref<MediaConnection | null>(null)

  const peer = payload.peer
  const room = peer.joinRoom(payload.roomName, {
    mode: 'mesh',
    stream: payload.stream ?? undefined,
  })
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

  watch(
    () => myMediaStream.value,
    (value: MediaStream | null) => {
      if (value !== null) {
        room.replaceStream(value)
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
    myMediaStream,
    mediaStreams,
    executeClose,
  }
}
