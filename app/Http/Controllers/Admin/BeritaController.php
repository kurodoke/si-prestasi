<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::all();
        return Inertia::render('Admin/Berita/Index', [
            'data' => $berita,
        ]);
    }

    public function show(Berita $berita)
    {
        return Inertia::render('Admin/Berita/Show', [
            'berita' => $berita,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Berita/Create');
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'konten' => 'required|string',
            'judul' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $berita->update([
            'konten' => $request->konten,
            'judul' => $request->judul
        ]);

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $path = "storage/" . $file->store('thumbnail', 'public');

            $filename = basename($path);

            $berita->update([
                'thumbnail' => $filename,
            ]);
        }

        return redirect()->back()->with('success', 'Berita berhasil diperbarui');
    }


    public function store(Request $request)
    {
        $request->validate([
            'konten' => 'required|string',
            'judul' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $berita = Berita::create([
            'konten' => $request->konten,
            'judul' => $request->judul
        ]);

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $path = "storage/" . $file->store('thumbnail', 'public');

            $filename = basename($path);

            $berita->update([
                'thumbnail' => $filename,
            ]);
        }

        return redirect()->back()->with('success', 'Berita berhasil ditambahkan');
    }

    public function destroy(Berita $berita)
    {
        $berita->delete();
        return redirect()->back()->with('success', 'Berita berhasil dihapus');
    }
}
