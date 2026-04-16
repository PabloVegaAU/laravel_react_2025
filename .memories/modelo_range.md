# 📚 Range

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100010_create_ranges_table.php` (estructura de base de datos)
>    - `app/Models/Range.php` (implementación del modelo)
>    - `resources/js/types/academic/range.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Range.php`
- **Tabla**: `ranges`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100010_create_ranges_table.php`
  - Estructura de la tabla
  - Índices únicos y compuestos
  - Clave foránea a levels

### Modelos Relacionados

- `app/Models/Level.php` (belongsTo)
  - Nivel requerido para alcanzar el rango
  - Clave foránea: `level_required`

### Tipos TypeScript

- `resources/js/types/academic/range.d.ts`
  - `interface Range`
  - `type CreateRange`
  - `type UpdateRange`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `ranges`
- **Campos Clave**:
  - `id`: bigint - Identificador único
  - `name`: string (unique) - Nombre del rango (ej: Novato, Aprendiz, Experto)
  - `color`: string(50) - Código de color hexadecimal
  - `image`: string (nullable) - URL de la imagen representativa
  - `description`: text (nullable) - Descripción del rango y sus beneficios
  - `order`: unsignedInteger default 0 - Orden de visualización
  - `level_required`: foreignId (bigint) - Nivel mínimo requerido (referencia levels)
  - `timestamps()`: created_at, updated_at
  - `softDeletes()`: deleted_at

### Índices

- `uq_ranges_name`: Índice único en `name`
- `idx_ranges_level_required`: Índice en `level_required`
- `idx_ranges_order`: Índice en `order`
- `idx_ranges_level_order`: Índice compuesto en `level_required` y `order`

### Relaciones

- **Relación con Level**:
  - Tipo: belongsTo
  - Clave foránea: `level_required`
  - Comportamiento en cascada: restrict

## 🔄 Flujo de Datos

### Creación de Rangos

1. El administrador crea un nuevo rango con nombre, color, imagen, descripción y orden
2. Se especifica el nivel mínimo requerido para alcanzar el rango
3. El rango se guarda en la base de datos

### Asignación a Estudiantes

1. Cuando un estudiante alcanza un nivel específico
2. Se verifica qué rango corresponde a ese nivel
3. El rango se asigna al estudiante a través de `student_level_histories`

### Consultas Comunes

- Obtener todos los rangos ordenados: `Range::orderBy('order')->get()`
- Obtener rangos disponibles para un nivel específico: `Range::where('level_required', '<=', $level)->orderBy('order')->get()`
- Obtener rango por nombre: `Range::where('name', 'Experto')->first()`

## 🔍 Ejemplo de Uso

```typescript
export interface Range {
  id: number
  name: string
  color: string
  image: string | null
  description: string | null
  order: number
  level_required: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateRange = Omit<Range, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'level'>

export type UpdateRange = Partial<CreateRange>
```

## ⚙️ Configuración del Modelo

### Casts

- `order`: `integer`
- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

### Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `color`
- `image`
- `description`
- `order`
- `level_required`

## ⚠️ Consideraciones

- El campo `name` es único para evitar duplicados de rangos
- El campo `order` define el orden de visualización en la UI
- `level_required` indica el nivel mínimo que un estudiante debe tener para alcanzar este rango
- Usa soft deletes para permitir recuperación de rangos eliminados
- El color se usa para representación visual en la interfaz del estudiante
- La imagen es opcional pero recomendada para mejorar la experiencia visual
