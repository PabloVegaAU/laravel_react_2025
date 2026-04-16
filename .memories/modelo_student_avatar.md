# Modelo: StudentAvatar

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/StudentAvatar.php`
**Migración:** `database/migrations/2025_06_22_100430_create_student_avatars_table.php`
**TypeScript:** `resources/js/types/user/student/avatar/index.d.ts`

## Descripción

El modelo `StudentAvatar` representa la relación entre un estudiante y un avatar que ha adquirido. Registra qué avatares posee cada estudiante, cuál está activo, los puntos gastados y la fecha de adquisición. Los estudiantes pueden tener múltiples avatares pero solo uno activo a la vez.

## Estructura de Base de Datos

### Tabla: `student_avatars`

| Campo           | Tipo                    | Descripción                                                                   |
| --------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `id`            | `bigint` (PK)           | Identificador único del avatar del estudiante                                 |
| `active`        | `boolean` default false | Indica si el avatar está actualmente en uso                                   |
| `points_store`  | `decimal(10,2)`         | Puntos de la tienda utilizados para adquirir el avatar                        |
| `exchange_date` | `timestamp` (nullable)  | Fecha y hora en que se canjeó el avatar                                       |
| `student_id`    | `foreignId` (FK)        | Referencia al estudiante dueño del avatar (students.user_id, cascadeOnDelete) |
| `avatar_id`     | `foreignId` (FK)        | Referencia al avatar adquirido (avatars.id, cascadeOnDelete)                  |

### Índices

- `idx_student_avatars_student`: Índice en `student_id`
- `idx_student_avatars_avatar`: Índice en `avatar_id`
- `idx_student_avatars_active`: Índice en `active`
- `idx_student_avatars_student_active`: Índice compuesto en `student_id` y `active`

### Restricciones

- Unique constraint: `['student_id', 'avatar_id']` - evita duplicados de avatar por estudiante

### Relaciones

- Foreign key `student_id`: referencia a `students.user_id` con `cascadeOnDelete`
- Foreign key `avatar_id`: referencia a `avatars.id` con `cascadeOnDelete`

## Relaciones Eloquent

### BelongsTo

- **student**: Relación con `Student` - estudiante dueño del avatar

  - Foreign key: `student_id` referenciando `user_id` en Student

- **avatar**: Relación con `Avatar` - avatar adquirido

## Casts y Fechas

**Casts:**

- `active`: `boolean`
- `points_store`: `decimal:2`

**Dates:**

- `exchange_date`

## Fillable

Los campos que pueden ser asignados masivamente:

- `student_id`
- `avatar_id`
- `active`
- `points_store`
- `exchange_date`

## Scopes

- **scopeActive**: Filtra avatares activos

## TypeScript Types

```typescript
export interface StudentAvatar {
  id: number
  active: boolean
  points_store: number
  exchange_date: string | null
  student_id: number
  avatar_id: number
  student?: Student
  avatar?: Avatar
}

export type CreateStudentAvatar = Omit<StudentAvatar, 'id' | 'student' | 'avatar'> & {
  student_id: number
  avatar_id: number
  active?: boolean
  points_store: number
  exchange_date?: string | null
}

export type UpdateStudentAvatar = Partial<Omit<CreateStudentAvatar, 'student_id' | 'avatar_id'>> & {
  id: number
  active?: boolean
  points_store?: number
  exchange_date?: string | null
}

export interface SetActiveStudentAvatar {
  student_avatar_id: number
}

export interface StudentAvatarFilters {
  student_id?: number
  avatar_id?: number
  active?: boolean
  with_avatar?: boolean
  with_student?: boolean
  page?: number
  per_page?: number
}
```

## Flujo de Datos

### Adquisición de Avatares

1. El estudiante selecciona un avatar y verifica requisitos (nivel, puntos)
2. Se crea un registro en `student_avatars`
3. Se deducen los puntos del estudiante
4. Se registra la fecha de intercambio y puntos gastados
5. Se puede activar como avatar actual

### Activación de Avatar

1. El estudiante selecciona un avatar de su colección
2. Se desactiva el avatar activo actual
3. Se activa el nuevo avatar seleccionado
4. Solo un avatar puede estar activo por estudiante

### Consultas Comunes

- Obtener avatares de un estudiante: `$student->studentAvatars`
- Obtener avatar activo de un estudiante: `$student->studentAvatars()->active()->first()`
- Obtener estudiantes con un avatar: `$avatar->studentAvatars`

## Notas Importantes

- NO usa timestamps (el modelo tiene $timestamps = false)
- Usa `cascadeOnDelete` para eliminar registros cuando se elimina el estudiante o el avatar
- La combinación student_id + avatar_id es única
- Solo un avatar puede estar activo por estudiante
- Los puntos gastados se registran para control de auditoría
- Los índices optimizan búsquedas por estudiante y estado activo
