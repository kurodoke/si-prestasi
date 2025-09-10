<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsValidator
{
    public function handle(Request $request, Closure $next): Response
    {
        // Periksa apakah user sudah login DAN rolenya adalah 'validator' ATAU 'admin'
        if (auth()->check() && in_array(auth()->user()->role, ['validator', 'admin'])) {
            // Jika ya, lanjutkan request
            return $next($request);
        }

        abort(403, 'ANDA TIDAK PUNYA AKSES');
    }
}