<template>
  <div class="layout-page">
    <div class="layout-page__main">
      <slot name="main" />
    </div>
    <div class="layout-page__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .layout-page__main {
    position: relative;
    flex: 1;
    width: 100%;
  }
  .layout-page__footer {
  }
}
</style>
