import LaporanPrestasiController from '@/actions/App/Http/Controllers/Admin/LaporanPrestasiController';
import InputError from '@/components/input-error';
import { MonthYear, MonthYearRangePicker } from '@/components/month-year-range-picker';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Auth, Prestasi, Periode } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Check, ChevronDown, LoaderCircle, UploadIcon } from 'lucide-react';
import React from 'react';

export default function Create({ auth, periode, prestasi }: { auth: Auth; periode: Periode; prestasi: Prestasi[] }) {
    const [file, setFile] = React.useState<File | null>(null);
    const [range, setRange] = React.useState<{ from: MonthYear | null; to: MonthYear | null }>({
        from: null,
        to: null,
    });

    const [rangeError, setRangeError] = React.useState<string | null>(null);

    const [prestasiValue, setPrestasiValue] = React.useState<string>('');

    const [selectedFile, setSelectedFile] = React.useState(null);
    const inputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };
    const { errors } = usePage().props;

    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[url('/assets/images/background.jpg')] bg-cover bg-center bg-no-repeat p-4">
            <div className="relative flex w-full max-w-xl flex-1 flex-col overflow-x-hidden rounded bg-background shadow-xl md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2">
                <div className="px-6 py-8">
                    <div className="mb-6 flex flex-col items-center">
                        <a target="_blank" href="https://ft.unib.ac.id/" className="flex flex-col">
                            <div className="flex aspect-square size-25 items-center justify-center rounded-lg text-sidebar-accent-foreground">
                                <img src="/assets/images/logo.png" className="size-20" />
                            </div>
                        </a>
                        <h2 className="text-center text-2xl font-bold text-sidebar-accent-foreground">Formulir Prestasi Teknik Informatika</h2>
                        <h2 className="text-center text-2xl font-bold text-sidebar-accent-foreground">
                            Periode {periode.periode} {periode.tahun_mulai}
                        </h2>
                        <p className="text-center text-sm text-muted-foreground">Silakan isi data sesuai prestasi yang telah kamu terima.</p>
                    </div>
                    {flash?.success || flash?.error ? (
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-12">
                            <div className="col-span-4 grid gap-1 text-center text-sidebar-accent-foreground md:col-span-12">
                                {flash?.error}
                                {flash?.success}
                            </div>
                        </div>
                    ) : (
                        <Form
                            {...LaporanPrestasiController.store.form({ id: periode.periode, tahun_mulai: periode.tahun_mulai })}
                            className="flex flex-col gap-6"
                            disableWhileProcessing
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-12">
                                        {/* Nama */}
                                        <div className="col-span-4 grid gap-1 md:col-span-12">
                                            <Label htmlFor="nama">Nama</Label>
                                            <Input id="nama" name="name" required placeholder="Masukkan Nama Lengkap" />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        {/* Angkatan */}
                                        <div className="col-span-4 grid gap-1 md:col-span-12">
                                            <Label htmlFor="angkatan">Angkatan</Label>
                                            <Input
                                                id="angkatan"
                                                name="angkatan"
                                                required
                                                placeholder="Dalam Bentuk Tahun. contoh 2018"
                                                inputMode="numeric"
                                                onInput={(e) => {
                                                    if (e.target.value.length > 4) {
                                                        e.target.value = e.target.value.slice(0, 4);
                                                    }
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }}
                                                type="text"
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        {/* NPM */}
                                        <div className="col-span-4 grid gap-1 md:col-span-6">
                                            <Label htmlFor="npm">NPM</Label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2 text-muted-foreground">
                                                    G1A
                                                    <span className="h-5 w-px bg-border" />
                                                </span>
                                                <Input
                                                    id="npm"
                                                    name="npm"
                                                    required
                                                    placeholder="001001"
                                                    title="NPM harus berupa 6 digit angka"
                                                    className="pl-15"
                                                    inputMode="numeric"
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 6) {
                                                            e.target.value = e.target.value.slice(0, 6);
                                                        }
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    type="text"
                                                />
                                            </div>
                                            <InputError message={errors.npm} className="mt-2" />
                                        </div>
                                        {/* Nomor HP */}
                                        <div className="col-span-4 grid gap-1 md:col-span-6">
                                            <Label htmlFor="np_hp">Nomor HP</Label>
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2 text-muted-foreground">
                                                    +62
                                                    <span className="h-5 w-px bg-border" />
                                                </span>
                                                <Input
                                                    id="np_hp"
                                                    name="np_hp"
                                                    required
                                                    placeholder="81234567890"
                                                    title="Nomor HP harus berupa 9-11 digit setelah +62"
                                                    className="pl-14"
                                                    inputMode="numeric"
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    type="text"
                                                />
                                            </div>
                                            <InputError message={errors.np_hp} className="mt-2" />
                                        </div>

                                        {/* Prestasi */}
                                        <div className="col-span-4 grid gap-1 md:col-span-12">
                                            <Label htmlFor="prestasi">Prestasi</Label>
                                            <Input type="hidden" name="prestasi" value={prestasiValue} required />
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        role="combobox"
                                                        variant="outline"
                                                        className={cn('w-full justify-between', !prestasiValue && 'text-muted-foreground')}
                                                    >
                                                        {prestasiValue
                                                            ? `${prestasi.find((b_item) => b_item.id.toString() === prestasiValue)?.nama_prestasi} (Prestasi ${prestasi.find((b_item) => b_item.id.toString() === prestasiValue)?.jenis_prestasi} )`
                                                            : 'Pilih Prestasi'}
                                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Cari Prestasi..." className="h-9" />
                                                        <CommandEmpty>Prestasi tidak ditemukan.</CommandEmpty>

                                                        <div className="max-h-[300px] overflow-y-auto">
                                                            <CommandGroup heading="Pilih Prestasi Yang Telah Terdaftar">
                                                                {prestasi.map((b_item) => (
                                                                    <CommandItem
                                                                        key={b_item.id}
                                                                        value={`${b_item.nama_prestasi} Prestasi ${b_item.jenis_prestasi}`}
                                                                        onSelect={() => setPrestasiValue(b_item.id.toString())}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                'mr-2 h-4 w-4',
                                                                                prestasiValue === b_item.id.toString() ? 'opacity-100' : 'opacity-0',
                                                                            )}
                                                                        />
                                                                        {b_item.nama_prestasi} (Prestasi {b_item.jenis_prestasi})
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </div>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <Input type="hidden" name="prestasi" value={prestasiValue} required />
                                            <InputError message={errors?.prestasi} className="mt-2" />
                                        </div>

                                        {/* Jangka Waktu Penerimaan Prestasi */}
                                        <div className="col-span-4 grid gap-1 md:col-span-12">
                                            <Label htmlFor="">Jangka Waktu Penerimaan Prestasi</Label>
                                            <MonthYearRangePicker title="Penerimaan" from={range.from} to={range.to} onChange={setRange} />
                                            {rangeError && <InputError message={rangeError} className="mt-2" />}
                                            <InputError
                                                message={errors?.penerimaan || errors?.selesai ? 'Jangka Waktu Penerimaan Prestasi harus diisi' : ''}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Dokumen Bukti */}
                                        <div className="col-span-4 grid justify-items-center gap-2 md:col-span-12">
                                            <Label htmlFor="dokumen-bukti">Upload Dokumen Bukti</Label>
                                            <div className="flex w-full items-center gap-2 px-0" onDrop={handleDrop} onDragOver={handleDragOver}>
                                                {/* Hidden input */}
                                                <input
                                                    ref={inputRef}
                                                    id="dokumen-bukti"
                                                    name="dokumen_bukti"
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />

                                                <Button
                                                    type="button"
                                                    tabIndex={0}
                                                    className="group min-h-20 w-full border-2 border-dashed bg-background text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:outline-none sm:min-h-30"
                                                    onClick={() => inputRef.current?.click()}
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-1 transition-transform duration-200 group-hover:scale-105">
                                                        <UploadIcon className="h-5 w-5" />
                                                        {selectedFile ? (
                                                            <span className="line-clamp-2 px-2 text-center text-xs font-medium">
                                                                {selectedFile.name}
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <span>Upload atau Drag file ke sini</span>
                                                                <span className="text-xs text-muted-foreground">hanya format .pdf</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </Button>
                                            </div>
                                            <InputError message={errors?.dokumen_bukti} className="mt-2" />
                                        </div>

                                        {/* Hidden inputs for range & periode */}
                                        <Input type="hidden" name="periode_id" value={periode.id} />
                                        <Input
                                            type="hidden"
                                            name="penerimaan"
                                            value={range.from ? `${range.from.year}-${String(range.from.month + 1).padStart(2, '0')}-01` : ''}
                                        />
                                        <Input
                                            type="hidden"
                                            name="selesai"
                                            value={range.to ? `${range.to.year}-${String(range.to.month + 1).padStart(2, '0')}-01` : ''}
                                        />

                                        {/* Tombol Submit */}
                                        <div className="col-span-4 grid justify-items-center gap-2 md:col-span-12">
                                            <Button type="submit" className="w-full" disabled={processing}>
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                {processing ? 'Mengirim...' : 'Kirim'}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}
