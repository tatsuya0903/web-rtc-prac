<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <template v-if="apiKey === null">アクセスキーが不正です。</template>
        <template v-else>
          <DebugSkyWay :api-key="apiKey" />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from '@vue/composition-api'
import DebugSkyWay from '@/components/DebugSkyWay.vue'
import { LocalStorage } from '@/localStorage'

type State = {}
export default defineComponent({
  components: { DebugSkyWay },
  setup() {
    const state = reactive<State>({})

    const apiKey = computed(() => LocalStorage.apiKey)

    return {
      ...toRefs(state),
      apiKey,
    }
  },
})
</script>

<style lang="scss" scoped></style>
