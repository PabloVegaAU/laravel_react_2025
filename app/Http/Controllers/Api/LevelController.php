<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Level;

class LevelController extends Controller
{
    public function index()
    {
        $levels = Level::select(['id', 'name', 'level'])
            ->orderBy('level')
            ->get();

        return response()->json([
            'levels' => $levels,
        ]);
    }
}
