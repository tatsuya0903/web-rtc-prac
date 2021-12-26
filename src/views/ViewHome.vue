<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="apiKey" hide-details dense outlined label="APIキー" />
      </v-col>
      <v-col cols="12">
        <DebugSkyWay v-if="display" :api-key="apiKey" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from '@vue/composition-api'
import DebugSkyWay from '@/components/DebugSkyWay.vue'
import { Env } from '@/env'

type State = {
  apiKey: string
}
export default defineComponent({
  components: { DebugSkyWay },
  setup() {
    const state = reactive<State>({
      apiKey: Env.skyWayApiKey ?? '',
    })

    const display = computed(() => state.apiKey.length > 0)
    return {
      ...toRefs(state),
      display,
    }
  },
})
</script>

<style lang="scss" scoped></style>
