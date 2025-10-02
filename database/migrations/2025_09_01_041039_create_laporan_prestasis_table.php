<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporan_prestasis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mahasiswa');
            $table->string('npm');
            $table->string('angkatan');
            $table->string('no_hp');

            // Relasi ke prestasi
            // $table->string('nama_prestasi');
            $table->foreignId('prestasi_id')->constrained()->onDelete('cascade');

            // Periode penerimaan dan selesai (gunakan tanggal 1 sebagai default)
            $table->foreignId('periode_id')->nullable()->constrained('periodes')->nullOnDelete();

            $table->date('penerimaan_prestasi'); // YYYY-MM-01
            $table->date('selesai_prestasi');    // YYYY-MM-01

            // Validasi status
            $table->enum('status_validasi', ['pending', 'disetujui'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_prestasis');
    }
};
