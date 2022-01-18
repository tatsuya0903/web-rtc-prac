<template>
  <v-btn icon @click="clickQr">
    <v-icon>mdi-qrcode</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Dialogs } from '@/dialogs'

type Props = {
  data: string
}
export default defineComponent({
  components: {},
  props: {
    data: { type: String, required: true },
  },
  setup(props: Props) {
    const clickQr = async () => {
      await Dialogs.showShareUrl(props.data)
    }
    return {
      clickQr,
    }
  },
})
</script>

<style lang="scss" scoped></style>
