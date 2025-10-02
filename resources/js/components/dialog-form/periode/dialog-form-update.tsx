import PeriodeController from '@/actions/App/Http/Controllers/Admin/PeriodeController';
import { MonthYear, MonthYearRangePicker } from '@/components/month-year-range-picker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import InputError from '../../input-error';
import { set } from 'zod';

export function DialogEdit({ data, open, setOpen }: { data: any; open: boolean; setOpen: (open: boolean) => void }) {
    const [range, setRange] = React.useState<{ from: MonthYear | null; to: MonthYear | null }>({
        from: null,
        to: null,
    });

    const [rangeError, setRangeError] = React.useState<string | null>(null);
    const [periodeValue, setPeriodeValue] = React.useState('Ganjil');
    React.useEffect(() => {
        setRange({
            from: data.bulan_mulai && data.tahun_mulai ? { month: data.bulan_mulai - 1, year: data.tahun_mulai } : null,
            to: data.bulan_selesai && data.tahun_selesai ? { month: data.bulan_selesai - 1, year: data.tahun_selesai } : null,
        });
        setPeriodeValue(data.periode);
    }, [data]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <Form
                    {...PeriodeController.update.form(data.id)}
                    className="flex flex-col gap-6"
                    disableWhileProcessing
                    onBefore={() => {
                        if (!range.from || !range.to) {
                            setRangeError('Rentang periode harus dipilih semua.');
                            return false; // cegah submit
                        }

                        setRangeError(null);
                        return true;
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
                                        value={periodeValue}
                                        disabled
                                    >
                                        <SelectTrigger className="w-full" id="periode">
                                            <SelectValue placeholder="Pilih periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ganjil">Ganjil</SelectItem>
                                            <SelectItem value="Genap">Genap</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.periode} className="mt-2" />
                                </div>
                                <div className="col-span-4 grid gap-1 md:col-span-12">
                                    <Label htmlFor="">Rentang Periode</Label>
                                    <MonthYearRangePicker from={range.from} to={range.to} onChange={setRange} />
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
