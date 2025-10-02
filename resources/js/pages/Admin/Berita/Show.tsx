import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Auth } from '@/types';
import { Form, useForm, usePage } from '@inertiajs/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ParagraphNode, TextNode, createEditor } from 'lexical';
import './style.css';

import BeritaController from '@/actions/App/Http/Controllers/Admin/BeritaController';
import EditableTitle from '@/components/editable-title';
import { FlashAlert } from '@/components/flash-alert';
import InputError from '@/components/input-error';
import { ImageNode } from '@/components/lexical/CustomNodes/ImageNode';
import ToolbarPlugin from '@/components/lexical/CustomPlugins/ToolbarPlugin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import users from '@/routes/admin/users';
import { LoaderCircle, UploadIcon, Wallpaper } from 'lucide-react';
import React from 'react';

interface Berita {
    id: number;
    judul: string;
    thumbnail: string;
    konten: string; // serialized Lexical editor state (JSON string)
    created_at: Date;
    updated_at: Date;
}

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

export default function Show({ auth, berita }: { auth: Auth; berita: Berita }) {
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };
    const { errors } = usePage().props;

    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [show, setShow] = React.useState(false);
    const [hasShownFlash, setHasShownFlash] = React.useState(false);

    React.useEffect(() => {
        if (!hasShownFlash && flash) {
            if (flash.success) {
                setMessage({ type: 'success', text: flash.success });
                setShow(true);
                setHasShownFlash(true);
            } else if (flash.error) {
                setMessage({ type: 'error', text: flash.error });
                setShow(true);
                setHasShownFlash(true);
            }
        }
    }, [flash, hasShownFlash]);

    const [title, setTitle] = React.useState(berita.judul);

    const [isEditing, setIsEditing] = React.useState(false);
    const { data, setData, patch, processing } = useForm({
        konten: berita.konten,
    });

    const editorConfig = {
        namespace: 'MyEditor',
        theme: THEME,
        nodes: [TextNode, ParagraphNode, ImageNode],
        onError(error: any) {
            console.error(error);
        },
        editorState: berita.konten, // JSON string (Lexical state)
    };

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
                        <p className="text-4xl text-muted-foreground">{title}</p>
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

    // image
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setOpen(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setOpen(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Berita', href: users.index.url() }]}>
            {show && message && (
                <FlashAlert message={message.text} variant={message.type === 'success' ? 'default' : 'destructive'} duration={3000} />
            )}

            <Tabs defaultValue="outline" className="flex w-full flex-col justify-start gap-6">
                <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
                    <Label htmlFor="view-selector" className="sr-only">
                        View
                    </Label>
                    <div className="relative flex w-full max-w-sm flex-col gap-2">
                        {isEditing ? (
                            <>
                                <EditableTitle onSave={(newTitle) => setTitle(newTitle)} initialTitle={berita.judul} />
                                <InputError message={errors.judul} className="mt-2" />
                            </>
                        ) : (
                            <h1 className="text-2xl font-bold">{berita.judul}</h1>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <div className="space-x-2">
                            <Form {...BeritaController.update.form(berita.id)} className="flex gap-2" disableWhileProcessing>
                                {({ processing, errors }) => (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <Button type="submit" disabled={processing}>
                                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                                    Batal
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsEditing(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        <input type="hidden" name="judul" value={title} />
                                        <input type="hidden" name="konten" value={data.konten} />
                                        <input
                                            ref={inputRef}
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={onUploadChange}
                                        />
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <div className="flex items-center justify-start gap-2 px-4 lg:px-6">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="w-full sm:w-auto">
                                    <Wallpaper className="h-4 w-4" /> Thumbnail
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Thumbnail</DialogTitle>
                                </DialogHeader>

                                <div className="flex w-full items-center gap-2 px-0" onDrop={handleDrop} onDragOver={handleDragOver}>
                                    <Button
                                        type="button"
                                        tabIndex={0}
                                        className="group min-h-20 w-full border-2 border-dashed bg-background text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:outline-none sm:min-h-30"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1 transition-transform duration-200 group-hover:scale-105">
                                            <UploadIcon className="h-6 w-6" />
                                            {selectedFile ? (
                                                <span className="line-clamp-2 px-2 text-center text-xs font-medium">{selectedFile.name}</span>
                                            ) : (
                                                <>
                                                    <span>Upload atau Drag file ke sini</span>
                                                    <span className="text-xs text-muted-foreground">hanya format gambar, tinggi gambar 400px untuk hasil optimal</span>
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <InputError message={errors.thumbnail} className="mt-2" />
                    </div>
                )}
                <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                    <div className="prose min-h-[200px] max-w-full rounded border p-4">
                        {isEditing ? (
                            <LexicalComposer initialConfig={editorConfig}>
                                <ToolbarPlugin />
                                <RichTextPlugin
                                    contentEditable={<ContentEditable className="editor-input" />}
                                    placeholder={<div className="text-muted-foreground">Tulis konten di sini…</div>}
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <HistoryPlugin />
                                <OnChangePlugin
                                    onChange={(editorState) => {
                                        editorState.read(() => {
                                            const json = JSON.stringify(editorState.toJSON());
                                            setData('konten', json);
                                        });
                                    }}
                                />
                            </LexicalComposer>
                        ) : (
                            renderContent()
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
