<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Expense;
use App\Models\Project;
use App\Models\Supplier;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __invoke()
    {
        $users  = User::count();
        $suppliers  = Supplier::count();
        $projects  = Project::count();
        $expenses  = Expense::count();
        return view('dashboard', compact(
            'users',
            'suppliers',
            'projects',
            'expenses',
        ));
    }
}
