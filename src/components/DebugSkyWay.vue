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
        <VideoPreview :media-stream="myMediaStream" />
      </v-col>
      <v-col cols="12" md="6" class="debug-sky-way__item">
        <div style="display: flex; flex-direction: row">
          <PeerIdForm v-model="theirPeerId" label="相手のPeerId" />
          <v-btn @click="clickCall">発信</v-btn>
          <v-btn @click="clickClose">終了</v-btn>
        </div>
        <VideoPreview :media-stream="theirMediaStream" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch, computed } from '@vue/composition-api'
import { LocalStorage } from '@/localStorage'
import InputText from '@/components/InputText.vue'
import { Common } from '@/common'
import CameraSelect from '@/components/CameraSelect.vue'
import { Dialogs } from '@/dialogs'
import { useSkyWay } from '@/composables/useSkyWay'
import PeerIdForm from '@/components/PeerIdForm.vue'
import VideoPreview from '@/components/VideoPreview.vue'
import { Snackbars } from '@/snackbars'

type State = {
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { VideoPreview, PeerIdForm, CameraSelect, InputText },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const { myPeerId, myMediaStream, theirPeerId, theirMediaStream, executeCall, executeClose } =
      useSkyWay({
        apiKey: props.apiKey,
        myPeerId: LocalStorage.myPeerId,
        theirPeerId: LocalStorage.theirPeerId,
        callbackOpened: () => {
          Snackbars.show('準備OK')
        },
        callbackCalled: () => {
          Snackbars.show('通話開始')
        },
        callbackClosed: () => {
          Snackbars.show('通話が終了しました')
        },
        callbackError: (message: string) => {
          Dialogs.showError(message)
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

    const changeCamera = async (cameraDeviceId: string) => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraDeviceId,
          },
          audio: false,
        })

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
      (value: string | null) => {
        if (value !== null) {
          changeCamera(value)
        }
      },
    )

    const clickCall = async () => {
      executeCall()
    }
    const clickClose = async () => {
      executeClose()
    }

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
      theirPeerId,
      clickCall,
      clickClose,
      shareUrl,
      clickQr,
      clickShare,
      myMediaStream,
      theirMediaStream,
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
