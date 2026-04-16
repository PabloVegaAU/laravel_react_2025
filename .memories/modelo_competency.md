# 📚 Competency

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100070_create_competencies_table.php` (estructura de base de datos)
>    - `app/Models/Competency.php` (implementación del modelo)
>    - `resources/js/types/academic/competency.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Competency.php`
- **Tabla**: `competencies`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100070_create_competencies_table.php`
  - Estructura de la tabla
  - Clave foránea a curricular_area_cycles con cascadeOnDelete

### Modelos Relacionados

- `app/Models/CurricularAreaCycle.php` (belongsTo)
  - Área-ciclo al que pertenece la competencia
  - Clave foránea: `curricular_area_cycle_id`
- `app/Models/Capability.php` (hasMany)
  - Capacidades que componen esta competencia
  - Clave foránea: `competency_id`
- `app/Models/LearningSession.php` (belongsToMany)
  - Sesiones de aprendizaje que evalúan esta competencia
  - Tabla pivot: `learning_session_competencies`

### Tipos TypeScript

- `resources/js/types/academic/competency.d.ts`
  - `type Competency`
  - `type CreateCompetency`
  - `type UpdateCompetency`
  - `interface CompetencyFilters`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `competencies`
- **Campos Clave**:
  - `id`: bigint - Identificador único de la competencia
  - `curricular_area_cycle_id`: foreignId (curricular_area_cycles.id, cascadeOnDelete) - ID de la relación área-ciclo
  - `name`: string - Nombre de la competencia
  - `color`: string(50) - Código de color para representación visual
  - `timestamps()`: created_at, updated_at

### Relaciones

- **Relación con CurricularAreaCycle**:
  - Tipo: belongsTo
  - Clave foránea: `curricular_area_cycle_id`
  - Comportamiento: cascadeOnDelete
- **Relación con Capability**:
  - Tipo: hasMany
  - Clave foránea: `competency_id`
  - Comportamiento en cascada: delete
- **Relación con LearningSession**:
  - Tipo: belongsToMany
  - Tabla pivot: `learning_session_competencies`

## 🔄 Flujo de Datos

### Creación de Competencias

1. El administrador selecciona un área-ciclo existente
2. Crea una nueva competencia con nombre y color
3. La competencia se guarda asociada al área-ciclo
4. Se pueden agregar capacidades (capabilities) a la competencia

### Asociación con Sesiones de Aprendizaje

1. Al crear una sesión de aprendizaje, se pueden seleccionar competencias a evaluar
2. Se crea un registro en `learning_session_competencies`
3. La competencia queda asociada a la sesión de aprendizaje

### Consultas Comunes

- Obtener competencias de un área-ciclo: `$curricularAreaCycle->competencies`
- Obtener capacidades de una competencia: `$competency->capabilities`
- Obtener sesiones que evalúan una competencia: `$competency->learningSessions`
- Buscar competencias por nombre: `Competency::where('name', 'like', '%matemáticas%')->get()`

## 🔍 Ejemplo de Uso

```typescript
export type Competency = BaseEntity & {
  name: string
  curricular_area_cycle_id: number
  color: string

  // Relaciones
  curricular_area_cycle?: CurricularAreaCycle
  capabilities?: Capability[]
  questions?: Question[]
  learningSessions?: LearningSession[]
}

export type CreateCompetency = Omit<
  Competency,
  'id' | 'created_at' | 'updated_at' | 'curricular_area_cycle' | 'capabilities' | 'questions' | 'learningSessions'
>

export type UpdateCompetency = Partial<Omit<CreateCompetency, 'curricular_area_cycle_id'>>

export interface CompetencyFilters {
  search?: string
  curricular_area_cycle_id?: number | number[]
  with_trashed?: boolean
  page?: number
  per_page?: number
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
```

## ⚙️ Configuración del Modelo

### Casts

- `created_at`: `datetime`
- `updated_at`: `datetime`

### Dates

- `created_at`
- `updated_at`

### Fillable

Los campos que pueden ser asignados masivamente:

- `curricular_area_cycle_id`
- `name`
- `color`

## ⚠️ Consideraciones

- Las competencias siempre pertenecen a un área-ciclo específico
- Usa `cascadeOnDelete` para eliminar capacidades cuando se elimina la competencia
- El color se usa para representación visual en la interfaz
- Las competencias agrupan capacidades más específicas
- Pueden asociarse a múltiples sesiones de aprendizaje
- Son parte fundamental del diseño curricular y evaluación
