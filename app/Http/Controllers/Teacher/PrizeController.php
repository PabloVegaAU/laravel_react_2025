<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrizeController extends Controller
{
    /**
     * Display a listing of the prizes.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('teacher/prizes/index');
    }

    /**
     * Show the form for creating a new prize.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('teacher/prizes/reate');
    }

    /**
     * Store a newly created prize in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher/prizes/index');
    }

    /**
     * Display the specified prize.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        return Inertia::render('teacher/prizes/show', [
            'prizeId' => $id,
        ]);
    }

    /**
     * Show the form for editing the specified prize.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        return Inertia::render('teacher/prizes/edit', [
            'prizeId' => $id,
        ]);
    }

    /**
     * Update the specified prize in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher/prizes/index');
    }

    /**
     * Remove the specified prize from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher/prizes/index');
    }
}
