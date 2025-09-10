<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application; 
use Inertia\Inertia;
use App\Http\Controllers\Admin\PrestasiController;
use App\Http\Controllers\Admin\ProgramStudiController;
use App\Http\Controllers\Admin\PenerimaController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\Admin\UserManagementController;

Route::middleware(['auth', 'verified'])->group(function () {    
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'validator'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('prestasi', PrestasiController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('prestasi/verified', [PrestasiController::class, 'indexVerified'])->name('prestasi.verified');
    Route::get('prestasi/unverified', [PrestasiController::class, 'indexUnverified'])->name('prestasi.unverified');

    Route::middleware('admin')->group(function () {
        Route::resource('users', UserManagementController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

Route::get('/', [PublicController::class, 'index'])->name('home');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
