import { createPinia } from 'pinia'
import { useAppStore } from '@base/pinia/modules/app'
import { useUserStore } from '@base/pinia/modules/user'
import { useDictionaryStore } from '@base/pinia/modules/dictionary'

const store = createPinia()

export { store, useAppStore, useUserStore, useDictionaryStore }
