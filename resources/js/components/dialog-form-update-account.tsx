import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import InputError from './input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function DialogEditAccount({
    user,
    open,
    setOpen,
    loggedInUser,
}: {
    user: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    loggedInUser: any;
}) {
    const isEditingSelf = loggedInUser?.id === user.id;

    // State untuk password input agar bisa kontrol enable konfirmasi password
    const [password, setPassword] = React.useState('');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <Form
                    {...UserManagementController.update.form(user.id)}
                    className="flex flex-col gap-6"
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Edit Akun</DialogTitle>
                                <DialogDescription>Perbarui informasi akun di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                <div className="col-span-4 grid gap-1 md:col-span-6">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input id="name" name="name" defaultValue={user.name} required />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="col-span-4 grid gap-1 md:col-span-6">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" defaultValue={user.email} required />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue={user.role} disabled={isEditingSelf}>
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
                                    <InputError message={errors.role} />
                                    {isEditingSelf && (
                                        <p className="mt-1 text-sm text-muted-foreground">Kamu tidak bisa mengubah role akunmu sendiri.</p>
                                    )}
                                </div>

                                <div className="col-span-2 grid gap-1 md:col-span-6">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="col-span-2 grid gap-1 md:col-span-6">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        disabled={!password} // Disabled kalau password kosong
                                    />
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
