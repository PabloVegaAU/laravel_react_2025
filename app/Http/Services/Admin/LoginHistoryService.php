<?php

namespace App\Http\Services\Admin;

use App\Models\User;
use App\Models\UserLoginHistory;
use Illuminate\Pagination\LengthAwarePaginator;

class LoginHistoryService
{
    public function getPaginatedLoginHistories(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = UserLoginHistory::with(['user', 'user.profile'])
            ->orderBy('login_at', 'desc');

        // Apply filters
        $this->applyFilters($query, $filters);

        return $query->paginate($perPage)->withQueryString();
    }

    private function applyFilters($query, array $filters): void
    {
        // Filter by user
        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Filter by risk level
        if (! empty($filters['risk_level'])) {
            $query->where('risk_level', $filters['risk_level']);
        }

        // Filter by status (success/failed)
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by IP address (partial match)
        if (! empty($filters['ip_address'])) {
            $query->where('ip_address', 'like', '%'.$filters['ip_address'].'%');
        }

        // Filter by suspicious only
        if (! empty($filters['is_suspicious'])) {
            $query->where('is_suspicious', true);
        }

        // Filter by date range
        if (! empty($filters['date_from'])) {
            $query->where('login_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('login_at', '<=', $filters['date_to']);
        }

        // Filter by country
        if (! empty($filters['country'])) {
            $query->where('country', 'like', '%'.$filters['country'].'%');
        }
    }

    public function getAllUsersForFilter(): array
    {
        return User::with('profile')
            ->select('users.id', 'users.name', 'users.email')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'full_name' => $user->profile
                        ? $user->profile->first_name.' '.$user->profile->last_name
                        : $user->name,
                ];
            })
            ->toArray();
    }

    public function getRiskLevelOptions(): array
    {
        return [
            ['value' => 'all', 'label' => 'Todos'],
            ['value' => 'normal', 'label' => 'Normal'],
            ['value' => 'sospechoso', 'label' => 'Sospechoso'],
            ['value' => 'critico', 'label' => 'Crítico'],
        ];
    }

    public function getStatusOptions(): array
    {
        return [
            ['value' => 'all', 'label' => 'Todos'],
            ['value' => 'success', 'label' => 'Exitoso'],
            ['value' => 'failed', 'label' => 'Fallido'],
        ];
    }

    public function getStatistics(): array
    {
        $today = now()->startOfDay();
        $weekAgo = now()->subWeek();
        $monthAgo = now()->subMonth();

        return [
            'total_today' => UserLoginHistory::where('login_at', '>=', $today)->count(),
            'suspicious_today' => UserLoginHistory::where('login_at', '>=', $today)->where('is_suspicious', true)->count(),
            'critical_risk_today' => UserLoginHistory::where('login_at', '>=', $today)->where('risk_level', 'critico')->count(),
            'total_week' => UserLoginHistory::where('login_at', '>=', $weekAgo)->count(),
            'total_month' => UserLoginHistory::where('login_at', '>=', $monthAgo)->count(),
            'risk_distribution' => [
                'normal' => UserLoginHistory::where('risk_level', 'normal')->count(),
                'sospechoso' => UserLoginHistory::where('risk_level', 'sospechoso')->count(),
                'critico' => UserLoginHistory::where('risk_level', 'critico')->count(),
            ],
        ];
    }
}
