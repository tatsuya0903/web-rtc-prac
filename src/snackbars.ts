import Vue from 'vue'
import SnackbarDefault from '@/components/SnackbarDefault.vue'

export class Snackbars {
  static async todo(message = '準備中'): Promise<void> {
    return this.show(message)
  }
  static async show(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const DialogVue = Vue.extend(SnackbarDefault)
      const vm = new DialogVue({
        parent: this.parent,
        propsData: {
          message: message,
          callbackClosed: () => {
            resolve()
            setTimeout(() => {
              this.removeElement(vm)
            }, 1000)
          },
        },
      })
      this.attachElement(vm)
    })
  }

  private static get parent(): Vue {
    return window.vmApp
  }

  private static attachElement(dialogVue: Vue): void {
    if (!dialogVue.$parent) {
      dialogVue.$mount()
      document.body.appendChild(dialogVue.$el)
    } else {
      dialogVue.$mount()
      dialogVue.$parent.$el.appendChild(dialogVue.$el)
    }
  }

  private static removeElement(dialogVue: Vue): void {
    if (!dialogVue.$parent) {
      document.body.removeChild(dialogVue.$el)
      dialogVue.$destroy()
    } else {
      dialogVue.$parent.$el.removeChild(dialogVue.$el)
      dialogVue.$destroy()
    }
  }
}
