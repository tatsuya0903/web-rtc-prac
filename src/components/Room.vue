<template>
  <LayoutPage>
    <template v-slot:main>
      <VideoPreviews :media-streams="mediaStreams" />
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
      <v-toolbar dark>
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
        <v-btn rounded color="error" @click="clickClose">
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
        <v-spacer />
        <div style="display: flex; justify-content: center; align-items: center; padding: 8px">
          <span>{{ roomName }}</span>
        </div>
      </v-toolbar>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Peer from 'skyway-js'
import LayoutPage from '@/components/LayoutPage.vue'
import { useRoom } from '@/composables/useRoom'
import { usePeer } from '@/composables/usePeer'
import { Snackbars } from '@/snackbars'
import { Common } from '@/common'
import { Dialogs } from '@/dialogs'
import VideoPreview from '@/components/VideoPreview.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreviews from '@/components/VideoPreviews.vue'
import { RouterHelper } from '@/router-helper/RouterHelper'

type State = {
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
  peer: Peer
  roomName: string
}
export default defineComponent({
  components: { VideoPreviews, CameraSelect, VideoPreview, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    peer: { type: Peer, required: true },
    roomName: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      cameraDeviceId: null,
    })

    const { myMediaStream } = usePeer()
    const { mediaStreams, executeClose } = useRoom({
      peer: props.peer,
      roomName: props.roomName,
      stream: myMediaStream.value,
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
      await Snackbars.todo(`TODO: changeCamera(${cameraDeviceId})`)
    }
    const clickQr = async () => {
      const shareUrl = Common.createRoomUrl(props.apiKey, props.roomName)
      await Dialogs.showShareUrl(shareUrl)
    }

    const clickClose = async () => {
      executeClose()
      await RouterHelper.moveTop(props.apiKey)
    }
    return {
      ...toRefs(state),
      mediaStreams,
      executeClose,
      clickQr,
      myMediaStream,
      clickClose,
    }
  },
})
</script>

<style lang="scss" scoped>
.room {
  position: absolute;
  width: 100%;
  height: 100%;
  background: lightcoral;
}
</style>
