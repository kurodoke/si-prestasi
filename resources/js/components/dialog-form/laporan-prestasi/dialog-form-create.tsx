import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
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
import React from 'react';
import InputError from '../../input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import PrestasiController from '@/actions/App/Http/Controllers/Admin/PrestasiController';

export function DialogCreate() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Tambah Jenis Prestasi</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form
                    {...PrestasiController.store.form()}
                    className="flex flex-col gap-6"
                    resetOnSuccess={['jenis_prestasi']}
                    disableWhileProcessing
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Tambah Jenis Prestasi</DialogTitle>
                                <DialogDescription>Buat jenis prestasi baru dengan mengisi form di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="jenis_prestasi">Jenis Prestasi</Label>
                                    <Input id="jenis_prestasi" name="jenis_prestasi" required />
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
