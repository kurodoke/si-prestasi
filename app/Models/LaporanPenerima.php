<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanPenerima extends Model
{
    use HasFactory;
    protected $guarded = ['id'];


    protected $casts = [
    'penerimaan_prestasi' => 'date',
    'selesai_prestasi' => 'date',
    'verified_at' => 'datetime',
    ];


    public function prestasi()
    {
        return $this->belongsTo(Prestasi::class);
    }

    public function dokumenBukti()
    {
        return $this->hasOne(DokumenBukti::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function periode(): BelongsTo
    {
        return $this->belongsTo(Periode::class);
    }

    public function getLabelPenerimaanAttribute(): string
    {
        return $this->penerimaan_prestasi?->translatedFormat('F Y') ?? '-';
    }

    public function getLabelSelesaiAttribute(): string
    {
        return $this->selesai_prestasi?->translatedFormat('F Y') ?? '-';
    }

    public function scopeAktifDalamPeriode($query, $periode)
    {
        $start = \Carbon\Carbon::create($periode->tahun_mulai, $periode->bulan_mulai, 1);
        $end = \Carbon\Carbon::create($periode->tahun_selesai, $periode->bulan_selesai, 1)->endOfMonth();

        return $query->whereDate('penerimaan_prestasi', '<=', $end)
                     ->whereDate('selesai_prestasi', '>=', $start);
    }

}