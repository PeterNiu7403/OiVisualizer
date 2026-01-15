import type { HashEntry } from '@/types';

/**
 * 哈希表节点（用于链地址法）
 */
class HashNode {
  key: any;
  value: any;
  next: HashNode | null;

  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

/**
 * 哈希表数据结构类
 * 使用链地址法解决冲突
 */
export class HashTableDS {
  private buckets: (HashNode | null)[];
  private size: number;
  private capacity: number;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null);
    this.size = 0;
  }

  /**
   * 哈希函数
   */
  private hash(key: any): number {
    if (typeof key === 'string') {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash) % this.capacity;
    } else if (typeof key === 'number') {
      return Math.abs(key) % this.capacity;
    } else {
      // 对于其他类型，使用 toString 后再哈希
      return this.hash(String(key));
    }
  }

  /**
   * 设置键值对
   */
  set(key: any, value: any): void {
    const index = this.hash(key);
    let node = this.buckets[index];

    // 检查 key 是否已存在
    while (node) {
      if (node.key === key) {
        node.value = value;
        return;
      }
      node = node.next;
    }

    // key 不存在，添加新节点
    const newNode = new HashNode(key, value);
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.size++;

    // 如果负载因子过高，扩容
    if (this.size / this.capacity > 0.75) {
      this.resize();
    }
  }

  /**
   * 获取值
   */
  get(key: any): any {
    const index = this.hash(key);
    let node = this.buckets[index];

    while (node) {
      if (node.key === key) {
        return node.value;
      }
      node = node.next;
    }

    return null;
  }

  /**
   * 删除键值对
   */
  delete(key: any): boolean {
    const index = this.hash(key);
    let node = this.buckets[index];
    let prev: HashNode | null = null;

    while (node) {
      if (node.key === key) {
        if (prev) {
          prev.next = node.next;
        } else {
          this.buckets[index] = node.next;
        }
        this.size--;
        return true;
      }
      prev = node;
      node = node.next;
    }

    return false;
  }

  /**
   * 检查 key 是否存在
   */
  has(key: any): boolean {
    const index = this.hash(key);
    let node = this.buckets[index];

    while (node) {
      if (node.key === key) {
        return true;
      }
      node = node.next;
    }

    return false;
  }

  /**
   * 获取所有键
   */
  keys(): any[] {
    const keys: any[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i];
      while (node) {
        keys.push(node.key);
        node = node.next;
      }
    }
    return keys;
  }

  /**
   * 获取所有值
   */
  values(): any[] {
    const values: any[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i];
      while (node) {
        values.push(node.value);
        node = node.next;
      }
    }
    return values;
  }

  /**
   * 获取所有条目
   */
  entries(): HashEntry[] {
    const entries: HashEntry[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let node = this.buckets[i];
      while (node) {
        entries.push({
          key: node.key,
          value: node.value,
        });
        node = node.next;
      }
    }
    return entries;
  }

  /**
   * 获取哈希表大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * 扩容
   */
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;

    for (let i = 0; i < oldBuckets.length; i++) {
      let node = oldBuckets[i];
      while (node) {
        this.set(node.key, node.value);
        node = node.next;
      }
    }
  }

  /**
   * 序列化
   */
  serialize(): string {
    return JSON.stringify({
      capacity: this.capacity,
      size: this.size,
      entries: this.entries(),
    });
  }

  /**
   * 反序列化
   */
  static deserialize(json: string): HashTableDS {
    const obj = JSON.parse(json);
    const hashTable = new HashTableDS(obj.capacity);
    obj.entries.forEach((entry: HashEntry) => {
      hashTable.set(entry.key, entry.value);
    });
    return hashTable;
  }

  /**
   * 获取指定桶的所有条目（用于可视化）
   */
  getBucketEntries(bucketIndex: number): HashEntry[] {
    const entries: HashEntry[] = [];
    let node = this.buckets[bucketIndex];
    while (node) {
      entries.push({
        key: node.key,
        value: node.value,
      });
      node = node.next;
    }
    return entries;
  }

  /**
   * 获取所有桶的条目（用于可视化）
   */
  getAllBuckets(): (HashEntry[])[] {
    const buckets: (HashEntry[])[] = [];
    for (let i = 0; i < this.capacity; i++) {
      buckets.push(this.getBucketEntries(i));
    }
    return buckets;
  }
}
