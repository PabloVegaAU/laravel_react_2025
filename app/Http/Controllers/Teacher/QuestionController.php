<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Capability;
use App\Models\Competency;
use App\Models\CurricularArea;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuestionType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuestionController extends Controller
{
    private const DIFFICULTIES = ['easy', 'medium', 'hard'];

    private function emptyPagination(): array
    {
        return [
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 10,
            'total' => 0,
        ];
    }

    public function index()
    {
        $currentYear = now()->year;
        $teacherId = Auth::id();

        $curricularAreas = CurricularArea::whereHas('teacherClassroomCurricularAreaCycles', function ($query) use ($teacherId, $currentYear) {
            $query->whereHas('teacher', function ($q) use ($teacherId) {
                $q->where('user_id', $teacherId);
            })->where('academic_year', $currentYear);
        })->get(['id', 'name']);

        if ($curricularAreas->isEmpty()) {
            return Inertia::render('teacher/questions/index', [
                'questions' => $this->emptyPagination(),
                'question_types' => [],
                'curricular_areas' => [],
                'competencies' => [],
                'capabilities' => [],
                'difficulties' => self::DIFFICULTIES,
            ]);
        }

        $competencies = Competency::select('id', 'name', 'curricular_area_cycle_id')
            ->whereIn('curricular_area_cycle_id', $curricularAreas->pluck('id'))
            ->get();

        if ($competencies->isEmpty()) {
            return Inertia::render('teacher/questions/index', [
                'questions' => $this->emptyPagination(),
                'question_types' => [],
                'curricular_areas' => $curricularAreas,
                'competencies' => [],
                'capabilities' => [],
                'difficulties' => self::DIFFICULTIES,
            ]);
        }

        $capabilities = Capability::select('id', 'name', 'competency_id')
            ->whereIn('competency_id', $competencies->pluck('id'))
            ->get();

        $questionTypes = QuestionType::select('id', 'name')->get();

        $questions = Question::select([
            'id', 'name', 'description', 'difficulty', 'question_type_id',
            'capability_id', 'created_at', 'updated_at',
        ])
            ->when($capabilities->isNotEmpty(), function ($query) use ($capabilities) {
                $query->whereIn('capability_id', $capabilities->pluck('id'));
            }, function ($query) {
                $query->whereNull('capability_id');
            })
            ->with([
                'questionType:id,name',
                'capability:id,name,competency_id',
                'capability.competency:id,name,curricular_area_cycle_id',
                'capability.competency.curricularAreaCycle:id',
            ])
            ->latest('created_at')
            ->paginate(10);

        return Inertia::render('teacher/questions/index', [
            'questions' => $questions,
            'question_types' => $questionTypes,
            'curricular_areas' => $curricularAreas,
            'competencies' => $competencies,
            'capabilities' => $capabilities,
            'difficulties' => self::DIFFICULTIES,
        ]);
    }

    public function create() {}

    private function validateOrderingQuestion(array $options): void
    {
        $orders = collect($options)->pluck('order')->sort()->values();

        foreach ($orders as $index => $order) {
            if ($order !== $index) {
                throw new \Exception('Los órdenes deben ser secuenciales empezando desde 0');
            }
        }
    }

    private function validateMatchingQuestion(array $options): void
    {
        $pairs = collect($options)->groupBy('pair_key');

        foreach ($pairs as $pairKey => $pairItems) {
            if ($pairItems->count() !== 2) {
                throw new \Exception("Cada par debe tener exactamente dos elementos (error en par: $pairKey)");
            }

            $sides = $pairItems->pluck('pair_side');
            if (! $sides->contains('left') || ! $sides->contains('right')) {
                throw new \Exception("Cada par debe contener un lado 'left' y uno 'right' (error en par: $pairKey)");
            }
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_type_id' => 'required|exists:question_types,id',
            'capability_id' => 'required|exists:capabilities,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'options' => 'required|array|min:2',
            'options.*.value' => 'required|string',
            'options.*.is_correct' => 'sometimes|boolean',
            'options.*.order' => 'sometimes|integer|min:0',
            'options.*.pair_key' => 'sometimes|string|nullable',
            'options.*.pair_side' => 'sometimes|in:left,right|nullable',
            'explanation_required' => 'sometimes|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Obtener el tipo de pregunta
            $questionType = QuestionType::findOrFail($validated['question_type_id']);

            // Validaciones específicas por tipo de pregunta
            if ($questionType->name === 'Ordenar') {
                $this->validateOrderingQuestion($validated['options']);
            } elseif ($questionType->name === 'Emparejar') {
                $this->validateMatchingQuestion($validated['options']);
            }

            // Crear la pregunta
            $question = Question::create([
                'teacher_id' => auth()->id(),
                'question_type_id' => $validated['question_type_id'],
                'capability_id' => $validated['capability_id'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'difficulty' => $validated['difficulty'],
                'explanation_required' => $validated['explanation_required'] ?? false,
            ]);

            // Crear las opciones de la pregunta
            foreach ($validated['options'] as $index => $optionData) {
                $option = new QuestionOption([
                    'value' => $optionData['value'],
                    'is_correct' => $optionData['is_correct'] ?? false,
                    'order' => $optionData['order'] ?? $index,
                    'correct_order' => $optionData['order'] ?? $index,
                    'pair_key' => $optionData['pair_key'] ?? null,
                    'pair_side' => $optionData['pair_side'] ?? null,
                    'score' => $optionData['is_correct'] ?? false ? 1.0 : 0.0,
                ]);

                $question->options()->save($option);
            }

            DB::commit();

            return redirect()
                ->route('teacher.questions.index')
                ->with('success', 'Pregunta creada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al crear pregunta: '.$e->getMessage());

            return back()->with('error', 'Error al crear la pregunta: '.$e->getMessage());
        }
    }

    public function show(Question $question)
    {
        // Verificar que el usuario es el propietario de la pregunta
        if ($question->teacher_id !== Auth::id()) {
            abort(403, 'No estás autorizado para ver esta pregunta.');
        }

        // Cargar relaciones necesarias con carga eficiente
        $question->load([
            'questionType:id,name',
            'capability.competency.curricularAreaCycle.curricularArea',
            'options' => function ($query) {
                $query->orderBy('order');
            },
        ]);

        return Inertia::render('teacher/questions/show', [
            'question' => $question,
        ]);
    }

    public function edit(Question $question)
    {
        // Verificar que el usuario es el propietario de la pregunta
        if ($question->teacher_id !== Auth::id()) {
            abort(403, 'No estás autorizado para editar esta pregunta.');
        }

        // Obtener el año académico actual
        $currentYear = now()->year;

        // Cargar la pregunta con relaciones necesarias
        $question->load([
            'questionType',
            'capability.competency.curricularAreaCycle.curricularArea',
            'options' => function ($query) {
                $query->orderBy('order');
            },
        ]);

        // Obtener áreas curriculares del profesor
        $curricularAreas = CurricularArea::select('id', 'name')
            ->whereHas('teachers', function ($query) use ($currentYear) {
                $query->where('users.id', Auth::id())
                    ->where('academic_year', $currentYear);
            })
            ->get();

        // Obtener competencias relacionadas
        $competencies = $curricularAreas->isNotEmpty()
            ? Competency::whereIn('curricular_area_cycle_id', $curricularAreas->pluck('id'))
                ->select('id', 'name', 'curricular_area_cycle_id')
                ->get()
            : collect();

        // Obtener capacidades relacionadas
        $capabilities = $competencies->isNotEmpty()
            ? Capability::whereIn('competency_id', $competencies->pluck('id'))
                ->select('id', 'name', 'competency_id')
                ->get()
            : collect();

        // Obtener tipos de pregunta
        $questionTypes = QuestionType::select('id', 'name')->get();

        return Inertia::render('teacher/questions/edit', [
            'question' => $question,
            'question_types' => $questionTypes,
            'curricular_areas' => $curricularAreas,
            'competencies' => $competencies,
            'capabilities' => $capabilities,
            'difficulties' => ['easy', 'medium', 'hard'],
        ]);
    }

    public function update(Request $request, Question $question)
    {
        // Verificar que el usuario es el propietario de la pregunta
        if ($question->teacher_id !== Auth::id()) {
            abort(403, 'No estás autorizado para actualizar esta pregunta.');
        }

        $validated = $request->validate([
            'question_type_id' => 'required|exists:question_types,id',
            'capability_id' => 'required|exists:capabilities,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'options' => 'required|array|min:2',
            'options.*.value' => 'required|string',
            'options.*.is_correct' => 'sometimes|boolean',
            'options.*.order' => 'sometimes|integer|min:0',
            'options.*.pair_key' => 'sometimes|string|nullable',
            'options.*.pair_side' => 'sometimes|in:left,right|nullable',
            'explanation_required' => 'sometimes|boolean',
        ]);

        DB::beginTransaction();

        try {
            // Obtener el tipo de pregunta
            $questionType = QuestionType::findOrFail($validated['question_type_id']);

            // Validaciones específicas por tipo de pregunta
            if ($questionType->name === 'Ordenar') {
                $this->validateOrderingQuestion($validated['options']);
            } elseif ($questionType->name === 'Emparejar') {
                $this->validateMatchingQuestion($validated['options']);
            }

            // Actualizar la pregunta
            $question->update([
                'question_type_id' => $validated['question_type_id'],
                'capability_id' => $validated['capability_id'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'difficulty' => $validated['difficulty'],
                'explanation_required' => $validated['explanation_required'] ?? false,
            ]);

            // Eliminar opciones existentes
            $question->options()->delete();

            // Crear las nuevas opciones
            foreach ($validated['options'] as $index => $optionData) {
                $option = new QuestionOption([
                    'value' => $optionData['value'],
                    'is_correct' => $optionData['is_correct'] ?? false,
                    'order' => $optionData['order'] ?? $index,
                    'correct_order' => $optionData['order'] ?? $index,
                    'pair_key' => $optionData['pair_key'] ?? null,
                    'pair_side' => $optionData['pair_side'] ?? null,
                    'score' => $optionData['is_correct'] ?? false ? 1.0 : 0.0,
                ]);

                $question->options()->save($option);
            }

            DB::commit();

            return redirect()
                ->route('teacher.questions.index')
                ->with('success', 'Pregunta actualizada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar pregunta: '.$e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Error al actualizar la pregunta: '.$e->getMessage());
        }
    }

    public function destroy(Question $question)
    {
        // Verificar que el usuario es el propietario de la pregunta
        if ($question->teacher_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No estás autorizado para eliminar esta pregunta.',
            ], 403);
        }

        DB::beginTransaction();

        try {
            // Verificar si la pregunta está siendo usada en alguna ficha de aplicación
            if ($question->applicationForms()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la pregunta porque está siendo utilizada en una o más fichas de aplicación.',
                ], 422);
            }

            // Eliminar opciones de la pregunta
            $question->options()->delete();

            // Eliminar la pregunta
            $question->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pregunta eliminada correctamente',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar pregunta: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la pregunta: '.$e->getMessage(),
            ], 500);
        }
    }
}
