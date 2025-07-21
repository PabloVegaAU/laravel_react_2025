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
        return Inertia::render('student/profile/index');
    }

    /**
     * Display the user's objects.
     */
    public function objects()
    {
        return Inertia::render('student/objects/index');
    }
}
