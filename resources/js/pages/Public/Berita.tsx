import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/public-app-layout';
import beritadetail from '@/routes/beritadetail';
import { Auth, Berita } from '@/types';
import getFirstTextFromLexicalJSON from '@/utils/first_text_lexical';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Dashboard({ auth, berita }: { auth: Auth; berita: Berita[] }) {
    return (
        <>
            <Head title="Dashboard" />
            <AppLayout>
                {/* Berita */}
                <div className="container mx-auto mb-4 flex flex-col items-center gap-16">
                    <div className="text-center">
                        <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
                            Berita Prestasi
                        </h2>
                        <p className="mb-1 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                            Temukan informasi mengenai prestasi dalam berita berita terbaru ini.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {berita.map((_data) => (
                            <Card key={_data.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0 shadow-xs">
                                <div className="aspect-16/9 w-full">
                                    <Link href={beritadetail.public(_data.id).url} className="transition-opacity duration-200 fade-in hover:opacity-70">
                                        <img
                                            src={_data.thumbnail ? 'storage/thumbnail/' + _data.thumbnail : '/assets/images/placeholder.png'}
                                            alt={_data.judul}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </Link>
                                </div>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold hover:underline md:text-xl">
                                        <Link href={beritadetail.public(_data.id).url}>{_data.judul}</Link>
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const firstText = getFirstTextFromLexicalJSON(JSON.parse(_data.konten));
                                        if (!firstText) return null;

                                        const isTruncated = firstText.length > 100;
                                        return (
                                            <p className="text-muted-foreground">
                                                {firstText.slice(0, 100)}
                                                {isTruncated && '...'}
                                            </p>
                                        );
                                    })()}
                                </CardContent>

                                <CardFooter>
                                    <Link href={beritadetail.public(_data.id).url} className="flex items-center text-foreground hover:underline">
                                        Selengkapnya
                                        <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
