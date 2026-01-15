/**
 * 代码执行相关类型定义
 */

// 支持的编程语言
export type SupportedLanguage = 'javascript' | 'typescript' | 'python';

// AST 节点类型
export interface ASTNode {
  type: string;
  [key: string]: any;
}

// 解析后的 AST
export interface ParsedAST {
  root: ASTNode;
  language: SupportedLanguage;
  imports: string[];
  variables: string[];
}

// 执行上下文
export interface ExecutionContext {
  variables: Map<string, any>;
  dataStructures: Map<string, any>;
  timestamp: number;
}

// 执行追踪
export interface ExecutionTrace {
  steps: ExecutionStep[];
  language: SupportedLanguage;
  startTime: number;
  endTime: number;
}

// 执行步骤
export interface ExecutionStep {
  stepNumber: number;
  line: number;
  operation: string;
  state: any;
  description: string;
}

// 执行错误
export interface ExecutionError {
  message: string;
  line: number;
  column: number;
  stack?: string;
}
