# 📚 CurricularArea

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100060_create_curricular_areas_table.php` (estructura de base de datos)
>    - `app/Models/CurricularArea.php` (implementación del modelo)
>    - `resources/js/types/academic/curricular-area.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/CurricularArea.php`
- **Tabla**: `curricular_areas`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100060_create_curricular_areas_table.php`
  - Estructura de la tabla
  - Campos de color para representación visual

### Modelos Relacionados

- `app/Models/ApplicationForm.php` (hasMany)
  - Formularios de evaluación en esta área
  - Clave foránea: `curricular_area_id`
- `app/Models/CurricularAreaCycle.php` (hasMany)
  - Asociaciones con ciclos educativos
  - Clave foránea: `curricular_area_id`
- `app/Models/Classroom.php` (belongsToMany)
  - Aulas donde se enseña esta área
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
- `app/Models/Teacher.php` (belongsToMany)
  - Docentes que enseñan esta área
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
- `app/Models/Cycle.php` (belongsToMany)
  - Ciclos donde se enseña esta área
  - Tabla pivot: `curricular_area_cycles`
- `app/Models/Competency.php` (hasManyThrough)
  - Competencias de esta área
  - A través de: `CurricularAreaCycle`
- `app/Models/TeacherClassroomCurricularAreaCycle.php` (hasManyThrough)
  - Asignaciones docente-aula-área
  - A través de: `CurricularAreaCycle`

### Tipos TypeScript

- `resources/js/types/academic/curricular-area.d.ts`
  - `type CurricularArea`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `curricular_areas`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `name`: string - Nombre del área curricular
  - `description`: text (nullable) - Descripción del área curricular
  - `color`: string(50) - Código de color para representación visual
  - `timestamps()`: created_at, updated_at

### Relaciones

- **Relación con ApplicationForm**:
  - Tipo: hasMany
  - Clave foránea: `curricular_area_id`
  - Comportamiento en cascada: delete
- **Relación con CurricularAreaCycle**:
  - Tipo: hasMany
  - Clave foránea: `curricular_area_id`
  - Comportamiento en cascada: delete
- **Relación con Classroom**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
  - Campo pivot: `teacher_id`
- **Relación con Teacher**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
  - Campos pivot: `classroom_id`, `academic_year`
- **Relación con Cycle**:
  - Tipo: belongsToMany
  - Tabla pivot: `curricular_area_cycles`
  - Incluye timestamps
- **Relación con Competency**:
  - Tipo: hasManyThrough
  - A través de: `CurricularAreaCycle`
- **Relación con TeacherClassroomCurricularAreaCycle**:
  - Tipo: hasManyThrough
  - A través de: `CurricularAreaCycle`

## 🔄 Flujo de Datos

### Creación de Áreas Curriculares

1. El administrador crea un nuevo área curricular con nombre, descripción y color
2. El área se guarda en la base de datos
3. Se pueden asociar ciclos educativos a través de `curricular_area_cycles`

### Asociación con Ciclos

1. Se crea un registro en `curricular_area_cycles` vinculando el área con un ciclo
2. A través de esta relación, se pueden definir competencias específicas para el ciclo

### Asignación a Aulas y Docentes

1. Se crea un registro en `teacher_classroom_curricular_area_cycles` vinculando área, aula y docente
2. El docente queda asignado a enseñar esa área en ese aula específico

### Consultas Comunes

- Obtener todas las áreas curriculares: `CurricularArea::all()`
- Obtener áreas de un ciclo: `$cycle->curricularAreas`
- Obtener áreas que enseña un docente: `$teacher->curricularAreas`
- Obtener áreas de un aula: `$classroom->curricularAreas`

## 🔍 Ejemplo de Uso

```typescript
export type CurricularArea = BaseEntity & {
  name: string
  description: string
  color: string

  // Relaciones
  competencies?: Competency[]
  application_forms?: ApplicationForm[]
  cycles?: Cycle[]
  classrooms?: Classroom[]
  teachers?: Teacher[]
  curricular_area_cycles?: CurricularAreaCycle[]
  teacher_classroom_curricular_area_cycles?: TeacherClassroomCurricularAreaCycle[]
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

- `name`
- `description`
- `color`

## ⚠️ Consideraciones

- Las áreas curriculares son la base para organizar el plan de estudios
- El color se usa para representación visual en la interfaz
- La relación con ciclos es muchos a muchos a través de `CurricularAreaCycle`
- Las competencias se definen por área curricular y ciclo
- La asignación docente-aula-área permite especificar qué docente enseña qué área en qué aula
