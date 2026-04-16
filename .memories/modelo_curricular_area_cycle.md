# 📚 CurricularAreaCycle

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100065_create_curricular_area_cycles.php` (estructura de base de datos)
>    - `app/Models/CurricularAreaCycle.php` (implementación del modelo)
>    - `resources/js/types/academic/curricular-area-cycle.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo (Pivot)
- **Archivo Principal**: `app/Models/CurricularAreaCycle.php`
- **Tabla**: `curricular_area_cycles`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100065_create_curricular_area_cycles.php`
  - Estructura de la tabla pivot
  - Restricción única en cycle_id + curricular_area_id
  - Claves foráneas con restrictOnDelete

### Modelos Relacionados

- `app/Models/Cycle.php` (belongsTo)
  - Ciclo educativo asociado
  - Clave foránea: `cycle_id`
- `app/Models/CurricularArea.php` (belongsTo)
  - Área curricular asociada
  - Clave foránea: `curricular_area_id`
- `app/Models/TeacherClassroomCurricularAreaCycle.php` (hasMany)
  - Asignaciones docente-aula para esta área-ciclo
  - Clave foránea: `curricular_area_cycle_id`
- `app/Models/Competency.php` (hasMany)
  - Competencias definidas para esta área-ciclo
  - Clave foránea: `curricular_area_cycle_id`
- `app/Models/Classroom.php` (belongsToMany)
  - Aulas donde se enseña esta área-ciclo
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
- `app/Models/Teacher.php` (belongsToMany)
  - Docentes que enseñan esta área-ciclo
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`

### Tipos TypeScript

- `resources/js/types/academic/curricular-area-cycle.d.ts`
  - `type CurricularAreaCycle`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `curricular_area_cycles`
- **Campos Clave**:
  - `id`: bigint - Identificador único de la relación
  - `cycle_id`: bigint - ID del ciclo educativo
  - `curricular_area_id`: bigint - ID del área curricular
  - `timestamps()`: created_at, updated_at

### Índices y Restricciones

- Unique constraint: `['cycle_id', 'curricular_area_id']` - evita duplicados
- Foreign key `cycle_id`: referencia a `cycles.id` con `restrictOnDelete`
- Foreign key `curricular_area_id`: referencia a `curricular_areas.id` con `restrictOnDelete`

### Relaciones

- **Relación con Cycle**:
  - Tipo: belongsTo
  - Clave foránea: `cycle_id`
  - Comportamiento en cascada: restrict
- **Relación con CurricularArea**:
  - Tipo: belongsTo
  - Clave foránea: `curricular_area_id`
  - Comportamiento en cascada: restrict
- **Relación con TeacherClassroomCurricularAreaCycle**:
  - Tipo: hasMany
  - Clave foránea: `curricular_area_cycle_id`
  - Comportamiento en cascada: delete
- **Relación con Competency**:
  - Tipo: hasMany
  - Clave foránea: `curricular_area_cycle_id`
  - Comportamiento en cascada: delete
- **Relación con Classroom**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
  - Campos pivot: `teacher_id`, `academic_year`
- **Relación con Teacher**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
  - Campos pivot: `classroom_id`, `academic_year`

## 🔄 Flujo de Datos

### Asociación de Área Curricular a Ciclo

1. El administrador asocia un área curricular con un ciclo educativo
2. Se crea un registro en `curricular_area_cycles`
3. Esta relación permite definir competencias específicas para esa combinación

### Definición de Competencias

1. Una vez creada la relación área-ciclo, se pueden crear competencias
2. Las competencias se asocian al `curricular_area_cycle_id`
3. Las competencias agrupan capacidades específicas

### Asignación Docente-Aula

1. Se crea un registro en `teacher_classroom_curricular_area_cycles` referenciando el `curricular_area_cycle_id`
2. Esto asigna un docente a enseñar esa área específica en un ciclo específico en un aula específica

### Consultas Comunes

- Obtener áreas de un ciclo: `$cycle->curricularAreas`
- Obtener ciclos de un área: `$curricularArea->cycles`
- Obtener competencias de un área-ciclo: `$curricularAreaCycle->competencies`
- Obtener aulas de un área-ciclo: `$curricularAreaCycle->classrooms`

## 🔍 Ejemplo de Uso

```typescript
export type CurricularAreaCycle = {
  id: number
  cycle_id: number
  curricular_area_id: number
  created_at: string
  updated_at: string

  // Relaciones
  cycle?: Cycle
  curricular_area?: CurricularArea
  competencies?: Competency[]
  classrooms?: Classroom[]
  teachers?: Teacher[]
}
```

## ⚙️ Configuración del Modelo

### Fillable

Los campos que pueden ser asignados masivamente:

- `cycle_id`
- `curricular_area_id`

## ⚠️ Consideraciones

- Es una tabla pivot con modelo propio para permitir relaciones adicionales
- La combinación cycle_id + curricular_area_id es única
- Usa `restrictOnDelete` para evitar eliminar ciclos o áreas curriculares que tienen relaciones activas
- Es el punto central para definir competencias por área y ciclo
- Permite asignaciones docente-aula específicas por área-ciclo
