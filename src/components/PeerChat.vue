<template>
  <v-card>
    <v-card-title>P2P データ送受信</v-card-title>
    <v-card-text>
      <template v-for="(value, index) in messages">
        <div :key="index">{{ value }}</div>
      </template>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-text-field
        v-model="message"
        hide-details
        dense
        placeholder="メッセージを送信"
        rounded
        outlined
        append-icon="mdi-send"
        color="primary"
        @click:append="clickSend"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { DataConnection } from 'skyway-js'
import { Snackbars } from '@/snackbars'
import InputText from '@/components/InputText.vue'
import MessageForm from '@/components/MessageForm.vue'
import PeerChatFooter from '@/components/PeerChatFooter.vue'

type State = {
  message: string
  messages: string[]
}
type Props = {
  dataConnection: DataConnection
}
export default defineComponent({
  components: { PeerChatFooter, MessageForm, InputText },
  props: {
    dataConnection: { type: DataConnection, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      message: '',
      messages: [],
    })

    props.dataConnection.on('open', () => {
      Snackbars.todo('DataConnection >> open!!!')
    })
    props.dataConnection.on('data', (data) => {
      state.messages.push(data)
      Snackbars.todo(`DataConnection >> data: ${JSON.stringify(data, null, '  ')}`)
    })
    props.dataConnection.on('close', () => {
      Snackbars.todo('DataConnection >> close!!!')
    })
    props.dataConnection.on('error', () => {
      Snackbars.todo('DataConnection >> error!!!')
    })

    const clickSend = async () => {
      const message = state.message
      props.dataConnection.send(message)
      state.messages.push(message)
      state.message = ''
    }
    return {
      ...toRefs(state),
      clickSend,
    }
  },
})
</script>

<style lang="scss" scoped></style>
