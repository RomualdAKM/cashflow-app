<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;

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

        $expense->reference = $request->reference;
        $expense->name = $request->name;
        $expense->amount = $request->amount;

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
        $expense->reference = $request->reference;
        $expense->name = $request->name;
        $expense->amount = $request->amount;
        
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
            'reference' => 'Réference',
            'name' => 'Nom',
            'amount' => 'Montant',
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
            'name' => [
                'title' => 'Nom',
                'field' => 'text'
            ],
            'reference' => [
                'title' => 'Référence',
                'field' => 'text'
            ],            
            'amount' => [
                'title' => 'Montant',
                'field' => 'number'
            ],
        ];
        return $fields;
    }
}
