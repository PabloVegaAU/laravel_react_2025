<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Background;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackgroundController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $backgrounds = Background::with('requiredLevel')
            ->latest()
            ->paginate(10);

        if (request()->wantsJson()) {
            return response()->json([
                'backgrounds' => $backgrounds,
            ]);
        }

        return Inertia::render('teacher/backgrounds/components/index', [
            'backgrounds' => $backgrounds,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $levels = Level::all(['id', 'name']);

        return response()->json([
            'levels' => $levels,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_required' => 'required|exists:levels,id',
            'points_store' => 'required|numeric|min:0',
            'image' => 'required|image|max:2048',
        ]);

        try {
            $imagePath = $request->file('image')->store('backgrounds', 'public');

            $background = Background::create([
                'name' => $validated['name'],
                'level_required' => $validated['level_required'],
                'points_store' => $validated['points_store'],
                'image' => $imagePath,
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Fondo creado exitosamente.',
                    'data' => $background->load('requiredLevel'),
                ], 201);
            }

            return redirect()->route('teacher.backgrounds.index')
                ->with('success', 'Fondo creado exitosamente.');

        } catch (\Exception $e) {
            \Log::error('Error creating background: '.$e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al crear el fondo.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return back()->with('error', 'Error al crear el fondo.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $background = Background::with('requiredLevel')->findOrFail($id);

        if (request()->wantsJson()) {
            return response()->json([
                'background' => $background,
            ]);
        }

        return Inertia::render('teacher/backgrounds/components/show', [
            'background' => $background,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $background = Background::findOrFail($id);
        $levels = Level::all(['id', 'name']);

        return response()->json([
            'background' => $background,
            'levels' => $levels,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $background = Background::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_required' => 'required|exists:levels,id',
            'points_store' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'level_required' => $validated['level_required'],
            'points_store' => $validated['points_store'],
        ];

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($background->image) {
                Storage::disk('public')->delete($background->image);
            }
            $updateData['image'] = $request->file('image')->store('backgrounds', 'public');
        }

        $background->update($updateData);

        return redirect()->route('teacher.backgrounds.index')
            ->with('success', 'Fondo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Background $background)
    {
        if ($background->image) {
            Storage::disk('public')->delete($background->image);
        }

        $background->delete();

        return redirect()->route('teacher.backgrounds.index')
            ->with('success', 'Fondo eliminado exitosamente.');
    }
}
