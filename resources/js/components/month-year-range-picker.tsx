import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils'; // pastikan ini ada
import { CalendarArrowDown, CalendarArrowUp, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export type MonthYear = {
    month: number; // 0-11
    year: number;
};

interface MonthYearRangePickerProps {
    from: MonthYear | null;
    to: MonthYear | null;
    onChange: (range: { from: MonthYear | null; to: MonthYear | null }) => void;
    title: string
}

export const MonthYearRangePicker: React.FC<MonthYearRangePickerProps> = ({ from, to, onChange, title}) => {
    const [openPicker, setOpenPicker] = React.useState<'from' | 'to' | null>(null);
    const [yearView, setYearView] = React.useState<number>(from?.year || new Date().getFullYear());

    const handleSelect = (month: number) => {
        if (openPicker === 'from') {
            const newFrom = { month, year: yearView };
            onChange({
                from: newFrom,
                to: null, // reset TO when FROM changes
            });
            setOpenPicker('to');
            setYearView(newFrom.year);
        } else if (openPicker === 'to') {
            const newTo = { month, year: yearView };
            onChange({
                from,
                to: newTo,
            });
            setOpenPicker(null);
        }
    };

    const formatLabel = (value: MonthYear | null) => {
        if (!value) return 'Pilih';
        return `${months[value.month].slice(0, 3)} ${value.year}`;
    };

    return (
        <div className="w-full grid grid-cols-2 gap-2">
            {/* FROM Picker */}
            <Popover open={openPicker === 'from'} onOpenChange={() => setOpenPicker(openPicker === 'from' ? null : 'from')}>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <CalendarArrowDown className="mr-1 h-4 w-4" />Mulai {title} : {formatLabel(from)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                    <YearMonthGrid selected={from} year={yearView} onMonthSelect={handleSelect} onYearChange={setYearView} from={from} to={to} />
                </PopoverContent>
            </Popover>

            {/* TO Picker */}
            <Popover
                open={openPicker === 'to'}
                onOpenChange={() => {
                    if (from) setOpenPicker(openPicker === 'to' ? null : 'to');
                }}
            >
                <PopoverTrigger asChild>
                    <Button variant="outline" disabled={!from}>
                        <CalendarArrowUp className="mr-1 h-4 w-4" />Akhir {title} : {formatLabel(to)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                    <YearMonthGrid
                        selected={to}
                        year={yearView}
                        onMonthSelect={handleSelect}
                        onYearChange={setYearView}
                        disabledBefore={from || undefined}
                        from={from}
                        to={to}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

interface YearMonthGridProps {
    selected: MonthYear | null;
    year: number;
    onYearChange: (year: number) => void;
    onMonthSelect: (month: number) => void;
    disabledBefore?: MonthYear;
    from?: MonthYear | null;
    to?: MonthYear | null;
}

// Helper to check if a month-year is in the range
const isInRange = (month: number, year: number, from?: MonthYear | null, to?: MonthYear | null) => {
    if (!from || !to) return false;

    const current = new Date(year, month);
    const fromDate = new Date(from.year, from.month);
    const toDate = new Date(to.year, to.month);

    return current >= fromDate && current <= toDate;
};

const YearMonthGrid: React.FC<YearMonthGridProps> = ({ selected, year, onYearChange, onMonthSelect, disabledBefore, from, to }) => {
    const isMonthDisabled = (monthIdx: number) => {
        if (!disabledBefore) return false;

        // Prevent selecting same month & year as FROM
        if (year < disabledBefore.year) return true;
        if (year === disabledBefore.year && monthIdx <= disabledBefore.month) return true;

        return false;
    };

    const canGoPrevYear = !disabledBefore || year > disabledBefore.year;

    return (
        <div className="space-y-2">
            {/* Year Navigation */}
            <div className="mb-2 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => onYearChange(year - 1)} disabled={!canGoPrevYear}>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold">{year}</div>
                <Button variant="ghost" size="icon" onClick={() => onYearChange(year + 1)}>
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-y-2">
                {months.map((month, idx) => {
                    const isSelected = selected?.month === idx && selected?.year === year || from?.month === idx && from?.year === year || to?.month === idx && to?.year === year;
                    const isDisabled = isMonthDisabled(idx);
                    const inRange = isInRange(idx, year, from, to);

                    return (
                        <Button
                            key={month}
                            variant={isSelected ? 'default' : 'ghost'}
                            className={cn(
                                'w-full',
                                inRange && !isSelected && 'bg-muted text-muted-foreground',
                                isDisabled && 'pointer-events-none opacity-50',
                            )}
                            onClick={() => !isDisabled && onMonthSelect(idx)}
                            disabled={isDisabled}
                        >
                            {month}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
