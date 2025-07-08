# Documentación de la API

## Autenticación
Todas las solicitudes a la API requieren autenticación mediante tokens Bearer.

```
Authorization: Bearer {token}
```

## Endpoints de Sesiones de Aprendizaje

### Obtener todas las sesiones de aprendizaje
```
GET /api/learning-sessions
```

**Parámetros de consulta:**
- `teacher_id` (opcional): Filtrar por ID de profesor
- `status` (opcional): Filtrar por estado
- `page` (opcional): Número de página para paginación
- `per_page` (opcional): Elementos por página (por defecto: 15)

**Respuesta exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Ecuaciones de primer grado",
      "purpose_learning": "Que los estudiantes resuelvan ecuaciones básicas",
      "application_date": "2025-07-15",
      "educational_institution_id": 1,
      "teacher_classroom_curricular_area_id": 1,
      "competency_id": 1,
      "created_at": "2025-06-22T10:00:00.000000Z",
      "updated_at": "2025-06-22T10:00:00.000000Z",
      "educational_institution": {
        "id": 1,
        "name": "Institución Educativa Ejemplo",
        "ugel": "UGEL 01"
      },
      "teacher_classroom_curricular_area": {
        "id": 1,
        "teacher_id": 1,
        "classroom_id": 1,
        "curricular_area_id": 1,
        "academic_year": 2025
      },
      "competency": {
        "id": 1,
        "name": "Resuelve problemas de cantidad",
        "description": "Traduce cantidades a expresiones numéricas..."
      }
    }
  ],
  "links": {
    "first": "http://example.com/api/learning-sessions?page=1",
    "last": "http://example.com/api/learning-sessions?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "http://example.com/api/learning-sessions",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
```

### Crear una nueva sesión de aprendizaje
```
POST /api/learning-sessions
```

**Cuerpo de la solicitud:**
```json
{
  "name": "Nueva sesión de aprendizaje",
  "purpose_learning": "Objetivos de aprendizaje...",
  "application_date": "2025-08-20",
  "educational_institution_id": 1,
  "teacher_classroom_curricular_area_id": 1,
  "competency_id": 1
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "data": {
    "id": 2,
    "name": "Nueva sesión de aprendizaje",
    "purpose_learning": "Objetivos de aprendizaje...",
    "application_date": "2025-08-20",
    "educational_institution_id": 1,
    "teacher_classroom_curricular_area_id": 1,
    "competency_id": 1,
    "created_at": "2025-06-22T11:30:00.000000Z",
    "updated_at": "2025-06-22T11:30:00.000000Z"
  },
  "message": "Sesión de aprendizaje creada exitosamente"
}
```

**Errores comunes:**
- 422 Unprocessable Entity: Error de validación
- 401 Unauthorized: Token no válido o expirado
- 403 Forbidden: No tiene permisos para realizar esta acción

## Endpoints de Fichas de Aplicación

### Obtener todas las fichas de aplicación
```
GET /api/application-forms
```

**Parámetros de consulta:**
- `teacher_id` (opcional): Filtrar por ID de profesor
- `status` (opcional): Filtrar por estado
- `learning_session_id` (opcional): Filtrar por ID de sesión de aprendizaje
- `page` (opcional): Número de página para paginación
- `per_page` (opcional): Elementos por página (por defecto: 15)

**Respuesta exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Evaluación de ecuaciones",
      "description": "Evaluación sobre ecuaciones de primer grado",
      "status": "draft",
      "score_max": 20.0,
      "start_date": "2025-07-15T08:00:00.000000Z",
      "end_date": "2025-07-15T09:30:00.000000Z",
      "teacher_classroom_curricular_area_id": 1,
      "learning_session_id": 1,
      "created_at": "2025-06-22T10:00:00.000000Z",
      "updated_at": "2025-06-22T10:00:00.000000Z",
      "learning_session": {
        "id": 1,
        "name": "Ecuaciones de primer grado",
        "application_date": "2025-07-15"
      },
      "teacher_classroom_curricular_area": {
        "id": 1,
        "teacher": {
          "id": 1,
          "user": {
            "name": "Profesor Ejemplo"
          }
        },
        "classroom": {
          "id": 1,
          "name": "1ro A"
        },
        "curricular_area": {
          "id": 1,
          "name": "Matemática"
        }
      }
    }
  ],
  "links": {
    "first": "http://example.com/api/application-forms?page=1",
    "last": "http://example.com/api/application-forms?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "http://example.com/api/application-forms",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
```

### Crear una nueva ficha de aplicación
```
POST /api/application-forms
```

**Cuerpo de la solicitud:**
```json
{
  "name": "Nueva evaluación",
  "description": "Descripción de la evaluación",
  "status": "draft",
  "score_max": 20.0,
  "start_date": "2025-08-20T08:00:00.000Z",
  "end_date": "2025-08-20T09:30:00.000Z",
  "teacher_classroom_curricular_area_id": 1,
  "learning_session_id": 1
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "data": {
    "id": 2,
    "name": "Nueva evaluación",
    "description": "Descripción de la evaluación",
    "status": "draft",
    "score_max": 20.0,
    "start_date": "2025-08-20T08:00:00.000000Z",
    "end_date": "2025-08-20T09:30:00.000000Z",
    "teacher_classroom_curricular_area_id": 1,
    "learning_session_id": 1,
    "created_at": "2025-06-22T12:00:00.000000Z",
    "updated_at": "2025-06-22T12:00:00.000000Z"
  },
  "message": "Ficha de aplicación creada exitosamente"
}
```

### Actualizar una ficha de aplicación
```
PUT /api/application-forms/{id}
```

**Cuerpo de la solicitud:**
```json
{
  "name": "Evaluación actualizada",
  "status": "active",
  "start_date": "2025-08-20T08:30:00.000Z",
  "end_date": "2025-08-20T10:00:00.000Z"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "data": {
    "id": 2,
    "name": "Evaluación actualizada",
    "description": "Descripción de la evaluación",
    "status": "active",
    "score_max": 20.0,
    "start_date": "2025-08-20T08:30:00.000000Z",
    "end_date": "2025-08-20T10:00:00.000000Z",
    "teacher_classroom_curricular_area_id": 1,
    "learning_session_id": 1,
    "created_at": "2025-06-22T12:00:00.000000Z",
    "updated_at": "2025-06-22T12:15:00.000000Z"
  },
  "message": "Ficha de aplicación actualizada exitosamente"
}
```

### Eliminar una ficha de aplicación
```
DELETE /api/application-forms/{id}
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Ficha de aplicación eliminada exitosamente"
}
```

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - La solicitud se completó exitosamente |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Operación exitosa sin contenido que devolver |
| 400 | Bad Request - La solicitud es inválida |
| 401 | Unauthorized - Se requiere autenticación |
| 403 | Forbidden - No tiene permisos para realizar esta acción |
| 404 | Not Found - El recurso no existe |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |

## Manejo de Errores

Las respuestas de error siguen el siguiente formato:

```json
{
  "message": "El campo nombre es obligatorio",
  "errors": {
    "name": ["El campo nombre es obligatorio"],
    "start_date": ["La fecha de inicio debe ser posterior a la fecha actual"]
  }
}
```

## Paginación

Los endpoints que devuelven listas utilizan paginación. La respuesta incluye metadatos de paginación:

```json
{
  "data": [...],
  "links": {
    "first": "http://example.com/api/resource?page=1",
    "last": "http://example.com/api/resource?page=5",
    "prev": null,
    "next": "http://example.com/api/resource?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "path": "http://example.com/api/resource",
    "per_page": 15,
    "to": 15,
    "total": 75
  }
}
```

## Ordenamiento

Algunos endpoints permiten ordenar los resultados mediante el parámetro `sort`:

```
GET /api/learning-sessions?sort=-created_at,name
```

- Prefijar con `-` para orden descendente
- Múltiples campos separados por comas

## Filtrado

Los endpoints de listado permiten filtrar por diferentes campos:

```
GET /api/application-forms?status=active&teacher_id=1&start_date[gte]=2025-01-01
```

Operadores disponibles:
- `eq`: Igual a (por defecto)
- `neq`: No igual a
- `gt`: Mayor que
- `gte`: Mayor o igual que
- `lt`: Menor que
- `lte`: Menor o igual que
- `like`: Coincidencia parcial (sensible a mayúsculas)
- `ilike`: Coincidencia parcial (insensible a mayúsculas)
- `in`: En lista de valores (separados por comas)
- `not_in`: No en lista de valores (separados por comas)

## Ejemplos de Validación

### Creación de Sesión de Aprendizaje
```json
// 422 Unprocessable Entity
{
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "name": ["El campo nombre es obligatorio"],
    "purpose_learning": ["El propósito de aprendizaje es obligatorio"],
    "application_date": [
      "La fecha de aplicación es obligatoria",
      "La fecha de aplicación debe ser una fecha posterior o igual a hoy"
    ],
    "educational_institution_id": [
      "El campo institución educativa es obligatorio",
      "La institución educativa seleccionada no existe"
    ],
    "teacher_classroom_curricular_area_id": [
      "El área curricular del aula del profesor es obligatoria",
      "El área curricular seleccionada no existe o no está disponible"
    ],
    "competency_id": [
      "La competencia es obligatoria",
      "La competencia seleccionada no existe o no está disponible"
    ]
  }
}
```

### Creación de Ficha de Aplicación
```json
// 422 Unprocessable Entity
{
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "name": ["El campo nombre es obligatorio"],
    "start_date": [
      "La fecha de inicio es obligatoria",
      "La fecha de inicio debe ser una fecha posterior a la actual"
    ],
    "end_date": [
      "La fecha de fin es obligatoria",
      "La fecha de fin debe ser posterior a la fecha de inicio"
    ],
    "status": [
      "El estado es obligatorio",
      "El estado seleccionado no es válido"
    ],
    "score_max": [
      "La puntuación máxima es obligatoria",
      "La puntuación máxima debe ser un número mayor que 0"
    ],
    "teacher_classroom_curricular_area_id": [
      "El área curricular del aula del profesor es obligatoria"
    ],
    "learning_session_id": [
      "La sesión de aprendizaje es obligatoria",
      "La sesión de aprendizaje seleccionada no existe o no está disponible"
    ]
  }
}
```

## Relaciones Disponibles para Inclusión

### Sesiones de Aprendizaje
```
GET /api/learning-sessions/1?include=educationalInstitution,competency,teacherClassroomCurricularArea
```

**Relaciones disponibles:**
- `educationalInstitution`: Institución educativa asociada
- `competency`: Competencia asociada
- `teacherClassroomCurricularArea`: Relación con el área curricular del aula del profesor
- `applicationForms`: Fichas de aplicación asociadas

### Fichas de Aplicación
```
GET /api/application-forms/1?include=learningSession,teacherClassroomCurricularArea
```

**Relaciones disponibles:**
- `learningSession`: Sesión de aprendizaje asociada
- `teacherClassroomCurricularArea`: Relación con el área curricular del aula del profesor
- `questions`: Preguntas asociadas a la ficha
- `responses`: Respuestas de los estudiantes

## Ejemplos de Consultas Avanzadas

### Filtrar por múltiples condiciones
```
GET /api/application-forms?status=active&start_date[gte]=2025-01-01&score_max[gt]=15
```

### Ordenar por múltiples campos
```
GET /api/learning-sessions?sort=-created_at,application_date
```

### Incluir múltiples relaciones
```
GET /api/learning-sessions?include=educationalInstitution,competency&fields[learning_sessions]=name,application_date
```

## Mejores Prácticas

1. **Uso de Paginación**: Siempre implemente paginación al recuperar listas de recursos.
2. **Selección de Campos**: Solicite solo los campos necesarios usando el parámetro `fields`.
3. **Caché de Respuestas**: Considere implementar caché para respuestas que no cambian frecuentemente.
4. **Validación en el Lado del Cliente**: Valide los datos en el frontend antes de enviar solicitudes.
5. **Manejo de Errores**: Implemente manejo de errores adecuado para mostrar mensajes claros al usuario.
6. **Tasa de Límite**: Respete los límites de tasa de solicitudes (si los hay).
7. **Versión de la API**: Incluya el número de versión en la URL de la API (ej: `/api/v1/...`).
8. **Documentación Actualizada**: Mantenga la documentación sincronizada con los cambios en la API.
