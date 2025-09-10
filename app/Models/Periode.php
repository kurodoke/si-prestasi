<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Periode extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_periode',
        'bulan_mulai',
        'tahun_mulai',
        'bulan_selesai',
        'tahun_selesai',
    ];

    public function laporanPenerimas()
    {
        return $this->hasMany(LaporanPenerima::class, 'periode_id');
    }

    public function getLabelAttribute()
    {
        $bulanNama = fn($bulan) => \Carbon\Carbon::createFromDate(null, $bulan, 1)->translatedFormat('F');
        return "{$this->nama_periode} ({$bulanNama($this->bulan_mulai)} {$this->tahun_mulai} - {$bulanNama($this->bulan_selesai)} {$this->tahun_selesai})";
    }
}
