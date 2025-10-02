import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import berita from '@/routes/berita';
import { Berita } from '@/types';
import getFirstTextFromLexicalJSON from '@/utils/first_text_lexical';
import { Link } from '@inertiajs/react';
import beritadetail from '@/routes/beritadetail';

interface Post {
    id: string;
    title: string;
    summary: string;
    label: string;
    author: string;
    published: string;
    url: string;
    image: string;
}

interface BlogProps {
    tagline: string;
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    posts: Post[];
    data: Berita[];
}

const Blog = ({
    tagline = 'Berita Terbaru',
    heading = 'Berita Prestasi',
    description = 'Temukan informasi mengenai prestasi dalam berita berita terbaru ini.',
    buttonText = 'Lihat selengkapnya',
    buttonUrl = '/berita',
    data,
}: BlogProps) => {
    return (
        <section className="">
            <div className="container mx-auto flex flex-col items-center gap-16 ">
                <div className="text-center">
                    <Badge variant="secondary" className="mb-6">
                        {tagline}
                    </Badge>
                    <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">{heading}</h2>
                    <p className="mb-1 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">{description}</p>
                    <Button variant="link" className="w-full sm:w-auto" asChild>
                        <a href={buttonUrl}>
                            {buttonText}
                            <ArrowRight className="ml-2 size-4" />
                        </a>
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {data.map((_data) => (
                        <Card key={_data.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0 shadow-xs">
                            <div className="aspect-16/9 w-full">
                                <Link href={beritadetail.public(_data.id).url} className="transition-opacity duration-200 fade-in hover:opacity-70">
                                    <img
                                        src={(_data.thumbnail) ? 'storage/thumbnail/' + _data.thumbnail : "/assets/images/placeholder.png"}
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
        </section>
    );
};

export { Blog };
