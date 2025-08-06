# Gestión de Fondos (Backgrounds)

Este módulo permite a los profesores gestionar los fondos que los estudiantes pueden adquirir en la tienda.

## Características

- Listado de fondos existentes
- Creación de nuevos fondos
- Edición de fondos existentes
- Eliminación de fondos
- Vista previa de imágenes
- Filtrado por búsqueda

## Componentes

- `index.tsx`: Página principal que muestra la lista de fondos
- `components/`: Directorio que contiene los componentes reutilizables
  - `index.tsx`: Componente principal de la lista de fondos
  - `create-background-modal.tsx`: Modal para crear un nuevo fondo
  - `edit-background-modal.tsx`: Modal para editar un fondo existente

## Rutas de la API

- `GET /api/levels`: Obtiene la lista de niveles disponibles
- `GET /admin/backgrounds`: Lista todos los fondos (paginados)
- `POST /admin/backgrounds`: Crea un nuevo fondo
- `GET /admin/backgrounds/{id}`: Muestra los detalles de un fondo
- `PUT /admin/backgrounds/{id}`: Actualiza un fondo existente
- `DELETE /admin/backgrounds/{id}`: Elimina un fondo

## Modelo de Datos

```typescript
type Background = {
  id: number
  name: string
  image: string
  level_required: number
  points_store: number
  created_at: string
  updated_at: string
  level_required_name?: string // Relación con el nivel requerido
}
```

## Uso

1. Navega a la sección de "Gestión de Fondos" en el panel del profesor
2. Usa el botón "Crear Fondo" para agregar un nuevo fondo
3. Completa el formulario con la información requerida
4. Selecciona una imagen para el fondo
5. Guarda los cambios
6. Los estudiantes podrán ver y adquirir los fondos en la tienda según su nivel y puntos disponibles
