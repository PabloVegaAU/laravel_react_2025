# Modelo Teacher

## Ubicación del archivo
- `app/Models/Teacher.php`

## Migración relacionada
- `database/migrations/2025_06_22_100040_create_teachers_table.php`

## Descripción
El modelo Teacher representa a un profesor en el sistema, extendiendo la funcionalidad del modelo User con información específica de docencia.

## Estructura de la base de datos
### Tabla: `teachers`
- **Clave primaria**: `user_id` (clave foránea a la tabla `users`)
- **Soft deletes**: Sí
- **Índices**:
  - `idx_teacher_status` (status)

### Estructura de columnas
| Columna | Tipo | Nulo | Default | Comentario |
|---------|------|------|---------|------------|
| user_id | bigint | No | - | FK a users (PK) |
| status | enum | No | 'active' | Estado del profesor |
| created_at | timestamp | No | - | Fecha de creación |
| updated_at | timestamp | No | - | Fecha de actualización |
| deleted_at | timestamp | Sí | null | Fecha de eliminación |

### Valores de status
- `active`: Activo
- `inactive`: Inactivo temporalmente
- `on leave`: De permiso/licencia
- `retired`: Jubilado

### Restricciones de clave foránea
- `user_id` referencia a `users(id)` con `ON DELETE CASCADE`

## Atributos
- `user_id`: Identificador del usuario (clave foránea a users.id)
- `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

## Relaciones
- `user`: Relación BelongsTo con el modelo User
- `classrooms`: Relación BelongsToMany con el modelo Classroom
- `curricularAreas`: Relación BelongsToMany con el modelo CurricularArea a través de teacher_classroom_curricular_areas
- `teacherAssignments`: Relación HasMany con el modelo TeacherClassroomCurricularArea
- `applicationForms`: Relación HasMany con el modelo ApplicationForm

## Métodos importantes
- `isActive()`: Verifica si el profesor está activo
- `canTeachSubject()`: Verifica si el profesor puede enseñar una materia específica

## Notas adicionales
- Utiliza SoftDeletes para eliminación lógica
- Relación polimórfica con el modelo User a través del campo user_id
