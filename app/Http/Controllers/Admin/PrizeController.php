<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prize;
use App\Traits\HandlesImageStorage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrizeController extends Controller
{
    use HandlesImageStorage;

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Prize::query()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest();

        $prizes = $query->paginate($perPage);

        if ($request->wantsJson()) {
            return response()->json($prizes);
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
            $imagePath = $this->storeImage($request->file('image'), 'prizes', null, 's3');

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
            \Log::error('Error creando premio', [
                'message' => $e->getMessage(),
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

            dd($e->getMessage());

            return redirect()->route('admin.prizes.index')
                ->with('error', $e->getMessage());
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
                $this->deleteImage($prize->image);
            }
            $updateData['image'] = $this->storeImage($request->file('image'), 'prizes', null, 's3');
        }

        $prize->update($updateData);

        return redirect()->route('admin.prizes.index')
            ->with('success', 'Premio actualizado exitosamente.');
    }

    public function destroy(Prize $prize)
    {
        if ($prize->image) {
            $this->deleteImage($prize->image);
        }

        $prize->delete();

        return redirect()->route('admin.prizes.index')
            ->with('success', 'Premio eliminado exitosamente.');
    }
}
