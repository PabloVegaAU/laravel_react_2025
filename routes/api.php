<?php

use App\Http\Controllers\Api\ApiController;
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

Route::post('achievementassign', [ApiController::class, 'achievementassign']);
Route::post('achievementassigntwo', [ApiController::class, 'achievementassigntwo']);
Route::post('achievementtogglestatus', [ApiController::class, 'achievementtogglestatus']);
Route::post('achievementslist', [ApiController::class, 'achievementslist']);
Route::post('avatargra', [ApiController::class, 'avatargra']);
Route::post('avatarlistforpurchase', [ApiController::class, 'avatarlistforpurchase']);
Route::post('avatarpurchase', [ApiController::class, 'avatarpurchase']);
Route::post('avatartogglestatus', [ApiController::class, 'avatartogglestatus']);
Route::post('avatarslist', [ApiController::class, 'avatarslist']);
Route::post('backgroundgra', [ApiController::class, 'backgroundgra']);
Route::post('backgroundlistforpurchase', [ApiController::class, 'backgroundlistforpurchase']);
Route::post('backgroundpurchase', [ApiController::class, 'backgroundpurchase']);
Route::post('backgroundtogglestatus', [ApiController::class, 'backgroundtogglestatus']);
Route::post('backgroundslist', [ApiController::class, 'backgroundslist']);
Route::post('prizegra', [ApiController::class, 'prizegra']);
Route::post('prizelistforpurchase', [ApiController::class, 'prizelistforpurchase']);
Route::post('prizepurchase', [ApiController::class, 'prizepurchase']);
Route::post('prizetogglestatus', [ApiController::class, 'prizetogglestatus']);
Route::post('prizeslist', [ApiController::class, 'prizeslist']);
Route::post('studentachievementslist', [ApiController::class, 'studentachievementslist']);
Route::post('studentavatarapply', [ApiController::class, 'studentavatarapply']);
Route::post('studentavatarslist', [ApiController::class, 'studentavatarslist']);
Route::post('studentbackgroundapply', [ApiController::class, 'studentbackgroundapply']);
Route::post('studentbackgroundslist', [ApiController::class, 'studentbackgroundslist']);
Route::post('studentprizeshistory', [ApiController::class, 'studentprizeshistory']);
Route::post('studentprofile', [ApiController::class, 'studentprofile']);
Route::post('studentprofileupd', [ApiController::class, 'studentprofileupd']);
Route::post('studentprogressbar', [ApiController::class, 'studentprogressbar']);
Route::post('studentprogressupd', [ApiController::class, 'studentprogressupd']);
Route::post('studentssearch', [ApiController::class, 'studentssearch']);
Route::post('getstudentbyuserid', [ApiController::class, 'getstudentbyuserid']);
