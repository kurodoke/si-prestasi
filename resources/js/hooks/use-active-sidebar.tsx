import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export function useActiveSidebar() {
    const [activeSidebar, setActiveSidebarState] = useState('Dashboard');

    // Ambil dari URL saat pertama kali
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sidebar = params.get('sidebar');
        if (sidebar) {
            setActiveSidebarState(sidebar);
        }
    }, []);

    const setActiveSidebar = (value: string) => {
        setActiveSidebarState(value);

        // Update URL query param (tanpa reload data dari server)
        const url = new URL(window.location.href);
        url.searchParams.set('sidebar', value);

        router.visit(url.pathname + '?' + url.searchParams.toString(), {
            preserveScroll: true,
            preserveState: true,
            replace: true, // jangan push ke history
            only: [], // tidak fetch ulang
        });
    };

    return {
        activeSidebar,
        setActiveSidebar,
    };
}
