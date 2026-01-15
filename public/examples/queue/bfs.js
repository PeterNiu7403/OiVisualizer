/**
 * 队列应用示例：广度优先搜索
 * 使用队列实现图的 BFS
 */

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// 图的邻接表表示
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 4],
  3: [1],
  4: [1, 2],
};

// BFS 遍历
function bfs(startNode) {
  const queue = new Queue();
  const visited = new Set();

  queue.enqueue(startNode);
  visited.add(startNode);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();
    console.log('访问节点:', currentNode);

    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    }
  }
}

// 从节点 0 开始 BFS
bfs(0);
