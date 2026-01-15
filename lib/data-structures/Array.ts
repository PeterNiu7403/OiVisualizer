import type { ArrayElement } from '@/types';

/**
 * 数组数据结构类
 * 支持一维和二维数组
 */
export class ArrayDS {
  private data: any[];
  private dimensions: 1 | 2;
  private columns?: number; // 二维数组的列数

  constructor(initialData?: any[], dimensions: 1 | 2 = 1, columns?: number) {
    this.dimensions = dimensions;
    this.columns = columns;

    if (initialData) {
      this.data = [...initialData];
    } else {
      this.data = [];
    }
  }

  /**
   * 获取数组数据
   */
  getData(): any[] {
    return [...this.data];
  }

  /**
   * 获取数组元素
   */
  get(index: number): any {
    return this.data[index];
  }

  /**
   * 设置数组元素
   */
  set(index: number, value: any): void {
    this.data[index] = value;
  }

  /**
   * 在末尾添加元素
   */
  push(value: any): number {
    this.data.push(value);
    return this.data.length;
  }

  /**
   * 删除末尾元素
   */
  pop(): any {
    return this.data.pop();
  }

  /**
   * 在指定位置插入元素
   */
  insert(index: number, value: any): void {
    this.data.splice(index, 0, value);
  }

  /**
   * 删除指定位置元素
   */
  remove(index: number): any {
    return this.data.splice(index, 1)[0];
  }

  /**
   * 获取数组长度
   */
  length(): number {
    return this.data.length;
  }

  /**
   * 交换两个元素
   */
  swap(i: number, j: number): void {
    const temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }

  /**
   * 反转数组
   */
  reverse(): void {
    this.data.reverse();
  }

  /**
   * 排序数组
   */
  sort(compareFn?: (a: any, b: any) => number): void {
    this.data.sort(compareFn);
  }

  /**
   * 查找元素索引
   */
  indexOf(value: any): number {
    return this.data.indexOf(value);
  }

  /**
   * 清空数组
   */
  clear(): void {
    this.data = [];
  }

  /**
   * 序列化（用于状态保存）
   */
  serialize(): string {
    return JSON.stringify({
      data: this.data,
      dimensions: this.dimensions,
      columns: this.columns,
    });
  }

  /**
   * 反序列化（用于状态恢复）
   */
  static deserialize(json: string): ArrayDS {
    const obj = JSON.parse(json);
    return new ArrayDS(obj.data, obj.dimensions, obj.columns);
  }

  /**
   * 计算与另一个数组的差异
   */
  computeDiff(other: ArrayDS): ArrayOperation[] {
    const operations: ArrayOperation[] = [];
    const oldData = this.getData();
    const newData = other.getData();

    // 检测删除
    for (let i = 0; i < oldData.length; i++) {
      if (!newData.includes(oldData[i])) {
        operations.push({
          type: 'DELETE',
          index: i,
          value: oldData[i],
        });
      }
    }

    // 检测新增和更新
    for (let i = 0; i < newData.length; i++) {
      if (i >= oldData.length) {
        // 新增
        operations.push({
          type: 'INSERT',
          index: i,
          value: newData[i],
        });
      } else if (oldData[i] !== newData[i]) {
        // 更新
        operations.push({
          type: 'UPDATE',
          index: i,
          oldValue: oldData[i],
          newValue: newData[i],
        });
      }
    }

    return operations;
  }

  /**
   * 转换为可视化格式
   */
  toVisualElements(): ArrayElement[] {
    return this.data.map((value, index) => ({
      index,
      value,
      highlighted: false,
    }));
  }
}

/**
 * 数组操作类型
 */
export interface ArrayOperation {
  type: 'INSERT' | 'DELETE' | 'UPDATE' | 'SWAP';
  index: number;
  value?: any;
  oldValue?: any;
  newValue?: any;
  targetIndex?: number; // 用于 SWAP 操作
}
