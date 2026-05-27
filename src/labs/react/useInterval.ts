import { useEffect, useRef } from 'react';

/**
 * 实验室案例：useInterval 自定义 Hook
 * 
 * 核心目的：
 * 解决在 React 中直接使用 setInterval 容易遇到的“闭包陷阱”问题。
 * 在普通的 useEffect 中使用 setInterval，如果 callback 依赖了 state，
 * 那么由于闭包的原因，定时器内部可能一直只能访问到初始的 state 值。
 * 
 * 这里的实现参考了 Dan Abramov 的经典方案。
 * 
 * @param callback 定时执行的函数
 * @param delay 间隔毫秒数。如果为 null，则停止计时器
 */
export function useInterval(callback: () => void, delay: number | null) {
  // 使用 useRef 存储最新的 callback。
  // ref 对象在组件的整个生命周期内都是同一个引用，且修改其 .current 不会触发重渲染。
  const savedCallback = useRef(callback);

  /**
   * 逻辑 A：每当 callback 发生变化（比如因为 state 改变导致重新生成了函数）
   * 我们同步更新 ref 中保存的函数引用。
   * 这样 ref.current 永远指向最新的业务逻辑。
   */
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   * 逻辑 B：处理定时器的开启与清除。
   * 只有当 delay 发生变化时，才会重新设置定时器。
   */
  useEffect(() => {
    // 只有当 delay 是数字时才启动
    if (delay !== null) {
      // 在定时器内部，通过 savedCallback.current() 调用最新的逻辑
      // 这样就完美避开了旧闭包拿不到新 state 的问题
      const id = setInterval(() => savedCallback.current(), delay);
      
      // 组件卸载或 delay 改变时，必须清除旧的定时器，防止内存泄漏和逻辑混乱
      return () => clearInterval(id);
    }
  }, [delay]);
}
