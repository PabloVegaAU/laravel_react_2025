# Estructura de la Base de Datos - Laravel 12 + React + Inertia.js

## 1. Visión General
La base de datos está diseñada siguiendo las convenciones de Laravel 12 Eloquent ORM y utiliza migraciones para el control de versiones. El esquema está organizado en módulos lógicos que representan las diferentes áreas funcionales del sistema educativo.

## 2. Arquitectura General

### 2.1 Convenciones
- Todas las tablas usan `id` como clave primaria (bigint autoincremental)
- Las claves foráneas siguen el patrón `nombre_tabla_singular_id`
- Todas las tablas incluyen `created_at` y `updated_at` (timestamps)
- Las tablas con eliminación lógica usan `deleted_at` (soft deletes)
- Los nombres de tablas están en inglés y en plural (snake_case)
- Las tablas pivot usan nombres en orden alfabético (ej: `curricular_area_cycles`)
- Los campos de tipo `enum` tienen valores específicos documentados
- Los campos numéricos usan `decimal(10,2)` para valores monetarios o de puntuación

### Estructura de Carpetas
```
database/
  migrations/    # Migraciones de la base de datos
  seeders/       # Seeders para datos iniciales
  factories/     # Factories para pruebas
```

## Archivos de Migración

A continuación se listan todos los archivos de migración del sistema, organizados por orden de ejecución:

### Migraciones del Framework
1. `0001_01_01_000000_create_users_table.php` - Tabla de usuarios
2. `0001_01_01_000001_create_cache_table.php` - Tabla de caché
3. `0001_01_01_000002_create_jobs_table.php` - Tabla de trabajos en cola

### Migraciones de Autenticación y Permisos
4. `2025_06_19_044210_create_permission_tables.php` - Tablas de roles y permisos

### Migraciones del Sistema Educativo
5. `2025_06_22_100000_create_levels_table.php` - Niveles académicos
6. `2025_06_22_100010_create_ranges_table.php` - Rangos de nivel
7. `2025_06_22_100020_create_profiles_table.php` - Perfiles de usuario
8. `2025_06_22_100030_create_students_table.php` - Estudiantes
9. `2025_06_22_100040_create_teachers_table.php` - Profesores
10. `2025_06_22_100050_create_cycles_table.php` - Ciclos académicos
11. `2025_06_22_100060_create_curricular_areas_table.php` - Áreas curriculares
12. `2025_06_22_100065_create_curricular_area_cycles.php` - Relación áreas-curriculares-ciclos
13. `2025_06_22_100070_create_competencies_table.php` - Competencias
14. `2025_06_22_100080_create_capabilities_table.php` - Capacidades
15. `2025_06_22_100090_create_question_types_table.php` - Tipos de preguntas
16. `2025_06_22_100100_create_questions_table.php` - Preguntas
17. `2025_06_22_100110_create_question_options_table.php` - Opciones de preguntas
18. `2025_06_22_100120_create_classrooms_table.php` - Aulas
19. `2025_06_22_100130_create_enrollments_table.php` - Matrículas
20. `2025_06_22_100140_create_student_level_histories_table.php` - Historial de niveles
21. `2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php` - Asignación docente
22. `2025_06_22_100260_create_achievements_table.php` - Logros
23. `2025_06_22_100270_create_student_achievements_table.php` - Logros de estudiantes
24. `2025_06_22_100280_create_educational_institutions_table.php` - Instituciones educativas
25. `2025_06_22_100300_create_learning_sessions_table.php` - Sesiones de aprendizaje
26. `2025_06_22_100310_create_learning_session_capabilities_table.php` - Capacidades por sesión
27. `2025_06_22_100330_create_application_forms_table.php` - Formularios de aplicación
28. `2025_06_22_100340_create_application_form_responses_table.php` - Respuestas a formularios
29. `2025_06_22_100350_create_application_form_questions_table.php` - Preguntas de formularios
30. `2025_06_22_100360_create_application_form_response_question_table.php` - Respuestas a preguntas
31. `2025_06_22_100370_create_application_form_response_question_options_table.php` - Opciones de respuestas

### Migraciones de Recompensas y Tienda
32. `2025_06_22_100400_create_store_rewards_table.php` - Recompensas de tienda
33. `2025_06_22_100410_create_student_store_rewards_table.php` - Recompensas de estudiantes
34. `2025_06_22_100420_create_avatars_table.php` - Avatares
35. `2025_06_22_100430_create_student_avatars_table.php` - Avatares de estudiantes
36. `2025_06_22_100440_create_backgrounds_table.php` - Fondos
37. `2025_06_22_100450_create_student_backgrounds_table.php` - Fondos de estudiantes

## Módulos Principales

### 1. Autenticación y Usuarios
**Archivos relacionados:**
- `[1] 0001_01_01_000000_create_users_table.php` - Tabla principal de usuarios
- `[4] 2025_06_19_044210_create_permission_tables.php` - Roles y permisos
- `[7] 2025_06_22_100020_create_profiles_table.php` - Perfiles de usuario
- `[8] 2025_06_22_100030_create_students_table.php` - Datos de estudiantes
- `[9] 2025_06_22_100040_create_teachers_table.php` - Datos de profesores

#### users
- **Descripción**: Tabla principal de usuarios del sistema
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del usuario (string, 255)
  - `email`: Correo electrónico (string, 255, único)
  - `email_verified_at`: Fecha de verificación de correo (timestamp, nullable)
  - `password`: Contraseña hasheada (string, 255)
  - `remember_token`: Token para "recordar sesión" (string, 100, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
  - `deleted_at`: Eliminación lógica (timestamp, nullable)
- **Índices**: 
  - Índice único en `email`
  - Índice en `deleted_at` para soft deletes
- **Relaciones**:
  - `profile`: Relación 1:1 con `profiles`
  - `student`: Relación 1:1 con `students`
  - `teacher`: Relación 1:1 con `teachers`
  - `roles`: Relación muchos a muchos con `roles` a través de `model_has_roles`
  - `permissions`: Permisos directos del usuario

#### profiles
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `first_name`: Nombre (string, 100)
  - `last_name`: Apellido paterno (string, 100)
  - `second_last_name`: Apellido materno (string, 100, nullable)
  - `birth_date`: Fecha de nacimiento (date, nullable)
  - `phone`: Teléfono (string, 20, nullable)
  - `avatar_url`: URL del avatar (string, 255, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `users.id`
  - Índice en `user_id`

#### students
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `status`: Estado del estudiante (enum: 'active', 'inactive', 'graduated', 'withdrawn')
  - `entry_date`: Fecha de ingreso (date)
  - `graduation_date`: Fecha de graduación (date, nullable)
  - `current_level_id`: Nivel actual (FK a levels, nullable)
  - `current_range_id`: Rango actual (FK a ranges, nullable)
  - `experience_points`: Puntos de experiencia acumulados (decimal 10,2, default: 0)
  - `points_store`: Puntos en la tienda (decimal 10,2, default: 0)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `users.id`
  - Clave foránea a `levels.id`
  - Clave foránea a `ranges.id`
  - Índice en `status`

#### teachers
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `specialization`: Especialización (string, 255, nullable)
  - `bio`: Biografía (text, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `users.id`
  - Índice en `specialization`

#### password_reset_tokens
- **Propósito**: Almacena tokens para restablecimiento de contraseñas
- **Campos clave**:
  - `email`: Correo del usuario (string, 255, primary key)
  - `token`: Token de restablecimiento (string, 255)
  - `created_at`: Fecha de creación (timestamp, nullable)
- **Índices**:
  - Índice en `email`
  - Índice en `token`

#### personal_access_tokens
- **Propósito**: Almacena tokens de acceso para la API (Sanctum)
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `tokenable_type`: Clase del modelo (string, 255)
  - `tokenable_id`: ID del modelo relacionado (bigint)
  - `name`: Nombre del token (string, 255)
  - `token`: Token de acceso (string, 64, único)
  - `abilities`: Permisos del token (text, nullable, JSON)
  - `last_used_at`: Último uso (timestamp, nullable)
  - `expires_at`: Fecha de expiración (timestamp, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice compuesto en `tokenable_type` y `tokenable_id`
  - Índice único en `token`

### 2. Roles y Permisos (Spatie Laravel Permission)
**Archivos relacionados:**
- `[4] 2025_06_19_044210_create_permission_tables.php` - Tablas de roles y permisos

#### roles
- **Propósito**: Definición de roles del sistema
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del rol (string, 125, único)
  - `guard_name`: Nombre del guard (string, 125, default: 'web')
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice único en `name`
  - Índice en `guard_name`

#### permissions
- **Propósito**: Definición de permisos del sistema
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del permiso (string, 125, único)
  - `guard_name`: Nombre del guard (string, 125, default: 'web')
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice único en `name`
  - Índice en `guard_name`

#### model_has_roles
- **Propósito**: Relación muchos a muchos entre modelos y roles
- **Campos clave**:
  - `role_id`: FK a roles (bigint)
  - `model_type`: Tipo de modelo (string, 255)
  - `model_id`: ID del modelo (bigint)
- **Índices**:
  - Clave primaria compuesta: `role_id`, `model_id`, `model_type`
  - Índice en `model_type` y `model_id`

#### role_has_permissions
- **Propósito**: Relación muchos a muchos entre roles y permisos
- **Campos clave**:
  - `permission_id`: FK a permissions (bigint)
  - `role_id`: FK a roles (bigint)
- **Índices**:
  - Clave primaria compuesta: `permission_id`, `role_id`
  - Índice en `role_id`

#### model_has_permissions
- **Propósito**: Permisos directos a modelos
- **Campos clave**:
  - `permission_id`: FK a permissions (bigint)
  - `model_type`: Tipo de modelo (string, 255)
  - `model_id`: ID del modelo (bigint)
- **Índices**:
  - Clave primaria compuesta: `permission_id`, `model_id`, `model_type`
  - Índice en `model_type` y `model_id`
- **Estructura**:
  - `roles`: Define los roles del sistema
  - `permissions`: Define los permisos individuales
  - `model_has_roles`: Asigna roles a usuarios
  - `role_has_permissions`: Asigna permisos a roles

### 3. Estructura Académica
**Archivos relacionados:**
- `[5] 2025_06_22_100000_create_levels_table.php` - Niveles académicos
- `[6] 2025_06_22_100010_create_ranges_table.php` - Rangos de nivel
- `[10] 2025_06_22_100050_create_cycles_table.php` - Ciclos académicos
- `[11] 2025_06_22_100060_create_curricular_areas_table.php` - Áreas curriculares
- `[12] 2025_06_22_100065_create_curricular_area_cycles.php` - Relación áreas-curriculares-ciclos
- `[13] 2025_06_22_100070_create_competencies_table.php` - Competencias
- `[14] 2025_06_22_100080_create_capabilities_table.php` - Capacidades
- `[18] 2025_06_22_100120_create_classrooms_table.php` - Aulas
- `[19] 2025_06_22_100130_create_enrollments_table.php` - Matrículas
- `[20] 2025_06_22_100140_create_student_level_histories_table.php` - Historial de niveles
- `[21] 2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php` - Asignación docente

#### cycles
- **Propósito**: Ciclos académicos del sistema
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del ciclo (string)
  - `description`: Descripción (text, nullable)
  - `start_date`, `end_date`: Fechas del ciclo (date)
  - `is_current`: Indica si es el ciclo actual (boolean)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Relaciones**:
  - `levels`: Niveles que pertenecen a este ciclo
  - `curricularAreas`: Áreas curriculares ofrecidas en este ciclo

#### levels
- **Descripción**: Niveles educativos (ej: Primaria, Secundaria)
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del nivel (string)
  - `description`: Descripción (text, nullable)
  - `order`: Orden de visualización (integer)
  - `cycle_id`: FK a cycles (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `cycle`: Ciclo al que pertenece
  - `classrooms`: Aulas en este nivel
  - `studentLevelHistories`: Historial de estudiantes en este nivel
  - `students`: Estudiantes actuales en este nivel

#### cycles
- **Descripción**: Ciclos académicos (ej: Ciclo I, Ciclo II)
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del ciclo (string)
  - `description`: Descripción (text, nullable)
  - `start_date`, `end_date`: Fechas del ciclo (date)
  - `is_current`: Indica si es el ciclo actual (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo

#### classrooms
- **Descripción**: Aulas o grupos de estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `grade`: Grado (string, ej: "1°", "2°")
  - `section`: Sección (string, ej: "A", "B")
  - `level`: Nivel (enum: 'primary', 'secondary')
  - `academic_year`: Año académico (integer)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Relaciones**:
  - `level`: Nivel al que pertenece
  - `students`: Estudiantes matriculados
  - `teachers`: Profesores asignados
  - `curricularAreas`: Áreas que se imparten
  - `enrollments`: Matrículas en esta aula

### 4. Estudiantes y Profesores

#### enrollments
- **Descripción**: Matrículas de estudiantes en aulas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `classroom_id`: FK a classrooms (bigint)
  - `enrollment_date`: Fecha de matrícula (date)
  - `status`: Estado (enum: 'active', 'inactive', 'transferred', 'graduated')
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `student`: Estudiante matriculado
  - `classroom`: Aula de matrícula
  - `learningSessions`: Sesiones de aprendizaje
  - `applicationFormResponses`: Respuestas a formularios de este estudiante

### 5. Sesiones de Aprendizaje

#### learning_sessions
- **Propósito**: Sesiones de aprendizaje creadas por los docentes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental, comentado como 'Identificador único de la sesión de aprendizaje')
  - `name`: Nombre de la sesión (string, comentado como 'Nombre de la sesión de aprendizaje')
  - `purpose_learning`: Propósito del aprendizaje (text, comentado como 'Propósito de aprendizaje de la sesión')
  - `application_date`: Fecha de aplicación (date, comentado como 'Fecha de aplicación de la sesión')
  - `status`: Estado (enum: 'draft', 'active', 'inactive', default: 'draft', comentado como 'Estado de la sesión: borrador, activa, inactiva')
  - `performances`: Desempeños (text, comentado como 'Desempeños esperados en la sesión')
  - `start_sequence`: Secuencia de inicio (text, comentado como 'Secuencia de inicio de la sesión')
  - `end_sequence`: Secuencia de cierre (text, comentado como 'Secuencia de cierre de la sesión')
  - `teacher_classroom_curricular_area_cycle_id`: FK a teacher_classroom_curricular_area_cycles (on delete cascade, comentado como 'Referencia a la asignación de profesor-aula-área-ciclo')
  - `competency_id`: FK a competencies (on delete cascade, comentado como 'Referencia a la competencia asociada')
  - `educational_institution_id`: FK a educational_institutions (on delete cascade, comentado como 'Referencia a la institución educativa')
  - `created_at`, `updated_at`: Marcas de tiempo
  - `deleted_at`: Soft delete timestamp (timestamp)
- **Índices**:
  - Clave foránea a `teacher_classroom_curricular_areas.id`
  - Clave foránea a `competencies.id`
  - Índice en `status`
  - Índice en `application_date`
- **Relaciones**:
  - `teacherClassroomCurricularArea`: Asignación docente
  - `competency`: Competencia principal
  - `applicationForms`: Evaluaciones asociadas
  - `capabilities`: Capacidades trabajadas
- **Índices**:
  - `idx_learning_sessions_status` (status)
  - `idx_learning_sessions_application_date` (application_date)
  - `idx_learning_sessions_institution` (educational_institution_id)
  - `idx_learning_sessions_competency` (competency_id)
  - Clave foránea a `teacher_classroom_curricular_area_cycles` (índice implícito)

#### learning_session_capabilities
- **Propósito**: Relación muchos a muchos entre sesiones de aprendizaje y capacidades
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `learning_session_id`: FK a learning_sessions
  - `capability_id`: FK a capabilities
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `learning_sessions.id`
  - Clave foránea a `capabilities.id`
  - Índice único compuesto: `learning_session_id`, `capability_id`
- **Relaciones**:
  - `learningSession`: Sesión de aprendizaje
  - `capability`: Capacidad cubierta

### 6. Formularios de Aplicación

#### application_forms
- **Descripción**: Formularios de aplicación para evaluaciones
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del formulario (string)
  - `description`: Descripción (text, nullable)
  - `teacher_id`: FK a teachers (bigint, cascade on delete)
  - `learning_session_id`: FK a learning_sessions (bigint, restrict on delete)
  - `status`: Estado del formulario (enum: draft, scheduled, active, inactive, archived)
  - `score_max`: Puntuación máxima (decimal 10,2)
  - `start_date`, `end_date`: Rango de fechas de disponibilidad (datetime)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Índices**:
  - `idx_application_form_status` (status)
  - `idx_application_form_start_date` (start_date)
  - `idx_application_form_end_date` (end_date)
  - `idx_application_form_learning_session` (learning_session_id)
  - `idx_application_form_scheduling` (status, start_date, end_date) - Índice compuesto
  - Índice en `deleted_at`
- **Relaciones**:
  - `teacher`: Profesor creador (BelongsTo, cascade on delete)
  - `learningSession`: Sesión de aprendizaje asociada (BelongsTo, restrict on delete)
  - `applicationFormQuestions`: Preguntas del formulario (HasMany, cascade on delete)
  - `responses`: Respuestas de estudiantes (HasMany, restrict on delete)

#### application_form_questions
- **Descripción**: Relación entre formularios y preguntas con configuración específica
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `application_form_id`: FK a application_forms (cascade on delete)
  - `question_id`: FK a questions (restrict on delete)
  - `order`: Orden de la pregunta (unsigned integer)
  - `score`: Puntuación de la pregunta (decimal 10,2)
  - `points_store`: Puntos otorgados en la tienda (decimal 10,2)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
  - `application_form_id`: FK a application_forms (cascade on delete)
  - `question_id`: FK a questions (restrict on delete)
- **Índices**:
  - `idx_application_form_question_application_form` (application_form_id)
  - `idx_application_form_question_question` (question_id)
  - `idx_application_form_question_order` (`order`)
  - `uq_application_form_question` (application_form_id, question_id) - Restricción única
- **Relaciones**:
  - `applicationForm`: Formulario al que pertenece
  - `question`: Pregunta asociada
  - `responseQuestions`: Respuestas a esta pregunta

#### application_form_responses
- **Descripción**: Respuestas de estudiantes a formularios de evaluación
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `application_form_id`: FK a application_forms (restrict on delete)
  - `student_id`: FK a students.user_id (restrict on delete)
  - `score`: Puntuación obtenida (decimal 10,2, nullable)
  - `status`: Estado (enum: 'pending', 'in_progress', 'submitted', 'in_review', 'graded', 'returned', 'late')
  - `started_at`, `submitted_at`, `graded_at`: Marcas de tiempo (timestamp, nullable)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - `idx_application_form_responses_form` (application_form_id)
  - `idx_application_form_responses_student` (student_id)
  - `idx_application_form_response_status` (status)
  - `idx_application_form_response_score` (score)
  - `idx_application_form_response_submitted` (submitted_at)
  - `idx_application_form_response_graded` (graded_at)
  - `idx_application_form_response_created` (created_at)
  - `uq_application_form_response` (application_form_id, student_id) - Restricción única
- **Relaciones**:
  - `applicationForm`: Formulario respondido (BelongsTo)
  - `student`: Estudiante que respondió (BelongsTo)
  - `responseQuestions`: Respuestas a preguntas individuales (HasMany)
  - `questionResponses`: Relación directa con las respuestas a preguntas (HasMany a través de application_form_response_question)

### 7. Sistema de Evaluación
**Archivos relacionados:**
- `[15] 2025_06_22_100090_create_question_types_table.php` - Tipos de preguntas
- `[16] 2025_06_22_100100_create_questions_table.php` - Preguntas
- `[17] 2025_06_22_100110_create_question_options_table.php` - Opciones de preguntas
- `[25] 2025_06_22_100300_create_learning_sessions_table.php` - Sesiones de aprendizaje
- `[26] 2025_06_22_100310_create_learning_session_capabilities_table.php` - Capacidades por sesión
- `[27] 2025_06_22_100330_create_application_forms_table.php` - Formularios de aplicación
- `[28] 2025_06_22_100340_create_application_form_responses_table.php` - Respuestas a formularios
- `[29] 2025_06_22_100350_create_application_form_questions_table.php` - Preguntas de formularios
- `[30] 2025_06_22_100360_create_application_form_response_question_table.php` - Respuestas a preguntas
- `[31] 2025_06_22_100370_create_application_form_response_question_options_table.php` - Opciones de respuestas

### 8. Preguntas y Opciones

#### questions
- **Propósito**: Banco de preguntas para evaluaciones
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la pregunta (string, 255)
  - `description`: Enunciado de la pregunta (text)
  - `difficulty`: Nivel de dificultad (enum: 'easy', 'medium', 'hard')
  - `explanation_required`: Si requiere explicación (boolean, default: false)
  - `question_type_id`: FK a question_types
  - `capability_id`: FK a capabilities
  - `teacher_id`: FK a teachers (user_id)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `question_types.id`
  - Clave foránea a `capabilities.id`
  - Clave foránea a `teachers.user_id`
  - Índice en `difficulty`
  - Índice en `deleted_at`
- **Relaciones**:
  - `questionType`: Tipo de pregunta
  - `capability`: Capacidad evaluada
  - `teacher`: Profesor que creó la pregunta
  - `options`: Opciones de respuesta
  - `applicationFormQuestions`: Relación con formularios

#### application_form_response_question
- **Descripción**: Respuestas individuales a preguntas dentro de un formulario respondido
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `application_form_response_id`: FK a application_form_responses (cascade on delete)
  - `application_form_question_id`: FK a application_form_questions (cascade on delete)
  - `question_option_id`: FK a question_options (null on delete)
  - `explanation`: Explicación del estudiante (text, nullable)
  - `score`: Puntuación obtenida (decimal 10,2, nullable)
  - `points_store`: Puntos obtenidos (decimal 10,2, nullable)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - `idx_afrq_response` (application_form_response_id)
  - `idx_afrq_question` (application_form_question_id)
  - `idx_afrq_option` (question_option_id)
  - `uq_application_form_response_question` (application_form_response_id, application_form_question_id) - Restricción única
- **Relaciones**:
  - `response`: Respuesta principal (BelongsTo)
  - `applicationFormQuestion`: Pregunta del formulario (BelongsTo)
  - `questionOption`: Opción seleccionada (BelongsTo, nullable)

#### question_options
- **Propósito**: Opciones de respuesta para preguntas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `question_id`: FK a questions
  - `value`: Texto de la opción (text)
  - `is_correct`: Si es la respuesta correcta (boolean, default: false)
  - `order`: Orden de visualización (integer)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `questions.id`
  - Índice en `order`
  - Índice en `is_correct`
- **Relaciones**:
  - `question`: Pregunta a la que pertenece
  - `responseQuestions`: Respuestas que seleccionaron esta opción

### 9. Sistema de Recompensas y Tienda
**Archivos relacionados:**
- `[32] 2025_06_22_100400_create_store_rewards_table.php` - Recompensas de tienda
- `[33] 2025_06_22_100410_create_student_store_rewards_table.php` - Recompensas de estudiantes
- `[34] 2025_06_22_100420_create_avatars_table.php` - Avatares
- `[35] 2025_06_22_100430_create_student_avatars_table.php` - Avatares de estudiantes
- `[36] 2025_06_22_100440_create_backgrounds_table.php` - Fondos
- `[37] 2025_06_22_100450_create_student_backgrounds_table.php` - Fondos de estudiantes

#### store_rewards
- **Propósito**: Recompensas disponibles en la tienda
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la recompensa (string, 255)
  - `description`: Descripción (text, nullable)
  - `type`: Tipo de recompensa (enum: 'avatar', 'background', 'badge', 'other')
  - `image_url`: URL de la imagen (string, 255, nullable)
  - `points_required`: Puntos necesarios (decimal 10,2)
  - `level_required`: Nivel mínimo requerido (integer, nullable)
  - `is_active`: Si está disponible (boolean, default: true)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice en `type`
  - Índice en `points_required`
  - Índice en `level_required`
  - Índice en `is_active`
- **Relaciones**:
  - `studentRewards`: Relación con recompensas canjeadas por estudiantes

#### student_store_rewards
- **Propósito**: Recompensas canjeadas por estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (user_id)
  - `store_reward_id`: FK a store_rewards
  - `purchase_date`: Fecha de canje (timestamp)
  - `points_spent`: Puntos gastados (decimal 10,2)
  - `is_active`: Si está activa (boolean, default: true)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `students.user_id`
  - Clave foránea a `store_rewards.id`
  - Índice en `purchase_date`
  - Índice en `is_active`
- **Relaciones**:
  - `student`: Estudiante que canjeó
  - `storeReward`: Recompensa canjeada

### 7. Sistema de Avatares y Fondos

#### avatars
- **Propósito**: Avatares personalizables
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del avatar (string, 100)
  - `image_url`: URL de la imagen (string, 255)
  - `level_required`: Nivel mínimo requerido (integer, default: 1)
  - `points_required`: Puntos requeridos (decimal 10,2, default: 0)
  - `is_active`: Si está disponible (boolean, default: true)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice en `level_required`
  - Índice en `points_required`
  - Índice en `is_active`
- **Relaciones**:
  - `studentAvatars`: Relación con avatares adquiridos por estudiantes

#### student_avatars
- **Propósito**: Avatares adquiridos por estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (user_id)
  - `avatar_id`: FK a avatars
  - `is_active`: Si está en uso (boolean, default: false)
  - `purchase_date`: Fecha de adquisición (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `students.user_id`
  - Clave foránea a `avatars.id`
  - Índice en `is_active`
- **Relaciones**:
  - `student`: Estudiante dueño
  - `avatar`: Avatar adquirido

#### backgrounds
- **Propósito**: Fondos de pantalla personalizables
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del fondo (string, 100)
  - `image_url`: URL de la imagen (string, 255)
  - `level_required`: Nivel mínimo requerido (integer, default: 1)
  - `points_required`: Puntos requeridos (decimal 10,2, default: 0)
  - `screen`: Pantalla de aplicación (string, 50, nullable)
  - `is_active`: Si está disponible (boolean, default: true)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Índice en `level_required`
  - Índice en `points_required`
  - Índice en `screen`
  - Índice en `is_active`
- **Relaciones**:
  - `studentBackgrounds`: Relación con fondos adquiridos por estudiantes

#### student_backgrounds
- **Propósito**: Fondos adquiridos por estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (user_id)
  - `background_id`: FK a backgrounds
  - `screen`: Pantalla de aplicación (string, 50, nullable)
  - `is_active`: Si está en uso (boolean, default: false)
  - `purchase_date`: Fecha de adquisición (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo (timestamp)
- **Índices**:
  - Clave foránea a `students.user_id`
  - Clave foránea a `backgrounds.id`
  - Índice en `screen`
  - Índice en `is_active`
- **Relaciones**:
  - `student`: Estudiante dueño
  - `background`: Fondo adquirido

#### students
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `level_id`: FK a levels (bigint)
  - `range_id`: FK a ranges (bigint)
  - `entry_date`: Fecha de ingreso (date)
  - `status`: Estado (enum: 'active', 'inactive', 'graduated', 'dropped_out', 'on_hold', 'transferred')
  - `experience_achieved`: Experiencia acumulada (decimal 10,2)
  - `points_achieved`: Puntos de tienda (decimal 10,2)
  - `total_score`: Puntuación total (decimal 10,2)
  - `graduation_date`: Fecha de graduación (date, nullable)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Relaciones**:
  - `user`: Datos de autenticación
  - `level`: Nivel actual
  - `range`: Rango actual
  - `enrollments`: Matrículas actuales e históricas
  - `classrooms`: Aulas actuales
  - `achievements`: Logros obtenidos
  - `storeRewards`: Recompensas canjeadas
  - `avatars`: Avatares desbloqueados
  - `backgrounds`: Fondos desbloqueados

#### teachers
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `status`: Estado (enum: 'active', 'inactive', 'on_leave', 'retired')
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Relaciones**:
  - `user`: Datos de autenticación
  - `classrooms`: Aulas asignadas
  - `curricularAreas`: Áreas de especialización
  - `applicationForms`: Evaluaciones creadas
  - `questions`: Preguntas creadas
  - `learningSessions`: Sesiones de aprendizaje

### 3. Plan de Estudios y Contenidos

#### teacher_classroom_curricular_area_cycles
- **Descripción**: Asignación de profesores a aulas y áreas curriculares
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `teacher_id`: FK a teachers (bigint)
  - `classroom_id`: FK a classrooms (bigint)
  - `curricular_area_id`: FK a curricular_areas (bigint)
  - `academic_year`: Año académico (integer)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `teacher`: Profesor asignado
  - `classroom`: Aula asignada
  - `curricularArea`: Área curricular asignada
  - `learningSessions`: Sesiones de aprendizaje
  - `applicationForms`: Evaluaciones relacionadas

#### curricular_areas
- **Descripción**: Áreas curriculares o asignaturas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del área (string)
  - `description`: Descripción (text, nullable)
  - `color`: Código de color (string, formato HEX)
  - `cycle_id`: FK a cycles (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `cycle`: Ciclo al que pertenece
  - `competencies`: Competencias del área
  - `classrooms`: Aulas donde se imparte
  - `teachers`: Profesores que la enseñan
  - `questions`: Preguntas relacionadas

#### competencies
- **Descripción**: Competencias generales por área curricular
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la competencia (string)
  - `description`: Descripción (text, nullable)
  - `order`: Orden de presentación (integer)
  - `curricular_area_id`: FK a curricular_areas (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `curricularArea`: Área a la que pertenece
  - `capabilities`: Capacidades específicas
  - `learningSessions`: Sesiones que desarrollan esta competencia
  - `applicationForms`: Evaluaciones que la miden

#### capabilities
- **Descripción**: Capacidades específicas dentro de cada competencia
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la capacidad (string)
  - `description`: Descripción (text, nullable)
  - `competency_id`: FK a competencies (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `competency`: Competencia a la que pertenece
  - `questions`: Preguntas que evalúan esta capacidad
  - `learningSessions`: Sesiones que la desarrollan
  - `performances`: Desempeños asociados

### 4. Sistema de Evaluación y Aprendizaje

#### learning_sessions
- **Descripción**: Sesiones de aprendizaje que agrupan actividades relacionadas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la sesión (string)
  - `purpose_learning`: Propósito de aprendizaje (text)
  - `application_date`: Fecha de aplicación (date)
  - `educational_institution_id`: FK a educational_institutions (bigint)
  - `teacher_classroom_curricular_area_id`: FK a teacher_classroom_curricular_areas (bigint)
  - `competency_id`: FK a competencies (bigint)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Relaciones**:
  - `educationalInstitution`: Institución educativa
  - `teacherClassroomCurricularArea`: Asignación docente
  - `competency`: Competencia principal
  - `applicationForms`: Evaluaciones asociadas
  - `capabilities`: Capacidades trabajadas
- **Índices**:
  - `idx_learning_session_application_date` (application_date)
  - `idx_learning_session_institution` (educational_institution_id)
  - `idx_learning_session_tcca` (teacher_classroom_curricular_area_id)
  - `idx_learning_session_competency` (competency_id)

#### questions
- **Descripción**: Preguntas para evaluaciones
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre/título (string)
  - `description`: Enunciado (text)
  - `image`: Ruta a imagen (string, nullable)
  - `help_message`: Mensaje de ayuda (text, nullable)
  - `difficulty`: Dificultad (enum: 'easy', 'medium', 'hard')
  - `explanation_required`: Si requiere explicación (boolean)
  - `correct_feedback`: Retroalimentación para respuesta correcta (text, nullable)
  - `incorrect_feedback`: Retroalimentación para respuesta incorrecta (text, nullable)
  - `question_type_id`: FK a question_types (bigint)
  - `capability_id`: FK a capabilities (bigint)
  - `teacher_id`: FK a users (bigint)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

#### question_types
- **Descripción**: Tipos de preguntas disponibles
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del tipo (string, ej: 'multiple_choice', 'true_false')
  - `description`: Descripción (text, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo

#### question_options
- **Descripción**: Opciones para preguntas de selección
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `question_id`: FK a questions (bigint)
  - `value`: Texto de la opción (text)
  - `is_correct`: Si es la respuesta correcta (boolean)
  - `order`: Orden de visualización (integer)
  - `score`: Puntuación de la opción (decimal 5,2)
  - `feedback`: Retroalimentación específica (text, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo

### 5. Sistema de Gamificación

#### ranges
- **Descripción**: Rangos o niveles de logro
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del rango (string)
  - `description`: Descripción (text, nullable)
  - `min_points`: Puntos mínimos requeridos (integer)
  - `max_points`: Puntos máximos (integer)
  - `badge_image`: Ruta a la imagen de la insignia (string, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `students`: Estudiantes en este rango
  - `studentLevelHistories`: Historial de estudiantes que alcanzaron este rango

#### achievements
- **Descripción**: Logros o insignias que los estudiantes pueden obtener
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del logro (string)
  - `description`: Descripción (text, nullable)
  - `image`: Ruta a la imagen del logro (string, nullable)
  - `points`: Puntos otorgados (integer)
  - `criteria`: Criterios para desbloquear (text, JSON)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `students`: Estudiantes que obtuvieron este logro

#### store_rewards
- **Descripción**: Recompensas disponibles en la tienda
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la recompensa (string)
  - `description`: Descripción (text, nullable)
  - `image`: Ruta a la imagen (string, nullable)
  - `points_required`: Puntos necesarios (integer)
  - `quantity_available`: Cantidad disponible (integer, nullable)
  - `is_active`: Si está disponible (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `students`: Estudiantes que canjearon esta recompensa

#### student_achievements
- **Descripción**: Relación muchos a muchos entre estudiantes y logros
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `achievement_id`: FK a achievements (bigint)
  - `achieved_at`: Fecha de obtención (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Índices**:
  - `idx_student_achievement` (student_id, achievement_id) único

#### student_store_rewards
- **Descripción**: Historial de recompensas canjeadas por estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `store_reward_id`: FK a store_rewards (bigint)
  - `points_used`: Puntos utilizados (integer)
  - `exchange_date`: Fecha de canje (timestamp)
  - `status`: Estado (enum: 'pending', 'completed', 'cancelled')
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `student`: Estudiante que canjeó
  - `storeReward`: Recompensa canjeada

#### student_level_histories
- **Descripción**: Historial de progreso de niveles de estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `level_id`: FK a levels (bigint)
  - `range_id`: FK a ranges (bigint)
  - `experience_achieved`: Experiencia acumulada (decimal 10,2)
  - `points_achieved`: Puntos acumulados (decimal 10,2)
  - `achieved_at`: Fecha de logro (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo
- **Relaciones**:
  - `student`: Estudiante
  - `level`: Nivel alcanzado
  - `range`: Rango alcanzado

### 6. Personalización

#### avatars
- **Descripción**: Avatares disponibles para personalización
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del avatar (string)
  - `image_path`: Ruta a la imagen (string)
  - `unlock_condition`: Condición para desbloquear (string, nullable)
  - `is_premium`: Si es premium (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo

#### student_avatars
- **Descripción**: Relación entre estudiantes y avatares
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `avatar_id`: FK a avatars (bigint)
  - `is_active`: Si está actualmente en uso (boolean)
  - `unlocked_at`: Fecha de desbloqueo (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo

#### backgrounds
- **Descripción**: Fondos de perfil disponibles
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del fondo (string)
  - `image_path`: Ruta a la imagen (string)
  - `unlock_condition`: Condición para desbloquear (string, nullable)
  - `is_premium`: Si es premium (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo

#### student_backgrounds
- **Descripción**: Relación entre estudiantes y fondos
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `student_id`: FK a students (bigint)
  - `background_id`: FK a backgrounds (bigint)
  - `is_active`: Si está actualmente en uso (boolean)
  - `unlocked_at`: Fecha de desbloqueo (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo

### 8. Formularios y Respuestas

#### application_forms
- **Descripción**: Formularios de evaluación asociados a sesiones de aprendizaje
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del formulario (string)
  - `description`: Descripción (text, nullable)
  - `status`: Estado (enum: 'draft', 'scheduled', 'active', 'inactive', 'archived')
  - `score_max`: Puntuación máxima (decimal 10,2)
  - `start_date`, `end_date`: Fechas de disponibilidad (datetime)
  - `teacher_classroom_curricular_area_id`: FK a teacher_classroom_curricular_areas (bigint)
  - `learning_session_id`: FK a learning_sessions (bigint)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Índices**:
  - `idx_application_form_status` (status)
  - `idx_application_form_start_date` (start_date)
  - `idx_application_form_end_date` (end_date)
  - `idx_application_form_tcca` (teacher_classroom_curricular_area_id)
  - `idx_application_form_learning_session` (learning_session_id)
  - `idx_application_form_scheduling` (status, start_date, end_date)
- **Cambios recientes**:
  - Se eliminó la columna `teacher_id` (ahora se obtiene a través de teacher_classroom_curricular_area)
  - Se renombró `title` a `name` para mayor consistencia
  - Se optimizaron los índices para mejorar el rendimiento

#### application_form_questions
- **Propósito**: Relación entre formularios y preguntas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `application_form_id`: FK a application_forms (bigint)
  - `question_id`: FK a questions (bigint)
  - `order`: Orden en el formulario (integer)
  - `points`: Puntuación de la pregunta (decimal 5,2)
  - `created_at`, `updated_at`: Marcas de tiempo

#### application_form_responses
- **Descripción**: Respuestas de los estudiantes a los formularios
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `application_form_id`: FK a application_forms (bigint)
  - `student_id`: FK a users (bigint)
  - `score`: Puntuación obtenida (decimal 10,2, nullable)
  - `status`: Estado (enum: 'pending', 'in_progress', 'submitted', 'in_review', 'graded', 'returned', 'late')
  - `started_at`, `completed_at`: Marcas de tiempo
  - `feedback`: Retroalimentación general (text, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo

### 5.1 Sistema de Logros y Recompensas (subsección de Gamificación)

#### achievements
- **Descripción**: Logros que pueden obtener los estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del logro (string)
  - `description`: Descripción (text, nullable)
  - `points`: Puntos que otorga (integer)
  - `image`: Ruta a la imagen (string, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo

#### student_achievements
- **Propósito**: Relación muchos a muchos entre estudiantes y logros
- **Campos clave**:
  - `student_id`: FK a students (bigint)
  - `achievement_id`: FK a achievements (bigint)
  - `achieved_at`: Fecha de obtención (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo
  - Clave primaria compuesta: (student_id, achievement_id)

#### store_rewards
- **Descripción**: Recompensas disponibles en la tienda
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la recompensa (string)
  - `description`: Descripción (text, nullable)
  - `price`: Precio en puntos (integer)
  - `stock`: Cantidad disponible (integer)
  - `image`: Ruta a la imagen (string, nullable)
  - `is_active`: Si está disponible (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo

### 6.1 Personalización de Perfil (subsección de Personalización)

#### avatars
- **Descripción**: Avatares disponibles para los estudiantes
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del avatar (string)
  - `image_path`: Ruta a la imagen (string)
  - `unlock_points`: Puntos necesarios para desbloquear (integer)
  - `is_premium`: Si es premium (boolean)
  - `created_at`, `updated_at`: Marcas de tiempo

#### student_avatars
- **Propósito**: Relación muchos a muchos entre estudiantes y avatares
- **Campos clave**:
  - `student_id`: FK a students (bigint)
  - `avatar_id`: FK a avatars (bigint)
  - `is_active`: Si está en uso (boolean)
  - `purchased_at`: Fecha de adquisición (timestamp)
  - `created_at`, `updated_at`: Marcas de tiempo
  - Clave primaria compuesta: (student_id, avatar_id)

## Relaciones Clave

### Relaciones de Usuario
- Un `User` tiene un `Profile` (1:1)
- Un `User` puede ser `Student` o `Teacher` (1:1 a través de user_id)
- Un `User` puede tener múltiples roles (muchos a muchos a través de `model_has_roles`)

### Relaciones Académicas
- Un `Level` pertenece a un `Cycle` (muchos a uno)
- Un `Classroom` tiene muchos `Student` a través de `enrollments` (muchos a muchos)
- Un `Teacher` puede estar en múltiples `Classroom` a través de `teacher_classroom_curricular_areas`

### Relaciones de Evaluación
- Un `Question` pertenece a un `QuestionType` y una `Capability`
- Un `ApplicationForm` tiene muchas `Question` a través de `application_form_questions`
- Un `Student` puede tener múltiples `ApplicationFormResponse`

## Convenciones de Nombrado
- Nombres de tablas en inglés y en plural (ej: `users`, `classrooms`)
- Claves foráneas en formato `singular_table_name_id` (ej: `user_id`, `classroom_id`)
- Nombres de relaciones en camelCase en los modelos
- Tablas pivot nombradas en orden alfabético (ej: `question_question_tag`)

## Índices y Optimización
- Índices en claves foráneas
- Índices compuestos para consultas frecuentes
- Índices para búsquedas por texto
- Uso de `deleted_at` para soft deletes

## Migraciones
Todas las tablas tienen migraciones correspondientes en `database/migrations/` con el formato `YYYY_MM_DD_HHMMSS_create_table_name_table.php`.

## Semillas
Los datos iniciales se cargan mediante seeders en `database/seeders/` para:
- Roles y permisos básicos
- Tipos de preguntas
- Niveles y ciclos académicos
- Usuarios de prueba (admin, profesores, estudiantes)
