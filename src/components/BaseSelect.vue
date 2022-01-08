<template>
  <v-select v-model="localValue" dense :items="items" hide-details :label="label" outlined />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'

export type BaseSelectItem = {
  text: string | number | object
  value: string | number | object | null
  disabled?: boolean
  divider?: boolean
  header?: string
}
type Value = string | null | object
type State = {}
type Props = {
  value: Value
  label: string | null
  items: BaseSelectItem[]
}
export default defineComponent({
  components: {},
  props: {
    value: { type: null, required: true },
    label: { type: String, default: null },
    items: { type: Array, required: true },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({})

    const emitInput = (valeu: Value) => {
      context.emit('input', valeu)
    }
    const localValue = computed({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })
    return {
      ...toRefs(state),
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
