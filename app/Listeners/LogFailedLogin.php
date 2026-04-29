<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\UserLoginHistory;
use App\Services\LoginTrackerService;
use Illuminate\Auth\Events\Failed;
use Illuminate\Http\Request;

class LogFailedLogin
{
    protected $request;

    protected $tracker;

    public function __construct(Request $request, LoginTrackerService $tracker)
    {
        $this->request = $request;
        $this->tracker = $tracker;
    }

    public function handle(Failed $event): void
    {
        $credentials = $event->credentials;
        $ipAddress = $this->request->ip();
        $userAgent = $this->request->userAgent();

        $userId = null;
        $failureReason = 'invalid_credentials';

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

        UserLoginHistory::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'browser' => $deviceInfo['browser'],
            'operating_system' => $deviceInfo['os'],
            'device_type' => $deviceInfo['device'],
            'country' => $geo['country'],
            'city' => $geo['city'],
            'status' => 'failed',
            'login_at' => now(),
            'failure_reason' => $failureReason,
            'is_suspicious' => false,
        ]);
    }
}
