import Vue from 'vue'
import DialogShareUrl from '@/components/DialogShareUrl.vue'
import DialogError from '@/components/DialogError.vue'
import DialogCalled from '@/components/DialogCalled.vue'

export const DoneCancels = {
  Done: 'Done',
  Cancel: 'Cancel',
} as const
export type DoneCancel = typeof DoneCancels[keyof typeof DoneCancels]
export class Dialogs {
  static async showError(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const DialogVue = Vue.extend(DialogError)
      const vm = new DialogVue({
        parent: this.parent,
        propsData: {
          message: message,
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
  static async showCalled(message: string): Promise<DoneCancel> {
    return new Promise<DoneCancel>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const DialogVue = Vue.extend(DialogCalled)
      const vm = new DialogVue({
        parent: this.parent,
        propsData: {
          message: message,
          callbackClosed: (doneCancel: DoneCancel) => {
            resolve(doneCancel)
            setTimeout(() => {
              this.removeElement(vm)
            }, 100)
          },
        },
      })
      this.attachElement(vm)
    })
  }
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
