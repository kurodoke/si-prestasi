<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use App\Models\Laporan;

class DokumenController extends Controller
{

    public function download(string $filename)
    {
        $filename = urldecode($filename);
        $path = 'dokumen_bukti/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File not found');
        }

        $mime = Storage::disk('public')->mimeType($path);
        $file = Storage::disk('public')->get($path);

        return response($file, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . $filename . '"'
        ]);
    }


    public function upload(Request $request, $id)
    {
        $request->validate([
            'dokumen_bukti' => 'required|file|mimes:pdf',
        ]);

        $laporan = Laporan::findOrFail($id);

        if ($request->hasFile('dokumen_bukti')) {
            $file = $request->file('dokumen_bukti');

            $path = $file->store('dokumen_bukti', 'public');

            $laporan->dokumenBukti()->create([
                'nama_file' => $file->getClientOriginalName(),
                'path_file' => $path,
            ]);
        }

        return redirect()->back()->with('success', 'Dokumen berhasil diupload');
    }

}
