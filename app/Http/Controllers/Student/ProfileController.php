<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $studentId = $user->id;

        return Inertia::render('student/profile/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }

    /**
     * Display the user's objects.
     */
    public function objects()
    {
        $user = auth()->user();
        $studentId = $user->id;

        return Inertia::render('student/objects/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $studentId,
            ],
        ]);
    }
}
