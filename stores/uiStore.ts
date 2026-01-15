import { create } from 'zustand';
import type { DataStructureType } from '@/types';

/**
 * UI 状态管理 Store
 * 管理界面布局、主题、视图状态等
 */
interface UIStore {
  // 主题
  theme: 'light' | 'dark';

  // 布局模式
  layoutMode: 'split-horizontal' | 'split-vertical' | 'tabbed';

  // 侧边栏状态
  sidebarOpen: boolean;

  // 选中的数据结构类型
  selectedStructure: DataStructureType;

  // 视图状态
  viewState: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };

  // 性能监控
  showPerformanceStats: boolean;
  currentFPS: number;

  // 面板状态
  panels: {
    console: boolean;
    timeline: boolean;
    controls: boolean;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  setLayoutMode: (mode: 'split-horizontal' | 'split-vertical' | 'tabbed') => void;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  setSelectedStructure: (type: DataStructureType) => void;

  setViewState: (state: { scale: number; offsetX: number; offsetY: number }) => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;

  setPerformanceStats: (show: boolean) => void;
  updateFPS: (fps: number) => void;

  setPanel: (panel: 'console' | 'timeline' | 'controls', open: boolean) => void;
  togglePanel: (panel: 'console' | 'timeline' | 'controls') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  theme: 'light',
  layoutMode: 'split-horizontal',
  sidebarOpen: true,
  selectedStructure: 'array',
  viewState: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  },
  showPerformanceStats: false,
  currentFPS: 60,
  panels: {
    console: true,
    timeline: true,
    controls: true,
  },

  // Theme actions
  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  // Layout actions
  setLayoutMode: (layoutMode) => set({ layoutMode }),

  // Sidebar actions
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  // Structure selection
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),

  // View state actions
  setViewState: (viewState) => set({ viewState }),

  resetView: () =>
    set({
      viewState: {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      },
    }),

  zoomIn: () =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        scale: Math.min(state.viewState.scale * 1.2, 3),
      },
    })),

  zoomOut: () =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        scale: Math.max(state.viewState.scale / 1.2, 0.3),
      },
    })),

  // Performance stats actions
  setPerformanceStats: (showPerformanceStats) => set({ showPerformanceStats }),

  updateFPS: (currentFPS) => set({ currentFPS }),

  // Panel actions
  setPanel: (panel, open) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: open,
      },
    })),

  togglePanel: (panel) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: !state.panels[panel],
      },
    })),
}));
