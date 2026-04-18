'use client';

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    imagePlugin,
    toolbarPlugin,
    linkPlugin,
    diffSourcePlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    ListsToggle,
    Separator,
    linkDialogPlugin,
    CreateLink,
    DiffSourceToggleWrapper,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface MDXEditorWrapperProps {
    markdown: string;
    onChange: (val: string) => void;
}

export default function MDXEditorWrapper({ markdown, onChange }: MDXEditorWrapperProps) {
    const imageUploadHandler = async (image: File) => {
        return URL.createObjectURL(image);
    };

    return (
        <div className="dark-editor">
            <MDXEditor
                markdown={markdown}
                onChange={onChange}
                contentEditableClassName="prose prose-invert max-w-none p-6 min-h-[300px] text-text focus:outline-none"
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin({ imageUploadHandler }),
                    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: markdown }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <div className="flex items-center flex-wrap gap-1 bg-card p-1 border-b border-card-border">
                                <DiffSourceToggleWrapper>
                                    <UndoRedo />
                                    <Separator />
                                    <BlockTypeSelect />
                                    <Separator />
                                    <BoldItalicUnderlineToggles />
                                    <ListsToggle />
                                    <Separator />
                                    <CreateLink />
                                </DiffSourceToggleWrapper>
                            </div>
                        ),
                    }),
                ]}
            />
        </div>
    );
}
