'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Image from '@tiptap/extension-image';

interface MarkdownViewerProps {
    content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Markdown,
            Image.configure({
                inline: false,
            }),
        ],
        content: content,
        editable: false,
        immediatelyRender: false,
    });

    return (
        <div className="tiptap-content">
            <EditorContent editor={editor} />

            <style jsx global>{`
                .tiptap-content .ProseMirror {
                    outline: none;
                }
                /* Estilo para o título ## */
                .tiptap-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #f4f4f5; /* zinc-100 */
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                /* Centralizar imagem */
                .tiptap-content img {
                    display: block;
                    margin: 1.5rem auto;
                    max-width: 100%;
                    border-radius: 0.5rem;
                }
                .tiptap-content p {
                    margin-bottom: 0.75rem;
                    color: #a1a1aa; /* zinc-400 */
                }
            `}</style>
        </div>
    );
}
