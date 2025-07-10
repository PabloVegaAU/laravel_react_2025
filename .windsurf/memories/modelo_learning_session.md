# 🎓 Modelo LearningSession

## 📌 Ubicación
- **Modelo**: `app/Models/LearningSession.php`
- **Migración**: `database/migrations/2025_06_22_100300_create_learning_sessions_table.php`
- **Tabla Pivote**: `database/migrations/2025_06_22_100310_create_learning_session_capabilities_table.php`
- **Controladores**: `app/Http/Controllers/Teacher/LearningSessionController.php`
- **Vistas React**: `resources/js/pages/teacher/session-learning/`
- **TypeScript**: `resources/js/types/learning-session.d.ts`

## 📝 Descripción
El modelo `LearningSession` representa una sesión de aprendizaje dentro del sistema educativo. Está diseñado para que los profesores puedan planificar y gestionar sus clases, vinculando competencias, capacidades y desempeños esperados.

## 🏗️ Estructura de la Base de Datos

### 📊 Tabla: `learning_sessions`

#### 🔑 Claves
- **Primaria**: `id` (bigint autoincremental)
- **Foráneas**:
  - `educational_institution_id` (referencia a `educational_institutions.id`)
  - `teacher_classroom_curricular_area_cycle_id` (referencia a `teacher_classroom_curricular_area_cycles.id`)
  - `competency_id` (referencia a `competencies.id`)
- **Índices**:
  - `idx_learning_sessions_status` (status)
  - `idx_learning_sessions_application_date` (application_date)
  - `idx_learning_sessions_institution` (educational_institution_id)
  - `idx_learning_sessions_competency` (competency_id)

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint | No | Auto | Identificador único |
| name | string | No | - | Nombre de la sesión de aprendizaje |
| purpose_learning | string | No | - | Propósito de aprendizaje de la sesión |
| application_date | date | No | - | Fecha de aplicación de la sesión |
| status | enum('draft','active','inactive') | No | 'draft' | Estado de la sesión: borrador, activa, inactiva |
| performances | text | No | - | Desempeños esperados en la sesión |
| start_sequence | text | No | - | Secuencia de inicio de la sesión |
| end_sequence | text | No | - | Secuencia de cierre de la sesión |
| educational_institution_id | bigint | No | - | Referencia a la institución educativa |
| teacher_classroom_curricular_area_cycle_id | bigint | No | - | Referencia a la asignación de profesor-aula-área-ciclo |
| competency_id | bigint | No | - | Referencia a la competencia asociada |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de actualización |
| deleted_at | timestamp | Sí | NULL | Fecha de eliminación (soft delete) |

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
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint | No | Auto | Identificador único |
| learning_session_id | bigint | No | - | Referencia a la sesión |
| capability_id | bigint | No | - | Referencia a la capacidad |
| created_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de creación |
| updated_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de actualización |

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
  id: number;
  name: string;
  purpose_learning: string;
  application_date: string;
  status: 'draft' | 'active' | 'inactive';
  performances: string;
  start_sequence: string;
  end_sequence: string;
  educational_institution_id: number;
  teacher_classroom_curricular_area_cycle_id: number;
  competency_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones cargadas opcionalmente
  capabilities?: Capability[];
  educational_institution?: EducationalInstitution;
  teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle;
  competency?: Competency;
}

interface LearningSessionCapability {
  id: number;
  learning_session_id: number;
  capability_id: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones cargadas opcionalmente
  learning_session?: LearningSession;
  capability?: Capability;
}
```

## 🚀 Uso en React

### Listado de Sesiones
```tsx
import { Table } from '@/components/organisms/table';
import { LearningSession } from '@/types/learning-session';

interface SessionLearningProps {
  sessions: PaginatedResponse<LearningSession>;
}

export default function SessionLearning({ sessions }: SessionLearningProps) {
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Fecha de Aplicación',
      accessorKey: 'application_date',
      renderCell: (row: LearningSession) => 
        new Date(row.application_date).toLocaleDateString()
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      renderCell: (row: LearningSession) => {
        const statusMap = {
          draft: 'Borrador',
          active: 'Activa',
          inactive: 'Inactiva'
        };
        return statusMap[row.status] || row.status;
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      renderCell: (row: LearningSession) => (
        <div className="flex space-x-2">
          <Link href={`/teacher/session-learning/${row.id}/edit`}>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sesiones de Aprendizaje</h1>
        <Link href="/teacher/session-learning/create">
          <Button>Nueva Sesión</Button>
        </Link>
      </div>
      
      <Table data={sessions} columns={columns} />
    </div>
  );
}
```

## 🔒 Reglas de Negocio

1. **Estados de la Sesión**:
   - `draft`: La sesión está en borrador y no es visible para los estudiantes
   - `active`: La sesión está activa y disponible
   - `inactive`: La sesión ha sido desactivada

2. **Validaciones**:
   - La fecha de aplicación no puede ser anterior a la fecha actual
   - Cada sesión debe tener al menos una capacidad asociada
   - Solo el profesor asignado puede modificar la sesión

3. **Flujo de Trabajo**:
   1. El profesor crea una sesión en estado 'draft'
   2. Agrega capacidades y contenido
   3. Cambia el estado a 'active' cuando está lista
   4. Puede desactivar la sesión cuando ya no esté en uso
