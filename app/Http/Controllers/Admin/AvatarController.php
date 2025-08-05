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
        ]);

        try {
            $imagePath = $request->file('image_url')->store('avatars', 'public');

            $avatar = Avatar::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'is_active' => $validated['is_active'],
                'image_url' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar creado exitosamente.',
                'data' => $avatar,
            ], 201);

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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'image_url' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'price' => $validated['price'],
            'is_active' => $validated['is_active'],
        ];

        if ($request->hasFile('image_url')) {
            if ($avatar->image_url) {
                Storage::disk('public')->delete($avatar->image_url);
            }
            $updateData['image_url'] = $request->file('image_url')->store('avatars', 'public');
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
