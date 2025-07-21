<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AvatarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $avatars = Avatar::orderBy('created_at', 'desc')->get();

            return response()->json(['success' => true, 'data' => $avatars]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch avatars',
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
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'required|numeric|min:0',
                'is_active' => 'boolean',
            ]);

            // Handle file upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('public/avatars');
                $validated['image_url'] = Storage::url($path);
            }

            $avatar = Avatar::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Avatar created successfully',
                'data' => $avatar,
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
                'message' => 'Failed to create avatar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $avatar = Avatar::findOrFail($id);

            return response()->json(['success' => true, 'data' => $avatar]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Avatar not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch avatar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $avatar = Avatar::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'sometimes|numeric|min:0',
                'is_active' => 'sometimes|boolean',
            ]);

            // Handle file upload if image is being updated
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($avatar->image_url) {
                    $oldImage = str_replace('/storage', 'public', $avatar->image_url);
                    Storage::delete($oldImage);
                }

                $path = $request->file('image')->store('public/avatars');
                $validated['image_url'] = Storage::url($path);
            }

            $avatar->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully',
                'data' => $avatar,
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Avatar not found',
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
                'message' => 'Failed to update avatar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $avatar = Avatar::findOrFail($id);

            // Delete associated image file
            if ($avatar->image_url) {
                $imagePath = str_replace('/storage', 'public', $avatar->image_url);
                Storage::delete($imagePath);
            }

            $avatar->delete();

            return response()->json([
                'success' => true,
                'message' => 'Avatar deleted successfully',
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Avatar not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete avatar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
