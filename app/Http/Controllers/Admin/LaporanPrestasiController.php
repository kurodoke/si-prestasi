<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LaporanPrestasi;
use Inertia\Inertia;
use App\Models\Periode;
use App\Models\Prestasi;
use Illuminate\Support\Facades\Auth;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LaporanPrestasiExport;

class LaporanPrestasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $now = now();
        $lastMonth = now()->subDays(30);

        // Total laporan
        $total = LaporanPrestasi::count();
        $totalLastMonth = LaporanPrestasi::where('created_at', '<', $lastMonth)->count();
        $deltaTotal = $total - $totalLastMonth;

        // Laporan belum diverifikasi
        $unverified = LaporanPrestasi::where('status_validasi', '!=', 'disetujui')->count();
        $verifiedThisMonth = LaporanPrestasi::where('status_validasi', 'disetujui')
            ->whereBetween('verified_at', [$lastMonth, $now])
            ->count();
        $deltaUnverified = -$verifiedThisMonth;

        // Laporan sudah diverifikasi
        $verified = LaporanPrestasi::where('status_validasi', 'disetujui')->count();
        $verifiedLastMonth = LaporanPrestasi::where('status_validasi', 'disetujui')
            ->where('verified_at', '<', $lastMonth)
            ->count();
        $deltaVerified = $verified - $verifiedLastMonth;

        $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])->get();

        $periode_list = Periode::whereIn('id', function ($query) {
            $query->select('periode_id')
                ->from('laporan_prestasis')
                ->whereNotNull('periode_id');
        })->get();

        return Inertia::render('Admin/LaporanPrestasi/Index', [
            'data' => $laporan,
            'periode_list' => $periode_list,

            // data untuk UI dashboard
            'summary' => [
                'total_laporan' => $total,
                'delta_total' => $deltaTotal,

                'belum_diverifikasi' => $unverified,
                'delta_belum_diverifikasi' => $deltaUnverified,

                'sudah_diverifikasi' => $verified,
                'delta_sudah_diverifikasi' => $deltaVerified,
            ],

            'prestasi_list' => Prestasi::all(),
        ]);
    }

    public function indexVerified()
    {
        $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])
            ->where('status_validasi', 'disetujui')
            ->get();

        $periode_list = Periode::whereIn('id', function ($query) {
            $query->select('periode_id')
                ->from('laporan_prestasis')
                ->whereNotNull('periode_id');
        })->get();

        return Inertia::render('Admin/LaporanPrestasi/IndexVerified', [
            'data' => $laporan,
            'periode_list' => $periode_list,
            'prestasi_list' => Prestasi::all(),
        ]);
    }

    public function indexUnverified()
    {
        $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])
            ->where('status_validasi', 'pending')
            ->get();

        $periode_list = Periode::whereIn('id', function ($query) {
            $query->select('periode_id')
                ->from('laporan_prestasis')
                ->whereNotNull('periode_id');
        })->get();

        return Inertia::render('Admin/LaporanPrestasi/IndexUnverified', [
            'data' => $laporan,
            'periode_list' => $periode_list,
            'prestasi_list' => Prestasi::all(),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(string $periode_id, string $tahun_mulai)
    {
        
        $periode = Periode::where('periode', $periode_id)
            ->where('tahun_mulai', $tahun_mulai)
            ->firstOrFail();

        $prestasi = Prestasi::all();

        return Inertia::render('LaporanPrestasi/Create', [
            'periode' => $periode,
            'prestasi' => $prestasi
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'angkatan' => 'required|digits:4',
            'npm'=> ['required', 'regex:/^\d{6}$/'],
            'np_hp'=> ['required', 'regex:/^\d{9,11}$/'],
            'prestasi' => 'required|exists:prestasis,id',
            'penerimaan' => 'required|date_format:Y-m-01',
            'selesai' => 'required|date_format:Y-m-01|after_or_equal:penerimaan',
            'dokumen_bukti' => 'required|file|mimes:pdf|max:2048',
            'periode_id' => 'required|exists:periodes,id',
        ]);

        $laporan = LaporanPrestasi::create([
            'nama_mahasiswa' => $validated['name'],
            'angkatan' => $validated['angkatan'],
            'npm' => 'G1A' . $validated['npm'],
            'no_hp' => '+62' . $validated['np_hp'], 
            'prestasi_id' => $validated['prestasi'],
            'periode_id' => $validated['periode_id'],
            'penerimaan_prestasi' => $validated['penerimaan'],
            'selesai_prestasi' => $validated['selesai'],
            'status_validasi' => 'pending',
        ]);

        if ($request->hasFile('dokumen_bukti')) {
            $file = $request->file('dokumen_bukti');
            $path = "storage/" . $file->store('dokumen_bukti', 'public');

            $filename = basename($path);

            $laporan->dokumenBukti()->create([
                'nama_file' => $filename,
                'path_file' => $path,
            ]);
        }

        return redirect()->back()->with('success', 'Laporan Prestasi berhasil dikirim, silahkan menunggu untuk diverifikasi. Terimakasih telah mengisi formulir ini.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $laporan = LaporanPrestasi::findOrFail($id);

        // Pastikan hanya role validator yang bisa memverifikasi
        if (Auth::user()->role !== 'validator') {
            abort(403, 'Unauthorized');
        }

        $laporan->status_validasi = 'disetujui';
        $laporan->verified_at = now();
        $laporan->verified_by = Auth::id(); // ID user yang sedang login
        $laporan->save();

        return redirect()->back()->with('success', 'Laporan berhasil diverifikasi.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $laporan = LaporanPrestasi::findOrFail($id);

        $laporan->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }


    public function excel(Request $request)
    {
        $periodeIds = $request->input('periode_list', []);
        $prestasiIds = $request->input('prestasi_list', []);
        $statusValidasi = $request->input('status_validasi');

        $query = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode']);

        if (!empty($periodeIds)) {
            $query->whereIn('periode_id', $periodeIds);
        }

        if (!empty($prestasiIds)) {
            $query->whereIn('prestasi_id', $prestasiIds);
        }

        if (!empty($statusValidasi)) {
            $query->where('status_validasi', $statusValidasi);
        }

        $data = $query->get();
        $filename = 'laporan_prestasi_' . now()->format('Y_m_d_His') . '.xlsx';

        return Excel::download(new LaporanPrestasiExport($data), $filename);
    }

}
