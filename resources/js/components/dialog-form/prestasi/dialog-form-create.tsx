import PrestasiController from '@/actions/App/Http/Controllers/Admin/PrestasiController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { LoaderCircle, PlusIcon } from 'lucide-react';
import InputError from '../../input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import React from 'react';

export function DialogCreate() {
    const [jenisPrestasiValue, setJenisPrestasiValue] = React.useState('');


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Tambah Prestasi</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...PrestasiController.store.form()} className="flex flex-col gap-6" resetOnSuccess={['jenis_prestasi']} disableWhileProcessing>
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Tambah Prestasi</DialogTitle>
                                <DialogDescription>Buat prestasi baru dengan mengisi form di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="nama_prestasi">Prestasi</Label>
                                    <Input id="nama_prestasi" name="nama_prestasi" required />
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
