<template>
  <v-snackbar v-model="isOpen">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" icon v-bind="attrs" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api'

type State = {
  isOpen: boolean
}
type Props = {
  message: string
  callbackClosed: () => void
}
export default defineComponent({
  components: {},
  props: {
    message: { type: String, default: 'This is SnackbarDefault.' },
    callbackClosed: { type: null, required: true },
  },
  setup(props: Props) {
    // state
    const state = reactive<State>({
      isOpen: false,
    })

    const text = computed(() => {
      return props.message.endsWith('.') || props.message.endsWith('。')
        ? props.message
        : `${props.message}...`
    })

    watch(
      () => state.isOpen,
      (value: boolean) => {
        if (!value) {
          props.callbackClosed()
        }
      },
    )

    const close = () => {
      state.isOpen = false
    }

    onMounted(async () => {
      await nextTick()
      state.isOpen = true
    })

    return {
      ...toRefs(state),
      close,
      text,
    }
  },
})
</script>

<style lang="scss" scoped></style>
