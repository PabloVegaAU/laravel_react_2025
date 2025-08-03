<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Student\ApplicationFormResponseController as StudentApplicationFormResponseController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\LearningSessionController as StudentLearningSessionController;
use App\Http\Controllers\Student\ProfileController as StudentProfileController;
use App\Http\Controllers\Student\StoreController as StudentStoreController;
use App\Http\Controllers\Teacher\AchievementController as TeacherAchievementController;
use App\Http\Controllers\Teacher\ApplicationFormController as TeacherApplicationFormController;
use App\Http\Controllers\Teacher\ApplicationFormResponseController as TeacherApplicationFormResponseController;
use App\Http\Controllers\Teacher\AvatarController as TeacherAvatarController;
use App\Http\Controllers\Teacher\BackgroundController as TeacherBackgroundController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\LearningSessionController as TeacherLearningSessionController;
use App\Http\Controllers\Teacher\PrizeController as TeacherPrizeController;
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
    Route::resource('admin/teachers', AdminTeacherController::class)->names('admin.teachers');
    Route::resource('admin/students', AdminStudentController::class)->names('admin.students');

    // routes teacher
    Route::get('teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacher.dashboard');

    // Rutas para la gestión de logros
    // REALIZADO POR CARLOS
    Route::prefix('teacher/achievements')->name('teacher.achievements.')->group(function () {
        Route::get('/', [TeacherAchievementController::class, 'index'])->name('index');
        Route::post('/', [TeacherAchievementController::class, 'store'])->name('store');
        Route::get('/{id}', [TeacherAchievementController::class, 'show'])->name('show');
        Route::get('/list/achievements', [TeacherAchievementController::class, 'getAchievements'])->name('list.achievements');
    });

    Route::resource('teacher/learning-sessions', TeacherLearningSessionController::class)->names(names: 'teacher.learning-sessions');
    Route::put('teacher/learning-sessions/{id}/change-status', [TeacherLearningSessionController::class, 'changeStatus'])->name(name: 'teacher.learning-sessions.edit');

    Route::resource('teacher/application-forms', TeacherApplicationFormController::class)->names('teacher.application-forms');
    Route::resource('teacher/questions', TeacherQuestionController::class)->names('teacher.questions');
    Route::post('teacher/questions/{id}/update', [TeacherQuestionController::class, 'update'])->name('teacher.questions.update');
    Route::resource('teacher/application-form-responses', TeacherApplicationFormResponseController::class)->names('teacher.application-form-responses');

    // Rutas para la gestión de fondos
    // REALIZADO POR CARLOS
    Route::resource('teacher/backgrounds', TeacherBackgroundController::class)
        ->names('teacher.backgrounds');

    // Rutas para la gestión de premios
    // REALIZADO POR CARLOS
    Route::resource('teacher/prizes', TeacherPrizeController::class)
        ->names('teacher.prizes');

    // Rutas para la gestión de avatares
    // REALIZADO POR CARLOS
    Route::resource('teacher/avatars', TeacherAvatarController::class)
        ->names('teacher.avatars');

    // routes student
    Route::get('student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');

    // REALIZADO POR CARLOS
    Route::get('student/store', [StudentStoreController::class, 'index'])->name('student.store');
    Route::get('student/store/avatars', [StudentStoreController::class, 'avatars'])->name('student.store.avatars');
    Route::get('student/store/backgrounds', [StudentStoreController::class, 'backgrounds'])->name('student.store.backgrounds');
    Route::get('student/store/rewards', [StudentStoreController::class, 'rewards'])->name('student.store.rewards');
    // REALIZADO POR CARLOS
    Route::get('student/profile', [StudentProfileController::class, 'index'])->name('student.profile');
    Route::get('student/objects', [StudentProfileController::class, 'objects'])->name('student.objects');

    // REALIZADO POR CARLOS
    Route::resource('student/learning-sessions', StudentLearningSessionController::class)->names('student.learning-sessions');
    Route::resource('student/application-form-responses', StudentApplicationFormResponseController::class)->names('student.application-form-responses');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
