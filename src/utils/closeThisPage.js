import { emitter } from '@base/utils/bus.js'

export const closeThisPage = () => {
  emitter.emit('closeThisPage')
}
