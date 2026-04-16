# Modelo: Achievement

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Achievement.php`
**Migración:** `database/migrations/2025_06_22_100260_create_achievements_table.php`
**TypeScript:** `resources/js/types/achievement/index.d.ts`

## Descripción

El modelo `Achievement` representa un logro que los estudiantes pueden obtener en el sistema. Los logros son reconocimientos otorgados por cumplir ciertos criterios (ej: completar X evaluaciones, obtener Y puntos, etc.). Cada logro tiene un nombre, descripción, imagen y estado de activación.

## Estructura de Base de Datos

### Tabla: `achievements`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `bigint` (PK) | ID único del logro |
| `name` | `string` | Nombre del logro |
| `description` | `string` | Descripción del logro |
| `image` | `string` | Ruta de la imagen del logro |
| `activo` | `boolean` | Indica si el logro está activo |
| `created_at` | `timestamp` | Fecha de creación |
| `updated_at` | `timestamp` | Fecha de actualización |
| `deleted_at` | `timestamp` (nullable) | Fecha de eliminación suave |

### Índices
- `idx_achievements_name`: Índice en `name`

## Relaciones Eloquent

### HasMany
- **studentAchievements**: Relación con `StudentAchievement` - registros de estudiantes que han obtenido este logro

### BelongsToMany
- **students**: Relación con `Student` a través de `student_achievements` - estudiantes que han obtenido este logro
  - Pivot field: `achieved_at`
  - Foreign key en Student: `user_id`
  - Incluye timestamps

## Casts y Fechas

**Casts:**
- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

## Fillable

Los campos que pueden ser asignados masivamente:
- `name`
- `description`
- `image`
- `activo`

## Scopes

- **scopeWithName**: Filtra logros por nombre exacto
- **scopeSearch**: Busca logros por nombre o descripción

## TypeScript Types

```typescript
export type Achievement = BaseEntity & {
  name: string
  description: string
  image: string
  activo: boolean
  studentAchievements?: StudentAchievement[]
  students?: Array<Student & { pivot: { achieved_at: string } }>
}

export type CreateAchievementData = {
  name: string
  description: string
  image: string | File
  activo: boolean
}

export type UpdateAchievementData = {
  name: string
  description: string
  image: string | File
  activo: boolean
  _method: 'PUT'
}
```

## Flujo de Datos

### Creación de Logros
1. El administrador crea un nuevo logro con nombre, descripción e imagen
2. Se especifica si el logro está activo
3. El logro se guarda en la base de datos

### Asignación a Estudiantes
1. Cuando un estudiante cumple los criterios del logro
2. Se crea un registro en `student_achievements`
3. Se registra la fecha en que se obtuvo el logro
4. El estudiante queda asociado al logro a través de la relación belongsToMany

### Consultas Comunes
- Obtener logros activos: `Achievement::where('activo', true)->get()`
- Obtener logros de un estudiante: `$student->achievements`
- Buscar logros por nombre: `Achievement::withName('Excelencia')->first()`
- Buscar logros: `Achievement::search('puntos')->get()`

## Notas Importantes

- Usa soft deletes para permitir recuperación de logros eliminados
- El campo `activo` permite desactivar logros sin eliminarlos
- La relación con estudiantes es a través de la tabla pivot `student_achievements`
- La fecha de obtención del logro se registra en el pivot
- No tiene relaciones foráneas directas en la base de datos
