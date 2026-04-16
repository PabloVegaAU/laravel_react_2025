# 📚 Level

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100000_create_levels_table.php` (estructura de base de datos)
>    - `app/Models/Level.php` (implementación del modelo)
>    - `resources/js/types/academic/level.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Level.php`
- **Tabla**: `levels`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100000_create_levels_table.php`
  - Estructura de la tabla
  - Índice único en campo `level`
  - Soft deletes

### Modelos Relacionados

- `app/Models/StudentLevelHistory.php` (hasMany)
  - Historiales de niveles alcanzados por estudiantes
  - Clave foránea: `level_id`
- `app/Models/Classroom.php` (hasMany)
  - Aulas asignadas a este nivel
  - Clave foránea: `level_id`
- `app/Models/Student.php` (belongsToMany)
  - Estudiantes que han alcanzado este nivel
  - Tabla pivot: `student_level_histories`
  - Campos pivot: `achieved_at`, `experience`, `range_id`
- `app/Models/Enrollment.php` (hasManyThrough)
  - Matrículas en aulas de este nivel
  - A través de `Classroom`

### Tipos TypeScript

- `resources/js/types/academic/level.d.ts`
  - `type Level`
  - `type CreateLevel`
  - `type UpdateLevel`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `levels`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `level`: unsignedInteger (unique) - Nivel numérico (1, 2, 3, ...)
  - `name`: string - Nombre del nivel
  - `experience_max`: decimal(10,2) unsigned default 0 - Experiencia máxima del nivel
  - `experience_required`: decimal(10,2) unsigned default 0 - Experiencia necesaria para alcanzar este nivel
  - `timestamps()`: created_at, updated_at
  - `softDeletes()`: deleted_at

### Índices

- `uq_levels_level`: Índice único en el campo `level`

### Relaciones

- **Relación con StudentLevelHistory**:
  - Tipo: hasMany
  - Clave foránea: `level_id`
  - Comportamiento en cascada: delete
- **Relación con Classroom**:
  - Tipo: hasMany
  - Clave foránea: `level_id`
  - Comportamiento en cascada: delete
- **Relación con Student**:
  - Tipo: belongsToMany
  - Tabla pivot: `student_level_histories`
  - Campos pivot: `achieved_at`, `experience`, `range_id`
  - Incluye timestamps
- **Relación con Enrollment**:
  - Tipo: hasManyThrough
  - A través de: `Classroom`

## 🔄 Flujo de Datos

### Creación de Niveles

1. El administrador crea un nuevo nivel con nombre, número, y parámetros de experiencia
2. El nivel se guarda en la base de datos
3. El nivel puede ser asignado a aulas (Classroom)

### Progresión de Estudiantes

1. Cuando un estudiante alcanza la experiencia requerida para un nivel
2. Se crea un registro en `student_level_histories`
3. El estudiante se asocia al nivel a través de la relación belongsToMany
4. Se registra el rango alcanzado, experiencia actual y fecha de alcance

### Consultas Comunes

- Obtener todos los niveles ordenados por número: `Level::orderBy('level')->get()`
- Obtener aulas de un nivel: `$level->classrooms`
- Obtener estudiantes que alcanzaron un nivel: `$level->students`
- Obtener historial de progresión en un nivel: `$level->studentLevelHistories`

## 🔍 Ejemplo de Uso

```typescript
// Ejemplo de tipo TypeScript relacionado
export type Level = BaseEntity & {
  name: string
  level: number
  experience_max: number
  experience_required: number

  // Relaciones
  studentLevelHistories?: StudentLevelHistory[]
  students?: Student[]
  classrooms?: Classroom[]
  enrollments?: Enrollment[]
}

export type CreateLevel = Omit<
  Level,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'studentLevelHistories' | 'students' | 'classrooms' | 'enrollments'
>

export type UpdateLevel = Partial<CreateLevel>
```

## ⚙️ Configuración del Modelo

### Casts

- `level`: `integer`
- `experience_max`: `decimal:2`
- `experience_required`: `decimal:2`

### Dates

- `created_at`
- `updated_at`
- `deleted_at`

### Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `level`
- `experience_max`
- `experience_required`

## ⚠️ Consideraciones

- El campo `level` es único y representa el orden numérico del nivel
- `experience_required` es la experiencia mínima necesaria para alcanzar este nivel
- `experience_max` es la experiencia máxima que se puede tener en este nivel antes de subir al siguiente
- Usa soft deletes para permitir recuperación de niveles eliminados
- La relación con estudiantes es a través de la tabla pivot `student_level_histories`
