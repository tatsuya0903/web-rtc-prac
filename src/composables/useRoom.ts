import { onBeforeUnmount, ref } from '@vue/composition-api'
import Peer from 'skyway-js'
import { Snackbars } from '@/snackbars'

export interface Payload {
  peer: Peer
  roomName: string
  stream: MediaStream | null
}

export interface Message {
  peerId: string
  text: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRoom = (payload: Payload) => {
  const mediaStreams = ref<MediaStream[]>([])
  const messages = ref<Message[]>([])

  const peer = payload.peer
  const room = peer.joinRoom(payload.roomName, {
    mode: 'mesh',
    stream: payload.stream ?? undefined,
  })
  room.on('open', () => {
    console.log('room > open')
  })
  room.on('peerJoin', (peerId: string) => {
    Snackbars.show(`'${peerId}'が参加しました`)
  })
  room.on('peerLeave', (peerId: string) => {
    // https://webrtc.ecl.ntt.com/api-reference/javascript.html#events-4
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const index = mediaStreams.value.findIndex((v) => v.peerId === peerId)
    if (index !== -1) {
      mediaStreams.value.splice(index, 1)
    }
    Snackbars.show(`'${peerId}'が退出しました`)
  })
  room.on('log', (logs: string[]) => {
    console.log(`room >> log`)
    console.log(`    logs ${JSON.stringify(logs, null, '')}`)
  })
  room.on('stream', (stream: MediaStream) => {
    // https://webrtc.ecl.ntt.com/api-reference/javascript.html#events-4
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mediaStreams.value.push(stream)
  })
  room.on('data', ({ src, data }) => {
    console.log(`data > src: ${src}`)
    const message: Message = JSON.parse(data)
    messages.value.push(message)
  })
  room.on('close', () => {
    console.log('room > close')
  })

  const changeMediaStream = (mediaStream: MediaStream) => {
    room.replaceStream(mediaStream)
  }

  const executeClose = (): void => {
    room.close()
  }
  const executeSend = (text: string) => {
    const message: Message = {
      peerId: payload.peer.id,
      text: text,
    }
    messages.value.push(message)
    const json = JSON.stringify(message)
    room.send(json)
  }

  onBeforeUnmount(() => {
    room.close()
    peer.destroy()
  })

  return {
    mediaStreams,
    executeClose,
    changeMediaStream,
    executeSend,
    messages,
  }
}
