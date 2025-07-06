# Modelo Student

## Ubicación del archivo
- `app/Models/Student.php`

## Migración relacionada
- `database/migrations/2025_06_22_100030_create_students_table.php`

## Descripción
El modelo Student representa a un estudiante en el sistema, extendiendo la funcionalidad del modelo User con información académica específica.

## Estructura de la base de datos
### Tabla: `students`
- **Clave primaria**: `user_id` (clave foránea a la tabla `users`)
- **Soft deletes**: Sí
- **Índices**:
  - `idx_student_level_range` (level_id, range_id)
  - `idx_student_experience` (experience_achieved)
  - `idx_student_status` (status)
  - `idx_student_entry_date` (entry_date)
  - `idx_student_points` (points_achieved)

### Estructura de columnas
| Columna | Tipo | Nulo | Default | Comentario |
|---------|------|------|---------|------------|
| user_id | bigint | No | - | FK a users (PK) |
| entry_date | date | No | - | Fecha de ingreso |
| status | enum | No | 'active' | Estado del estudiante |
| experience_achieved | decimal(10,2) | No | 0 | Experiencia total |
| points_achieved | decimal(10,2) | No | 0 | Puntos de tienda |
| total_score | decimal(10,2) | No | 0 | Puntuación total |
| level_id | bigint | No | - | FK a levels |
| range_id | bigint | No | - | FK a ranges |
| graduation_date | date | Sí | null | Fecha de graduación |
| created_at | timestamp | No | - | Fecha de creación |
| updated_at | timestamp | No | - | Fecha de actualización |
| deleted_at | timestamp | Sí | null | Fecha de eliminación |

### Restricciones de clave foránea
- `user_id` referencia a `users(id)` con `ON DELETE CASCADE`
- `level_id` referencia a `levels(id)` con `ON DELETE RESTRICT`
- `range_id` referencia a `ranges(id)` con `ON DELETE RESTRICT`

## Atributos
- `user_id`: Identificador del usuario (clave foránea a users.id)
- `level_id`: Nivel actual del estudiante
- `range_id`: Rango actual del estudiante
- `entry_date`: Fecha de ingreso a la institución
- `status`: Estado del estudiante (active, inactive, graduated, dropped_out, on_hold, transferred)
- `experience_achieved`: Experiencia acumulada (decimal 10,2)
- `points_achieved`: Puntos acumulados (decimal 10,2)
- `total_score`: Puntuación total (decimal 10,2)
- `graduation_date`: Fecha de graduación (opcional)
- `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

## Relaciones
- `user`: Relación BelongsTo con el modelo User
- `level`: Relación BelongsTo con el modelo Level
- `range`: Relación BelongsTo con el modelo Range
- `enrollments`: Relación HasMany con el modelo Enrollment
- `classrooms`: Relación BelongsToMany con el modelo Classroom a través de enrollments
- `avatars`: Relación BelongsToMany con el modelo Avatar
- `backgrounds`: Relación BelongsToMany con el modelo Background
- `achievements`: Relación BelongsToMany con el modelo Achievement
- `storeRewards`: Relación BelongsToMany con el modelo StoreReward
- `levelHistories`: Relación HasMany con el modelo StudentLevelHistory

## Métodos importantes
- `activeAvatar()`: Obtiene el avatar activo del estudiante
- `activeBackground()`: Obtiene el fondo activo del estudiante
