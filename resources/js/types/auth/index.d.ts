import { User } from '../user'

export interface Auth {
  user: User
  roles: string[]
  permissions: string[]
}
