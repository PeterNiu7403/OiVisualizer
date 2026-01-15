import type { StateTransition, AnimationInstruction } from '@/types';

/**
 * 状态差异引擎
 * 计算两个状态之间的差异，并生成动画指令
 */
export class DiffEngine {
  /**
   * 计算两个状态之间的差异
   */
  computeDiff(
    prevState: any,
    nextState: any,
    structureType: string
  ): StateTransition[] {
    const transitions: StateTransition[] = [];

    switch (structureType) {
      case 'array':
        return this.computeArrayDiff(prevState, nextState);
      case 'linkedlist':
        return this.computeLinkedListDiff(prevState, nextState);
      case 'stack':
      case 'queue':
        return this.computeLinearDiff(prevState, nextState);
      case 'hashtable':
        return this.computeHashTableDiff(prevState, nextState);
      case 'tree':
        return this.computeTreeDiff(prevState, nextState);
      case 'graph':
        return this.computeGraphDiff(prevState, nextState);
      default:
        return transitions;
    }
  }

  /**
   * 计算数组差异
   */
  private computeArrayDiff(prevArray: any[], nextArray: any[]): StateTransition[] {
    const transitions: StateTransition[] = [];

    // 检测删除的元素
    for (let i = 0; i < prevArray.length; i++) {
      const value = prevArray[i];
      if (!nextArray.includes(value)) {
        transitions.push({
          type: 'DELETE',
          elementId: `array-${i}`,
          from: { index: i, value },
        });
      }
    }

    // 检测新增和更新的元素
    for (let i = 0; i < nextArray.length; i++) {
      if (i >= prevArray.length) {
        // 新增
        transitions.push({
          type: 'INSERT',
          elementId: `array-${i}`,
          to: { index: i, value: nextArray[i] },
        });
      } else if (prevArray[i] !== nextArray[i]) {
        // 更新
        transitions.push({
          type: 'UPDATE',
          elementId: `array-${i}`,
          from: { index: i, value: prevArray[i] },
          to: { index: i, value: nextArray[i] },
        });
      } else if (prevArray[i] !== undefined && nextArray[i] !== undefined) {
        // 检测移动
        const prevIndex = prevArray.indexOf(nextArray[i]);
        if (prevIndex !== i && prevIndex !== -1) {
          transitions.push({
            type: 'MOVE',
            elementId: `array-${i}`,
            from: { index: prevIndex },
            to: { index: i },
          });
        }
      }
    }

    return transitions;
  }

  /**
   * 计算链表差异
   */
  private computeLinkedListDiff(
    prevList: any[] | null,
    nextList: any[] | null
  ): StateTransition[] {
    if (!prevList || !nextList) {
      return [];
    }

    const transitions: StateTransition[] = [];
    const maxLength = Math.max(prevList.length, nextList.length);

    for (let i = 0; i < maxLength; i++) {
      const prevNode = prevList[i];
      const nextNode = nextList[i];

      if (!prevNode && nextNode) {
        // 新增节点
        transitions.push({
          type: 'INSERT',
          elementId: nextNode.id,
          to: { value: nextNode.value },
        });
      } else if (prevNode && !nextNode) {
        // 删除节点
        transitions.push({
          type: 'DELETE',
          elementId: prevNode.id,
          from: { value: prevNode.value },
        });
      } else if (prevNode && nextNode && prevNode.value !== nextNode.value) {
        // 更新节点值
        transitions.push({
          type: 'UPDATE',
          elementId: prevNode.id,
          from: { value: prevNode.value },
          to: { value: nextNode.value },
        });
      }
    }

    return transitions;
  }

  /**
   * 计算线性结构差异（栈/队列）
   */
  private computeLinearDiff(
    prevItems: any[],
    nextItems: any[]
  ): StateTransition[] {
    const transitions: StateTransition[] = [];

    // 检测新增
    for (let i = prevItems.length; i < nextItems.length; i++) {
      transitions.push({
        type: 'INSERT',
        elementId: `item-${i}`,
        to: { value: nextItems[i] },
      });
    }

    // 检测删除
    for (let i = nextItems.length; i < prevItems.length; i++) {
      transitions.push({
        type: 'DELETE',
        elementId: `item-${i}`,
        from: { value: prevItems[i] },
      });
    }

    return transitions;
  }

  /**
   * 计算哈希表差异
   */
  private computeHashTableDiff(
    prevEntries: Map<string, any>,
    nextEntries: Map<string, any>
  ): StateTransition[] {
    const transitions: StateTransition[] = [];

    // 检测删除的键
    for (const [key, value] of prevEntries.entries()) {
      if (!nextEntries.has(key)) {
        transitions.push({
          type: 'DELETE',
          elementId: `hash-${key}`,
          from: { key, value },
        });
      }
    }

    // 检测新增和更新的键
    for (const [key, value] of nextEntries.entries()) {
      if (!prevEntries.has(key)) {
        transitions.push({
          type: 'INSERT',
          elementId: `hash-${key}`,
          to: { key, value },
        });
      } else if (prevEntries.get(key) !== value) {
        transitions.push({
          type: 'UPDATE',
          elementId: `hash-${key}`,
          from: { key, value: prevEntries.get(key) },
          to: { key, value },
        });
      }
    }

    return transitions;
  }

  /**
   * 计算树差异
   */
  private computeTreeDiff(prevTree: any, nextTree: any): StateTransition[] {
    // 简化实现：完整实现需要比较树的结构
    const transitions: StateTransition[] = [];

    // 这里可以使用树的序列化比较
    // 或者使用树的遍历来比较节点

    return transitions;
  }

  /**
   * 计算图差异
   */
  private computeGraphDiff(
    prevGraph: { nodes: any[]; edges: any[] },
    nextGraph: { nodes: any[]; edges: any[] }
  ): StateTransition[] {
    const transitions: StateTransition[] = [];

    // 比较节点
    const prevNodeMap = new Map(prevGraph.nodes.map((n) => [n.id, n]));
    const nextNodeMap = new Map(nextGraph.nodes.map((n) => [n.id, n]));

    // 检测删除的节点
    for (const [id, node] of prevNodeMap.entries()) {
      if (!nextNodeMap.has(id)) {
        transitions.push({
          type: 'DELETE',
          elementId: id,
          from: { value: node.value },
        });
      }
    }

    // 检测新增和更新的节点
    for (const [id, node] of nextNodeMap.entries()) {
      if (!prevNodeMap.has(id)) {
        transitions.push({
          type: 'INSERT',
          elementId: id,
          to: { value: node.value },
        });
      } else {
        const prevNode = prevNodeMap.get(id);
        if (prevNode && prevNode.value !== node.value) {
          transitions.push({
            type: 'UPDATE',
            elementId: id,
            from: { value: prevNode.value },
            to: { value: node.value },
          });
        }
      }
    }

    // 比较边
    const prevEdgeSet = new Set(
      prevGraph.edges.map((e) => `${e.source}-${e.target}`)
    );
    const nextEdgeSet = new Set(
      nextGraph.edges.map((e) => `${e.source}-${e.target}`)
    );

    // 检测删除的边
    for (const edgeId of prevEdgeSet) {
      if (!nextEdgeSet.has(edgeId)) {
        transitions.push({
          type: 'DELETE',
          elementId: `edge-${edgeId}`,
          from: {},
        });
      }
    }

    // 检测新增的边
    for (const edgeId of nextEdgeSet) {
      if (!prevEdgeSet.has(edgeId)) {
        transitions.push({
          type: 'INSERT',
          elementId: `edge-${edgeId}`,
          to: {},
        });
      }
    }

    return transitions;
  }

  /**
   * 生成动画指令
   */
  generateAnimationInstructions(
    transitions: StateTransition[]
  ): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = [];

    for (const transition of transitions) {
      const instruction: AnimationInstruction = {
        type: this.mapTransitionToAnimationType(transition.type),
        targetId: transition.elementId,
        duration: 300, // 默认动画时长 300ms
        easing: 'easeInOut',
        from: transition.from,
        to: transition.to,
        metadata: {},
      };

      instructions.push(instruction);
    }

    return instructions;
  }

  /**
   * 映射状态转换类型到动画类型
   */
  private mapTransitionToAnimationType(
    transitionType: string
  ): AnimationInstruction['type'] {
    switch (transitionType) {
      case 'INSERT':
        return 'INSERT';
      case 'DELETE':
        return 'DELETE';
      case 'UPDATE':
        return 'UPDATE';
      case 'MOVE':
        return 'MOVE';
      case 'RESTRUCTURE':
        return 'MOVE';
      default:
        return 'UPDATE';
    }
  }

  /**
   * 应用差异
   */
  applyDiff(currentState: any, transitions: StateTransition[]): any {
    // 创建状态副本
    const newState = Array.isArray(currentState)
      ? [...currentState]
      : { ...currentState };

    for (const transition of transitions) {
      switch (transition.type) {
        case 'INSERT':
          if (Array.isArray(newState)) {
            newState.push(transition.to);
          }
          break;
        case 'DELETE':
          if (Array.isArray(newState) && transition.from) {
            const index = newState.indexOf(transition.from);
            if (index > -1) {
              newState.splice(index, 1);
            }
          }
          break;
        case 'UPDATE':
          if (Array.isArray(newState) && transition.to) {
            const index = transition.to.index;
            if (index !== undefined && index >= 0 && index < newState.length) {
              newState[index] = transition.to.value;
            }
          }
          break;
        case 'MOVE':
          // 移动元素位置
          if (Array.isArray(newState) && transition.from && transition.to) {
            const fromIndex = transition.from.index;
            const toIndex = transition.to.index;
            if (
              fromIndex !== undefined &&
              toIndex !== undefined &&
              fromIndex >= 0 &&
              fromIndex < newState.length &&
              toIndex >= 0 &&
              toIndex < newState.length
            ) {
              const [element] = newState.splice(fromIndex, 1);
              newState.splice(toIndex, 0, element);
            }
          }
          break;
      }
    }

    return newState;
  }
}
