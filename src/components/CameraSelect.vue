<template>
  <BaseSelect v-model="localValue" label="カメラ" :items="items" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  SetupContext,
  toRefs,
} from '@vue/composition-api'
import BaseSelect, { BaseSelectItem } from '@/components/BaseSelect.vue'

type Value = string | null
type State = { items: BaseSelectItem[] }
type Props = {
  value: Value
}
export default defineComponent({
  components: { BaseSelect },
  props: {
    value: { type: null, required: true },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({ items: [] })

    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const localValue = computed({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })

    onBeforeMount(() => {
      load()
    })

    const load = async () => {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (v) => v.kind === 'videoinput',
      )

      console.log(`devices: ${JSON.stringify(devices, null, '  ')}`)

      state.items.splice(0)
      state.items.push({ value: null, text: '選択されていません' })
      state.items.push(
        ...devices.map((v) => {
          return {
            value: v.deviceId,
            text: v.label,
          }
        }),
      )
    }

    return {
      ...toRefs(state),
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
