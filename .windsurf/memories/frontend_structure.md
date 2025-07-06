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

## Próximos Pasos
1. Documentar componentes específicos
2. Mejorar la documentación de tipos
3. Añadir pruebas unitarias
4. Optimizar rendimiento
5. Mejorar accesibilidad
