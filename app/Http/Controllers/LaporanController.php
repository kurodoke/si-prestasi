<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use App\Models\LaporanPenerima;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function create()
    {
        // Menampilkan form untuk lapor prestasi
        return Inertia::render('LaporPrestasi/Create', [
            'prestasis' => Prestasi::orderBy('nama_prestasi')->get(),
        ]);
    }

    public function store(Request $request)
    {
        // 1. Perbaiki Validasi: Hapus validasi status
        $request->validate([
            'prestasi_id' => 'required|exists:prestasis,id',
            'tahun_penerimaan' => 'required|digits:4|integer|min:2010',
            'dokumen' => 'required|file|mimes:pdf|max:2048',
        ]);

        $user = Auth::user();

        // 2. Lengkapi Data saat Membuat Laporan
        $laporan = LaporanPenerima::create([
            'user_id' => $user->id,
            'nama_mahasiswa' => $user->name, // Ambil dari data user
            'npm' => $user->npm, // Ambil dari data user
            'program_studi_id' => $user->program_studi_id, // Ambil dari data user
            'prestasi_id' => $request->prestasi_id,
            'tahun_penerimaan' => $request->tahun_penerimaan,
            'status_validasi' => 'pending', // Set status awal ke 'pending'
        ]);

        if ($request->hasFile('dokumen')) {
            $path = $request->file('dokumen')->store('dokumen_bukti', 'public');
            $laporan->dokumenBukti()->create([
                'nama_file' => $request->file('dokumen')->getClientOriginalName(),
                'path_file' => $path,
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Laporan berhasil diajukan dan sedang menunggu verifikasi.');
    }
}