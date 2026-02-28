'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { HTMLAttributes, ClassAttributes } from 'react';
import type { ExtraProps } from 'react-markdown';

type CodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps;

export default function ArticleContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        pre: ({ children }) => (
          <pre
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '1.125rem 1.25rem',
              overflowX: 'auto',
              margin: '1.25rem 0',
            }}
          >
            {children}
          </pre>
        ),
        code: ({ children, className, ...props }: CodeProps) => {
          const isBlock = typeof className === 'string' && className.startsWith('language-');
          if (isBlock) {
            return (
              <code
                style={{
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '0.8125rem',
                  lineHeight: '1.7',
                }}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              style={{
                backgroundColor: '#eff6ff',
                color: '#1a2f5e',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '0.85em',
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
