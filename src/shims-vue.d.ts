declare module '*.vue' {
  import type { defineComponent } from '@vue/composition-api'
  const component: defineComponent<{}, {}, any>
  export default component
}
