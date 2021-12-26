<template>
  <v-text-field v-model="localValue" :readonly="readonly" outlined dense :label="label" />
</template>

<script lang="ts">
import { defineComponent, SetupContext, reactive, toRefs, computed } from '@vue/composition-api'

type Value = string
type State = {}
type Props = {
  value: string
  label: string | null
  readonly: boolean
}
export default defineComponent({
  components: {},
  props: {
    value: { type: String, required: true },
    label: { type: String, default: null },
    readonly: { type: Boolean, default: false },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({})
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const localValue = computed<Value>({
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
