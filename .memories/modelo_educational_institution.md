# 📚 EducationalInstitution

> **IMPORTANTE**:
>
> 1. **Verificar siempre** los archivos relacionados:
>    - `database/migrations/2025_06_22_100280_create_educational_institutions_table.php` (estructura de base de datos)
>    - `app/Models/EducationalInstitution.php` (implementación del modelo)
>    - `resources/js/types/academic/educational-institution.d.ts` (tipos TypeScript)
> 2. Las migraciones son la fuente de verdad
> 3. Los modelos deben reflejar las migraciones
> 4. Los tipos TypeScript deben reflejar las migraciones y los modelos

## 📌 Ubicación

- **Tipo**: Modelo
- **Archivo Principal**: `app/Models/EducationalInstitution.php`
- **Tabla**: `educational_institutions`

## 📦 Archivos Relacionados

### Migraciones

- `database/migrations/2025_06_22_100280_create_educational_institutions_table.php`
  - Estructura de la tabla
  - Índices en name y ugel
  - Soft deletes

### Modelos Relacionados

- Actualmente no define relaciones explícitas en el código

### Tipos TypeScript

- `resources/js/types/academic/educational-institution.d.ts`
  - `type EducationalInstitution`

## 🏗️ Estructura

### Base de Datos (Migraciones)

- **Tabla**: `educational_institutions`
- **Campos Clave**:
  - `id`: bigint - ID único de la institución educativa
  - `name`: string - Nombre de la institución educativa
  - `ugel`: string - Unidad de Gestión Educativa Local a la que pertenece
  - `timestamps()`: created_at, updated_at, deleted_at

### Índices

- `idx_educational_institutions_name`: Índice en `name`
- `idx_educational_institutions_ugel`: Índice en `ugel`

## 🔄 Flujo de Datos

### Creación de Instituciones

1. El administrador crea una nueva institución educativa
2. Se especifica el nombre y la UGEL
3. La institución se guarda en la base de datos

### Consultas Comunes

- Obtener todas las instituciones: `EducationalInstitution::all()`
- Buscar institución por nombre: `EducationalInstitution::where('name', 'like', '%colegio%')->get()`
- Obtener instituciones por UGEL: `EducationalInstitution::where('ugel', 'UGEL-01')->get()`

## 🔍 Ejemplo de Uso

```typescript
export type EducationalInstitution = {
  id: number
  name: string
  ugel: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
```

## ⚙️ Configuración del Modelo

### Casts

- `created_at`: `datetime`
- `updated_at`: `datetime`
- `deleted_at`: `datetime`

### Fillable

Los campos que pueden ser asignados masivamente:

- `name`
- `ugel`

## ⚠️ Consideraciones

- Usa soft deletes para permitir recuperación de instituciones eliminadas
- La UGEL es importante para la organización administrativa del sistema educativo peruano
- No tiene relaciones directas en el código actual, pero puede ser referenciada por otros modelos en el futuro
- Los índices en name y ugel permiten búsquedas eficientes
