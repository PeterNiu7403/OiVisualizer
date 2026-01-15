import type { StackQueueElement } from '@/types';

/**
 * 栈数据结构类（LIFO - 后进先出）
 */
export class StackDS {
  private items: any[];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.items = [];
    this.maxSize = maxSize;
  }

  /**
   * 入栈
   */
  push(value: any): boolean {
    if (this.isFull()) {
      return false;
    }
    this.items.push(value);
    return true;
  }

  /**
   * 出栈
   */
  pop(): any {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  /**
   * 查看栈顶元素
   */
  peek(): any {
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
   * 获取栈大小
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空栈
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
  static deserialize(json: string): StackDS {
    const obj = JSON.parse(json);
    const stack = new StackDS(obj.maxSize);
    stack.items = obj.items;
    return stack;
  }

  /**
   * 转换为可视化格式
   */
  toVisualElements(): StackQueueElement[] {
    return this.items.map((value, index) => ({
      id: `stack-${index}`,
      value,
    }));
  }
}
