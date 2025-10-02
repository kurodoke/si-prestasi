import PeriodeController from '@/actions/App/Http/Controllers/Admin/PeriodeController';
import { MonthYear, MonthYearRangePicker } from '@/components/month-year-range-picker';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { LoaderCircle, PlusIcon } from 'lucide-react';
import React from 'react';
import InputError from '../../input-error';

export function DialogCreate() {
    const [range, setRange] = React.useState<{ from: MonthYear | null; to: MonthYear | null }>({
        from: null,
        to: null,
    });

    const [rangeError, setRangeError] = React.useState<string | null>(null);

    const [periodeValue, setPeriodeValue] = React.useState('Ganjil');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">Tambah Periode</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form
                    {...PeriodeController.store.form()}
                    className="flex flex-col gap-6"
                    resetOnSuccess={['periode']}
                    disableWhileProcessing
                    onBefore={() => {
                        if (!range.from || !range.to) {
                            setRangeError('Rentang periode harus dipilih semua.');
                            return false; // cegah submit
                        }

                        setRangeError(null);
                        return true;
                    }}
                    onSuccess={() => {
                        setRange({ from: null, to: null });
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Tambah Periode</DialogTitle>
                                <DialogDescription>Buat Periode baru dengan mengisi form di bawah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="periode">Periode</Label>
                                    <Input id="periode" type="text" name="periode" value={periodeValue} required hidden />
                                    <Select
                                    
                                        name="periode"
                                        required
                                        onValueChange={(value) => {
                                            setPeriodeValue(value);
                                        }}
                                    >
                                        <SelectTrigger className='w-full' id="periode">
                                            <SelectValue placeholder="Pilih periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className='text-sidebar-accent-foreground text-center'>Periode Tidak Bisa Diubah</SelectLabel>
                                                <SelectItem value="Ganjil">Ganjil</SelectItem>
                                                <SelectItem value="Genap">Genap</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.periode} className="mt-2" />
                                </div>
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="">Rentang Periode</Label>
                                    <MonthYearRangePicker title='Periode' from={range.from} to={range.to} onChange={setRange} />
                                    {rangeError && <InputError message={rangeError} className="mt-2" />}
                                </div>

                                <Input type="hidden" name="bulan_mulai" value={(range.from?.month || 0) + 1} />
                                <Input type="hidden" name="bulan_selesai" value={(range.to?.month || 0) + 1} />
                                <Input type="hidden" name="tahun_mulai" value={range.from?.year} />
                                <Input type="hidden" name="tahun_selesai" value={range.to?.year} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
