<template>
  <LayoutPage>
    <template v-slot:main>
      <v-row>
        <v-col cols="12">
          <div>apiKey:{{ apiKey }}</div>
        </v-col>
        <v-col cols="12">
          <v-btn @click="click1on1">1on1通話</v-btn>
          <v-btn @click="clickRoom">ルーム通話</v-btn>
        </v-col>
      </v-row>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { RouterHelper } from '@/router-helper/RouterHelper'
import { Common } from '@/common'
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

    const click1on1 = async () => {
      await RouterHelper.movePeer(props.apiKey, 'xxxxxxx')
    }
    const clickRoom = async () => {
      await RouterHelper.moveRoom(props.apiKey, Common.createRoomName())
    }
    return {
      ...toRefs(state),
      click1on1,
      clickRoom,
    }
  },
})
</script>

<style lang="scss" scoped></style>
