# Modelo ApplicationForm

## 📌 Ubicación
- **Modelo**: `app/Models/ApplicationForm.php`
- **Migración**: `database/migrations/2025_06_22_100330_create_application_forms_table.php`
- **Tabla Pivote**: `application_form_questions`
- **Controladores**: `app/Http/Controllers/Teacher/ApplicationFormController.php`
- **Vistas React**: `resources/js/pages/teacher/application-forms/`
- **TypeScript**: `resources/js/types/application-form.d.ts`

## 📝 Descripción
El modelo `ApplicationForm` representa un formulario de evaluación o práctica que los profesores pueden crear para evaluar a los estudiantes en el contexto de una sesión de aprendizaje. Cada formulario puede contener múltiples preguntas y está asociado a un área curricular específica dentro de un aula a través de `teacher_classroom_curricular_area_cycle_id`.

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `application_forms`

#### 🔑 Claves
- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `teacher_id` → `teachers(id)` (cascadeOnDelete)
  - `learning_session_id` → `learning_sessions(id)` (restrictOnDelete)
  - `teacher_classroom_curricular_area_cycle_id` → `teacher_classroom_curricular_area_cycles(id)`
- **Índices**:
  - `idx_application_form_status` (status)
  - `idx_application_form_start_date` (start_date)
  - `idx_application_form_end_date` (end_date)
  - `idx_application_form_learning_session` (learning_session_id)
  - `idx_application_form_scheduling` (status, start_date, end_date) - Índice compuesto

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint | No | Auto | Identificador único |
| name | string | No | - | Nombre del formulario |
| description | text | Sí | null | Descripción detallada |
| teacher_id | bigint | No | - | ID del profesor creador |
| learning_session_id | bigint | No | - | Sesión de aprendizaje relacionada |
| teacher_classroom_curricular_area_cycle_id | bigint | No | - | Relación con el aula/área curricular |
| status | enum | No | 'draft' | Estado del formulario (draft, scheduled, active, inactive, archived) |
| score_max | decimal(10,2) | No | 0.00 | Puntuación máxima posible |
| start_date | datetime | No | - | Fecha/hora de inicio de disponibilidad |
| end_date | datetime | No | - | Fecha/hora de finalización de disponibilidad |
| created_at | timestamp | No | current_timestamp | Fecha de creación |
| updated_at | timestamp | No | current_timestamp | Fecha de actualización |
| deleted_at | timestamp | Sí | null | Fecha de eliminación (soft delete) |

#### 📌 Enumeraciones
**status**: Estados posibles del formulario
- `draft`: Borrador (solo visible para el profesor)
- `scheduled`: Programado (visible pero no accesible)
- `active`: Activo (disponible para los estudiantes)
- `inactive`: Inactivo (no visible)
- `archived`: Archivado (solo lectura)
- `inactive`: Inactivo (no visible)
- `archived`: Archivado (solo lectura)

## 🤝 Relaciones

### 🔄 Uno a Muchos (Inversa)
- **`teacher`**: `BelongsTo`
  - Relación con el profesor creador del formulario
  - Clave foránea: `teacher_id`
  - Método: `$this->belongsTo(Teacher::class, 'teacher_id')`

- **`learningSession`**: `BelongsTo`
  - Relación con la sesión de aprendizaje asociada
  - Clave foránea: `learning_session_id`
  - Método: `$this->belongsTo(LearningSession::class)`

- **`teacherClassroomCurricularAreaCycle`**: `BelongsTo`
  - Relación con la asignación de aula/área curricular
  - Clave foránea: `teacher_classroom_curricular_area_cycle_id`
  - Método: `$this->belongsTo(TeacherClassroomCurricularAreaCycle::class)`

### 🔄 Uno a Muchos
- **`applicationFormQuestions`**: `HasMany`
  - Preguntas asociadas a este formulario
  - Clave foránea: `application_form_id` en `application_form_questions`
  - Método: `$this->hasMany(ApplicationFormQuestion::class)`

- **`questions`**: `HasManyThrough`
  - Preguntas asociadas a través de la tabla `application_form_questions`
  - Método: `$this->hasManyThrough(Question::class, ApplicationFormQuestion::class, 'application_form_id', 'id', 'id', 'question_id')`
  - Permite acceder directamente a las preguntas relacionadas

- **`responses`**: `HasMany`
  - Respuestas recibidas para este formulario
  - Clave foránea: `application_form_id` en `application_form_responses`
  - Método: `$this->hasMany(ApplicationFormResponse::class)`
  - Se eliminan en cascada cuando se elimina el formulario

## 🛠️ Métodos

### Scopes
- `scopeActive(Builder $query)`: Filtra formularios activos
- `scopeForTeacher(Builder $query, int $teacherId)`: Filtra formularios por profesor
- `scopeScheduledBetween(Builder $query, $start, $end)`: Filtra formularios programados en un rango de fechas

### Helpers
- `isActive()`: `bool`
  - Verifica si el formulario está activo actualmente
  - Retorna `true` si el estado es 'active' y la fecha actual está entre start_date y end_date

  - Retorna el promedio de puntuación de todas las respuestas
  - Retorna null si no hay respuestas

### Gestión de Preguntas
- `addQuestion(Question $question, int $points, int $order = null)`: `ApplicationFormQuestion`
  - Añade una pregunta al formulario
  - Parámetros:
    - `question`: Instancia de Question
    - `points`: Puntos que vale la pregunta
    - `order`: Orden de la pregunta (opcional)

## Eventos
- `creating`: Valida las fechas y el estado antes de crear
- `updating`: Valida los cambios en fechas y estado
- `deleting`: Impide la eliminación si tiene respuestas

## Validaciones
- El `start_date` debe ser anterior a `end_date`
- No se puede cambiar el estado a `active` sin preguntas
- No se puede editar si el estado es `archived`

## Uso con API
### Endpoints Relacionados
- `GET /api/application-forms` - Listar formularios
- `POST /api/application-forms` - Crear formulario
- `GET /api/application-forms/{id}` - Ver formulario
- `PUT /api/application-forms/{id}` - Actualizar formulario
- `DELETE /api/application-forms/{id}` - Eliminar formulario
- `POST /api/application-forms/{id}/questions` - Añadir pregunta

### Ejemplo de Respuesta JSON
```json
{
  "id": 1,
  "name": "Evaluación de Matemáticas",
  "description": "Evaluación sobre álgebra básica",
  "status": "active",
  "score_max": 100.00,
  "start_date": "2025-07-10T08:00:00.000000Z",
  "end_date": "2025-07-17T23:59:59.000000Z",
  "teacher_classroom_curricular_area_cycle_id": 5,
  "teacher_id": 3,
  "learning_session_id": 12,
  "created_at": "2025-07-01T10:30:00.000000Z",
  "updated_at": "2025-07-01T10:30:00.000000Z",
  "questions_count": 10,
  "responses_count": 25
}
```

## TypeScript
```typescript
interface ApplicationForm {
  id: number;
  name: string;
  description: string | null;
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived';
  score_max: number;
  start_date: string; // ISO 8601
  end_date: string;   // ISO 8601
  teacher_classroom_curricular_area_cycle_id: number;
  teacher_id: number;
  learning_session_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relación con asignación profesor/aula/área/ciclo
  teacherClassroomCurricularAreaCycle: {
    id: number;
    teacher: {
      id: number;
      user: {
        name: string;
      };
    };
    classroom: {
      id: number;
      name: string;
    };
    curricularAreaCycle: {
      id: number;
      curricularArea: {
        id: number;
        name: string;
      };
      cycle: {
        id: number;
        name: string;
      };
    };
  };
  // Relaciones opcionales
  teacherClassroomCurricularAreaCycle?: TeacherClassroomCurricularAreaCycle;
  teacher?: Teacher;
  learningSession?: LearningSession;
  questions?: ApplicationFormQuestion[];
  responses?: ApplicationFormResponse[];
  classroom?: Classroom;
  curricularArea?: CurricularArea;
}
```

## Buenas Prácticas
1. **Validación**: Usar Form Requests para validar la creación/actualización
2. **Autorización**: Implementar políticas para controlar el acceso
3. **Rendimiento**: Cargar relaciones con `with()` cuando sea necesario
4. **Transacciones**: Usar transacciones para operaciones atómicas
5. **Eventos**: Escuchar eventos para lógica de negocio compleja

## Consideraciones de Seguridad
- Solo los profesores pueden crear/editar formularios
- Los estudiantes solo pueden ver formularios activos
- Validar permisos para ver respuestas
- Sanitizar entradas para prevenir XSS
