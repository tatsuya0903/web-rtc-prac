<template>
  <div class="video-previews">
    <div class="video-previews__row">
      <div class="video-previews__col">
        <VideoPreview :media-stream="item1" />
      </div>
      <div class="video-previews__col">
        <VideoPreview :media-stream="item2" />
      </div>
    </div>
    <div class="video-previews__row">
      <div class="video-previews__col">
        <VideoPreview :media-stream="item3" />
      </div>
      <div class="video-previews__col">
        <VideoPreview :media-stream="item4" />
      </div>
    </div>
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
    const item1 = computed(() => (props.mediaStreams.length >= 1 ? props.mediaStreams[0] : null))
    const item2 = computed(() => (props.mediaStreams.length >= 2 ? props.mediaStreams[1] : null))
    const item3 = computed(() => (props.mediaStreams.length >= 3 ? props.mediaStreams[2] : null))
    const item4 = computed(() => (props.mediaStreams.length >= 4 ? props.mediaStreams[3] : null))
    return {
      ...toRefs(state),
      item1,
      item2,
      item3,
      item4,
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
  flex-direction: column;
  .video-previews__row {
    width: 100%;
    height: 50%;
    display: flex;

    .video-previews__col {
      width: 50%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
