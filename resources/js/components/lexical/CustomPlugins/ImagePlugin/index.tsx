import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
    $createParagraphNode,
    $createRangeSelection,
    $getSelection,
    $insertNodes,
    $isNodeSelection,
    $isRootOrShadowRoot,
    $setSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGOVER_COMMAND,
    DRAGSTART_COMMAND,
    DROP_COMMAND,
} from 'lexical';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { $createImageNode, $isImageNode, ImageNode } from '@/components/lexical/CustomNodes/ImageNode';
import { UploadIcon } from 'lucide-react';

export const INSERT_IMAGE_COMMAND = createCommand<{
    src: string;
    altText?: string;
}>('INSERT_IMAGE_COMMAND');

export default function ImagesPlugin({ children }: { children: React.ReactNode }) {
    const [editor] = useLexicalComposerContext();

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'url' | 'upload' | null>(null);
    const [src, setSrc] = useState('');
    const [altText, setAltText] = useState('');

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    const { src: url, altText: alt } = payload;
                    const imageNode = $createImageNode({ src: url, altText: alt || '' });
                    $insertNodes([imageNode]);
                    const parent = imageNode.getParentOrThrow();
                    if ($isRootOrShadowRoot(parent)) {
                        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                    }
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    const node = $getImageNodeInSelection();
                    if (!node) {
                        return false;
                    }
                    const dataTransfer = event.dataTransfer as DataTransfer;
                    if (!dataTransfer) {
                        return false;
                    }
                    dataTransfer.setData(
                        'application/x-lexical-drag',
                        JSON.stringify({
                            type: 'image',
                            data: {
                                src: node.__src,
                                altText: node.__altText,
                                key: node.getKey(),
                                width: node.__width,
                                height: node.__height,
                                showCaption: node.__showCaption,
                            },
                        }),
                    );
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),
            editor.registerCommand(
                DRAGOVER_COMMAND,
                (event) => {
                    return true; // biarkan drop
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                DROP_COMMAND,
                (event) => {
                    const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
                    if (!dragData) {
                        return false;
                    }
                    const { type, data } = JSON.parse(dragData);
                    if (type !== 'image') {
                        return false;
                    }
                    event.preventDefault();
                    const rangeSel = event.target && document.caretRangeFromPoint ? document.caretRangeFromPoint(event.clientX, event.clientY) : null;
                    let rangeSelection = $createRangeSelection();
                    if (rangeSel) {
                        rangeSelection.applyDOMRange(rangeSel);
                        $setSelection(rangeSelection);
                    }
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src: data.src,
                        altText: data.altText,
                    });
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),
        );
    }, [editor]);

    const onConfirm = () => {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
        setOpen(false);
        // reset
        setMode(null);
        setSrc('');
        setAltText('');
    };

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSrc(reader.result);
                }
            };
            reader.readAsDataURL(file);
            
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSrc(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Gambar</DialogTitle>
                    </DialogHeader>

                    <div className="flex w-full items-center gap-2 px-0" onDrop={handleDrop} onDragOver={handleDragOver}>
                        <input
                            ref={inputRef}
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onUploadChange}
                        />

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
                                        <span className="text-xs text-muted-foreground">hanya format gambar</span>
                                    </>
                                )}
                            </div>
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button disabled={!src} onClick={onConfirm}>
                            Sisipkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Helper untuk seleksi image node
function $getImageNodeInSelection() {
    const sel = $getSelection();
    if (!$isNodeSelection(sel)) {
        return null;
    }
    const nodes = sel.getNodes();
    const node = nodes[0];
    return $isImageNode(node) ? node : null;
}
