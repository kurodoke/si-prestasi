import LaporanPrestasiController from '@/actions/App/Http/Controllers/Admin/LaporanPrestasiController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import dokumen from '@/routes/admin/dokumen';
import { LaporanPrestasi } from '@/types';
import { formatDate, getNamaBulan } from '@/utils/date';
import { Form } from '@inertiajs/react';
import { CircleCheckIcon, Clock4Icon, DownloadIcon, LoaderCircle, PointerIcon } from 'lucide-react';

function InputLabel({ title, id, data, className }: { title: string; id: string; data: string; className?: string }) {
    return (
        <div className={'flex flex-col gap-2 ' + className}>
            <Label htmlFor={id}>{title}</Label>
            <Input id={id} name={id} defaultValue={data} disabled />
        </div>
    );
}

type InputLabelIconProps = {
    title: string;
    id: string;
    data: string;
    icon: React.ReactElement;
    className?: string;
};

type InputIconProps = {
    title: string;
    id?: string;
    data: string;
    icon: React.ReactElement;
    className?: string;
};

export function InputIcon({ title, id, data, icon, className }: InputIconProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Label htmlFor={id}>{title}</Label>
            <div className="relative w-full">
                <div className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 opacity-50">{icon}</div>
                <Input
                    id={id}
                    name={id}
                    defaultValue={data}
                    disabled
                    className="pl-8" // ruang untuk ikon
                />
            </div>
        </div>
    );
}

export function DialogEdit({
    data,
    open,
    setOpen,
    userRole,
}: {
    data: LaporanPrestasi;
    open: boolean;
    setOpen: (open: boolean) => void;
    userRole: string;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <Form
                    {...LaporanPrestasiController.update.form(data.id)}
                    className="flex flex-col gap-6"
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Detail Laporan Prestasi</DialogTitle>
                                <DialogDescription>
                                    Menampilkan informasi lengkap laporan prestasi milik <b>{data.nama_mahasiswa}</b>
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="max-h-[350px] md:max-h-[300px] md:max-w-[700px] lg:max-w-[800px]">
                                <div className="flex flex-col gap-6">
                                    {/* Informasi Mahasiswa */}
                                    <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                        <InputLabel
                                            className="col-span-4 md:col-span-6"
                                            title="Nama Mahasiswa"
                                            id="nama_mahasiswa"
                                            data={data.nama_mahasiswa}
                                        />

                                        <InputLabel
                                            className="col-span-4 md:col-span-6"
                                            title="No Telp"
                                            id="no_hp"
                                            data={data.no_hp}
                                        />
                                        <InputLabel className="col-span-2 md:col-span-6" title="NPM Mahasiswa" id="npm" data={data.npm} />
                                        <InputLabel className="col-span-2 md:col-span-6" title="Angkatan" id="angkatan" data={data.angkatan} />
                                    </div>

                                    <Separator />

                                    {/* Informasi Prestasi */}
                                    <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                        <InputLabel
                                            className="col-span-2 md:col-span-6"
                                            title="Nama Prestasi"
                                            id="nama_prestasi"
                                            data={data.prestasi?.nama_prestasi ?? '-'}
                                        />
                                        <InputLabel
                                            className="col-span-2 md:col-span-6"
                                            title="Jenis Prestasi"
                                            id="jenis_prestasi"
                                            data={data.prestasi?.jenis_prestasi ?? '-'}
                                        />
                                        <InputLabel
                                            className="col-span-2 md:col-span-6"
                                            title="Tanggal Mulai Prestasi"
                                            id="penerimaan_prestasi"
                                            data={formatDate(data.penerimaan_prestasi)}
                                        />
                                        <InputLabel
                                            className="col-span-2 md:col-span-6"
                                            title="Tanggal Selesai Prestasi"
                                            id="selesai_prestasi"
                                            data={formatDate(data.selesai_prestasi)}
                                        />
                                    </div>

                                    <Separator />

                                    {/* Status & Verifikasi */}
                                    <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="col-span-2 md:col-span-6">
                                                    <InputIcon
                                                        title="Periode Pelaporan"
                                                        data={
                                                            'Periode ' +
                                                            (data.periode?.periode?.toString() ?? '-') +
                                                            ' - ' +
                                                            (data.periode?.tahun_mulai ?? '')
                                                        }
                                                        icon={<PointerIcon className="h-4 w-4 text-blue-400 dark:text-blue-400" />}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {getNamaBulan(data.periode?.bulan_mulai)}/{data.periode?.tahun_mulai} -{' '}
                                                {getNamaBulan(data.periode?.bulan_selesai)}/{data.periode?.tahun_selesai}
                                            </TooltipContent>
                                        </Tooltip>

                                        <InputIcon
                                            className="col-span-2 md:col-span-6"
                                            title="Status Validasi"
                                            data={data.status_validasi === 'pending' ? 'Belum Disetujui' : 'Sudah Disetujui'}
                                            icon={
                                                data.status_validasi === 'pending' ? (
                                                    <Clock4Icon className="h-4 w-4 text-blue-400 dark:text-blue-400" />
                                                ) : (
                                                    <CircleCheckIcon className="h-4 w-4 text-green-400 dark:text-green-400" />
                                                )
                                            }
                                        />

                                        {data.status_validasi === 'disetujui' && (
                                            <>
                                                <InputLabel
                                                    className="col-span-2 md:col-span-6"
                                                    title="Disetujui Oleh"
                                                    id="verifier_name"
                                                    data={data.verifier?.name ?? '-'}
                                                />
                                                <InputLabel
                                                    className="col-span-2 md:col-span-6"
                                                    title="Tanggal Persetujuan"
                                                    id="verified_at"
                                                    data={formatDate(data.verified_at)}
                                                />
                                            </>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Dokumen */}
                                    <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                        <div className="col-span-4 grid justify-items-center gap-2 md:col-span-12">
                                            <Label htmlFor="dokumen">Lihat Dokumen Bukti</Label>
                                            <div className="flex w-full items-center gap-2 px-0 sm:px-2">
                                                {data.dokumen_bukti?.path_file && (
                                                    <Button
                                                        type="button"
                                                        tabIndex={-1}
                                                        className="group min-h-15 w-full border-2 border-dashed bg-background text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:outline-none sm:min-h-20"
                                                        onClick={() =>
                                                            window.open(dokumen.download.url(data.dokumen_bukti?.nama_file || ''), '_blank')
                                                        }
                                                    >
                                                        <div className="flex items-center justify-center gap-1 transition-transform duration-200 group-hover:scale-105">
                                                            <DownloadIcon className="h-4 w-4" />
                                                            <span>Download</span>
                                                        </div>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Tutup</Button>
                                </DialogClose>
                                {userRole === 'validator' && data.status_validasi !== 'disetujui' && (
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? 'Menyimpan...' : 'Verifikasi Prestasi'}
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
