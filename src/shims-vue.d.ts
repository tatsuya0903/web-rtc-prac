import Vue from 'vue'

declare module '*.vue' {
  import type { defineComponent } from '@vue/composition-api'
  const component: defineComponent<{}, {}, unknown>
  export default component
}

declare global {
  interface Window {
    vmApp: Vue
  }
}
