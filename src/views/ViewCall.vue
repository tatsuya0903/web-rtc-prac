<template>
  <LayoutPage>
    <template v-slot:main>
      <VideoPreview :media-stream="theirMediaStream" />
      <div style="position: absolute; right: 16px; bottom: 16px; max-width: 200px; width: 50vw">
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
            width: 300px;
            padding: 8px;
          "
        >
          <CameraSelect v-model="cameraDeviceId" />
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
import { useSkyWay } from '@/composables/useSkyWay'
import { LocalStorage } from '@/localStorage'
import { Snackbars } from '@/snackbars'
import { Dialogs } from '@/dialogs'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'

type State = {
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
  theirPeerId: string
}
export default defineComponent({
  components: { VideoPreview, CameraSelect, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    theirPeerId: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      cameraDeviceId: null,
    })

    const { myPeerId, myMediaStream, theirPeerId, theirMediaStream, executeCall, executeClose } =
      useSkyWay({
        apiKey: props.apiKey,
        myPeerId: LocalStorage.myPeerId,
        theirPeerId: props.theirPeerId,
        callbackOpened: () => {
          Snackbars.show('準備OK')
          executeCall()
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

    const changeCamera = async (cameraDeviceId: string) => {
      try {
        myMediaStream.value = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraDeviceId,
          },
          audio: false,
        })
      } catch (e) {
        // 失敗時にはエラーログを出力
        console.error('mediaDevice.getUserMedia() error:', e.message)
        return
      }
    }
    watch(
      () => state.cameraDeviceId,
      (value: string | null) => {
        if (value !== null) {
          changeCamera(value)
        }
      },
    )

    return {
      ...toRefs(state),
      executeClose,
      myMediaStream,
      theirMediaStream,
    }
  },
})
</script>

<style lang="scss" scoped></style>
