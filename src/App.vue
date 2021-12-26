<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">タイトル</div>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
