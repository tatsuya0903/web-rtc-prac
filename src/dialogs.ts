import DialogShareUrl from '@/components/DialogShareUrl.vue'
import Vue from 'vue'

export class Dialogs {
  static async showShareUrl(url: string): Promise<void> {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const DialogVue = Vue.extend(DialogShareUrl)
      const vm = new DialogVue({
        parent: this.parent,
        propsData: {
          url: url,
          callbackClosed: () => {
            resolve()
            setTimeout(() => {
              this.removeElement(vm)
            }, 100)
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
