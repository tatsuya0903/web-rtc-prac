<template>
  <LayoutPage>
    <template v-slot:main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text>
                <InputText v-model="theirPeerId" label="PeerId" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="teal accent-4" @click="click1on1">P2P通話</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text>
                <InputText v-model="roomName" label="会議コード" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="teal accent-4" @click="clickRoom">ルーム通話</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <VideoPreview :media-stream="myMediaStream" />
              <v-card-actions>
                <CameraSelect v-model="cameraDeviceId" />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:footer>
      <v-bottom-navigation dark>
        <div style="display: flex; justify-content: center; align-items: center; padding: 8px">
          {{ peerId }}
        </div>
        <v-btn icon @click="clickQr">
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
        <v-spacer />
      </v-bottom-navigation>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, toRefs, watch } from '@vue/composition-api'
import { RouterHelper } from '@/router-helper/RouterHelper'
import { Common } from '@/common'
import LayoutPage from '@/components/LayoutPage.vue'
import InputText from '@/components/InputText.vue'
import { Dialogs } from '@/dialogs'
import { usePeer } from '@/composables/usePeer'
import { LocalStorage } from '@/localStorage'
import Peer from 'skyway-js'
import CameraSelect from '@/components/CameraSelect.vue'
import VideoPreview from '@/components/VideoPreview.vue'

type State = {
  theirPeerId: string
  roomName: string
  cameraDeviceId: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { VideoPreview, CameraSelect, InputText, LayoutPage },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const { init, call, changeCamera, peer, peerId, myMediaStream, yourPeerId } = usePeer()

    const state = reactive<State>({
      theirPeerId: LocalStorage.yourPeerId ?? '',
      roomName: '',
      cameraDeviceId: null,
    })

    watch(
      () => peer.value,
      (peer: Peer | null) => {
        if (peer === null) {
          return
        }
      },
    )
    watch(
      () => state.theirPeerId,
      (value: string) => {
        LocalStorage.yourPeerId = value.length > 0 ? value : null
      },
    )

    const click1on1 = async () => {
      if (state.theirPeerId.length === 0) {
        await Dialogs.showError('PeerIdを入力してください')
        return
      }

      const success = await call({ peerId: state.theirPeerId })
      if (success) {
        alert('OK')
      } else {
        alert('NG')
      }
      // await RouterHelper.movePeer(props.apiKey, state.theirPeerId)
    }
    const clickRoom = async () => {
      if (state.roomName.length === 0) {
        state.roomName = Common.createRoomName()
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))
      }
      await RouterHelper.moveRoom(props.apiKey, state.roomName)
    }

    onBeforeMount(() => {
      init({ apiKey: props.apiKey, peerId: LocalStorage.myPeerId })
    })

    const clickQr = async () => {
      if (peerId.value === null) {
        return null
      }
      const url = Common.createCallUrl(props.apiKey, peerId.value)
      await Dialogs.showShareUrl(url)
    }

    watch(
      () => state.cameraDeviceId,
      (value: string | null) => {
        if (value !== null) {
          changeCamera({ deviceId: value })
        }
      },
    )

    watch(
      () => yourPeerId.value,
      (value: string | null) => {
        if (value !== null) {
          RouterHelper.movePeer(props.apiKey, value)
        }
      },
    )
    return {
      ...toRefs(state),
      click1on1,
      clickRoom,
      peerId,
      clickQr,
      myMediaStream,
    }
  },
})
</script>

<style lang="scss" scoped></style>
