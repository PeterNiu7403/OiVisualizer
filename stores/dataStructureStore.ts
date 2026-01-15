import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  DataStructureType,
  DataStructureState,
  ExecutionStep,
  AnimationInstruction,
} from '@/types';

/**
 * 数据结构状态管理 Store
 * 管理当前数据结构的状态、执行追踪和动画指令
 */
interface DataStructureStore {
  // 当前数据结构
  currentStructure: {
    type: DataStructureType;
    data: any;
    metadata?: Record<string, any>;
  };

  // 执行追踪
  executionTrace: ExecutionStep[];
  currentStep: number;

  // 动画指令队列
  animationQueue: AnimationInstruction[];

  // 双向绑定同步控制
  isForwardBindingEnabled: boolean; // 代码 → 可视化
  isReverseBindingEnabled: boolean; // 可视化 → 代码

  // Actions
  setStructureType: (type: DataStructureType) => void;
  updateStructureData: (data: any, metadata?: Record<string, any>) => void;
  resetStructure: () => void;

  // 执行追踪相关
  addExecutionStep: (step: ExecutionStep) => void;
  setExecutionTrace: (steps: ExecutionStep[]) => void;
  goToStep: (step: number) => void;
  clearExecutionTrace: () => void;

  // 动画指令相关
  addAnimationInstruction: (instruction: AnimationInstruction) => void;
  setAnimationQueue: (instructions: AnimationInstruction[]) => void;
  clearAnimationQueue: () => void;

  // 双向绑定同步控制
  enableForwardBinding: () => void;
  disableForwardBinding: () => void;
  enableReverseBinding: () => void;
  disableReverseBinding: () => void;
}

const defaultStructure: DataStructureState = {
  type: 'array',
  data: [],
  metadata: {},
};

export const useDataStructureStore = create<DataStructureStore>()(
  immer((set) => ({
    // Initial state
    currentStructure: defaultStructure,
    executionTrace: [],
    currentStep: 0,
    animationQueue: [],
    isForwardBindingEnabled: true,
    isReverseBindingEnabled: true,

    // Structure actions
    setStructureType: (type) =>
      set((state) => {
        state.currentStructure.type = type;
        state.currentStructure.data = getDefaultDataForType(type);
      }),

    updateStructureData: (data, metadata) =>
      set((state) => {
        state.currentStructure.data = data;
        if (metadata) {
          state.currentStructure.metadata = {
            ...state.currentStructure.metadata,
            ...metadata,
          };
        }
      }),

    resetStructure: () =>
      set((state) => {
        state.currentStructure = defaultStructure;
        state.executionTrace = [];
        state.currentStep = 0;
        state.animationQueue = [];
      }),

    // Execution trace actions
    addExecutionStep: (step) =>
      set((state) => {
        state.executionTrace.push(step);
      }),

    setExecutionTrace: (steps) =>
      set((state) => {
        state.executionTrace = steps;
        state.currentStep = 0;
      }),

    goToStep: (step) =>
      set((state) => {
        if (step >= 0 && step < state.executionTrace.length) {
          state.currentStep = step;
          // 更新当前步骤的数据
          const targetStep = state.executionTrace[step];
          if (targetStep) {
            state.currentStructure.data = targetStep.state;
          }
        }
      }),

    clearExecutionTrace: () =>
      set((state) => {
        state.executionTrace = [];
        state.currentStep = 0;
      }),

    // Animation queue actions
    addAnimationInstruction: (instruction) =>
      set((state) => {
        state.animationQueue.push(instruction);
      }),

    setAnimationQueue: (instructions) =>
      set((state) => {
        state.animationQueue = instructions;
      }),

    clearAnimationQueue: () =>
      set((state) => {
        state.animationQueue = [];
      }),

    // Binding sync control
    enableForwardBinding: () =>
      set((state) => {
        state.isForwardBindingEnabled = true;
      }),

    disableForwardBinding: () =>
      set((state) => {
        state.isForwardBindingEnabled = false;
      }),

    enableReverseBinding: () =>
      set((state) => {
        state.isReverseBindingEnabled = true;
      }),

    disableReverseBinding: () =>
      set((state) => {
        state.isReverseBindingEnabled = false;
      }),
  }))
);

/**
 * 根据数据结构类型获取默认数据
 */
function getDefaultDataForType(type: DataStructureType): any {
  switch (type) {
    case 'array':
      return [];
    case 'linkedlist':
      return null;
    case 'stack':
    case 'queue':
      return [];
    case 'hashtable':
      return {};
    case 'tree':
      return null;
    case 'graph':
      return { nodes: [], edges: [] };
    default:
      return null;
  }
}
