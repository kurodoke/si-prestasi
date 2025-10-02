import PrestasiController from '@/actions/App/Http/Controllers/Admin/PrestasiController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import InputError from '../../input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export function DialogEdit({ data, open, setOpen }: { data: any; open: boolean; setOpen: (open: boolean) => void }) {
    const [jenisPrestasiValue, setJenisPrestasiValue] = React.useState('');

    React.useEffect(() => {
        setJenisPrestasiValue(data.jenis_prestasi);
    }, [data]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <Form {...PrestasiController.update.form(data.id)} className="flex flex-col gap-6" disableWhileProcessing>
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Edit Jenis Prestasi</DialogTitle>
                                <DialogDescription>Perbarui informasi jenis prestasi di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="nama_prestasi">Prestasi</Label>
                                    <Input id="nama_prestasi" name="nama_prestasi" defaultValue={data.nama_prestasi} required />
                                    <InputError message={errors.prestasi} className="mt-2" />
                                </div>
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="jenis_prestasi">Jenis Prestasi</Label>
                                    <Input id="jenis_prestasi" type="text" name="jenis_prestasi" value={jenisPrestasiValue} required hidden />
                                    <Select
                                        name="jenis_prestasi"
                                        required
                                        onValueChange={(value) => {
                                            setJenisPrestasiValue(value);
                                        }}
                                        value={jenisPrestasiValue}
                                    >
                                        <SelectTrigger className="w-full" id="jenis_prestasi">
                                            <SelectValue placeholder="Pilih Jenis Prestasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Internasional">Internasional</SelectItem>
                                            <SelectItem value="Nasional">Nasional</SelectItem>
                                            <SelectItem value="Regional">Regional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.jenis_prestasi} className="mt-2" />
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
