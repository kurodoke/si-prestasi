<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Prestasi/Index', [
            'prestasis' => Prestasi::all(),
        ]);
    }


    public function indexVerified()
    {
        return Inertia::render('Admin/Prestasi/IndexVerified', [
            'prestasis' => Prestasi::all(),
        ]);
    }

    public function indexUnverified()
    {
        return Inertia::render('Admin/Prestasi/IndexUnverified', [
            'prestasis' => Prestasi::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_prestasi' => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
        ]);

        Prestasi::create($request->all());

        return redirect()->route('admin.prestasi.index');
    }
    
    public function update(Request $request, Prestasi $prestasi)
    {
        $request->validate([
            'nama_prestasi' => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
        ]);

        $prestasi->update($request->all());

        return redirect()->route('admin.prestasi.index');
    }


    public function destroy(Prestasi $prestasi)
    {
        $prestasi->delete();
        return redirect()->route('admin.prestasi.index');
    }
}