import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import laporan from '@/routes/laporan';
import { Periode } from '@/types';
import { Link } from '@inertiajs/react';

interface HeroProps {
    badge?: string;
    heading: string;
    description: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    image: {
        src: string;
        alt: string;
    };
    periode: Periode;
}

const Hero = ({
    badge = 'Login sekarang',
    heading = 'Sistem Informasi Laporan Prestasi',
    description = 'Sistem yang mengelola laporan prestasi dari mahasiswa di Program Studi Informatika Universitas Bengkulu',
    buttons = {
        primary: {
            text: 'Anda Pengelola?',
            url: '/login',
        },
    },
    image = {
        src: '/assets/images/hero.jpg',
        alt: 'Hero section demo image showing interface components',
    },
    periode,
}: HeroProps) => {
    return (
        <section>
            <div className="container">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        {badge && (
                            <Badge variant="outline" asChild>
                                <Link href={laporan.create([periode.periode, periode.tahun_mulai])} className="flex items-center gap-2">
                                    Laporkan Prestasimu Sekarang
                                    <ArrowUpRight className="ml-2 size-4" />
                                </Link>
                            </Badge>
                        )}

                        <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">{heading}</h1>
                        <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">{description}</p>
                        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                            {buttons.primary && (
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={buttons.primary.url}>
                                        {buttons.primary.text} <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-[#10133E] shadow-xs rounded">
                        <img src={image.src} alt={image.alt} className="max-h-96 w-auto rounded-md object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Hero };
