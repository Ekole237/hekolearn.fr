'use client';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import YouTube from 'react-youtube';
import { MermaidDiagram } from './mermaid-diagram';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const components = {
  YouTube: ({ id }: { id: string }) => (
    <div className="aspect-video w-full">
      <YouTube
        videoId={id}
        opts={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  ),
  pre: (props: any) => {
    const matches = (props.children?.props?.className || '').match(/language-(\w+)/);
    const language = matches?.[1];

    if (language === 'mermaid') {
      return <MermaidDiagram chart={props.children?.props?.children || ''} />;
    }

    return <pre {...props} />;
  },
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    const processMdx = async () => {
      try {
        // Remplacer les liens YouTube par des composants
        const processedContent = content.replace(
          /@\[youtube\]\(([^)]+)\)/g,
          (_, id) => `<YouTube id="${id}" />`
        );

        const processed = await serialize(processedContent || '', {
          mdxOptions: {
            remarkPlugins: [
              [remarkMath],
              [remarkGfm],
            ],
            rehypePlugins: [
              [rehypeKatex],
              [rehypePrism],
            ],
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
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
