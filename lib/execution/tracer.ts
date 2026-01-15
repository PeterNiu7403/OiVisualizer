import type {
  ExecutionTrace,
  ExecutionStep,
  SupportedLanguage,
  DataStructureType,
} from '@/types';

/**
 * 代码执行追踪器
 * 负责解析和执行代码，记录每一步的状态变化
 */
export class ExecutionTracer {
  private language: SupportedLanguage;
  private trace: ExecutionStep[];
  private stepNumber: number;
  private startTime: number;

  constructor(language: SupportedLanguage = 'javascript') {
    this.language = language;
    this.trace = [];
    this.stepNumber = 0;
    this.startTime = 0;
  }

  /**
   * 执行代码并生成追踪
   */
  async execute(code: string): Promise<ExecutionTrace> {
    this.trace = [];
    this.stepNumber = 0;
    this.startTime = Date.now();

    try {
      if (this.language === 'javascript' || this.language === 'typescript') {
        await this.executeJavaScript(code);
      } else if (this.language === 'python') {
        throw new Error('Python execution not yet supported');
      }

      return {
        steps: this.trace,
        language: this.language,
        startTime: this.startTime,
        endTime: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 执行 JavaScript/TypeScript 代码
   * 使用沙箱环境执行代码
   */
  private async executeJavaScript(code: string): Promise<void> {
    // 创建沙箱环境
    const sandbox = this.createSandbox();
    const trackedStructures = new Map<string, any>();

    // 拦截常见的数据结构操作
    const proxiedArray = this.createTrackedArray(trackedStructures);
    const proxiedObject = this.createTrackedObject(trackedStructures);

    // 将跟踪的对象注入到沙箱中
    const sandboxCode = `
      ${code}
    `;

    try {
      // 使用 Function 构造函数创建隔离的作用域
      const fn = new Function(
        'Array',
        'Object',
        '__captureState',
        '__recordStep',
        `
        "use strict";

        // 重写 console 方法以捕获输出
        const console = {
          log: (...args) => __recordStep('console.log', args, null),
          error: (...args) => __recordStep('console.error', args, null),
          warn: (...args) => __recordStep('console.warn', args, null),
        };

        try {
          ${sandboxCode}

          // 捕获最终状态
          __captureState('final');
        } catch (error) {
          __recordStep('error', [error.message], null);
          throw error;
        }
        `
      );

      // 执行代码
      await fn(
        proxiedArray,
        proxiedObject,
        (label: string) => this.captureState(trackedStructures, label),
        (operation: string, args: any[], state: any) =>
          this.recordStep(operation, args, state)
      );
    } catch (error) {
      this.recordStep('error', [error], null);
    }
  }

  /**
   * 创建沙箱环境
   */
  private createSandbox(): any {
    return {
      console: {
        log: (...args: any[]) => console.log(...args),
        error: (...args: any[]) => console.error(...args),
      },
    };
  }

  /**
   * 创建被跟踪的 Array 构造函数
   */
  private createTrackedArray(trackedStructures: Map<string, any>): any {
    const self = this;

    return class extends Array {
      constructor(...args: any[]) {
        super(...args);
        trackedStructures.set('main', this);
        self.captureState(trackedStructures, 'array creation');
      }

      push(...args: any[]) {
        const result = super.push(...args);
        self.recordStep('Array.push', args, trackedStructures.get('main'));
        self.captureState(trackedStructures, 'after push');
        return result;
      }

      pop() {
        const result = super.pop();
        self.recordStep('Array.pop', [], trackedStructures.get('main'));
        self.captureState(trackedStructures, 'after pop');
        return result;
      }

      splice(...args: any[]) {
        const result = super.splice(...args);
        self.recordStep('Array.splice', args, trackedStructures.get('main'));
        self.captureState(trackedStructures, 'after splice');
        return result;
      }

      sort(compareFn?: (a: any, b: any) => number) {
        const result = super.sort(compareFn);
        self.recordStep('Array.sort', [], trackedStructures.get('main'));
        self.captureState(trackedStructures, 'after sort');
        return result;
      }

      reverse() {
        const result = super.reverse();
        self.recordStep('Array.reverse', [], trackedStructures.get('main'));
        self.captureState(trackedStructures, 'after reverse');
        return result;
      }
    };
  }

  /**
   * 创建被跟踪的 Object 构造函数
   */
  private createTrackedObject(trackedStructures: Map<string, any>): any {
    return {
      keys(obj: any) {
        return Object.keys(obj);
      },
      values(obj: any) {
        return Object.values(obj);
      },
      entries(obj: any) {
        return Object.entries(obj);
      },
    };
  }

  /**
   * 捕获当前状态
   */
  private captureState(trackedStructures: Map<string, any>, label: string): void {
    const state = trackedStructures.get('main');
    if (state) {
      this.recordStep(label, [], Array.isArray(state) ? [...state] : { ...state });
    }
  }

  /**
   * 记录执行步骤
   */
  private recordStep(operation: string, args: any[], state: any): void {
    this.trace.push({
      stepNumber: this.stepNumber++,
      line: 0, // TODO: 从源码映射获取行号
      operation,
      state,
      description: this.generateDescription(operation, args),
    });
  }

  /**
   * 生成步骤描述
   */
  private generateDescription(operation: string, args: any[]): string {
    switch (operation) {
      case 'Array.push':
        return `添加元素: ${args.join(', ')}`;
      case 'Array.pop':
        return `删除末尾元素`;
      case 'Array.splice':
        return `修改数组: ${args.join(', ')}`;
      case 'Array.sort':
        return `排序数组`;
      case 'Array.reverse':
        return `反转数组`;
      case 'console.log':
        return `输出: ${args.join(' ')}`;
      case 'error':
        return `错误: ${args[0]}`;
      default:
        return operation;
    }
  }

  /**
   * 解析代码（简化版）
   * 完整实现需要使用 Babel 或 TypeScript 编译器
   */
  parse(code: string): any {
    // 简化实现：直接返回代码
    // 完整实现应该使用 Babel 解析为 AST
    return {
      type: 'Program',
      body: [],
    };
  }

  /**
   * 重置追踪器
   */
  reset(): void {
    this.trace = [];
    this.stepNumber = 0;
    this.startTime = 0;
  }
}

/**
 * 执行上下文
 */
export interface ExecutionContext {
  variables: Map<string, any>;
  dataStructures: Map<string, any>;
  timestamp: number;
}

/**
 * 沙箱配置
 */
export interface SandboxConfig {
  timeout?: number;
  memoryLimit?: number;
  allowNetwork?: boolean;
}
