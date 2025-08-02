<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Prize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PrizeController extends Controller
{
    public function index()
    {
        $prizes = Prize::latest()->paginate(10);

        if (request()->wantsJson()) {
            return response()->json([
                'prizes' => $prizes,
            ]);
        }

        return Inertia::render('teacher/prizes/index', [
            'prizes' => $prizes,
        ]);
    }

    public function create()
    {
        return response()->json([]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'available_until' => 'nullable|date',
            'is_active' => 'required|boolean',
            'image' => 'required|image|max:2048',
        ]);

        try {
            $imagePath = $request->file('image')->store('prizes', 'public');

            $prize = Prize::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'points_cost' => $validated['points_cost'],
                'stock' => $validated['stock'],
                'available_until' => $validated['available_until'],
                'is_active' => $validated['is_active'],
                'image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Premio creado exitosamente.',
                'data' => $prize,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creando premio: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el premio.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        $prize = Prize::findOrFail($id);

        return response()->json([
            'prize' => $prize,
        ]);
    }

    public function edit(string $id)
    {
        $prize = Prize::findOrFail($id);

        return response()->json([
            'prize' => $prize,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $prize = Prize::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'available_until' => 'nullable|date',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'points_cost' => $validated['points_cost'],
            'stock' => $validated['stock'],
            'available_until' => $validated['available_until'],
            'is_active' => $validated['is_active'],
        ];

        if ($request->hasFile('image')) {
            if ($prize->image) {
                Storage::disk('public')->delete($prize->image);
            }
            $updateData['image'] = $request->file('image')->store('prizes', 'public');
        }

        $prize->update($updateData);

        return redirect()->route('teacher.prizes.index')
            ->with('success', 'Premio actualizado exitosamente.');
    }

    public function destroy(Prize $prize)
    {
        if ($prize->image) {
            Storage::disk('public')->delete($prize->image);
        }

        $prize->delete();

        return redirect()->route('teacher.prizes.index')
            ->with('success', 'Premio eliminado exitosamente.');
    }
}
