<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use RealRashid\SweetAlert\Facades\Alert;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.user.index', [
            'users' => User::all(),
            'my_actions' => $this->user_actions(),
            'my_attributes' => $this->user_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.user.create', [
            'my_fields' => $this->user_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->contact = $request->contact;
        $user->role = $request->role;

        if ($user->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('user');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return view('app.user.edit', [
            'user' => $user,
            'my_fields' => $this->user_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->name = $request->name;
        $user->email = $request->email;
        $user->contact = $request->contact;
        $user->role = $request->role;
        
        if ($user->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('user');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user = $user->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('user');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function user_columns()
    {
        $columns = (object) [
            'name' => 'Nom',
            'email' => 'Email',
            'contact' => 'Contact',
            'role' => 'Role',
        ];
        return $columns;
    }

    private function user_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function user_fields()
    {
        $fields = [
            'name' => [
                'title' => 'Nom',
                'field' => 'text'
            ],
            'email' => [
                'title' => 'Référence',
                'field' => 'email'
            ],  
            'contact' => [
                'title' => 'Contact',
                'field' => 'tel'
            ],        
            'role' => [
                'title' => 'Role',
                'field' => 'select',
                'options' => [
                    'superviseur' => 'Superviseur',
                    'user' => 'Utilisateur',
                 ]
            ],
        ];
        return $fields;
    }

}
