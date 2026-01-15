'use client';

import React, { useRef, useEffect } from 'react';
import { useUIStore } from '@/stores';
import { Card } from '@/components/ui/card';

interface VisualizationCanvasProps {
  children: React.ReactNode;
}

/**
 * 可视化画布组件
 * 提供统一的渲染容器和视图控制
 */
export function VisualizationCanvas({ children }: VisualizationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { viewState, setViewState } = useUIStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(viewState.scale * delta, 0.3), 3);

      setViewState({
        ...viewState,
        scale: newScale,
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [viewState, setViewState]);

  return (
    <Card className="relative flex-1 overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute inset-0 flex items-center justify-center bg-background"
        style={{
          cursor: 'grab',
        }}
      >
        <div
          className="origin-center transition-transform"
          style={{
            transform: `scale(${viewState.scale})`,
          }}
        >
          {children}
        </div>
      </div>

      {/* 视图控制提示 */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground">
        <div>缩放: {Math.round(viewState.scale * 100)}%</div>
        <div className="text-[10px] mt-1">
          滚轮缩放 • 拖拽平移
        </div>
      </div>
    </Card>
  );
}
