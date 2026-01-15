import { create } from 'zustand';
import type { SupportedLanguage } from '@/types';

/**
 * 编辑器状态管理 Store
 * 管理代码编辑器的内容、语言选择、执行状态等
 */
interface EditorStore {
  // 代码内容
  code: string;
  language: SupportedLanguage;

  // 编辑器状态
  isExecuting: boolean;
  hasErrors: boolean;
  errorMessage?: string;

  // 当前选中的示例代码
  selectedExample: string | null;

  // 编辑器 UI 状态
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;

  // Actions
  setCode: (code: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  resetCode: () => void;

  // 执行状态管理
  setExecuting: (isExecuting: boolean) => void;
  setError: (hasErrors: boolean, message?: string) => void;
  clearError: () => void;

  // 示例代码管理
  setSelectedExample: (example: string | null) => void;

  // 编辑器设置
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
  setMinimap: (show: boolean) => void;
}

const defaultCode = `// 示例：创建一个数组
const arr = [1, 2, 3, 4, 5];

// 添加元素
arr.push(6);

// 访问元素
console.log(arr[0]);

// 删除元素
arr.pop();
`;

export const useEditorStore = create<EditorStore>((set) => ({
  // Initial state
  code: defaultCode,
  language: 'javascript',
  isExecuting: false,
  hasErrors: false,
  errorMessage: undefined,
  selectedExample: null,
  fontSize: 14,
  wordWrap: true,
  minimap: true,

  // Code management
  setCode: (code) => set({ code }),

  setLanguage: (language) => set({ language }),

  resetCode: () =>
    set({
      code: defaultCode,
      hasErrors: false,
      errorMessage: undefined,
    }),

  // Execution state
  setExecuting: (isExecuting) => set({ isExecuting }),

  setError: (hasErrors, message) =>
    set({
      hasErrors,
      errorMessage: message,
    }),

  clearError: () =>
    set({
      hasErrors: false,
      errorMessage: undefined,
    }),

  // Example management
  setSelectedExample: (example) => set({ selectedExample: example }),

  // Editor settings
  setFontSize: (fontSize) => set({ fontSize }),

  setWordWrap: (wordWrap) => set({ wordWrap }),

  setMinimap: (minimap) => set({ minimap }),
}));
