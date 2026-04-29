<?php

namespace App\Listeners;

use App\Models\UserLoginHistory;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;

class LogSuccessfulLogin
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function handle(Login $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user;
        $ipAddress = $this->request->ip();
        $userAgent = $this->request->userAgent();

        UserLoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'status' => 'success',
            'login_at' => now(),
            'is_suspicious' => $this->isSuspicious($user, $ipAddress),
        ]);
    }

    private function isSuspicious($user, $ipAddress): bool
    {
        $lastLogin = UserLoginHistory::where('user_id', $user->id)
            ->where('status', 'success')
            ->latest('login_at')
            ->first();

        if (! $lastLogin) {
            return false;
        }

        return $lastLogin->ip_address !== $ipAddress;
    }
}
