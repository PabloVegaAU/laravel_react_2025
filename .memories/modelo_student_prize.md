# Modelo: StudentPrize

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/StudentPrize.php`
**Migración:** `database/migrations/2025_06_22_100410_create_student_prizes_table.php`
**TypeScript:** `resources/js/types/user/student/prizes/student-prize.d.ts`

## Descripción

El modelo `StudentPrize` representa el canje de una recompensa por parte de un estudiante. Registra qué recompensas ha canjeado cada estudiante, los puntos gastados, la fecha de canje y si ha sido reclamada. Las recompensas pueden tener stock limitado y fechas de disponibilidad.

## Estructura de Base de Datos

### Tabla: `student_prizes`

| Campo           | Tipo                   | Descripción                                   |
| --------------- | ---------------------- | --------------------------------------------- |
| `id`            | `bigint` (PK)          | Identificador único del registro de canje     |
| `student_id`    | `bigint` (FK)          | Referencia al estudiante que realizó el canje |
| `prize_id`      | `bigint` (FK)          | Referencia a la recompensa canjeada           |
| `points_store`  | `decimal(10,2)`        | Cantidad de puntos de la tienda utilizados    |
| `exchange_date` | `timestamp` (nullable) | Fecha y hora en que se realizó el canje       |
| `claimed`       | `boolean`              | Indica si el canje ha sido reclamado          |
| `claimed_at`    | `timestamp` (nullable) | Fecha y hora en que se reclamó el canje       |

### Índices

- `idx_student_prize`: Índice compuesto en `student_id` y `prize_id`
- `idx_student_prize_date`: Índice compuesto en `student_id` y `exchange_date`

### Relaciones

- Foreign key `student_id`: referencia a `students.user_id` con `cascadeOnDelete`
- Foreign key `prize_id`: referencia a `prizes.id` con `cascadeOnDelete`

## Relaciones Eloquent

### BelongsTo

- **student**: Relación con `Student` - estudiante que realizó el canje

  - Foreign key: `student_id` referenciando `user_id` en Student

- **prize**: Relación con `Prize` - recompensa canjeada

## Casts y Fechas

**Casts:**

- `points_store`: `decimal:2`
- `exchange_date`: `datetime`
- `claimed`: `boolean`
- `claimed_at`: `datetime`

**Timestamps:**

- Deshabilitados (`public $timestamps = false`)

## Fillable

Los campos que pueden ser asignados masivamente:

- `points_store`
- `exchange_date`
- `claimed`
- `claimed_at`
- `student_id`
- `prize_id`

## TypeScript Types

```typescript
export interface StudentPrize {
  id: number
  student_id: number
  prize_id: number
  exchange_date: string | null
  claimed: boolean
  claimed_at: string | null
  student?: Student
  prize?: Prize
}
```

## Flujo de Datos

### Canje de Recompensas

1. El estudiante selecciona una recompensa disponible
2. Verifica requisitos (nivel, puntos, stock, fecha de disponibilidad)
3. Se crea un registro en `student_prizes`
4. Se deducen los puntos del estudiante
5. Se reduce el stock de la recompensa
6. Se marca como no reclamado inicialmente

### Reclamación de Recompensas

1. El estudiante reclama la recompensa canjeada
2. Se actualiza el campo `claimed` a true
3. Se registra la fecha de reclamación en `claimed_at`

### Consultas Comunes

- Obtener canjes de un estudiante: `$student->studentPrizes`
- Obtener canjes de una recompensa: `$prize->studentPrizes`
- Obtener canjes no reclamados: `StudentPrize::where('claimed', false)->get()`

## Notas Importantes

- Usa `cascadeOnDelete` para eliminar registros cuando se elimina el estudiante o la recompensa
- No usa timestamps estándar de Laravel
- El stock de la recompensa se reduce al canjear
- Las recompensas pueden tener fechas de disponibilidad limitada
- Los puntos gastados se registran para auditoría
- Los canjes deben ser reclamados explícitamente
- Los índices optimizan búsquedas por estudiante y fecha
