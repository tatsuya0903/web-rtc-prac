<template>
  <LayoutPage>
    <template v-slot:main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card max-width="280px">
              <v-card-title>P2P通話</v-card-title>
              <v-card-text>
                <InputText v-model="theirPeerId" label="PeerId" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="teal accent-4" @click="click1on1">接続</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card max-width="280px">
              <v-card-title>ルーム通話</v-card-title>
              <v-card-text>
                <InputText v-model="roomName" label="会議コード" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="teal accent-4" @click="clickRoom">接続</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { RouterHelper } from '@/router-helper/RouterHelper'
import { Common } from '@/common'
import LayoutPage from '@/components/LayoutPage.vue'
import InputText from '@/components/InputText.vue'
import { Dialogs } from '@/dialogs'

type State = {
  theirPeerId: string
  roomName: string
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { InputText, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      theirPeerId: '',
      roomName: '',
    })

    const click1on1 = async () => {
      if (state.theirPeerId.length === 0) {
        await Dialogs.showError('PeerIdを入力してください')
        return
      }
      await RouterHelper.movePeer(props.apiKey, state.theirPeerId)
    }
    const clickRoom = async () => {
      if (state.roomName.length === 0) {
        state.roomName = Common.createRoomName()
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))
      }
      await RouterHelper.moveRoom(props.apiKey, state.roomName)
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
