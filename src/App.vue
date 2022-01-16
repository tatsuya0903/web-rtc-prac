<template>
  <v-app>
    <router-view :peer="peer" />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  reactive,
  SetupContext,
  toRefs,
} from '@vue/composition-api'
import { usePeer } from '@/composables/usePeer'
import { useCamera } from '@/composables/useCamera'
import { LocalStorage } from '@/localStorage'

type State = {}
export default defineComponent({
  components: {},
  setup(_: unknown, context: SetupContext) {
    const { init: cameraInit, mediaStream } = useCamera()
    const { init: peerInit, peer } = usePeer()
    const state = reactive<State>({})

    onBeforeMount(() => {
      init()
    })

    const init = async () => {
      await cameraInit()
      const apiKey = context.root.$route.params.apiKey ?? null
      if (apiKey !== null) {
        await peerInit({
          apiKey: apiKey,
          peerId: LocalStorage.myPeerId,
          mediaStream: mediaStream.value,
        })
      }
    }

    return {
      ...toRefs(state),
      peer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
