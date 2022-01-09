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
        <v-btn icon @click="clickQr(shareUrl)">
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" class="debug-sky-way__item">
        <CameraSelect v-model="cameraDeviceId" />
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <PeerIdForm label="自分のPeerID" :value="myPeerId" readonly />
        </div>
        <video ref="myVideo" width="100%" autoplay muted playsinline />
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <PeerIdForm v-model="theirPeerId" label="相手のPeerId" />
          <v-btn @click="clickCall">発信</v-btn>
        </div>
        <video ref="theirVideo" width="100%" autoplay muted playsinline />
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
import { LocalStorage } from '@/localStorage'
import InputText from '@/components/InputText.vue'
import { Common } from '@/common'
import CameraSelect from '@/components/CameraSelect.vue'
import { Dialogs } from '@/dialogs'
import { useSkyWay } from '@/composables/useSkyWay'
import PeerIdForm from '@/components/PeerIdForm.vue'

type State = {
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { PeerIdForm, CameraSelect, InputText },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const { myPeerId, myMediaStream, theirPeerId, theirMediaStream, executeCall } = useSkyWay({
      apiKey: props.apiKey,
      myPeerId: LocalStorage.myPeerId,
      callbackOpened: () => {
        alert('callbackOpened!!!')
      },
      callbackCalled: () => {
        alert('callbackCalled!!!')
      },
      callbackClosed: () => {
        alert('callbackClosed!!!')
      },
      callbackError: (message: string) => {
        alert(`callbackError: ${message}`)
      },
    })

    const state = reactive<State>({
      cameraDeviceId: null,
    })
    watch(
      () => myPeerId.value,
      (value: string | null) => {
        LocalStorage.myPeerId = value
      },
    )
    watch(
      () => theirPeerId.value,
      (value: string | null) => {
        LocalStorage.theirPeerId = value
      },
    )

    // カメラ映像取得
    const myVideo = ref<HTMLVideoElement>()
    const theirVideo = ref<HTMLVideoElement>()

    const changeCamera = async (element: HTMLVideoElement, cameraDeviceId: string) => {
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
        myMediaStream.value = mediaStream
      } catch (e) {
        // 失敗時にはエラーログを出力
        console.error('mediaDevice.getUserMedia() error:', e.message)
        return
      }
    }

    const shareUrl = computed(() => {
      const apiKey = props.apiKey
      const theirPeerId = myPeerId.value ?? ''
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
          changeCamera(element, cameraDeviceId)
        }
      },
    )

    const clickCall = async () => {
      executeCall()
    }

    watch(
      () => theirMediaStream.value,
      (value: MediaStream | null) => {
        const element = theirVideo.value
        if (element) {
          // video要素にカメラ映像をセットして再生
          element.srcObject = value
          element.play()
        }
      },
    )

    const clickQr = async (url: string) => {
      await Dialogs.showShareUrl(url)
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
      myPeerId,
      myVideo,
      theirPeerId,
      theirVideo,
      clickCall,
      shareUrl,
      clickQr,
      clickShare,
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
