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
El modelo `Teacher` extiende el modelo `User` para representar a los profesores en el sistema educativo. Gestiona la relación entre profesores, aulas y áreas curriculares, así como los formularios de aplicación creados por cada profesor. Utiliza soft deletes para mantener un historial de profesores eliminados.

## 🔒 Seguridad

### Reglas de Acceso
- Solo usuarios con rol 'admin' pueden crear o modificar profesores
- Los profesores solo pueden ver y gestionar sus propias aulas y contenidos
- Se validan los permisos para cada acción mediante políticas

### Validaciones
- El `user_id` debe ser único en la tabla teachers
- El estado debe ser uno de los valores permitidos
- Se requiere un usuario válido para crear un profesor

### Auditoría
- Se registran los cambios en el sistema de auditoría
- Se mantiene el historial de modificaciones
- Se puede rastrear la autoría de los cambios

### Eliminación Segura
- Se utiliza soft delete para mantener la integridad referencial
- Los registros eliminados se pueden restaurar si es necesario
- Se mantiene la relación con el usuario incluso después de la eliminación

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `teachers`

#### 🔑 Claves
- **Primaria**: `user_id` (clave foránea a `users.id`)
- **Índices**:
  - `idx_teacher_status` para búsquedas por estado
  - Clave foránea a `users.id` con eliminación en cascada

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| user_id | bigint | No | - | Clave foránea a users (también es clave primaria) |
| status | enum('active','inactive','on leave','retired') | No | 'active' | Estado actual del profesor |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de última actualización |
| deleted_at | timestamp | Sí | NULL | Fecha de eliminación lógica (soft delete) |

#### Comentarios
- La tabla utiliza eliminación lógica (soft deletes)
- La relación con users usa eliminación en cascada
- El campo status no permite valores nulos y tiene un valor por defecto 'active'

## 🤝 Relaciones

### user (BelongsTo)
- **Método**: `user()`
- **Modelo**: `User`
- **Clave foránea**: `user_id`
- **Tipo**: `BelongsTo`
- **Descripción**: Relación con el modelo User al que pertenece este profesor

### classrooms (BelongsToMany)
- **Método**: `classrooms()`
- **Modelo**: `Classroom`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Claves**: 
  - `teacher_id` (local)
  - `classroom_id` (foránea)
- **Tipo**: `BelongsToMany`
- **Descripción**: Aulas asignadas al profesor a través de la tabla de relación con áreas curriculares y ciclos

### curricularAreas (BelongsToMany)
- **Método**: `curricularAreas()`
- **Modelo**: `CurricularArea`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Claves**:
  - `teacher_id` (local)
  - `curricular_area_id` (foránea)
- **Tipo**: `BelongsToMany`
- **Descripción**: Áreas curriculares que puede enseñar el profesor

### teacherClassroomCurricularAreas (HasMany)
- **Método**: `teacherClassroomCurricularAreas()`
- **Modelo**: `TeacherClassroomCurricularAreaCycle`
- **Clave foránea**: `teacher_id`
- **Tipo**: `HasMany`
- **Descripción**: Relación directa con la tabla de asignación de aulas y áreas curriculares

### applicationForms (HasMany)
- **Método**: `applicationForms()`
- **Modelo**: `ApplicationForm`
- **Clave foránea**: `teacher_id`
- **Tipo**: `HasMany`
- **Descripción**: Formularios de aplicación creados por este profesor

### curricularAreas (BelongsToMany)
- **Modelo**: `CurricularArea`
- **Tabla intermedia**: `teacher_classroom_curricular_area_cycles`
- **Clave foránea**: `curricular_area_cycle_id`
- **Descripción**: Áreas curriculares que el profesor puede enseñar

### teacherAssignments (HasMany)
- **Modelo**: `TeacherClassroomCurricularAreaCycle`
- **Clave foránea**: `teacher_id`
- **Descripción**: Asignaciones completas del profesor (aula + área curricular + ciclo)

### applicationForms (HasMany)
- **Modelo**: `ApplicationForm`
- **Clave foránea**: `teacher_id`
- **Descripción**: Formularios de aplicación creados por el profesor

## 🛠️ Métodos

### user()
- **Retorna**: `BelongsTo<User>`
- **Descripción**: Define la relación con el modelo User

### classrooms()
- **Retorna**: `BelongsToMany<Classroom>`
- **Descripción**: Define la relación many-to-many con Classroom a través de teacher_classroom_curricular_area_cycles

### curricularAreas()
- **Retorna**: `BelongsToMany<CurricularArea>`
- **Descripción**: Define la relación many-to-many con CurricularArea a través de teacher_classroom_curricular_area_cycles

### teacherClassroomCurricularAreas()
- **Retorna**: `HasMany<TeacherClassroomCurricularAreaCycle>`
- **Descripción**: Define la relación one-to-many con la tabla de asignación

### applicationForms()
- **Retorna**: `HasMany<ApplicationForm>`
- **Descripción**: Define la relación one-to-many con ApplicationForm a través de la tabla de relación con áreas curriculares y ciclos

## 📦 Tipos TypeScript

### Teacher Interface
```typescript
/**
 * Representa un profesor en el sistema
 */
export interface Teacher {
  /** Referencia al usuario (clave primaria) */
  user_id: number;

  /** Estado del profesor */
  status: TeacherStatus;

  /** Marca de tiempo de creación del registro */
  created_at: string;

  /** Marca de tiempo de la última actualización */
  updated_at: string;

  /** Marca de tiempo de eliminación lógica (si aplica) */
  deleted_at: string | null;

  // Relaciones
  /** Usuario al que pertenece este profesor */
  user?: User;

  /** Aulas asignadas a este profesor */
  classrooms?: Classroom[];
  
  // Relaciones definidas en el modelo
  user?: BelongsTo<User>;
  classrooms?: BelongsToMany<Classroom>;
  curricularAreas?: BelongsToMany<CurricularArea>;
  teacherAssignments?: HasMany<TeacherClassroomCurricularAreaCycle>;
  applicationForms?: HasMany<ApplicationForm>;
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

## 🚀 Uso en React

### Dashboard del Profesor
```typescript
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Dashboard() {
  const { auth } = usePage<PageProps>().props;
  const { user } = auth;
  
  return (
    <TeacherLayout user={user}>
      <div className="space-y-6">
        {/* Resumen de asignaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Aulas</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {user.teacher?.classrooms?.length || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Áreas Curriculares</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {user.teacher?.curricular_areas?.length || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Formularios Activos</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {user.teacher?.application_forms?.filter(f => f.status === 'active').length || 0}
            </p>
          </div>
        </div>
        
        {/* Lista de aulas asignadas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mis Aulas</h2>
          <div className="space-y-4">
            {user.teacher?.classrooms?.length ? (
              user.teacher.classrooms.map((classroom) => (
                <div key={classroom.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium">{classroom.name}</h3>
                  <p className="text-sm text-gray-600">
                    {classroom.level?.name} - {classroom.section}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {classroom.students_count || 0} estudiantes
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tienes aulas asignadas</p>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
```

### Creación de Formulario
```typescript
import { useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function CreateApplicationForm() {
  const { auth } = usePage().props;
  const { classrooms, curricularAreas, questions } = usePage().props;
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    classroom_id: '',
    curricular_area_id: '',
    questions: [] as number[],
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teacher.application-forms.store'));
  };
  
  return (
    <TeacherLayout user={auth.user}>
      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Nuevo Formulario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Formulario
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aula
              </label>
              <select
                value={data.classroom_id}
                onChange={(e) => setData('classroom_id', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un aula</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} - {classroom.section}
                  </option>
                ))}
              </select>
              {errors.classroom_id && (
                <p className="mt-1 text-sm text-red-600">{errors.classroom_id}</p>
              )}
            </div>
          </div>
          
          {/* Más campos del formulario... */}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Guardar Formulario'}
            </button>
          </div>
        </div>
      </form>
    </TeacherLayout>
  );
}
```

## Notas adicionales
- Utiliza SoftDeletes para eliminación lógica
- Relación polimórfica con el modelo User a través del campo user_id
