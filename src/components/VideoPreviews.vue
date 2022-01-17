<template>
  <div class="video-previews">
    <template v-for="mediaStream in mediaStreams">
      <div :key="mediaStream.peerId" class="video-previews__col" :style="styleObject">
        <VideoPreview :media-stream="mediaStream" :label="mediaStream.peerId" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import VideoPreview from '@/components/VideoPreview.vue'

type State = {}
type Props = {
  mediaStreams: MediaStream[]
}
export default defineComponent({
  components: { VideoPreview },
  props: {
    mediaStreams: { type: Array, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})

    const styleObject = computed(() => {
      let xNum = 1
      let yNum = 1
      switch (props.mediaStreams.length) {
        case 1:
          xNum = 1
          yNum = 1
          break
        case 2:
          xNum = 2
          yNum = 1
          break
        case 3:
        case 4:
          xNum = 2
          yNum = 2
          break
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          xNum = 3
          yNum = 3
          break
        case 10:
        case 11:
        case 12:
          xNum = 3
          yNum = 4
          break
        case 13:
        case 14:
        case 15:
        case 16:
          xNum = 4
          yNum = 4
          break
      }
      return {
        width: `${100 / xNum}%`,
        height: `${100 / yNum}%`,
      }
    })
    return {
      ...toRefs(state),
      styleObject,
    }
  },
})
</script>

<style lang="scss" scoped>
.video-previews {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  background: black;

  .video-previews__col {
    width: 33%;
    height: 33%;
    box-sizing: border-box;
  }
}
</style>
