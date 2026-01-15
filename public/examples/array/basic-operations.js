/**
 * 数组基本操作示例
 * 演示数组的创建、添加、删除、查找等操作
 */

// 创建数组
const arr = [1, 2, 3, 4, 5];

// 添加元素
arr.push(6);

// 在指定位置插入元素
arr.splice(2, 0, 99);

// 删除元素
arr.pop();

// 访问元素
console.log(arr[0]);

// 获取数组长度
console.log(arr.length);
