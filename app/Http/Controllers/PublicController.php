<?php

namespace App\Http\Controllers;

use App\Models\LaporanPrestasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Berita;
use App\Models\Periode;
use Carbon\Carbon;

class PublicController extends Controller
{
   public function index()
    {
        $now = Carbon::now();
        $currentMonth = $now->month;
        $currentYear = $now->year;

        $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])
            ->where('status_validasi', 'disetujui')
            ->latest()
            ->limit(5)
            ->get();
        $berita = Berita::latest()->limit(3)->get();
        $total_laporan = LaporanPrestasi::where('status_validasi', 'disetujui')->count();

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

        // Cari periode aktif
        $periode_aktif = Periode::where(function ($query) use ($currentYear, $currentMonth) {
            // Tahun mulai kurang dari tahun sekarang
            // atau sama tahun tapi bulan mulai kurang sama bulan sekarang
            $query->where(function ($q) use ($currentYear, $currentMonth) {
                $q->where('tahun_mulai', '<', $currentYear)
                ->orWhere(function ($q2) use ($currentYear, $currentMonth) {
                    $q2->where('tahun_mulai', $currentYear)
                        ->where('bulan_mulai', '<=', $currentMonth);
                });
            })
            // Dan tahun selesai lebih besar atau sama tahun sekarang
            // dan bulan selesai lebih besar atau sama bulan sekarang
            ->where(function ($q) use ($currentYear, $currentMonth) {
                $q->where('tahun_selesai', '>', $currentYear)
                ->orWhere(function ($q2) use ($currentYear, $currentMonth) {
                    $q2->where('tahun_selesai', $currentYear)
                        ->where('bulan_selesai', '>=', $currentMonth);
                });
            });
        })->first();

        return Inertia::render('Public/Index', [
            'laporan' => $laporan,
            'berita' => $berita,
            'total_laporan' => $total_laporan,
            'laporan_per_periode' => $total_laporan_setiap_periode,
            'periode_aktif' => $periode_aktif,
        ]);
    }

    public function berita()
    {
        $berita = Berita::latest()->get();
        return Inertia::render('Public/Berita', [
            'berita' => $berita,
        ]);
    }

    public function beritaDetail(Berita $berita)
    {
        return Inertia::render('Public/Detail', [
            'berita' => $berita,
        ]);
    }

    public function prestasi()
    {
        $laporan =  $laporan = LaporanPrestasi::with(['prestasi', 'verifier', 'dokumenBukti', 'periode'])
            ->where('status_validasi', 'disetujui')
            ->latest()
            ->get();

        $periode_list = Periode::whereIn('id', function ($query) {
            $query->select('periode_id')
                ->from('laporan_prestasis')
                ->whereNotNull('periode_id');
        })->get();
        return Inertia::render('Public/Prestasi', [
            'laporan' => $laporan,
            'periode_list' => $periode_list,
        ]);
    }
}