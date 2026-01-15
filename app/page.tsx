'use client';

import React from 'react';
import { useUIStore } from '@/stores';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { VisualizationCanvas, DataStructureRenderer } from '@/components/visualization';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const dataStructures = [
  { value: 'array', label: '数组' },
  { value: 'linkedlist', label: '链表' },
  { value: 'stack', label: '栈' },
  { value: 'queue', label: '队列' },
  { value: 'hashtable', label: '哈希表' },
  { value: 'tree', label: '树' },
  { value: 'graph', label: '图' },
];

export default function Home() {
  const { theme, toggleTheme, selectedStructure, setSelectedStructure, layoutMode } =
    useUIStore();

  return (
    <main className="flex flex-col h-screen bg-background text-foreground">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">OI Visualizer</h1>
          <span className="text-sm text-muted-foreground">
            信息学奥赛数据结构可视化教学平台
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* 数据结构选择 */}
          <Select
            value={selectedStructure}
            onValueChange={(value) => setSelectedStructure(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择数据结构" />
            </SelectTrigger>
            <SelectContent>
              {dataStructures.map((ds) => (
                <SelectItem key={ds.value} value={ds.value}>
                  {ds.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 主题切换 */}
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className={`flex flex-1 overflow-hidden ${layoutMode === 'split-horizontal' ? 'flex-row' : 'flex-col'}`}>
        {/* 左侧：代码编辑器 */}
        <div className="w-1/2 min-w-[400px] border-r">
          <div className="h-full p-4">
            <MonacoEditor />
          </div>
        </div>

        {/* 右侧：可视化画布 */}
        <div className="w-1/2 min-w-[400px]">
          <div className="h-full p-4">
            <VisualizationCanvas>
              <DataStructureRenderer />
            </VisualizationCanvas>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <footer className="flex items-center justify-between px-6 py-2 border-t bg-card text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            当前数据结构: {dataStructures.find((ds) => ds.value === selectedStructure)?.label}
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            布局模式: {layoutMode === 'split-horizontal' ? '水平分屏' : '垂直分屏'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            FPS: 60
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            状态: 就绪
          </span>
        </div>
      </footer>
    </main>
  );
}
