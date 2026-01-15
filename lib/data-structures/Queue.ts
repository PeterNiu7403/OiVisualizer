import type { StackQueueElement } from '@/types';

/**
 * 队列数据结构类（FIFO - 先进先出）
 */
export class QueueDS {
  private items: any[];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.items = [];
    this.maxSize = maxSize;
  }

  /**
   * 入队
   */
  enqueue(value: any): boolean {
    if (this.isFull()) {
      return false;
    }
    this.items.push(value);
    return true;
  }

  /**
   * 出队
   */
  dequeue(): any {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  /**
   * 查看队首元素
   */
  peek(): any {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /**
   * 查看队尾元素
   */
  rear(): any {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * 检查是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 检查是否已满
   */
  isFull(): boolean {
    return this.items.length >= this.maxSize;
  }

  /**
   * 获取队列大小
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 序列化
   */
  serialize(): string {
    return JSON.stringify({
      items: this.items,
      maxSize: this.maxSize,
    });
  }

  /**
   * 反序列化
   */
  static deserialize(json: string): QueueDS {
    const obj = JSON.parse(json);
    const queue = new QueueDS(obj.maxSize);
    queue.items = obj.items;
    return queue;
  }

  /**
   * 转换为可视化格式
   */
  toVisualElements(): StackQueueElement[] {
    return this.items.map((value, index) => ({
      id: `queue-${index}`,
      value,
    }));
  }
}
