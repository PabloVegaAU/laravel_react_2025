import { User } from '../user'

export interface Auth {
  /** Authenticated user data */
  user: User

  /** User roles */
  roles: string[]

  /** User permissions */
  permissions: string[]

  /** Whether the user is authenticated */
  isAuthenticated: boolean

  /** Whether the user is a guest (not authenticated) */
  isGuest: boolean

  /** Whether the user is a student */
  isStudent: boolean

  /** Whether the user is a teacher */
  isTeacher: boolean

  /** Whether the user is an admin */
  isAdmin: boolean
}

/** Login credentials */
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

/** Registration data */
export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  terms: boolean
}

/** Password reset request data */
export interface PasswordResetRequestData {
  email: string
}

/** Password reset data */
export interface PasswordResetData {
  email: string
  password: string
  password_confirmation: string
  token: string
}

/** Email verification notification response */
export interface EmailVerificationResponse {
  status: string
}

/** Password confirmation data */
export interface PasswordConfirmationData {
  password: string
}

/** Two-factor authentication data */
export interface TwoFactorAuthData {
  code: string
  recovery_code?: string
}

/** Two-factor authentication setup response */
export interface TwoFactorAuthSetupResponse {
  qr_code: string
  secret_key: string
  recovery_codes: string[]
}
