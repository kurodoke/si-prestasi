import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import programStudi from '@/routes/admin/program-studi';

export default function Index({ programStudis }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_prodi: '',
        fakultas: '',
    });

    function submit(e) {
        e.preventDefault();
        post(programStudi.store.url(), {
            onSuccess: () => reset(),
        });
    }
    
    function handleDelete(id) {
        if (confirm('Yakin ingin menghapus program studi ini?')) {
            router.delete(programStudi.destroy.url({ program_studi: id }));
        }
    }

    return (
        <AppLayout>
            <Head title='Manajemen Program Studi' />
            <div className='space-y-6'>
                <Card>
                    <CardHeader><CardTitle>Tambah Program Studi</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className='flex items-end gap-4'>
                            <div className='flex-1'>
                                <Label>Nama Program Studi</Label>
                                <Input value={data.nama_prodi} onChange={(e) => setData('nama_prodi', e.target.value)} />
                                {errors.nama_prodi && <p className='text-red-500 text-xs mt-1'>{errors.nama_prodi}</p>}
                            </div>
                            <div className='flex-1'>
                                <Label>Fakultas</Label>
                                <Input value={data.fakultas} onChange={(e) => setData('fakultas', e.target.value)} />
                                 {errors.fakultas && <p className='text-red-500 text-xs mt-1'>{errors.fakultas}</p>}
                            </div>
                            <Button type='submit' disabled={processing}>Simpan</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader><CardTitle>Daftar Program Studi</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fakultas</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programStudis.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.fakultas}</TableCell>
                                        <TableCell>{item.nama_prodi}</TableCell>
                                        <TableCell>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                                        </TableCell>
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