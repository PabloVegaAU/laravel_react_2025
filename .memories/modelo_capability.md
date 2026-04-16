# 📚 Capability

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100080_create_capabilities_table.php` (estructura de base de datos)
>    - `app/Models/Capability.php` (implementación del modelo)
>    - `resources/js/types/academic/capability.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/Capability.php`
- **Tabla**: `capabilities`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100080_create_capabilities_table.php`
  - Estructura de la tabla
  - Clave foránea a competencies con cascadeOnDelete

### Modelos Relacionados

- `app/Models/Competency.php` (belongsTo)
  - Competencia a la que pertenece la capacidad
  - Clave foránea: `competency_id`
- `app/Models/Question.php` (hasMany)
  - Preguntas que evalúan esta capacidad
  - Clave foránea: `capability_id`
- `app/Models/LearningSession.php` (belongsToMany)
  - Sesiones de aprendizaje que evalúan esta capacidad
  - Tabla pivot: `learning_session_capabilities`

### Tipos TypeScript

- `resources/js/types/academic/capability.d.ts`
  - `type Capability`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `capabilities`
- **Campos Clave**:
  - `id`: bigint - Identificador único de la capacidad
  - `competency_id`: foreignId (competencies.id, cascadeOnDelete) - ID de la competencia a la que pertenece
  - `name`: string - Nombre de la capacidad
  - `color`: string(50) - Código de color para representación visual
  - `timestamps()`: created_at, updated_at

### Relaciones

- **Relación con Competency**:
  - Tipo: belongsTo
  - Clave foránea: `competency_id`
  - Comportamiento: cascadeOnDelete
- **Relación con Question**:
  - Tipo: hasMany
  - Clave foránea: `capability_id`
  - Comportamiento en cascada: delete
- **Relación con LearningSession**:
  - Tipo: belongsToMany
  - Tabla pivot: `learning_session_capabilities`

## 🔄 Flujo de Datos

### Creación de Capacidades

1. El administrador selecciona una competencia existente
2. Crea una nueva capacidad con nombre y color
3. La capacidad se guarda asociada a la competencia
4. Se pueden crear preguntas que evalúen esta capacidad

### Asociación con Preguntas

1. Al crear una pregunta, se selecciona la capacidad que evalúa
2. La pregunta queda asociada a la capacidad
3. Una capacidad puede tener múltiples preguntas asociadas

### Asociación con Sesiones de Aprendizaje

1. Al crear una sesión de aprendizaje, se pueden seleccionar capacidades específicas a evaluar
2. Se crea un registro en `learning_session_capabilities`
3. La capacidad queda asociada a la sesión de aprendizaje

### Consultas Comunes

- Obtener capacidades de una competencia: `$competency->capabilities`
- Obtener preguntas de una capacidad: `$capability->questions`
- Obtener sesiones que evalúan una capacidad: `$capability->learningSessions`
- Buscar capacidades por nombre: `Capability::where('name', 'like', '%resolver%')->get()`

## 🔍 Ejemplo de Uso

```typescript
export type Capability = BaseEntity & {
  // Campos principales
  competency_id: number
  name: string
  color: string

  // Relaciones
  competency?: Competency
  questions?: Question[]
  learningSessions?: LearningSession[]
}
```

## ⚙️ Configuración del Modelo

### Casts

- `created_at`: `datetime`
- `updated_at`: `datetime`

### Dates

- `created_at`
- `updated_at`

### Fillable

Los campos que pueden ser asignados masivamente:

- `competency_id`
- `name`
- `color`

## ⚠️ Consideraciones

- Las capacidades siempre pertenecen a una competencia
- Usa `cascadeOnDelete` para eliminar preguntas asociadas cuando se elimina la capacidad
- El color se usa para representación visual en la interfaz
- Las capacidades son el nivel más granular del diseño curricular
- Pueden asociarse a múltiples sesiones de aprendizaje
- Son la unidad básica de evaluación en el sistema
- Múltiples preguntas pueden evaluar la misma capacidad
