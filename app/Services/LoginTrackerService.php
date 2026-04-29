<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserLoginHistory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LoginTrackerService
{
    /**
     * Parse User-Agent string to extract device information.
     */
    public function parseUserAgent(string $userAgent): array
    {
        $browser = 'Unknown';
        $os = 'Unknown';
        $deviceType = 'desktop';

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
                $deviceType = 'tablet';
            } else {
                $deviceType = 'mobile';
            }
        }

        return [
            'browser' => $browser,
            'os' => $os,
            'device' => $deviceType,
        ];
    }

    /**
     * Get geolocation from IP address using ip-api.com (free tier).
     */
    public function getGeolocation(string $ip): array
    {
        // For local development, use a test IP to verify geolocation works
        if (config('app.env') === 'local' && ($ip === '127.0.0.1' || $ip === '::1' || $this->isPrivateIp($ip))) {
            $testIp = '8.8.8.8'; // Google's public IP (Mountain View, CA, US)
            $ip = $testIp;
        }

        // Check cache first (1 hour cache)
        $cacheKey = 'geo_'.md5($ip);
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}");

            if ($response->successful() && $response->json('status') === 'success') {
                $data = [
                    'country' => $response->json('country'),
                    'city' => $response->json('city'),
                ];

                // Cache for 1 hour
                Cache::put($cacheKey, $data, 3600);

                return $data;
            }
        } catch (\Exception $e) {
            Log::warning("Failed to get geolocation for IP: {$ip}", [
                'error' => $e->getMessage(),
            ]);
        }

        return [
            'country' => null,
            'city' => null,
        ];
    }

    /**
     * Check if IP is private/local.
     */
    private function isPrivateIp(string $ip): bool
    {
        $privateRanges = [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
        ];

        foreach ($privateRanges as $range) {
            if ($this->ipInRange($ip, $range)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if IP is in a given range.
     */
    private function ipInRange(string $ip, string $range): bool
    {
        [$range, $netmask] = explode('/', $range, 2);
        $rangeDecimal = ip2long($range);
        $ipDecimal = ip2long($ip);
        $wildcardDecimal = pow(2, 32 - $netmask) - 1;
        $netmaskDecimal = ~$wildcardDecimal;

        return ($ipDecimal & $netmaskDecimal) === ($rangeDecimal & $netmaskDecimal);
    }

    /**
     * Check if login is already recorded in current session.
     */
    public function isAlreadyLogged(int $userId, string $sessionKey): bool
    {
        return session()->has($sessionKey);
    }

    /**
     * Check if login time is unusual for the user.
     */
    public function isUnusualTime(int $userId, \Carbon\Carbon $loginTime): bool
    {
        // Get user's login history from last 30 days
        $recentLogins = UserLoginHistory::where('user_id', $userId)
            ->where('status', 'success')
            ->where('login_at', '>=', now()->subDays(30))
            ->get();

        if ($recentLogins->count() < 5) {
            // Not enough data to determine usual time
            return false;
        }

        // Calculate average login hour
        $hours = $recentLogins->pluck('login_at')->map(function ($date) {
            return $date->hour;
        });

        $avgHour = $hours->sum() / $hours->count();
        $currentHour = $loginTime->hour;

        // Check if current hour is more than 3 hours from average
        return abs($currentHour - $avgHour) > 3;
    }

    /**
     * Evaluate if login is suspicious based on multiple criteria.
     */
    public function evaluateSuspicious(
        User $user,
        string $ip,
        array $deviceInfo,
        ?UserLoginHistory $lastLogin
    ): bool {
        $suspiciousReasons = [];

        if (! $lastLogin) {
            // First login - not suspicious
            return false;
        }

        // Criterion 1: IP different (High priority)
        if ($lastLogin->ip_address !== $ip) {
            $suspiciousReasons[] = 'ip_changed';
        }

        // Criterion 2: Country different (High priority)
        if ($lastLogin->country && $deviceInfo['country'] && $lastLogin->country !== $deviceInfo['country']) {
            $suspiciousReasons[] = 'country_changed';
        }

        // Criterion 3: Device type different (Medium priority)
        if ($lastLogin->device_type && $deviceInfo['device'] && $lastLogin->device_type !== $deviceInfo['device']) {
            $suspiciousReasons[] = 'device_changed';
        }

        // Criterion 4: OS different (Medium priority)
        if ($lastLogin->operating_system && $deviceInfo['os'] && $lastLogin->operating_system !== $deviceInfo['os']) {
            $suspiciousReasons[] = 'os_changed';
        }

        // Criterion 5: Unusual time (Low priority)
        if ($this->isUnusualTime($user->id, now())) {
            $suspiciousReasons[] = 'unusual_time';
        }

        // Log suspicious reasons for debugging
        if (! empty($suspiciousReasons)) {
            Log::info("Suspicious login detected for user {$user->id}", [
                'reasons' => $suspiciousReasons,
                'ip' => $ip,
                'last_ip' => $lastLogin->ip_address,
            ]);
        }

        // Consider suspicious if ANY high priority criterion is met
        // OR if 2+ medium/low priority criteria are met
        $highPriorityCount = count(array_intersect($suspiciousReasons, ['ip_changed', 'country_changed']));
        $otherCount = count($suspiciousReasons) - $highPriorityCount;

        return $highPriorityCount > 0 || $otherCount >= 2;
    }
}
