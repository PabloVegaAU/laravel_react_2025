# Modelo: StudentLevelHistory

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/StudentLevelHistory.php`
**Migración:** `database/migrations/2025_06_22_100140_create_student_level_histories_table.php`
**TypeScript:** `resources/js/types/user/student/progress/level.d.ts`

## Descripción

El modelo `StudentLevelHistory` representa el historial de progresión de niveles y rangos de un estudiante. Registra cada vez que un estudiante alcanza un nuevo nivel o rango, junto con la experiencia acumulada en ese momento. Permite rastrear la trayectoria de progreso del estudiante a lo largo del tiempo.

## Estructura de Base de Datos

### Tabla: `student_level_histories`

| Campo         | Tipo            | Descripción                                     |
| ------------- | --------------- | ----------------------------------------------- |
| `id`          | `bigint` (PK)   | Identificador único del registro de historial   |
| `student_id`  | `bigint` (FK)   | Referencia al estudiante                        |
| `level_id`    | `bigint` (FK)   | Nivel alcanzado por el estudiante               |
| `range_id`    | `bigint` (FK)   | Rango alcanzado por el estudiante               |
| `experience`  | `decimal(10,2)` | Cantidad de experiencia acumulada               |
| `achieved_at` | `timestamp`     | Fecha y hora en que se alcanzó este nivel/rango |

### Índices

- `idx_student_achievement_date`: Índice compuesto en `student_id` y `achieved_at`
- `idx_level_range`: Índice compuesto en `level_id` y `range_id`

### Relaciones

- Foreign key `student_id`: referencia a `students.user_id` con `cascadeOnDelete`
- Foreign key `level_id`: referencia a `levels.id` con `restrictOnDelete`
- Foreign key `range_id`: referencia a `ranges.id` con `restrictOnDelete`

## Relaciones Eloquent

### BelongsTo

- **student**: Relación con `Student` - estudiante del historial

  - Foreign key: `student_id` referenciando `user_id` en Student

- **level**: Relación con `Level` - nivel alcanzado

- **range**: Relación con `Range` - rango alcanzado

## Casts y Fechas

**Casts:**

- `experience`: `decimal:2`
- `achieved_at`: `datetime`

## Fillable

Los campos que pueden ser asignados masivamente:

- `experience`
- `achieved_at`
- `student_id`
- `level_id`
- `range_id`

## TypeScript Types

```typescript
export interface StudentLevelHistory {
  id: number
  student_id: number
  level_id: number
  range_id: number
  experience: number
  achieved_at: string
  level: {
    id: number
    name: string
    description: string | null
    min_experience: number
    max_experience: number
    created_at: string
    updated_at: string
  }
  range: {
    id: number
    name: string
    description: string | null
    min_points: number
    max_points: number
    badge_image: string | null
    created_at: string
    updated_at: string
  }
}

export interface StudentLevelProgress {
  current_level: {
    id: number
    name: string
    current_experience: number
    experience_to_next_level: number
    progress_percentage: number
  }
  current_range: {
    id: number
    name: string
    current_points: number
    points_to_next_range: number
    progress_percentage: number
  }
  total_experience: number
  total_points: number
  level_history: StudentLevelHistory[]
}

export interface LevelHistoryFilters {
  student_id?: number
  level_id?: number
  range_id?: number
  date_from?: string
  date_to?: string
  sort_by?: 'achieved_at' | 'level_id' | 'range_id'
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}
```

## Flujo de Datos

### Registro de Progresión

1. Cuando un estudiante alcanza un nuevo nivel o rango
2. Se crea un registro en `student_level_histories`
3. Se registra la experiencia acumulada en ese momento
4. Se registra la fecha y hora de logro
5. Se asocia el nivel y rango alcanzados

### Consulta de Historial

1. Para ver la trayectoria de un estudiante
2. Se obtienen todos los registros del estudiante ordenados por fecha
3. Se puede filtrar por nivel o rango específico
4. Se puede calcular el tiempo entre progresiones

### Consultas Comunes

- Obtener historial de un estudiante: `$student->studentLevelHistories`
- Obtener historial por nivel: `StudentLevelHistory::where('level_id', $levelId)->get()`
- Obtener historial por rango: `StudentLevelHistory::where('range_id', $rangeId)->get()`

## Notas Importantes

- Usa `cascadeOnDelete` para eliminar historial cuando se elimina el estudiante
- Usa `restrictOnDelete` para evitar eliminar niveles o rangos con historial
- La experiencia registrada es el total acumulado en ese momento
- Permite rastrear la progresión completa del estudiante
- Los índices optimizan búsquedas por estudiante, fecha y nivel-rango
- Es fundamental para el sistema de gamificación
