import type { Timestamps } from '../core/base'
import type { Permission } from './permission'
import type { Role } from './role'

/**
 * User authentication and authorization data
 */
export interface AuthUser {
  /**
   * Authenticated user data
   */
  user: User

  /**
   * User roles
   */
  roles: string[]

  /**
   * User permissions
   */
  permissions: string[]

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean

  /**
   * Whether the user is a guest (not authenticated)
   */
  isGuest: boolean

  /**
   * Whether the user is a student
   */
  isStudent: boolean

  /**
   * Whether the user is a teacher
   */
  isTeacher: boolean

  /**
   * Whether the user is an admin
   */
  isAdmin: boolean

  /**
   * Whether the user has any of the given roles
   * @param roles Roles to check
   */
  hasRole: (...roles: string[]) => boolean

  /**
   * Whether the user has all of the given permissions
   * @param permissions Permissions to check
   */
  hasPermission: (...permissions: string[]) => boolean
}

export interface UserInertia {
  id: number
  name: string
  email?: string
}

/**
 * Base user interface
 */
export interface User extends Timestamps {
  id: number
  name: string
  email: string
  email_verified_at: string | null

  /* Relaciones */
  profile?: Profile
  student?: Student
  teacher?: Teacher
  roles?: Role[]
  permissions?: Permission[]
}

/**
 * User profile information
 */
export interface Profile extends Timestamps {
  id: number
  user_id: number
  first_name: string
  last_name: string
  second_last_name?: string | null
  phone?: string | null
  birth_date?: string | null
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  /**
   * User's email address or username
   */
  email: string

  /**
   * User's password
   */
  password: string

  /**
   * Whether to remember the user
   */
  remember?: boolean
}

/**
 * Registration data
 */
export interface RegisterData {
  /**
   * User's full name
   */
  name: string

  /**
   * User's email address
   */
  email: string

  /**
   * User's password
   */
  password: string

  /**
   * Password confirmation
   */
  password_confirmation: string

  /**
   * Whether the user accepts the terms and conditions
   */
  terms: boolean

  /**
   * Additional registration data
   */
  [key: string]: any
}

/**
 * Password reset request data
 */
export interface PasswordResetRequestData {
  /**
   * User's email address
   */
  email: string
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  /**
   * User's email address
   */
  email: string

  /**
   * New password
   */
  password: string

  /**
   * Password confirmation
   */
  password_confirmation: string

  /**
   * Password reset token
   */
  token: string
}

/**
 * Email verification notification response
 */
export interface EmailVerificationResponse {
  /**
   * Status message
   */
  status: string
}

/**
 * Password confirmation data
 */
export interface PasswordConfirmationData {
  /**
   * User's current password
   */
  password: string
}

/**
 * Two-factor authentication data
 */
export interface TwoFactorAuthData {
  /**
   * 2FA code
   */
  code: string

  /**
   * Recovery code (optional)
   */
  recovery_code?: string
}

/**
 * Two-factor authentication setup response
 */
export interface TwoFactorAuthSetupResponse {
  /**
   * QR code for 2FA setup
   */
  qr_code: string

  /**
   * Secret key for 2FA setup
   */
  secret_key: string

  /**
   * Recovery codes
   */
  recovery_codes: string[]
}

// Re-export types for backward compatibility
export type {
  AuthUser as Auth,
  EmailVerificationResponse as EmailVerificationResponseType,
  LoginCredentials as LoginCredentialsType,
  PasswordConfirmationData as PasswordConfirmationDataType,
  PasswordResetData as PasswordResetDataType,
  PasswordResetRequestData as PasswordResetRequestDataType,
  Profile as ProfileType,
  RegisterData as RegisterDataType,
  TwoFactorAuthData as TwoFactorAuthDataType,
  TwoFactorAuthSetupResponse as TwoFactorAuthSetupResponseType,
  User as UserType
}
