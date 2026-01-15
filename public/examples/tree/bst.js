/**
 * 二叉搜索树示例
 * 演示 BST 的插入和搜索操作
 */

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const newNode = new TreeNode(val);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  search(val) {
    let current = this.root;

    while (current) {
      if (val === current.val) {
        return true;
      } else if (val < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  // 中序遍历
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.val);
      this.inOrder(node.right, result);
    }
    return result;
  }
}

// 使用示例
const bst = new BST();
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(1);
bst.insert(9);

console.log(bst.inOrder());  // [1, 3, 5, 7, 9]
console.log(bst.search(7)); // true
console.log(bst.search(4)); // false
