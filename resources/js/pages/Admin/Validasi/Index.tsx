import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import validasi from '@/routes/admin/validasi';
import { Head, router } from '@inertiajs/react';

export default function Index({ laporans, userRole }) {
    function handleValidate(laporanId, status) {
        const actionText = status === 'setuju' ? (userRole === 'admin' ? 'menyetujui (final)' : 'meneruskan ke verifikator') : 'menolak';

        if (!confirm(`Yakin ingin ${actionText} laporan ini?`)) return;

        const url = validasi.update.url({ laporan: laporanId });

        // Kirim 'setuju' atau 'tolak' ke backend
        router.put(url, { status: status }, { preserveScroll: true });
    }

    const approveButtonText = userRole === 'admin' ? 'Setujui (Final)' : 'Teruskan ke Verifikator';

    return (
        <AppLayout>
            <Head title="Validasi Laporan" />
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Menunggu Validasi</CardTitle>
                    <CardDescription>Berikut adalah daftar laporan penerima prestasi yang perlu divalidasi.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mahasiswa</TableHead>
                                <TableHead>Prestasi</TableHead>
                                <TableHead>Tahun</TableHead>
                                <TableHead>Dokumen</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {laporans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Tidak ada laporan yang menunggu validasi.
                                    </TableCell>
                                </TableRow>
                            )}
                            {laporans.map((laporan) => (
                                <TableRow key={laporan.id}>
                                    <TableCell>
                                        <div className="font-medium">{laporan.user.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {laporan.user.npm} - {laporan.user.program_studi?.nama_prodi}
                                        </div>
                                    </TableCell>
                                    <TableCell>{laporan.prestasi.nama_prestasi}</TableCell>
                                    <TableCell>{laporan.tahun_penerimaan}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`/storage/${laporan.dokumen_bukti.path_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Lihat Bukti
                                        </a>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" onClick={() => handleValidate(laporan.id, 'setuju')}>
                                            {approveButtonText}
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleValidate(laporan.id, 'tolak')}>
                                            Tolak
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
