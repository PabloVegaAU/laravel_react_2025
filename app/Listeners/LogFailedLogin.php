<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\UserLoginHistory;
use App\Services\LoginTrackerService;
use App\Services\RiskScoringService;
use Illuminate\Auth\Events\Failed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogFailedLogin
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

    public function handle(Failed $event): void
    {
        $credentials = $event->credentials;
        $ipAddress = $this->request->ip();
        $userAgent = $this->request->userAgent();

        $userId = null;
        $failureReason = 'invalid_credentials';
        $user = null;

        if (isset($credentials['name'])) {
            $user = User::where('name', $credentials['name'])->first();
            if ($user) {
                $userId = $user->id;
            } else {
                $failureReason = 'user_not_found';
            }
        }

        // Parse device information for failed logins too
        $deviceInfo = $this->tracker->parseUserAgent($userAgent);

        // Get geolocation for failed logins
        $geo = $this->tracker->getGeolocation($ipAddress);

        // Get GPS coordinates from frontend (if provided)
        $coordinates = $this->tracker->processCoordinates(
            $this->request->input('latitude'),
            $this->request->input('longitude')
        );

        // Calculate risk for failed login (if user exists)
        $riskLevel = 'normal';
        $riskScore = 0;
        $riskFactors = [];
        $comparisonLoginId = null;

        if ($user) {
            $lastLogin = UserLoginHistory::getLastSuccessful($user->id);
            $recentLogins = $this->riskScorer->getRecentLogins($user->id, 10);

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
            $riskLevel = $riskAssessment['level'];
            $riskScore = $riskAssessment['score'];
            $riskFactors = $riskAssessment['factors'];
            $comparisonLoginId = $riskAssessment['comparison_login_id'];

            // Add failure reason to risk factors
            $riskFactors['login_failed'] = $failureReason;

            // Failed login with high risk may indicate brute force or credential stuffing
            if ($riskLevel !== 'normal') {
                Log::warning('Failed login with high risk detected', [
                    'user_id' => $userId,
                    'ip' => $ipAddress,
                    'risk_level' => $riskLevel,
                    'risk_score' => $riskScore,
                    'failure_reason' => $failureReason,
                ]);
            }
        }

        UserLoginHistory::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'browser' => $deviceInfo['browser'],
            'operating_system' => $deviceInfo['os'],
            'device_type' => $deviceInfo['device'],
            'country' => $geo['country'],
            'city' => $geo['city'],
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
            'status' => 'failed',
            'login_at' => now(),
            'failure_reason' => $failureReason,
            'is_suspicious' => $riskLevel !== 'normal',
            'risk_level' => $riskLevel,
            'risk_score' => $riskScore,
            'risk_factors' => $riskFactors,
            'comparison_login_id' => $comparisonLoginId,
        ]);
    }
}
