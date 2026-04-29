<?php

namespace App\Services;

use App\Models\ApplicationFormResponse;
use App\Models\User;
use App\Models\UserLoginHistory;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Servicio de Cálculo de Riesgo de Autenticación
 *
 * Implementa modelo de puntuación de riesgo basado en:
 * - OWASP Risk Rating Methodology
 * - NIST SP 800-63B (Digital Identity Guidelines)
 * - Mejores prácticas de autenticación adaptativa
 *
 * @author Pablo Vega
 * @version 1.0.0
 */
class RiskScoringService
{
    /**
     * Pesos de factores de riesgo (suma total puede exceder 100)
     * Basados en impacto de seguridad en autenticación
     */
    public const WEIGHTS = [
        'ip_changed' => 50,
        'country_changed' => 70,
        'device_changed' => 20,
        'browser_changed' => 10,
        'os_changed' => 15,
        'time_under_5min' => 20,
        'time_under_1min' => 30,
        'session_simultaneous' => 30,
        'gps_distance_over_100m' => 25,  // Misma casa/cuadra (precisión GPS)
        'gps_distance_over_1km' => 40,   // Diferente zona/barrio
        'gps_distance_over_10km' => 60,  // Imposible físicamente (viaje imposible)
        'unusual_time' => 15,
    ];

    /**
     * Umbrales de clasificación de riesgo
     */
    public const THRESHOLDS = [
        'normal' => ['min' => 0, 'max' => 20],
        'sospechoso' => ['min' => 21, 'max' => 50],
        'critico' => ['min' => 51, 'max' => 100],
    ];

    /**
     * Constantes temporales (en minutos)
     */
    public const TIME_SHORT = 5;      // Tiempo corto: 5 minutos
    public const TIME_CRITICAL = 1;   // Tiempo crítico: 1 minuto

    /**
     * Constantes de distancia GPS (en kilómetros)
     */
    public const GPS_SAME_HOUSE = 0.1;    // 100m - precisión típica GPS doméstico
    public const GPS_SAME_CITY = 1.0;      // 1km - mismo barrio/zona
    public const GPS_IMPOSSIBLE = 10.0;    // 10km - viaje imposible en tiempo corto

    /**
     * Radio de la Tierra en kilómetros (fórmula Haversine)
     */
    private const EARTH_RADIUS = 6371;

    /**
     * Calcula el riesgo de un intento de login
     *
     * @param User $user Usuario que intenta loguear
     * @param array $currentData Datos actuales del login
     * @param UserLoginHistory|null $lastLogin Último login exitoso del usuario
     * @param Collection|null $recentLogins Últimos N logins para detección de patrones
     * @return array{score: int, level: string, factors: array, comparison_login_id: int|null}
     */
    public function calculateLoginRisk(
        User $user,
        array $currentData,
        ?UserLoginHistory $lastLogin,
        ?Collection $recentLogins = null
    ): array {
        $factors = [];
        $score = 0;

        // Si no hay login anterior, es primer login - riesgo mínimo
        if (! $lastLogin) {
            return [
                'score' => 0,
                'level' => 'normal',
                'factors' => ['first_login' => true],
                'comparison_login_id' => null,
            ];
        }

        // 1. Verificar cambio de IP
        if ($lastLogin->ip_address !== $currentData['ip_address']) {
            $score += self::WEIGHTS['ip_changed'];
            $factors['ip_changed'] = [
                'previous' => $lastLogin->ip_address,
                'current' => $currentData['ip_address'],
            ];
        }

        // 2. Verificar cambio de país
        if ($lastLogin->country && isset($currentData['country'])) {
            if ($lastLogin->country !== $currentData['country']) {
                $score += self::WEIGHTS['country_changed'];
                $factors['country_changed'] = [
                    'previous' => $lastLogin->country,
                    'current' => $currentData['country'],
                ];
            }
        }

        // 3. Verificar cambio de dispositivo
        if ($lastLogin->device_type && isset($currentData['device_type'])) {
            if ($lastLogin->device_type !== $currentData['device_type']) {
                $score += self::WEIGHTS['device_changed'];
                $factors['device_changed'] = [
                    'previous' => $lastLogin->device_type,
                    'current' => $currentData['device_type'],
                ];
            }
        }

        // 4. Verificar cambio de navegador
        if ($lastLogin->browser && isset($currentData['browser'])) {
            if ($lastLogin->browser !== $currentData['browser']) {
                $score += self::WEIGHTS['browser_changed'];
                $factors['browser_changed'] = [
                    'previous' => $lastLogin->browser,
                    'current' => $currentData['browser'],
                ];
            }
        }

        // 5. Verificar cambio de sistema operativo
        if ($lastLogin->operating_system && isset($currentData['os'])) {
            if ($lastLogin->operating_system !== $currentData['os']) {
                $score += self::WEIGHTS['os_changed'];
                $factors['os_changed'] = [
                    'previous' => $lastLogin->operating_system,
                    'current' => $currentData['os'],
                ];
            }
        }

        // 6. Verificar tiempo entre logins
        $timeDiff = $this->calculateTimeDifference(now(), $lastLogin->login_at);
        if ($timeDiff !== null) {
            if ($timeDiff <= self::TIME_CRITICAL) {
                $score += self::WEIGHTS['time_under_1min'];
                $factors['time_under_1min'] = [
                    'minutes' => $timeDiff,
                    'previous_login_at' => $lastLogin->login_at->toIso8601String(),
                ];
            } elseif ($timeDiff <= self::TIME_SHORT) {
                $score += self::WEIGHTS['time_under_5min'];
                $factors['time_under_5min'] = [
                    'minutes' => $timeDiff,
                    'previous_login_at' => $lastLogin->login_at->toIso8601String(),
                ];
            }
        }

        // 7. Verificar sesiones simultáneas
        if ($recentLogins && $this->detectSimultaneousSessions($recentLogins)) {
            $score += self::WEIGHTS['session_simultaneous'];
            $factors['session_simultaneous'] = true;
        }

        // 8. Verificar distancia GPS (si hay datos)
        if ($lastLogin->latitude && $lastLogin->longitude &&
            isset($currentData['latitude']) && isset($currentData['longitude']) &&
            $currentData['latitude'] !== null && $currentData['longitude'] !== null) {

            $distance = $this->calculateDistance(
                $lastLogin->latitude,
                $lastLogin->longitude,
                $currentData['latitude'],
                $currentData['longitude']
            );

            if ($distance > self::GPS_IMPOSSIBLE) {
                $score += self::WEIGHTS['gps_distance_over_10km'];
                $factors['gps_distance_over_10km'] = [
                    'distance_km' => round($distance, 2),
                    'previous' => [$lastLogin->latitude, $lastLogin->longitude],
                    'current' => [$currentData['latitude'], $currentData['longitude']],
                ];
            } elseif ($distance > self::GPS_SAME_CITY) {
                $score += self::WEIGHTS['gps_distance_over_1km'];
                $factors['gps_distance_over_1km'] = [
                    'distance_km' => round($distance, 2),
                    'previous' => [$lastLogin->latitude, $lastLogin->longitude],
                    'current' => [$currentData['latitude'], $currentData['longitude']],
                ];
            } elseif ($distance > self::GPS_SAME_HOUSE) {
                $score += self::WEIGHTS['gps_distance_over_100m'];
                $factors['gps_distance_over_100m'] = [
                    'distance_km' => round($distance, 2),
                    'previous' => [$lastLogin->latitude, $lastLogin->longitude],
                    'current' => [$currentData['latitude'], $currentData['longitude']],
                ];
            }
        }

        // 9. Verificar hora inusual
        if ($this->isUnusualTime($user->id, now())) {
            $score += self::WEIGHTS['unusual_time'];
            $factors['unusual_time'] = [
                'current_hour' => now()->hour,
            ];
        }

        // Clasificar nivel de riesgo
        $level = $this->classifyRiskLevel($score);

        Log::info('Risk score calculated for login', [
            'user_id' => $user->id,
            'score' => $score,
            'level' => $level,
            'factors' => $factors,
        ]);

        return [
            'score' => $score,
            'level' => $level,
            'factors' => $factors,
            'comparison_login_id' => $lastLogin->id,
        ];
    }

    /**
     * Calcula el riesgo al aceptar declaración de autenticidad
     *
     * Compara datos de la declaración con el login que inició la sesión
     *
     * @param ApplicationFormResponse $response Respuesta del formulario
     * @param UserLoginHistory $loginHistory Login que inició la sesión
     * @param array $authData Datos de la declaración (IP, GPS, User-Agent, timestamp)
     * @return array{score: int, level: string, factors: array}
     */
    public function calculateAuthDeclarationRisk(
        ApplicationFormResponse $response,
        UserLoginHistory $loginHistory,
        array $authData
    ): array {
        $factors = [];
        $score = 0;

        // 1. Comparar IP
        if (isset($authData['ip_address']) && $authData['ip_address'] !== $loginHistory->ip_address) {
            $score += self::WEIGHTS['ip_changed'];
            $factors['ip_changed'] = [
                'login_ip' => $loginHistory->ip_address,
                'declaration_ip' => $authData['ip_address'],
            ];
        }

        // 2. Comparar tiempo desde login
        $timeSinceLogin = $this->calculateTimeDifference(
            $authData['timestamp'] ?? now(),
            $loginHistory->login_at
        );

        if ($timeSinceLogin !== null) {
            if ($timeSinceLogin <= self::TIME_CRITICAL) {
                $score += self::WEIGHTS['time_under_1min'];
                $factors['time_under_1min'] = [
                    'minutes_since_login' => $timeSinceLogin,
                ];
            } elseif ($timeSinceLogin <= self::TIME_SHORT) {
                $score += self::WEIGHTS['time_under_5min'];
                $factors['time_under_5min'] = [
                    'minutes_since_login' => $timeSinceLogin,
                ];
            }
        }

        // 3. Comparar User-Agent
        if (isset($authData['user_agent']) && $authData['user_agent'] !== $loginHistory->user_agent) {
            // Parsear ambos user agents para comparar componentes
            $loginDevice = $this->parseUserAgentForComparison($loginHistory->user_agent);
            $authDevice = $this->parseUserAgentForComparison($authData['user_agent']);

            if ($loginDevice['browser'] !== $authDevice['browser']) {
                $score += self::WEIGHTS['browser_changed'];
                $factors['browser_changed'] = [
                    'login_browser' => $loginDevice['browser'],
                    'declaration_browser' => $authDevice['browser'],
                ];
            }

            if ($loginDevice['os'] !== $authDevice['os']) {
                $score += self::WEIGHTS['os_changed'];
                $factors['os_changed'] = [
                    'login_os' => $loginDevice['os'],
                    'declaration_os' => $authDevice['os'],
                ];
            }

            if ($loginDevice['device'] !== $authDevice['device']) {
                $score += self::WEIGHTS['device_changed'];
                $factors['device_changed'] = [
                    'login_device' => $loginDevice['device'],
                    'declaration_device' => $authDevice['device'],
                ];
            }
        }

        // 4. Comparar GPS
        if ($loginHistory->latitude && $loginHistory->longitude &&
            isset($authData['latitude']) && isset($authData['longitude']) &&
            $authData['latitude'] !== null && $authData['longitude'] !== null) {

            $distance = $this->calculateDistance(
                $loginHistory->latitude,
                $loginHistory->longitude,
                $authData['latitude'],
                $authData['longitude']
            );

            if ($distance > self::GPS_IMPOSSIBLE) {
                $score += self::WEIGHTS['gps_distance_over_10km'];
                $factors['gps_distance_over_10km'] = [
                    'distance_km' => round($distance, 2),
                    'login_coords' => [$loginHistory->latitude, $loginHistory->longitude],
                    'declaration_coords' => [$authData['latitude'], $authData['longitude']],
                ];
            } elseif ($distance > self::GPS_SAME_CITY) {
                $score += self::WEIGHTS['gps_distance_over_1km'];
                $factors['gps_distance_over_1km'] = [
                    'distance_km' => round($distance, 2),
                    'login_coords' => [$loginHistory->latitude, $loginHistory->longitude],
                    'declaration_coords' => [$authData['latitude'], $authData['longitude']],
                ];
            } elseif ($distance > self::GPS_SAME_HOUSE) {
                $score += self::WEIGHTS['gps_distance_over_100m'];
                $factors['gps_distance_over_100m'] = [
                    'distance_km' => round($distance, 2),
                    'login_coords' => [$loginHistory->latitude, $loginHistory->longitude],
                    'declaration_coords' => [$authData['latitude'], $authData['longitude']],
                ];
            }

            // Guardar la distancia para referencia
            $factors['gps_distance_km'] = round($distance, 2);
        }

        // 5. Verificar si hay sesión simultánea
        if (! $loginHistory->logged_out_at) {
            // La sesión de login sigue activa, verificar si hay otras
            $otherActiveSessions = UserLoginHistory::where('user_id', $loginHistory->user_id)
                ->whereNull('logged_out_at')
                ->where('id', '!=', $loginHistory->id)
                ->count();

            if ($otherActiveSessions > 0) {
                $score += self::WEIGHTS['session_simultaneous'];
                $factors['session_simultaneous'] = [
                    'active_sessions_count' => $otherActiveSessions + 1,
                ];
            }
        }

        // Clasificar nivel de riesgo
        $level = $this->classifyRiskLevel($score);

        Log::info('Risk score calculated for auth declaration', [
            'user_id' => $loginHistory->user_id,
            'response_id' => $response->id,
            'score' => $score,
            'level' => $level,
            'factors' => $factors,
        ]);

        return [
            'score' => $score,
            'level' => $level,
            'factors' => $factors,
        ];
    }

    /**
     * Calcula la distancia entre dos puntos GPS usando fórmula Haversine
     *
     * Fórmula estándar en geodesia para calcular distancia sobre esfera
     *
     * @param float $lat1 Latitud punto 1 (en grados)
     * @param float $lon1 Longitud punto 1 (en grados)
     * @param float $lat2 Latitud punto 2 (en grados)
     * @param float $lon2 Longitud punto 2 (en grados)
     * @return float Distancia en kilómetros
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        // Convertir a radianes
        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLon = deg2rad($lon2 - $lon1);

        // Fórmula Haversine
        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1Rad) * cos($lat2Rad) *
             sin($deltaLon / 2) * sin($deltaLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS * $c;
    }

    /**
     * Obtiene los últimos N logins exitosos de un usuario
     *
     * @param int $userId ID del usuario
     * @param int $limit Número de logins a retornar
     * @return Collection
     */
    public function getRecentLogins(int $userId, int $limit = 10): Collection
    {
        return UserLoginHistory::where('user_id', $userId)
            ->where('status', 'success')
            ->orderBy('login_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Detecta si hay sesiones simultáneas activas
     *
     * @param Collection $recentLogins Colección de logins recientes
     * @return bool
     */
    public function detectSimultaneousSessions(Collection $recentLogins): bool
    {
        // Contar sesiones activas (sin logout)
        $activeSessions = $recentLogins->whereNull('logged_out_at')->count();

        return $activeSessions > 1;
    }

    /**
     * Calcula la diferencia de tiempo en minutos entre dos timestamps
     *
     * @param Carbon $current Timestamp actual
     * @param Carbon|null $previous Timestamp anterior
     * @return float|null Diferencia en minutos, o null si no hay timestamp anterior
     */
    public function calculateTimeDifference(Carbon $current, ?Carbon $previous): ?float
    {
        if (! $previous) {
            return null;
        }

        return $current->diffInMinutes($previous, false);
    }

    /**
     * Verifica si la hora actual es inusual para el usuario
     *
     * Basado en patrón histórico de logins (últimos 30 días)
     *
     * @param int $userId ID del usuario
     * @param Carbon $currentTime Hora a verificar
     * @return bool
     */
    public function isUnusualTime(int $userId, Carbon $currentTime): bool
    {
        // Obtener historial de logins de últimos 30 días
        $recentLogins = UserLoginHistory::where('user_id', $userId)
            ->where('status', 'success')
            ->where('login_at', '>=', now()->subDays(30))
            ->get();

        // Si hay menos de 5 logins, no hay suficiente data
        if ($recentLogins->count() < 5) {
            return false;
        }

        // Calcular hora promedio de login
        $hours = $recentLogins->pluck('login_at')->map(function ($date) {
            return $date->hour;
        });

        $avgHour = $hours->sum() / $hours->count();
        $currentHour = $currentTime->hour;

        // Considerar inusual si la diferencia es > 3 horas del promedio
        return abs($currentHour - $avgHour) > 3;
    }

    /**
     * Clasifica el nivel de riesgo según la puntuación
     *
     * @param int $score Puntuación de riesgo
     * @return string Nivel: 'normal', 'sospechoso', 'critico'
     */
    public function classifyRiskLevel(int $score): string
    {
        if ($score >= self::THRESHOLDS['critico']['min']) {
            return 'critico';
        }

        if ($score >= self::THRESHOLDS['sospechoso']['min']) {
            return 'sospechoso';
        }

        return 'normal';
    }

    /**
     * Parsea User-Agent para comparación de dispositivos
     *
     * @param string $userAgent User-Agent string
     * @return array{browser: string, os: string, device: string}
     */
    private function parseUserAgentForComparison(string $userAgent): array
    {
        $browser = 'Unknown';
        $os = 'Unknown';
        $device = 'desktop';

        // Detect Browser
        if (preg_match('/Chrome/i', $userAgent) && ! preg_match('/Edg/i', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari/i', $userAgent) && ! preg_match('/Chrome/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/Edg/i', $userAgent)) {
            $browser = 'Edge';
        } elseif (preg_match('/Opera|OPR/i', $userAgent)) {
            $browser = 'Opera';
        }

        // Detect Operating System
        if (preg_match('/Windows/i', $userAgent)) {
            $os = 'Windows';
        } elseif (preg_match('/Macintosh|Mac OS/i', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $os = 'Linux';
        } elseif (preg_match('/Android/i', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iPhone|iPad|iPod/i', $userAgent)) {
            $os = 'iOS';
        }

        // Detect Device Type
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod/i', $userAgent)) {
            if (preg_match('/iPad/i', $userAgent)) {
                $device = 'tablet';
            } else {
                $device = 'mobile';
            }
        }

        return [
            'browser' => $browser,
            'os' => $os,
            'device' => $device,
        ];
    }
}
