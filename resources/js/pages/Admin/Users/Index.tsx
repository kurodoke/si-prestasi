import { DataTable } from '@/components/data-table-account';
import { FlashAlert } from '@/components/flash-alert';
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/admin/users';
import { Auth } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface Account {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Index({ auth, accounts }: { auth: Auth; accounts: Account[] }) {
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };
    const { errors } = usePage().props;

    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {        
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
            setShow(true);
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
            setShow(true);
        }
    }, [flash?.success, flash?.error, errors]);
    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Akun', href: users.index.url() }]}>
            {show && message && Object.keys(errors).length == 0 && (
                <FlashAlert
                    key={Date.now()}
                    message={message.text}
                    variant={message.type === 'success' ? 'default' : 'destructive'}
                    duration={3000}
                />
            )}

            <DataTable data={accounts} auth={auth} />
        </AppLayout>
    );
}
