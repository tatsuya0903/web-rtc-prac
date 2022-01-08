<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card ref="card">
      <QrCode v-if="size !== null" :size="size" :data="url" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clickCancel">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from '@vue/composition-api'
import QrCode from '@/components/QrCode.vue'

type State = {
  isOpen: boolean
  size: number | null
}
type Props = {
  url: string
  callbackClosed: () => {}
}
export default defineComponent({
  components: { QrCode },
  props: {
    url: { type: String, required: true },
    callbackClosed: { type: null, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      isOpen: true,
      size: null,
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

    const card = ref()
    onMounted(() => {
      const element = card.value
      if (element) {
        state.size = element.$el.clientWidth
      }
    })
    const clickCancel = async () => {
      close()
    }

    return {
      ...toRefs(state),
      close,
      clickCancel,
      card,
    }
  },
})
</script>

<style lang="scss" scoped></style>
