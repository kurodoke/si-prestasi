import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import lapor from '@/routes/lapor';

export default function Create({ prestasis }) {
    const { data, setData, post, processing, errors } = useForm({
        prestasi_id: '',
        tahun_penerimaan: new Date().getFullYear().toString(),
        dokumen: null,
    });

    function submit(e) {
        e.preventDefault();
        post(lapor.store().url);
    }

    return (
        <AppLayout>
            <Head title='Lapor Penerimaan Prestasi' />
            <Card>
                <CardHeader>
                    <CardTitle>Form Lapor Penerima Prestasi</CardTitle>
                    <CardDescription>
                        Isi form ini jika Anda telah menerima prestasi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className='space-y-4'>
                        <div>
                            <Label htmlFor='prestasi_id'>Nama Prestasi</Label>
                            <Select onValueChange={(value) => setData('prestasi_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih prestasi...' />
                                </SelectTrigger>
                                <SelectContent>
                                    {prestasis.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.nama_prestasi} - {item.penyelenggara}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.prestasi_id && <p className='text-red-500 text-xs mt-1'>{errors.prestasi_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor='tahun_penerimaan'>Tahun Penerimaan</Label>
                            <Input
                                id='tahun_penerimaan'
                                type='number'
                                value={data.tahun_penerimaan}
                                onChange={(e) => setData('tahun_penerimaan', e.target.value)}
                            />
                             {errors.tahun_penerimaan && <p className='text-red-500 text-xs mt-1'>{errors.tahun_penerimaan}</p>}
                        </div>

                        <div>
                            <Label htmlFor='dokumen'>Dokumen Bukti (PDF, max 2MB)</Label>
                            <Input
                                id='dokumen'
                                type='file'
                                onChange={(e) => setData('dokumen', e.target.files[0])}
                            />
                             {errors.dokumen && <p className='text-red-500 text-xs mt-1'>{errors.dokumen}</p>}
                        </div>
                        <Button type='submit' disabled={processing}>
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}