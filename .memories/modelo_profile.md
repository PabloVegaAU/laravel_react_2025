# Modelo: Profile

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Profile.php`
**Migración:** `database/migrations/2025_06_22_100020_create_profiles_table.php`
**TypeScript:** `resources/js/types/auth/profile.d.ts`

## Descripción

El modelo `Profile` representa la información personal extendida de un usuario. Contiene datos como nombres, fecha de nacimiento y teléfono. Cada usuario tiene un único perfil asociado, y el perfil usa el `user_id` como clave primaria, estableciendo una relación uno a uno con el modelo User.

## Estructura de Base de Datos

### Tabla: `profiles`

| Campo              | Tipo                     | Descripción                                                                             |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------------- |
| `user_id`          | `foreignId` (PK, FK)     | Referencia al usuario al que pertenece este perfil (constrained users, cascadeOnDelete) |
| `first_name`       | `string(100)`            | Nombre(s) del usuario                                                                   |
| `last_name`        | `string(100)`            | Apellido(s) del usuario                                                                 |
| `second_last_name` | `string(100)` (nullable) | Segundo apellido (opcional)                                                             |
| `birth_date`       | `date` (nullable)        | Fecha de nacimiento del usuario                                                         |
| `phone`            | `string(20)` (nullable)  | Número de teléfono de contacto                                                          |
| `created_at`       | `timestamp`              | Fecha de creación                                                                       |
| `updated_at`       | `timestamp`              | Fecha de actualización                                                                  |
| `deleted_at`       | `timestamp` (nullable)   | Fecha de eliminación suave (softDeletes)                                                |

### Índices

- `idx_profile_full_name`: Índice compuesto en `first_name`, `last_name`, y `second_last_name`
- `idx_profile_birth_date`: Índice en `birth_date`
- `idx_profiles_fulltext`: Índice de texto completo en `first_name`, `last_name`, y `second_last_name`

### Relaciones

- Foreign key `user_id`: referencia a `users.id` con `cascadeOnDelete` y es también la clave primaria

## Relaciones Eloquent

### BelongsTo

- **user**: Relación con `User` - usuario al que pertenece el perfil

## Casts y Fechas

**Casts:**

- `created_at`: `datetime`
- `updated_at`: `datetime`

## Fillable

Los campos que pueden ser asignados masivamente:

- `first_name`
- `last_name`
- `second_last_name`
- `birth_date`
- `phone`
- `user_id`

## TypeScript Types

```typescript
export type Profile = Timestamps & {
  user_id: number
  first_name: string
  last_name: string
  second_last_name: string | null
  birth_date: string | null
  phone: string | null
  user?: User
}

export type CreateProfile = Omit<Profile, 'user_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>

export type UpdateProfile = Partial<CreateProfile>

export interface FullName {
  first_name: string
  last_name: string
  second_last_name?: string | null
}

export interface ContactInfo {
  email: string | null
  phone: string | null
}
```

## Flujo de Datos

### Creación de Perfil

1. Al crear un usuario, se crea automáticamente su perfil
2. Se establece la relación uno a uno mediante `user_id` como PK
3. Los datos personales se almacenan en el perfil

### Actualización de Perfil

1. El usuario puede actualizar sus datos personales
2. Se actualizan los campos correspondientes en la tabla
3. El perfil sigue vinculado al mismo usuario

### Consultas Comunes

- Obtener perfil de un usuario: `$user->profile`
- Buscar por nombre completo usando fulltext search
- Obtener perfil por user_id: `Profile::find($userId)`

## Notas Importantes

- Usa `user_id` como clave primaria y foreign key (relación 1:1)
- Usa `cascadeOnDelete` para eliminar el perfil cuando se elimina el usuario
- Usa soft deletes para permitir recuperación de perfiles eliminados
- El índice de texto completo permite búsquedas eficientes por nombre
- El segundo apellido es opcional
- No puede existir un perfil sin usuario asociado
- Cada usuario tiene exactamente un perfil
