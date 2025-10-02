import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageProps<T> {
    auth: Auth;
    [key: string]: T;
}


export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    role: 'admin' | 'validator';
    remember_token?: string;
    created_at: string;
    updated_at: string;
}

export interface Periode {
    id: number;
    periode: number;
    bulan_mulai: number;
    tahun_mulai: number;
    bulan_selesai: number;
    tahun_selesai: number;
    created_at: string;
    updated_at: string;
}

export interface Prestasi {
    id: number;
    nama_prestasi: string;
    jenis_prestasi: string;
    created_at: string;
    updated_at: string;
}

export interface DokumenBukti {
    id: number;
    laporan_prestasi_id: number;
    nama_file: string;
    path_file: string;
    created_at: string;
    updated_at: string;
}

export interface LaporanPrestasi {
    id: number;
    nama_mahasiswa: string;
    npm: string;
    no_hp: string;
    angkatan: string;

    nama_prestasi: string;
    prestasi_id: number;
    prestasi?: Prestasi;

    periode_id?: number;
    periode?: Periode;

    penerimaan_prestasi: string; // format: YYYY-MM-DD
    selesai_prestasi: string;    // format: YYYY-MM-DD

    status_validasi: 'pending' | 'disetujui';
    verified_at?: string | null;
    verified_by?: number | null;
    verifier?: User;

    dokumen_bukti?: DokumenBukti;

    created_at: string;
    updated_at: string;

    [key: string]: unknown; // Optional catch-all
}


export interface SummaryLaporan{
    total_laporan: number;
    delta_total: number;
    belum_diverifikasi: number;
    delta_belum_diverifikasi: number;
    sudah_diverifikasi: number;
    delta_sudah_diverifikasi: number;
}

export interface Berita{
    id: number;
    judul: string;
    thumbnail: string;
    konten: string;
    created_at: string;
    updated_at: string;
}