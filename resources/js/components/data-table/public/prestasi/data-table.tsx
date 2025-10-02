import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    CalendarClockIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    GripVerticalIcon,
    Search,
} from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Periode } from '@/types';

export const schema = z.object({
    id: z.number().int(),
    nama_mahasiswa: z.string(),
    npm: z.string().regex(/^[0-9]{8,12}$/),
    angkatan: z.string(),
    nama_prestasi: z.string(),
    prestasi_id: z.number().int(),
    periode_id: z.optional(z.number().int()),
    penerimaan_prestasi: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    selesai_prestasi: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status_validasi: z.enum(['pending', 'disetujui']),
    verified_at: z.optional(z.string().datetime()),
    verified_by: z.optional(z.number().int()),
    periode: z.optional(
        z.object({
            id: z.number().int(),
            periode: z.number().int(),
            tahun_mulai: z.string(),
            bulan_mulai: z.string(),
            tahun_selesai: z.string(),
            bulan_selesai: z.string(),
        }),
    ),
    prestasi: z.optional(z.object({ id: z.number().int(), nama_prestasi: z.string(), jenis_prestasi: z.string() })),
    verifier: z.optional(z.object({ id: z.number().int(), name: z.string() })),
    dokumenBukti: z.optional(z.object({ id: z.number().int(), nama_file: z.string(), path_file: z.string() })),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    });

    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
            <GripVerticalIcon className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    );
}

const createColumns = (handlers: {
    onEdit: (data: z.infer<typeof schema>) => void;
    onDelete: (data: z.infer<typeof schema>) => void;
}): ColumnDef<z.infer<typeof schema>>[] => [
    {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => <div className="w-min-32 font-bold">{row.original.nama_mahasiswa}</div>,
        enableHiding: false,
    },
    {
        accessorKey: 'npm',
        header: 'NPM',
        cell: ({ row }) => <div className="w-min-32 font-normal">{row.original.npm}</div>,
        enableHiding: false,
    },
    {
        accessorKey: 'angkatan',
        header: 'Angkatan',
        cell: ({ row }) => <div className="w-min-32 font-normal">{row.original.angkatan}</div>,
    },

    {
        accessorKey: 'nama_prestasi',
        header: 'Prestasi',
        cell: ({ row }) => <div className="w-min-32 font-normal">{row.original.prestasi?.nama_prestasi}</div>,
    },
    {
        accessorKey: 'periode',
        header: 'Periode',
        cell: ({ row }) => (
            <div className="w-32">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                            Periode{' '}
                            <span className="text-md font-bold">
                                {row.original.periode?.periode} {row.original.periode?.tahun_mulai}
                            </span>
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        {row.original.periode?.bulan_mulai}/{row.original.periode?.tahun_mulai} - {row.original.periode?.bulan_selesai}/
                        {row.original.periode?.tahun_selesai}
                    </TooltipContent>
                </Tooltip>
            </div>
        ),
        enableHiding: false,
        filterFn: (row, id, value) => {
            return row.original.periode?.id === Number(value);
        },
    },
];

export function DataTable({ data: initialData, periode_list }: { data: z.infer<typeof schema>[]; periode_list: Array<Periode> }) {
    const [openDialogUpdate, setOpenDialogUpdate] = React.useState(false);
    const [globalFilter, setGlobalFilter] = React.useState('');

    const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
    const [selectedLaporan, setSelectedLaporan] = React.useState<z.infer<typeof schema>>({
        id: 0,
        nama_mahasiswa: '',
        npm: '', // harus valid sesuai regex: 8-12 digit
        angkatan: '',
        nama_prestasi: '',
        prestasi_id: 0,
        periode_id: undefined,
        penerimaan_prestasi: '2001-01-01', // format: YYYY-MM-DD
        selesai_prestasi: '2001-12-31', // format: YYYY-MM-DD
        status_validasi: 'pending',
        verified_at: undefined,
        verified_by: undefined,
        created_at: new Date().toISOString(), // ISO string datetime
        updated_at: new Date().toISOString(), // ISO string datetime

        periode: {
            id: 0,
            periode: 0,
            tahun_mulai: '',
            bulan_mulai: '',
            tahun_selesai: '',
            bulan_selesai: '',
        },

        prestasi: {
            id: 0,
            nama_prestasi: '',
            jenis_prestasi: '',
        },

        verifier: {
            id: 0,
            name: '',
        },

        dokumenBukti: {
            id: 0,
            nama_file: '',
            path_file: '',
        },
    });

    const [data, setData] = React.useState(() => initialData);
    React.useEffect(() => {
        setData(initialData);
    }, [initialData]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const sortableId = React.useId();
    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

    const columns = React.useMemo(
        () =>
            createColumns({
                onEdit: (data) => {
                    setSelectedLaporan(data);
                    setOpenDialogUpdate(true);
                },
                onDelete: (data) => {
                    setSelectedLaporan(data);
                    setOpenDialogDelete(true);
                },
            }),
        [],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
            globalFilter,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            return Object.values(row.original).some((value) => String(value).toLowerCase().includes(filterValue.toLowerCase()));
        },
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    return (
        <Tabs defaultValue="outline" className="flex w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <div className="relative w-full max-w-sm">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <Input
                        placeholder="Cari..."
                        value={globalFilter ?? ''}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-8 pl-7"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </div>
                <div className="flex items-center justify-end gap-2">
                    {/* TODO: FILTER BERDASARKAN NAMA BEASISWA */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <CalendarClockIcon />
                                <span className="hidden lg:inline">Pilih Periode</span>
                                <span className="lg:hidden">Periode</span>
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {periode_list.map((periode) => (
                                <DropdownMenuCheckboxItem
                                    key={'filter-periode-' + periode.id}
                                    className="capitalize"
                                    checked={periode.id === table.getColumn('periode')?.getFilterValue()}
                                    onCheckedChange={(checked) => {
                                        table.getColumn('periode')?.setFilterValue(checked ? periode.id : undefined);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <p className="font-bold">
                                            Periode {periode.periode} - {periode.tahun_mulai}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {periode.bulan_mulai}/{periode.tahun_mulai} - {periode.bulan_selesai}/{periode.tahun_selesai}
                                        </p>
                                    </div>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Tidak ada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex"></div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
