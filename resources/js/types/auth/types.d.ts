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

/**
 * Base user interface
 */
export interface User extends Timestamps {
  /**
   * Unique identifier
   */
  id: number

  /**
   * User's full name
   */
  name: string

  /**
   * Unique email address
   */
  email: string

  /**
   * Email verification timestamp
   */
  email_verified_at: string | null

  /**
   * User profile data
   */
  profile?: Profile

  /**
   * Student data (if user is a student)
   */
  student?: Student

  /**
   * Teacher data (if user is a teacher)
   */
  teacher?: Teacher

  /**
   * User roles
   */
  roles?: Role[]

  /**
   * User permissions
   */
  permissions?: Permission[]
}

/**
 * User profile information
 */
export interface Profile extends Timestamps {
  /**
   * Unique identifier
   */
  id: number

  /**
   * Associated user ID
   */
  user_id: number

  /**
   * First name
   */
  first_name: string

  /**
   * Last name
   */
  last_name: string

  /**
   * Second last name (optional)
   */
  second_last_name?: string | null

  /**
   * Phone number
   */
  phone?: string | null

  /**
   * Date of birth
   */
  birth_date?: string | null

  /**
   * Profile picture URL
   */
  avatar_url?: string | null

  /**
   * Associated educational institution ID
   */
  educational_institution_id?: number | null

  /**
   * Associated educational institution
   */
  educational_institution?: EducationalInstitution

  /**
   * Additional metadata (JSON)
   */
  metadata?: Record<string, any>
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
