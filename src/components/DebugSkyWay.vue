<template>
  <div class="debug-sky-way">
    <v-row>
      <v-col
        v-if="shareUrl !== null"
        cols="12"
        class="debug-sky-way__item"
        style="display: flex; flex-direction: row"
      >
        <div style="font-size: 10px">{{ shareUrl }}</div>
        <v-btn icon @click="clickShare(shareUrl)">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <InputText label="自分のPeerID" :value="myPeerId" readonly />
          <v-btn @click="clickChangeCamera">カメラ切替</v-btn>
        </div>
        <video ref="myVideo" width="100%" autoplay muted playsinline />
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <InputText v-model="theirPeerId" label="相手のPeerId" />
          <v-btn @click="clickCall">発信</v-btn>
        </div>
        <video ref="theirVideo" width="100%" autoplay muted playsinline />
      </v-col>
      <v-col cols="12">
        <CameraSelect v-model="cameraDeviceId" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  computed,
} from '@vue/composition-api'
import Peer, { MediaConnection, PeerConstructorOption } from 'skyway-js'
import { LocalStorage } from '@/localStorage'
import InputText from '@/components/InputText.vue'
import { Common } from '@/common'
import CameraSelect from '@/components/CameraSelect.vue'

type State = {
  myPeerId: string
  theirPeerId: string
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { CameraSelect, InputText },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const myPageId = LocalStorage.myPeerId
    const theirPeerId = LocalStorage.theirPeerId
    const state = reactive<State>({
      myPeerId: myPageId ?? '',
      theirPeerId: theirPeerId ?? '',
      cameraDeviceId: null,
    })
    watch(
      () => state.myPeerId,
      (value: string | null) => {
        LocalStorage.myPeerId = value
      },
    )
    watch(
      () => state.theirPeerId,
      (value: string | null) => {
        LocalStorage.theirPeerId = value
      },
    )

    const options: PeerConstructorOption = {
      key: props.apiKey,
      debug: 3,
    }
    const peer = myPageId === null ? new Peer(options) : new Peer(myPageId, options)
    peer.on('open', () => {
      state.myPeerId = peer.id
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

      localMediaConnection = mediaConnection
    })
    peer.on('error', (err) => {
      alert(err.message)
    })
    peer.on('close', () => {
      alert('通信が切断しました。')
    })

    let localStream: MediaStream | null = null
    let localMediaConnection: MediaConnection | null = null

    // カメラ映像取得
    const myVideo = ref<HTMLVideoElement>()
    const theirVideo = ref<HTMLVideoElement>()

    const init = async (element: HTMLVideoElement, cameraDeviceId: string) => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraDeviceId,
          },
          audio: false,
        })
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

    const shareUrl = computed(() => {
      const apiKey = props.apiKey
      const theirPeerId = state.myPeerId
      if (theirPeerId.length === 0) {
        return null
      }
      return Common.createShareUrl(apiKey, theirPeerId)
    })

    onMounted(() => {
      console.log(`onMounted >> `)
    })

    watch(
      () => state.cameraDeviceId,
      (cameraDeviceId: string | null) => {
        const element = myVideo.value
        if (element && cameraDeviceId) {
          init(element, cameraDeviceId)
        }
      },
    )

    const clickCall = async () => {
      executeCall(state.theirPeerId)
    }

    const clickChangeCamera = async () => {
      if (localMediaConnection === null) {
        return
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // フロントカメラ（ユーザ側カメラ）
        },
        audio: true,
      })
      localMediaConnection.replaceStream(mediaStream)
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

      localMediaConnection = mediaConnection
    }

    const clickShare = async (url: string) => {
      await navigator.share({
        title: 'リンクを共有',
        text: '',
        url: url,
      })
    }

    return {
      ...toRefs(state),
      myVideo,
      theirVideo,
      clickCall,
      shareUrl,
      clickShare,
      clickChangeCamera,
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
