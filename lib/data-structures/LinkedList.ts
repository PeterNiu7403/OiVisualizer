import type { LinkedListNode, LinkedListType } from '@/types';

/**
 * 链表节点类
 */
class Node {
  id: string;
  value: any;
  next: Node | null;
  prev: Node | null; // 用于双向链表

  constructor(value: any) {
    this.id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * 链表数据结构类
 * 支持单向、双向、循环链表
 */
export class LinkedListDS {
  private head: Node | null;
  private tail: Node | null;
  private length: number;
  private type: LinkedListType;
  private nodeCount: number;

  constructor(type: LinkedListType = 'singly') {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.type = type;
    this.nodeCount = 0;
  }

  /**
   * 在头部添加节点
   */
  prepend(value: any): void {
    const newNode = new Node(value);
    this.nodeCount++;

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      if (this.type === 'circular') {
        newNode.next = newNode;
        if (this.type === 'doubly') {
          newNode.prev = newNode;
        }
      }
    } else {
      if (this.type === 'circular') {
        newNode.next = this.head;
        this.head.prev = newNode;
        this.tail!.next = newNode;
      } else {
        newNode.next = this.head;
        if (this.type === 'doubly') {
          this.head.prev = newNode;
        }
      }
      this.head = newNode;
    }
    this.length++;
  }

  /**
   * 在尾部添加节点
   */
  append(value: any): void {
    const newNode = new Node(value);
    this.nodeCount++;

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      if (this.type === 'circular') {
        newNode.next = newNode;
        if (this.type === 'doubly') {
          newNode.prev = newNode;
        }
      }
    } else {
      if (this.type === 'circular') {
        newNode.next = this.head;
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.head.prev = newNode;
      } else {
        this.tail.next = newNode;
        if (this.type === 'doubly') {
          newNode.prev = this.tail;
        }
      }
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * 在指定位置插入节点
   */
  insert(index: number, value: any): boolean {
    if (index < 0 || index > this.length) {
      return false;
    }

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this.length) {
      this.append(value);
      return true;
    }

    const newNode = new Node(value);
    this.nodeCount++;

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    newNode.next = current!.next;
    if (this.type === 'doubly' && newNode.next) {
      newNode.next.prev = newNode;
    }
    newNode.prev = current;
    current.next = newNode;

    this.length++;
    return true;
  }

  /**
   * 删除头部节点
   */
  removeHead(): any {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.length--;

    if (this.type === 'circular') {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        this.tail!.next = this.head;
        this.head.prev = this.tail;
      }
    } else {
      if (this.type === 'doubly' && this.head.next) {
        this.head.next.prev = null;
      }
      this.head = this.head.next;

      if (!this.head) {
        this.tail = null;
      }
    }

    return value;
  }

  /**
   * 删除尾部节点
   */
  removeTail(): any {
    if (!this.tail) {
      return null;
    }

    const value = this.tail.value;
    this.length--;

    if (this.type === 'circular') {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = this.tail.prev;
        this.tail!.next = this.head;
        this.head!.prev = this.tail;
      }
    } else {
      if (this.type === 'doubly') {
        this.tail = this.tail.prev;
        if (this.tail) {
          this.tail.next = null;
        }
      } else {
        // 单向链表需要遍历
        let current = this.head;
        while (current && current.next !== this.tail) {
          current = current.next;
        }
        if (current) {
          current.next = null;
          this.tail = current;
        }
      }

      if (!this.tail) {
        this.head = null;
      }
    }

    return value;
  }

  /**
   * 删除指定位置的节点
   */
  remove(index: number): any {
    if (index < 0 || index >= this.length) {
      return null;
    }

    if (index === 0) {
      return this.removeHead();
    }

    if (index === this.length - 1) {
      return this.removeTail();
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    const value = current!.next!.value;
    current.next = current.next!.next;

    if (this.type === 'doubly' && current.next) {
      current.next.prev = current;
    }

    this.length--;
    return value;
  }

  /**
   * 查找节点
   */
  find(value: any): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;

      // 循环链表检测
      if (this.type === 'circular' && current === this.head) {
        break;
      }
    }

    return -1;
  }

  /**
   * 获取指定位置的节点值
   */
  get(index: number): any {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current!.value;
  }

  /**
   * 更新指定位置的节点值
   */
  set(index: number, value: any): boolean {
    if (index < 0 || index >= this.length) {
      return false;
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    current!.value = value;
    return true;
  }

  /**
   * 反转链表
   */
  reverse(): void {
    let prev = null;
    let current = this.head;
    this.tail = this.head;

    while (current) {
      const next = current.next;
      current.next = prev;
      if (this.type === 'doubly') {
        current.prev = next;
      }
      prev = current;
      current = next;

      // 循环链表处理
      if (this.type === 'circular' && current === this.head) {
        break;
      }
    }

    if (this.type === 'circular' && prev) {
      prev.next = this.head;
      if (this.type === 'doubly' && this.head) {
        this.head.prev = prev;
      }
    }

    this.head = prev;
  }

  /**
   * 获取链表长度
   */
  size(): number {
    return this.length;
  }

  /**
   * 清空链表
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * 序列化
   */
  serialize(): string {
    const elements: LinkedListNode[] = [];
    let current = this.head;
    let visited = 0;

    while (current && visited < this.length) {
      elements.push({
        id: current.id,
        value: current.value,
      });
      current = current.next;
      visited++;
    }

    return JSON.stringify({
      type: this.type,
      elements,
      length: this.length,
    });
  }

  /**
   * 转换为可视化格式
   */
  toVisualNodes(): LinkedListNode[] {
    const nodes: LinkedListNode[] = [];
    let current = this.head;
    let visited = 0;

    while (current && visited < this.length) {
      nodes.push({
        id: current.id,
        value: current.value,
      });
      current = current.next;
      visited++;
    }

    return nodes;
  }
}
