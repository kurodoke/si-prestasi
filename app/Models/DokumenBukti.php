<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenBukti extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function laporanPenerima()
    {
        return $this->belongsTo(LaporanPenerima::class);
    }
}