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
  position: fixed;
  top: 64px;
  width: 100%;
  height: calc(100% - 64px);
  max-height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .layout-page__main {
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
  }
  .layout-page__footer {
  }
}
</style>
