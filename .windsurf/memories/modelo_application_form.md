# Modelo ApplicationForm

## Ubicación del archivo
- `app/Models/ApplicationForm.php`

## Migración relacionada
- `database/migrations/2025_06_22_100330_create_application_forms_table.php`

## Descripción
El modelo ApplicationForm representa un formulario de aplicación o práctica que los profesores pueden crear para sus estudiantes.

## Estructura de la base de datos
### Tabla: `application_forms`
- **Clave primaria**: `id` (bigint autoincremental)
- **Soft deletes**: Sí
- **Índices**:
  - `idx_application_form_status` (status)
  - `idx_application_form_start_date` (start_date)
  - `idx_application_form_end_date` (end_date)
  - `idx_application_form_tcca` (teacher_classroom_curricular_area_id)
  - `idx_application_form_teacher` (teacher_id)
  - `idx_application_form_learning_session` (learning_session_id)
  - `idx_application_form_scheduling` (status, start_date, end_date) - Índice compuesto

### Estructura de columnas
| Columna | Tipo | Nulo | Default | Comentario |
|---------|------|------|---------|------------|
| id | bigint | No | Auto | Identificador único |
| name | string | No | - | Nombre del formulario |
| description | text | Sí | null | Descripción detallada |
| teacher_classroom_curricular_area_id | bigint | No | - | FK a teacher_classroom_curricular_areas |
| teacher_id | bigint | No | - | FK a teachers (user_id) |
| learning_session_id | bigint | No | - | FK a learning_sessions |
| status | enum | No | 'draft' | Estado del formulario |
| score_max | decimal(10,2) | No | - | Puntuación máxima posible |
| start_date | datetime | No | - | Fecha de inicio |
| end_date | datetime | No | - | Fecha de finalización |
| created_at | timestamp | No | - | Fecha de creación |
| updated_at | timestamp | No | - | Fecha de actualización |
| deleted_at | timestamp | Sí | null | Fecha de eliminación |

### Valores de status
- `draft`: Borrador (solo visible para el profesor)
- `scheduled`: Programada (visible pero no accesible)
- `active`: Activa (disponible para los estudiantes)
- `inactive`: Inactiva (no visible)
- `archived`: Archivada (solo lectura)

### Restricciones de clave foránea
- `teacher_classroom_curricular_area_id` referencia a `teacher_classroom_curricular_areas(id)` con `ON DELETE RESTRICT`
- `teacher_id` referencia a `teachers(user_id)` con `ON DELETE RESTRICT`
- `learning_session_id` referencia a `learning_sessions(id)` con `ON DELETE RESTRICT`

## Relaciones
- `teacherClassroomCurricularArea`: Relación BelongsTo con TeacherClassroomCurricularArea
- `teacher`: Relación BelongsTo con Teacher
- `learningSession`: Relación BelongsTo con LearningSession
- `applicationFormQuestions`: Relación HasMany con ApplicationFormQuestion
- `questions`: Relación HasManyThrough con Question a través de ApplicationFormQuestion
- `applicationFormResponses`: Relación HasMany con ApplicationFormResponse

## Métodos importantes
- `isActive()`: Verifica si el formulario está activo
- `isScheduled()`: Verifica si el formulario está programado
- `isAvailable()`: Verifica si el formulario está disponible para los estudiantes
- `isEditable()`: Verifica si el formulario se puede editar

## Notas adicionales
- Utiliza SoftDeletes para eliminación lógica
- Incluye índices optimizados para consultas frecuentes
- Mantiene un historial de cambios a través de los timestamps
- La relación con Teacher es redundante (ya existe a través de TeacherClassroomCurricularArea) pero mejora el rendimiento de consultas
