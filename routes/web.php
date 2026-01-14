<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Public submission routes
Route::get('submissions/create', [\App\Http\Controllers\SubmissionController::class, 'create'])->name('submissions.create');
Route::get('submissions/export', [\App\Http\Controllers\SubmissionController::class, 'export'])->name('submissions.export');
Route::post('submissions', [\App\Http\Controllers\SubmissionController::class, 'store'])->name('submissions.store');
Route::get('submissions/success', [\App\Http\Controllers\SubmissionController::class, 'success'])->name('submissions.success');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Protected submission routes (index, show, edit, update, destroy)
    Route::resource('submissions', \App\Http\Controllers\SubmissionController::class)
        ->except(['create', 'store']);
});

require __DIR__ . '/settings.php';
