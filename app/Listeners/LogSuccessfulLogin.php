<?php

namespace App\Listeners;

use App\Models\UserLoginHistory;
use App\Services\LoginTrackerService;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogSuccessfulLogin
{
    protected $request;

    protected $tracker;

    public function __construct(Request $request, LoginTrackerService $tracker)
    {
        $this->request = $request;
        $this->tracker = $tracker;
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

        // 4. Get last login for comparison
        $lastLogin = UserLoginHistory::getLastSuccessful($user->id);

        // 5. Evaluate suspicious criteria
        $isSuspicious = $this->tracker->evaluateSuspicious(
            $user,
            $ipAddress,
            array_merge($deviceInfo, $geo),
            $lastLogin
        );

        // 6. Create login history record
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
            'status' => 'success',
            'login_at' => now(),
            'is_suspicious' => $isSuspicious,
        ]);

        // 7. Mark as recorded in session to prevent duplicates
        session()->put($sessionKey, true);

        // 8. Log warning if suspicious
        if ($isSuspicious) {
            Log::warning('Suspicious login detected', [
                'user_id' => $user->id,
                'ip' => $ipAddress,
                'device' => $deviceInfo,
                'geo' => $geo,
            ]);
        }
    }
}
