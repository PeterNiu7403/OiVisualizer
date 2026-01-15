/**
 * 动画相关类型定义
 */

// 动画指令类型
export type AnimationInstructionType =
  | 'INSERT'
  | 'DELETE'
  | 'UPDATE'
  | 'MOVE'
  | 'HIGHLIGHT'
  | 'SCALE'
  | 'FADE_IN'
  | 'FADE_OUT'
  | 'PATH_DRAW';

// 动画指令
export interface AnimationInstruction {
  type: AnimationInstructionType;
  targetId: string;
  duration?: number;
  delay?: number;
  easing?: string;
  from?: any;
  to?: any;
  metadata?: Record<string, any>;
}

// 动画状态
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 0.5x, 1x, 2x, etc.
}

// 过渡效果
export interface Transition {
  name: string;
  duration: number;
  easing: string;
}
