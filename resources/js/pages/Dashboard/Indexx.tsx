import { Link, Head } from '@inertiajs/react'
import { PageProps } from '@/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronsUpDown, CheckCircle, Send, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import lapor from '@/routes/lapor'

// Definisikan tipe data yang lebih lengkap
interface LaporanPenerima {
    id: number
    prestasi: {
        nama: string
    }
    tahun_penerimaan: number
    status_validasi: 'pending' | 'diterima' | 'ditolak'
    created_at: string
    verified_at: string | null
    verifier: {
        name: string
    } | null
}

export default function Dashboard({
    auth,
    laporanPenerimas = [],
}: PageProps<{ laporanPenerimas: LaporanPenerima[] }>) {
    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'diterima':
                return 'success'
            case 'ditolak':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'diterima':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'ditolak':
                return <XCircle className="h-5 w-5 text-red-500" />
            default:
                return <Clock className="h-5 w-5 text-gray-500" />
        }
    }

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Halo, {auth.user.name}</h2>
                        <p className="text-muted-foreground">
                            Selamat datang di dasbor prestasi Anda.
                        </p>
                    </div>
                    <Link href={lapor.create().url}>
                        <Button>+ Lapor Prestasi</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Laporan Prestasi Anda</CardTitle>
                        <CardDescription>
                            Klik status untuk melihat timeline proses laporan Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {laporanPenerimas.length > 0 ? (
                                laporanPenerimas.map((laporan) => (
                                    <Collapsible key={laporan.id} className="rounded-md border">
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="font-semibold">
                                                    {laporan.prestasi.nama}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Tahun Penerimaan: {laporan.tahun_penerimaan}
                                                </p>
                                            </div>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-x-2"
                                                >
                                                    <Badge
                                                        variant={getBadgeVariant(
                                                            laporan.status_validasi,
                                                        )}
                                                    >
                                                        {laporan.status_validasi}
                                                    </Badge>
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                    <span className="sr-only">Toggle</span>
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="border-t px-4 py-6">
                                            <div className="relative flex w-full items-center justify-between">
                                                {/* Garis Timeline */}
                                                <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-border"></div>

                                                {/* Tahap 1: Dikirim */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                                                        <Send className="h-5 w-5" />
                                                    </div>
                                                    <p className="mt-2 text-sm font-medium">
                                                        Dikirim
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(
                                                            new Date(laporan.created_at),
                                                            'dd MMM yyyy',
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Tahap 2: Diverifikasi */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                                        laporan.status_validasi !== 'pending'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'bg-gray-200 text-gray-500'
                                                                    }`}
                                                                >
                                                                    <CheckCircle className="h-5 w-5" />
                                                                </div>
                                                            </TooltipTrigger>
                                                            {laporan.status_validasi !== 'pending' && (
                                                                <TooltipContent>
                                                                    <p>
                                                                        Diverifikasi oleh:{' '}
                                                                        {laporan.verifier?.name || 'Sistem'}
                                                                    </p>
                                                                    <p>
                                                                        Tanggal:{' '}
                                                                        {format(
                                                                            new Date(laporan.verified_at!),
                                                                            'dd MMM yyyy, HH:mm',
                                                                        )}
                                                                    </p>
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <p className="mt-2 text-sm font-medium">
                                                        Diverifikasi
                                                    </p>
                                                </div>

                                                {/* Tahap 3: Hasil Akhir */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                            laporan.status_validasi !== 'pending'
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                    >
                                                        {getStatusIcon(laporan.status_validasi)}
                                                    </div>
                                                    <p className="mt-2 text-sm font-medium">
                                                        Hasil
                                                    </p>
                                                </div>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    Anda belum pernah melaporkan prestasi.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}