/**
 * 图算法示例：Dijkstra 最短路径
 * 使用优先队列实现 Dijkstra 算法
 */

// 优先队列（简化版）
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const qElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(qElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Dijkstra 算法
function dijkstra(graph, startNode) {
  const distances = {};
  const pq = new PriorityQueue();
  const visited = new Set();

  // 初始化距离
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: currentNode } = pq.dequeue();

    if (visited.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);

    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      const distance = neighbors[neighbor];
      const totalDistance = distances[currentNode] + distance;

      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance;
        pq.enqueue(neighbor, totalDistance);
      }
    }
  }

  return distances;
}

// 图的邻接表表示
const graph = {
  A: { B: 4, C: 2 },
  B: { C: 1, D: 5 },
  C: { D: 8, B: 3 },
  D: {},
};

// 计算从 A 到所有节点的最短距离
console.log(dijkstra(graph, 'A'));
// 输出: { A: 0, B: 4, C: 2, D: 9 }
