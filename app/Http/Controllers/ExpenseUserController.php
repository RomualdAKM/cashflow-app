<?php

namespace App\Http\Controllers;

use App\Models\ExpenseUser;
use App\Http\Requests\StoreExpenseUserRequest;
use App\Http\Requests\UpdateExpenseUserRequest;

class ExpenseUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ExpenseUser $expenseUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExpenseUser $expenseUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseUserRequest $request, ExpenseUser $expenseUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExpenseUser $expenseUser)
    {
        //
    }
}
