<template>
  <div class="peer-chat-footer">
    <div class="peer-chat-footer__item peer-chat-footer__item--main">
      <InputText v-model="localValue" />
    </div>
    <div class="peer-chat-footer__item peer-chat-footer__item--action">
      <v-btn color="primary" @click="emitClickSend">送信</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type Value = string
type Props = {
  value: Value
}
export default defineComponent({
  components: { InputText },
  props: {
    value: { type: String, required: true },
  },
  emits: ['input', 'click-send'],
  setup(props: Props, context: SetupContext) {
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const emitClickSend = () => {
      context.emit('click-send')
    }
    const localValue = computed({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })
    return {
      emitClickSend,
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped>
.peer-chat-footer {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 2px;

  .peer-chat-footer__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.peer-chat-footer__item--main {
      flex: 1;
    }
    &.peer-chat-footer__item--action {
    }
  }
}
</style>
