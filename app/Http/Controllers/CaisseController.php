<?php

namespace App\Http\Controllers;

use App\Models\Caisse;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreCaisseRequest;
use App\Http\Requests\UpdateCaisseRequest;
use App\Models\PaymentMode;

class CaisseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.caisse.index', [
            'caisses' => Caisse::all(),
            'my_actions' => $this->caisse_actions(),
            'my_attributes' => $this->caisse_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.caisse.create', [
            'my_fields' => $this->caisse_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCaisseRequest $request)
    {
        $caisse = new Caisse();

      
        $caisse->montant = $request->montant;
        $caisse->reference = $request->reference;
        $caisse->date = $request->date;
        $caisse->payment_mode_id = $request->payment_mode;
       
        if ($caisse->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('caisse');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Caisse $caisse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Caisse $caisse)
    {
        return view('app.caisse.edit', [
            'caisse' => $caisse,
            'my_fields' => $this->caisse_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCaisseRequest $request, Caisse $caisse)
    {
        $caisse->montant = $request->montant;
        $caisse->reference = $request->reference;
        $caisse->date = $request->date;
        $caisse->payment_mode_id = $request->payment_mode;

        if ($caisse->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('caisse');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Caisse $caisse)
    {
        try {
            $caisse = $caisse->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('caisse');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function caisse_columns()
    {
        $columns = (object) [
            'montant' => 'Montant',
            'date' => 'Date',
            'payment_mode' => 'Mode De Payment',
            'reference' => 'Réference',
        ];
        return $columns;
    }

    private function caisse_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function caisse_fields()
    {
        $fields = [
            'montant' => [
                'title' => 'Montant',
                'field' => 'number'
            ],            
          
            'date' => [
                'title' => 'Date',
                'field' => 'date'
            ],         
           
                    
            'payment_mode' => [
                'title' => 'Type d\'operation',
                'field' => 'model',
                'options' => PaymentMode::all('id', 'name'),
            ],

            'reference' => [
                'title' => 'Reference',
                'field' => 'text'
            ],  
           
        ];
        return $fields;
    }

}
