'use client';

import React from 'react';

interface LinkedListVisualizerProps {
  data: any[];
}

export function LinkedListVisualizer({ data }: LinkedListVisualizerProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">链表为空</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 p-8">
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            {/* 节点圆圈 */}
            <div
              id={`linkedlist-${index}`}
              className="w-16 h-16 rounded-full bg-blue-500 border-4 border-blue-700 flex items-center justify-center text-white font-bold text-xl hover:bg-blue-400 cursor-pointer transition-colors"
            >
              {item.value}
            </div>
            {/* 索引标签 */}
            <span className="text-xs text-muted-foreground mt-2">{index}</span>
          </div>

          {/* 箭头 */}
          {index < data.length - 1 && (
            <div className="flex items-center">
              <svg width="40" height="20" className="text-gray-400">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill="currentColor"
                    />
                  </marker>
                </defs>
                <line
                  x1="0"
                  y1="10"
                  x2="35"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
