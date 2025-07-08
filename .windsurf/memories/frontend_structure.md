# Estructura del Frontend

## Descripción General
La aplicación frontend está construida con React y utiliza Inertia.js para la integración con Laravel. La estructura sigue un patrón modular y está organizada en directorios por funcionalidad.

## Estructura de Directorios

```
resources/
├── css/                  # Estilos globales
└── js/
    ├── components/       # Componentes reutilizables
    │   ├── organisms/    # Componentes complejos
    │   ├── ui/           # Componentes de interfaz de usuario
    │   └── ...
    ├── constants/        # Constantes y configuraciones
    ├── hooks/            # Custom hooks de React
    ├── layouts/          # Layouts principales
    │   ├── app/          # Layout de la aplicación
    │   ├── auth/         # Layout de autenticación
    │   └── settings/     # Layout de configuración
    ├── pages/            # Páginas de la aplicación
    │   ├── admin/        # Rutas de administrador
    │   ├── auth/         # Autenticación
    │   ├── student/      # Área de estudiantes
    │   └── teacher/      # Área de docentes
    ├── services/         # Servicios API
    ├── store/            # Gestión de estado
    ├── types/            # Tipos TypeScript
    └── utils/            # Utilidades
```

## Componentes Principales

### Layouts
- **AppLayout**: Layout principal de la aplicación con barra lateral y encabezado
- **AuthLayout**: Layout para páginas de autenticación
- **SettingsLayout**: Layout para páginas de configuración

### Componentes de Navegación
- **AppSidebar**: Barra lateral principal con menú de navegación
- **NavMain**: Componente para los elementos principales del menú
- **NavUser**: Información del usuario en la barra lateral
- **Breadcrumbs**: Navegación jerárquica

### Componentes UI
- **Button**: Botones personalizables
- **Card**: Contenedores de contenido
- **Form**: Componentes de formulario
- **Modal**: Ventanas modales
- **Table**: Tablas de datos
- **Toast**: Notificaciones

### Componentes de Formularios
- **ApplicationForm**: Formulario para crear/editar fichas de aplicación
- **LearningSessionForm**: Formulario para crear/editar sesiones de aprendizaje

## Gestión de Estado

### Store (Zustand)
- **useUserStore**: Maneja el estado del usuario autenticado
- **useUIStore**: Controla el estado de la interfaz de usuario
- **useFormStore**: Gestiona el estado de los formularios

### React Query
- Se utiliza para el manejo de datos del servidor
- Configuración global en `app.tsx`
- Gestión de caché y actualizaciones

## Sistema de Rutas

### Rutas Principales
- **/admin**: Panel de administración
- **/teacher**: Área de docentes
- **/student**: Área de estudiantes
- **/auth**: Autenticación (login, registro, etc.)

### Navegación
- **Menú Principal**: Acceso a las secciones principales
- **Breadcrumbs**: Navegación jerárquica
- **Enlaces rápidos**: Acceso directo a funciones comunes

## Estilos y Temas

### Tailwind CSS
- Framework CSS utilitario
- Personalización mediante `tailwind.config.js`
- Temas claro/oscuro

### Componentes UI
- Biblioteca de componentes personalizados
- Diseño responsive
- Accesibilidad integrada

## Integración con Backend

### Inertia.js
- Integración con Laravel
- Navegación SPA sin recargar la página
- Compartición de datos entre frontend y backend

### Autenticación
- Manejo de sesiones
- Protección de rutas
- Roles y permisos

## Estructura de Componentes por Módulo

### Módulo de Administración
- Gestión de usuarios
- Configuración del sistema
- Reportes y estadísticas

### Módulo Docente
- Gestión de clases
- Calificaciones
- Asistencia

### Módulo Estudiante
- Perfil académico
- Progreso
- Tareas y actividades

## Convenciones de Código

### Nombrado
- Componentes: PascalCase (Ej: `UserProfile.tsx`)
- Hooks: prefijo `use` (Ej: `useAuth.ts`)
- Servicios: sufijo `Service` (Ej: `userService.ts`)

### Estructura de Archivos
- Un componente por archivo
- Estilos en módulos CSS
- Tipos TypeScript en archivos `.d.ts`

## Tipos TypeScript

### Tipos de Formularios de Aplicación
```typescript
// resources/js/types/application-form/index.d.ts

type ApplicationFormStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived';

interface ApplicationForm {
  id: number;
  name: string;
  description: string | null;
  status: ApplicationFormStatus;
  score_max: number;
  start_date: string; // ISO 8601
  end_date: string; // ISO 8601
  teacher_classroom_curricular_area_id: number;
  learning_session_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones
  learning_session?: LearningSession;
  teacher_classroom_curricular_area?: TeacherClassroomCurricularArea;
  questions?: Question[];
}

interface CreateApplicationFormData {
  name: string;
  description?: string;
  status: ApplicationFormStatus;
  score_max: number;
  start_date: string;
  end_date: string;
  teacher_classroom_curricular_area_id: number;
  learning_session_id: number;
}
```

### Tipos de Sesiones de Aprendizaje
```typescript
// resources/js/types/learning-session/index.d.ts

interface LearningSession {
  id: number;
  name: string;
  purpose_learning: string;
  application_date: string; // YYYY-MM-DD
  educational_institution_id: number;
  teacher_classroom_curricular_area_id: number;
  competency_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relaciones
  educational_institution?: EducationalInstitution;
  teacher_classroom_curricular_area?: TeacherClassroomCurricularArea;
  competency?: Competency;
  application_forms?: ApplicationForm[];
}

interface CreateLearningSessionData {
  name: string;
  purpose_learning: string;
  application_date: string;
  educational_institution_id: number;
  teacher_classroom_curricular_area_id: number;
  competency_id: number;
}
```

## Servicios API

### ApplicationFormService
```typescript
// resources/js/services/ApplicationFormService.ts

class ApplicationFormService {
  static async create(data: CreateApplicationFormData): Promise<ApplicationForm> {
    const response = await axios.post<{ data: ApplicationForm }>('/api/application-forms', data);
    return response.data.data;
  }
  
  static async update(id: number, data: Partial<CreateApplicationFormData>): Promise<ApplicationForm> {
    const response = await axios.put<{ data: ApplicationForm }>(`/api/application-forms/${id}`, data);
    return response.data.data;
  }
  
  static async getById(id: number): Promise<ApplicationForm> {
    const response = await axios.get<{ data: ApplicationForm }>(`/api/application-forms/${id}`);
    return response.data.data;
  }
  
  // Otros métodos...
}
```

### LearningSessionService
```typescript
// resources/js/services/LearningSessionService.ts

class LearningSessionService {
  static async create(data: CreateLearningSessionData): Promise<LearningSession> {
    const response = await axios.post<{ data: LearningSession }>('/api/learning-sessions', data);
    return response.data.data;
  }
  
  static async getByTeacher(teacherId: number): Promise<LearningSession[]> {
    const response = await axios.get<{ data: LearningSession[] }>(`/api/teachers/${teacherId}/learning-sessions`);
    return response.data.data;
  }
  
  // Otros métodos...
}
```

## Próximos Pasos
1. Documentar componentes específicos
2. Mejorar la documentación de tipos
3. Añadir pruebas unitarias
4. Optimizar rendimiento
5. Mejorar accesibilidad
