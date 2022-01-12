<template>
  <LayoutPage>
    <template v-slot:main>
      <template v-for="mediaStream in mediaStreams">
        <VideoPreview :key="mediaStream.id" :media-stream="mediaStream" />
      </template>
      <div
        style="
          position: absolute;
          right: 16px;
          bottom: 16px;
          max-width: 200px;
          width: 50vw;
          border: 1px solid white;
          border-radius: 16px;
          overflow: hidden;
        "
      >
        <VideoPreview :media-stream="myMediaStream" />
      </div>
    </template>
    <template v-slot:footer>
      <v-bottom-navigation dark>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 300px;
            padding: 8px;
          "
        >
          <CameraSelect v-model="cameraDeviceId" />
        </div>
        <v-btn icon @click="clickQr">
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
        <v-spacer />
        <div style="display: flex; justify-content: center; align-items: center; padding: 8px">
          <span>{{ roomName }}</span>
        </div>
        <v-btn color="error" @click="executeClose">
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
      </v-bottom-navigation>
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

    const clickQr = async () => {
      const shareUrl = Common.createRoomUrl(props.apiKey, props.roomName)
      await Dialogs.showShareUrl(shareUrl)
    }
    return {
      ...toRefs(state),
      clickQr,
      myMediaStream,
      mediaStreams,
      executeClose,
    }
  },
})
</script>

<style lang="scss" scoped></style>
