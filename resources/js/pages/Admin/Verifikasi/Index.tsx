import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
export default function Index({ laporans, userRole }) {
    const title = userRole === 'admin' ? 'Verifikasi Awal' : 'Verifikasi Akhir';
    const approveButtonText = userRole === 'admin' ? 'Teruskan ke Verifikator' : 'Verifikasi (Final)';

    function handleValidate(laporanId, status) {
        // ... (logika konfirmasi dan kirim data)
        router.put(`/admin/verifikasi/${laporanId}`, { status });
    }

    return (
        <AppLayout>
            <Head title={title} />
            <Card>
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        {/* Header Tabel */}
                        <TableBody>
                            {laporans.map((laporan) => (
                                <TableRow key={laporan.id}>
                                    {/* Kolom-kolom data */}
                                    <TableCell>
                                        <Button size="sm" onClick={() => handleValidate(laporan.id, 'setuju')}>{approveButtonText}</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleValidate(laporan.id, 'tolak')}>Tolak</Button>
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