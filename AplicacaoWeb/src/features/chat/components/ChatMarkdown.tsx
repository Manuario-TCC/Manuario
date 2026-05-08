import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMarkdownProps {
    content: string;
    isTyping: boolean;
}

export default function ChatMarkdown({ content, isTyping }: ChatMarkdownProps) {
    const cursor = isTyping ? ' ▍' : '';

    return (
        <div className="prose prose-invert max-w-none prose-p:leading-relaxed custom-chat-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content + cursor}</ReactMarkdown>

            <style jsx global>{`
                .custom-chat-markdown p {
                    margin-bottom: 0.75rem;
                    color: #d4d4d8;
                }
                .custom-chat-markdown h1,
                .custom-chat-markdown h2,
                .custom-chat-markdown h3 {
                    color: #f4f4f5;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }
                .custom-chat-markdown ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .custom-chat-markdown ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .custom-chat-markdown li {
                    margin-bottom: 0.25rem;
                }

                .custom-chat-markdown pre {
                    background-color: #0f0d12;
                    border: 1px solid #2c2935;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    overflow-x: auto;
                }
            `}</style>
        </div>
    );
}
