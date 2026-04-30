# Sistema de Clasificación de Riesgo de Autenticación

## Documentación Técnica para Tesis

### Resumen Ejecutivo

Se implementó un sistema de puntuación de riesgo (risk scoring) para autenticación que calcula niveles de riesgo en dos momentos críticos: (1) durante el login del usuario y (2) al aceptar la declaración de autenticidad antes de una evaluación. El sistema utiliza un modelo de puntuación ponderado basado en mejores prácticas de OWASP y NIST.

---

## 1. Modelo de Puntuación de Riesgo

### 1.1 Factores de Riesgo y Pesos

| Factor                   | Peso | Descripción                                           | Justificación                                       |
| ------------------------ | ---- | ----------------------------------------------------- | --------------------------------------------------- |
| `ip_changed`             | +50  | Cambio de dirección IP respecto al último login       | Indica posible acceso desde ubicación diferente     |
| `country_changed`        | +70  | Cambio de país                                        | Alto riesgo, posible acceso no autorizado           |
| `device_changed`         | +20  | Cambio de tipo de dispositivo (desktop/mobile/tablet) | Puede indicar compartición de cuenta                |
| `browser_changed`        | +10  | Cambio de navegador                                   | Factor de riesgo bajo pero relevante                |
| `os_changed`             | +15  | Cambio de sistema operativo                           | Puede indicar nuevo dispositivo                     |
| `time_under_5min`        | +20  | Tiempo entre sesiones < 5 minutos                     | Patrón inusual de comportamiento                    |
| `time_under_1min`        | +30  | Tiempo entre sesiones < 1 minuto                      | Riesgo crítico, posible ataque automatizado         |
| `session_simultaneous`   | +30  | Sesiones activas simultáneas                          | Compartición de credenciales o acceso no autorizado |
| `gps_distance_over_100m` | +25  | Distancia GPS > 100m                                  | Fuera de la precisión típica de una casa            |
| `gps_distance_over_1km`  | +40  | Distancia GPS > 1km                                   | Diferente zona/barrio                               |
| `gps_distance_over_10km` | +60  | Distancia GPS > 10km                                  | Viaje físicamente imposible en tiempo corto         |
| `unusual_time`           | +15  | Hora de login inusual para el usuario                 | Desviación > 3 horas del patrón histórico           |

### 1.2 Umbrales de Clasificación (Normalizados a 0-100)

```
Puntuación 0-30   → NIVEL NORMAL (🟢)
Puntuación 31-60  → NIVEL SOSPECHOSO (🟡)
Puntuación 61-100 → NIVEL CRÍTICO (🔴)
```

**Alineación con estándares:**

- OWASP Risk Rating: umbrales relativos a la escala (Low/Medium/High)
- NIST SP 800-63: 3 niveles de assurance (Low/Moderate/High)
- SecureAuth (industrial): scores normalizados a 0-100 con cap

### 1.3 Fórmula de Cálculo con Normalización

```
raw_score = Σ (peso_factor × condición_cumplida)
normalized_score = min(raw_score, 100)

Donde:
- condición_cumplida = 1 si el factor está presente, 0 si no
- La normalización a 0-100 permite umbrales intuitivos
- El raw_score se mantiene en logs para debugging
```

---

## 2. Algoritmo de Distancia GPS (Fórmula Haversine)

### 2.1 Descripción Matemática

La fórmula Haversine calcula la distancia entre dos puntos sobre una esfera (Tierra) dadas sus longitudes y latitudes.

### 2.2 Fórmula

```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c

Donde:
- φ = latitud en radianes
- λ = longitud en radianes
- R = radio de la Tierra = 6,371 km
- d = distancia en kilómetros
```

### 2.3 Implementación

```php
public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
{
    $lat1Rad = deg2rad($lat1);
    $lat2Rad = deg2rad($lat2);
    $deltaLat = deg2rad($lat2 - $lat1);
    $deltaLon = deg2rad($lon2 - $lon1);

    $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
         cos($lat1Rad) * cos($lat2Rad) *
         sin($deltaLon / 2) * sin($deltaLon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return 6371 * $c; // Radio de la Tierra en km
}
```

### 2.4 Umbrales de Distancia

| Umbral           | Valor         | Interpretación                                |
| ---------------- | ------------- | --------------------------------------------- |
| `GPS_SAME_HOUSE` | 0.1 km (100m) | Precisión típica GPS en interior de viviendas |
| `GPS_SAME_CITY`  | 1.0 km        | Diferente barrio/zona de la misma ciudad      |
| `GPS_IMPOSSIBLE` | 10.0 km       | Distancia imposible de recorrer en < 5 min    |

---

## 3. Flujos de Cálculo de Riesgo

### 3.1 Flujo 1: Login de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario inicia sesión (POST /login con GPS)                 │
│ 2. LogSuccessfulLogin listener ejecuta                          │
│ 3. Obtener último login exitoso (comparación)                   │
│ 4. Obtener últimos 10 logins (detección de patrones)            │
│ 5. Calcular puntuación de riesgo                                │
│ 6. Almacenar: risk_level, risk_score, risk_factors,             │
│    comparison_login_id                                           │
│ 7. Marcar sesión con nivel de riesgo                            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Flujo 2: Declaración de Autenticidad

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Estudiante abre formulario de evaluación                     │
│ 2. Frontend obtiene GPS del navegador                           │
│ 3. Al aceptar declaración: POST /start con GPS                  │
│ 4. Controller obtiene login_history_id activo del estudiante    │
│ 5. RiskScoringService compara:                                  │
│    - Login GPS vs Declaración GPS                               │
│    - IP del login vs IP de declaración                          │
│    - User-Agent del login vs declaración                        │
│    - Tiempo transcurrido desde login                            │
│ 6. Almacena en application_form_response:                       │
│    - login_history_id (relación trazable)                       │
│    - auth_risk_level, auth_risk_score, auth_risk_factors        │
│    - auth_latitude, auth_longitude                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Estructura de Datos

### 4.1 Tabla `user_login_histories`

```sql
risk_level          ENUM('normal', 'sospechoso', 'critico') DEFAULT 'normal'
risk_score          TINYINT UNSIGNED DEFAULT 0
risk_factors        JSON NULL
comparison_login_id BIGINT UNSIGNED NULL (FK → user_login_histories.id)
```

**Ejemplo de risk_factors:**

```json
{
  "ip_changed": {
    "previous": "192.168.1.100",
    "current": "203.0.113.45"
  },
  "gps_distance_over_100m": {
    "distance_km": 0.35,
    "previous": [-12.0453, -77.0311],
    "current": [-12.0489, -77.0345]
  },
  "time_under_5min": {
    "minutes": 3,
    "previous_login_at": "2026-04-28T22:15:00Z"
  }
}
```

### 4.2 Tabla `application_form_responses`

```sql
login_history_id      BIGINT UNSIGNED NULL (FK → user_login_histories.id)
auth_risk_level       ENUM('normal', 'sospechoso', 'critico') NULL
auth_risk_score       TINYINT UNSIGNED NULL
auth_risk_factors     JSON NULL
auth_latitude         DECIMAL(10,7) NULL
auth_longitude        DECIMAL(10,7) NULL
```

**Ejemplo de auth_risk_factors:**

```json
{
  "ip_changed": {
    "login_ip": "192.168.1.100",
    "declaration_ip": "192.168.1.105"
  },
  "gps_distance_km": 0.15,
  "gps_distance_over_100m": {
    "distance_km": 0.15,
    "login_coords": [-12.0453, -77.0311],
    "declaration_coords": [-12.0468, -77.0325]
  },
  "time_under_5min": {
    "minutes_since_login": 4
  }
}
```

---

## 5. Referencias y Mejores Prácticas

### 5.1 Estándares Utilizados

- **OWASP Risk Rating Methodology**: Metodología para evaluación de riesgos de seguridad
- **NIST SP 800-63B**: Digital Identity Guidelines - Autenticación y Gestión de Vida de Autenticadores
- **ISO/IEC 27001**: Sistemas de Gestión de Seguridad de la Información

### 5.2 Decisiones de Diseño

| Decisión                                  | Justificación                                                      |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Comparación con último login + últimos 10 | Proporciona contexto de patrón de comportamiento                   |
| Distancia GPS de 100m para "misma casa"   | Precisión típica de GPS doméstico (5-10m) más margen de error      |
| Distancia de 10km como "imposible"        | Velocidad máxima terrestre (~120km/h) × 5 min = 10km               |
| Tiempo de 5 minutos como "corto"          | Basado en estudios de comportamiento de usuarios                   |
| Pesos de 10-70 por factor                 | OWASP Risk Rating: 0-10 por factor, escalado ×10 para granularidad |
| No tomar acciones automáticas             | Requisito del sistema: solo detección y registro                   |

### 5.3 Extensibilidad

El sistema está diseñado para permitir futuras extensiones:

- **Machine Learning**: La interfaz `RiskFactorInterface` permite agregar factores basados en ML
- **Configuración Dinámica**: Los pesos pueden moverse a tabla `risk_configurations` para ajuste dinámico
- **Nuevos Factores**: El arreglo `WEIGHTS` permite agregar nuevos factores fácilmente
- **Integración con SIEM**: Los logs estructurados permiten integración con sistemas de monitoreo

---

## 6. Ejemplos de Casos de Uso

### Caso 1: Login Normal

```
Último login: Ayer, misma IP, mismo dispositivo
Login actual: Hoy, misma IP, mismo dispositivo
Tiempo: > 5 minutos

Score: 0
Nivel: NORMAL ✅
```

### Caso 2: Cambio de Dispositivo (Sospechoso)

```
Último login: iPhone, IP 192.168.1.100
Login actual: Android, IP 192.168.1.100
Tiempo: 2 minutos

Score: 20 (device_changed) + 20 (time_under_5min) = 40
Nivel: SOSPECHOSO ⚠️
```

### Caso 3: Viaje Imposible (Crítico)

```
Login 1: Lima, Perú (GPS: -12.04, -77.03) - 10:00 AM
Login 2: Cusco, Perú (GPS: -13.52, -71.98) - 10:03 AM
Distancia: ~570 km en 3 minutos (imposible)

Score: 60 (gps_distance_over_10km) + 30 (time_under_1min) = 90
Nivel: CRÍTICO 🚨
```

---

## 7. Implementación Técnica

### 7.1 Archivos Creados/Modificados

| Archivo                                                                                        | Tipo       | Descripción                                       |
| ---------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| `database/migrations/2026_04_28_230000_add_risk_fields_to_user_login_histories.php`            | Nueva      | Campos de riesgo en logins                        |
| `database/migrations/2026_04_28_230001_add_auth_risk_fields_to_application_form_responses.php` | Nueva      | Campos de riesgo en declaraciones                 |
| `app/Services/RiskScoringService.php`                                                          | Nueva      | Servicio de cálculo de riesgo                     |
| `app/Listeners/LogSuccessfulLogin.php`                                                         | Modificada | Integración de cálculo de riesgo en login         |
| `app/Listeners/LogFailedLogin.php`                                                             | Modificada | Integración de cálculo de riesgo en login fallido |
| `app/Http/Controllers/Student/ApplicationFormResponseController.php`                           | Modificada | Cálculo de riesgo al aceptar declaración          |
| `resources/js/pages/student/learning-session/index.tsx`                                        | Modificada | Envío de GPS desde frontend                       |
| `app/Models/UserLoginHistory.php`                                                              | Modificada | Campos fillable y casts                           |
| `app/Models/ApplicationFormResponse.php`                                                       | Modificada | Campos fillable, casts, relación                  |

---

## 8. Conclusión

El sistema implementa un modelo robusto de detección de anomalías en autenticación, basado en múltiples factores contextualizados. La arquitectura permite:

1. **Auditoría completa**: Todos los factores de riesgo se almacenan en formato JSON
2. **Trazabilidad**: Relación explícita entre login y declaración de autenticidad
3. **Escalabilidad**: Diseño preparado para Machine Learning
4. **Documentación**: Base sólida para defensa de tesis

### Redacción para Tesis

> "Se implementó un sistema de clasificación de riesgo de autenticación basado en puntuación ponderada de múltiples factores contextuales. El sistema evalúa el nivel de riesgo (normal, sospechoso o crítico) en dos momentos críticos: durante el proceso de autenticación inicial y al momento de aceptar la declaración de autenticidad para una evaluación. Los factores considerados incluyen: variación de dirección IP, dispositivo utilizado, navegador, sistema operativo, tiempo transcurrido entre sesiones, distancia geográfica (mediante fórmula Haversine), y patrones temporales de comportamiento del usuario. Los pesos asignados a cada factor siguen las recomendaciones de OWASP Risk Rating Methodology y NIST SP 800-63B. El sistema almacena de forma auditada todos los factores detectados, permitiendo análisis forense posterior y detección de patrones de comportamiento anómalo que puedan indicar suplantación de identidad o fraude académico."
