<template>
  <LayoutPage>
    <template v-slot:main>
      <div v-if="peer === null">Peer is null</div>
      <Room v-else :api-key="apiKey" :peer="peer" :room-name="roomName" />
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'
import { usePeer } from '@/composables/usePeer'
import Room from '@/components/Room.vue'

type State = {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  setup() {
    const state = reactive<State>({})

    const { peer } = usePeer()

    return {
      ...toRefs(state),
      peer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
