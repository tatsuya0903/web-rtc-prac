<template>
  <LayoutPage>
    <template v-slot:main>
      <v-row>
        <v-col cols="12">
          <div>APIキー:{{ apiKey }}</div>
          <div>ルーム名:{{ roomName }}</div>
          <div>URL:{{ shareUrl }}</div>
          <v-btn icon @click="clickQr(shareUrl)">
            <v-icon>mdi-qrcode</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" class="debug-sky-way__item">
          <CameraSelect v-model="cameraDeviceId" />
        </v-col>
        <v-col cols="12" class="debug-sky-way__item">
          <template v-for="mediaStream in mediaStreams">
            <VideoPreview :key="mediaStream.id" :media-stream="mediaStream" />
          </template>
          <div style="position: fixed; right: 16px; bottom: 16px; max-width: 200px; width: 50vw">
            <VideoPreview :media-stream="myMediaStream" />
          </div>
        </v-col>
      </v-row>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import { LocalStorage } from '@/localStorage'
import { Snackbars } from '@/snackbars'
import { Dialogs } from '@/dialogs'
import { useRoom } from '@/composables/useRoom'
import { Common } from '@/common'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'

type State = {
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
  roomName: string
}
export default defineComponent({
  components: { VideoPreview, CameraSelect, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    roomName: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      cameraDeviceId: null,
    })

    const { myPeerId, myMediaStream, mediaStreams, executeClose } = useRoom({
      apiKey: props.apiKey,
      myPeerId: LocalStorage.myPeerId,
      roomName: props.roomName,
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

    watch(
      () => state.cameraDeviceId,
      (value: string | null) => {
        if (value !== null) {
          changeCamera(value)
        }
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

    const shareUrl = Common.createRoomUrl(props.apiKey, props.roomName)
    const clickQr = async (url: string) => {
      await Dialogs.showShareUrl(url)
    }
    return {
      ...toRefs(state),
      shareUrl,
      clickQr,
      myMediaStream,
      mediaStreams,
    }
  },
})
</script>

<style lang="scss" scoped></style>
