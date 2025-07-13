# Modelo ApplicationForm

## Ubicación
- **Modelo**: `app/Models/ApplicationForm.php`
- **Migración**: `database/migrations/2025_06_22_100320_create_application_forms_table.php`
- **Tipo TypeScript**: `resources/js/types/application-form.d.ts`

## Modelos Relacionados
- `Teacher` (belongsTo)
- `LearningSession` (belongsTo)
- `TeacherClassroomCurricularAreaCycle` (belongsTo)
- `ApplicationFormQuestion` (hasMany)
- `ApplicationFormResponse` (hasMany)
- `Question` (a través de ApplicationFormQuestion)
- `ApplicationFormResponseQuestion` (a través de ApplicationFormResponse)

## Descripción
El modelo `ApplicationForm` representa un formulario de evaluación o práctica que los profesores pueden crear para evaluar a los estudiantes en el contexto de una sesión de aprendizaje. Cada formulario puede contener múltiples preguntas y está asociado a un área curricular específica dentro de un aula a través de `teacher_classroom_curricular_area_cycle_id`.

## TypeScript Types

```typescript
interface ApplicationForm {
  id: number;
  teacher_id: number;
  learning_session_id: number;
  teacher_classroom_curricular_area_cycle_id: number;
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  start_date: string;
  end_date: string;
  time_limit: number | null;
  max_attempts: number;
  passing_score: number | null;
  show_score: boolean;
  show_answers: boolean;
  is_shuffled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones
  teacher?: Teacher;
  learning_session?: LearningSession;
  teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle;
  questions?: ApplicationFormQuestion[];
  responses?: ApplicationFormResponse[];
  
  // Métodos
  isAvailable?: () => boolean;
  calculateTotalScore?: () => number;
  getQuestionCount?: () => number;
}
```

## Estructura de la Base de Datos

### Tabla: `application_forms`

#### Claves
- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `teacher_id` (referencia a `teachers.user_id`)
  - `learning_session_id` (referencia a `learning_sessions.id`)
  - `teacher_classroom_curricular_area_cycle_id` (referencia a `teacher_classroom_curricular_area_cycles.id`)
- **Índices**:
  - `idx_application_forms_teacher` (teacher_id)
  - `idx_application_forms_learning_session` (learning_session_id)
  - `idx_application_forms_tcac` (teacher_classroom_curricular_area_cycle_id)
  - `idx_application_forms_status` (status)
  - `idx_application_forms_dates` (start_date, end_date)

### Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint | No | Auto | Identificador único |
| teacher_id | bigint | No | - | Referencia al profesor creador |
| learning_session_id | bigint | No | - | Referencia a la sesión de aprendizaje |
| teacher_classroom_curricular_area_cycle_id | bigint | No | - | Referencia a la asignación profesor/aula/área/ciclo |
| title | string | No | - | Título del formulario |
| description | text | Sí | NULL | Descripción detallada |
| status | enum | No | 'draft' | Estado del formulario (draft, published, archived) |
| start_date | datetime | No | - | Fecha de inicio de aplicación |
| end_date | datetime | No | - | Fecha de fin de aplicación |
| time_limit | int | Sí | NULL | Límite de tiempo en minutos (opcional) |
| max_attempts | int | No | 1 | Número máximo de intentos permitidos |
| passing_score | decimal(5,2) | Sí | NULL | Puntaje mínimo para aprobar |
| show_score | boolean | No | false | Mostrar puntaje al estudiante |
| show_answers | boolean | No | false | Mostrar respuestas correctas |
| is_shuffled | boolean | No | false | Mezclar preguntas aleatoriamente |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de actualización |
| deleted_at | timestamp | Sí | NULL | Fecha de eliminación (soft delete) |

## Relaciones

### teacher (BelongsTo)
- **Modelo**: `Teacher`
- **Clave foránea**: `teacher_id`
- **Eliminación**: `restrictOnDelete`
- **Índice**: `idx_application_forms_teacher`

### learningSession (BelongsTo)
- **Modelo**: `LearningSession`
- **Clave foránea**: `learning_session_id`
- **Eliminación**: `restrictOnDelete`
- **Índice**: `idx_application_forms_learning_session`

### teacherClassroomCurricularAreaCycle (BelongsTo)
- **Modelo**: `TeacherClassroomCurricularAreaCycle`
- **Clave foránea**: `teacher_classroom_curricular_area_cycle_id`
- **Eliminación**: `restrictOnDelete`
- **Índice**: `idx_application_forms_tcac`

### questions (HasMany)
- **Modelo**: `ApplicationFormQuestion`
- **Clave foránea**: `application_form_id`
- **Eliminación**: `cascadeOnDelete`
- **Ordenamiento**: `order` ASC

### responses (HasMany)
- **Modelo**: `ApplicationFormResponse`
- **Clave foránea**: `application_form_id`
- **Eliminación**: `cascadeOnDelete`

## Métodos

### boot()
- **Propósito**: Inicializar los observadores del modelo
- **Comportamiento**:
  - Agrega el evento `creating` para establecer valores por defecto
  - Agrega el evento `saving` para validar fechas y puntajes

### scopePublished()
- **Tipo**: Scope de consulta
- **Parámetros**: `Builder $query`
- **Retorna**: `Builder`
- **Descripción**: Filtra los formularios publicados

### isAvailable()
- **Tipo**: Método de instancia
- **Retorna**: `bool`
- **Descripción**: Verifica si el formulario está disponible para ser respondido
- **Condiciones**:
  - Estado debe ser 'published'
  - Fecha actual debe estar entre start_date y end_date
  - Número de intentos debe ser menor a max_attempts

### calculateTotalScore()
- **Tipo**: Método de instancia
- **Retorna**: `float`
- **Descripción**: Calcula la puntuación total sumando los puntos de todas las preguntas

### getQuestionCount()
- **Tipo**: Método de instancia
- **Retorna**: `int`
- **Descripción**: Obtiene el número total de preguntas en el formulario

## Ciclo de Vida

### Eventos
- **creating**: Se dispara antes de crear un nuevo registro
  - Establece valores por defecto si no se proporcionan
  - Valida las fechas y el estado

- **saving**: Se dispara antes de guardar (crear o actualizar)
  - Valida que end_date sea posterior a start_date
  - Valida que passing_score sea coherente con las preguntas

## Validaciones

### Creación/Actualización
- `title`: requerido, string, máximo 255 caracteres
- `status`: requerido, enum('draft', 'published', 'archived')
- `start_date`: requerido, fecha
- `end_date`: requerido, fecha posterior a start_date
- `max_attempts`: requerido, entero, mínimo 1
- `passing_score`: nullable, numérico, entre 0 y 100
- `teacher_id`: requerido, existe en teachers
- `learning_session_id`: requerido, existe en learning_sessions
- `teacher_classroom_curricular_area_cycle_id`: requerido, existe en teacher_classroom_curricular_area_cycles

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
  "title": "Evaluación de Matemáticas",
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
  title: string;
  description: string | null;
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived';
  score_max: number;
  start_date: string; // ISO 8601
  end_date: string;   // ISO 8601
  teacher_classroom_curricular_area_cycle_id: number;
  teacher_id: number;
  learning_session_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones
  teacher?: Teacher;
  learningSession?: LearningSession;
  teacherClassroomCurricularAreaCycle?: TeacherClassroomCurricularAreaCycle;
  applicationFormQuestions?: ApplicationFormQuestion[];
  responses?: ApplicationFormResponse[];
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
