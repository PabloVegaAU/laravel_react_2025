<?php

namespace App\Http\Controllers\Admin;

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

        return Inertia::render('admin/prizes/index', [
            'prizes' => $prizes,
        ]);
    }

    public function create()
    {
        return response()->json([]);
    }

    public function store(Request $request)
    {
        $levelId = $request->input('level_required') ?? $request->input('required_level_id');
        if (! is_null($levelId)) {
            $request->merge(['level_required' => $levelId]);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'available_until' => 'nullable|date',
            'is_active' => 'required|boolean',
            'image' => 'required|image|max:2048',
            'level_required' => 'nullable|integer|exists:levels,id',
        ]);

        try {
            $imagePath = $request->file('image')->store('prizes', 'public');
            $imagePath = Storage::url($imagePath);

            $prize = Prize::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'points_cost' => $validated['points_cost'],
                'stock' => $validated['stock'],
                'available_until' => $validated['available_until'] ?? null,
                'is_active' => $validated['is_active'],
                'image' => $imagePath,
                'level_required' => $validated['level_required'] ?? null,
            ]);

            return redirect()->route('admin.prizes.index')
                ->with('success', 'Premio actualizado exitosamente.');
        } catch (\Exception $e) {
            \Log::error('Error creando premio: '.$e->getMessage());

            return redirect()->route('admin.prizes.index')
                ->with('error', 'Error al crear el premio.');
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
        $levelId = $request->input('level_required') ?? $request->input('required_level_id');
        if (! is_null($levelId)) {
            $request->merge(['level_required' => $levelId]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'available_until' => 'nullable|date',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'level_required' => 'nullable|integer|exists:levels,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'points_cost' => $validated['points_cost'],
            'stock' => $validated['stock'],
            'available_until' => $validated['available_until'] ?? null,
            'is_active' => $validated['is_active'],
            'level_required' => $validated['level_required'] ?? null,
        ];

        if ($request->hasFile('image')) {
            if ($prize->image) {
                Storage::disk('public')->delete($prize->image);
            }
            $updateData['image'] = $request->file('image')->store('prizes', 'public');
            $updateData['image'] = Storage::url($updateData['image']);
        }

        $prize->update($updateData);

        return redirect()->route('admin.prizes.index')
            ->with('success', 'Premio actualizado exitosamente.');
    }

    public function destroy(Prize $prize)
    {
        if ($prize->image) {
            Storage::disk('public')->delete($prize->image);
        }

        $prize->delete();

        return redirect()->route('admin.prizes.index')
            ->with('success', 'Premio eliminado exitosamente.');
    }
}
