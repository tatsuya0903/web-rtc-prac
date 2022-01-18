<template>
  <LayoutPage>
    <template v-slot:main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <InputText label="APIキー" :value="apiKey" />
            <InputText v-model="peerId" label="PeerId" />
            <div>{{ message }}</div>
            <QrButton :data="url" />
            <a :href="url">{{ url }}</a>

            <v-divider />
            <InputText v-model="localToPeerId" label="送信先PeerId" />
            <v-btn @click="clickP2P">P2P接続</v-btn>
            <v-divider />

            <PeerChat v-if="dataConnection !== null" :data-connection="dataConnection" />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import InputText from '@/components/InputText.vue'
import { usePeer } from '@/composables/usePeer'
import { Snackbars } from '@/snackbars'
import { DataConnection, PeerError } from 'skyway-js'
import { Dialogs } from '@/dialogs'
import { Common } from '@/common'
import QrButton from '@/components/QrButton.vue'
import PeerChat from '@/components/PeerChat.vue'

type State = {
  localToPeerId: string
  dataConnection: DataConnection | null
}
type Props = {
  apiKey: string
  toPeerId: string | null
}
export default defineComponent({
  components: { PeerChat, QrButton, InputText, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
    toPeerId: { type: String, default: null },
  },
  setup(props: Props) {
    const state = reactive<State>({
      localToPeerId: props.toPeerId ?? '',
      dataConnection: null,
    })

    const { peer, peerId } = usePeer({ apiKey: props.apiKey })

    peer.value.on('close', () => {
      Snackbars.show('切断しました')
    })
    peer.value.on('error', (err: PeerError) => {
      Dialogs.showError(`エラー: ${err.message}`)
    })
    peer.value.on('connection', (conn: DataConnection) => {
      state.localToPeerId = conn.remoteId
      setDataConnection(conn)
    })

    const message = computed(() => {
      return peer.value.open ? '接続完了' : '接続中...'
    })

    const url = computed(() => {
      return Common.createSample2Url(props.apiKey, peerId.value)
    })

    const clickP2P = async () => {
      const localToPeerId = state.localToPeerId
      if (localToPeerId.length === 0) {
        return
      }

      const conn: DataConnection = peer.value.connect(localToPeerId)
      setDataConnection(conn)
    }
    const setDataConnection = (dataConnection: DataConnection) => {
      state.dataConnection = dataConnection
    }

    return {
      ...toRefs(state),
      peer,
      peerId,
      message,
      url,
      clickP2P,
    }
  },
})
</script>

<style lang="scss" scoped></style>
