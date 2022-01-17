<template>
  <LayoutPage>
    <template v-slot:main>
      <div class="room">
        <div class="room__item room__item--video">
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
            <VideoPreview :media-stream="mediaStream" />
          </div>
        </div>
        <div v-show="drawer" class="room__item room__item--chat">
          <RoomChat :messages="messages" @send="clickSend" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <v-toolbar dark>
        <div style="display: flex; justify-content: center; align-items: center; padding: 8px">
          <span>{{ roomName }}</span>
        </div>
        <v-btn icon @click="clickQr">
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
        <v-spacer />
        <CameraChangeButton />
        <v-btn icon :color="drawer ? 'primary' : null" @click="clickChat">
          <v-icon>{{ drawer ? 'mdi-message' : 'mdi-message-text' }}</v-icon>
        </v-btn>
        <v-btn rounded color="error" @click="clickClose">
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Peer from 'skyway-js'
import LayoutPage from '@/components/LayoutPage.vue'
import { useRoom } from '@/composables/useRoom'
import { Common } from '@/common'
import { Dialogs } from '@/dialogs'
import VideoPreview from '@/components/VideoPreview.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreviews from '@/components/VideoPreviews.vue'
import { RouterHelper } from '@/router-helper/RouterHelper'
import { useCamera } from '@/composables/useCamera'
import CameraChangeButton from '@/components/CameraChangeButton.vue'
import RoomChat from '@/components/RoomChat.vue'

type State = {
  drawer: boolean
}
type Props = {
  apiKey: string
  peer: Peer
  roomName: string
}
export default defineComponent({
  components: {
    RoomChat,
    CameraChangeButton,
    VideoPreviews,
    CameraSelect,
    VideoPreview,
    LayoutPage,
  },
  props: {
    apiKey: { type: String, required: true },
    peer: { type: Peer, required: true },
    roomName: { type: String, required: true },
  },
  setup(props: Props) {
    const { mediaStream } = useCamera()
    const { mediaStreams, executeClose, changeMediaStream, executeSend, messages } = useRoom({
      peer: props.peer,
      roomName: props.roomName,
      stream: mediaStream.value,
    })
    const state = reactive<State>({
      drawer: false,
    })

    watch(
      () => mediaStream.value,
      (value: MediaStream | null) => {
        if (value !== null) {
          changeMediaStream(value)
        }
      },
      { deep: true },
    )

    const clickQr = async () => {
      const shareUrl = Common.createRoomUrl(props.apiKey, props.roomName)
      await Dialogs.showShareUrl(shareUrl)
    }

    const clickClose = async () => {
      executeClose()
      await RouterHelper.moveTop(props.apiKey)
    }
    const clickSend = async (message: string) => {
      executeSend(message)
    }

    const clickChat = async () => {
      state.drawer = !state.drawer
    }
    return {
      ...toRefs(state),
      mediaStreams,
      executeClose,
      clickQr,
      mediaStream,
      clickClose,
      clickSend,
      clickChat,
      messages,
    }
  },
})
</script>

<style lang="scss" scoped>
.room {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .room__item {
    position: relative;
    display: flex;
    &.room__item--video {
      background: orange;
      flex: 1;
    }
    &.room__item--chat {
      background: black;
      width: 380px;
      padding: 8px;
    }
    &.room__item--actions {
      position: absolute;
      right: 8px;
      top: 8px;
    }
  }
}
</style>
