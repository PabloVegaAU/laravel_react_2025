# Modelo: Prize

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Prize.php`
**Migración:** `database/migrations/2025_06_22_100400_create_prizes_table.php`
**TypeScript:** `resources/js/types/prize.ts`

## Descripción

El modelo `Prize` representa una recompensa que los estudiantes pueden canjear en la tienda del sistema. Las recompensas pueden ser de diferentes tipos (avatar, fondo, insignia, etc.) y tienen un stock, costo en puntos, nivel mínimo requerido y fecha de disponibilidad. Las recompensas son un incentivo para la participación y logro de los estudiantes.

## Estructura de Base de Datos

### Tabla: `prizes`

| Campo             | Tipo                   | Descripción                                      |
| ----------------- | ---------------------- | ------------------------------------------------ |
| `id`              | `bigint` (PK)          | Identificador único de la recompensa             |
| `name`            | `string`               | Nombre de la recompensa                          |
| `description`     | `string`               | Descripción de la recompensa                     |
| `type`            | `string` (nullable)    | Tipo de recompensa (ej: avatar, fondo, insignia) |
| `image`           | `string`               | URL de la imagen de la recompensa                |
| `stock`           | `integer` default 0    | Stock de la recompensa                           |
| `points_cost`     | `decimal(10,2)`        | Puntos de la tienda necesarios para canjear      |
| `level_required`  | `integer`              | Nivel mínimo requerido para desbloquear (no FK)  |
| `available_until` | `timestamp` (nullable) | Fecha y hora en que la recompensa vence          |
| `is_active`       | `boolean` default true | Indica si la recompensa está activa              |
| `created_at`      | `timestamp`            | Fecha de creación                                |
| `updated_at`      | `timestamp`            | Fecha de actualización                           |
| `deleted_at`      | `timestamp` (nullable) | Fecha de eliminación suave (softDeletes)         |

### Índices

- `idx_prizes_type`: Índice en `type`
- `idx_prizes_points`: Índice en `points_cost`
- `idx_prizes_level_required`: Índice en `level_required`

## Relaciones Eloquent

### BelongsTo

- **requiredLevel**: Relación con `Level` - nivel requerido para desbloquear la recompensa

## Casts y Fechas

**Casts:**

- `is_active`: `boolean`
- `available_until`: `datetime`
- `stock`: `integer`
- `points_cost`: `decimal:2`

**Dates:**

- `available_until`
- `created_at`
- `updated_at`
- `deleted_at`

## Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `description`
- `type`
- `image`
- `level_required`
- `stock`
- `points_cost`
- `is_active`
- `available_until`

## TypeScript Types

```typescript
export interface Prize {
  id: number
  name: string
  description: string
  image: string | null
  stock: number
  points_cost: number
  is_active: boolean
  available_until: string | null
  level_required: number
  type?: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PrizeFormData {
  name: string
  description: string
  stock: string | number
  points_cost: string | number
  is_active: boolean
  available_until: string | null
  image: File | null
}

export interface PrizeFilters {
  search?: string
  is_active?: boolean | string
  min_points?: number | string
  max_points?: number | string
  in_stock?: boolean | string
}
```

## Flujo de Datos

### Creación de Recompensas

1. El administrador crea una nueva recompensa con nombre, descripción e imagen
2. Especifica el tipo, stock, costo en puntos y nivel mínimo
3. Puede establecer una fecha de vencimiento opcional
4. La recompensa se guarda en la base de datos

### Canje por Estudiantes

1. El estudiante verifica si cumple el nivel mínimo
2. Tiene suficientes puntos de la tienda
3. La recompensa está activa y tiene stock disponible
4. No ha vencido (si tiene fecha de vencimiento)
5. Se crea un registro en `student_prizes`
6. Se reduce el stock de la recompensa
7. Se deducen los puntos del estudiante

### Consultas Comunes

- Obtener recompensas activas: `Prize::where('is_active', true)->get()`
- Obtener recompensas disponibles: `Prize::where('stock', '>', 0)->get()`
- Obtener recompensas por tipo: `Prize::where('type', 'avatar')->get()`
- Obtener recompensas por nivel: `Prize::where('level_required', '<=', $level)->get()`

## Notas Importantes

- Usa soft deletes para permitir recuperación de recompensas eliminadas
- El campo `is_active` permite desactivar recompensas sin eliminarlas
- El campo `available_until` permite recompensas temporales
- El stock se reduce al canjear la recompensa
- El campo `level_required` referencia al nivel del sistema (no es una foreign key en la migración)
- Los índices optimizan búsquedas por tipo, puntos y nivel
- Las recompensas son un incentivo para la gamificación del sistema
