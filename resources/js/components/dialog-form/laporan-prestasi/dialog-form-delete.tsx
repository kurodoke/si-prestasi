import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import { Form } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../ui/alert-dialog';
import PrestasiController from '@/actions/App/Http/Controllers/Admin/PrestasiController';
import LaporanPrestasiController from '@/actions/App/Http/Controllers/Admin/LaporanPrestasiController';

export function DialogDelete({
    data,
    open,
    setOpen,
}: {
    data: any;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ini akan menghapus laporan prestasi dari <span className="font-bold">{data.nama_mahasiswa}</span> secara permanen dan tidak dapat dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Tidak</AlertDialogCancel>
                    <Form {...LaporanPrestasiController.destroy.form(data.id)} className='w-full sm:w-auto'>
                        <AlertDialogAction
                            type="submit"
                            className='w-full sm:w-auto'
                        >
                            Ya
                        </AlertDialogAction>
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
