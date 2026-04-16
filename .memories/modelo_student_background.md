# Modelo: StudentBackground

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/StudentBackground.php`
**Migración:** `database/migrations/2025_06_22_100450_create_student_backgrounds_table.php`
**TypeScript:** `resources/js/types/user/student/background/index.d.ts`

## Descripción

El modelo `StudentBackground` representa la relación entre un estudiante y un fondo de pantalla que ha adquirido. Registra qué fondos posee cada estudiante, en qué pantalla se usan, cuál está activo, los puntos gastados y la fecha de adquisición. Los estudiantes pueden tener múltiples fondos para diferentes pantallas.

## Estructura de Base de Datos

### Tabla: `student_backgrounds`

| Campo           | Tipo                   | Descripción                                           |
| --------------- | ---------------------- | ----------------------------------------------------- |
| `id`            | `bigint` (PK)          | Identificador único del fondo del estudiante          |
| `student_id`    | `bigint` (FK)          | Referencia al estudiante dueño del fondo              |
| `background_id` | `bigint` (FK)          | Referencia al fondo de pantalla                       |
| `screen`        | `string`               | Pantalla específica donde se aplica el fondo          |
| `active`        | `boolean`              | Indica si el fondo está actualmente en uso            |
| `points_store`  | `decimal(10,2)`        | Puntos de la tienda utilizados para adquirir el fondo |
| `exchange_date` | `timestamp` (nullable) | Fecha y hora en que se canjeó el fondo                |

### Índices

- `idx_student_background`: Índice compuesto en `student_id` y `background_id`
- `idx_student_background_active_screen`: Índice compuesto en `student_id`, `active`, y `screen`
- `idx_student_backgrounds_student`: Índice en `student_id`

### Restricciones

- Unique constraint: `['student_id', 'background_id', 'screen']` - evita duplicados de fondo por estudiante y pantalla

### Relaciones

- Foreign key `student_id`: referencia a `students.user_id` con `cascadeOnDelete`
- Foreign key `background_id`: referencia a `backgrounds.id` con `cascadeOnDelete`

## Relaciones Eloquent

### BelongsTo

- **student**: Relación con `Student` - estudiante dueño del fondo

  - Foreign key: `student_id` referenciando `user_id` en Student

- **background**: Relación con `Background` - fondo de pantalla

## Casts y Fechas

**Casts:**

- `active`: `boolean`
- `points_store`: `decimal:2`

**Dates:**

- `exchange_date`

**Timestamps:**

- Deshabilitados (`public $timestamps = false`)

## Fillable

Los campos que pueden ser asignados masivamente:

- `screen`
- `active`
- `points_store`
- `exchange_date`
- `student_id`
- `background_id`

## Scopes

- **scopeActive**: Filtra fondos activos
- **scopeForScreen**: Filtra fondos por pantalla específica

## TypeScript Types

```typescript
export interface StudentBackground {
  id: number
  student_id: number
  background_id: number
  screen: string
  active: boolean
  points_store: number
  exchange_date: string | null
  student?: Student
  background?: Background
}

export type CreateStudentBackground = Omit<StudentBackground, 'id' | 'student' | 'background'> & {
  student_id: number
  background_id: number
  screen: string
  active?: boolean
  points_store: number
  exchange_date?: string | null
}

export type UpdateStudentBackground = Partial<Omit<CreateStudentBackground, 'student_id' | 'background_id' | 'screen'>> & {
  id: number
  active?: boolean
  points_store?: number
  exchange_date?: string | null
}

export interface SetActiveStudentBackground {
  student_background_id: number
  screen: string
}

export interface StudentBackgroundFilters {
  student_id?: number
  background_id?: number
  screen?: string
  active?: boolean
  with_background?: boolean
  with_student?: boolean
  page?: number
  per_page?: number
}
```

## Flujo de Datos

### Adquisición de Fondos

1. El estudiante selecciona un fondo y una pantalla
2. Verifica requisitos (nivel, puntos)
3. Se crea un registro en `student_backgrounds`
4. Se deducen los puntos del estudiante
5. Se registra la fecha de intercambio y puntos gastados

### Activación de Fondo

1. El estudiante selecciona un fondo para una pantalla específica
2. Se desactiva el fondo activo actual para esa pantalla
3. Se activa el nuevo fondo seleccionado
4. Solo un fondo puede estar activo por pantalla

### Consultas Comunes

- Obtener fondos de un estudiante: `$student->studentBackgrounds`
- Obtener fondo activo para una pantalla: `$student->studentBackgrounds()->active()->forScreen('profile')->first()`
- Obtener estudiantes con un fondo: `$background->studentBackgrounds`

## Notas Importantes

- Usa `cascadeOnDelete` para eliminar registros cuando se elimina el estudiante o el fondo
- La combinación student_id + background_id + screen es única
- Solo un fondo puede estar activo por estudiante y pantalla
- No usa timestamps estándar de Laravel
- Los índices optimizan búsquedas por estudiante, pantalla y estado activo
