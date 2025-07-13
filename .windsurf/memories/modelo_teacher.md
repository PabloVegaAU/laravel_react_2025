# 🎓 Modelo Teacher

## 📌 Ubicación
- **Modelo**: `app/Models/Teacher.php`
- **Migración**: `database/migrations/2025_06_22_100040_create_teachers_table.php`
- **Controladores**:
  - `app/Http/Controllers/Teacher/DashboardController.php`
  - `app/Http/Controllers/Teacher/ApplicationFormController.php`
  - `app/Http/Controllers/Teacher/QuestionController.php`
- **Recursos API**: `app/Http/Resources/Teacher/`
- **Vistas React**: `resources/js/pages/teacher/`
- **TypeScript**: `resources/js/types/user/teacher.d.ts`

## 📝 Descripción
El modelo `Teacher` extiende el modelo `User` para representar a los profesores en el sistema educativo. Gestiona la relación entre profesores, aulas, áreas curriculares y ciclos, así como los formularios de aplicación y sesiones de aprendizaje creados por cada profesor. Utiliza soft deletes para mantener un historial de profesores eliminados.

## 🔒 Seguridad

### Reglas de Acceso
- Solo usuarios con rol 'admin' pueden crear o modificar profesores
- Los profesores solo pueden ver y gestionar sus propias aulas y contenidos
- Se validan los permisos para cada acción mediante políticas

### Validaciones
- El `user_id` debe ser único en la tabla teachers
- El estado debe ser uno de los valores permitidos (active, inactive, on leave, retired)
- Se requiere un usuario válido para crear un profesor

### Eliminación Segura
- Se utiliza soft delete para mantener la integridad referencial
- Los registros eliminados se pueden restaurar si es necesario
- Se mantiene la relación con el usuario incluso después de la eliminación

## 🏗️ Estructura del Modelo

### 📦 Propiedades
- **Tabla**: `teachers`
- **Clave primaria**: `user_id` (clave foránea a `users.id`)
- **Incrementing**: `false` (usa user_id como clave primaria)
- **Timestamps**: `true`
- **Soft Deletes**: `true`

### 📋 Atributos
| Atributo | Tipo | Valor por defecto | Descripción |
|----------|------|-------------------|-------------|
| user_id | int | - | ID del usuario (clave foránea a users) |
| status | string | 'active' | Estado del profesor (active, inactive, on leave, retired) |
| created_at | datetime | - | Fecha de creación |
| updated_at | datetime | - | Fecha de última actualización |
| deleted_at | datetime | null | Fecha de eliminación lógica |

### 🎯 Scopes
- **active()**: Filtra profesores activos
- **inactive()**: Filtra profesores inactivos
- **onLeave()**: Filtra profesores en licencia
- **retired()**: Filtra profesores retirados

## 🤝 Relaciones

### user (BelongsTo)
- **Método**: `user()`
- **Retorna**: `BelongsTo<User>`
- **Descripción**: Relación con el modelo User al que pertenece este profesor

### classrooms (BelongsToMany)
- **Método**: `classrooms()`
- **Retorna**: `BelongsToMany<Classroom>`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Datos adicionales**: `academic_year`, `curricular_area_cycle_id`
- **Descripción**: Aulas asignadas al profesor a través de la tabla de relación con áreas curriculares y ciclos

### curricularAreas (BelongsToMany)
- **Método**: `curricularAreas()`
- **Retorna**: `BelongsToMany<CurricularArea>`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Datos adicionales**: `classroom_id`, `academic_year`
- **Usa**: `TeacherClassroomCurricularAreaCycle` como modelo personalizado
- **Descripción**: Áreas curriculares que puede enseñar el profesor

### curricularAreaCycles (BelongsToMany)
- **Método**: `curricularAreaCycles()`
- **Retorna**: `BelongsToMany<CurricularAreaCycle>`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Datos adicionales**: `classroom_id`, `academic_year`
- **Descripción**: Relación con ciclos de áreas curriculares asignados al profesor

### teacherAssignments (HasMany)
- **Método**: `teacherAssignments()`
- **Retorna**: `HasMany<TeacherClassroomCurricularAreaCycle>`
- **Clave foránea**: `teacher_id`
- **Clave local**: `user_id`
- **Descripción**: Asignaciones completas del profesor (aula + área curricular + ciclo)

### applicationForms (HasMany)
- **Método**: `applicationForms()`
- **Retorna**: `HasMany<ApplicationForm>`
- **Clave foránea**: `teacher_id`
- **Clave local**: `user_id`
- **Descripción**: Formularios de aplicación creados por este profesor

### learningSessions (HasMany)
- **Método**: `learningSessions()`
- **Retorna**: `HasMany<LearningSession>`
- **Clave foránea**: `teacher_id`
- **Clave local**: `user_id`
- **Descripción**: Sesiones de aprendizaje creadas por este profesor

## 🛠️ Métodos de Consulta

### active()
- **Tipo**: Scope
- **Parámetros**: `Builder $query`
- **Retorna**: `Builder`
- **Descripción**: Filtra los profesores activos (status = 'active')

### inactive()
- **Tipo**: Scope
- **Parámetros**: `Builder $query`
- **Retorna**: `Builder`
- **Descripción**: Filtra los profesores inactivos (status = 'inactive')

### onLeave()
- **Tipo**: Scope
- **Parámetros**: `Builder $query`
- **Retorna**: `Builder`
- **Descripción**: Filtra los profesores en licencia (status = 'on leave')

### retired()
- **Tipo**: Scope
- **Parámetros**: `Builder $query`
- **Retorna**: `Builder`
- **Descripción**: Filtra los profesores retirados (status = 'retired')

### isActive()
- **Retorna**: `bool`
- **Descripción**: Verifica si el profesor está activo

### isInactive()
- **Retorna**: `bool`
- **Descripción**: Verifica si el profesor está inactivo

### isOnLeave()
- **Retorna**: `bool`
- **Descripción**: Verifica si el profesor está en licencia

### isRetired()
- **Retorna**: `bool`
- **Descripción**: Verifica si el profesor está retirado

## 📦 Tipos TypeScript

### TeacherStatus Type
```typescript
/**
 * Estados posibles de un profesor
 */
type TeacherStatus = 'active' | 'inactive' | 'on leave' | 'retired';

/**
 * Representa un profesor en el sistema
 */
export interface Teacher {
  /** Referencia al usuario (clave primaria) */
  user_id: number;

  /** Estado actual del profesor */
  status: TeacherStatus;

  /** Fecha y hora de creación */
  created_at: string;

  /** Fecha y hora de última actualización */
  updated_at: string;

  /** Fecha de eliminación lógica (soft delete) */
  deleted_at: string | null;

  // Relaciones
  /** Usuario asociado a este profesor */
  user?: User;
  
  /** Aulas asignadas a este profesor */
  classrooms?: Classroom[];
  
  /** Áreas curriculares que puede enseñar */
  curricularAreas?: CurricularArea[];
  
  /** Ciclos de áreas curriculares asignados */
  curricularAreaCycles?: CurricularAreaCycle[];
  
  /** Asignaciones completas (aula + área + ciclo) */
  teacherAssignments?: TeacherClassroomCurricularAreaCycle[];
  
  /** Formularios de aplicación creados */
  applicationForms?: ApplicationForm[];
  
  /** Sesiones de aprendizaje creadas */
  learningSessions?: LearningSession[];
}

/**
 * Interfaz para la tabla intermedia de asignación de profesor
 */
export interface TeacherClassroomCurricularAreaCycle {
  id: number;
  teacher_id: number;
  classroom_id: number;
  curricular_area_cycle_id: number;
  academic_year: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  teacher?: Teacher;
  classroom?: Classroom;
  curricularAreaCycle?: CurricularAreaCycle;
}

// Relación con Classroom a través de TeacherClassroomCurricularAreaCycle
interface TeacherClassroomCurricularAreaCycle {
  id: number;
  teacher_id: number;
  classroom_id: number;
  curricular_area_cycle_id: number;
  academic_year: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  teacher?: Teacher;
  classroom?: Classroom;
  curricularAreaCycle?: {
    id: number;
    curricular_area_id: number;
    cycle_id: number;
    created_at: string;
    updated_at: string;
    curricularArea?: CurricularArea;
    cycle?: Cycle;
  };
  applicationForms?: ApplicationForm[];
}
```

## Notas adicionales
- Utiliza SoftDeletes para eliminación lógica
- Relación polimórfica con el modelo User a través del campo user_id
