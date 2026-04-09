<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use App\Traits\HandlesImageStorage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvatarController extends Controller
{
    use HandlesImageStorage;

    public function index()
    {
        $query = Avatar::query();

        // Handle search query
        if (request()->has('search') && ! empty(request('search'))) {
            $search = '%'.request('search').'%';
            $query->where('name', 'like', $search)
                ->orWhere('price', 'like', $search);
        }

        $avatars = $query->latest()->paginate(10);

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
            'level_required' => 'required|integer|exists:levels,id',
        ]);

        try {
            $imagePath = $this->storeImage($request->file('image_url'), 'avatars', null, 's3');

            $avatar = Avatar::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'is_active' => $validated['is_active'],
                'image_url' => $imagePath,
                'level_required' => $validated['level_required'],
            ]);

            return redirect()->route('admin.avatars.index')
                ->with('success', 'Avatar creado exitosamente.');
        } catch (\Exception $e) {
            \Log::error('Error creando avatar', [
                'message' => $e->getMessage(),
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

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
        $levelId = $request->input('level_required');
        if ($levelId !== null) {
            $request->merge(['level_required' => $levelId]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'image_url' => 'nullable|image|max:2048',
            'level_required' => 'required|integer|exists:levels,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'price' => $validated['price'],
            'is_active' => $validated['is_active'],
            'level_required' => $validated['level_required'],
        ];

        if ($request->hasFile('image_url')) {
            if ($avatar->image_url) {
                $this->deleteImage($avatar->image_url);
            }
            $updateData['image_url'] = $this->storeImage($request->file('image_url'), 'avatars', null, 's3');
        }

        $avatar->update($updateData);

        return redirect()->route('admin.avatars.index')
            ->with('success', 'Avatar actualizado exitosamente.');
    }

    public function destroy(Avatar $avatar)
    {
        if ($avatar->image_url) {
            $this->deleteImage($avatar->image_url);
        }

        $avatar->delete();

        return redirect()->route('admin.avatars.index')
            ->with('success', 'Avatar eliminado exitosamente.');
    }
}
