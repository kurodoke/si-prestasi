<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Periode;
use Inertia\Inertia;

class PeriodeController extends Controller
{
    public function index()
    {
        $periode_laporan = Periode::select('id', 'periode', 'bulan_mulai', 'tahun_mulai', 'bulan_selesai', 'tahun_selesai')
            ->withCount('laporanPrestasi')
            ->get()
            ->groupBy('periode')
            ->map(function ($group) {
                return [
                    'id' => $group->first()->id,
                    'periode' => $group->first()->periode,
                    'bulan_mulai' => $group->first()->bulan_mulai,
                    'tahun_mulai' => $group->first()->tahun_mulai,
                    'bulan_selesai' => $group->first()->bulan_selesai,
                    'tahun_selesai' => $group->first()->tahun_selesai,
                    'jumlah_laporan' => $group->sum('laporan_prestasi_count'),
                ];
            })
            ->values();


        return Inertia::render('Admin/Periode/Index', [
            'data' => $periode_laporan,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'periode' => 'required|in:Ganjil,Genap',
            'bulan_mulai' => 'required|integer|min:1|max:12',
            'tahun_mulai' => 'required|integer|min:2000',
            'bulan_selesai' => 'required|integer|min:1|max:12',
            'tahun_selesai' => 'required|integer|min:2000',
        ]);

        $exists = Periode::where('periode', $request->periode)
                    ->where('tahun_mulai', $request->tahun_mulai)
                    ->exists();

        if ($exists) {
            return back()->withInput()->withErrors([
                'periode' => 'Periode dan Tahun tersebut sudah ada.',
            ]);
        }

        Periode::create($request->all());

        return to_route('admin.periode.index')->with('success', 'Data berhasil ditambahkan.');
    }
    
    public function update(Request $request, Periode $periode)
    {
        // Validasi awal
        $request->validate([
            'periode' => 'required|in:Ganjil,Genap',
            'bulan_mulai' => 'required|integer|min:1|max:12',
            'tahun_mulai' => 'required|integer|min:2000',
            'bulan_selesai' => 'required|integer|min:1|max:12',
            'tahun_selesai' => 'required|integer|min:2000',
        ]);

        // Jika nilai periode atau tahun_mulai berubah, baru lakukan pengecekan
        if (
            $request->periode !== $periode->periode ||
            $request->tahun_mulai != $periode->tahun_mulai
        ) {
            $exists = Periode::where('periode', $request->periode)
                        ->where('tahun_mulai', $request->tahun_mulai)
                        ->where('id', '!=', $periode->id)
                        ->exists();

            if ($exists) {
                return back()->withInput()->withErrors([
                    'periode' => 'Kombinasi Periode dan Tahun Mulai sudah ada.',
                ]);
            }
        }

        // Update data
        $periode->update($request->all());

        return to_route('admin.periode.index')->with('success', 'Data berhasil diperbarui.');
    }


    public function destroy(Periode $periode)
    {
        $periode->delete();
        return to_route('admin.periode.index')->with('success', 'Data berhasil dihapus.');
    }
}
