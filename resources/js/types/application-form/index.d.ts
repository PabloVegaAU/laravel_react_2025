// Tipos principales
export * from './application-form'

// Tipos para formularios
export * from './form/application-form-question'
export * from './form/response/application-form-response'
export * from './form/response/application-form-response-question'
export * from './form/response/application-form-response-question-option'

// Tipos para preguntas
export * from './form/response/response-answer'
export * from './question/question'
export * from './question/question-option'
export * from './question/question-type'

// Re-exportar tipos comunes
export type {
  ApplicationForm,
  ApplicationFormFilters,
  ApplicationFormStats,
  ApplicationFormStatus,
  CreateApplicationFormData,
  DuplicateApplicationFormData,
  UpdateApplicationFormData
} from './application-form'
