# 🖥️ Estructura del Frontend

## 📋 Visión General

Arquitectura frontend basada en React 18 con TypeScript e Inertia.js, diseñada para ofrecer una experiencia de usuario fluida y mantenible. La estructura sigue principios de Atomic Design y está optimizada para el desarrollo ágil.

## 🎯 Características Clave

- **Arquitectura** basada en componentes con Atomic Design
- **Tipado fuerte** con TypeScript para mayor robustez
- **Gestión de estado** con React Context y hooks personalizados
- **Sistema de formularios** con validación integrada
- **Autenticación** con rutas protegidas
- **Diseño responsivo** con Tailwind CSS
- **Componentes UI** reutilizables y documentados
- **Integración con API** mediante servicios dedicados

## 🏗️ Estructura de Directorios

### Directorios Principales

- **components/**: Componentes reutilizables organizados por dominio
- **hooks/**: Custom hooks para lógica reutilizable
- **layouts/**: Plantillas principales de la aplicación
- **pages/**: Páginas organizadas por rol de usuario
- **services/**: Lógica de negocio y llamadas a API
- **types/**: Definiciones de tipos TypeScript
- **utils/**: Utilidades y helpers

### Estructura de Tipos

- **application-form/**: Tipos para formularios y respuestas
- **auth/**: Tipos relacionados con autenticación
- **question/**: Tipos para preguntas y opciones
- **session-learning/**: Tipos para sesiones de aprendizaje
- **user/**: Tipos de usuario y perfiles

## 🚀 Flujos por Rol

### 👨‍🎓 Estudiante

- **Inicio**: Resumen de actividades y próximas tareas
- **Formularios**: Lista de formularios asignados con estado
- **Sesiones**: Calendario y detalles de sesiones
- **Progreso**: Seguimiento de aprendizaje
- **Perfil**: Gestión de cuenta y preferencias

### 👨‍🏫 Docente

- **Panel**: Visión general de clases y actividades
- **Formularios**: Creación y gestión de evaluaciones
- **Banco de Preguntas**: Biblioteca de preguntas reutilizables
- **Sesiones**: Planificación y gestión de clases
- **Reportes**: Análisis de rendimiento por estudiante

### 👨‍💼 Administrador

- **Usuarios**: Gestión de cuentas y permisos
- **Configuración**: Ajustes del sistema
- **Monitoreo**: Estadísticas y registros
- **Mantenimiento**: Herramientas de sistema

## 🧩 Componentes Clave

### Núcleo de UI

- **Botones**: Acciones principales, secundarias y de estado
- **Entradas**: Campos de texto con validación
- **Tarjetas**: Contenedores de información
- **Modales**: Ventanas emergentes contextuales
- **Tablas**: Visualización de datos con filtros
- **Notificaciones**: Alertas y mensajes al usuario
- **Indicadores**: Estados de carga y progreso

### Formularios

- **Formularios**: Gestión de estado y validación
- **Campos**: Tipos específicos (texto, número, fecha, etc.)
- **Selección**: Opciones simples y múltiples
- **Subida**: Gestión de archivos
- **Búsqueda**: Filtrado y autocompletado
- **FileUpload**: Subida de archivos
- **RichTextEditor**: Editor de texto enriquecido

### Componentes de Navegación

- **Layout**: Estructura principal de la aplicación
- **Sidebar**: Menú lateral
- **Navbar**: Barra de navegación superior
- **Breadcrumb**: Ruta de navegación
- **Tabs**: Pestañas para organización de contenido
- **Pagination**: Navegación entre páginas

### Componentes de Respuesta a Preguntas

Ubicados en `resources/js/pages/student/application-form-response/components/question-types/`, estos componentes son responsables de renderizar y manejar la lógica para cada tipo de pregunta que un estudiante puede encontrar.

- **`BaseQuestionResponse.tsx`**: Un componente de orden superior que encapsula la lógica común compartida entre todos los tipos de preguntas, como la visualización del enunciado, la descripción y el manejo de explicaciones requeridas.

- **`SingleChoiceResponse.tsx`**: Gestiona preguntas de opción única y múltiple. Renderiza una lista de opciones donde el estudiante puede seleccionar una o varias respuestas.

- **`TrueFalseResponse.tsx`**: Componente especializado para preguntas de verdadero o falso, presentando las dos opciones de forma clara.

- **`OrderingResponse.tsx`**: Permite a los estudiantes reordenar una lista de opciones mediante una interfaz de arrastrar y soltar (`drag-and-drop`). La lógica interna gestiona el estado del orden seleccionado por el usuario.

- **`MatchingResponse.tsx`**: Renderiza dos columnas de opciones para que el estudiante las empareje. Gestiona el estado de los pares seleccionados y proporciona una interfaz visual para crear las conexiones.

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
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  avatar?: string
  created_at: string
  updated_at: string
}

// Ejemplo de tipos para preguntas
interface Question {
  id: number
  question: string
  type: QuestionType
  options?: QuestionOption[]
  points: number
  created_at: string
  updated_at: string
}

// Ejemplo de tipos para formularios
interface ApplicationForm {
  id: number
  title: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  start_date: string
  end_date: string
  questions: Question[]
  created_at: string
  updated_at: string
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

## 🧭 Navegación y Layout

### Estructura Principal

- **Layout Base**: Contenedor principal de la aplicación
- **Barra Lateral**: Navegación principal por rol
- **Cabecera**: Acciones rápidas y perfil de usuario
- **Rutas Anidadas**: Organización jerárquica de vistas
- **Breadcrumbs**: Navegación contextual
- **Tabs**: Organización de contenido relacionado
- **Paginación**: Navegación en conjuntos de datos
- **Pasos**: Guía para procesos secuenciales

## 🛠️ Hooks y Utilidades

### Gestión de Estado

- **Autenticación**: Manejo de sesión de usuario
- **Formularios**: Validación y manejo de estado
- **Modales**: Control de ventanas emergentes
- **Paginación**: Manejo de datos paginados
- **Filtros**: Gestión de parámetros de búsqueda
- **Almacenamiento**: Persistencia local de preferencias

### Integración con API

- **Consulta de Datos**: Obtención de información
- **Mutaciones**: Actualización de recursos
- **Peticiones en Tiem Real**: Actualizaciones en vivo
- **Gestión de Errores**: Manejo centralizado
- **Cache**: Optimización de rendimiento

## 🎨 Estilos y Temas

### Sistema de Diseño

- **Tema Base**: Colores, tipografía y espaciado
- **Modo Oscuro**: Soporte para temas claros/oscuros
- **Componentes**: Estilos consistentes
- **Responsive**: Adaptación a diferentes dispositivos
- **Utilidades**: Clases de ayuda para estilos comunes

## 🔄 Integración con Backend

### Servicios Clave

- **Autenticación**: Inicio de sesión y gestión de tokens
- **Usuarios**: Perfiles y preferencias
- **Estudiantes**: Gestión académica
- **Docentes**: Herramientas educativas
- **Sesiones**: Planificación de clases
- **Preguntas**: Banco de evaluaciones
- **Formularios**: Creación y gestión
- **Reportes**: Análisis de datos

### Manejo de Errores

- **Validación**: Errores de formulario
- **Red**: Problemas de conexión
- **Autenticación**: Sesiones expiradas
- **Tiempo de Espera**: Manejo de demoras
- **Reintentos**: Recuperación automática

## 🚀 Optimización

### Técnicas de Rendimiento

- **División de Código**: Carga bajo demanda
- **Carga Diferida**: Componentes pesados
- **Memorización**: Evitar renderizados innecesarios
- **Listas Virtuales**: Grandes conjuntos de datos
- **Caché**: Reducción de peticiones
- **Imágenes**: Optimización y formato moderno

## 🔒 Seguridad

### Medidas de Protección

- **Validación**: Entrada de usuario
- **Escape**: Prevención de inyección
- **XSS/CSRF**: Protección integrada
- **CSP**: Políticas de contenido
- **Cabeceras**: Seguridad HTTP
- **Tokens**: Manejo seguro de autenticación

## 📱 Experiencia Móvil

### Adaptabilidad

- **Enfoque Móvil**: Diseño mobile-first
- **Toques**: Interacciones táctiles
- **Offline**: Funcionalidad sin conexión
- **Rendimiento**: Optimización para móviles

## 📚 Documentación

### Para Desarrolladores

- **Guías de Estilo**: Convenciones de código
- **Componentes**: Uso y propiedades
- **API**: Documentación de servicios
- **Flujos**: Diagramas de interacción

### Para Usuarios

- **Manuales**: Guías paso a paso
- **Vídeos**: Tutoriales visuales
- **FAQ**: Preguntas frecuentes
- **Soporte**: Canales de ayuda

## 🧪 Calidad

### Estrategia de Pruebas

- **Unitarias**: Lógica de negocio
- **Integración**: Componentes y servicios
- **UI**: Interfaz de usuario
- **Rendimiento**: Tiempos de respuesta
- **Accesibilidad**: Estándares WCAG

## 🚀 Despliegue

### Entornos

- **Desarrollo**: Pruebas locales
- **Pruebas**: Validación en entorno controlado
- **Producción**: Versión estable

### Monitoreo

- **Errores**: Captura de excepciones
- **Rendimiento**: Métricas de la aplicación
- **Uso**: Análisis de interacción

## 📅 Próximos Pasos

### Mejoras Planificadas

1. Notificaciones en tiempo real
2. Exportación de reportes
3. Panel de análisis avanzado
4. Mejoras de accesibilidad
5. Optimización de rendimiento

## 🌐 Tipos Globales

### Usuario Autenticado

- **Estructura**: Datos básicos del usuario
- **Roles**: Estudiante, Docente, Administrador
- **Verificación**: Estado de la cuenta
- **Perfil**: Información personal

### Datos de la Aplicación

- **Usuario**: Información de sesión
- **Mensajes**: Notificaciones flash
- **Errores**: Validación de formularios
- **Autenticación**: Estado de inicio de sesión

### Paginación

- **Datos**: Conjunto de elementos
- **Navegación**: Enlaces de paginación
- **Metadatos**: Total, por página, etc.

### Formularios

- **Datos**: Valores actuales
- **Errores**: Mensajes de validación
- **Estados**: Carga, éxito, error
- **Métodos**: Envío y manipulación

### Filtros y Ordenación

- **Búsqueda**: Texto libre
- **Filtros**: Por estado, tipo, etc.
- **Ordenación**: Campo y dirección

### Notificaciones

- **Tipos**: Éxito, error, información, advertencia
- **Acciones**: Botones personalizados
- **Duración**: Tiempo de visualización

## 📈 Servicios API

### ApplicationFormService

```typescript
// resources/js/services/ApplicationFormService.ts

class ApplicationFormService {
  static async create(data: CreateApplicationFormData): Promise<ApplicationForm> {
    const response = await axios.post<{ data: ApplicationForm }>('/api/application-forms', data)
    return response.data.data
  }

  static async update(id: number, data: Partial<CreateApplicationFormData>): Promise<ApplicationForm> {
    const response = await axios.put<{ data: ApplicationForm }>(`/api/application-forms/${id}`, data)
    return response.data.data
  }

  static async getById(id: number): Promise<ApplicationForm> {
    const response = await axios.get<{ data: ApplicationForm }>(`/api/application-forms/${id}`)
    return response.data.data
  }

  // Otros métodos...
}
```

### LearningSessionService

```typescript
// resources/js/services/LearningSessionService.ts

class LearningSessionService {
  static async create(data: CreateLearningSessionData): Promise<LearningSession> {
    const response = await axios.post<{ data: LearningSession }>('/api/learning-sessions', data)
    return response.data.data
  }

  static async getByTeacher(teacherId: number): Promise<LearningSession[]> {
    const response = await axios.get<{ data: LearningSession[] }>(`/api/teachers/${teacherId}/learning-sessions`)
    return response.data.data
  }

  // Otros métodos...
}
```

## 📊 Tipos de Datos

### Tipos de Formularios de Aplicación

```typescript
// resources/js/types/application-form/index.d.ts

type ApplicationFormStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived'

interface ApplicationForm {
  id: number
  name: string
  description: string | null
  status: ApplicationFormStatus
  score_max: number
  start_date: string // ISO 8601
  end_date: string // ISO 8601
  teacher_id: number
  learning_session_id: number
  deactivated_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  learning_session?: LearningSession
  teacher?: Teacher
  questions?: ApplicationFormQuestion[]
}

interface CreateApplicationFormData {
  name: string
  description?: string
  status: ApplicationFormStatus
  score_max: number
  start_date: string
  end_date: string
  teacher_id: number
  learning_session_id: number
}
```

### Tipos de Sesiones de Aprendizaje

```typescript
// resources/js/types/learning-session/index.d.ts

// Tipos principales
declare namespace App {
  // Usuario autenticado
  interface AuthUser {
    id: number
    name: string
    email: string
    role: 'student' | 'teacher' | 'admin'
    avatar_url?: string
    created_at: string
    updated_at: string
  }

  // Estudiante
  interface Student extends AuthUser {
    user_id: number
    level_id: number
    entry_date: string
    graduation_date: string | null
    status: 'active' | 'inactive' | 'graduated' | 'withdrawn' | 'suspended'
    experience_achieved: number
    points_store: number
    level?: Level
  }

  // Docente
  interface Teacher {
    user_id: number
    status: 'active' | 'inactive' | 'on leave' | 'retired'
    created_at: string
    updated_at: string
    deleted_at: string | null
    application_forms?: ApplicationForm[]
    classrooms?: Classroom[]
  }

  // Niveles
  interface Level {
    id: number
    name: string
    description: string
    order: number
    experience_required: number
    badge_url: string
  }

  // Rangos
  interface Range {
    id: number
    name: string
    description: string
    image_url: string
    experience_required: number
  }

  // Aulas
  interface Classroom {
    id: number
    name: string
    grade: string
    section: string
    academic_year: string
    status: 'active' | 'inactive' | 'completed'
    teacher_id: number
    created_at: string
    updated_at: string
    teacher: Teacher
    students: Student[]
    curricular_areas: CurricularArea[]
  }

  // Áreas curriculares
  interface CurricularArea {
    id: number
    name: string
    description: string
    color: string
    created_at: string
    updated_at: string
    cycles?: Cycle[]
    classrooms?: Classroom[]
    competencies?: Competency[]
  }

  // Ciclos
  interface Cycle {
    id: number
    name: string
    order: number
    created_at: string
    updated_at: string
    curricular_areas?: CurricularArea[]
  }

  // Competencias
  interface Competency {
    id: number
    name: string
    curricular_area_cycle_id: number
    color: string
    created_at: string
    curricular_area_cycle?: CurricularAreaCycle
    capabilities?: Capability[]
  }

  // Capacidades
  interface Capability {
    id: number
    name: string
    color: string
    competency_id: number
    created_at: string
    competency?: Competency
  }

  // Sesiones de aprendizaje
  interface LearningSession {
    id: number
    name: string
    purpose_learning: string
    start_date: string
    end_date: string | null
    status: 'scheduled' | 'active' | 'finished' | 'canceled'
    performances: string | null
    start_sequence: string | null
    end_sequence: string | null
    educational_institution_id: number
    teacher_classroom_curricular_area_cycle_id: number
    competency_id: number
    registration_status: string
    deactivated_at: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null

    // Relaciones
    educational_institution?: EducationalInstitution
    teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle
    competency?: Competency
    capabilities?: Capability[]
  }
}

interface CreateLearningSessionData {
  name: string
  purpose_learning: string
  start_date: string
  end_date: string | null
  educational_institution_id: number
  teacher_classroom_curricular_area_cycle_id: number
  competency_id: number
}
```

## Servicios API

### ApplicationFormService

```typescript
// resources/js/services/ApplicationFormService.ts

class ApplicationFormService {
  static async create(data: CreateApplicationFormData): Promise<ApplicationForm> {
    const response = await axios.post<{ data: ApplicationForm }>('/api/application-forms', data)
    return response.data.data
  }

  static async update(id: number, data: Partial<CreateApplicationFormData>): Promise<ApplicationForm> {
    const response = await axios.put<{ data: ApplicationForm }>(`/api/application-forms/${id}`, data)
    return response.data.data
  }

  static async getById(id: number): Promise<ApplicationForm> {
    const response = await axios.get<{ data: ApplicationForm }>(`/api/application-forms/${id}`)
    return response.data.data
  }

  // Otros métodos...
}
```

### LearningSessionService

```typescript
// resources/js/services/LearningSessionService.ts

class LearningSessionService {
  static async create(data: CreateLearningSessionData): Promise<LearningSession> {
    const response = await axios.post<{ data: LearningSession }>('/api/learning-sessions', data)
    return response.data.data
  }

  static async getByTeacher(teacherId: number): Promise<LearningSession[]> {
    const response = await axios.get<{ data: LearningSession[] }>(`/api/teachers/${teacherId}/learning-sessions`)
    return response.data.data
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
