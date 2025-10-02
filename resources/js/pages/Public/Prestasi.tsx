import AppLayout from '@/layouts/public-app-layout';
import { Auth, LaporanPrestasi, Periode } from '@/types';
import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table/public/prestasi/data-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


export default function Dashboard({ auth, laporan, periode_list }: { auth: Auth; laporan: LaporanPrestasi[], periode_list: Periode[] }) {
    return (
        <>
            <Head title="Dashboard" />
            <AppLayout>
                {/* Prestasi */}
                <div className="mb-8 grid grid-cols-4 gap-4 space-y-4 sm:grid-cols-12">
                    <Card className="@container/card col-span-12 shadow-xs">
                        <CardHeader className="text-center">
                            <h2 className="w-full text-3xl font-semibold text-pretty md:text-4xl lg:text-5xl">Mahasiswa Dengan Prestasi Terdaftar</h2>
                            <p className="mb-2 text-muted-foreground md:text-base lg:text-lg">
                                Berikut adalah daftar mahasiswa yang terdaftar dengan prestasi<br /> hanya menampilkan data yang <span className='underline'>telah diverifikasi</span>
                            </p>
                        </CardHeader>

                        <CardContent className="grid grid-cols-4 sm:grid-cols-12">
                            <div className="col-span-4 sm:col-span-12">
                                <DataTable data={laporan} periode_list={periode_list} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
