import store from '@/store'
import { computed } from '@vue/composition-api'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStoreCamera = () => {
  const mediaStream = computed<MediaStream | null>(() => store.getters['camera/mediaStream'])
  const init = async (): Promise<void> => {
    return store.dispatch('camera/init')
  }
  const change = async (): Promise<void> => {
    return store.dispatch('camera/change')
  }
  const devices = computed<MediaDeviceInfo[] | null>(() => store.getters['camera/devices'])
  return { mediaStream, init, change, devices }
}
