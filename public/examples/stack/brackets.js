/**
 * 栈应用示例：括号匹配
 * 使用栈检查括号是否匹配
 */

function isValid(s) {
  const stack = [];

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (
        (char === ')' && top !== '(') ||
        (char === ']' && top !== '[') ||
        (char === '}' && top !== '{')
      ) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

// 测试
console.log(isValid('()[]{}')); // true
console.log(isValid('([)]'));   // false
