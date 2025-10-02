<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application; 
use Inertia\Inertia;
use App\Http\Controllers\Admin\PrestasiController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\LaporanPrestasiController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\DokumenController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\BeritaController;

Route::middleware(['auth', 'verified'])->group(function () {    
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'validator'])->prefix('admin')->name('admin.')->group(function () {

    // Laporan Prestasi
    Route::get('laporan/verified', [LaporanPrestasiController::class, 'indexVerified'])->name('laporanprestasi.verified');
    Route::get('laporan/unverified', [LaporanPrestasiController::class, 'indexUnverified'])->name('laporanprestasi.unverified');
    
    // Dokumen
    Route::get('/dokumen/download/{filename}', [DokumenController::class, 'download'])
        ->where('filename', '.*')
        ->name('dokumen.download');
    
    Route::post('/dokumen/upload/{id}', [DokumenController::class, 'upload'])
        ->where('id', '[0-9]+')
        ->name('dokumen.upload');


    Route::resource('laporan', LaporanPrestasiController::class)->only(['index', 'update', 'destroy'])->names([
        'index' => 'laporanprestasi.index',
        'update' => 'laporanprestasi.update',
        'destroy' => 'laporanprestasi.destroy',
    ]);

    Route::get('/admin/laporan-prestasi/export', [LaporanPrestasiController::class, 'excel'])
    ->name('laporanprestasi.excel');


    Route::middleware('admin')->group(function () {
        Route::resource('prestasi', PrestasiController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('periode', PeriodeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('users', UserManagementController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
        Route::get('/berita/create', [BeritaController::class, 'create'])->name('berita.create');
        Route::post('/berita/create', [BeritaController::class, 'store'])->name('berita.store');
        Route::get('/berita/{berita}', [BeritaController::class, 'show'])->name('berita.show');
        Route::post('/berita/{berita}', [BeritaController::class, 'update'])->name('berita.update');
        Route::delete('/berita/{berita}', [BeritaController::class, 'destroy'])->name('berita.destroy');
    });
});

Route::get('/pendaftaran-prestasi/periode-{id}-{tahun_mulai}', [LaporanPrestasiController::class, 'create'])->name('laporan.create');
Route::post('/pendaftaran-prestasi/periode-{id}-{tahun_mulai}', [LaporanPrestasiController::class, 'store'])->name('laporan.store');


Route::get('/', [PublicController::class, 'index'])->name('home');
Route::get('/berita/{berita}', [PublicController::class, 'beritaDetail'])->name('beritadetail.public');
Route::get('/prestasi', [PublicController::class, 'prestasi'])->name('laporan.public');
Route::get('/berita', [PublicController::class, 'berita'])->name('berita.public');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
