'use client';

import { useEffect, useRef } from 'react';

interface FunctionGraphProps {
  expression: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  width?: number;
  height?: number;
}

declare global {
  interface Window {
    Desmos?: any;
  }
}

export function FunctionGraph({
  expression,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  width = 600,
  height = 400,
}: FunctionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);

  useEffect(() => {
    // Charger Desmos depuis CDN si pas déjà chargé
    if (!window.Desmos) {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = initializeCalculator;
      document.body.appendChild(script);
    } else {
      initializeCalculator();
    }

    function initializeCalculator() {
      if (containerRef.current && window.Desmos) {
        calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
          expressions: false,
          settingsMenu: false,
          zoomButtons: false,
          lockViewport: true,
          bounds: {
            left: xMin,
            right: xMax,
            bottom: yMin,
            top: yMax,
          },
        });
        calculatorRef.current.setExpression({ id: 'graph1', latex: expression });
      }
    }

    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
      }
    };
  }, [expression, xMin, xMax, yMin, yMax]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: `${width}px`, height: `${height}px` }}
      className="my-4 mx-auto"
    />
  );
}
