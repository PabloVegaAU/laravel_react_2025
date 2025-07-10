# Modelo ApplicationFormQuestion

## 📌 Ubicación
- **Modelo**: `app/Models/ApplicationFormQuestion.php`
- **Migración**: `database/migrations/2025_06_22_100350_create_application_form_questions_table.php`
- **Controladores**: `app/Http/Controllers/Teacher/ApplicationFormQuestionController.php`
- **TypeScript**: `resources/js/types/application-form-question.d.ts`

## 📝 Descripción
El modelo `ApplicationFormQuestion` representa la relación entre un formulario de aplicación (ApplicationForm) y las preguntas que lo componen. Este modelo permite:

- Definir el orden de las preguntas dentro de un formulario
- Establecer puntuaciones específicas por pregunta
- Asignar puntos de tienda por respuestas correctas
- Gestionar la relación muchos a muchos entre formularios y preguntas

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `application_form_questions`

#### 🔑 Claves
- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `application_form_id` → `application_forms(id)` (cascadeOnDelete)
  - `question_id` → `questions(id)` (restrictOnDelete)
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
| order | int | No | - | Orden de la pregunta en el formulario (1-based) |
| score | decimal(10,2) | No | 0.00 | Puntaje máximo de la pregunta |
| points_store | decimal(10,2) | No | 0.00 | Puntos que otorga en la tienda al responder correctamente |
| created_at | timestamp | No | current_timestamp | Fecha de creación |
| updated_at | timestamp | No | current_timestamp | Fecha de actualización |

## 🤝 Relaciones

### 🔄 Pertenece a (Belongs To)
- **`applicationForm`**: `BelongsTo`
  - Relación con el formulario de aplicación
  - Clave foránea: `application_form_id`
  - Eliminación en cascada
  - Método: `$this->belongsTo(ApplicationForm::class)->cascadeOnDelete()`

- **`question`**: `BelongsTo`
  - Relación con la pregunta
  - Clave foránea: `question_id`
  - Restricción de eliminación (no se puede eliminar una pregunta usada en formularios)
  - Método: `$this->belongsTo(Question::class)->restrictOnDelete()`

### 🔄 Tiene muchos (Has Many)
- **`responseQuestions`**: `HasMany`
  - Relación con las respuestas a esta pregunta específica en el formulario
  - Clave foránea: `application_form_question_id` en `application_form_response_questions`
  - Método: `$this->hasMany(ApplicationFormResponseQuestion::class, 'application_form_question_id')`

## 🛠️ Métodos

### Getters/Setters
- `getOrderedQuestions(int $formId)`: Obtiene las preguntas ordenadas de un formulario
- `calculateTotalScore(int $formId)`: Calcula la puntuación total del formulario
- `getQuestionsWithAnswers(int $formId, int $responseId)`: Obtiene preguntas con respuestas de un estudiante

### Helpers
- `reorderQuestions(array $questionIds)`: Reordena las preguntas del formulario
- `attachQuestion(int $formId, int $questionId, array $attributes)`: Añade una pregunta al formulario
- `detachQuestion(int $formId, int $questionId)`: Elimina una pregunta del formulario

## 📊 Ejemplo de Uso

```php
// Obtener todas las preguntas de un formulario ordenadas
$questions = ApplicationFormQuestion::where('application_form_id', $formId)
    ->orderBy('order')
    ->with('question')
    ->get();

// Añadir una pregunta a un formulario
ApplicationFormQuestion::create([
    'application_form_id' => $formId,
    'question_id' => $questionId,
    'order' => $nextOrder,
    'score' => 10.00,
    'points_store' => 5.00
]);

// Obtener el formulario y sus preguntas con información relacionada
$form = ApplicationForm::with(['questions' => function($query) {
    $query->orderBy('order');
}, 'questions.question', 'questions.question.options'])->find($formId);
```

## 🔍 Consideraciones

1. **Integridad Referencial**:
   - La eliminación de un formulario eliminará automáticamente sus preguntas (cascadeOnDelete)
   - No se puede eliminar una pregunta que esté siendo usada en formularios (restrictOnDelete)

2. **Rendimiento**:
   - Los índices están optimizados para consultas frecuentes de ordenación y búsqueda
   - Se recomienda cargar las relaciones necesarias (with) para evitar el problema N+1

3. **Validaciones**:
   - El orden de las preguntas debe ser único dentro de un mismo formulario
   - Los valores de score y points_store deben ser positivos
   - No se permiten preguntas duplicadas en el mismo formulario (índice único compuesto)
