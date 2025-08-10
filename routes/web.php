<?php

use App\Http\Controllers\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Admin\AvatarController as AdminAvatarController;
use App\Http\Controllers\Admin\BackgroundController as AdminBackgroundController;
use App\Http\Controllers\Admin\ClassroomController as AdminClassroomController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EnrollmentController as AdminEnrollmentController;
use App\Http\Controllers\Admin\PrizeController as AdminPrizeController;
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
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\LearningSessionController as TeacherLearningSessionController;
use App\Http\Controllers\Teacher\QuestionController as TeacherQuestionController;
use App\Http\Controllers\Teacher\StudentPrizeController as TeacherStudentPrizeController;
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
    Route::get('admin/teachers/classroom-curricular-area-cycles/{id}', [AdminTeacherController::class, 'classroomCurricularAreaCycles'])->name('admin.teachers.classroom-curricular-area-cycles');
    Route::resource('admin/students', AdminStudentController::class)->names('admin.students');
    Route::resource('admin/enrollments', AdminEnrollmentController::class)->names('admin.enrollments');
    Route::get('admin/students-to-enrollments', [AdminStudentController::class, 'studentToEnrollments'])->name('admin.students-to-enrollments');
    Route::get('admin/get-classrooms', [AdminClassroomController::class, 'getClassrooms'])->name('admin.classrooms');
    Route::resource('admin/achievements', AdminAchievementController::class)->names('admin.achievements');

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

    Route::resource('teacher/learning-sessions', TeacherLearningSessionController::class)->names('teacher.learning-sessions');
    Route::put('teacher/learning-sessions/{id}/change-status', [TeacherLearningSessionController::class, 'changeStatus'])->name('teacher.learning-sessions.change-status');

    Route::resource('teacher/application-forms', TeacherApplicationFormController::class)->names('teacher.application-forms');
    Route::prefix('teacher/questions')->name('teacher.questions.')->group(function () {
        Route::get('/', [TeacherQuestionController::class, 'index'])->name('index');
        Route::post('/', [TeacherQuestionController::class, 'store'])->name('store');
        Route::get('/{id}', [TeacherQuestionController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [TeacherQuestionController::class, 'edit'])->name('edit');
        Route::post('/{id}/update', [TeacherQuestionController::class, 'update'])->name('update');
        Route::delete('/{id}', [TeacherQuestionController::class, 'destroy'])->name('destroy');
    });
    Route::resource('teacher/application-form-responses', TeacherApplicationFormResponseController::class)->names('teacher.application-form-responses');
    Route::resource('teacher/student-prizes', TeacherStudentPrizeController::class)->names('teacher.student-prizes');
    Route::post('teacher/student-prizes/{id}/claim', [TeacherStudentPrizeController::class, 'claim'])->name('teacher.student-prizes.claim');

    // Rutas para la gestión de fondos
    // REALIZADO POR CARLOS
    Route::resource('admin/backgrounds', AdminBackgroundController::class)
        ->names('admin.backgrounds');

    // Rutas para la gestión de premios
    // REALIZADO POR CARLOS
    Route::resource('admin/prizes', AdminPrizeController::class)
        ->names('admin.prizes');

    // Rutas para la gestión de avatares
    // REALIZADO POR CARLOS
    Route::resource('admin/avatars', AdminAvatarController::class)
        ->names('admin.avatars');

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
