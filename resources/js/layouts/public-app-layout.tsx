import { Footer } from '@/components/footer';
import Navbar from '@/components/navbar';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-muted">
            <Navbar />
            <main className="mx-auto px-4 pt-6 sm:px-12">{children}</main>
            <Footer />
        </div>
    );
}
