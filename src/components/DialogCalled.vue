<template>
  <v-dialog v-model="isOpen" max-width="480" persistent>
    <v-card ref="card">
      <v-card-title>着信</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="clickCancel">拒否</v-btn>
        <v-btn color="teal" text @click="clickDone">承諾</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { DoneCancel, DoneCancels } from '@/dialogs'

type State = {
  isOpen: boolean
}
type Props = {
  message: string
  callbackClosed: (doneCancel: DoneCancel) => {}
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

    const close = (doneCancel: DoneCancel) => {
      state.isOpen = false
      props.callbackClosed(doneCancel)
    }

    const clickCancel = async () => {
      close(DoneCancels.Cancel)
    }

    const clickDone = async () => {
      close(DoneCancels.Done)
    }

    return {
      ...toRefs(state),
      close,
      clickCancel,
      clickDone,
    }
  },
})
</script>

<style lang="scss" scoped></style>
