# Modelo: QuestionOption

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/QuestionOption.php`
**Migración:** `database/migrations/2025_06_22_100110_create_question_options_table.php`
**TypeScript:** `resources/js/types/application-form/question/question-option.d.ts`

## Descripción

El modelo `QuestionOption` representa una opción de respuesta para una pregunta. Las opciones varían según el tipo de pregunta: para opción múltiple tienen un valor y marcador de correcto, para ordenamiento tienen un orden correcto, y para emparejamiento tienen claves de pares y lados.

## Estructura de Base de Datos

### Tabla: `question_options`

| Campo           | Tipo                | Descripción                                                |
| --------------- | ------------------- | ---------------------------------------------------------- |
| `id`            | `bigint` (PK)       | Identificador único de la opción                           |
| `question_id`   | `foreignId` (FK)    | Referencia a la pregunta (questions.id, cascadeOnDelete)   |
| `value`         | `string`            | Texto de la opción de respuesta                            |
| `is_correct`    | `boolean`           | Indica si esta opción es la respuesta correcta             |
| `order`         | `unsignedInteger`   | Orden de visualización de la opción                        |
| `correct_order` | `unsignedInteger`   | Para preguntas de ordenar, indica el orden correcto        |
| `pair_key`      | `string` (nullable) | Para preguntas de emparejar, identifica pares relacionados |
| `pair_side`     | `enum` (nullable)   | Lado del emparejamiento ('left', 'right')                  |
| `score`         | `decimal(10,2)`     | Puntuación otorgada al seleccionar esta opción             |
| `created_at`    | `timestamp`         | Fecha de creación                                          |
| `updated_at`    | `timestamp`         | Fecha de actualización                                     |

### Índices

- `idx_question_option_correct`: Índice en `is_correct`
- `idx_question_option_question`: Índice en `question_id`
- `idx_question_option_correct_answers`: Índice compuesto en `question_id` y `is_correct`

### Relaciones

- Foreign key `question_id`: referencia a `questions.id` con `cascadeOnDelete`

## Relaciones Eloquent

### BelongsTo

- **question**: Relación con `Question` - pregunta a la que pertenece la opción
  - Incluye `withTrashed()` para obtener opciones de preguntas eliminadas

### HasMany

- **responseQuestionOptions**: Relación con `ApplicationFormResponseQuestionOption` - respuestas de estudiantes que seleccionaron esta opción

## Casts y Fechas

**Casts:**

- `is_correct`: `boolean`
- `order`: `integer`
- `correct_order`: `integer`
- `score`: `decimal:2`
- `created_at`: `datetime`
- `updated_at`: `datetime`

## Fillable

Los campos que pueden ser asignados masivamente:

- `question_id`
- `value`
- `is_correct`
- `order`
- `correct_order`
- `pair_key`
- `pair_side`
- `score`

## Scopes

- **scopeCorrect**: Filtra opciones correctas
- **scopeForQuestion**: Filtra opciones por pregunta
- **scopeForPair**: Filtra opciones por clave de par
- **scopeLeftSide**: Filtra opciones del lado izquierdo
- **scopeRightSide**: Filtra opciones del lado derecho

## Métodos

- **isLeftSide()**: Verifica si la opción es del lado izquierdo
- **isRightSide()**: Verifica si la opción es del lado derecho

## TypeScript Types

```typescript
type PairSide = 'left' | 'right'

export interface QuestionOption {
  id: number
  question_id: number
  value: string
  is_correct: boolean
  order: number
  correct_order: number | null
  pair_key: string | null
  pair_side: PairSide | null
  score: number
  created_at: string
  updated_at: string

  question: Question
  responseQuestionOptions: ApplicationFormResponseQuestionOption[]
}

export interface CreateQuestionOptionData {
  question_id: number
  value: string
  is_correct?: boolean
  order?: number
  correct_order?: number
  pair_key?: string | null
  pair_side?: PairSide | null
  score?: number
}

export interface UpdateQuestionOptionData {
  id: number
  value?: string
  is_correct?: boolean
  order?: number
  correct_order?: number
  pair_key?: string | null
  pair_side?: PairSide | null
  score?: number
}

export interface BulkQuestionOptionOperationData {
  create?: CreateQuestionOptionData[]
  update?: UpdateQuestionOptionData[]
  delete?: number[]
}

export interface ReorderQuestionOptionsData {
  question_id: number
  option_ids: number[]
  correct_orders?: Record<number, number>
  pair_keys?: Record<number, string>
}

export interface QuestionOptionFilters {
  question_id?: number
  is_correct?: boolean
  pair_side?: PairSide
  pair_key?: string
  sort_by?: 'order' | 'correct_order' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
```

## Flujo de Datos

### Creación de Opciones

1. Al crear una pregunta, se definen sus opciones
2. Cada opción tiene un valor y configuración según el tipo de pregunta
3. Para opción múltiple: se marca `is_correct`
4. Para ordenamiento: se define `correct_order`
5. Para emparejamiento: se define `pair_key` y `pair_side`

### Validación de Respuestas

1. Cuando un estudiante responde, el sistema verifica las opciones seleccionadas
2. Compara con las opciones marcadas como correctas
3. Calcula la puntuación basada en el `score` de las opciones correctas

### Consultas Comunes

- Obtener opciones de una pregunta: `$question->options`
- Obtener opciones correctas: `QuestionOption::correct()->get()`
- Obtener opciones por pregunta: `QuestionOption::forQuestion($questionId)->get()`
- Obtener opciones de un par: `QuestionOption::forPair('pair1')->get()`

## Notas Importantes

- Usa `cascadeOnDelete` para eliminar opciones cuando se elimina la pregunta
- La relación con pregunta incluye `withTrashed()` para mantener opciones de preguntas eliminadas
- El campo `score` permite puntuación parcial
- Los campos específicos para cada tipo de pregunta (correct_order, pair_key, pair_side)
- Los índices optimizan consultas frecuentes
- Los scopes facilitan filtrado por tipo de pregunta
