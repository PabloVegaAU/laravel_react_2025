<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'year' => 'nullable|integer',
            'search' => 'nullable|string|max:255',
        ]);

        $enrollments = Enrollment::with([
            'classroom',
            'student.profile',
        ])
            ->when($request->year, function ($query) use ($request) {
                return $query->where('academic_year', $request->year);
            })
            ->when($request->search, function ($query) use ($request) {
                return $query->whereHas('student.user.profile', function ($q) use ($request) {
                    $searchTerm = '%'.$request->search.'%';
                    $q->where('first_name', 'like', $searchTerm)
                        ->orWhere('last_name', 'like', $searchTerm)
                        ->orWhere('second_last_name', 'like', $searchTerm);
                });
            })
            ->latest('enrollment_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['year', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {//
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
