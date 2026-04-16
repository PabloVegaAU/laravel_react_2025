# Modelo: Question

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Question.php`
**Migración:** `database/migrations/2025_06_22_100100_create_questions_table.php`
**TypeScript:** `resources/js/types/application-form/question/question.d.ts`

## Descripción

El modelo `Question` representa una pregunta en el sistema de evaluación. Las preguntas son creadas por docentes y evalúan capacidades específicas. Cada pregunta tiene un tipo, nivel de dificultad, nivel educativo, y puede tener múltiples opciones de respuesta según su tipo.

## Estructura de Base de Datos

### Tabla: `questions`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `bigint` (PK) | Identificador único de la pregunta |
| `teacher_id` | `bigint` (FK) | Referencia al profesor que creó la pregunta |
| `question_type_id` | `bigint` (FK) | Tipo de pregunta |
| `capability_id` | `bigint` (FK) | Capacidad evaluada por la pregunta |
| `name` | `string` | Nombre descriptivo de la pregunta |
| `description` | `text` (nullable) | Enunciado o contenido completo de la pregunta |
| `image` | `string` (nullable) | URL de la imagen asociada a la pregunta |
| `help_message` | `text` (nullable) | Texto de ayuda o pista para responder |
| `difficulty` | `enum` | Nivel de dificultad ('easy', 'medium', 'hard') |
| `explanation_required` | `boolean` | Indica si se requiere explicación |
| `level` | `enum` | Nivel educativo ('primary', 'secondary') |
| `grades` | `string` | Grados académicos (ej: 1st,2nd,3rd) - JSON |
| `created_at` | `timestamp` | Fecha de creación |
| `updated_at` | `timestamp` | Fecha de actualización |
| `deleted_at` | `timestamp` (nullable) | Fecha de eliminación suave |

### Índices
- `idx_question_difficulty`: Índice en `difficulty`
- `idx_question_teacher`: Índice en `teacher_id`
- `idx_question_type`: Índice en `question_type_id`
- `idx_question_capability`: Índice en `capability_id`
- `idx_question_type_difficulty`: Índice compuesto en `question_type_id` y `difficulty`
- `ft_question_search`: Índice de texto completo en `name` y `description`

### Relaciones
- Foreign key `teacher_id`: referencia a `teachers.user_id` con `restrictOnDelete`
- Foreign key `question_type_id`: referencia a `question_types.id` con `restrictOnDelete`
- Foreign key `capability_id`: referencia a `capabilities.id` con `restrictOnDelete`

## Relaciones Eloquent

### BelongsTo
- **teacher**: Relación con `Teacher` - docente que creó la pregunta
  - Foreign key: `teacher_id` referenciando `user_id` en Teacher

- **questionType**: Relación con `QuestionType` - tipo de pregunta

- **capability**: Relación con `Capability` - capacidad evaluada

### HasMany
- **options**: Relación con `QuestionOption` - opciones de respuesta de la pregunta

- **applicationFormQuestions**: Relación con `ApplicationFormQuestion` - preguntas en formularios

## Constantes

**Dificultad:**
- `DIFFICULTY_EASY = 'easy'`
- `DIFFICULTY_MEDIUM = 'medium'`
- `DIFFICULTY_HARD = 'hard'`

**Nivel Educativo:**
- `LEVEL_PRIMARY = 'primary'`
- `LEVEL_SECONDARY = 'secondary'`

## Casts y Fechas

**Casts:**
- `difficulty`: `string`
- `explanation_required`: `boolean`
- `grades`: `array`
- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

## Fillable

Los campos que pueden ser asignados masivamente:
- `teacher_id`
- `question_type_id`
- `capability_id`
- `name`
- `description`
- `image`
- `help_message`
- `difficulty`
- `explanation_required`
- `level`
- `grades`

## Scopes

- **scopeEasy**: Filtra preguntas de dificultad fácil
- **scopeMedium**: Filtra preguntas de dificultad media
- **scopeHard**: Filtra preguntas de dificultad difícil
- **scopePrimaryLevel**: Filtra preguntas de nivel primaria
- **scopeSecondaryLevel**: Filtra preguntas de nivel secundaria
- **scopeForGrade**: Filtra preguntas por grado (JSON contains)
- **scopeForTeacher**: Filtra preguntas por docente
- **scopeForCapability**: Filtra preguntas por capacidad
- **scopeSearch**: Busca por nombre o descripción

## Métodos

- **isCorrectOption(int $optionId)**: Verifica si una opción es correcta
- **hasCorrectOptions()**: Verifica si la pregunta tiene opciones correctas

## TypeScript Types

```typescript
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type QuestionLevel = 'primary' | 'secondary'

export interface Question {
  id: number
  name: string
  description: string
  image: string | null
  help_message: string | null
  difficulty: QuestionDifficulty
  explanation_required: boolean
  level: QuestionLevel
  grades: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  teacher_id: number
  question_type_id: number
  capability_id: number
  question_type: QuestionType
  capability: Capability
  teacher: Teacher
  options: QuestionOption[]
  applicationFormQuestions: ApplicationFormQuestion[]
}

export interface CreateQuestionData {
  name: string
  description: string
  image?: string | null
  help_message?: string | null
  difficulty: QuestionDifficulty
  explanation_required?: boolean
  level?: QuestionLevel
  grades?: string[]
  teacher_id: number
  question_type_id: number
  capability_id: number
  options?: Array<{
    value: string
    is_correct: boolean
    order?: number
  }>
}

export interface UpdateQuestionData {
  id: number
  name?: string
  description?: string
  image?: string | null
  help_message?: string | null
  difficulty?: QuestionDifficulty
  explanation_required?: boolean
  level?: QuestionLevel
  grades?: string[]
  question_type_id?: number
  capability_id?: number
  options?: {
    create?: Array<{...}>
    update?: Array<{...}>
    delete?: number[]
  }
}

export interface QuestionFilters {
  search?: string
  difficulty?: QuestionDifficulty | QuestionDifficulty[]
  question_type_id?: number | number[]
  capability_id?: number | number[]
  teacher_id?: number | number[]
  level?: QuestionLevel
  grade?: string
  has_correct_options?: boolean
  with_trashed?: boolean
  only_trashed?: boolean
  page?: number
  per_page?: number
  sort_by?: 'created_at' | 'updated_at' | 'name' | 'difficulty' | 'level'
  sort_order?: 'asc' | 'desc'
}
```

## Flujo de Datos

### Creación de Preguntas
1. El docente selecciona el tipo de pregunta y la capacidad a evaluar
2. Define el nombre, descripción, dificultad y nivel educativo
3. Especifica los grados académicos aplicables
4. Crea las opciones de respuesta según el tipo de pregunta
5. La pregunta se guarda en la base de datos

### Validación de Preguntas
1. El sistema verifica que la pregunta tenga al menos una opción correcta
2. Valida que las opciones sean coherentes con el tipo de pregunta
3. Verifica que el docente tenga permisos para crear preguntas

### Consultas Comunes
- Obtener preguntas por dificultad: `Question::easy()->get()`
- Obtener preguntas por nivel: `Question::primaryLevel()->get()`
- Obtener preguntas por docente: `Question::forTeacher($teacherId)->get()`
- Obtener preguntas por capacidad: `Question::forCapability($capabilityId)->get()`
- Buscar preguntas: `Question::search('matemáticas')->get()`

## Notas Importantes

- Usa soft deletes para permitir recuperación de preguntas eliminadas
- El campo `grades` se almacena como JSON array
- Usa `restrictOnDelete` para evitar eliminar tipos o capacidades con preguntas
- El índice de texto completo permite búsquedas eficientes
- Los scopes facilitan consultas comunes
- Las opciones se eliminan en cascada cuando se elimina la pregunta
- La dificultad y nivel tienen valores por defecto
