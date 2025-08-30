<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AchievementController extends Controller
{
    /**
     * Display a listing of the achievements.
     */
    public function index()
    {
        $query = Achievement::query()
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest();

        $achievements = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/achievements/index', [
            'achievements' => $achievements,
            'filters' => request()->only(['search']),
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
     * Store a newly created achievement in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Guardar la nueva imagen
            $path = $request->file('image')->store('achievements', 'public');
            $validated['image'] = Storage::url($path);
        }

        $achievement = Achievement::create($validated);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Logro creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified achievement.
     */
    public function edit(Achievement $achievement)
    {
        return response()->json($achievement);
    }

    /**
     * Update the specified achievement in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'activo' => 'required|boolean',
                'image' => 'nullable', // Acepta tanto string (URL) como archivo
            ]);

            // Validar la imagen solo si es un archivo
            if ($request->hasFile('image')) {
                $request->validate([
                    'image' => 'image|max:2048',
                ]);
            }

            $achievement = Achievement::findOrFail($id);

            // Manejo de la imagen
            if ($request->hasFile('image')) {
                // Si existe una imagen anterior, la eliminamos
                if ($achievement->image) {
                    $oldImage = str_replace('/storage', 'public', $achievement->image);
                    Storage::delete($oldImage);
                }

                // Guardar la nueva imagen
                $path = $request->file('image')->store('achievements', 'public');
                $validated['image'] = Storage::url($path);
            }

            DB::beginTransaction();

            $achievement->update($validated);

            DB::commit();

            return back()
                ->with('success', 'Logro actualizado exitosamente');
        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                return back()
                    ->withInput()
                    ->with('error', 'Error al actualizar el logro: '.$e->getMessage())
                    ->withErrors($e->errors());
            }

            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Error al actualizar el logro: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified achievement from storage.
     */
    public function destroy(int $id)
    {
        $achievement = Achievement::findOrFail($id);

        $achievement->delete();

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Logro eliminado exitosamente');
    }
}
