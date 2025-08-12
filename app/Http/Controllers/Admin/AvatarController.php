<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AvatarController extends Controller
{
    public function index()
    {
        $avatars = Avatar::latest()->paginate(10);

        if (request()->wantsJson()) {
            return response()->json([
                'avatars' => $avatars,
            ]);
        }

        return Inertia::render('admin/avatars/index', [
            'avatars' => $avatars,
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
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'image_url' => 'required|image|max:2048',
            'level_required' => 'nullable|integer|exists:levels,id',
        ]);

        try {
            $imagePath = $request->file('image_url')->store('avatars', 'public');
            $imagePath = Storage::url($imagePath);

            $avatar = Avatar::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'is_active' => $validated['is_active'],
                'image_url' => $imagePath,
                'level_required' => $validated['level_required'] ?? null,
            ]);

            return redirect()->route('admin.avatars.index')
                ->with('success', 'Avatar creado exitosamente.');
        } catch (\Exception $e) {
            \Log::error('Error creando avatar: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el avatar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        $avatar = Avatar::findOrFail($id);

        return response()->json([
            'avatar' => $avatar,
        ]);
    }

    public function edit(string $id)
    {
        $avatar = Avatar::findOrFail($id);

        return response()->json([
            'avatar' => $avatar,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $avatar = Avatar::findOrFail($id);
        $levelId = $request->input('level_required') ?? $request->input('required_level_id');
        if (! is_null($levelId)) {
            $request->merge(['level_required' => $levelId]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'image_url' => 'nullable|image|max:2048',
            'level_required' => 'nullable|integer|exists:levels,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'price' => $validated['price'],
            'is_active' => $validated['is_active'],
            'level_required' => $validated['level_required'],
        ];

        if ($request->hasFile('image_url')) {
            if ($avatar->image_url) {
                Storage::disk('public')->delete($avatar->image_url);
            }
            $path = $request->file('image_url')->store('avatars', 'public');
            $updateData['image_url'] = Storage::url($path);
        }

        $avatar->update($updateData);

        return redirect()->route('admin.avatars.index')
            ->with('success', 'Avatar actualizado exitosamente.');
    }

    public function destroy(Avatar $avatar)
    {
        if ($avatar->image_url) {
            Storage::disk('public')->delete($avatar->image_url);
        }

        $avatar->delete();

        return redirect()->route('admin.avatars.index')
            ->with('success', 'Avatar eliminado exitosamente.');
    }
}
