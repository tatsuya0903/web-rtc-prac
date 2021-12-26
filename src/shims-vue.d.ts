declare module '*.vue' {
  import type { defineComponent } from '@vue/composition-api'
  const component: defineComponent<{}, {}, unknown>
  export default component
}
