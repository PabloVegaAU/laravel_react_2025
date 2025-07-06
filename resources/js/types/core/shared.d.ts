import type { Config } from 'ziggy-js'
import { FlashMessage } from './api-types'

export type SharedData = {
  name: string
  quote: { message: string; author: string }
  auth: Auth
  ziggy: Config & { location: string }
  sidebarOpen: boolean
  flash: FlashMessage
  [key: string]: unknown
}
