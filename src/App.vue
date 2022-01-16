<template>
  <v-app>
    <router-view :peer="peer" />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { usePeer } from '@/composables/usePeer'

type State = {}
export default defineComponent({
  components: {},
  setup() {
    const { peer } = usePeer()
    const state = reactive<State>({})

    return {
      ...toRefs(state),
      peer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
