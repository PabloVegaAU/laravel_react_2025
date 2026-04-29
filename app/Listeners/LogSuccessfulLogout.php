<?php

namespace App\Listeners;

use App\Models\UserLoginHistory;
use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    public function handle(Logout $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user;

        // If no user (guest), skip
        if (! $user) {
            return;
        }

        // Find the most recent login without logout timestamp
        $login = UserLoginHistory::where('user_id', $user->id)
            ->where('status', 'success')
            ->whereNull('logged_out_at')
            ->latest('login_at')
            ->first();

        if ($login) {
            // Calculate duration in minutes
            $durationMinutes = $login->login_at->diffInMinutes(now());

            // Update the login record with logout info
            $login->update([
                'logged_out_at' => now(),
                'duration_minutes' => $durationMinutes,
            ]);
        }
    }
}
