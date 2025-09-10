import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { login, register } from '@/routes';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900'>
            <Head>
                {/* Anda bisa menambahkan meta tag SEO di sini jika perlu */}
            </Head>

            {/* Header */}
            <header className='px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 border-b'>
                <Link href='/' className='flex items-center justify-center'>
                    {/* Ganti dengan Logo jika ada */}
                    <span className='text-lg font-semibold'>SI Prestasi UNIB</span>
                </Link>
                <nav className='ml-auto flex gap-4 sm:gap-6'>
                    <Button variant='outline' asChild>
                        <Link href={login()}>Login</Link>
                    </Button>
                    <Button asChild>
                         <Link href={register()}>Register</Link>
                    </Button>
                </nav>
            </header>

            {/* Main Content */}
            <main className='flex-1'>
                {children}
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-center py-4 text-sm text-gray-500 bg-white dark:bg-gray-800 border-t">
                © {new Date().getFullYear()} Sistem Informasi Prestasi Universitas Bengkulu.
            </footer>

            <Toaster />
        </div>
    );
}