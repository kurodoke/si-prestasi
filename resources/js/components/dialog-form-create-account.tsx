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
import InputError from './input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function DialogCreateAccount() {
    const [password, setPassword] = React.useState('');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Tambah Akun</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <Form
                    {...UserManagementController.store.form()}
                    className="flex flex-col gap-6"
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Tambah Akun</DialogTitle>
                                <DialogDescription>Buat akun baru dengan mengisi form di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                {/* Nama */}
                                <div className="col-span-4 grid gap-1 md:col-span-6">
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input id="nama" name="name" required />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email */}
                                <div className="col-span-4 grid gap-1 md:col-span-6">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" required />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Role */}
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Role..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="validator">Validator</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                </div>

                                {/* Password */}
                                <div className="col-span-2 grid gap-1 md:col-span-6">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Konfirmasi Password */}
                                <div className="col-span-2 grid gap-1 md:col-span-6">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input id="password_confirmation" type="password" name="password_confirmation" required disabled={!password} />
                                    <InputError message={errors.password_confirmation} />
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
