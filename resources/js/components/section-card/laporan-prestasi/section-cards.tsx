import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SummaryLaporan } from '@/types';

export function SectionCards({ summary }: { summary: SummaryLaporan }) {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Laporan</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{summary.total_laporan}</CardTitle>

                    <div className="absolute top-4 right-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    {summary.delta_total > 0 ? '+' : ''}
                                    {summary.delta_total} Laporan
                                    <TrendingUpIcon className="size-3" />
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Dalam 30 hari terakhir</TooltipContent>
                        </Tooltip>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="text-muted-foreground">Semua Laporan</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Laporan Perlu Diverifikasi</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{summary.belum_diverifikasi}</CardTitle>
                    <div className="absolute top-4 right-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    {summary.delta_belum_diverifikasi} Laporan
                                    <TrendingDownIcon className="size-3" />
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Dalam 30 hari terakhir</TooltipContent>
                        </Tooltip>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="text-muted-foreground">Belum disetujui Validator</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Laporan Terverifikasi</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{summary.sudah_diverifikasi}</CardTitle>
                    <div className="absolute top-4 right-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    {summary.delta_sudah_diverifikasi > 0 ? '+' : ''}
                                    {summary.delta_sudah_diverifikasi} Laporan
                                    <TrendingUpIcon className="size-3" />
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Dalam 30 hari terakhir</TooltipContent>
                        </Tooltip>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="text-muted-foreground">Sudah disetujui Validator</div>
                </CardFooter>
            </Card>
        </div>
    );
}
