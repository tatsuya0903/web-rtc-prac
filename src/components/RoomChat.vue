<template>
  <v-card width="100%">
    <div class="room-chat">
      <div class="room-chat__row room-chat__row--header">
        <v-card-title>通話中のメッセージ</v-card-title>
      </div>
      <div class="room-chat__row room-chat__row--content">
        <v-list>
          <template v-for="(message, index) in messages">
            <v-list-item :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ message.text }}</v-list-item-title>
                <v-list-item-subtitle>{{ message.peerId }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </div>
      <div class="room-chat__row room-chat__row--footer">
        <v-text-field
          v-model="message"
          hide-details
          dense
          placeholder="参加者全員にメッセージを送信"
          filled
          rounded
          append-icon="mdi-send"
          @click:append="clickSend"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import { Message } from '@/composables/useRoom'

type State = {
  message: string
}
type Props = {
  messages: Message[]
}
export default defineComponent({
  components: {},
  props: {
    messages: { type: Array, required: true },
  },
  emits: ['send'],
  setup(_: unknown, context: SetupContext) {
    const state = reactive<State>({
      message: '',
    })
    const emitSend = (message: string) => {
      context.emit('send', message)
    }
    const clickSend = async () => {
      emitSend(state.message)
      state.message = ''
    }
    return {
      ...toRefs(state),
      clickSend,
      emitSend,
    }
  },
})
</script>

<style lang="scss" scoped>
.room-chat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-chat__row {
    &.room-chat__row--header {
    }
    &.room-chat__row--content {
      flex: 1;
    }
    &.room-chat__row--footer {
      padding: 8px;
    }
  }
}
</style>
