<template>
  <LayoutPage>
    <template v-slot:main>
      <v-row>
        <v-col cols="12">
          <div>apiKey:{{ apiKey }}</div>
          <div>roomName:{{ roomName }}</div>
        </v-col>
      </v-row>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'

type State = {}
type Props = {
  apiKey: string
  roomName: string
}
export default defineComponent({
  components: { LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    roomName: { type: String, required: true },
  },
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
