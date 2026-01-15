import type { TreeNode, TreeType } from '@/types';

/**
 * 二叉树节点类
 */
class BinaryTreeNode {
  id: string;
  value: any;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  height: number; // 用于 AVL 树

  constructor(value: any) {
    this.id = `tree-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

/**
 * 树数据结构类
 * 支持 BST、AVL、堆
 */
export class TreeDS {
  private root: BinaryTreeNode | null;
  private type: TreeType;
  private size: number;

  constructor(type: TreeType = 'bst') {
    this.root = null;
    this.type = type;
    this.size = 0;
  }

  /**
   * 插入节点
   */
  insert(value: any): void {
    if (this.type === 'bst' || this.type === 'avl') {
      this.root = this.insertNode(this.root, value);
      this.size++;
    } else if (this.type === 'heap') {
      // 堆的插入需要单独实现
      this.root = this.insertHeap(this.root, value);
      this.size++;
    }
  }

  /**
   * BST/AVL 插入
   */
  private insertNode(node: BinaryTreeNode | null, value: any): BinaryTreeNode {
    if (!node) {
      return new BinaryTreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      // 值相等，不插入
      return node;
    }

    // AVL 树需要平衡
    if (this.type === 'avl') {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      return this.balance(node);
    }

    return node;
  }

  /**
   * 堆插入（最小堆）
   */
  private insertHeap(node: BinaryTreeNode | null, value: any): BinaryTreeNode {
    if (!node) {
      return new BinaryTreeNode(value);
    }

    // 简化的堆插入（完整实现需要使用数组）
    if (value < node.value) {
      const temp = node.value;
      node.value = value;
      value = temp;
    }

    if (!node.left) {
      node.left = new BinaryTreeNode(value);
    } else if (!node.right) {
      node.right = new BinaryTreeNode(value);
    } else {
      // 选择子节点较少的一侧
      if (this.getSize(node.left) <= this.getSize(node.right)) {
        node.left = this.insertHeap(node.left, value);
      } else {
        node.right = this.insertHeap(node.right, value);
      }
    }

    return node;
  }

  /**
   * 删除节点
   */
  delete(value: any): boolean {
    if (!this.search(value)) {
      return false;
    }

    this.root = this.deleteNode(this.root, value);
    this.size--;
    return true;
  }

  /**
   * 删除节点辅助函数
   */
  private deleteNode(node: BinaryTreeNode | null, value: any): BinaryTreeNode | null {
    if (!node) {
      return null;
    }

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // 找到要删除的节点
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // 有两个子节点，找到右子树的最小值
      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
    }

    if (this.type === 'avl') {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      return this.balance(node);
    }

    return node;
  }

  /**
   * 查找最小值节点
   */
  private findMin(node: BinaryTreeNode): BinaryTreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  /**
   * 搜索节点
   */
  search(value: any): boolean {
    return this.searchNode(this.root, value);
  }

  /**
   * 搜索节点辅助函数
   */
  private searchNode(node: BinaryTreeNode | null, value: any): boolean {
    if (!node) {
      return false;
    }

    if (value === node.value) {
      return true;
    } else if (value < node.value) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }

  /**
   * 获取节点高度
   */
  private getHeight(node: BinaryTreeNode | null): number {
    return node ? node.height : 0;
  }

  /**
   * 获取节点大小
   */
  private getSize(node: BinaryTreeNode | null): number {
    if (!node) {
      return 0;
    }
    return 1 + this.getSize(node.left) + this.getSize(node.right);
  }

  /**
   * 获取平衡因子（AVL）
   */
  private getBalanceFactor(node: BinaryTreeNode): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  /**
   * AVL 平衡操作
   */
  private balance(node: BinaryTreeNode): BinaryTreeNode {
    const balanceFactor = this.getBalanceFactor(node);

    // 左左情况
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    // 右右情况
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    // 左右情况
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // 右左情况
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  /**
   * 右旋转
   */
  private rotateRight(y: BinaryTreeNode): BinaryTreeNode {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x;
  }

  /**
   * 左旋转
   */
  private rotateLeft(x: BinaryTreeNode): BinaryTreeNode {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  /**
   * 中序遍历
   */
  inOrderTraversal(): any[] {
    const result: any[] = [];
    this.inOrder(this.root, result);
    return result;
  }

  private inOrder(node: BinaryTreeNode | null, result: any[]): void {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
  }

  /**
   * 前序遍历
   */
  preOrderTraversal(): any[] {
    const result: any[] = [];
    this.preOrder(this.root, result);
    return result;
  }

  private preOrder(node: BinaryTreeNode | null, result: any[]): void {
    if (node) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
  }

  /**
   * 后序遍历
   */
  postOrderTraversal(): any[] {
    const result: any[] = [];
    this.postOrder(this.root, result);
    return result;
  }

  private postOrder(node: BinaryTreeNode | null, result: any[]): void {
    if (node) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
  }

  /**
   * 获取树的大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 清空树
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }

  /**
   * 序列化
   */
  serialize(): string {
    return JSON.stringify({
      type: this.type,
      size: this.size,
      root: this.serializeNode(this.root),
    });
  }

  private serializeNode(node: BinaryTreeNode | null): any {
    if (!node) {
      return null;
    }
    return {
      id: node.id,
      value: node.value,
      left: this.serializeNode(node.left),
      right: this.serializeNode(node.right),
      height: node.height,
    };
  }

  /**
   * 转换为可视化格式
   */
  toVisualNodes(): TreeNode[] {
    const nodes: TreeNode[] = [];
    this.collectNodes(this.root, nodes);
    return nodes;
  }

  private collectNodes(node: BinaryTreeNode | null, nodes: TreeNode[]): void {
    if (node) {
      const treeNode: TreeNode = {
        id: node.id,
        value: node.value,
      };
      nodes.push(treeNode);

      this.collectNodes(node.left, nodes);
      this.collectNodes(node.right, nodes);
    }
  }
}
