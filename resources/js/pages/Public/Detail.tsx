import AppLayout from '@/layouts/public-app-layout';
import { Auth, Berita } from '@/types';
import { Head } from '@inertiajs/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { ParagraphNode, TextNode, createEditor } from 'lexical';
import './style.css';

import { ImageNode } from '@/components/lexical/CustomNodes/ImageNode';
import { cn } from '@/lib/utils';

const THEME = {
    code: 'editor-code',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
    },
    image: 'editor-image',
    link: 'editor-link',
    list: {
        listitem: 'editor-listitem',
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
    },
    paragraph: 'editor-paragraph',
    placeholder: 'editor-placeholder',
    quote: 'editor-quote',
    text: {
        bold: 'editor-text-bolddd',
        code: 'editor-text-code',
        hashtag: 'editor-text-hashtag',
        italic: 'editor-text-italic',
        overflowed: 'editor-text-overflowed',
        strikethrough: 'editor-text-strikethrough',
        underline: 'editor-text-underline',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
    },
};

export default function Dashboard({ auth, berita }: { auth: Auth; berita: Berita }) {
    const renderContent = () => {
        try {
            const editor = createEditor({
                namespace: 'MyEditor',
                nodes: [TextNode, ParagraphNode, ImageNode],
                theme: THEME,
                onError(error: any) {
                    console.error(error);
                },
            });

            const parsedState = editor.parseEditorState(berita.konten);

            let html = '';
            editor.setEditorState(parsedState);

            editor.update(() => {
                html = $generateHtmlFromNodes(editor, null);
            });

            return (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 flex flex-col gap-2">
                        <p className="text-4xl text-muted-foreground">{berita.judul}</p>
                        {berita.created_at !== berita.updated_at ? (
                            <span className="text-sm text-muted-foreground">
                                {'Diperbarui pada ' +
                                    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(
                                        new Date(berita.updated_at),
                                    ) +
                                    ', Oleh Admin'}
                            </span>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                {'Dibuat pada ' +
                                    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(
                                        new Date(berita.created_at),
                                    ) +
                                    ', Oleh Admin'}
                            </span>
                        )}
                    </div>

                    <div className="col-span-12">
                        <div className="flex max-h-[400px] w-full items-center justify-center overflow-hidden">
                            <img
                                src={berita.thumbnail ? '/storage/thumbnail/' + berita.thumbnail : '/assets/images/placeholder.png'}
                                className={cn('object-none', berita.thumbnail ? '' : 'scale-110')}
                            />
                        </div>
                    </div>
                    <div className="col-span-12" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            );
        } catch (err) {
            console.error('Failed to render content:', err);
            return <div className="text-accent-foreground">Konten tidak dapat ditampilkan</div>;
        }
    };
    return (
        <>
            <Head title="Dashboard" />
            <AppLayout>
                {/* Berita */}
                <div className="container mx-auto mb-4 flex flex-col items-center gap-16">
                    <div className='bg-background p-4 rounder shadow-xs'>{renderContent()}</div>
                </div>
            </AppLayout>
        </>
    );
}
