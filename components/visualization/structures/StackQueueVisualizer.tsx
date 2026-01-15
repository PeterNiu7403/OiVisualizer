'use client';

import React from 'react';

interface StackQueueVisualizerProps {
  data: any[];
  type: 'stack' | 'queue';
}

export function StackQueueVisualizer({ data, type }: StackQueueVisualizerProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{type === 'stack' ? '栈' : '队列'}为空</p>
      </div>
    );
  }

  const isStack = type === 'stack';

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">
          {isStack ? '栈 (Stack)' : '队列 (Queue)'}
        </h3>

        <div
          className={`flex ${isStack ? 'flex-col-reverse' : 'flex-row'} gap-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-200`}
        >
          {data.map((item, index) => (
            <div
              key={index}
              id={`${type}-${index}`}
              className="w-20 h-20 rounded-lg bg-green-500 border-4 border-green-700 flex items-center justify-center text-white font-bold text-xl hover:bg-green-400 cursor-pointer transition-colors"
            >
              {item.value}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {isStack ? '底部 ↑ 顶部' : '前端 ← 后端'}
        </div>
      </div>
    </div>
  );
}
