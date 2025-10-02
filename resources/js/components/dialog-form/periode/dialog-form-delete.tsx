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
import PeriodeController from '@/actions/App/Http/Controllers/Admin/PeriodeController';

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
                        Ini akan menghapus periode <span className="font-bold">{data.periode} - {data.tahun_mulai}</span> beserta data prestasi berjumlah <span className='font-bold text-lg'>{data.jumlah_laporan}</span> secara permanen dan tidak dapat dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Tidak</AlertDialogCancel>
                    <Form {...PeriodeController.destroy.form(data.id)} className='w-full sm:w-auto'>
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
