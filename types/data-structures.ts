/**
 * 数据结构类型定义
 */

// 支持的数据结构类型
export type DataStructureType =
  | 'array'
  | 'linkedlist'
  | 'stack'
  | 'queue'
  | 'hashtable'
  | 'tree'
  | 'graph';

// 链表类型
export type LinkedListType = 'singly' | 'doubly' | 'circular';

// 树类型
export type TreeType = 'bst' | 'avl' | 'heap';

// 图类型
export type GraphType = 'directed' | 'undirected';

// 图边
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

// 图节点
export interface GraphNode {
  id: string;
  value: any;
  x?: number;
  y?: number;
}

// 树节点
export interface TreeNode {
  id: string;
  value: any;
  left?: TreeNode;
  right?: TreeNode;
  height?: number; // 用于 AVL 树
}

// 数组元素
export interface ArrayElement {
  index: number;
  value: any;
  highlighted?: boolean;
}

// 链表节点
export interface LinkedListNode {
  id: string;
  value: any;
  next?: LinkedListNode;
  prev?: LinkedListNode;
}

// 栈/队列元素
export interface StackQueueElement {
  id: string;
  value: any;
}

// 哈希表条目
export interface HashEntry {
  key: any;
  value: any;
}

// 数据结构状态
export interface DataStructureState {
  type: DataStructureType;
  data: any;
  metadata?: Record<string, any>;
}
