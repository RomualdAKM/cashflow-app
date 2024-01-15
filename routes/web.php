<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CaisseController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PaymentModeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/migrate', function () {
    Artisan::call('migrate');
    dd('migrated!');
});

Route::get('reboot', function () {
    Artisan::call('view:clear');
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    dd('All done!');
});
Route::middleware('auth')->group(function () {
    Route::get('/', HomeController::class);
    Route::get('dashboard', HomeController::class)->name('dashboard');
    Route::resource('project', ProjectController::class);
    Route::resource('expense', ExpenseController::class);
    Route::resource('supplier', SupplierController::class);
    Route::resource('article', ArticleController::class);
    Route::resource('paymentmode', PaymentModeController::class);
    Route::resource('caisse', CaisseController::class);
    Route::resource('user', UserController::class);

    Route::get('/valide', [ExpenseController::class, 'validexpense'])->name('valide.validexpense');
    Route::post('/valide', [ExpenseController::class, 'isvalidexpense'])->name('valide.isvalidexpense');
    Route::post('/notvalide', [ExpenseController::class, 'isnotvalidexpense'])->name('notvalide.isnotvalidexpense');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
