<template>
  <LayoutPage>
    <template v-slot:main>
      <MessageForm />
      <VideoPreview :media-stream="yourMediaStream" />
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
    </template>
    <template v-slot:footer>
      <v-toolbar dark>
        <CameraChangeButton />
        <v-spacer />
        <v-btn rounded color="error" @click="close">
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'
import { usePeer } from '@/composables/usePeer'
import { MediaConnection } from 'skyway-js'
import { RouterHelper } from '@/router-helper/RouterHelper'
import InputText from '@/components/InputText.vue'
import MessageForm from '@/components/MessageForm.vue'
import { useCamera } from '@/composables/useCamera'
import CameraChangeButton from '@/components/CameraChangeButton.vue'

type State = {}
type Props = {
  apiKey: string
  theirPeerId: string
}
export default defineComponent({
  components: {
    CameraChangeButton,
    MessageForm,
    InputText,
    VideoPreview,
    CameraSelect,
    LayoutPage,
  },
  props: {
    apiKey: { type: String, required: true },
    theirPeerId: { type: String, required: true },
  },
  setup(props: Props) {
    const { mediaStream } = useCamera()
    const { close, yourMediaStream, mediaConnection } = usePeer()

    const state = reactive<State>({})
    watch(
      () => mediaConnection.value,
      (value: MediaConnection | null) => {
        if (value === null) {
          alert('切断されました')
          RouterHelper.moveTop(props.apiKey)
        }
      },
    )

    return {
      ...toRefs(state),
      mediaStream,
      yourMediaStream,
      close,
    }
  },
})
</script>

<style lang="scss" scoped></style>
