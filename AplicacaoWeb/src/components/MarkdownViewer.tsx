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

                .tiptap-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #f4f4f5;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                .tiptap-content img {
                    display: block;
                    margin: 1.5rem auto;
                    max-width: 100%;
                    border-radius: 0.5rem;
                }

                .tiptap-content p {
                    margin-bottom: 0.75rem;
                    color: #a1a1aa;
                }

                .tiptap-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #a1a1aa;
                }

                .tiptap-content ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #a1a1aa;
                }

                .tiptap-content li {
                    margin-bottom: 0.25rem;
                }

                .tiptap-content li p {
                    margin-bottom: 0;
                    display: inline;
                }
            `}</style>
        </div>
    );
}
