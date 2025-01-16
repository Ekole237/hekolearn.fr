'use client';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    const processMdx = async () => {
      try {
        const processed = await serialize(content || '', {
          mdxOptions: {
            remarkPlugins: [[remarkMath], [remarkGfm]],
            rehypePlugins: [[rehypeKatex], [rehypePrism]],
            format: 'mdx'
          },
        });
        setMdxSource(processed);
      } catch (error) {
        console.error('Error processing MDX:', error);
      }
    };

    processMdx();
  }, [content]);

  if (!mdxSource) {
    return <div className={className}>Chargement...</div>;
  }

  return (
    <div className={className}>
      <MDXRemote {...mdxSource} />
    </div>
  );
}
