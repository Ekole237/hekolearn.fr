'use client';

import { useEffect, useRef } from 'react';
import Mermaid from 'react-mermaid2';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  return (
    <div className="my-4 overflow-x-auto">
      <Mermaid
        chart={chart}
        config={{
          theme: 'default',
          securityLevel: 'loose',
          startOnLoad: true,
        }}
      />
    </div>
  );
}
