<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'accounts' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'role' => 'required|in:validator,admin',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return to_route('admin.users.index')->with('success', 'Akun berhasil ditambahkan.');
    }


    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,validator',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $role = $user->id === Auth::id() ? $user->role : $request->role;

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $role,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return to_route('admin.users.index')->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Pencegahan agar admin tidak bisa menghapus dirinya sendiri
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri.');
        }
        
        $user->delete();

        return to_route('admin.users.index')->with('success', 'Akun berhasil dihapus.');
    }
}