<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LaporanPrestasiExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data->map(function ($item) {
            return [
                'Nama Mahasiswa' => $item->nama_mahasiswa,
                'NPM' => $item->npm,
                'No HP' => $item->no_hp,
                'Angkatan' => $item->angkatan,
                'Prestasi' => $item->prestasi->nama_prestasi ?? '-',
                'Jenis Prestasi' => $item->prestasi->jenis_prestasi ?? '-',
                'Periode' => $item->periode->periode . ' - ' . $item->periode->tahun_mulai,
                'Penerimaan Prestasi' => $item->penerimaan_prestasi,
                'Selesai Prestasi' => $item->selesai_prestasi,
                'Status Validasi' => $item->status_validasi,
                'Tanggal Verifikasi' => $item->verified_at ?? '-',
                'Diverifikasi Oleh' => $item->verifier->name ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Nama Mahasiswa',
            'NPM',
            'No HP',
            'Angkatan',
            'Prestasi',
            'Jenis Prestasi',
            'Periode',
            'Penerimaan Prestasi',
            'Selesai Prestasi',
            'Status Validasi',
            'Tanggal Verifikasi',
            'Diverifikasi Oleh',
        ];
    }
}
