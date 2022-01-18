<template>
  <LayoutPage>
    <template v-slot:main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <InputText label="APIキー" :value="apiKey" />
            <InputText v-model="peerId" label="PeerId" />
            <div>{{ message }}</div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import InputText from '@/components/InputText.vue'
import { usePeer } from '@/composables/usePeer'
import { Snackbars } from '@/snackbars'
import { PeerError } from 'skyway-js'
import { Dialogs } from '@/dialogs'

type Props = {
  apiKey: string
}
export default defineComponent({
  components: { InputText, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const { peer, peerId } = usePeer({ apiKey: props.apiKey })

    peer.value.on('close', () => {
      Snackbars.show('切断しました')
    })
    peer.value.on('error', (err: PeerError) => {
      Dialogs.showError(`エラー: ${err.message}`)
    })

    const message = computed(() => {
      return peer.value.open ? '接続完了' : '接続中...'
    })

    return { peer, peerId, message }
  },
})
</script>

<style lang="scss" scoped></style>
