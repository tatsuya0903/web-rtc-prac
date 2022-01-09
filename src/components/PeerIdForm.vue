<template>
  <InputText :label="label" :value="localValue" :readonly="readonly" />
</template>

<script lang="ts">
import { defineComponent, SetupContext, reactive, toRefs, computed } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type Value = string | null
type State = {}
type Props = {
  value: Value
  label: string
  readonly: boolean
}
export default defineComponent({
  components: { InputText },
  props: {
    value: { type: String, default: null },
    label: { type: String, default: 'PeerId' },
    readonly: { type: Boolean, default: false },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({})
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const localValue = computed<Value>({
      get: () => props.value ?? '',
      set: (value: Value) => {
        if (value?.length === 0) {
          emitInput(null)
          return
        }
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
