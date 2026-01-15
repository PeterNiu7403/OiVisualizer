'use client';

import React from 'react';
import { useDataStructureStore } from '@/stores';
import { ArrayVisualizer } from './structures/ArrayVisualizer';
import { LinkedListVisualizer } from './structures/LinkedListVisualizer';
import { StackQueueVisualizer } from './structures/StackQueueVisualizer';
import { HashTableVisualizer } from './structures/HashTableVisualizer';
import { TreeVisualizer } from './structures/TreeVisualizer';
import { GraphVisualizer } from './structures/GraphVisualizer';

/**
 * 数据结构渲染器
 * 根据当前数据结构类型选择对应的可视化组件
 */
export function DataStructureRenderer() {
  const { currentStructure } = useDataStructureStore();

  const renderVisualizer = () => {
    switch (currentStructure.type) {
      case 'array':
        return <ArrayVisualizer data={currentStructure.data} />;

      case 'linkedlist':
        return <LinkedListVisualizer data={currentStructure.data} />;

      case 'stack':
      case 'queue':
        return (
          <StackQueueVisualizer
            data={currentStructure.data}
            type={currentStructure.type}
          />
        );

      case 'hashtable':
        return <HashTableVisualizer data={currentStructure.data} />;

      case 'tree':
        return <TreeVisualizer data={currentStructure.data} />;

      case 'graph':
        return <GraphVisualizer data={currentStructure.data} />;

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              请选择一个数据结构开始可视化
            </p>
          </div>
        );
    }
  };

  return <div className="w-full h-full">{renderVisualizer()}</div>;
}
