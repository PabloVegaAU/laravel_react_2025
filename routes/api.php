<?php

use App\Http\Controllers\Api\LevelController;
use App\Http\Controllers\Api\PrizeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Levels API routes
Route::prefix('levels')->group(function () {
    Route::get('/', [LevelController::class, 'index']);
    Route::post('/', [LevelController::class, 'store']);
    Route::get('/{id}', [LevelController::class, 'show']);
    Route::put('/{id}', [LevelController::class, 'update']);
    Route::delete('/{id}', [LevelController::class, 'destroy']);
});

// Prizes API routes
Route::prefix('prizes')->group(function () {
    Route::get('/', [PrizeController::class, 'index']);
    Route::post('/', [PrizeController::class, 'store']);
    Route::get('/{id}', [PrizeController::class, 'show']);
    Route::put('/{id}', [PrizeController::class, 'update']);
    Route::delete('/{id}', [PrizeController::class, 'destroy']);
});

// Avatars API routes
Route::prefix('avatars')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\AvatarController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\Api\AvatarController::class, 'store']);
    Route::get('/{id}', [\App\Http\Controllers\Api\AvatarController::class, 'show']);
    Route::put('/{id}', [\App\Http\Controllers\Api\AvatarController::class, 'update']);
    Route::delete('/{id}', [\App\Http\Controllers\Api\AvatarController::class, 'destroy']);
});
