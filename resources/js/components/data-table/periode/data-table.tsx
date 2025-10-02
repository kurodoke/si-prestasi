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
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    FileWarningIcon,
    ForwardIcon,
    GripVerticalIcon,
    MoreVerticalIcon,
    Search,
} from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import laporan from '@/routes/laporan';
import { getNamaBulan } from '@/utils/date';
import { DialogCreate } from '../../dialog-form/periode/dialog-form-create';
import { DialogDelete } from '../../dialog-form/periode/dialog-form-delete';
import { DialogEdit } from '../../dialog-form/periode/dialog-form-update';
import { Input } from '../../ui/input';

export const schema = z.object({
    id: z.number(),
    periode: z.string(),
    bulan_mulai: z.string(),
    tahun_mulai: z.string(),
    bulan_selesai: z.string(),
    tahun_selesai: z.string(),
    jumlah_laporan: z.number(),
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
    authUserId: number;
}): ColumnDef<z.infer<typeof schema>>[] => [
    {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        accessorKey: 'periode',
        header: 'Periode',
        cell: ({ row }) => (
            <div className="w-min-32 w-full font-medium">
                Periode {row.original.periode} - {row.original.tahun_mulai}
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'periode_mulai_selesai',
        header: 'Periode Mulai - Selesai',
        cell: ({ row }) => (
            <div className="w-min-32 w-full font-normal">
                <Badge variant={'secondary'}>
                    {getNamaBulan(Number(row.original.bulan_mulai))} / {row.original.tahun_mulai}
                </Badge>{' '}
                <span className="font-bold">-</span>{' '}
                <Badge>
                    {getNamaBulan(Number(row.original.bulan_selesai))} / {row.original.tahun_selesai}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: 'link_pendaftaran_periode',
        header: 'Link Pendaftaran Periode',
        cell: ({ row }) => {
            const dateNow = new Date();

            const tahunMulai = Number(row.original.tahun_mulai);
            const bulanMulai = Number(row.original.bulan_mulai) - 1;
            const tahunSelesai = Number(row.original.tahun_selesai);
            const bulanSelesai = Number(row.original.bulan_selesai) - 1;

            const dateMulai = new Date(tahunMulai, bulanMulai, 1);
            const dateSelesai = new Date(tahunSelesai, bulanSelesai + 1, 0); // Hari terakhir bulan selesai

            const isInPeriode = dateNow >= dateMulai && dateNow <= dateSelesai;

            const handleCopy = () => {
                const path = laporan.create([row.original.periode ,row.original.tahun_mulai]).url;
                const fullLink = `${window.location.origin}${path}`;

                navigator.clipboard
                    .writeText(fullLink)
                    .then(() => {
                        alert('Link berhasil disalin!');
                    })
                    .catch(() => {
                        alert('Gagal menyalin link.');
                    });
            };

            return (
                <div className="w-32">
                    <Button
                        variant="link"
                        size={'sm'}
                        onClick={handleCopy}
                        disabled={!isInPeriode}
                        className={`text-sm shadow-none ${isInPeriode ? '' : 'cursor-not-allowed bg-accent text-accent-foreground'}`}
                    >
                        {isInPeriode ? <ForwardIcon className="h-4 w-4" /> : <FileWarningIcon className="h-4 w-4" />}
                        {isInPeriode ? 'Bagikan Link' : 'Sudah ditutup'}
                    </Button>
                </div>
            );
        },
    },

    {
        accessorKey: 'jumlah_laporan',
        header: 'Jumlah Laporan',
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    <span className="text-lg font-bold">{row.original.jumlah_laporan}</span> Laporan
                </Badge>
            </div>
        ),
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
                            <MoreVerticalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => {
                                handlers.onEdit(row.original);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                                handlers.onDelete(row.original);
                            }}
                        >
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];

export function DataTable({ data: initialData, auth }: { data: z.infer<typeof schema>[]; auth: any }) {
    const [openDialogUpdate, setOpenDialogUpdate] = React.useState(false);
    const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
    const [selectedPeriode, setSelectedPeriode] = React.useState<z.infer<typeof schema>>({
        id: 0,
        periode: '',
        bulan_mulai: '',
        tahun_mulai: '',
        bulan_selesai: '',
        tahun_selesai: '',
        jumlah_laporan: 0,
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
                    setSelectedPeriode(data);
                    setOpenDialogUpdate(true);
                },
                onDelete: (data) => {
                    setSelectedPeriode(data);
                    setOpenDialogDelete(true);
                },
                authUserId: auth.user.id,
            }),
        [auth.user.id],
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
        globalFilterFn: (row, columnId, filterValue) => {
            return row.original.tahun_mulai.toString().includes(filterValue.toLowerCase());
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
                        placeholder="Cari Periode Berdasarkan Tahun..."
                        value={table.getState().globalFilter ?? ''}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="h-8 pl-7"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <DialogCreate />
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
            <DialogEdit data={selectedPeriode} open={openDialogUpdate} setOpen={setOpenDialogUpdate} />
            <DialogDelete data={selectedPeriode} open={openDialogDelete} setOpen={setOpenDialogDelete} />
        </Tabs>
    );
}
