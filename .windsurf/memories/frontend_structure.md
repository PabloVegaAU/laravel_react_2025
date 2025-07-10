# Estructura del Frontend - Laravel 12 + React + Inertia.js

## 📋 Descripción General
La aplicación frontend está construida con React 18, TypeScript e Inertia.js para la integración con Laravel 12. La arquitectura sigue patrones modernos de desarrollo frontend con un fuerte enfoque en la tipificación y la organización modular.

## 🎯 Características Principales
- **Arquitectura basada en componentes** con Atomic Design
- **Tipado fuerte** con TypeScript
- **Gestión de estado** con React Context y hooks personalizados
- **Formularios** con validación integrada
- **Rutas protegidas** con autenticación
- **Temas y estilos** con Tailwind CSS
- **Componentes UI** reutilizables
- **Integración con API REST** mediante servicios

## 🏗️ Estructura de Directorios

```
resources/
├── css/                      # Estilos globales y Tailwind
└── js/
    ├── components/           # Componentes reutilizables
    │   ├── organisms/        # Componentes complejos
    │   ├── ui/               # Componentes de UI atómicos
    │   └── ...
    ├── constants/            # Constantes y configuraciones
    ├── hooks/                # Custom hooks de React
    ├── layouts/              # Layouts principales
    │   ├── app/              # Layout principal de la aplicación
    │   ├── auth/             # Layout para autenticación
    │   └── settings/         # Layout para configuración
    ├── lib/                  # Utilidades y configuraciones
    ├── pages/                # Páginas de la aplicación (rutas)
    │   ├── admin/            # Panel de administración
    │   │   └── dashboard/    # Dashboard del administrador
    │   ├── auth/             # Autenticación
    │   ├── settings/         # Configuración de la aplicación
    │   ├── student/          # Área de estudiantes
    │   │   ├── application-form/  # Formularios de aplicación
    │   │   └── dashboard/    # Dashboard del estudiante
    │   └── teacher/          # Área de docentes
    │       ├── application-form/  # Gestión de formularios
    │       ├── dashboard/    # Dashboard del docente
    │       └── questions/    # Gestión de preguntas
    ├── services/             # Servicios API
    ├── store/                # Gestión de estado (Zustand/Context)
    ├── types/                # Tipos TypeScript
    │   ├── academic/         # Tipos relacionados con lo académico
    │   ├── application-form/ # Tipos para formularios
    │   ├── auth/             # Tipos de autenticación
    │   ├── core/             # Tipos base
    │   ├── question/         # Tipos para preguntas
    │   ├── session-learning/ # Tipos para sesiones
    │   ├── student/          # Tipos de estudiantes
    │   └── user/             # Tipos de usuario
    └── utils/                # Utilidades
```

## 🚀 Estructura por Roles

### 👨‍🎓 Estudiante
- **Dashboard**: Resumen de actividades, próximas tareas y progreso
- **Formularios de Aplicación**: Lista de formularios asignados
- **Sesiones de Aprendizaje**: Visualización de sesiones activas
- **Perfil**: Gestión de información personal y avatares
- **Tienda**: Canjear puntos por recompensas

### 👨‍🏫 Docente
- **Dashboard**: Resumen de clases y actividades recientes
- **Formularios de Aplicación**: Creación y gestión de formularios
- **Preguntas**: Banco de preguntas reutilizables
- **Sesiones de Aprendizaje**: Planificación y seguimiento
- **Reportes**: Análisis de rendimiento de estudiantes

### 👨‍💼 Administrador
- **Usuarios**: Gestión de estudiantes y docentes
- **Configuración**: Parámetros del sistema
- **Auditoría**: Registro de actividades
- **Backup**: Copias de seguridad

## 🧩 Componentes Principales

### Componentes de UI (Atoms/Molecules)
- **Button**: Botones con variantes y tamaños
- **Input**: Campos de formulario con validación
- **Card**: Contenedor de contenido estilizado
- **Modal**: Ventanas modales reutilizables
- **Table**: Tablas con ordenamiento y paginación
- **Alert**: Notificaciones al usuario
- **Avatar**: Visualización de imágenes de perfil
- **Badge**: Indicadores de estado
- **Spinner**: Indicadores de carga
- **Tooltip**: Información adicional al hacer hover

### Componentes de Formulario
- **Form**: Contenedor de formulario con manejo de estado
- **Field**: Campo de formulario con validación
- **Select**: Selector desplegable
- **Checkbox/Radio**: Opciones de selección
- **DatePicker**: Selector de fechas
- **FileUpload**: Subida de archivos
- **RichTextEditor**: Editor de texto enriquecido

### Componentes de Navegación
- **Layout**: Estructura principal de la aplicación
- **Sidebar**: Menú lateral
- **Navbar**: Barra de navegación superior
- **Breadcrumb**: Ruta de navegación
- **Tabs**: Pestañas para organización de contenido
- **Pagination**: Navegación entre páginas

## 🏗️ Estructura de Directorios

### 1. Autenticación (`/auth`)
- **Login**: Formulario de inicio de sesión
- **Register**: Registro de nuevos usuarios
- **ForgotPassword**: Recuperación de contraseña
- **ResetPassword**: Restablecimiento de contraseña

### 2. Panel de Administrador (`/admin`)
- **Dashboard**: Resumen general del sistema
- Gestión de usuarios
- Configuración del sistema

### 3. Área de Docente (`/teacher`)
- **Dashboard**: Resumen de actividades
- **Preguntas**:
  - Listado de preguntas
  - Creación/Edición de preguntas
  - Tipos de preguntas
- **Formularios de Aplicación**:
  - Listado de formularios
  - Creación/Edición de formularios
  - Asignación de preguntas
- **Sesiones de Aprendizaje**:
  - Gestión de sesiones
  - Seguimiento de estudiantes

### 4. Área de Estudiante (`/student`)
- **Dashboard**: Actividades recientes
- **Formularios de Aplicación**:
  - Formularios asignados
  - Realización de evaluaciones
  - Historial de respuestas

## Componentes Clave

### Layouts
- **AppLayout**: Layout principal con navegación y estructura general
- **AuthLayout**: Diseño limpio para flujos de autenticación
- **SettingsLayout**: Diseño para páginas de configuración

### Componentes de Navegación
- **AppSidebar**: Navegación principal con menú contextual por rol
- **TopNavigation**: Barra superior con búsqueda y notificaciones
- **Breadcrumbs**: Navegación jerárquica
- **Pagination**: Navegación entre páginas de resultados

### Componentes de Formulario
- **FormControl**: Campo de formulario con validación
- **Input**: Campos de entrada de texto
- **Select**: Menús desplegables
- **Checkbox/Radio**: Opciones de selección
- **FileUpload**: Carga de archivos
- **RichTextEditor**: Editor de texto enriquecido

### Componentes de UI
- **Button**: Botones con variantes y estados
- **Card**: Contenedores de contenido
- **Modal**: Ventanas modales
- **Table**: Tablas de datos
## Gestión de Estado

### Context API
- **AuthContext**: Estado de autenticación
- **ThemeContext**: Tema de la aplicación

### Gestión de Estado Global
- **Zustand**: Para estado compartido
- **React Query**: Para manejo de datos y caché

## Tipado con TypeScript

### Interfaces Principales
```typescript
// Ejemplo de tipos para usuarios
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Ejemplo de tipos para preguntas
interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  points: number;
  created_at: string;
  updated_at: string;
}

// Ejemplo de tipos para formularios
interface ApplicationForm {
  id: number;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  start_date: string;
  end_date: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}
```

## Estilos y Temas

### Tailwind CSS
- Utilización de clases utilitarias
- Configuración personalizada en `tailwind.config.js`
- Diseño responsive

### Estilos Personalizados
- Variables CSS para colores y tipografía
- Animaciones personalizadas
- Breakpoints consistentes

## Internacionalización (i18n)
- Soporte para múltiples idiomas
- Archivos de traducción organizados por módulo
- Formato de fechas y números localizados

## Pruebas
- Pruebas unitarias con Jest
- Pruebas de integración con React Testing Library
- Pruebas E2E con Cypress

## Despliegue
- Compilación con Vite
- Optimización de assets
- División de código (code splitting)
- Variables de entorno
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

// Tipos principales
declare namespace App {
  // Usuario autenticado
  interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  }

  // Estudiante
  interface Student extends AuthUser {
    level_id: number;
    range_id: number;
    entry_date: string;
    status: 'active' | 'inactive' | 'graduated' | 'withdrawn' | 'suspended';
    experience_achieved: number;
    points_store_achieved: number;
    points_store: number;
    graduation_date: string | null;
    level: Level;
    range: Range;
  }

  // Docente
  interface Teacher extends AuthUser {
    specialization: string;
    status: 'active' | 'inactive' | 'on_leave';
    application_forms: ApplicationForm[];
    classrooms: Classroom[];
  }

  // Niveles
  interface Level {
    id: number;
    name: string;
    description: string;
    order: number;
    experience_required: number;
    badge_url: string;
  }

  // Rangos
  interface Range {
    id: number;
    name: string;
    description: string;
    image_url: string;
    experience_required: number;
  }

  // Aulas
  interface Classroom {
    id: number;
    name: string;
    grade: string;
    section: string;
    academic_year: string;
    status: 'active' | 'inactive' | 'completed';
    teacher_id: number;
    created_at: string;
    updated_at: string;
    teacher: Teacher;
    students: Student[];
    curricular_areas: CurricularArea[];
  }

  // Áreas curriculares
  interface CurricularArea {
    id: number;
    name: string;
    description: string;
    color: string;
    icon: string;
    created_at: string;
    updated_at: string;
    cycles: Cycle[];
    classrooms: Classroom[];
    competencies: Competency[];
  }

  // Ciclos
  interface Cycle {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'upcoming' | 'active' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    curricular_areas: CurricularArea[];
  }

  // Competencias
  interface Competency {
    id: number;
    name: string;
    description: string;
    curricular_area_id: number;
    created_at: string;
    updated_at: string;
    curricular_area: CurricularArea;
    capabilities: Capability[];
  }

  // Capacidades
  interface Capability {
    id: number;
    name: string;
    description: string;
    competency_id: number;
    created_at: string;
    updated_at: string;
    competency: Competency;
  }

  // Sesiones de aprendizaje
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
