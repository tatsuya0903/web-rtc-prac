<template>
  <v-btn icon :disabled="disabled" @click="change">
    <v-icon>mdi-autorenew</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useCamera } from '@/composables/useCamera'
type State = {}
export default defineComponent({
  components: {},
  setup() {
    const { devices, change } = useCamera()

    const disabled = computed(() => (devices.value ?? []).length < 2)

    return { change, disabled }
  },
})
</script>

<style lang="scss" scoped></style>
