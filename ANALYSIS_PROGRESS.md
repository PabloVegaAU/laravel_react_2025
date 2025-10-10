##  ANÁLISIS SISTEMÁTICO: MIGRACIONES → MODELOS → TYPES

###  OBJETIVO
Analizar sistemáticamente la jerarquía del proyecto Laravel React 2025 para identificar inconsistencias entre migraciones, modelos y tipos TypeScript.

###  FECHA DE INICIO
2025-01-05

---

##  FASE 1: ANÁLISIS DE MIGRACIONES (COMPLETADO)

###  HALLAZGOS PRINCIPALES

#### **Estudiantes** - Campos faltantes en tipos:
- `experience_achieved` (decimal, default 0) 
- `points_store` (decimal, default 0) 
- `graduation_date` (date, nullable) 
- `range_id` (foreign key) 

#### **Premios** - Campo faltante:
- `available_until` (timestamp, nullable) 
- `type` (string, nullable) 

#### **Fondos** - Campos inconsistentes:
- `points_store` (decimal) vs `points_cost` en tipos 
- `activo` (boolean) vs `is_active` en tipos 

#### **Perfiles** - Confirmado correcto:
- `second_last_name` (string, nullable) 

---

##  FASE 2: ANÁLISIS DE MODELOS (COMPLETADO)

###  MODELOS REVISADOS
- **Student**: Relaciones correctas, campos fillable incluyen todos los campos de migración
- **Prize**: Campo `available_until` existe en modelo, falta `type`
- **Background**: Campos correctos incluyendo `points_store` y `activo`
- **Profile**: Campos correctos incluyendo `second_last_name`

---

##  FASE 3: ANÁLISIS DE TYPES (COMPLETADO)

###  ERRORES CONFIRMADOS

| Tipo | Campos en DB | Campos en Types | Estado |
|------|---------------|-----------------|---------|
| **Student** | 9 campos | 9 campos | 
| **Prize** | 9 campos | 8 campos | 1 faltante (`type`) |
| **Background** | 6 campos | 6 campos | 
| **Teacher** | 3 campos | 3 campos | 

###  CORRECCIONES PROPUESTAS

#### 1. **Tipos base comunes**:
```typescript
// types/core/base.d.ts
export type ID = number
export type DateString = string
export interface Timestamps {
  created_at: DateString
  updated_at: DateString
  deleted_at: DateString | null
}
```

#### 2. **Actualizar tipos existentes**:

**types/prize.ts** (Agregar campo `type`):
```typescript
export interface Prize {
  id: number
  name: string
  description: string
  image: string | null
  stock: number
  points_cost: number
  is_active: boolean
  available_until: string | null
  level_required: number
  type?: string | null  // 
  created_at: string
  updated_at: string
  deleted_at: string | null
}
```

**types/background.ts** (Corregir nomenclatura):
```typescript
export interface Background {
  id: number
  name: string
  image: string
  level_required: number
  points_store: number  // 
  activo: boolean       // 
  created_at: string
  updated_at: string
}
```

#### 3. **Utilidades de mapeo**:
```typescript
// types/core/mappers.d.ts
export const parseNumber = (value: string | number): number => {
  return typeof value === 'number' ? value : parseInt(value, 10) || 0
}

export const formatDateForAPI = (date: string | Date): string => {
  if (date instanceof Date) return date.toISOString().split('T')[0]
  return date
}
```

#### 4. **Ejemplo estructura correcta (Student)**:

**types/user/student/types.d.ts** :
```typescript
/**
 * Representa un estudiante en el sistema
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 * @see app/Models/Student.php
 */
export interface Student {
  user_id: number
  level_id: number | null
  range_id: number | null
  entry_date: string
  status: StudentStatus
  experience_achieved: number   // 
  points_store: number          // 
  graduation_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  user?: User
  level?: Level | null
  range?: Range | null
  // ... más relaciones
}

/**
 * Tipo para crear un nuevo estudiante
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export interface CreateStudent {
  user_id: number
  level_id: number
  range_id: number
  entry_date: string
  status?: StudentStatus
  experience_achieved?: number
  points_store?: number
  graduation_date?: string | null
}

/**
 * Tipo para actualizar un estudiante existente
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export type UpdateStudent = Partial<Omit<CreateStudent, 'user_id'>>
