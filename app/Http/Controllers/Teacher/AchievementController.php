<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AchievementController extends Controller
{
    /**
     * Display a listing of students with their achievements.
     */
    public function index()
    {
        $students = User::role('student')
            ->select([
                'users.id',
                'users.name',
                DB::raw('(SELECT c.grade 
                          FROM enrollments e 
                          JOIN classrooms c ON c.id = e.classroom_id 
                          WHERE e.student_id = users.id 
                          ORDER BY e.created_at DESC 
                          LIMIT 1) as grade'),
                DB::raw('(SELECT c.section 
                          FROM enrollments e 
                          JOIN classrooms c ON c.id = e.classroom_id 
                          WHERE e.student_id = users.id 
                          ORDER BY e.created_at DESC 
                          LIMIT 1) as section'),
                DB::raw('(SELECT COUNT(*) 
                          FROM student_achievements sa 
                          JOIN students s2 ON sa.student_id = s2.user_id 
                          WHERE s2.user_id = users.id) as achievements_count'),
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('teacher/achievements/components/index', [
            'students' => $students,
            'filters' => request()->only(['search']),
        ]);
    }

    /**
     * Store a newly created achievement for a student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'achievement_id' => 'required|exists:achievements,id',
            'comment' => 'nullable|string|max:500',
        ]);

        $student = User::findOrFail($validated['student_id']);

        // Asignar logro al estudiante
        $student->achievements()->attach($validated['achievement_id'], [
            'assigned_by' => auth()->id(),
            'comment' => $validated['comment'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Logro asignado correctamente.');
    }

    /**
     * Display the specified student's achievements.
     */
    public function show($id)
    {
        $student = User::with(['achievements' => function ($query) {
            $query->withPivot('assigned_by', 'comment', 'created_at')->orderBy('pivot_created_at', 'desc');
        }])->findOrFail($id);

        return response()->json([
            'student' => $student,
            'achievements' => $student->achievements->map(function ($achievement) {
                return [
                    'id' => $achievement->id,
                    'name' => $achievement->name,
                    'points' => $achievement->points,
                    'assigned_by' => $achievement->pivot->assignedBy->name ?? 'Sistema',
                    'comment' => $achievement->pivot->comment,
                    'date' => $achievement->pivot->created_at->format('Y-m-d H:i'),
                ];
            }),
        ]);
    }

    /**
     * Get available achievements for dropdown.
     */
    public function getAchievements()
    {
        $achievements = Achievement::select('id', 'name', 'points')
            ->orderBy('name')
            ->get();

        return response()->json($achievements);
    }
}
