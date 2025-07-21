<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PrizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $prizes = Prize::orderBy('created_at', 'desc')->get();

            return response()->json(['success' => true, 'data' => $prizes]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch prizes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'stock' => 'required|integer|min:0',
                'points_cost' => 'required|integer|min:0',
                'is_active' => 'boolean',
                'available_until' => 'nullable|date',
            ]);

            // Handle file upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = Str::random(20).'.'.$image->getClientOriginalExtension();
                $path = $image->storeAs('prizes', $imageName, 'public');
                $validated['image'] = $path;
            }

            $prize = Prize::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Prize created successfully',
                'data' => $prize,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create prize',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $prize = Prize::findOrFail($id);

            return response()->json(['success' => true, 'data' => $prize]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Prize not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch prize',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $prize = Prize::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'stock' => 'sometimes|integer|min:0',
                'points_cost' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean',
                'available_until' => 'nullable|date',
            ]);

            // Handle file upload if new image is provided
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($prize->image && Storage::disk('public')->exists($prize->image)) {
                    Storage::disk('public')->delete($prize->image);
                }

                $image = $request->file('image');
                $imageName = Str::random(20).'.'.$image->getClientOriginalExtension();
                $path = $image->storeAs('prizes', $imageName, 'public');
                $validated['image'] = $path;
            }

            $prize->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Prize updated successfully',
                'data' => $prize,
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Prize not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update prize',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $prize = Prize::findOrFail($id);

            // Delete associated image if exists
            if ($prize->image && Storage::disk('public')->exists($prize->image)) {
                Storage::disk('public')->delete($prize->image);
            }

            $prize->delete();

            return response()->json([
                'success' => true,
                'message' => 'Prize deleted successfully',
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Prize not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete prize',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
