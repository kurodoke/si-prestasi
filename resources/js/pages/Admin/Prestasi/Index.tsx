import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import prestasi from '@/routes/admin/prestasi';

export default function Index({ prestasis }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_prestasi: '',
        penyelenggara: '',
    });

    function submit(e) {
        e.preventDefault();
        post(prestasi.store.url(), {
            onSuccess: () => reset(),
        });
    }
    return (
        <AppLayout>
            <Head title='Manajemen Prestasi' />
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Prestasi Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className='flex items-end gap-4'>
                            <div className='flex-1'>
                                <Label>Nama Prestasi</Label>
                                <Input value={data.nama_prestasi} onChange={(e) => setData('nama_prestasi', e.target.value)} />
                                {errors.nama_prestasi && <p className='text-red-500 text-xs mt-1'>{errors.nama_prestasi}</p>}
                            </div>
                            <div className='flex-1'>
                                <Label>Penyelenggara</Label>
                                <Input value={data.penyelenggara} onChange={(e) => setData('penyelenggara', e.target.value)} />
                                 {errors.penyelenggara && <p className='text-red-500 text-xs mt-1'>{errors.penyelenggara}</p>}
                            </div>
                            <Button type='submit' disabled={processing}>Simpan</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>Daftar Prestasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Prestasi</TableHead>
                                    <TableHead>Penyelenggara</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prestasis.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nama_prestasi}</TableCell>
                                        <TableCell>{item.penyelenggara}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}