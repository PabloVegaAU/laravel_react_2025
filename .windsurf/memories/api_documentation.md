# Documentación de la API - Laravel 12 + React + Inertia.js

## Arquitectura General

Este proyecto utiliza una arquitectura moderna con:
- **Backend**: Laravel 12 (PHP)
- **Frontend**: React con Inertia.js
- **Autenticación**: Laravel Sanctum (basada en sesiones para SPA)
- **Enrutamiento**: Rutas web de Laravel con respuestas Inertia
- **Formato de Respuesta**: JSON API con estructura consistente
- **Versionado**: API v1 (ruta base: `/api/v1`)
- **Autenticación**: Bearer Token (Sanctum)
- **Paginación**: Implementada en colecciones (15 items por defecto)
- **Ordenamiento**: Parámetro `sort` (ej: `?sort=-created_at`)
- **Filtrado**: Parámetros de consulta específicos por recurso
- **Búsqueda**: Parámetro `q` para búsqueda global

## Autenticación

La autenticación se maneja mediante sesiones de Laravel con Sanctum para SPA. Todas las solicitudes requieren el token CSRF y las credenciales de sesión.

### Inicio de Sesión
```
POST /login
```

**Cuerpo de la solicitud:**
```json
{
  "name": "usuario",
  "password": "contraseña",
  "remember": false
}
```

## Estructura de Rutas

Las rutas de la API están organizadas por roles:
- **Admin**: `/admin/*`
- **Profesor**: `/teacher/*`
- **Estudiante**: `/student/*`

## Endpoints de Preguntas de Fichas de Aplicación

### Obtener preguntas de una ficha de aplicación
```
GET /api/v1/application-forms/{application_form}/questions
```

**Parámetros de URL:**
- `application_form`: ID de la ficha de aplicación (requerido)

**Parámetros de consulta:**
- `include`: Relaciones a incluir (ej: `question,question.options`)
- `sort`: Campo para ordenar (ej: `order`, `-order` para descendente)
- `page`: Número de página (por defecto: 1)
- `per_page`: Items por página (por defecto: 15)

**Encabezados requeridos:**
```
Accept: application/json
Authorization: Bearer {token}
X-Requested-With: XMLHttpRequest
```

**Respuesta exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "application_form_id": 1,
      "question_id": 1,
      "order": 1,
      "score": 10.00,
      "points_store": 5.00,
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z",
      "question": {
        "id": 1,
        "name": "Pregunta de ejemplo",
        "description": "¿Cuál es la respuesta correcta?",
        "question_type_id": 1,
        "difficulty": "medium",
        "options": [
          {
            "id": 1,
            "option_text": "Opción 1",
            "is_correct": true,
            "order": 1
          },
          {
            "id": 2,
            "option_text": "Opción 2",
            "is_correct": false,
            "order": 2
          }
        ]
      }
    }
  ],
  "links": {
    "first": "http://localhost/api/v1/application-forms/1/questions?page=1",
    "last": "http://localhost/api/v1/application-forms/1/questions?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "http://localhost/api/v1/application-forms/1/questions",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
      "id": 1,
      "application_form_id": 1,
      "question_id": 1,
      "order": 1,
      "score": "10.00",
      "points_store": "5.00",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "question": {
        "id": 1,
        "question_text": "¿Cuál es la solución para x en la ecuación 2x + 3 = 7?",
        "question_type": "multiple_choice",
        "options": [
          {"id": 1, "option_text": "2", "is_correct": true},
          {"id": 2, "option_text": "3", "is_correct": false},
          {"id": 3, "option_text": "4", "is_correct": false}
        ]
      },
      "created_at": "2025-06-22T10:00:00.000000Z",
      "updated_at": "2025-06-22T10:00:00.000000Z"
    }
  ]
}
```

### Agregar pregunta a una ficha de aplicación
```
POST /api/application-forms/{application_form}/questions
```

**Parámetros de URL:**
- `application_form`: ID de la ficha de aplicación

**Cuerpo de la solicitud:**
```json
{
  "question_id": 1,
  "order": 2,
  "score": 10.0,
  "points_store": 5.0
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "data": {
    "id": 2,
    "application_form_id": 1,
    "question_id": 1,
    "order": 2,
    "score": 10.0,
    "points_store": 5.0,
    "created_at": "2025-06-22T10:05:00.000000Z",
    "updated_at": "2025-06-22T10:05:00.000000Z"
  }
}
```

### Actualizar pregunta en una ficha de aplicación
```
PUT /api/application-forms/{application_form}/questions/{question}
```

**Parámetros de URL:**
- `application_form`: ID de la ficha de aplicación
- `question`: ID de la relación pregunta-formulario

**Cuerpo de la solicitud:**
```json
{
  "order": 1,
  "score": 15.0,
  "points_store": 7.5
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "data": {
    "id": 2,
    "application_form_id": 1,
    "question_id": 1,
    "order": 1,
    "score": 15.0,
    "points_store": 7.5,
    "created_at": "2025-06-22T10:05:00.000000Z",
    "updated_at": "2025-06-22T10:10:00.000000Z"
  }
}
```

### Eliminar pregunta de una ficha de aplicación
```
DELETE /api/application-forms/{application_form}/questions/{question}
```

**Parámetros de URL:**
- `application_form`: ID de la ficha de aplicación
- `question`: ID de la relación pregunta-formulario

**Respuesta exitosa (204 No Content):**
```
Empty response
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

## Endpoints para Profesores

### Gestión de Preguntas
```
GET /teacher/questions
POST /teacher/questions
GET /teacher/questions/{question}
PUT /teacher/questions/{question}
DELETE /teacher/questions/{question}
```

### Gestión de Fichas de Aplicación
```
GET /teacher/application-forms
POST /teacher/application-forms
GET /teacher/application-forms/{application_form}
PUT /teacher/application-forms/{application_form}
DELETE /teacher/application-forms/{application_form}
```

## Endpoints para Estudiantes

### Fichas de Aplicación del Estudiante
```
GET /student/application-forms
GET /student/application-forms/{application_form}
POST /student/application-forms/{application_form}/submit
```

## Endpoints para Administradores

### Panel de Control
```
GET /admin/dashboard
```

## Estructura de Respuestas

Todas las respuestas siguen el formato:
```typescript
interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

## Manejo de Errores

La API devuelve códigos de estado HTTP estándar:
- 200: Éxito
- 201: Recurso creado
- 204: Sin contenido (para eliminaciones exitosas)
- 401: No autorizado
- 403: Prohibido
- 404: No encontrado
- 422: Error de validación
- 500: Error del servidor

## Ejemplo de Uso con Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Ejemplo de petición
try {
  const response = await api.get('/teacher/questions');
  console.log(response.data);
} catch (error) {
  console.error('Error:', error.response?.data);
}
```

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
      "questions": [
        {
          "id": 1,
          "order": 1,
          "score": 10.0,
          "points_store": 5.0,
          "question": {
            "id": 1,
            "question_text": "¿Cuál es la solución para x en la ecuación 2x + 3 = 7?",
            "question_type": "multiple_choice"
          }
        },
        {
          "id": 2,
          "order": 2,
          "score": 10.0,
          "points_store": 5.0,
          "question": {
            "id": 2,
            "question_text": "Resuelve para y: 3y - 5 = 10",
            "question_type": "open_ended"
          }
        }
      ],
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

## Respuestas de Error

### 400 Bad Request
```json
{
  "message": "Los datos proporcionados no son válidos.",
  "errors": {
    "field_name": [
      "El campo es obligatorio.",
      "El formato no es válido."
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "No autenticado."
}
```

### 403 Forbidden
```json
{
  "message": "No tiene permiso para realizar esta acción."
}
```

### 404 Not Found
```json
{
  "message": "El recurso solicitado no existe."
}
```

### 422 Unprocessable Entity
```json
{
  "message": "La petición no pudo ser procesada.",
  "errors": {
    "field_name": [
      "El valor ya está en uso.",
      "No se encontró el recurso relacionado."
    ]
  }
}
```

### 429 Too Many Requests
```json
{
  "message": "Demasiados intentos. Por favor, intente de nuevo más tarde.",
  "retry_after": 60
}
```

### 500 Internal Server Error
```json
{
  "message": "Error interno del servidor.",
  "error": "Mensaje detallado del error (solo en entorno de desarrollo)"
}
```

## Convenciones de Códigos de Estado HTTP

- `200 OK`: Operación exitosa (GET, PUT, PATCH)
- `201 Created`: Recurso creado exitosamente (POST)
- `204 No Content`: Operación exitosa sin contenido que devolver (DELETE)
- `400 Bad Request`: La solicitud es inválida
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación
- `429 Too Many Requests`: Límite de tasa excedido
- `500 Internal Server Error`: Error del servidor
