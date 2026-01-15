import type { GraphNode, GraphEdge, GraphType } from '@/types';

/**
 * 图数据结构类
 * 支持有向、无向、加权图
 */
export class GraphDS {
  private nodes: Map<string, GraphNode>;
  private edges: Map<string, GraphEdge>;
  private adjacencyList: Map<string, Set<string>>;
  private type: GraphType;
  private weighted: boolean;
  private nodeIdCounter: number;

  constructor(type: GraphType = 'undirected', weighted: boolean = false) {
    this.nodes = new Map();
    this.edges = new Map();
    this.adjacencyList = new Map();
    this.type = type;
    this.weighted = weighted;
    this.nodeIdCounter = 0;
  }

  /**
   * 添加节点
   */
  addNode(value: any): string {
    const id = `node-${this.nodeIdCounter++}`;
    const node: GraphNode = {
      id,
      value,
    };
    this.nodes.set(id, node);
    this.adjacencyList.set(id, new Set());
    return id;
  }

  /**
   * 删除节点
   */
  removeNode(nodeId: string): boolean {
    if (!this.nodes.has(nodeId)) {
      return false;
    }

    // 删除所有与该节点相关的边
    const neighbors = this.adjacencyList.get(nodeId);
    if (neighbors) {
      for (const neighborId of neighbors) {
        this.removeEdge(nodeId, neighborId);
      }
    }

    this.nodes.delete(nodeId);
    this.adjacencyList.delete(nodeId);
    return true;
  }

  /**
   * 更新节点值
   */
  updateNode(nodeId: string, value: any): boolean {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.value = value;
      return true;
    }
    return false;
  }

  /**
   * 添加边
   */
  addEdge(sourceId: string, targetId: string, weight?: number): boolean {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      return false;
    }

    const edgeId = `edge-${sourceId}-${targetId}`;
    const edge: GraphEdge = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      weight: this.weighted ? weight : undefined,
    };

    this.edges.set(edgeId, edge);
    this.adjacencyList.get(sourceId)!.add(targetId);

    // 无向图需要添加反向边
    if (this.type === 'undirected') {
      const reverseEdgeId = `edge-${targetId}-${sourceId}`;
      const reverseEdge: GraphEdge = {
        id: reverseEdgeId,
        source: targetId,
        target: sourceId,
        weight: this.weighted ? weight : undefined,
      };
      this.edges.set(reverseEdgeId, reverseEdge);
      this.adjacencyList.get(targetId)!.add(sourceId);
    }

    return true;
  }

  /**
   * 删除边
   */
  removeEdge(sourceId: string, targetId: string): boolean {
    const edgeId = `edge-${sourceId}-${targetId}`;
    const edge = this.edges.get(edgeId);

    if (!edge) {
      return false;
    }

    this.edges.delete(edgeId);
    this.adjacencyList.get(sourceId)!.delete(targetId);

    // 无向图需要删除反向边
    if (this.type === 'undirected') {
      const reverseEdgeId = `edge-${targetId}-${sourceId}`;
      this.edges.delete(reverseEdgeId);
      this.adjacencyList.get(targetId)!.delete(sourceId);
    }

    return true;
  }

  /**
   * 获取节点
   */
  getNode(nodeId: string): GraphNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * 获取所有节点
   */
  getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * 获取所有边
   */
  getEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  /**
   * 获取节点的邻居
   */
  getNeighbors(nodeId: string): GraphNode[] {
    const neighbors = this.adjacencyList.get(nodeId);
    if (!neighbors) {
      return [];
    }

    return Array.from(neighbors)
      .map((id) => this.nodes.get(id))
      .filter((node) => node !== undefined) as GraphNode[];
  }

  /**
   * 获取节点度数
   */
  getDegree(nodeId: string): number {
    const neighbors = this.adjacencyList.get(nodeId);
    return neighbors ? neighbors.size : 0;
  }

  /**
   * 深度优先搜索（DFS）
   */
  dfs(startNodeId: string, callback?: (node: GraphNode) => void): GraphNode[] {
    const visited = new Set<string>();
    const result: GraphNode[] = [];

    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);
      const node = this.nodes.get(nodeId);
      if (node) {
        result.push(node);
        if (callback) {
          callback(node);
        }
      }

      const neighbors = this.adjacencyList.get(nodeId);
      if (neighbors) {
        for (const neighborId of neighbors) {
          traverse(neighborId);
        }
      }
    };

    traverse(startNodeId);
    return result;
  }

  /**
   * 广度优先搜索（BFS）
   */
  bfs(startNodeId: string, callback?: (node: GraphNode) => void): GraphNode[] {
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    const result: GraphNode[] = [];

    visited.add(startNodeId);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = this.nodes.get(nodeId);

      if (node) {
        result.push(node);
        if (callback) {
          callback(node);
        }
      }

      const neighbors = this.adjacencyList.get(nodeId);
      if (neighbors) {
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        }
      }
    }

    return result;
  }

  /**
   * 检查两个节点之间是否有路径
   */
  hasPath(sourceId: string, targetId: string): boolean {
    const visited = new Set<string>();
    const queue: string[] = [sourceId];
    visited.add(sourceId);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;

      if (nodeId === targetId) {
        return true;
      }

      const neighbors = this.adjacencyList.get(nodeId);
      if (neighbors) {
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        }
      }
    }

    return false;
  }

  /**
   * 获取图的节点数
   */
  getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * 获取图的边数
   */
  getEdgeCount(): number {
    // 对于无向图，边数是实际边数的一半（因为每条边存了两遍）
    if (this.type === 'undirected') {
      return this.edges.size / 2;
    }
    return this.edges.size;
  }

  /**
   * 清空图
   */
  clear(): void {
    this.nodes.clear();
    this.edges.clear();
    this.adjacencyList.clear();
    this.nodeIdCounter = 0;
  }

  /**
   * 序列化
   */
  serialize(): string {
    return JSON.stringify({
      type: this.type,
      weighted: this.weighted,
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    });
  }

  /**
   * 反序列化
   */
  static deserialize(json: string): GraphDS {
    const obj = JSON.parse(json);
    const graph = new GraphDS(obj.type, obj.weighted);

    obj.nodes.forEach((node: GraphNode) => {
      graph.nodes.set(node.id, node);
      graph.adjacencyList.set(node.id, new Set());
    });

    obj.edges.forEach((edge: GraphEdge) => {
      graph.edges.set(edge.id, edge);
      graph.adjacencyList.get(edge.source)!.add(edge.target);
    });

    graph.nodeIdCounter = obj.nodes.length;

    return graph;
  }

  /**
   * 转换为可视化格式
   */
  toVisualFormat(): {
    nodes: GraphNode[];
    edges: GraphEdge[];
  } {
    return {
      nodes: this.getNodes(),
      edges: this.getEdges(),
    };
  }
}
