<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\UserLoginHistory;
use Illuminate\Auth\Events\Failed;
use Illuminate\Http\Request;

class LogFailedLogin
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function handle(Failed $event): void
    {
        $credentials = $event->credentials;
        $ipAddress = $this->request->ip();
        $userAgent = $this->request->userAgent();

        $userId = null;
        $failureReason = 'invalid_credentials';

        if (isset($credentials['email'])) {
            $user = User::where('email', $credentials['email'])->first();
            if ($user) {
                $userId = $user->id;
            } else {
                $failureReason = 'user_not_found';
            }
        }

        UserLoginHistory::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'status' => 'failed',
            'login_at' => now(),
            'failure_reason' => $failureReason,
            'is_suspicious' => false,
        ]);
    }
}
