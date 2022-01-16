<template>
  <div class="message-form">
    <div class="message-form__item message-form__item--main">
      <InputText v-model="message" />
    </div>
    <div class="message-form__item message-form__item--action">
      <v-btn color="primary" @click="clickSend">送信</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import { usePeer } from '@/composables/usePeer'
import { Snackbars } from '@/snackbars'
import { Dialogs } from '@/dialogs'

type State = {
  message: string
}
export default defineComponent({
  components: { InputText },
  setup() {
    const { send } = usePeer()

    const state = reactive<State>({
      message: '',
    })
    const clickSend = async () => {
      const success = await send(state.message)
      if (success) {
        state.message = ''
        await Snackbars.show('送信しました')
      } else {
        await Dialogs.showError('送信失敗')
      }
    }
    return {
      ...toRefs(state),
      clickSend,
    }
  },
})
</script>

<style lang="scss" scoped>
.message-form {
  display: flex;
  flex-direction: row;

  .message-form__item {
    display: flex;
    justify-content: center;
    align-items: center;
    &.message-form__item--main {
      flex: 1;
    }
    &.message-form__item--action {
    }
  }
}
</style>
