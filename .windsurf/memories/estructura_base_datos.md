# Estructura de la Base de Datos

## Visión General
La base de datos está diseñada siguiendo las convenciones de Laravel Eloquent ORM y utiliza migraciones para el control de versiones. El esquema está organizado en módulos lógicos que representan las diferentes áreas funcionales del sistema.

## Módulos Principales

### 1. Autenticación y Usuarios

#### users
- **Descripción**: Tabla principal de usuarios del sistema
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del usuario (string)
  - `email`: Correo electrónico (string, único)
  - `email_verified_at`: Fecha de verificación de correo (timestamp, nullable)
  - `password`: Contraseña hasheada (string)
  - `remember_token`: Token para "recordar sesión" (string, nullable)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo
- **Índices**: 
  - Índice único en `email`
  - Índice en `deleted_at` para soft deletes

#### password_reset_tokens
- **Propósito**: Almacena tokens para restablecimiento de contraseñas
- **Campos clave**:
  - `email`: Correo del usuario (string, primary key)
  - `token`: Token de restablecimiento (string)
  - `created_at`: Fecha de creación (timestamp, nullable)

### 2. Perfiles y Roles

#### profiles
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `first_name`: Nombre (string)
  - `last_name`: Apellido paterno (string)
  - `second_last_name`: Apellido materno (string, nullable)
  - `birth_date`: Fecha de nacimiento (date, nullable)
  - `phone`: Teléfono (string, nullable)
  - `avatar_url`: URL del avatar (string, nullable)
  - `created_at`, `updated_at`: Marcas de tiempo

#### model_has_roles, roles, role_has_permissions, permissions
- **Propósito**: Sistema de roles y permisos (Spatie Laravel Permission)
- **Estructura**:
  - `roles`: Define los roles del sistema
  - `permissions`: Define los permisos individuales
  - `model_has_roles`: Asigna roles a usuarios
  - `role_has_permissions`: Asigna permisos a roles

### 3. Estructura Académica

#### levels
- **Descripción**: Niveles educativos (ej: Primaria, Secundaria)
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del nivel (string)
  - `description`: Descripción (text, nullable)
  - `order`: Orden de visualización (integer)
  - `cycle_id`: FK a cycles (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo

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

### 4. Estudiantes y Profesores

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

#### teachers
- **Relación**: 1:1 con users
- **Campos clave**:
  - `user_id`: FK a users (bigint, primary key)
  - `status`: Estado (enum: 'active', 'inactive', 'on_leave', 'retired')
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

### 5. Plan de Estudios

#### curricular_areas
- **Descripción**: Áreas curriculares o asignaturas
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre del área (string)
  - `description`: Descripción (text, nullable)
  - `color`: Código de color (string, formato HEX)
  - `cycle_id`: FK a cycles (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo

#### competencies
- **Descripción**: Competencias generales por área curricular
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la competencia (string)
  - `description`: Descripción (text, nullable)
  - `curricular_area_id`: FK a curricular_areas (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo

#### capabilities
- **Descripción**: Capacidades específicas dentro de cada competencia
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Nombre de la capacidad (string)
  - `description`: Descripción (text, nullable)
  - `competency_id`: FK a competencies (bigint)
  - `created_at`, `updated_at`: Marcas de tiempo

### 6. Sistema de Evaluación

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

### 7. Formularios y Respuestas

#### application_forms
- **Descripción**: Formularios de evaluación
- **Campos clave**:
  - `id`: Identificador único (bigint, autoincremental)
  - `name`: Título del formulario (string)
  - `description`: Descripción (text, nullable)
  - `status`: Estado (enum: 'draft', 'scheduled', 'active', 'inactive', 'archived')
  - `score_max`: Puntuación máxima (decimal 10,2)
  - `start_date`, `end_date`: Fechas de disponibilidad (datetime)
  - `teacher_classroom_curricular_area_id`: FK a teacher_classroom_curricular_areas (bigint)
  - `teacher_id`: FK a users (bigint)
  - `learning_session_id`: FK a learning_sessions (bigint)
  - `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

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

### 8. Sistema de Logros y Recompensas

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

### 9. Personalización de Perfil

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
