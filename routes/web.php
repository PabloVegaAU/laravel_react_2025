<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Teacher\ApplicationFormController as TeacherApplicationFormController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\QuestionController as TeacherQuestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/user/permissions', function (Request $request) {
        return response()->json([
            'roles' => $request->user()?->getRoleNames(),
            'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
        ]);
    })->name('roles-permissions');

    // routes admin
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // routes teacher
    Route::get('teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacher.dashboard');
    Route::resource('teacher/questions', TeacherQuestionController::class)->names('teacher.questions');
    Route::resource('teacher/application-forms', TeacherApplicationFormController::class)->names('teacher.application-forms');

    // routes student
    Route::get('student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
