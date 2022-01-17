<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />
    <a style="color: white; opacity: 0.2" :href="commitUrl" target="_blank">
      {{ commitHash7 }}
    </a>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Env } from '@/env'

export default defineComponent({
  components: {},
  setup() {
    const title = process.env.VUE_APP_TITLE
    const commitUrl = Env.commitUrl
    const commitHash7 = Env.commitHash?.substring(0, 7) ?? ''
    return {
      title,
      commitUrl,
      commitHash7,
    }
  },
})
</script>

<style lang="scss" scoped></style>
