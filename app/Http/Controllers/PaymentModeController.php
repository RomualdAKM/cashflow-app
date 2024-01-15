<?php

namespace App\Http\Controllers;

use App\Models\PaymentMode;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StorePaymentModeRequest;
use App\Http\Requests\UpdatePaymentModeRequest;

class PaymentModeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.paymentmode.index', [
            'paymentmodes' => PaymentMode::all(),
            'my_actions' => $this->paymentmode_actions(),
            'my_attributes' => $this->paymentmode_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.paymentmode.create', [
            'my_fields' => $this->paymentmode_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentModeRequest $request)
    {
        $paymentmode = new PaymentMode();

        $paymentmode->name = $request->name;

        if ($paymentmode->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('paymentmode');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMode $paymentMode)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMode $paymentmode)
    {
        return view('app.paymentmode.edit', [
            'paymentmode' => $paymentmode,
            'my_fields' => $this->paymentmode_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentModeRequest $request, PaymentMode $paymentMode)
    {
        $paymentMode->name = $request->name;
      
        
        if ($paymentMode->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('paymentmode');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMode $paymentmode)
    {
        try {
            $paymentmode = $paymentmode->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('paymentmode');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }

    private function paymentmode_columns()
    {
        $columns = (object) [
           
            'name' => 'Nom',
           
        ];
        return $columns;
    }
    private function paymentmode_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function paymentmode_fields()
    {
        $fields = [
            'name' => [
                'title' => 'Nom',
                'field' => 'text'
            ],

        ];
        return $fields;
    }
}
