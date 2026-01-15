import { gsap } from 'gsap';
import type { AnimationInstruction } from '@/types';

/**
 * 动画编排器
 * 使用 GSAP 管理动画时间轴和播放控制
 */
export class AnimationOrchestrator {
  private timeline: gsap.core.Timeline;
  private instructions: AnimationInstruction[];
  private isInitialized: boolean;
  private currentStep: number;
  private totalSteps: number;

  constructor() {
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => this.onUpdate(),
    });
    this.instructions = [];
    this.isInitialized = false;
    this.currentStep = 0;
    this.totalSteps = 0;
  }

  /**
   * 创建动画时间轴
   */
  createTimeline(instructions: AnimationInstruction[]): void {
    // 清除旧的时间轴
    this.clearTimeline();

    this.instructions = instructions;
    this.totalSteps = instructions.length;
    this.currentStep = 0;
    this.isInitialized = true;

    // 为每个指令创建动画
    instructions.forEach((instruction, index) => {
      this.addAnimation(instruction, index);
    });
  }

  /**
   * 添加单个动画到时间轴
   */
  private addAnimation(instruction: AnimationInstruction, index: number): void {
    const target = document.getElementById(instruction.targetId);

    if (!target) {
      console.warn(`Target element not found: ${instruction.targetId}`);
      return;
    }

    const duration = (instruction.duration || 300) / 1000; // 转换为秒
    const easing = this.mapEasing(instruction.easing || 'easeInOut');

    switch (instruction.type) {
      case 'INSERT':
        this.timeline.fromTo(
          target,
          {
            opacity: 0,
            scale: 0.5,
          },
          {
            opacity: 1,
            scale: 1,
            duration,
            ease: easing,
          },
          index
        );
        break;

      case 'DELETE':
        this.timeline.to(
          target,
          {
            opacity: 0,
            scale: 0.5,
            duration,
            ease: easing,
          },
          index
        );
        break;

      case 'UPDATE':
        if (instruction.to && instruction.to.value !== undefined) {
          // 使用文本内容更新
          gsap.to(target, {
            duration: 0,
            onComplete: () => {
              if (target.textContent !== String(instruction.to!.value)) {
                // 闪烁效果表示更新
                gsap
                  .timeline()
                  .to(target, {
                    backgroundColor: '#ffeb3b',
                    duration: 0.1,
                  })
                  .to(target, {
                    backgroundColor: 'transparent',
                    duration: 0.2,
                  });
              }
            },
          });
        }
        break;

      case 'MOVE':
        if (instruction.to && 'x' in instruction.to && 'y' in instruction.to) {
          this.timeline.to(
            target,
            {
              x: instruction.to.x,
              y: instruction.to.y,
              duration,
              ease: easing,
            },
            index
          );
        }
        break;

      case 'HIGHLIGHT':
        this.timeline.to(
          target,
          {
            backgroundColor: '#ffeb3b',
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          },
          index
        );
        break;

      case 'SCALE':
        const scale = instruction.to?.scale || 1;
        this.timeline.to(
          target,
          {
            scale,
            duration,
            ease: easing,
          },
          index
        );
        break;

      case 'FADE_IN':
        this.timeline.fromTo(
          target,
          { opacity: 0 },
          {
            opacity: 1,
            duration,
            ease: easing,
          },
          index
        );
        break;

      case 'FADE_OUT':
        this.timeline.to(
          target,
          {
            opacity: 0,
            duration,
            ease: easing,
          },
          index
        );
        break;

      case 'PATH_DRAW':
        if (target instanceof SVGElement && target.tagName === 'path') {
          const pathElement = target as unknown as SVGPathElement;
          const length = pathElement.getTotalLength();
          this.timeline.fromTo(
            target,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration,
              ease: easing,
            },
            index
          );
        }
        break;
    }
  }

  /**
   * 播放
   */
  play(): void {
    if (!this.isInitialized) {
      console.warn('Timeline not initialized');
      return;
    }
    this.timeline.play();
  }

  /**
   * 暂停
   */
  pause(): void {
    if (!this.isInitialized) {
      return;
    }
    this.timeline.pause();
  }

  /**
   * 停止
   */
  stop(): void {
    if (!this.isInitialized) {
      return;
    }
    this.timeline.pause();
    this.timeline.seek(0);
    this.currentStep = 0;
  }

  /**
   * 单步前进
   */
  stepForward(): void {
    if (!this.isInitialized) {
      return;
    }

    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.goToStep(this.currentStep);
    }
  }

  /**
   * 单步后退
   */
  stepBackward(): void {
    if (!this.isInitialized) {
      return;
    }

    if (this.currentStep > 0) {
      this.currentStep--;
      this.goToStep(this.currentStep);
    }
  }

  /**
   * 跳转到指定步骤
   */
  goToStep(step: number): void {
    if (!this.isInitialized) {
      return;
    }

    if (step < 0 || step >= this.totalSteps) {
      console.warn(`Invalid step: ${step}`);
      return;
    }

    this.currentStep = step;
    this.timeline.seek(step);
  }

  /**
   * 设置播放速度
   */
  setSpeed(speed: number): void {
    this.timeline.timeScale(speed);
  }

  /**
   * 获取当前步骤
   */
  getCurrentStep(): number {
    return this.currentStep;
  }

  /**
   * 获取总步骤数
   */
  getTotalSteps(): number {
    return this.totalSteps;
  }

  /**
   * 获取播放进度（0-1）
   */
  getProgress(): number {
    if (!this.isInitialized || this.totalSteps === 0) {
      return 0;
    }
    return this.currentStep / this.totalSteps;
  }

  /**
   * 是否正在播放
   */
  isPlaying(): boolean {
    return this.timeline.isActive();
  }

  /**
   * 清除时间轴
   */
  clearTimeline(): void {
    this.timeline.clear();
    this.timeline.seek(0);
    this.instructions = [];
    this.isInitialized = false;
    this.currentStep = 0;
    this.totalSteps = 0;
  }

  /**
   * 销毁编排器
   */
  destroy(): void {
    this.clearTimeline();
    this.timeline.kill();
  }

  /**
   * 更新回调
   */
  private onUpdate(): void {
    // 更新当前步骤
    this.currentStep = Math.round(this.timeline.time());

    // 可以在这里触发自定义事件
    this.dispatchEvent('update', {
      currentStep: this.currentStep,
      progress: this.getProgress(),
    });
  }

  /**
   * 派发事件
   */
  private dispatchEvent(type: string, detail: any): void {
    const event = new CustomEvent(`animation:${type}`, { detail });
    window.dispatchEvent(event);
  }

  /**
   * 映射缓动函数
   */
  private mapEasing(easing: string): string {
    const easingMap: Record<string, string> = {
      linear: 'none',
      easeIn: 'power1.in',
      easeOut: 'power1.out',
      easeInOut: 'power1.inOut',
      easeInCubic: 'power2.in',
      easeOutCubic: 'power2.out',
      easeInOutCubic: 'power2.inOut',
      bounce: 'bounce.out',
      elastic: 'elastic.out(1, 0.3)',
    };

    return easingMap[easing] || easing;
  }
}

/**
 * 动画事件类型
 */
export type AnimationEventType = 'play' | 'pause' | 'stop' | 'update' | 'complete';

/**
 * 动画事件监听器
 */
export type AnimationEventListener = (detail: any) => void;

/**
 * 动画管理器（单例）
 */
export class AnimationManager {
  private static instance: AnimationManager;
  private orchestrators: Map<string, AnimationOrchestrator>;

  private constructor() {
    this.orchestrators = new Map();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  /**
   * 创建或获取编排器
   */
  getOrchestrator(id: string): AnimationOrchestrator {
    if (!this.orchestrators.has(id)) {
      this.orchestrators.set(id, new AnimationOrchestrator());
    }
    return this.orchestrators.get(id)!;
  }

  /**
   * 销毁编排器
   */
  destroyOrchestrator(id: string): void {
    const orchestrator = this.orchestrators.get(id);
    if (orchestrator) {
      orchestrator.destroy();
      this.orchestrators.delete(id);
    }
  }

  /**
   * 销毁所有编排器
   */
  destroyAll(): void {
    for (const [id, orchestrator] of this.orchestrators) {
      orchestrator.destroy();
    }
    this.orchestrators.clear();
  }
}
