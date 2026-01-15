/**
 * 数组排序示例
 * 演示冒泡排序算法
 */

const arr = [64, 34, 25, 12, 22, 11, 90];

// 冒泡排序
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      // 交换元素
      const temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}

console.log(arr);
