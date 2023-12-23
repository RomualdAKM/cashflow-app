<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.supplier.index', [
            'suppliers' => Supplier::all(),
            'my_actions' => $this->supplier_actions(),
            'my_attributes' => $this->supplier_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.supplier.create', [
            'my_fields' => $this->supplier_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $supplier = new Supplier();

        $supplier->reference = $request->reference;
        $supplier->name = $request->name;
        $supplier->contact = $request->contact;
        $supplier->address = $request->address;

        if ($supplier->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('supplier');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        return view('app.supplier.edit', [
            'supplier' => $supplier,
            'my_fields' => $this->supplier_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->reference = $request->reference;
        $supplier->name = $request->name;
        $supplier->contact = $request->contact;
        $supplier->address = $request->address;
        
        if ($supplier->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('supplier');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        try {
            $supplier = $supplier->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('supplier');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function supplier_columns()
    {
        $columns = (object) [
            'reference' => 'Réference',
            'name' => 'Nom',
            'contact' => 'Contact',
            'address' => 'Adresse',
        ];
        return $columns;
    }

    private function supplier_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function supplier_fields()
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
            'contact' => [
                'title' => 'Contact',
                'field' => 'tel'
            ],         
            'address' => [
                'title' => 'Adresse',
                'field' => 'text'
            ],
        ];
        return $fields;
    }
}
