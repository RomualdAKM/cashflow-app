<?php

namespace App\Http\Controllers;

use App\Models\Project;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.project.index', [
            'projects' => Project::all(),
            'my_actions' => $this->project_actions(),
            'my_attributes' => $this->project_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.project.create', [
            'my_fields' => $this->project_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $project = new Project();

        $project->reference = $request->reference;
        $project->name = $request->name;
        $project->start_date = $request->start_date;
        $project->end_date = $request->end_date;

        if ($project->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('project');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return view('app.project.edit', [
            'project' => $project,
            'my_fields' => $this->project_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->reference = $request->reference;
        $project->name = $request->name;
        $project->start_date = $request->start_date;
        $project->end_date = $request->end_date;
        
        if ($project->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('project');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        try {
            $project = $project->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('project');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function project_columns()
    {
        $columns = (object) [
            'reference' => 'Réference',
            'name' => 'Nom',
            'start_date' => 'Date de debut',
            'end_date' => 'Date de fin',
        ];
        return $columns;
    }

    private function project_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function project_fields()
    {
        $fields = [
            'name' => [
                'title' => 'Nom',
                'field' => 'text'
            ],
            'reference' => [
                'title' => 'Référence',
                'field' => 'text'
            ],            
            'start_date' => [
                'title' => 'Date de debut',
                'field' => 'date'
            ],         
            'end_date' => [
                'title' => 'Date de fin',
                'field' => 'date'
            ],
        ];
        return $fields;
    }
}
