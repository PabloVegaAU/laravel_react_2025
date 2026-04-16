# 📚 Cycle

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100050_create_cycles_table.php` (estructura de base de datos)
>    - `app/Models/Cycle.php` (implementación del modelo)
>    - `resources/js/types/academic/cycle.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Cycle.php`
- **Tabla**: `cycles`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100050_create_cycles_table.php`
  - Estructura de la tabla
  - Índices únicos
  - Soft deletes

### Modelos Relacionados

- `app/Models/CurricularAreaCycle.php` (hasMany)
  - Asociaciones entre ciclo y áreas curriculares
  - Clave foránea: `cycle_id`
- `app/Models/CurricularArea.php` (hasManyThrough)
  - Áreas curriculares en este ciclo
  - A través de: `CurricularAreaCycle`
- `app/Models/TeacherClassroomCurricularAreaCycle.php` (hasManyThrough)
  - Asignaciones docentes en este ciclo
  - A través de: `CurricularAreaCycle`

### Tipos TypeScript

- `resources/js/types/academic/cycle.d.ts`
  - `interface Cycle`
  - `type CreateCycle`
  - `type UpdateCycle`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `cycles`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `name`: string(100) (unique) - Nombre del ciclo (ej: Inicial, Primaria, Secundaria)
  - `order`: unsigned int - Orden de visualización
  - `timestamps()`: created_at, updated_at, deleted_at

### Índices

- `uq_cycles_name`: Índice único en `name`
- `idx_cycles_order`: Índice en `order`

### Relaciones

- **Relación con CurricularAreaCycle**:
  - Tipo: hasMany
  - Clave foránea: `cycle_id`
  - Comportamiento en cascada: delete
- **Relación con CurricularArea**:
  - Tipo: hasManyThrough
  - A través de: `CurricularAreaCycle`
- **Relación con TeacherClassroomCurricularAreaCycle**:
  - Tipo: hasManyThrough
  - A través de: `CurricularAreaCycle`

## 🔄 Flujo de Datos

### Creación de Ciclos

1. El administrador crea un nuevo ciclo con nombre y orden
2. El ciclo se guarda en la base de datos
3. Se pueden asociar áreas curriculares al ciclo

### Asociación de Áreas Curriculares

1. Se crea un registro en `curricular_area_cycles` vinculando el ciclo con un área curricular
2. A través de esta relación, se pueden asignar docentes a aulas en este ciclo

### Consultas Comunes

- Obtener todos los ciclos ordenados: `Cycle::orderBy('order')->get()`
- Obtener áreas curriculares de un ciclo: `$cycle->curricularAreas`
- Obtener asignaciones docentes en un ciclo: `$cycle->teacherClassroomCurricularAreaCycles`

## 🔍 Ejemplo de Uso

```typescript
export interface Cycle {
  id: number
  name: string
  order: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  curricular_areas?: CurricularArea[]
  curricular_area_cycles?: CurricularAreaCycle[]
  teacher_classroom_curricular_area_cycles?: TeacherClassroomCurricularAreaCycle[]
}

export type CreateCycle = Omit<
  Cycle,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'curricular_areas' | 'curricular_area_cycles' | 'teacher_classroom_curricular_area_cycles'
>

export type UpdateCycle = Partial<CreateCycle>
```

## ⚙️ Configuración del Modelo

### Casts

- `order`: `integer`
- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

### Dates

- `created_at`
- `updated_at`
- `deleted_at`

### Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `order`

## ⚠️ Consideraciones

- El campo `name` es único para evitar duplicados de ciclos
- El campo `order` define el orden de visualización en la UI
- Usa soft deletes para permitir recuperación de ciclos eliminados
- Los ciclos actúan como organizadores del plan de estudios
- La relación con áreas curriculares es muchos a muchos a través de `CurricularAreaCycle`
