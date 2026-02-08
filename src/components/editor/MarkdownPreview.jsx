import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const MarkdownPreview = React.memo(({ content }) => {
  if (!content) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>미리보기가 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none p-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 border-b-2 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5 border-b pb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-disc" {...props} />,
          ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
