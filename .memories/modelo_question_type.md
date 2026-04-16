# 📚 QuestionType

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100090_create_question_types_table.php` (estructura de base de datos)
>    - `app/Models/QuestionType.php` (implementación del modelo)
>    - `resources/js/types/application-form/question/question-type.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/QuestionType.php`
- **Tabla**: `question_types`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100090_create_question_types_table.php`
  - Estructura de la tabla
  - Tabla de referencia para el sistema de preguntas

### Modelos Relacionados

- `app/Models/Question.php` (hasMany)
  - Preguntas de este tipo
  - Clave foránea: `question_type_id`

### Tipos TypeScript

- `resources/js/types/application-form/question/question-type.d.ts`
  - `type QuestionTypeId`
  - `interface QuestionType`
  - `interface CreateQuestionTypeData`
  - `type UpdateQuestionTypeData`
  - `interface QuestionTypeFilters`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `question_types`
- **Campos Clave**:
  - `id`: bigint - Identificador único del tipo de pregunta
  - `name`: string - Nombre del tipo de pregunta
  - `timestamps()`: created_at, updated_at

### Constantes de Tipos de Pregunta

- `SINGLE_CHOICE = 1`: Pregunta de opción única
- `ORDERING = 2`: Pregunta de ordenamiento
- `MATCHING = 3`: Pregunta de emparejamiento
- `TRUE_FALSE = 4`: Pregunta de verdadero o falso

### Relaciones

- **Relación con Question**:
  - Tipo: hasMany
  - Clave foránea: `question_type_id`
  - Comportamiento en cascada: delete

## 🔄 Flujo de Datos

### Creación de Tipos de Pregunta

1. El sistema define los tipos de pregunta disponibles
2. Cada tipo tiene un ID constante y un nombre descriptivo
3. Los tipos de pregunta se usan para clasificar las preguntas

### Asociación con Preguntas

1. Al crear una pregunta, se selecciona un tipo de pregunta
2. La pregunta queda asociada al tipo
3. El tipo determina cómo se presenta y valida la pregunta

### Consultas Comunes

- Obtener todos los tipos: `QuestionType::all()`
- Obtener preguntas de un tipo: `$questionType->questions`
- Buscar tipo por nombre: `QuestionType::where('name', 'like', '%opción%')->get()`

## 🔍 Ejemplo de Uso

```typescript
export type QuestionTypeId = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES]

export interface QuestionType {
  id: QuestionTypeId
  name: string
  created_at: string
  updated_at: string
  questions?: Question[]
}

export interface CreateQuestionTypeData {
  name: string
}

export type UpdateQuestionTypeData = Partial<CreateQuestionTypeData>

export interface QuestionTypeFilters {
  search?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
```

## ⚙️ Configuración del Modelo

### Casts

- `created_at`: `datetime`
- `updated_at`: `datetime`

### Fillable

Los campos que pueden ser asignados masivamente:

- `name`

## ⚠️ Consideraciones

- Los tipos de pregunta son fundamentales para el sistema de evaluación
- Cada tipo tiene comportamientos específicos en la interfaz
- Los IDs son constantes definidas en el modelo
- No usa soft deletes
- Es una tabla de referencia para el sistema de preguntas
