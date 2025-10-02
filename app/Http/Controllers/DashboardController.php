<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\LaporanPrestasi;
use App\Models\Periode;
use App\Models\Prestasi;
use App\Models\Berita;


class DashboardController extends Controller
{
    public function __invoke(Request $request)
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

        $total_laporan_setiap_periode = Periode::select('id', 'periode', 'bulan_mulai', 'tahun_mulai', 'bulan_selesai', 'tahun_selesai')
            ->withCount([
                'laporanPrestasi as laporan_prestasi_count' => function ($query) {
                    $query->where('status_validasi', 'disetujui');
                }
            ])
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
        
        $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])
            ->where('status_validasi', 'disetujui')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'laporan' => $laporan,

            // data untuk UI dashboard
            'summary' => [
                'total_laporan' => $total,
                'delta_total' => $deltaTotal,

                'belum_diverifikasi' => $unverified,
                'delta_belum_diverifikasi' => $deltaUnverified,

                'sudah_diverifikasi' => $verified,
                'delta_sudah_diverifikasi' => $deltaVerified,
            ],
            'laporan_per_periode' => $total_laporan_setiap_periode,
        ]);
    }
}