# 🗂️ Modelo ApplicationFormQuestion

## 📌 Ubicación
- **Modelo**: `app/Models/ApplicationFormQuestion.php`
- **Migración**: `database/migrations/2025_06_22_100350_create_application_form_questions_table.php`
- **Tipo TypeScript**: `resources/js/types/application-form-question.d.ts`

## 🔄 Modelos Relacionados
- `ApplicationForm` (belongsTo)
- `Question` (belongsTo)
- `ApplicationFormResponseQuestion` (hasMany)
- `QuestionOption` (a través de Question)
- `ApplicationFormResponseQuestionOption` (a través de ApplicationFormResponseQuestion)

## 📝 Descripción
El modelo `ApplicationFormQuestion` establece la relación entre `ApplicationForm` y `Question`, permitiendo la reutilización de preguntas en múltiples formularios con configuraciones específicas.

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `application_form_questions`

#### 🔑 Claves
- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `application_form_id` → `application_forms.id` (cascadeOnDelete)
  - `question_id` → `questions.id` (restrictOnDelete)
- **Índices**:
  - `uq_application_form_question` (application_form_id, question_id) - Índice único compuesto
  - `idx_application_form_question_application_form` (application_form_id)
  - `idx_application_form_question_question` (question_id)
  - `idx_application_form_question_application_form_order` (application_form_id, order)

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint | No | Auto | Identificador único |
| application_form_id | bigint | No | - | Referencia al formulario de aplicación |
| question_id | bigint | No | - | Referencia a la pregunta |
| order | int | No | 0 | Orden de la pregunta en el formulario |
| is_required | boolean | No | true | Indica si la pregunta es obligatoria |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de actualización |
| deleted_at | timestamp | Sí | NULL | Fecha de eliminación (soft delete) |

## 🤝 Relaciones

### applicationForm (BelongsTo)
- **Modelo**: `ApplicationForm`
- **Clave foránea**: `application_form_id`
- **Eliminación**: `cascadeOnDelete`
- **Índice**: `idx_application_form_question_application_form`

### question (BelongsTo)
- **Modelo**: `Question`
- **Clave foránea**: `question_id`
- **Eliminación**: `restrictOnDelete`
- **Índice**: `idx_application_form_question_question`

### responseQuestions (HasMany)
- **Modelo**: `ApplicationFormResponseQuestion`
- **Clave foránea**: `application_form_question_id`
- **Eliminación**: `cascadeOnDelete`

## 🛠️ Métodos

### boot()
- **Propósito**: Inicializar los observadores del modelo
- **Comportamiento**:
  - Agrega el evento `creating` para establecer el orden de la pregunta si no se proporciona

### applicationForm()
- **Tipo**: belongsTo
- **Modelo**: `ApplicationForm`
- **Retorna**: Relación con el formulario de aplicación

### question()
- **Tipo**: belongsTo
- **Modelo**: `Question`
- **Retorna**: Relación con la pregunta base

### responseQuestions()
- **Tipo**: hasMany
- **Modelo**: `ApplicationFormResponseQuestion`
- **Retorna**: Colección de respuestas a esta pregunta en formularios

## 📦 Tipo TypeScript

```typescript
interface ApplicationFormQuestion {
  id: number;
  application_form_id: number;
  question_id: number;
  order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones
  application_form?: ApplicationForm;
  question?: Question;
  response_questions?: ApplicationFormResponseQuestion[];
  
  // Relaciones anidadas
  question_options?: QuestionOption[];
}
```
