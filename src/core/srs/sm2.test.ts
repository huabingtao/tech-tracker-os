import { describe, it, expect } from 'vitest';
import { calculateSRS } from './sm2';

/**
 * SRS (间隔复习) 算法的单元测试
 * 确保核心数学模型在不同反馈质量下的计算结果准确。
 */

describe('SRS (SM-2) 算法核心逻辑测试', () => {
  
  it('应该在初次学习且质量为 5 时，将下一次复习间隔设为 1 天', () => {
    const result = calculateSRS({
      quality: 5,     // 完美记住
      repetitions: 0, // 第一次学
      easeFactor: 2.5,
      interval: 0
    });
    // 根据 SM-2 标准，第一次成功后间隔 1 天
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it('应该在第二次复习且质量为 5 时，将间隔设为 6 天', () => {
    const result = calculateSRS({
      quality: 5,
      repetitions: 1, // 已成功过一次
      easeFactor: 2.5,
      interval: 1
    });
    // 根据 SM-2 标准，第二次成功后间隔跳跃到 6 天
    expect(result.interval).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  it('如果复习质量很差 (q < 3)，应该重置复习周期和次数', () => {
    const result = calculateSRS({
      quality: 1,      // 完全忘记
      repetitions: 5,  // 之前表现很好
      easeFactor: 2.5,
      interval: 20
    });
    // 只要忘了一次，就要回到“起点”，明天重新开始
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
  });
});
