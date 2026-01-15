import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AnimationInstruction } from '@/types';

/**
 * 动画播放状态管理 Store
 * 管理动画的播放、暂停、单步执行、播放速度等
 */
interface AnimationStore {
  // 播放状态
  isPlaying: boolean;
  isPaused: boolean;

  // 当前步骤
  currentStep: number;
  totalSteps: number;

  // 动画指令队列
  instructions: AnimationInstruction[];

  // 播放速度
  speed: number; // 0.5x, 1x, 2x, etc.

  // 循环播放
  loop: boolean;

  // Actions
  play: () => void;
  pause: () => void;
  stop: () => void;

  // 步进控制
  stepForward: () => void;
  stepBackward: () => void;
  goToStep: (step: number) => void;

  // 动画队列管理
  setInstructions: (instructions: AnimationInstruction[]) => void;
  clearInstructions: () => void;

  // 速度控制
  setSpeed: (speed: number) => void;

  // 循环控制
  toggleLoop: () => void;

  // 重置
  reset: () => void;
}

export const useAnimationStore = create<AnimationStore>()(
  immer((set, get) => ({
    // Initial state
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    instructions: [],
    speed: 1,
    loop: false,

    // Playback controls
    play: () =>
      set((state) => {
        if (!state.isPlaying) {
          state.isPlaying = true;
          state.isPaused = false;
        }
      }),

    pause: () =>
      set((state) => {
        state.isPlaying = false;
        state.isPaused = true;
      }),

    stop: () =>
      set((state) => {
        state.isPlaying = false;
        state.isPaused = false;
        state.currentStep = 0;
      }),

    // Step controls
    stepForward: () =>
      set((state) => {
        if (state.currentStep < state.totalSteps - 1) {
          state.currentStep += 1;
        } else if (state.loop) {
          // 循环播放
          state.currentStep = 0;
        } else {
          // 播放结束
          state.isPlaying = false;
        }
      }),

    stepBackward: () =>
      set((state) => {
        if (state.currentStep > 0) {
          state.currentStep -= 1;
        }
      }),

    goToStep: (step) =>
      set((state) => {
        if (step >= 0 && step < state.totalSteps) {
          state.currentStep = step;
        }
      }),

    // Animation queue management
    setInstructions: (instructions) =>
      set((state) => {
        state.instructions = instructions;
        state.totalSteps = instructions.length;
        state.currentStep = 0;
      }),

    clearInstructions: () =>
      set((state) => {
        state.instructions = [];
        state.totalSteps = 0;
        state.currentStep = 0;
        state.isPlaying = false;
        state.isPaused = false;
      }),

    // Speed control
    setSpeed: (speed) =>
      set((state) => {
        state.speed = Math.max(0.1, Math.min(4, speed)); // 限制在 0.1x - 4x 之间
      }),

    // Loop control
    toggleLoop: () =>
      set((state) => {
        state.loop = !state.loop;
      }),

    // Reset
    reset: () =>
      set((state) => {
        state.isPlaying = false;
        state.isPaused = false;
        state.currentStep = 0;
      }),
  }))
);
