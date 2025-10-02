import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Separator } from './ui/separator';
import { home } from '@/routes';

export default function Navbar({ className }: { className?: string }) {
    return (
        <nav className={cn('grid grid-cols-4 items-center justify-between gap-4 bg-background px-4 sm:px-12 py-4 sm:grid-cols-12 border-b', className)}>
            <div className="col-span-4 sm:col-span-5">
                <Link href={home().url} className="flex items-center">
                    <div className="flex aspect-square size-15 items-center justify-center rounded-lg">
                        <img src="/assets/images/logo.png" className="size-10" />
                    </div>
                    <div className="grid flex-1 text-left text-lg leading-tight">
                        <span className="font-bold">PRESTASI</span>
                        <span className="text-sm text-muted-foreground">Prodi Informatika Universitas Bengkulu</span>
                    </div>
                </Link>
            </div>
            <div className="col-span-4 sm:hidden">
                <Separator />
            </div>
            <div className="col-span-1 flex justify-center">
                <Link href="/prestasi" className="text-sm text-muted-foreground hover:text-primary">
                    Prestasi
                </Link>
            </div>
            <div className="col-span-1 flex justify-center">
                <Link href="/berita" className="text-sm text-muted-foreground hover:text-primary">
                    Berita
                </Link>
            </div>

            <div className="col-span-2 flex justify-end sm:col-span-5">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </nav>
    );
}
