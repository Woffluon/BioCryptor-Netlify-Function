import React, { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

interface CodeProps extends Omit<ComponentProps<'code'>, 'ref'> {
  inline?: boolean;
  node?: any;
}

interface UlProps extends Omit<ComponentProps<'ul'>, 'ref'> {
  ordered?: boolean;
  node?: any;
}

interface OlProps extends Omit<ComponentProps<'ol'>, 'ref'> {
  ordered?: boolean;
  node?: any;
}

interface LiProps extends Omit<ComponentProps<'li'>, 'ref'> {
  ordered?: boolean;
  node?: any;
}

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node, ...props }: { node?: any } & ComponentProps<'a'>) => (
            <a 
              {...props} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-venice-coral hover:underline"
            />
          ),
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="my-2 rounded-md overflow-hidden">
                <div className="bg-gray-100 px-4 py-1 text-xs text-gray-600 font-mono">
                  {match ? match[1] : 'code'}
                </div>
                <pre className="bg-gray-50 p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          blockquote: ({ node, ...props }: { node?: any } & ComponentProps<'blockquote'>) => (
            <blockquote 
              className="border-l-4 border-venice-coral/50 pl-4 py-1 my-2 text-gray-600"
              {...props} 
            />
          ),
          ul: ({ node, ordered, ...props }: UlProps) => (
            <ul className="list-disc pl-6 my-2 space-y-1" {...props} />
          ),
          ol: ({ node, ordered, ...props }: OlProps) => (
            <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />
          ),
          li: ({ node, ordered, ...props }: LiProps) => (
            <li className="my-1" {...props} />
          ),
          h1: ({ node, ...props }: { node?: any } & ComponentProps<'h1'>) => (
            <h1 className="text-2xl font-bold my-4" {...props} />
          ),
          h2: ({ node, ...props }: { node?: any } & ComponentProps<'h2'>) => (
            <h2 className="text-xl font-bold my-3" {...props} />
          ),
          h3: ({ node, ...props }: { node?: any } & ComponentProps<'h3'>) => (
            <h3 className="text-lg font-bold my-2" {...props} />
          ),
          p: ({ node, ...props }: { node?: any } & ComponentProps<'p'>) => (
            <p className="my-3 leading-relaxed" {...props} />
          ),
          img: ({ node, ...props }: { node?: any } & ComponentProps<'img'>) => (
            <img className="my-4 rounded-lg max-w-full h-auto" {...props} alt="" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
