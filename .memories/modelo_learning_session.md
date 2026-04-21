# 🎓 LearningSession

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100300_create_learning_sessions_table.php` (estructura principal)
>    - `database/migrations/2025_06_22_100310_create_learning_session_capabilities_table.php` (relación con capacidades)
>    - `app/Models/LearningSession.php` (implementación del modelo)
>    - `resources/js/types/learning-session/learning-session.d.ts` (tipos TypeScript)

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/LearningSession.php`
- **Tabla**: `learning_sessions`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100300_create_learning_sessions_table.php`
  - Estructura de la tabla principal
  - Relaciones con claves foráneas
  - Índices para búsquedas frecuentes
- `database/migrations/2025_06_22_100310_create_learning_session_capabilities_table.php`
  - Tabla pivote para relación many-to-many con capacidades
  - Índices compuestos para optimización

### Modelos Relacionados

- `app/Models/EducationalInstitution.php` (BelongsTo)
- `app/Models/TeacherClassroomCurricularAreaCycle.php` (BelongsTo)
- `app/Models/Competency.php` (BelongsTo)
- `app/Models/Capability.php` (BelongsToMany)
- `app/Models/ApplicationForm.php` (HasMany)

### Tipos TypeScript

- `resources/js/types/learning-session/learning-session.d.ts`
  - Interfaz `LearningSession` con todos los campos
  - Tipo `LearningSessionStatus` para los estados
  - Interfaces para relaciones anidadas

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla Principal**: `learning_sessions`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `name`: string - Nombre de la sesión
  - `purpose_learning`: text - Propósito de aprendizaje
  - `start_date`: timestamp - Fecha de inicio
  - `end_date`: timestamp - Fecha de fin
  - `status`: enum('scheduled','active','finished','canceled') - Estado actual
  - `registration_status`: enum('active','inactive') - Estado de registro
  - `performances`: text - Desempeños esperados (JSON)
  - `start_sequence`: text - Secuencia de inicio
  - `end_sequence`: text - Secuencia de cierre
  - `timestamps`: created_at, updated_at, deleted_at

### Relaciones

- **educationalInstitution** (BelongsTo):

  - Modelo: `EducationalInstitution`
  - Clave: `educational_institution_id`
  - Comportamiento: restrictOnDelete

- **teacherClassroomCurricularAreaCycle** (BelongsTo):

  - Modelo: `TeacherClassroomCurricularAreaCycle`
  - Clave: `teacher_classroom_curricular_area_cycle_id`
  - Comportamiento: restrictOnDelete

- **competency** (BelongsTo):

  - Modelo: `Competency`
  - Clave: `competency_id`
  - Comportamiento: restrictOnDelete

- **capabilities** (BelongsToMany):

  - Modelo: `Capability`
  - Tabla: `learning_session_capabilities`
  - Comportamiento: cascadeOnDelete

- **applicationForms** (HasMany):
  - Modelo: `ApplicationForm`
  - Clave: `learning_session_id`
  - Comportamiento: cascadeOnDelete

#### 📋 Columnas

| Columna                                    | Tipo      | Nulo | Default           | Descripción                                  |
| ------------------------------------------ | --------- | ---- | ----------------- | -------------------------------------------- |
| id                                         | bigint    | No   | Auto              | Identificador único                          |
| name                                       | string    | No   | -                 | Nombre de la sesión de aprendizaje           |
| purpose_learning                           | text      | No   | -                 | Propósito de aprendizaje de la sesión        |
| application_date                           | date      | No   | -                 | Fecha de aplicación de la sesión             |
| status                                     | enum      | No   | 'draft'           | Estado: draft, active, inactive              |
| performances                               | text      | No   | -                 | Desempeños esperados (JSON)                  |
| start_sequence                             | text      | No   | -                 | Secuencia de inicio de la sesión             |
| end_sequence                               | text      | No   | -                 | Secuencia de cierre de la sesión             |
| educational_institution_id                 | bigint    | No   | -                 | ID de la institución educativa               |
| teacher_classroom_curricular_area_cycle_id | bigint    | No   | -                 | ID de la asignación profesor-aula-área-ciclo |
| competency_id                              | bigint    | No   | -                 | ID de la competencia asociada                |
| created_at                                 | timestamp | No   | CURRENT_TIMESTAMP | Fecha de creación                            |
| updated_at                                 | timestamp | No   | CURRENT_TIMESTAMP | Fecha de actualización                       |
| deleted_at                                 | timestamp | Sí   | NULL              | Fecha de eliminación (soft delete)           |

## 🔄 Relaciones

### educationalInstitution (BelongsTo)

- **Modelo**: `EducationalInstitution`
- **Clave foránea**: `educational_institution_id`
- **Eliminación**: `restrictOnDelete`
- **Descripción**: Institución educativa a la que pertenece la sesión

### teacherClassroomCurricularAreaCycle (BelongsTo)

- **Modelo**: `TeacherClassroomCurricularAreaCycle`
- **Clave foránea**: `teacher_classroom_curricular_area_cycle_id`
- **Eliminación**: `restrictOnDelete`
- **Descripción**: Asignación de profesor-aula-área-ciclo

### competency (BelongsTo)

- **Modelo**: `Competency`
- **Clave foránea**: `competency_id`
- **Eliminación**: `restrictOnDelete`
- **Descripción**: Competencia asociada a la sesión

### capabilities (BelongsToMany)

- **Modelo**: `Capability`
- **Tabla intermedia**: `learning_session_capabilities`
- **Clave foránea**: `learning_session_id`
- **Clave relacionada**: `capability_id`
- **Eliminación**: `cascadeOnDelete`
- **Descripción**: Capacidades asociadas a la sesión

### applicationForms (HasMany)

- **Modelo**: `ApplicationForm`
- **Clave foránea**: `learning_session_id`
- **Eliminación**: `cascadeOnDelete`
- **Descripción**: Formularios de aplicación asociados

## 🛠️ TypeScript Types

### Tipos Básicos

**LearningSessionStatus**: Enumeración que representa los posibles estados de una sesión: 'scheduled', 'active', 'finished', 'canceled'.

### Estructura de Datos de la Sesión de Aprendizaje

**LearningSession**: Interfaz principal que representa una sesión de aprendizaje en el frontend.

**Propiedades principales**:

- `id`: Identificador único (number)
- `educational_institution_id`: ID de la institución educativa (number)
- `teacher_classroom_curricular_area_cycle_id`: ID de la asignación profesor-aula-área-ciclo (number)
- `competency_id`: ID de la competencia asociada (number)
- `name`: Nombre de la sesión (string)
- `purpose_learning`: Propósito de aprendizaje (string)
- `start_date`: Fecha de inicio (string en formato YYYY-MM-DD)
- `end_date`: Fecha de fin (string en formato YYYY-MM-DD)
- `status`: Estado actual (LearningSessionStatus)
- `performances`: Desempeños esperados (string JSON)
- `start_sequence`: Secuencia de inicio (string)
- `end_sequence`: Secuencia de cierre (string)
- `created_at`, `updated_at`, `deleted_at`: Marcas de tiempo

**Relaciones**:

- `educational_institution`: Institución educativa asociada
- `teacher_classroom_curricular_area_cycle`: Asignación completa (profesor/aula/área/ciclo)
- `competency`: Competencia relacionada
- `capabilities`: Capacidades asociadas
- `application_forms`: Formularios de aplicación vinculados

**Métodos de ayuda**:

- `isActive()`: Verifica si la sesión está activa
- `getPerformanceList()`: Devuelve la lista de desempeños
- `getTeacherInfo()`: Obtiene información del profesor

## 📋 Uso y Ejemplos

### Creación de Sesiones

**Propósito**: Crear una nueva sesión de aprendizaje con datos básicos, incluyendo nombre, propósito, fecha de inicio y fin, y secuencias de inicio/cierre.

**Relaciones clave**:

- Debe asociarse a una institución educativa
- Requiere una asignación de profesor-aula-área-ciclo
- Debe vincularse a una competencia específica

### Consultas Comunes

1. **Sesiones Activas**: Filtrar por estado 'active' y fecha futura, incluyendo capacidades y competencia.
2. **Sesiones por Profesor**: Filtrar sesiones asignadas a un profesor específico.
3. **Sesiones por Fecha**: Obtener sesiones para un rango de fechas específico.

### Gestión de Capacidades

**Operaciones soportadas**:

- Añadir capacidades existentes a una sesión
- Actualizar las capacidades asociadas
- Eliminar capacidades de una sesión

## 🔍 Scopes Disponibles

### active()

Filtra las sesiones que están actualmente activas.

### upcoming()

Filtra las sesiones con fecha de inicio igual o posterior a la fecha actual.

### forTeacher(teacherId)

Filtra las sesiones asignadas a un profesor específico, verificando la relación a través de la asignación profesor-aula-área-ciclo.

## 🔄 Eventos

- `creating`: Validar fechas y estados
- `updating`: Registrar cambios importantes
- `deleting`: Verificar restricciones

## 📝 Notas de Implementación

1. **Validaciones**:

   - La fecha de inicio debe ser anterior a la fecha de fin
   - El estado debe ser uno de los permitidos
   - Los IDs de relaciones deben existir

2. **Seguridad**:

   - Verificar permisos antes de crear/editar/eliminar
   - Usar políticas para control de acceso

3. **Rendimiento**:
   - Usar eager loading para relaciones
   - Considerar caché para consultas frecuentes

- `idx_learning_sessions_institution` (educational_institution_id)
- `idx_learning_sessions_competency` (competency_id)

#### 📋 Columnas

| Columna                                    | Tipo                                             | Nulo | Default           | Descripción                                            |
| ------------------------------------------ | ------------------------------------------------ | ---- | ----------------- | ------------------------------------------------------ |
| id                                         | bigint                                           | No   | Auto              | Identificador único                                    |
| name                                       | string                                           | No   | -                 | Nombre de la sesión de aprendizaje                     |
| purpose_learning                           | string                                           | No   | -                 | Propósito de aprendizaje de la sesión                  |
| start_date                                 | timestamp                                        | No   | -                 | Fecha de inicio de la sesión                           |
| end_date                                   | timestamp                                        | No   | -                 | Fecha de fin de la sesión                              |
| status                                     | enum('scheduled','active','finished','canceled') | No   | 'scheduled'       | Estado: scheduled, active, finished, canceled          |
| registration_status                        | enum('active','inactive')                        | No   | 'active'          | Estado de registro: active, inactive                   |
| performances                               | text                                             | No   | -                 | Desempeños esperados en la sesión                      |
| start_sequence                             | text                                             | No   | -                 | Secuencia de inicio de la sesión                       |
| end_sequence                               | text                                             | No   | -                 | Secuencia de cierre de la sesión                       |
| educational_institution_id                 | bigint                                           | No   | -                 | Referencia a la institución educativa                  |
| teacher_classroom_curricular_area_cycle_id | bigint                                           | No   | -                 | Referencia a la asignación de profesor-aula-área-ciclo |
| competency_id                              | bigint                                           | No   | -                 | Referencia a la competencia asociada                   |
| created_at                                 | timestamp                                        | No   | CURRENT_TIMESTAMP | Fecha de creación                                      |
| updated_at                                 | timestamp                                        | No   | CURRENT_TIMESTAMP | Fecha de actualización                                 |
| deleted_at                                 | timestamp                                        | Sí   | NULL              | Fecha de eliminación (soft delete)                     |

### 📊 Tabla: `learning_session_capabilities`

#### 🔑 Claves

- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `learning_session_id` (referencia a `learning_sessions.id`)
  - `capability_id` (referencia a `capabilities.id`)
- **Índices**:
  - `idx_sessions_capabilities_session` (learning_session_id)
  - `idx_sessions_capabilities_capability` (capability_id)
- **Única**: `uq_session_capability` (learning_session_id, capability_id)

#### 📋 Columnas

| Columna             | Tipo      | Nulo | Default           | Descripción               |
| ------------------- | --------- | ---- | ----------------- | ------------------------- |
| id                  | bigint    | No   | Auto              | Identificador único       |
| learning_session_id | bigint    | No   | -                 | Referencia a la sesión    |
| capability_id       | bigint    | No   | -                 | Referencia a la capacidad |
| created_at          | timestamp | No   | CURRENT_TIMESTAMP | Fecha de creación         |
| updated_at          | timestamp | No   | CURRENT_TIMESTAMP | Fecha de actualización    |

## 🤝 Relaciones

### capabilities (BelongsToMany)

- **Modelo**: `Capability`
- **Tabla pivote**: `learning_session_capabilities`
- **Clave foránea**: `capability_id`
- **Clave de sesión**: `learning_session_id`
- **Restricciones**: `restrictOnDelete`
- **Índices**:
  - `idx_sessions_capabilities_session` (learning_session_id)
  - `idx_sessions_capabilities_capability` (capability_id)
  - `uq_session_capability` (learning_session_id, capability_id) - Único
- **Descripción**: Capacidades trabajadas en la sesión

### educationalInstitution (BelongsTo)

- **Modelo**: `EducationalInstitution`
- **Clave foránea**: `educational_institution_id`
- **Restricciones**: `cascadeOnDelete`
- **Índice**: `idx_learning_sessions_institution`
- **Descripción**: Institución educativa a la que pertenece la sesión

### teacherClassroomCurricularAreaCycle (BelongsTo)

- **Modelo**: `TeacherClassroomCurricularAreaCycle`
- **Clave foránea**: `teacher_classroom_curricular_area_cycle_id`
- **Restricciones**: `cascadeOnDelete`
- **Índice**: `idx_learning_sessions_teacher_assignment`
- **Descripción**: Asignación de profesor-aula-área-ciclo que imparte la sesión

### competency (BelongsTo)

- **Modelo**: `Competency`
- **Clave foránea**: `competency_id`
- **Restricciones**: `cascadeOnDelete`
- **Índice**: `idx_learning_sessions_competency`
- **Descripción**: Competencia principal asociada a la sesión

## 🎨 Interfaz TypeScript

```typescript
interface LearningSession {
  id: number
  name: string
  purpose_learning: string
  start_date: string
  end_date: string
  status: 'scheduled' | 'active' | 'finished' | 'canceled'
  registration_status: 'active' | 'inactive'
  performances: string
  start_sequence: string
  end_sequence: string
  educational_institution_id: number
  teacher_classroom_curricular_area_cycle_id: number
  competency_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones cargadas opcionalmente
  capabilities?: Capability[]
  educational_institution?: EducationalInstitution
  teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle
  competency?: Competency
}

interface LearningSessionCapability {
  id: number
  learning_session_id: number
  capability_id: number
  created_at: string
  updated_at: string

  // Relaciones cargadas opcionalmente
  learning_session?: LearningSession
  capability?: Capability
}
```

## 🚀 Uso en React

### Listado de Sesiones

```tsx
import { Table } from '@/components/organisms/table'
import { LearningSession } from '@/types/learning-session'

interface SessionLearningProps {
  sessions: PaginatedResponse<LearningSession>
}

export default function SessionLearning({ sessions }: SessionLearningProps) {
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Fecha de Aplicación',
      accessorKey: 'application_date',
      renderCell: (row: LearningSession) => new Date(row.application_date).toLocaleDateString()
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      renderCell: (row: LearningSession) => {
        const statusMap = {
          scheduled: 'Programada',
          active: 'Activa',
          finished: 'Finalizada',
          canceled: 'Cancelada'
        }
        return statusMap[row.status] || row.status
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      renderCell: (row: LearningSession) => (
        <div className='flex space-x-2'>
          <Link href={`/teacher/session-learning/${row.id}/edit`}>
            <Button variant='outline' size='sm'>
              Editar
            </Button>
          </Link>
          <Button variant='destructive' size='sm' onClick={() => handleDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Sesiones de Aprendizaje</h1>
        <Link href='/teacher/session-learning/create'>
          <Button>Nueva Sesión</Button>
        </Link>
      </div>

      <Table data={sessions} columns={columns} />
    </div>
  )
}
```

## 🔒 Reglas de Negocio

1. **Estados de la Sesión**:

   - `scheduled`: La sesión está programada y aún no ha comenzado
   - `active`: La sesión está activa y disponible
   - `finished`: La sesión ha finalizado (período terminado por tarea programada)
   - `canceled`: La sesión ha sido cancelada

2. **Validaciones**:

   - La fecha de inicio debe ser anterior a la fecha de fin
   - Cada sesión debe tener al menos una capacidad asociada
   - Solo el profesor asignado puede modificar la sesión

3. **Flujo de Trabajo**:
   1. El profesor crea una sesión en estado 'scheduled'
   2. Agrega capacidades y contenido
   3. Cambia el estado a 'active' cuando está lista
   4. Puede finalizar o cancelar la sesión cuando ya no esté en uso

## 📋 Comportamiento de Estados

### Distinción de Estados

- **`finished`**: Período terminado por tarea programada (tarea `learning-sessions:finalize`)
- **`finalized`**: Estado aplicado a ApplicationFormResponse (respuesta bloqueada sin completar por estudiante)

### Inactivación Manual

Cuando se cambia el `registration_status` a `inactive` manualmente:

- **LearningSession**: NO desasigna ApplicationForm relacionado
  - ApplicationForm mantiene `learning_session_id`
  - LearningSession cambia `status` a `canceled`
  - LearningSession cambia `registration_status` a `inactive`

### Restricciones de Edición

- **Solo permitido en estado `scheduled`**:
  - Backend: `LearningSessionController::edit()` y `update()` validan que status sea 'scheduled'
  - Frontend: `canEditLearningSession()` solo retorna true si status es 'scheduled'
- **En estado `active`**: No se permite editar (botón de edición oculto)

### Tarea Programada de Finalización

Comando `learning-sessions:finalize`:

- Cambia `status` a `finished` en LearningSession y ApplicationForm
- **NO cambia `registration_status`** (este solo se cambia manualmente)
- Cambia ApplicationFormResponse de `pending`/`in progress` a `finalized`
