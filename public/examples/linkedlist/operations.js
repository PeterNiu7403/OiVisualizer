/**
 * 链表操作示例
 * 演示链表的基本操作
 */

// 链表节点类
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// 创建链表
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);

// 遍历链表
let current = head;
while (current) {
  console.log(current.val);
  current = current.next;
}

// 反转链表
let prev = null;
current = head;
while (current) {
  const next = current.next;
  current.next = prev;
  prev = current;
  current = next;
}
