# 📚 TeacherClassroomCurricularAreaCycle

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php` (estructura de base de datos)
>    - `app/Models/TeacherClassroomCurricularAreaCycle.php` (implementación del modelo)
>    - `resources/js/types/academic/teacher-classroom-curricular-area-cycle.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo (Pivot)
- **Archivo Principal**: `app/Models/TeacherClassroomCurricularAreaCycle.php`
- **Tabla**: `teacher_classroom_curricular_area_cycles`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php`
  - Estructura de la tabla pivot
  - Índices compuestos para búsquedas eficientes
  - Restricción única en teacher_id + classroom_id + curricular_area_cycle_id + academic_year
  - Claves foráneas con restrictOnDelete

### Modelos Relacionados

- `app/Models/Teacher.php` (belongsTo)
  - Docente asignado
  - Clave foránea: `teacher_id` (referenciando `user_id` en Teacher)
- `app/Models/Classroom.php` (belongsTo)
  - Aula asignada
  - Clave foránea: `classroom_id`
- `app/Models/CurricularAreaCycle.php` (belongsTo)
  - Área-ciclo asignado
  - Clave foránea: `curricular_area_cycle_id`
- `app/Models/LearningSession.php` (hasMany)
  - Sesiones de aprendizaje creadas por esta asignación
  - Clave foránea: `teacher_classroom_curricular_area_cycle_id`

### Tipos TypeScript

- `resources/js/types/academic/teacher-classroom-curricular-area-cycle.d.ts`
  - `interface TeacherClassroomCurricularAreaCycle`
  - `type CreateTeacherClassroomCurricularAreaCycle`
  - `type UpdateTeacherClassroomCurricularAreaCycle`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `teacher_classroom_curricular_area_cycles`
- **Campos Clave**:
  - `id`: bigint - Identificador único de la asignación
  - `teacher_id`: bigint - Referencia al profesor (user_id)
  - `classroom_id`: bigint - Referencia al aula
  - `curricular_area_cycle_id`: bigint - Referencia al área curricular en un ciclo específico
  - `academic_year`: year - Año académico de la asignación
  - `timestamps()`: created_at, updated_at

### Índices

- `idx_tcca_teacher`: Índice en `teacher_id`
- `idx_tcca_classroom`: Índice en `classroom_id`
- `idx_tcca_curricular_area_cycle`: Índice en `curricular_area_cycle_id`
- `idx_tcca_academic_year`: Índice en `academic_year`
- `idx_tcca_teacher_year`: Índice compuesto en `teacher_id` y `academic_year`

### Restricciones

- Unique constraint: `['teacher_id', 'classroom_id', 'curricular_area_cycle_id', 'academic_year']` - evita duplicados de asignación

### Relaciones

- **Relación con Teacher**:
  - Tipo: belongsTo
  - Clave foránea: `teacher_id` (referenciando `user_id` en Teacher)
  - Comportamiento en cascada: restrict
- **Relación con Classroom**:
  - Tipo: belongsTo
  - Clave foránea: `classroom_id`
  - Comportamiento en cascada: restrict
- **Relación con CurricularAreaCycle**:
  - Tipo: belongsTo
  - Clave foránea: `curricular_area_cycle_id`
  - Comportamiento en cascada: restrict
- **Relación con LearningSession**:
  - Tipo: hasMany
  - Clave foránea: `teacher_classroom_curricular_area_cycle_id`
  - Comportamiento en cascada: delete

## 🔄 Flujo de Datos

### Asignación Docente-Aula-Área

1. El administrador selecciona un docente, un aula y un área-ciclo
2. Especifica el año académico
3. Se crea el registro de asignación
4. El docente queda asignado a enseñar esa área en ese aula durante ese año

### Creación de Sesiones de Aprendizaje

1. El docente puede crear sesiones de aprendizaje basadas en su asignación
2. Las sesiones se asocian al registro de asignación
3. Esto permite rastrear qué sesiones corresponden a qué asignación específica

### Consultas Comunes

- Obtener asignaciones de un docente: `$teacher->teacherClassroomCurricularAreaCycles`
- Obtener asignaciones de un aula: `$classroom->teacherClassroomCurricularAreaCycles`
- Obtener asignaciones de un área-ciclo: `$curricularAreaCycle->teacherClassroomCurricularAreaCycles`
- Obtener asignaciones por año académico: `TeacherClassroomCurricularAreaCycle::where('academic_year', 2025)->get()`

## 🔍 Ejemplo de Uso

```typescript
export interface TeacherClassroomCurricularAreaCycle {
  id: number
  teacher_id: number
  classroom_id: number
  curricular_area_cycle_id: number
  academic_year: number
  created_at: string
  updated_at: string

  // Relaciones
  teacher?: Teacher
  classroom?: Classroom
  curricular_area_cycle?: CurricularAreaCycle
  curricular_area?: CurricularAreaCycle['curricular_area']
  application_forms?: ApplicationForm[]
  learning_sessions?: LearningSession[]
}

export type CreateTeacherClassroomCurricularAreaCycle = Omit<
  TeacherClassroomCurricularAreaCycle,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'teacher'
  | 'classroom'
  | 'curricular_area_cycle'
  | 'curricular_area'
  | 'application_forms'
  | 'learning_sessions'
>

export type UpdateTeacherClassroomCurricularAreaCycle = Partial<CreateTeacherClassroomCurricularAreaCycle>
```

## ⚙️ Configuración del Modelo

### Casts

- `academic_year`: `integer`
- `created_at`: `datetime`
- `updated_at`: `datetime`

### Fillable

Los campos que pueden ser asignados masivamente:

- `teacher_id`
- `classroom_id`
- `curricular_area_cycle_id`
- `academic_year`

## ⚠️ Consideraciones

- Es una tabla pivot con modelo propio para permitir relaciones adicionales
- La combinación teacher_id + classroom_id + curricular_area_cycle_id + academic_year es única
- Usa `restrictOnDelete` para evitar eliminar docentes, aulas o áreas-ciclo con asignaciones activas
- Permite asignaciones específicas por año académico
- Es el punto central para organizar la carga docente
- Las sesiones de aprendizaje se asocian a esta asignación
- Permite que un docente enseñe múltiples áreas en múltiples aulas
- Permite que un aula tenga múltiples docentes para diferentes áreas
