<template>
  <div class="video-preview">
    <video ref="video" width="100%" autoplay muted playsinline />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from '@vue/composition-api'

type State = {}
type Props = {
  mediaStream: MediaStream | null
}
export default defineComponent({
  components: {},
  props: {
    mediaStream: { type: MediaStream, default: null },
  },
  setup(props: Props) {
    const state = reactive<State>({})

    const video = ref<HTMLVideoElement>()
    watch(
      () => props.mediaStream,
      (value: MediaStream | null) => {
        excute(value)
      },
    )

    onMounted(() => {
      excute(props.mediaStream)
    })
    const excute = (value: MediaStream | null) => {
      const element = video.value
      if (element) {
        if (value === null) {
          if (element.srcObject instanceof MediaStream) {
            element.srcObject.getTracks().map((track) => track.stop())
          }
          element.srcObject = null
        } else {
          // video要素にカメラ映像をセットして再生
          element.srcObject = value
          element.play()
        }
      }
    }
    return {
      ...toRefs(state),
      video,
    }
  },
})
</script>

<style lang="scss" scoped>
.video-preview {
  border: 1px lightgray solid;
  font-size: 0px;
  border-radius: 16px;
  overflow: hidden;
  background: black;
  width: 100%;
  height: 100%;

  video {
    object-fit: cover;
  }
}
</style>
