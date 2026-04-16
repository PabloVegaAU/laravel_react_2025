# Modelo: Avatar

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Avatar.php`
**Migración:** `database/migrations/2025_06_22_100420_create_avatars_table.php`
**TypeScript:** `resources/js/types/avatar/index.d.ts`

## Descripción

El modelo `Avatar` representa un avatar que los estudiantes pueden desbloquear y usar en el sistema. Los avatares son elementos de personalización que requieren un nivel mínimo y puntos de la tienda para ser adquiridos. Cada avatar tiene una imagen, precio y estado de activación.

## Estructura de Base de Datos

### Tabla: `avatars`

| Campo            | Tipo                   | Descripción                                            |
| ---------------- | ---------------------- | ------------------------------------------------------ |
| `id`             | `bigint` (PK)          | Identificador único del avatar                         |
| `name`           | `string`               | Nombre del avatar                                      |
| `image_url`      | `string`               | URL de la imagen del avatar                            |
| `level_required` | `integer`              | Nivel mínimo requerido para adquirir el avatar (no FK) |
| `price`          | `decimal(10,2)`        | Puntos requeridos para adquirir el avatar              |
| `is_active`      | `boolean` default true | Indica si el avatar está activo                        |
| `created_at`     | `timestamp`            | Fecha de creación                                      |
| `updated_at`     | `timestamp`            | Fecha de actualización                                 |
| `deleted_at`     | `timestamp` (nullable) | Fecha de eliminación suave (softDeletes)               |

## Relaciones Eloquent

### HasMany

- **studentAvatars**: Relación con `StudentAvatar` - registros de estudiantes que han adquirido este avatar

### BelongsToMany

- **students**: Relación con `Student` a través de `student_avatars` - estudiantes que han adquirido este avatar
  - Pivot fields: `active`, `points_store`, `exchange_date`
  - Incluye timestamps

### BelongsTo

- **requiredLevel**: Relación con `Level` - nivel requerido para desbloquear el avatar

## Casts y Fechas

**Casts:**

- `price`: `decimal:2`
- `is_active`: `boolean`
- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

**Dates:**

- `created_at`
- `updated_at`
- `deleted_at`

## Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `image_url`
- `level_required`
- `price`
- `is_active`

## TypeScript Types

```typescript
export interface Avatar {
  id: number
  name: string
  image_url: string
  price: number
  is_active: boolean
  level_required: number
  deleted_at: string | null
  requiredLevel?: Level
  studentAvatars?: StudentAvatar[]
  students?: Student[]
}

export interface StudentAvatar {
  id: number
  active: boolean
  points_store: number
  exchange_date: string | null
  student_id: number
  avatar_id: number

  // Relaciones
  student?: Student
  avatar?: Avatar
}

export interface CreateAvatarData {
  name: string
  image: File
  level_required: number
  price: number
}

export interface UpdateAvatarData {
  name?: string
  image?: File | null
  level_required?: number
  price?: number
}

export interface AvatarFilters {
  min_level?: number
  max_points?: number
  search?: string
  student_id?: number
  not_owned_by_student?: number
  page?: number
  per_page?: number
}
```

## Flujo de Datos

### Creación de Avatares

1. El administrador crea un nuevo avatar con nombre e imagen
2. Especifica el nivel mínimo y puntos requeridos
3. El avatar se guarda en la base de datos

### Adquisición por Estudiantes

1. El estudiante verifica si cumple el nivel mínimo
2. Tiene suficientes puntos de la tienda
3. Crea un registro en `student_avatars`
4. Se registra la fecha de intercambio y puntos gastados
5. Puede activar el avatar como su avatar actual

### Consultas Comunes

- Obtener avatares activos: `Avatar::where('is_active', true)->get()`
- Obtener avatares disponibles para un nivel: `Avatar::where('level_required', '<=', $level)->get()`
- Obtener avatares de un estudiante: `$student->avatars`
- Obtener nivel requerido: `$avatar->requiredLevel`

## Notas Importantes

- Usa soft deletes para permitir recuperación de avatares eliminados
- El campo `is_active` permite desactivar avatares sin eliminarlos
- El campo `level_required` referencia al nivel del sistema (no es una foreign key en la migración)
- Los estudiantes pueden tener múltiples avatares pero solo uno activo
- La relación con estudiantes registra puntos gastados y fecha de intercambio
- Los puntos de la tienda se deducen al adquirir el avatar
