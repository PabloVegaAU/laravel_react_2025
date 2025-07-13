# 📚 Modelo LearningSessionCapability

## 📌 Ubicación
- **Migración**: `database/migrations/2025_06_22_100310_create_learning_session_capabilities_table.php`
- **Tabla**: `learning_session_capabilities`
- **Tipo**: Tabla pivote

## 📝 Descripción
La tabla `learning_session_capabilities` es una tabla pivote que establece una relación muchos a muchos entre las sesiones de aprendizaje y las capacidades que se trabajan en cada una. Permite asociar múltiples capacidades a una sesión y viceversa, facilitando la planificación curricular y el seguimiento del progreso de los estudiantes.

## 🏗️ Estructura del Modelo

### 📋 Atributos

#### 🔹 Fillable
- `learning_session_id`: ID de la sesión de aprendizaje
- `capability_id`: ID de la capacidad asociada
- `score`: Puntuación opcional para la capacidad en esta sesión
- `feedback`: Retroalimentación específica para esta capacidad

#### 🔹 Casts
- `score` → `decimal:2`
- `created_at` → `datetime`
- `updated_at` → `datetime`

## 🗃️ Estructura de la Base de Datos

### 📊 Tabla: `learning_session_capabilities`

#### 🔑 Claves
- **Primaria**: `id` (bigint UNSIGNED, autoincremental)
- **Foráneas**:
  - `learning_session_id` → `learning_sessions.id` (con cascade on delete)
  - `capability_id` → `capabilities.id` (con cascade on delete)
- **Índices**:
  - `learning_session_capabilities_learning_session_id_foreign`
  - `learning_session_capabilities_capability_id_foreign`
  - `idx_sessions_capabilities_session` (learning_session_id)
  - `idx_sessions_capabilities_capability` (capability_id)
- **Restricciones**:
  - `uq_session_capability` (learning_session_id, capability_id) - Evita duplicados

#### 📋 Columnas
| Columna | Tipo | Nulo | Default | Descripción |
|---------|------|------|---------|-------------|
| id | bigint UNSIGNED | No | Auto | Identificador único |
| learning_session_id | bigint UNSIGNED | No | - | Referencia a la sesión de aprendizaje |
| capability_id | bigint UNSIGNED | No | - | Referencia a la capacidad |
| score | decimal(8,2) | Sí | NULL | Puntuación opcional |
| feedback | text | Sí | NULL | Retroalimentación detallada |
| created_at | timestamp | Sí | NULL | Fecha de creación |
| updated_at | timestamp | Sí | NULL | Fecha de actualización |

## 🔄 Relaciones

### learningSession (BelongsTo)
- **Modelo**: `LearningSession`
- **Clave foránea**: `learning_session_id`
- **Descripción**: Sesión de aprendizaje asociada
- **Acceso inverso**: `capabilities()` en el modelo LearningSession

### capability (BelongsTo)
- **Modelo**: `Capability`
- **Clave foránea**: `capability_id`
- **Descripción**: Capacidad asociada a la sesión
- **Acceso inverso**: `learningSessions()` en el modelo Capability

## 🛠️ Uso y Ejemplos

### Asociar capacidades a una sesión
```php
// Obtener la sesión
$session = LearningSession::find(1);

// Asociar capacidades con puntuación y feedback
$session->capabilities()->attach([
    1 => ['score' => 85.5, 'feedback' => 'Excelente dominio'],
    2 => ['score' => 75.0, 'feedback' => 'Necesita mejorar'],
]);

// Obtener capacidades con puntuación específica
$highScoringCapabilities = $session->capabilities()
    ->wherePivot('score', '>', 80)
    ->get();
```

### Consultas comunes
```php
// Obtener todas las sesiones que trabajan una capacidad específica
$sessions = Capability::find(5)
    ->learningSessions()
    ->where('status', 'active')
    ->get();

// Obtener capacidades de una sesión con puntuación
$capabilities = $session->capabilities()
    ->withPivot(['score', 'feedback'])
    ->orderByPivot('score', 'desc')
    ->get();
```

## 🎨 Interfaz TypeScript

```typescript
/**
 * Relación entre LearningSession y Capability
 * con campos adicionales en la tabla pivote
 */
interface LearningSessionCapability {
  id: number;
  learning_session_id: number;
  capability_id: number;
  score?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  learning_session?: LearningSession;
  capability?: Capability;
}

/**
 * Tipo para crear/actualizar relaciones
 */
type LearningSessionCapabilityPivot = {
  score?: number;
  feedback?: string;
};
```

## 🔍 Mejores Prácticas

1. **Validación**:
   - Verificar que la capacidad pertenezca a la misma competencia que la sesión
   - Validar que el score esté dentro del rango permitido (0-100)

2. **Rendimiento**:
   - Usar `sync` para actualizar múltiples relaciones a la vez
   - Cargar relaciones con `with` para evitar el N+1

3. **Seguridad**:
   - Verificar permisos antes de modificar relaciones
   - Usar transacciones para operaciones atómicas

4. **Mantenimiento**:
   - Documentar cambios en las capacidades de las sesiones
   - Mantener consistencia con el plan curricular
 * Representa una capacidad trabajada en una sesión de aprendizaje
 */
interface LearningSessionCapability {
  id: number;
  learning_session_id: number;
  capability_id: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones cargadas opcionalmente
  learning_session?: LearningSession;
  capability?: Capability;
}

/**
 * Interfaz extendida para LearningSession que incluye las capacidades
 */
interface LearningSessionWithCapabilities extends LearningSession {
  capabilities?: Capability[];
  learning_session_capabilities?: LearningSessionCapability[];
}

/**
 * Interfaz extendida para Capability que incluye las sesiones
 */
interface CapabilityWithSessions extends Capability {
  learning_sessions?: LearningSession[];
  learning_session_capabilities?: LearningSessionCapability[];
}
```

## 🔄 Uso en Laravel

### En el modelo LearningSession
```php
// app/Models/LearningSession.php

/**
 * Obtiene las capacidades asociadas a esta sesión
 */
public function capabilities()
{
    return $this->belongsToMany(
        Capability::class,
        'learning_session_capabilities',
        'learning_session_id',
        'capability_id'
    )->withTimestamps();
}
```

### En el modelo Capability
```php
// app/Models/Capability.php

/**
 * Obtiene las sesiones de aprendizaje asociadas a esta capacidad
 */
public function learningSessions()
{
    return $this->belongsToMany(
        LearningSession::class,
        'learning_session_capabilities',
        'capability_id',
        'learning_session_id'
    )->withTimestamps();
}
```

### Ejemplo de consulta
```php
// Obtener una sesión con sus capacidades
$session = LearningSession::with('capabilities')->find($id);

// Obtener una capacidad con sus sesiones
$capability = Capability::with('learningSessions')->find($id);

// Crear una nueva relación
$session->capabilities()->attach($capabilityId);

// Sincronizar capacidades (elimina las anteriores y agrega las nuevas)
$session->capabilities()->sync([1, 2, 3]);
```

## 📊 Ejemplo de Uso en React

### Componente de Sesión con Capacidades
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SessionCardProps = {
  session: LearningSessionWithCapabilities;
};

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{session.name}</CardTitle>
            <CardDescription className="mt-1">
              {new Date(session.application_date).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
            {session.status === 'active' ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Propósito de Aprendizaje</h4>
            <p className="text-sm text-muted-foreground">
              {session.purpose_learning}
            </p>
          </div>
          
          {session.capabilities && session.capabilities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Capacidades</h4>
              <div className="flex flex-wrap gap-2">
                {session.capabilities.map((capability) => (
                  <Badge key={capability.id} variant="outline">
                    {capability.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🔍 Mejores Prácticas

1. **Carga Eficiente**:
   - Usar `with('capabilities')` para evitar el problema N+1
   - Cargar solo las columnas necesarias con `select()`

2. **Validación**:
   - Validar que las capacidades existan antes de asociarlas
   - Usar transacciones para operaciones atómicas

3. **Rendimiento**:
   - Crear índices para las columnas de búsqueda frecuente
   - Considerar la paginación para sesiones con muchas capacidades

4. **Seguridad**:
   - Verificar permisos antes de modificar relaciones
   - Usar políticas para autorizar accesos

## 📚 Recursos Relacionados
- [Documentación de Eloquent: Relaciones Muchos a Muchos](https://laravel.com/docs/eloquent-relationships#many-to-many)
- [Documentación de Laravel: Migraciones](https://laravel.com/docs/migrations)
- [Guía de Patrones de Diseño para Relaciones](https://laravel-news.com/eloquent-relationships-the-complete-guide)
