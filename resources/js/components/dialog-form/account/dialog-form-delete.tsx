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

export function DialogDelete({
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
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ini akan menghapus akun <span className="font-bold">{user.name}</span> secara permanen dan tidak dapat dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Tidak</AlertDialogCancel>
                    <Form {...UserManagementController.destroy.form(user.id)} className='w-full sm:w-auto'>
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
