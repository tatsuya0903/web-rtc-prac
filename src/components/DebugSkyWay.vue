<template>
  <div class="debug-sky-way">
    <v-row>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <v-text-field hide-details dense outlined label="自分のPeerID" readonly :value="peerId" />
        <video ref="myVideo" width="100%" autoplay muted playsinline />
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <v-text-field hide-details v-model="theirPeerId" dense outlined label="相手のPeerId" />
          <v-btn @click="clickCall">発信</v-btn>
        </div>
        <video ref="theirVideo" width="100%" autoplay muted playsinline />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from '@vue/composition-api'
import Peer, { MediaConnection } from 'skyway-js'

type State = {
  peerId: string | null
  theirPeerId: string
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: {},
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      peerId: null,
      theirPeerId: '',
    })

    const peer = new Peer({
      key: props.apiKey,
      debug: 3,
    })
    peer.on('open', () => {
      state.peerId = peer.id
    })
    //着信処理
    peer.on('call', (mediaConnection: MediaConnection) => {
      alert('着信しました!!!')
      if (localStream === null) {
        alert('ERROR')
        return
      }
      state.theirPeerId = mediaConnection.remoteId
      mediaConnection.answer(localStream)
      setEventListener(mediaConnection)
    })
    peer.on('error', (err) => {
      alert(err.message)
    })
    peer.on('close', () => {
      alert('通信が切断しました。')
    })

    let localStream: MediaStream | null = null

    // カメラ映像取得
    const myVideo = ref<HTMLVideoElement>()
    const theirVideo = ref<HTMLVideoElement>()

    const init = async (element: HTMLVideoElement) => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        // video要素にカメラ映像をセットし、再生
        element.srcObject = mediaStream
        await element.play()

        // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
        localStream = mediaStream
      } catch (e) {
        // 失敗時にはエラーログを出力
        console.error('mediaDevice.getUserMedia() error:', e.message)
        return
      }
    }

    onMounted(() => {
      console.log(`onMounted >> `)
      const element = myVideo.value
      if (element) {
        init(element)
      }
    })

    const clickCall = async () => {
      executeCall(state.theirPeerId)
    }

    // イベントリスナを設置する関数
    const setEventListener = (mediaConnection: MediaConnection) => {
      const element = theirVideo.value
      if (element) {
        mediaConnection.on('stream', (stream) => {
          // video要素にカメラ映像をセットして再生

          element.srcObject = stream
          element.play()
        })
      }
    }

    const executeCall = (theirPeerId: string) => {
      if (localStream === null) {
        alert('ERROR')
        return
      }
      const mediaConnection = peer.call(theirPeerId, localStream)
      setEventListener(mediaConnection)
    }

    return {
      ...toRefs(state),
      myVideo,
      theirVideo,
      clickCall,
    }
  },
})
</script>

<style lang="scss" scoped>
.debug-sky-way {
  .debug-sky-way__item {
    border: 1px lightgray solid;
  }
}
</style>
