<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\hasMany;

class Prestasi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function laporanPrestasi(): hasMany
    {
        return $this->hasMany(LaporanPrestasi::class);
    }
}