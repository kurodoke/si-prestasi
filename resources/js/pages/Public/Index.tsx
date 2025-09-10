import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Definisikan tipe data props lagi
interface Penerima {
    id: number;
    user: {
        name: string;
        program_studi: {
            nama_prodi: string;
        };
    };
    prestasi: {
        nama_prestasi: string;
    };
}

interface PageProps {
    penerimaPrestasi: Penerima[];
}

export default function Index({ penerimaPrestasi }: PageProps) {
    return (
        <PublicLayout>
            <Head title='Selamat Datang di SI Prestasi UNIB' />

            {/* Hero Section */}
            <section className='w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800'>
                <div className='container px-4 md:px-6 text-center'>
                    <div className='space-y-4'>
                        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                            Sistem Pendataan Prestasi
                        </h1>
                        <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                            Platform terpusat untuk pendataan dan verifikasi penerima prestasi di lingkungan Universitas Bengkulu.
                        </p>
                    </div>
                </div>
            </section>

            {/* Recent Recipients Section */}
            <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-black'>
                <div className='container px-4 md:px-6'>
                    <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>Penerima Prestasi Terbaru</h2>
                            <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                                Berikut adalah beberapa mahasiswa yang laporannya baru saja divalidasi oleh admin.
                            </p>
                        </div>
                    </div>
                    {penerimaPrestasi.length > 0 ? (
                        <div className='mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'>
                            {penerimaPrestasi.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader>
                                        <CardTitle>{item.user.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {item.user.program_studi.nama_prodi}
                                        </p>
                                        <p className="text-md font-semibold text-gray-800 dark:text-white">
                                            {item.prestasi.nama_prestasi}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center mt-12 text-gray-500">
                            Belum ada data penerima prestasi yang bisa ditampilkan.
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}