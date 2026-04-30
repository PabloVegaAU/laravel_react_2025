<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Services\Admin\LoginHistoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginHistoryController extends Controller
{
    public function __construct(
        private LoginHistoryService $loginHistoryService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only([
            'user_id',
            'risk_level',
            'status',
            'ip_address',
            'is_suspicious',
            'date_from',
            'date_to',
            'country',
        ]);

        $loginHistories = $this->loginHistoryService->getPaginatedLoginHistories($filters);
        $users = $this->loginHistoryService->getAllUsersForFilter();
        $riskLevels = $this->loginHistoryService->getRiskLevelOptions();
        $statusOptions = $this->loginHistoryService->getStatusOptions();
        $statistics = $this->loginHistoryService->getStatistics();

        return Inertia::render('admin/login-histories/index', [
            'login_histories' => $loginHistories,
            'users' => $users,
            'risk_levels' => $riskLevels,
            'status_options' => $statusOptions,
            'statistics' => $statistics,
            'filters' => $filters,
        ]);
    }
}
