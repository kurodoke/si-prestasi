import { DataTable } from '@/components/data-table/public/data-table';
import { SectionCards } from '@/components/section-card/laporan-prestasi/section-cards';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/admin/users';
import { Auth, Berita, LaporanPrestasi, Periode, SummaryLaporan } from '@/types';
import React from 'react';
import { PieChart } from 'recharts';

import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { Bar, BarChart, CartesianGrid, Cell, Pie, XAxis } from 'recharts';

interface LaporanPerPeriode {
    id: number;
    periode: string;
    bulan_mulai: number;
    tahun_mulai: number;
    bulan_selesai: number;
    tahun_selesai: number;
    jumlah_laporan: number;
}

interface DisplayTotalLaporanPerPeriode {
    periode: string;
    jumlah_laporan: number;
}

export default function Dashboard({
    auth,
    laporan,
    laporan_per_periode,
    summary,
}: {
    auth: Auth;
    laporan: LaporanPrestasi[];
    berita: Berita[];
    total_laporan: number;
    laporan_per_periode: LaporanPerPeriode[];
    periode_aktif: Periode;
    summary: SummaryLaporan;
}) {
    const [laporanPerPeriode, setLaporanPerPeriode] = React.useState<DisplayTotalLaporanPerPeriode[]>([]);

    // Warna orange (pie chart)
    const pieColors = ['#FFA726', '#FB8C00', '#F57C00', '#EF6C00', '#E65100', '#FFB74D', '#FF9800', '#FF8F00', '#FF6F00', '#FF5722'];

    // Warna biru (bar chart)
    const barColors = ['#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#64B5F6', '#2196F3', '#1E88E5', '#0288D1', '#03A9F4'];

    React.useEffect(() => {
        if (laporan_per_periode.length !== 0) {
            const itemLaporanPerPeriode = laporan_per_periode.map((item) => ({
                periode: `${item.periode} - ${item.tahun_mulai}`,
                jumlah_laporan: item.jumlah_laporan,
            }));

            setLaporanPerPeriode(itemLaporanPerPeriode);
        }
    }, [laporan_per_periode]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: users.index.url() }]}>
            <SectionCards summary={summary} />

            {/* Chart */}
            <div className="mb-8 grid grid-cols-4 gap-4 space-y-4 sm:grid-cols-12 px-6">
                <Card className="@container/card col-span-12 shadow-xs">
                    <CardHeader className="text-center">
                        <h2 className="w-full text-xl font-semibold text-pretty sm:text-2xl">Prestasi Terdaftar</h2>
                        <p className="sm:text-md mb-2 text-muted-foreground">Total Laporan terdaftar per-periode</p>
                    </CardHeader>

                    <CardContent className="grid grid-cols-4 sm:grid-cols-12">
                        {/* Pie Chart */}
                        <div className="col-span-4 sm:col-span-5">
                            <ChartContainer
                                config={{}}
                                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                            >
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={laporanPerPeriode} dataKey="jumlah_laporan" nameKey="periode" label>
                                        {laporanPerPeriode.map((entry, index) => (
                                            <Cell key={`cell-pie-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>

                        {/* Separator */}
                        <div className="col-span-4 flex justify-center py-2 sm:col-span-2 sm:py-0">
                            <Separator orientation={'vertical'} className="hidden border-1 sm:block" />
                            <Separator orientation={'horizontal'} className="block border-1 sm:hidden" />
                        </div>

                        {/* Bar Chart */}
                        <div className="col-span-4 sm:col-span-5">
                            <ChartContainer config={{}}>
                                <BarChart data={laporanPerPeriode}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="periode" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                        formatter={(value: number) => `Jumlah laporan: ${value}`}
                                    />
                                    <Bar dataKey="jumlah_laporan" radius={[8, 8, 0, 0]}>
                                        {laporanPerPeriode.map((entry, index) => (
                                            <Cell key={`cell-bar-${index}`} fill={barColors[index % barColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Prestasi */}
            <div className="mb-8 grid grid-cols-4 gap-4 space-y-4 sm:grid-cols-12 px-6">
                <Card className="@container/card col-span-12 shadow-xs">
                    <CardHeader className="text-center">
                        <h2 className="w-full text-xl font-semibold text-pretty sm:text-2xl">Terdaftar Terbaru</h2>
                        <p className="text-md mb-2 text-muted-foreground">Cuplikan informasi prestasi dari mahasiswa yang baru diverifikasi</p>
                    </CardHeader>

                    <CardContent className="grid grid-cols-4 sm:grid-cols-12">
                        <div className="col-span-4 sm:col-span-12">
                            <DataTable data={laporan} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
