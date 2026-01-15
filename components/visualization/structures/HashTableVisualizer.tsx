'use client';

import React from 'react';

interface HashTableVisualizerProps {
  data: Map<any, any> | Record<string, any>;
}

export function HashTableVisualizer({ data }: HashTableVisualizerProps) {
  const entries = React.useMemo(() => {
    if (data instanceof Map) {
      return Array.from(data.entries());
    }
    return Object.entries(data);
  }, [data]);

  if (!entries || entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">哈希表为空</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h3 className="text-lg font-semibold mb-4">哈希表 (Hash Table)</h3>

      <div className="grid grid-cols-4 gap-4">
        {entries.map(([key, value], index) => (
          <div
            key={index}
            id={`hashtable-${index}`}
            className="bg-white border-2 border-purple-500 rounded-lg p-4 hover:bg-purple-50 cursor-pointer transition-colors"
          >
            <div className="text-sm text-muted-foreground mb-1">键 (Key)</div>
            <div className="font-mono text-lg font-bold mb-2">
              {String(key)}
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="text-sm text-muted-foreground mb-1">
                值 (Value)
              </div>
              <div className="font-mono text-lg">{String(value)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {entries.length} 个条目
      </div>
    </div>
  );
}
