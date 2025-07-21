# Gestión de Premios

Este módulo permite a los administradores gestionar los premios que pueden ser canjeados por los estudiantes con sus puntos acumulados.

## Características

- Listado de premios con búsqueda y filtrado
- Creación de nuevos premios con imagen, descripción y detalles
- Edición de premios existentes
- Eliminación de premios
- Visualización del stock y costo en puntos
- Fechas de disponibilidad para cada premio

## Componentes

- `index.tsx` - Página principal que muestra la lista de premios
- `components/` - Contiene los componentes reutilizables
  - `index.tsx` - Componente principal de gestión de premios
  - `create-prize-modal.tsx` - Modal para crear nuevos premios
  - `edit-prize-modal.tsx` - Modal para editar premios existentes

## API Endpoints

- `GET /api/prizes` - Obtener lista de premios
- `POST /api/prizes` - Crear un nuevo premio
- `GET /api/prizes/{id}` - Obtener un premio específico
- `PUT /api/prizes/{id}` - Actualizar un premio
- `DELETE /api/prizes/{id}` - Eliminar un premio

## Campos del Modelo

- `id` - Identificador único
- `name` - Nombre del premio
- `description` - Descripción detallada
- `image` - Ruta de la imagen del premio
- `stock` - Cantidad disponible
- `points_cost` - Costo en puntos
- `is_active` - Estado de disponibilidad
- `available_until` - Fecha límite de disponibilidad
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización
- `deleted_at` - Fecha de eliminación (soft delete)

## Uso

1. Navega a la sección de "Gestión de Premios" en el panel de administración.
2. Usa la barra de búsqueda para encontrar premios específicos.
3. Haz clic en "Crear Premio" para agregar un nuevo premio.
4. Para editar o eliminar un premio existente, utiliza los botones de acción en la tabla.

## Notas

- Las imágenes de los premios se almacenan en el almacenamiento público en la carpeta `storage/app/public/prizes`.
- Los premios eliminados se marcan como eliminados (soft delete) y no se muestran en la lista principal.
- Los premios inactivos no estarán disponibles para canje por parte de los estudiantes.
