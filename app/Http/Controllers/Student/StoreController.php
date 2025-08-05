<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $studentId = $user->id;

        $enrollment = Enrollment::with('classroom')
            ->where('student_id', $studentId)
            ->where('academic_year', now()->year)
            ->first();

        if (! $enrollment) {
            return Inertia::render('student/store/index', [
                'error' => 'No estás matriculado en ningún aula este año académico.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'student_id' => $studentId,
                ],
            ]);
        }

        return Inertia::render('student/store/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }

    public function avatars()
    {
        $user = auth()->user();
        $studentId = $user->id;

        return Inertia::render('student/store/avatars', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }

    public function backgrounds()
    {
        $user = auth()->user();
        $studentId = $user->id;

        return Inertia::render('student/store/backgrounds', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }

    public function rewards()
    {
        $user = auth()->user();
        $studentId = $user->id;

        return Inertia::render('student/store/rewards', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }
}
