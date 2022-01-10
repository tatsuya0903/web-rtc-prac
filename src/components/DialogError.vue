<template>
  <v-dialog v-model="isOpen" max-width="480">
    <v-card ref="card">
      <v-card-title>エラー</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clickCancel">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'

type State = {
  isOpen: boolean
}
type Props = {
  message: string
  callbackClosed: () => {}
}
export default defineComponent({
  components: {},
  props: {
    message: { type: String, required: true },
    callbackClosed: { type: null, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      isOpen: true,
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

    const clickCancel = async () => {
      close()
    }

    return {
      ...toRefs(state),
      close,
      clickCancel,
    }
  },
})
</script>

<style lang="scss" scoped></style>
