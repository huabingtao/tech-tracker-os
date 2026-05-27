import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInterval } from './useInterval';

/**
 * useInterval Hook 的自动化测试脚本
 * 验证定时器在各种场景下的表现是否符合预期。
 */

describe('useInterval 实验室逻辑测试', () => {
  it('应该在指定延迟后调用回调函数', () => {
    // 启用虚拟定时器，允许我们手动“快进”时间
    vi.useFakeTimers();
    const callback = vi.fn(); // 创建一个模拟函数，用于记录被调用的次数
    
    // 渲染 Hook
    renderHook(() => useInterval(callback, 1000));
    
    // 初始状态下不应被调用
    expect(callback).not.toBeCalled();
    
    // 时间快进 1 秒
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    
    // 再快进 1 秒
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
    
    // 恢复真实定时器环境
    vi.useRealTimers();
  });

  it('当 delay 为 null 时应该停止计时器', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    
    // 初始延迟 1 秒
    const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
      initialProps: { delay: 1000 as number | null }
    });
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    
    // 将延迟设为 null (相当于点击了页面上的暂停按钮)
    rerender({ delay: null });
    
    // 即使再过去 1 秒，回调也不应再次触发
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // 维持在 1 次
    
    vi.useRealTimers();
  });
});
