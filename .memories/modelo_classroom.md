# 📚 Classroom

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100120_create_classrooms_table.php` (estructura de base de datos)
>    - `app/Models/Classroom.php` (implementación del modelo)
>    - `resources/js/types/academic/classroom.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Classroom.php`
- **Tabla**: `classrooms`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100120_create_classrooms_table.php`
  - Estructura de la tabla
  - Índice compuesto en level, grade, section
  - Soft deletes

### Modelos Relacionados

- `app/Models/Enrollment.php` (hasMany)
  - Matrículas en este aula
  - Clave foránea: `classroom_id`
- `app/Models/TeacherClassroomCurricularAreaCycle.php` (hasMany)
  - Asignaciones docente-aula-área
  - Clave foránea: `classroom_id`
- `app/Models/LearningSession.php` (hasMany)
  - Sesiones de aprendizaje en este aula
  - Clave foránea: `classroom_id`
- `app/Models/ApplicationForm.php` (hasMany)
  - Formularios de evaluación en este aula
  - Clave foránea: `classroom_id`
- `app/Models/Teacher.php` (belongsToMany)
  - Docentes asignados al aula
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
- `app/Models/Student.php` (belongsToMany)
  - Estudiantes matriculados en el aula
  - Tabla pivot: `enrollments`
- `app/Models/CurricularAreaCycle.php` (belongsToMany)
  - Áreas curriculares asignadas al aula
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`

### Tipos TypeScript

- `resources/js/types/academic/classroom.d.ts`
  - `type Classroom`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `classrooms`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `grade`: string(10) - Grado académico (ej: 1st, 2nd)
  - `section`: string(10) - Sección del grado (ej: A, B, C)
  - `level`: enum - Nivel educativo ('primary', 'secondary')
  - `timestamps()`: created_at, updated_at, deleted_at

### Índices

- `idx_classroom_level_grade_section`: Índice compuesto en `level`, `grade`, y `section`

### Relaciones

- **Relación con Enrollment**:
  - Tipo: hasMany
  - Clave foránea: `classroom_id`
  - Comportamiento en cascada: delete
- **Relación con TeacherClassroomCurricularAreaCycle**:
  - Tipo: hasMany
  - Clave foránea: `classroom_id`
  - Comportamiento en cascada: delete
- **Relación con LearningSession**:
  - Tipo: hasMany
  - Clave foránea: `classroom_id`
  - Comportamiento en cascada: delete
- **Relación con ApplicationForm**:
  - Tipo: hasMany
  - Clave foránea: `classroom_id`
  - Comportamiento en cascada: delete
- **Relación con Teacher**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`
- **Relación con Student**:
  - Tipo: belongsToMany
  - Tabla pivot: `enrollments`
- **Relación con CurricularAreaCycle**:
  - Tipo: belongsToMany
  - Tabla pivot: `teacher_classroom_curricular_area_cycles`

## 🔄 Flujo de Datos

### Creación de Aulas

1. El administrador crea un nuevo aula con grado, sección y nivel
2. El aula se guarda en la base de datos
3. Se pueden asignar docentes a través de `teacher_classroom_curricular_area_cycles`

### Matriculación de Estudiantes

1. Se crea un registro en `enrollments` vinculando el estudiante con el aula
2. El estudiante queda asociado al aula a través de la relación belongsToMany

### Asignación de Docentes

1. Se crea un registro en `teacher_classroom_curricular_area_cycles` vinculando docente, aula y área curricular
2. El docente queda asociado al aula a través de la relación belongsToMany

### Consultas Comunes

- Obtener aulas por nivel: `Classroom::where('level', 'primary')->get()`
- Obtener estudiantes de un aula: `$classroom->students`
- Obtener docentes de un aula: `$classroom->teachers`
- Obtener sesiones de aprendizaje de un aula: `$classroom->learningSessions`

## 🔍 Ejemplo de Uso

```typescript
export type Classroom = BaseEntity & {
  grade: string
  section: string
  level: 'primary' | 'secondary'

  // Relaciones
  teachers?: Teacher[]
  enrollments?: Enrollment[]
  students?: Student[]
  teacherClassroomCurricularAreaCycles?: TeacherClassroomCurricularAreaCycle[]
  curricularAreaCycles?: CurricularAreaCycle[]
  learningSessions?: LearningSession[]
  applicationForms?: ApplicationForm[]
}
```

## ⚙️ Configuración del Modelo

### Casts

- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

### Dates

- `created_at`
- `updated_at`
- `deleted_at`

### Fillable

Los campos que pueden ser asignados masivamente:

- `grade`
- `section`
- `level`

## ⚠️ Consideraciones

- El campo `level` es un enum que solo acepta 'primary' o 'secondary'
- El índice compuesto en `level`, `grade`, y `section` permite búsquedas eficientes
- Usa soft deletes para permitir recuperación de aulas eliminadas
- Las aulas son el punto central para organizar matrículas y asignaciones docentes
- La relación con docentes incluye áreas curriculares específicas
