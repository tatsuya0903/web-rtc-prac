<template>
  <LayoutPage>
    <template v-slot:main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">ViewSample5</v-col>
        </v-row>
      </v-container>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'

type State = {}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { LayoutPage },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
