import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
      <style jsx>{`
        :global(.markdown-content) {
          color: inherit;
        }
        :global(.markdown-content p) {
          margin-bottom: 0.5em;
        }
        :global(.markdown-content ul) {
          margin-top: 0.5em;
        }
      `}</style>
    </div>
  );
}
