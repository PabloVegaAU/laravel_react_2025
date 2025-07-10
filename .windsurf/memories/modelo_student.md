# 🎓 Modelo Student

## 📌 Ubicación
- **Modelo**: `app/Models/Student.php`
- **Migración**: `database/migrations/2025_06_22_100030_create_students_table.php`
- **Controladores**:
  - `app/Http/Controllers/Student/ProfileController.php`
  - `app/Http/Controllers/Student/DashboardController.php`
- **Recursos API**: `app/Http/Resources/Student/`
- **Vistas React**: `resources/js/pages/student/`
- **TypeScript**: `resources/js/types/user/student.d.ts`

## 📝 Descripción
El modelo `Student` extiende el modelo `User` para representar a los estudiantes en el sistema educativo. Gestiona información académica, progreso, recompensas y personalización del perfil. Utiliza `SoftDeletes` para borrado lógico y mantiene un registro completo del progreso del estudiante, incluyendo experiencia, puntos y logros.

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `students`

#### 🔑 Claves
- **Primaria**: `user_id` (clave foránea a `users.id`)
- **Foráneas**:
  - `level_id` → `levels(id)`
  - `range_id` → `ranges(id)`
- **Índices**:
  - Índices en claves foráneas
  - Índices para búsquedas frecuentes

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| user_id | bigint | No | - | Clave foránea a users (también es clave primaria) |
| level_id | bigint | Sí | null | Referencia al nivel actual del estudiante |
| range_id | bigint | Sí | null | Referencia al rango actual del estudiante |
| entry_date | date | No | - | Fecha de ingreso a la institución |
| status | enum | No | 'active' | Estado del estudiante (active, inactive, graduated, withdrawn, suspended) |
| experience_achieved | decimal(10,2) | No | 0.00 | Experiencia total acumulada |
| points_store_achieved | decimal(10,2) | No | 0.00 | Puntos de tienda acumulados |
| points_store | decimal(10,2) | No | 0.00 | Puntos de tienda disponibles |
| graduation_date | date | Sí | null | Fecha de graduación (si aplica) |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de última actualización |
| deleted_at | timestamp | Sí | NULL | Fecha de eliminación lógica (soft delete) |

#### Comentarios
- La tabla utiliza eliminación lógica (soft deletes)
- La relación con users usa eliminación en cascada
- Los campos de puntos y experiencia son siempre positivos (unsigned)

## 🤝 Relaciones

### user (BelongsTo)
- **Método**: `user()`
- **Modelo**: `User`
- **Clave foránea**: `user_id`
- **Tipo**: `BelongsTo`
- **Descripción**: Relación con el modelo User al que pertenece este estudiante

### level (BelongsTo)
- **Método**: `level()`
- **Modelo**: `Level`
- **Clave foránea**: `level_id`
- **Tipo**: `BelongsTo`
- **Descripción**: Nivel actual del estudiante en el sistema

### range (BelongsTo)
- **Método**: `range()`
- **Modelo**: `Range`
- **Clave foránea**: `range_id`
- **Tipo**: `BelongsTo`
- **Descripción**: Rango actual del estudiante

### enrollments (HasMany)
- **Método**: `enrollments()`
- **Modelo**: `Enrollment`
- **Clave foránea**: `student_id`
- **Tipo**: `HasMany`
- **Descripción**: Matrículas del estudiante en diferentes períodos académicos
- **Modelo**: `Level`
- **Clave foránea**: `level_id`
- **Descripción**: Nivel actual del estudiante

### range (BelongsTo)
- **Modelo**: `Range`
- **Clave foránea**: `range_id`
- **Descripción**: Rango actual del estudiante

### enrollments (HasMany)
- **Modelo**: `Enrollment`
- **Clave foránea**: `student_id`
- **Descripción**: Matrículas del estudiante

### classrooms (BelongsToMany)
- **Modelo**: `Classroom`
- **Tabla intermedia**: `enrollments`
- **Claves**: 
  - `student_id` (local)
  - `classroom_id` (foránea)
- **Descripción**: Aulas a las que está asignado el estudiante

### applicationForms (HasMany)
- **Modelo**: `ApplicationForm`
- **Clave foránea**: `student_id`
- **Descripción**: Formularios de aplicación del estudiante

### applicationFormResponses (HasMany)
- **Modelo**: `ApplicationFormResponse`
- **Clave foránea**: `student_id`
- **Descripción**: Respuestas a formularios

### storeRewards (BelongsToMany)
- **Modelo**: `StoreReward`
- **Tabla intermedia**: `student_store_rewards`
- **Campos adicionales**: 
  - `status`
  - `redeemed_at`
- **Descripción**: Recompensas canjeadas por el estudiante

### avatars (BelongsToMany)
- **Modelo**: `Avatar`
- **Tabla intermedia**: `student_avatars`
- **Campos adicionales**: 
  - `is_active`
- **Descripción**: Avatares desbloqueados por el estudiante

### backgrounds (BelongsToMany)
- **Modelo**: `Background`
- **Tabla intermedia**: `student_backgrounds`
- **Campos adicionales**: 
  - `is_active`
- **Descripción**: Fondos de perfil desbloqueados

### achievements (BelongsToMany)
- **Modelo**: `Achievement`
- **Tabla intermedia**: `student_achievements`
- **Descripción**: Logros desbloqueados

## 🛠️ Métodos

### activeAvatar()
- **Retorna**: `Avatar|null`
- **Descripción**: Obtiene el avatar activo del estudiante

### activeBackground()
- **Retorna**: `Background|null`
- **Descripción**: Obtiene el fondo activo del estudiante

### setActiveAvatar(Avatar $avatar)
- **Retorna**: `void`
- **Descripción**: Establece un avatar como activo

### setActiveBackground(Background $background)
- **Retorna**: `void`
- **Descripción**: Establece un fondo como activo

### addExperience(float $amount)
- **Retorna**: `void`
- **Descripción**: Añade experiencia al estudiante

### addPoints(float $amount)
- **Retorna**: `void`
- **Descripción**: Añade puntos de tienda

### spendPoints(float $amount)
- **Retorna**: `bool`
- **Descripción**: Gasta puntos de tienda

### scopeActive($query)
- **Retorna**: `Builder`
- **Descripción**: Filtra estudiantes activos

### scopeInactive($query)
- **Retorna**: `Builder`
- **Descripción**: Filtra estudiantes inactivos

### scopeGraduated($query)
- **Retorna**: `Builder`
- **Descripción**: Filtra estudiantes graduados

## 📦 Tipos TypeScript

### Student Type
```typescript
/**
 * Representa un estudiante en el sistema
 * Extiende los tipos User y Profile con información específica de estudiante
 */
export type Student = User &
  Profile & {
    // Relaciones con Level y Range
    level?: Level;
    range?: Range;
    experience_points?: number;
  }
```

### Level Type
```typescript
/**
 * Representa un nivel de estudiante en el sistema
 */
export type Level = {
  /** Identificador único del nivel */
  id: number;

  /** Número del nivel */
  level: number;

  /** Experiencia requerida para alcanzar este nivel */
  experience_required: number;

  /** Descripción opcional del nivel */
  description?: string | null;

  // Marcas de tiempo
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
```

### Range Type
```typescript
/**
 * Representa un rango de estudiante en el sistema
 */
export type Range = {
  /** Identificador único del rango */
  id: number;

  /** Nombre del rango */
  name: string;

  /** Nivel requerido para alcanzar este rango */
  level_required: number;

  /** Código de color del rango */
  color: string;

  /** URL de la imagen del rango */
  image_url: string;

  /** Descripción del rango */
  description?: string | null;

  // Marcas de tiempo
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
```

## 🚀 Uso en React

### Perfil del Estudiante
```typescript
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Profile() {
  const { student } = usePage<PageProps>().props.auth;
  
  return (
    <StudentLayout>
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-6">
            {student.active_avatar && (
              <img 
                src={student.active_avatar.image_url} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {student.user.name}
              </h1>
              <div className="text-gray-600">
                Nivel {student.level?.name || 'Sin asignar'}
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span>{student.points_store} puntos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateExperiencePercentage(student)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {student.experience_achieved} EXP
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de logros */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Logros</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {student.achievements?.map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="text-sm font-medium">{achievement.name}</div>
              </div>
            ))}
            {(!student.achievements || student.achievements.length === 0) && (
              <p className="text-gray-500">Aún no has desbloqueado logros</p>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
```

### Actualización de Perfil
```typescript
import { useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function EditProfile() {
  const { student } = usePage().props.auth;
  
  const { data, setData, put, processing, errors } = useForm({
    bio: student.bio || '',
    avatar_id: student.active_avatar?.id || null,
    background_id: student.active_background?.id || null,
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('student.profile.update'));
  };
  
  return (
    <StudentLayout>
      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personalización</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <div className="grid grid-cols-4 gap-4">
              {student.avatars?.map((avatar) => (
                <label 
                  key={avatar.id}
                  className={`p-2 border-2 rounded-lg cursor-pointer transition-colors ${
                    data.avatar_id === avatar.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="avatar_id"
                    value={avatar.id}
                    checked={data.avatar_id === avatar.id}
                    onChange={() => setData('avatar_id', avatar.id)}
                    className="sr-only"
                  />
                  <img 
                    src={avatar.image_url} 
                    alt={avatar.name}
                    className="w-16 h-16 mx-auto"
                  />
                  <div className="text-center mt-2 text-sm">
                    {avatar.name}
                  </div>
                </label>
              ))}
            </div>
            {errors.avatar_id && (
              <p className="mt-1 text-sm text-red-600">{errors.avatar_id}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>
    </StudentLayout>
  );
}
```

## 🔒 Seguridad

### Reglas de Acceso
- Solo usuarios con rol 'admin' pueden crear o modificar registros de estudiantes
- Los estudiantes solo pueden ver y modificar su propia información
- Los profesores pueden ver información básica de sus estudiantes
- Se validan los permisos mediante políticas de Laravel

### Validaciones
- El `user_id` debe ser único en la tabla students
- La fecha de ingreso es obligatoria y debe ser una fecha válida
- Los campos de experiencia y puntos deben ser números positivos
- El estado debe ser uno de los valores permitidos

### Auditoría
- Se registran todos los cambios importantes en el sistema de auditoría
- Se mantiene un historial de cambios de nivel y rango
- Se pueden generar reportes de progreso académico

### Eliminación Segura
- Se utiliza soft delete para mantener la integridad referencial
- Los registros eliminados se pueden restaurar si es necesario
- Se mantiene la relación con el usuario incluso después de la eliminación

## 📝 Buenas Prácticas
1. **Validación**: Usar Form Requests para validar la creación/actualización
2. **Autorización**: Implementar políticas para controlar el acceso
3. **Rendimiento**: Cargar relaciones con `with()` cuando sea necesario
4. **Transacciones**: Usar transacciones para operaciones atómicas
5. **Eventos**: Escuchar eventos para lógica de negocio compleja
