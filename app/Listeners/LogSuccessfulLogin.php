<?php

namespace App\Listeners;

use App\Models\UserLoginHistory;
use App\Services\LoginTrackerService;
use App\Services\RiskScoringService;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogSuccessfulLogin
{
    protected $request;

    protected $tracker;

    protected $riskScorer;

    public function __construct(Request $request, LoginTrackerService $tracker, RiskScoringService $riskScorer)
    {
        $this->request = $request;
        $this->tracker = $tracker;
        $this->riskScorer = $riskScorer;
    }

    public function handle(Login $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user;
        $ipAddress = $this->request->ip();
        $userAgent = $this->request->userAgent();

        // 1. Prevent duplicate records in same request
        $sessionKey = 'login_recorded_'.$user->id;
        if ($this->tracker->isAlreadyLogged($user->id, $sessionKey)) {
            return;
        }

        // 2. Parse device information from user agent
        $deviceInfo = $this->tracker->parseUserAgent($userAgent);

        // 3. Get geolocation from IP
        $geo = $this->tracker->getGeolocation($ipAddress);

        // 4. Get GPS coordinates from frontend
        $coordinates = $this->tracker->processCoordinates(
            $this->request->input('latitude'),
            $this->request->input('longitude')
        );

        // 5. Get last login and recent logins for comparison
        $lastLogin = UserLoginHistory::getLastSuccessful($user->id);
        $recentLogins = $this->riskScorer->getRecentLogins($user->id, 10);

        // 6. Calculate risk score with new RiskScoringService
        $currentData = [
            'ip_address' => $ipAddress,
            'country' => $geo['country'],
            'device_type' => $deviceInfo['device'],
            'browser' => $deviceInfo['browser'],
            'os' => $deviceInfo['os'],
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
        ];

        $riskAssessment = $this->riskScorer->calculateLoginRisk($user, $currentData, $lastLogin, $recentLogins);

        // 7. Evaluate legacy suspicious criteria (for backwards compatibility)
        $isSuspicious = $this->tracker->evaluateSuspicious(
            $user,
            $ipAddress,
            array_merge($deviceInfo, $geo),
            $lastLogin
        );

        // 8. Create login history record with risk assessment
        UserLoginHistory::create([
            'user_id' => $user->id,
            'session_id' => session()->getId(),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'browser' => $deviceInfo['browser'],
            'operating_system' => $deviceInfo['os'],
            'device_type' => $deviceInfo['device'],
            'country' => $geo['country'],
            'city' => $geo['city'],
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
            'status' => 'success',
            'login_at' => now(),
            'is_suspicious' => $isSuspicious || in_array($riskAssessment['level'], ['sospechoso', 'critico']),
            'risk_level' => $riskAssessment['level'],
            'risk_score' => $riskAssessment['score'],
            'risk_factors' => $riskAssessment['factors'],
            'comparison_login_id' => $riskAssessment['comparison_login_id'],
        ]);

        // 9. Mark as recorded in session to prevent duplicates
        session()->put($sessionKey, true);

        // 10. Log warning if suspicious or critical risk
        if ($isSuspicious || $riskAssessment['level'] !== 'normal') {
            Log::warning('Suspicious or high-risk login detected', [
                'user_id' => $user->id,
                'ip' => $ipAddress,
                'device' => $deviceInfo,
                'geo' => $geo,
                'coordinates' => $coordinates,
                'risk_level' => $riskAssessment['level'],
                'risk_score' => $riskAssessment['score'],
                'risk_factors' => $riskAssessment['factors'],
            ]);
        }
    }
}
