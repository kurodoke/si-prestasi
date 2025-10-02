export function formatDate(dateString?: string | null) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getNamaBulan(bulan?: number): string {
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    if (!bulan || bulan < 1 || bulan > 12) return '-';
    return bulanIndo[bulan - 1];
}