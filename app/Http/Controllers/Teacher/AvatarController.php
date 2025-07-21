<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvatarController extends Controller
{
    /**
     * Display a listing of the avatars.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $avatars = Avatar::latest()->get();

        return Inertia::render('teacher/avatars/index', [
            'avatars' => $avatars,
        ]);
    }

    /**
     * Show the form for creating a new avatar.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('teacher/avatars/create');
    }

    /**
     * Store a newly created avatar in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher.avatars.index');
    }

    /**
     * Display the specified avatar.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $avatar = Avatar::findOrFail($id);

        return Inertia::render('teacher/avatars/show', [
            'avatar' => $avatar,
        ]);
    }

    /**
     * Show the form for editing the specified avatar.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $avatar = Avatar::findOrFail($id);

        return Inertia::render('teacher/avatars/edit', [
            'avatar' => $avatar,
        ]);
    }

    /**
     * Update the specified avatar in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher.avatars.index');
    }

    /**
     * Remove the specified avatar from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // This method is handled by the API controller
        return redirect()->route('teacher.avatars.index');
    }
}
