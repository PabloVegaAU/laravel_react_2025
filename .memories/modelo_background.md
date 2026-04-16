# Modelo: Background

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/Background.php`
**Migración:** `database/migrations/2025_06_22_100440_create_backgrounds_table.php`
**TypeScript:** `resources/js/types/background/index.d.ts`

## Descripción

El modelo `Background` representa un fondo que los estudiantes pueden desbloquear y usar en el sistema. Los fondos son elementos de personalización para diferentes pantallas de la interfaz que requieren un nivel mínimo y puntos de la tienda para ser adquiridos. Cada fondo tiene una imagen, nivel requerido y costo en puntos.

## Estructura de Base de Datos

### Tabla: `backgrounds`

| Campo            | Tipo                   | Descripción                                           |
| ---------------- | ---------------------- | ----------------------------------------------------- |
| `id`             | `bigint` (PK)          | Identificador único del fondo                         |
| `name`           | `string`               | Nombre del fondo                                      |
| `image`          | `string`               | URL de la imagen del fondo                            |
| `level_required` | `integer`              | Nivel mínimo requerido para adquirir el fondo (no FK) |
| `points_store`   | `decimal(10,2)`        | Puntos requeridos para adquirir el fondo              |
| `activo`         | `boolean` default true | Indica si el fondo está activo                        |
| `created_at`     | `timestamp`            | Fecha de creación                                     |
| `updated_at`     | `timestamp`            | Fecha de actualización                                |

## Relaciones Eloquent

### HasMany

- **studentBackgrounds**: Relación con `StudentBackground` - registros de estudiantes que han adquirido este fondo

### BelongsToMany

- **students**: Relación con `Student` a través de `student_backgrounds` - estudiantes que han adquirido este fondo
  - Pivot fields: `screen`, `active`, `points_store`, `exchange_date`
  - Foreign key en Student: `user_id`

### BelongsTo

- **requiredLevel**: Relación con `Level` - nivel requerido para desbloquear el fondo

## Casts y Fechas

**Casts:**

- `points_store`: `decimal:2`

**Dates:**

- `created_at`

## Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `image`
- `level_required`
- `points_store`
- `activo`

## TypeScript Types

```typescript
export interface Background {
  id: number
  name: string
  image: string
  level_required: number
  points_store: number
  created_at: string
  updated_at: string
  required_level?: Level
  student_backgrounds?: StudentBackground[]
  students?: Student[]
}

export interface CreateBackgroundData {
  name: string
  image: File
  level_required: number
  points_store: number
}

export interface UpdateBackgroundData {
  name?: string
  image?: File | null
  level_required?: number
  points_store?: number
}

export interface BackgroundFilters {
  min_level?: number
  max_points?: number
  search?: string
  student_id?: number
  not_owned_by_student?: number
  screen?: string
  page?: number
  per_page?: number
}
```

## Flujo de Datos

### Creación de Fondos

1. El administrador crea un nuevo fondo con nombre e imagen
2. Especifica el nivel mínimo y puntos requeridos
3. El fondo se guarda en la base de datos

### Adquisición por Estudiantes

1. El estudiante verifica si cumple el nivel mínimo
2. Tiene suficientes puntos de la tienda
3. Crea un registro en `student_backgrounds` especificando la pantalla
4. Se registra la fecha de intercambio y puntos gastados
5. Puede activar el fondo para la pantalla especificada

### Consultas Comunes

- Obtener fondos activos: `Background::where('activo', true)->get()`
- Obtener fondos disponibles para un nivel: `Background::where('level_required', '<=', $level)->get()`
- Obtener fondos de un estudiante: `$student->backgrounds`
- Obtener nivel requerido: `$background->requiredLevel`

## Notas Importantes

- No usa soft deletes
- El campo `activo` permite desactivar fondos sin eliminarlos
- El campo `level_required` referencia al nivel del sistema (no es una foreign key en la migración)
- Los estudiantes pueden tener múltiples fondos para diferentes pantallas
- La relación con estudiantes registra la pantalla donde se usa el fondo
- Los puntos de la tienda se deducen al adquirir el fondo
- Cada fondo puede estar activo en una pantalla específica del estudiante
