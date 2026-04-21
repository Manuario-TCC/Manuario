'use client';

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BaseImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Markdown } from 'tiptap-markdown';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    ImagePlus,
    FileCode2,
    Trash2,
    Link as LinkIcon,
    Unlink,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import Swal from 'sweetalert2';

interface TextEditorProps {
    markdown: string;
    onChange: (val: string) => void;
    onImageAdded: (file: File, tempUrl: string) => void;
}

// Componente de imgagens
const ImageNode = (props: any) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleResize = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.pageX;
        const startWidth = containerRef.current?.offsetWidth || 0;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.pageX - startX;
            const newWidth = Math.max(100, startWidth + diff * 2);
            props.updateAttributes({ width: `${newWidth}px` });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const alignClass =
        props.node.attrs.align === 'left'
            ? 'justify-start'
            : props.node.attrs.align === 'right'
              ? 'justify-end'
              : 'justify-center';

    return (
        <NodeViewWrapper className={`relative flex w-full ${alignClass} group my-8`}>
            <div
                ref={containerRef}
                className="relative inline-block"
                style={{ width: props.node.attrs.width }}
            >
                <img
                    src={props.node.attrs.src}
                    alt="Conteúdo"
                    className={`rounded-xl w-full h-auto block transition-all ${
                        props.selected ? 'outline outline-3 outline-primary outline-offset-4' : ''
                    }`}
                />

                {props.selected && (
                    <div
                        onMouseDown={handleResize}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary border-[3px] border-background rounded-full cursor-ew-resize shadow-lg z-50 hidden sm:block hover:scale-125 transition-transform"
                        title="Arraste para redimensionar"
                    />
                )}

                {props.selected && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card border border-card-border p-1.5 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 w-max">
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ width: '30%' })}
                            className="px-2 py-1 text-xs font-bold text-sub-text hover:text-white hover:bg-card-border rounded-lg cursor-pointer"
                        >
                            P
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ width: '60%' })}
                            className="px-2 py-1 text-xs font-bold text-sub-text hover:text-white hover:bg-card-border rounded-lg cursor-pointer"
                        >
                            M
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ width: '100%' })}
                            className="px-2 py-1 text-xs font-bold text-sub-text hover:text-white hover:bg-card-border rounded-lg cursor-pointer"
                        >
                            G
                        </button>

                        <div className="w-px h-5 bg-card-border mx-1" />

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ align: 'left' })}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${props.node.attrs.align === 'left' ? 'text-white bg-primary' : 'text-sub-text hover:text-white hover:bg-card-border'}`}
                        >
                            <AlignLeft size={14} />
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ align: 'center' })}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${props.node.attrs.align === 'center' ? 'text-white bg-primary' : 'text-sub-text hover:text-white hover:bg-card-border'}`}
                        >
                            <AlignCenter size={14} />
                        </button>

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => props.updateAttributes({ align: 'right' })}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${props.node.attrs.align === 'right' ? 'text-white bg-primary' : 'text-sub-text hover:text-white hover:bg-card-border'}`}
                        >
                            <AlignRight size={14} />
                        </button>

                        <div className="w-px h-5 bg-card-border mx-1" />

                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={props.deleteNode}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                            <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};

const CustomImage = BaseImage.extend({
    inline: false,
    group: 'block',
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                parseHTML: (element) =>
                    element.getAttribute('width') || element.style.width || '100%',
                renderHTML: (attrs) => ({ width: attrs.width, style: `width: ${attrs.width}` }),
            },
            align: {
                default: 'center',
                parseHTML: (element) => element.getAttribute('data-align') || 'center',
                renderHTML: (attrs) => ({ 'data-align': attrs.align }),
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ImageNode);
    },
});

// Componente do editor principal
function TextEditor({ markdown, onChange, onImageAdded }: TextEditorProps) {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const extensions = useMemo(
        () => [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: { class: 'text-2xl font-bold mt-6 mb-4 text-white' },
                },
                bulletList: { HTMLAttributes: { class: 'list-disc ml-6 space-y-1' } },
                orderedList: { HTMLAttributes: { class: 'list-decimal ml-6 space-y-1' } },
            }),
            Underline,
            CustomImage,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer hover:text-primary-hover transition-colors',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Markdown.configure({
                html: true,
                transformPastedText: true,
            }),
        ],
        [],
    );

    const handleImageFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) return null;
            const tempUrl = URL.createObjectURL(file);
            onImageAdded(file, tempUrl);
            return tempUrl;
        },
        [onImageAdded],
    );

    const editor = useEditor({
        immediatelyRender: false,
        extensions: extensions,
        content: typeof markdown === 'string' ? markdown.replace(/\\n/g, '\n') : '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none p-6 min-h-[350px] outline-none text-text',
            },
            handleDrop: (view, event, slice, moved) => {
                if (
                    !moved &&
                    event.dataTransfer &&
                    event.dataTransfer.files &&
                    event.dataTransfer.files[0]
                ) {
                    event.preventDefault();
                    const file = event.dataTransfer.files[0];
                    const tempUrl = handleImageFile(file);

                    if (tempUrl) {
                        const { schema } = view.state;
                        const coordinates = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });

                        const node = schema.nodes.image.create({ src: tempUrl });
                        const transaction = view.state.tr.insert(coordinates?.pos || 0, node);

                        view.dispatch(transaction);
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event, slice) => {
                if (
                    event.clipboardData &&
                    event.clipboardData.files &&
                    event.clipboardData.files[0]
                ) {
                    event.preventDefault();
                    const file = event.clipboardData.files[0];
                    const tempUrl = handleImageFile(file);

                    if (tempUrl) {
                        const { schema } = view.state;
                        const node = schema.nodes.image.create({ src: tempUrl });
                        const transaction = view.state.tr.replaceSelectionWith(node);

                        view.dispatch(transaction);
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            const htmlContent = editor.getHTML();
            let mdContent = (editor.storage as any).markdown.getMarkdown();

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const images = tempDiv.querySelectorAll('img');

            images.forEach((img) => {
                const src = img.getAttribute('src') || '';
                const width = img.getAttribute('width') || img.style.width || '100%';
                const align = img.getAttribute('data-align') || 'center';

                const mdImageRegex = new RegExp(
                    `!\\[.*?\\]\\(${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
                );

                const htmlTag = `\n\n<img src="${src}" width="${width}" data-align="${align}" />\n\n`;

                mdContent = mdContent.replace(mdImageRegex, htmlTag);
            });

            mdContent = mdContent.replace(/\n{3,}/g, '\n\n').trim();

            onChange(mdContent);
        },
    });

    const setLink = useCallback(async () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const { value: url, isConfirmed } = await Swal.fire({
            title: previousUrl ? 'Editar Link' : 'Inserir Link',
            input: 'text',
            inputPlaceholder: 'https://exemplo.com',
            inputValue: previousUrl || '',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            background: '#151718',
            color: '#ffffff',
            customClass: {
                popup: 'border border-card-border rounded-xl shadow-2xl',
                input: 'bg-background text-white border border-card-border focus:ring-primary focus:border-primary rounded-lg !mx-6',
                confirmButton:
                    'bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer',
                cancelButton:
                    'bg-card-border text-sub-text font-bold py-2 px-6 rounded-lg hover:text-text transition-colors cursor-pointer',
                actions: 'gap-3 mt-4',
            },
            buttonsStyling: false,
        });

        if (isConfirmed && url) {
            let finalUrl = url.trim();
            if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:')) {
                finalUrl = 'https://' + finalUrl;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
        } else if (isConfirmed) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
    }, [editor]);

    useEffect(() => {
        if (!editor || isSourceMode || markdown === undefined) return;

        let safeMarkdown = typeof markdown === 'string' ? markdown.replace(/\\n/g, '\n') : '';

        // Remove as barras que o Tiptap
        safeMarkdown = safeMarkdown.replace(/\\#/g, '#');

        // Garante a tag de imagem tenha uma linha em branco
        safeMarkdown = safeMarkdown.replace(/(<img[^>]+>)/gi, '\n\n$1\n\n');

        // Limpa quebras de linha
        safeMarkdown = safeMarkdown.replace(/\n{3,}/g, '\n\n');

        const currentMarkdown = (editor.storage as any).markdown?.getMarkdown() || '';

        if (safeMarkdown !== currentMarkdown && !editor.isFocused) {
            queueMicrotask(() => {
                editor.commands.setContent(safeMarkdown);
            });
        }
    }, [markdown, editor, isSourceMode]);

    if (!editor) return null;

    return (
        <div className="flex flex-col w-full bg-background border border-card-border rounded-xl overflow-hidden">
            <div className="flex items-center flex-wrap gap-1 bg-card p-2 border-b border-card-border">
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-sub-text hover:bg-card-border hover:text-text'}`}
                >
                    <span className="font-serif font-black text-lg leading-none">tT</span>
                </button>

                <div className="w-px h-6 bg-card-border mx-2" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('bold') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <Bold size={18} />
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('italic') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <Italic size={18} />
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('underline') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <UnderlineIcon size={18} />
                </button>

                <div className="w-px h-6 bg-card-border mx-2" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <AlignLeft size={18} />
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <AlignCenter size={18} />
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <AlignRight size={18} />
                </button>

                <div className="w-px h-6 bg-card-border mx-2" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        if (editor.isActive('heading')) {
                            editor
                                .chain()
                                .focus()
                                .insertContent('<p></p>')
                                .toggleBulletList()
                                .run();
                        } else {
                            editor.chain().focus().toggleBulletList().run();
                        }
                    }}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <List size={18} />
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        if (editor.isActive('heading')) {
                            editor
                                .chain()
                                .focus()
                                .insertContent('<p></p>')
                                .toggleOrderedList()
                                .run();
                        } else {
                            editor.chain().focus().toggleOrderedList().run();
                        }
                    }}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    <ListOrdered size={18} />
                </button>

                <div className="w-px h-6 bg-card-border mx-2" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={setLink}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${editor.isActive('link') ? 'bg-primary text-white' : 'text-sub-text hover:bg-card-border'}`}
                >
                    {editor.isActive('link') ? <Unlink size={18} /> : <LinkIcon size={18} />}
                </button>

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg text-sub-text hover:bg-card-border hover:text-text transition-colors cursor-pointer"
                >
                    <ImagePlus size={18} />
                </button>

                <div className="flex-1" />

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setIsSourceMode(!isSourceMode)}
                    className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSourceMode
                            ? 'bg-primary text-white'
                            : 'bg-background border border-card-border text-sub-text hover:text-text'
                    }`}
                >
                    <FileCode2 size={14} />
                    {isSourceMode ? 'Editor' : 'Markdown'}
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const url = handleImageFile(file);
                            if (url) editor.chain().focus().setImage({ src: url }).run();
                        }
                    }}
                />
            </div>

            <div className="relative flex-1">
                {isSourceMode ? (
                    <textarea
                        value={markdown}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full min-h-[350px] p-8 bg-background text-white font-mono text-sm leading-relaxed resize-none focus:outline-none"
                        placeholder="Escreva Markdown..."
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>
        </div>
    );
}

export default memo(TextEditor);
