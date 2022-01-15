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
      <router-view :peer="peer" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  toRefs,
} from '@vue/composition-api'
import { Env } from '@/env'
import { usePeer } from '@/composables/usePeer'

type State = {}
export default defineComponent({
  components: {},
  setup() {
    const { peer } = usePeer()
    const state = reactive<State>({})
    const commitHash7 = Env.commitHash?.substring(0, 7) ?? ''
    const commitUrl = Env.commitUrl
    const title = process.env.VUE_APP_TITLE

    return {
      ...toRefs(state),
      title,
      commitHash7,
      commitUrl,
      peer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
