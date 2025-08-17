<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prize;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    // Achievement Methods
    public function achievementassign(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_achievement_id' => 'required|integer',
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $p_achievement_id = $request->has('p_achievement_id') ? (int) $request->input('p_achievement_id') : 0;
            $p_student_id = $request->has('p_student_id') ? (int) $request->input('p_student_id') : 0;

            $results = DB::select('SELECT * FROM public.spu_achievement_assign(?,?)', [
                $p_achievement_id, $p_student_id,
            ]);

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function achievementassigntwo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_achievement_id' => 'required|integer',
            'p_student_ids' => 'required|array',
            'p_student_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $p_achievement_id = (int) $request->input('p_achievement_id');
            $p_student_ids = $request->input('p_student_ids');

            // Convertir el array a formato PostgreSQL literal: {1,2,3}
            $studentIdsPgArray = '{'.implode(',', $p_student_ids).'}';

            $results = DB::select('SELECT * FROM public.spu_achievement_assign_two(?, ?)', [
                $p_achievement_id,
                $studentIdsPgArray,
            ]);

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al asignar logro(s)',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function achievementtogglestatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_achievement_id' => 'required|integer',
            'p_estado' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $p_achievement_id = $request->has('p_achievement_id') ? (int) $request->input('p_achievement_id') : 0;
            $p_estado = $request->has('p_estado') ? (int) $request->input('p_estado') : 0;

            $results = DB::select('SELECT * FROM public.spu_achievement_togglestatus(?,?)', [
                $p_achievement_id, $p_estado,
            ]);

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function achievementslist(Request $request): JsonResponse
    {
        try {
            $results = DB::select('SELECT * FROM public.spu_achievements_list()');

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getstudentbyuserid(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_achievement_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_get_student_by_userid(?)', [
                $request->p_achievement_id ?? 0,
            ]);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getstudentbyachievement(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_achievement_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_get_student_by_achievement(?)', [
                $request->p_achievement_id ?? 0,
            ]);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Avatar Methods
    public function avatargra(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'nullable|integer',
            'p_name' => 'required|string|max:255',
            'p_image_url' => 'required|string',
            'p_price' => 'required|numeric|min:0',
            'p_is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_avatar_gra(?, ?, ?, ?, ?)', [
                $request->p_id ?? 0,
                $request->p_name,
                $request->p_image_url,
                $request->p_price,
                $request->p_is_active,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function avatarlistforpurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_avatar_list_for_purchase(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de avatares',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function avatarpurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
            'p_avatar_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_avatar_purchase(?, ?)', [
                $request->p_student_id,
                $request->p_avatar_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la compra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function avatartogglestatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'required|integer',
            'p_is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_avatar_toggle_status(?, ?)', [
                $request->p_id,
                $request->p_is_active,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function avatarslist(Request $request): JsonResponse
    {
        try {
            $result = DB::select('SELECT * FROM public.spu_avatars_list()');

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de avatares',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Background Methods
    public function backgroundgra(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'nullable|integer',
            'p_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_background_gra(?, ?, ?, ?, ?)', [
                $request->p_id ?? 0,
                $request->p_name,
                $request->p_image,
                $request->p_level_required,
                $request->p_points_store,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function backgroundlistforpurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_background_list_for_purchase(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de fondos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function backgroundpurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
            'p_background_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_background_purchase(?, ?)', [
                $request->p_student_id,
                $request->p_background_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la compra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function backgroundtogglestatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'required|integer',
            'p_activo' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_background_toggle_status(?, ?)', [
                $request->p_id,
                $request->p_activo,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function backgroundslist(Request $request): JsonResponse
    {
        try {
            $result = DB::select('SELECT * FROM public.spu_backgrounds_list()');

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de fondos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Prize Methods
    public function prizegra(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'nullable|integer',
            'p_name' => 'required|string|max:255',
            'p_description' => 'required|string',
            'p_image' => 'required|string',
            'p_stock' => 'required|integer|min:0',
            'p_points_cost' => 'required|integer|min:0',
            'p_is_active' => 'required|boolean',
            'p_available_until' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_prize_gra(?, ?, ?, ?, ?, ?, ?, ?)', [
                $request->p_id ?? 0,
                $request->p_name,
                $request->p_description,
                $request->p_image,
                $request->p_stock,
                $request->p_points_cost,
                $request->p_is_active,
                $request->p_available_until,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function prizelistforpurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_prize_list_for_purchase(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de premios',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function prizepurchase(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
            'p_prize_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_prize_purchase(?, ?)', [
                $request->p_student_id,
                $request->p_prize_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la compra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function prizetogglestatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_id' => 'required|integer',
            'p_is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_prize_toggle_status(?, ?)', [
                $request->p_id,
                $request->p_is_active,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function prizeslist(Request $request): JsonResponse
    {
        try {
            $result = DB::select('SELECT * FROM public.spu_prizes_list()');

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la lista de premios',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Student Methods
    public function studentachievementslist(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_achievements_list(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los logros del estudiante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentavatarapply(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
            'p_avatar_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_avatar_apply(?, ?)', [
                $request->p_student_id,
                $request->p_avatar_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aplicar el avatar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentavatarslist(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_avatars_list(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los avatares del estudiante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentbackgroundapply(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
            'p_background_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_background_apply(?, ?)', [
                $request->p_student_id,
                $request->p_background_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aplicar el fondo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentbackgroundslist(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_backgrounds_list(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los fondos del estudiante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentprizeshistory(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_prizes_history(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el historial de premios',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentprofile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_student_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_profile(?)', [
                $request->p_student_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el perfil del estudiante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentprofileupd(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_user_id' => 'required|integer',
            'p_nombres' => 'nullable|string|max:255',
            'p_grado' => 'nullable|string|max:50',
            'p_seccion' => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_profile_upd(?, ?, ?, ?)', [
                $request->p_user_id,
                $request->p_nombres,
                $request->p_grado,
                $request->p_seccion,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el perfil',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentprogressbar(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_progress_bar(?)', [
                $request->p_user_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la barra de progreso',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentprogressupd(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_user_id' => 'required|integer',
            'p_experience' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_student_progress_upd(?, ?)', [
                $request->p_user_id,
                $request->p_experience,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el progreso',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentssearch(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'p_search' => 'required|string|min:3|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $result = DB::select('SELECT * FROM public.spu_students_search(?)', [
                $request->p_search,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar estudiantes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
