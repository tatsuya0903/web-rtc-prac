<template>
  <LayoutPage>
    <template v-slot:header>
      <AppBar />
    </template>
    <template v-slot:main>
      <v-container>
        <v-card max-width="480px" outlined style="margin: auto">
          <v-card-text>
            <InputText v-model="apiKey" label="APIキー" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="teal accent-4" @click="clickDone">決定</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LayoutPage from '@/components/LayoutPage.vue'
import { LocalStorage } from '@/localStorage'
import InputText from '@/components/InputText.vue'
import { RouterHelper } from '@/router-helper/RouterHelper'
import { Env } from '@/env'
import AppBar from '@/components/AppBar.vue'

type State = {
  apiKey: string
}
export default defineComponent({
  components: { AppBar, InputText, LayoutPage },
  setup() {
    const state = reactive<State>({
      apiKey: LocalStorage.settings.apiKey ?? '',
    })

    const clickDone = async () => {
      await RouterHelper.moveTop(state.apiKey)
    }
    return {
      ...toRefs(state),
      clickDone,
      settings: LocalStorage.settings,
    }
  },
})
</script>

<style lang="scss" scoped></style>
