# Modelo User

## Ubicación del archivo
- `app/Models/User.php`

## Migración relacionada
- `database/migrations/0001_01_01_000000_create_users_table.php`

## Descripción
El modelo User es el modelo principal de autenticación del sistema, que puede tener diferentes roles (admin, student, teacher).

## Estructura de la base de datos
### Tabla: `users`
- **Clave primaria**: `id` (bigint autoincremental)
- **Soft deletes**: Sí
- **Índices**:
  - `users_email_unique` (email)
  - `sessions_user_id_index` (user_id en tabla sessions)
  - `sessions_last_activity_index` (last_activity en tabla sessions)

### Estructura de columnas
| Columna | Tipo | Nulo | Default | Comentario |
|---------|------|------|---------|------------|
| id | bigint | No | Auto | Identificador único |
| name | string | No | - | Nombre del usuario |
| email | string | Sí | null | Email (único) |
| email_verified_at | timestamp | Sí | null | Verificación de email |
| password | string | No | - | Contraseña (hasheada) |
| remember_token | string | Sí | null | Token de recordatorio |
| created_at | timestamp | No | - | Fecha de creación |
| updated_at | timestamp | No | - | Fecha de actualización |
| deleted_at | timestamp | Sí | null | Fecha de eliminación |

### Tablas relacionadas en la migración
1. `password_reset_tokens`
   - **Clave primaria**: `email` (string)
   - **Columnas**: token (string), created_at (timestamp)

2. `sessions`
   - **Clave primaria**: `id` (string)
   - **Columnas**: 
     - user_id (bigint, nullable, indexado)
     - ip_address (string, nullable)
     - user_agent (text, nullable)
     - payload (longtext)
     - last_activity (integer, indexado)

## Atributos
### Fillable
- `name`: Nombre del usuario
- `email`: Correo electrónico (único)
- `password`: Contraseña (hasheada)

### Hidden
- `password`
- `remember_token`

### Casts
- `email_verified_at`: datetime
- `password`: hashed

## Relaciones
- `profile`: Relación HasOne con el modelo Profile
- `student`: Relación HasOne con el modelo Student
- `teacher`: Relación HasOne con el modelo Teacher
- `roles`: Relación BelongsToMany con el modelo Role (a través de Spatie Permissions)
- `permissions`: Relación BelongsToMany con el modelo Permission (a través de Spatie Permissions)

## Métodos importantes
- `isAdmin()`: Verifica si el usuario tiene rol de administrador
- `isStudent()`: Verifica si el usuario tiene rol de estudiante
- `isTeacher()`: Verifica si el usuario tiene rol de profesor
- `username()`: Devuelve el campo utilizado como nombre de usuario (name)

## Autenticación
- Utiliza Laravel Sanctum para autenticación API
- Implementa MustVerifyEmail para verificación de correo
- Usa Notifiable para notificaciones
- Implementa HasRoles de Spatie para gestión de roles y permisos

## Seguridad
- Contraseñas almacenadas con hash bcrypt
- Tokens de recordatorio
- Verificación de correo electrónico
- Protección contra inyección SQL mediante Eloquent ORM
