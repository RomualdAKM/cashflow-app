<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Expense;
use App\Models\Project;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\User;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.expense.index', [
            'expenses' => Expense::all(),
            'my_actions' => $this->expense_actions(),
            'my_attributes' => $this->expense_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.expense.create', [
            'my_fields' => $this->expense_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $expense = new Expense();

        $expense->number_reference = $request->number_reference;
        //$expense->name = $request->name;
        $expense->amount = $request->amount;
        $expense->project_id = $request->project;
        $expense->article_id = $request->article;
        $expense->supplier_id = $request->supplier;
        $expense->user_id = $request->user;
        $expense->observation = $request->observation;
        $expense->tva = $request->tva;

        if ($expense->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('expense');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        return view('app.expense.edit', [
            'expense' => $expense,
            'my_fields' => $this->expense_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $expense->number_reference = $request->number_reference;
        //$expense->name = $request->name;
        $expense->amount = $request->amount;
        $expense->project_id = $request->project;
        $expense->article_id = $request->article;
        $expense->supplier_id = $request->supplier;
        $expense->user_id = $request->user;
        $expense->observation = $request->observation;
        $expense->tva = $request->tva;
        
        if ($expense->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('expense');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        try {
            $expense = $expense->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('expense');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function expense_columns()
    {
        $columns = (object) [
            'number_reference' => 'Réference',
            'observation' => 'Observation',
            'amount' => 'Montant',
            'tva' => 'tva',
            'project' => 'project',
            'article' => 'article',
            'user' => 'Personnel',
            'supplier' => 'Fournisseur',
        ];
        return $columns;
    }

    private function expense_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function expense_fields()
    {
        $fields = [
            'number_reference' => [
                'title' => 'Numero Référence',
                'field' => 'text'
            ],            
            'article' => [
                'title' => 'Article',
                'field' => 'model',
                'options' => Article::all('id', 'name'),
            ],
            'amount' => [
                'title' => 'PU',
                'field' => 'number'
            ],         
            'tva' => [
                'title' => 'TVA',
                'field' => 'number'
            ],         
            'observation' => [
                'title' => 'Observation',
                'field' => 'textarea'
            ],         
            'project' => [
                'title' => 'Projet',
                'field' => 'model',
                'options' => Project::all('id', 'name'),
            ],
            'supplier' => [
                'title' => 'Fournissaeur',
                'field' => 'model',
                'options' => Supplier::all('id', 'name'),
            ],
            'user' => [
                'title' => 'Nom du Personnel',
                'field' => 'model',
                'options' => User::all('id', 'name'),
            ],
        ];
        return $fields;
    }
}
