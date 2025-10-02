import { DataTable } from '@/components/data-table/berita/data-table';
import { FlashAlert } from '@/components/flash-alert';
import AppLayout from '@/layouts/app-layout';
import berita from '@/routes/admin/berita';
import users from '@/routes/admin/users';
import { Auth } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface Berita {
    id: number;
    judul: string;
    konten: string;
    created_at: Date;
    updated_at: Date;
}


export default function Index({ auth, data }: { auth: Auth; data: Array<Berita> }) {    
    
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
        <AppLayout breadcrumbs={[{ title: 'Manajemen Berita', href: berita.index.url() }]}>
            {show && message && Object.keys(errors).length == 0 && (
                <FlashAlert
                    key={Date.now()}
                    message={message.text}
                    variant={message.type === 'success' ? 'default' : 'destructive'}
                    duration={3000}
                />
            )}

            <DataTable data={data} auth={auth} />
        </AppLayout>
    );
}
