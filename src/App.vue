<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <a style="color: white; opacity: 0.2" :href="commitUrl" target="_blank">
        {{ commitHash7 }}
      </a>
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
    const commitHash7 = Env.commitHash?.substring(0, 7) ?? ''
    const commitUrl = Env.commitUrl
    const title = process.env.VUE_APP_TITLE
    return {
      ...toRefs(state),
      title,
      commitHash7,
      commitUrl,
    }
  },
})
</script>

<style lang="scss" scoped></style>
