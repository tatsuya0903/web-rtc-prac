<template>
  <iframe :src="url" :style="styleObject" scrolling="no" frameborder="0" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {}
type Props = {
  size: number
  data: string
}
export default defineComponent({
  components: {},
  props: {
    size: { type: Number, default: 280 },
    data: { type: String, default: 'HelloWorld' },
  },
  setup(props: Props) {
    const state = reactive<State>({})

    const createUrl = (size: number, data: string): string => {
      return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(
        data,
      )}`
    }
    const url = createUrl(props.size, props.data)

    const styleObject = computed(() => {
      return {
        width: `${props.size}px`,
        height: `${props.size}px`,
      }
    })
    return {
      ...toRefs(state),
      url,
      styleObject,
    }
  },
})
</script>

<style lang="scss" scoped></style>
