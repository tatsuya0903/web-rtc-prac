<template>
  <LayoutPage>
    <template v-slot:main>
      <div v-if="peer === null">Peer is null</div>
      <Room v-else :api-key="apiKey" :peer="peer" :room-name="roomName" />
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'
import { usePeer } from '@/composables/usePeer'
import Room from '@/components/Room.vue'
import { LocalStorage } from '@/localStorage'

type State = {}
type Props = {
  apiKey: string
  roomName: string
}
export default defineComponent({
  components: { Room, VideoPreview, CameraSelect, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    roomName: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})

    const { peer, init } = usePeer()

    onMounted(() => {
      if (peer.value === null) {
        init({
          apiKey: props.apiKey,
          peerId: LocalStorage.apiKey,
        })
      }
    })

    return {
      ...toRefs(state),
      peer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
