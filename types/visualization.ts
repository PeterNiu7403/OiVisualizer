/**
 * 可视化渲染相关类型定义
 */

// 渲染器类型
export type RendererType = 'svg' | 'canvas';

// 可视化节点
export interface VisualNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: any;
  label?: string;
  style?: VisualStyle;
}

// 可视化边
export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  style?: VisualStyle;
  label?: string;
  weight?: number;
}

// 可视化样式
export interface VisualStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
}

// 可视化操作（用于反向绑定）
export interface VisualOperation {
  type: 'update-value' | 'drag-node' | 'add-element' | 'remove-element';
  targetId: string;
  oldValue?: any;
  newValue: any;
  position?: { x: number; y: number };
}

// 视图状态
export interface ViewState {
  scale: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

// 布局配置
export interface LayoutConfig {
  type: 'force' | 'tree' | 'grid' | 'circular';
  nodeSize: number;
  spacing: number;
  [key: string]: any;
}

// 状态差异（用于动画）
export interface StateTransition {
  type: 'INSERT' | 'DELETE' | 'UPDATE' | 'MOVE' | 'RESTRUCTURE';
  elementId: string;
  from?: any;
  to?: any;
}
