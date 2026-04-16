# Modelo: StudentAchievement

## Ubicación y Archivos Relacionados

**Modelo PHP:** `app/Models/StudentAchievement.php`
**Migración:** `database/migrations/2025_06_22_100270_create_student_achievements_table.php`
**TypeScript:** `resources/js/types/user/student/achievement/index.d.ts`

## Descripción

El modelo `StudentAchievement` representa la relación entre un estudiante y un logro que ha obtenido. Esta tabla registra cuándo un estudiante obtuvo un logro específico. Es una tabla pivot con timestamps personalizados para registrar la fecha de obtención.

## Estructura de Base de Datos

### Tabla: `student_achievements`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `bigint` (PK) | Identificador único del logro del estudiante |
| `student_id` | `bigint` (FK) | Referencia al estudiante que obtuvo el logro |
| `achievement_id` | `bigint` (FK) | Referencia al logro obtenido |
| `achieved_at` | `timestamp` | Fecha y hora en que se obtuvo el logro |

### Índices
- `idx_student_achievements_student`: Índice en `student_id`
- `idx_student_achievements_achievement`: Índice en `achievement_id`

### Restricciones
- Unique constraint: `['student_id', 'achievement_id']` - evita duplicados de logro por estudiante

### Relaciones
- Foreign key `student_id`: referencia a `students.user_id` con `cascadeOnDelete`
- Foreign key `achievement_id`: referencia a `achievements.id` con `cascadeOnDelete`

## Relaciones Eloquent

### BelongsTo
- **student**: Relación con `Student` - estudiante que obtuvo el logro
  - Foreign key: `student_id` referenciando `user_id` en Student

- **achievement**: Relación con `Achievement` - logro obtenido

## Casts y Fechas

**Casts:**
- `achieved_at`: `datetime`

**Timestamps:**
- Deshabilitados (`public $timestamps = false`)

## Fillable

Los campos que pueden ser asignados masivamente:
- `student_id`
- `achievement_id`
- `achieved_at`

## Scopes

- **scopeAchievedBetween**: Filtra logros obtenidos entre dos fechas
- **scopeByStudent**: Filtra logros por estudiante

## TypeScript Types

```typescript
export interface StudentAchievement {
  id: number
  student_id: number
  achievement_id: number
  achieved_at: string
  student?: Student
  achievement?: Achievement
}
```

## Flujo de Datos

### Asignación de Logros
1. Cuando un estudiante cumple los criterios de un logro
2. Se crea un registro en `student_achievements`
3. Se registra la fecha y hora actual en `achieved_at`
4. El estudiante queda asociado al logro

### Consultas Comunes
- Obtener logros de un estudiante: `$student->studentAchievements`
- Obtener estudiantes con un logro: `$achievement->students`
- Filtrar logros por fecha: `StudentAchievement::achievedBetween($from, $to)->get()`
- Filtrar logros por estudiante: `StudentAchievement::byStudent($studentId)->get()`

## Notas Importantantes

- Es una tabla pivot con modelo propio para registrar fecha de obtención
- No usa timestamps estándar de Laravel
- La combinación student_id + achievement_id es única
- Usa `cascadeOnDelete` para eliminar registros cuando se elimina el estudiante o el logro
- La fecha de obtención se establece automáticamente con `useCurrent()`
