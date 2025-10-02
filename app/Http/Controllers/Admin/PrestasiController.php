<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LaporanPrestasi;

class PrestasiController extends Controller
{
    public function index()
    {
        $prestasi_laporan = Prestasi::select('id', 'nama_prestasi', 'jenis_prestasi')
            ->withCount('laporanPrestasi')
            ->get()
            ->groupBy('nama_prestasi')
            ->map(function ($group) {
                return [
                    'id' => $group->first()->id,
                    'nama_prestasi' => $group->first()->nama_prestasi,
                    'jenis_prestasi' => $group->first()->jenis_prestasi,
                    'jumlah_laporan' => $group->sum('laporan_prestasi_count'),
                ];
            })
            ->values();

        return Inertia::render('Admin/Prestasi/Index', [
            'data' => $prestasi_laporan,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_prestasi' => 'required|string|max:255',
            'jenis_prestasi' => 'required|string|max:255',
        ]);

        Prestasi::create($request->all());

        return to_route('admin.prestasi.index')->with('success', 'Data berhasil ditambahkan.');
    }
    
    public function update(Request $request, Prestasi $prestasi)
    {
        $request->validate([
            'nama_prestasi' => 'required|string|max:255',
            'jenis_prestasi' => 'required|string|max:255',
        ]);

        $prestasi->update($request->all());

        return to_route('admin.prestasi.index')->with('success', 'Data berhasil diperbarui.');
    }


    public function destroy(Prestasi $prestasi)
    {
        $prestasi->delete();
        return to_route('admin.prestasi.index')->with('success', 'Data berhasil dihapus.');
    }
}