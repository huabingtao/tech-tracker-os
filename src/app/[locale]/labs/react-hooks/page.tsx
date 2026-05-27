'use client';

/**
 * 实验室案例：React Hooks 执行流与闭包陷阱
 * 
 * 核心目的：
 * 通过一个计时器组件，直观展示 React 函数组件在不同渲染周期下的状态快照，
 * 并演示如何通过自定义 Hook 解决 setInterval 中的闭包旧值问题。
 */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Timer, Pause, Play, AlertTriangle } from 'lucide-react';
import { useInterval } from '@/labs/react/useInterval';
import styles from '../labs.module.css';

export default function ReactHooksLab() {
  // 定义计数器状态
  const [count, setCount] = useState(0);
  // 控制计时器的间隔 (ms)，null 代表停止
  const [delay, setDelay] = useState<number | null>(1000);
  // 用于记录运行日志
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * 使用我们自定义的 useInterval Hook
   * 即使这里的回调函数没有添加 [count] 依赖，
   * 借助于 Hook 内部的 useRef 机制，它也能拿到最新的 count 值。
   */
  useInterval(() => {
    // 使用函数式更新确保状态正确
    setCount(c => c + 1);
    // 记录日志，展示当前捕捉到的状态
    setLogs(prev => [`[Tick] 计数器当前值：${count + 1}`, ...prev].slice(0, 5));
  }, delay);

  return (
    <div className={styles.container}>
      {/* 头部：返回按钮和标题 */}
      <header className={styles.header}>
        <Link href="/labs" className={styles.backLink}>
          <ArrowLeft size={20} /> 返回实验室
        </Link>
        <h1>React Hook 执行流实验</h1>
      </header>

      <div className={styles.labLayout}>
        <div className={styles.playground}>
          {/* 交互控制卡片 */}
          <div className={styles.controlCard}>
            <h3>useInterval 挑战</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              观察闭包是如何捕获状态的，以及为什么我们在异步回调中推荐使用函数式更新。
            </p>
            
            {/* 数字显示区 */}
            <div className={styles.counterDisplay}>
              <Timer size={48} color="var(--accent-blue)" />
              <span style={{ fontSize: '3rem', fontWeight: 800 }}>{count}</span>
            </div>

            {/* 操作按钮组 */}
            <div className={styles.btnGroup}>
              {delay !== null ? (
                <button onClick={() => setDelay(null)} className={styles.actionBtn}>
                  <Pause size={16} /> 暂停
                </button>
              ) : (
                <button onClick={() => setDelay(1000)} className={styles.actionBtn}>
                  <Play size={16} /> 恢复 (1秒间隔)
                </button>
              )}
              <button onClick={() => setCount(0)} className={styles.actionBtn}>
                重置
              </button>
            </div>
          </div>

          {/* 风险提示卡片 */}
          <div className={styles.warningCard}>
            <AlertTriangle size={24} color="var(--accent-red)" />
            <div>
              <strong>闭包陷阱检查：</strong>
              <p>尝试在普通的 <code>setInterval</code> 中直接使用 <code>setCount(count + 1)</code>，你会发现计数器永远卡在 1！</p>
            </div>
          </div>
        </div>

        {/* 右侧日志面板 */}
        <aside className={styles.logPanel}>
          <h3>执行流日志</h3>
          <div className={styles.logList}>
            {logs.map((msg, i) => (
              <div key={i} className={styles.logItem}>{msg}</div>
            ))}
          </div>
        </aside>
      </div>

      {/* 底部：知识深度解析 */}
      <section className={styles.deepDive}>
        <div className={styles.diveHeader}>
          <Timer size={24} color="var(--accent-blue)" />
          <h2>深度解析：为什么面试爱考这个？</h2>
        </div>
        
        <div className={styles.diveGrid}>
          <div className={styles.diveCard}>
            <h4>面试真题：React Hooks 里的闭包陷阱是什么？</h4>
            <p><strong>核心答题点：</strong></p>
            <ul>
              <li><strong>成因：</strong> 异步回调（如 setTimeout）在函数组件重新渲染时，依然引用着旧的那次“渲染快照”里的变量。</li>
              <li><strong>解决：</strong> 1. 使用函数式更新；2. 使用 <code>useRef</code> 避开闭包限制。</li>
            </ul>
          </div>

          <div className={styles.diveCard}>
            <h4>核心代码手写实现 (useInterval)</h4>
            <pre className={styles.miniCode}>
{`function useInterval(callback, delay) {
  const savedCallback = useRef();
  // 保持记录最新的回调，通过 ref 穿透闭包
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置定时器，仅在 delay 变化时重新运行
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
