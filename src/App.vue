<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>タイトル</v-app-bar-title>
      <v-spacer />
      <div style="color: white; opacity: 0.2">{{ version }}</div>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Env } from '@/env'

type State = {}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    const version = Env.commitHash?.substring(0, 7) ?? ''
    return {
      ...toRefs(state),
      version,
    }
  },
})
</script>

<style lang="scss" scoped></style>
