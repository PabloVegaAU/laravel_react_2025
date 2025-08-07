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
use Illuminate\Support\Facades\Storage;
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

    public function index(Request $request)
    {
        $filters = [
            'search' => '',
        ];

        if ($request->has('search')) {
            $filters['search'] = $request->search;
        }

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
            /* ->where('name', 'like', "%{$filters['search']}%") */
            ->when($filters['search'], function ($query) use ($filters) {
                $query->where('name', 'like', "%{$filters['search']}%");
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
            'filters' => $filters,
            'question_types' => $questionTypes,
            'curricular_areas' => $curricularAreas,
            'competencies' => $competencies,
            'capabilities' => $capabilities,
            'difficulties' => self::DIFFICULTIES,
        ]);
    }

    public function create() {}

    /**
     * Procesa las opciones de una pregunta según su tipo
     */
    private function processQuestionOptions(Question $question, array $options, int $questionTypeId): void
    {
        foreach ($options as $index => $optionData) {
            $option = new QuestionOption([
                'value' => $optionData['value'],
                'is_correct' => $this->determineIfOptionIsCorrect($optionData, $questionTypeId),
                'order' => $optionData['order'] ?? $index,
                'correct_order' => $optionData['correct_order'] ?? $optionData['order'] ?? $index,
                'pair_key' => $optionData['pair_key'] ?? null,
                'pair_side' => $optionData['pair_side'] ?? null,
                'score' => $optionData['score'] ?? ($optionData['is_correct'] ?? false ? 1.0 : 0.0),
            ]);

            $question->options()->save($option);
        }
    }

    /**
     * Determina si una opción es correcta según el tipo de pregunta
     */
    private function determineIfOptionIsCorrect(array $optionData, int $questionTypeId): bool
    {
        // Para preguntas de selección múltiple, usa el valor proporcionado o false por defecto
        if (in_array($questionTypeId, [1, 4])) {
            return $optionData['is_correct'] ?? false;
        }

        // Para preguntas de ordenamiento, todas las opciones son correctas
        if ($questionTypeId === 2) {
            return true;
        }

        // Para preguntas de emparejamiento, todas las opciones son correctas
        if ($questionTypeId === 3) {
            return true;
        }

        // Por defecto, asumir que no es correcta
        return false;
    }

    public function store(Request $request)
    {
        $validationRules = [
            'question_type_id' => 'required|exists:question_types,id',
            'capability_id' => 'required|exists:capabilities,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'explanation_required' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];

        // Tipo pregunta diferente a preguntas abiertas
        if ($request->question_type_id != '5') {
            $validationRules['options'] = 'required|array|min:2';
            $validationRules['options.*.value'] = 'required|string';
            $validationRules['options.*.is_correct'] = 'sometimes|boolean';
            $validationRules['options.*.order'] = 'sometimes|integer|min:0';
            $validationRules['options.*.correct_order'] = 'sometimes|integer|min:0';
            $validationRules['options.*.pair_key'] = 'sometimes|string|nullable';
            $validationRules['options.*.pair_side'] = 'sometimes|in:left,right|nullable';
            $validationRules['options.*.score'] = 'sometimes|numeric|min:0';
        }

        $validated = $request->validate($validationRules);

        DB::beginTransaction();

        try {
            // Crear la pregunta primero para obtener el ID
            $question = Question::create([
                'teacher_id' => auth()->id(),
                'question_type_id' => $validated['question_type_id'],
                'capability_id' => $validated['capability_id'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'difficulty' => $validated['difficulty'],
                'explanation_required' => $validated['explanation_required'] ?? false,
                'image' => null, // Se actualizará después si hay imagen
            ]);
            // Procesar la imagen después de crear la pregunta para tener el ID
            if (isset($validated['image']) && $validated['image']) {
                $date = now()->format('Y-m-d');
                $extension = $validated['image']->getClientOriginalExtension();
                $filename = "{$date}_{$question->id}.{$extension}";
                $path = $validated['image']->storeAs(
                    'questions',
                    $filename,
                    'public'
                );

                // Actualizar la pregunta con la ruta completa de la imagen
                $question->update(['image' => '/storage/'.$path]);
            }

            // Procesar opciones según el tipo de pregunta
            if ($validated['question_type_id'] != '5') {
                $this->processQuestionOptions($question, $validated['options'], (int) $validated['question_type_id']);
            }

            DB::commit();

            return redirect()
                ->route('teacher.questions.index')
                ->with('success', 'Pregunta creada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Error al crear la pregunta: '.$e->getMessage());
        }
    }

    public function show(int $id)
    {
        //
    }

    public function edit(int $id)
    {
        // Cargar las relaciones necesarias
        $question = Question::findOrFail($id);
        $question->load([
            'questionType',
            'capability.competency.curricularAreaCycle',
            'options' => function ($query) {
                $query->orderBy('order');
            },
        ]);

        // Transformar la respuesta al formato esperado por el frontend
        return response()->json($question);
    }

    public function update(Request $request, int $id)
    {
        $validationRules = [
            'question_type_id' => 'required|exists:question_types,id',
            'capability_id' => 'required|exists:capabilities,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'explanation_required' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];

        // Tipo pregunta diferente a preguntas abiertas
        if ($request->question_type_id != '5') {
            $validationRules['options'] = 'required|array|min:2';
            $validationRules['options.*.value'] = 'required|string';
            $validationRules['options.*.is_correct'] = 'sometimes|boolean';
            $validationRules['options.*.order'] = 'sometimes|integer|min:0';
            $validationRules['options.*.correct_order'] = 'sometimes|integer|min:0';
            $validationRules['options.*.pair_key'] = 'sometimes|string|nullable';
            $validationRules['options.*.pair_side'] = 'sometimes|in:left,right|nullable';
            $validationRules['options.*.score'] = 'sometimes|numeric|min:0';
        }

        $validated = $request->validate($validationRules);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Si es imagen validar que mimet type sea imagen
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
        }

        DB::beginTransaction();

        try {
            $question = Question::findOrFail($id);
            // Verificar que el usuario es el propietario de la pregunta
            if ($question->teacher_id !== Auth::id()) {
                throw new \Exception('No estás autorizado para actualizar esta pregunta.');
            }

            // Procesar la imagen si se proporciona
            $updateData = [
                'question_type_id' => $validated['question_type_id'],
                'capability_id' => $validated['capability_id'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'difficulty' => $validated['difficulty'],
                'explanation_required' => $validated['explanation_required'] ?? false,
            ];

            if ($request->hasFile('image')) {
                // Eliminar la imagen anterior si existe
                if ($question->image) {
                    $relativePath = str_replace('/storage/', '', $question->image);
                    Storage::disk('public')->delete($relativePath);
                }

                // Guardar la nueva imagen con el formato: YYYY-MM-DD_questionID.extension
                $date = now()->format('Y-m-d');
                $extension = $request->file('image')->getClientOriginalExtension();
                $filename = "{$date}_{$question->id}.{$extension}";
                $path = $request->file('image')->storeAs(
                    'questions',
                    $filename,
                    'public'
                );
                $updateData['image'] = '/storage/'.$path;
            } elseif (is_null($request->input('image')) && $question->image) {
                // Si se envía null o vacío para la imagen, eliminarla
                $relativePath = str_replace('/storage/', '', $question->image);
                Storage::disk('public')->delete($relativePath);
                $updateData['image'] = null;
            }

            // Actualizar la pregunta
            $question->update($updateData);

            // Eliminar opciones existentes
            $question->options()->delete();

            // Procesar opciones según el tipo de pregunta
            if ($validated['question_type_id'] != '5') {
                $this->processQuestionOptions($question, $validated['options'], (int) $validated['question_type_id']);
            }

            DB::commit();

            return redirect()
                ->route('teacher.questions.index')
                ->with('success', 'Pregunta actualizada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Error al actualizar la pregunta: '.$e->getMessage());
        }
    }

    public function destroy(int $id)
    {
        //
    }
}
