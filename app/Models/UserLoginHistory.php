<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLoginHistory extends Model
{
    use HasFactory;

    protected $table = 'user_login_histories';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'session_id',
        'browser',
        'operating_system',
        'device_type',
        'country',
        'city',
        'status',
        'login_at',
        'logged_out_at',
        'duration_minutes',
        'is_suspicious',
        'failure_reason',
    ];

    protected $casts = [
        'login_at' => 'datetime',
        'logged_out_at' => 'datetime',
        'is_suspicious' => 'boolean',
    ];

    /**
     * Get the user that owns this login history entry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope for successful logins.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    /**
     * Scope for failed logins.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope for suspicious logins.
     */
    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    /**
     * Scope for recent logins.
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('login_at', '>=', now()->subDays($days));
    }

    /**
     * Scope for active sessions (not logged out yet).
     */
    public function scopeActive($query)
    {
        return $query->whereNull('logged_out_at');
    }

    /**
     * Get the last successful login for a user.
     */
    public static function getLastSuccessful(int $userId): ?self
    {
        return self::where('user_id', $userId)
            ->where('status', 'success')
            ->latest('login_at')
            ->first();
    }

    /**
     * Get formatted duration.
     */
    public function getDurationFormattedAttribute(): ?string
    {
        if ($this->duration_minutes === null) {
            return null;
        }

        if ($this->duration_minutes < 60) {
            return $this->duration_minutes.' min';
        }

        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        return $hours.'h '.$minutes.'min';
    }
}
