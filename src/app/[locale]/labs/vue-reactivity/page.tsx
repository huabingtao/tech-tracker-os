'use client';

/**
 * 实验室案例：Vue 3 响应式原理 (Proxy) 模拟器
 * 
 * 核心目的：
 * 模拟 Vue 3 如何使用 ES6 Proxy 拦截对象操作，并演示数据变化如何自动驱动 UI 更新。
 * 同时对比 Vue 2 基于 Object.defineProperty 的局限性。
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, Activity, Edit3, Save } from 'lucide-react';
import styles from '../labs.module.css';

export default function VueReactivityLab() {
  // 定义一个模拟的响应式对象
  const [data, setData] = useState({ count: 0, nested: { value: 10 } });
  // 用于显示操作日志
  const [logs, setLogs] = useState<string[]>([]);
  // 是否处于代码编辑模式
  const [isEditing, setIsEditing] = useState(false);
  // JSON 编辑器的输入内容
  const [jsonInput, setJsonInput] = useState(JSON.stringify(data, null, 2));
  // 用于修复 Hydration 错误的时间状态
  const [renderTime, setRenderTime] = useState<string>('');

  // 辅助函数：向控制台打印日志
  const log = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10));

  /**
   * 页面挂载后初始化时间，避免服务端与客户端不一致导致的 Hydration 错误
   */
  useEffect(() => {
    setRenderTime(new Date().toLocaleTimeString());
  }, [data]);

  /**
   * 模拟属性更新逻辑
   * 对应 Vue 中的 data.count++ 操作
   */
  const triggerUpdate = () => {
    const newVal = data.count + 1;
    log(`[Proxy 拦截] 检测到属性 count 发生变化: ${newVal}`);
    const newData = { ...data, count: newVal };
    setData(newData);
    // 同步更新 JSON 编辑器
    setJsonInput(JSON.stringify(newData, null, 2));
  };

  /**
   * 处理直接修改 JSON 数据的逻辑
   */
  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setData(parsed);
      log(`[系统] 通过直接编辑状态树完成更新`);
      setIsEditing(false);
    } catch (e) {
      alert('JSON 格式错误，请检查！');
    }
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <header className={styles.header}>
        <Link href="/labs" className={styles.backLink}>
          <ArrowLeft size={20} /> 返回实验室
        </Link>
        <h1>Vue 3 响应式 (Proxy) 模拟器</h1>
      </header>

      <div className={styles.labLayout}>
        <div className={styles.playground}>
          {/* 左侧：数据状态展示与编辑 */}
          <div className={styles.controlCard}>
            <div className={styles.cardHeader}>
              <h3>响应式状态对象 (State)</h3>
              <button 
                className={styles.miniBtn} 
                onClick={() => isEditing ? handleSaveJson() : setIsEditing(true)}
              >
                {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                {isEditing ? '保存' : '手动编辑'}
              </button>
            </div>

            {isEditing ? (
              <textarea 
                className={styles.jsonEditor}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            ) : (
              <pre className={styles.codeBlock}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}

            <div className={styles.btnGroup}>
              <button onClick={triggerUpdate} className={styles.actionBtn} disabled={isEditing}>
                <Play size={16} /> 增加计数 (模拟 Set 操作)
              </button>
            </div>
          </div>

          {/* 中间：UI 渲染监视器 */}
          <div className={styles.visualizer}>
            <Activity size={40} color="var(--accent-neon)" />
            <div className={styles.renderFlash}>
              UI 组件于 {renderTime || '...'} 完成重渲染
            </div>
            <div className={styles.liveValue}>
              当前计数器值: <span style={{color: 'var(--accent-neon)'}}>{data.count}</span>
            </div>
          </div>
        </div>

        {/* 右侧：日志追踪 */}
        <aside className={styles.logPanel}>
          <h3>响应式拦截日志</h3>
          <div className={styles.logList}>
            {logs.map((msg, i) => (
              <div key={i} className={styles.logItem}>{msg}</div>
            ))}
          </div>
        </aside>
      </div>

      {/* 底部：面试干货 */}
      <section className={styles.deepDive}>
        <div className={styles.diveHeader}>
          <Activity size={24} color="var(--accent-neon)" />
          <h2>深度解析：面试中的响应式原理</h2>
        </div>
        
        <div className={styles.diveGrid}>
          <div className={styles.diveCard}>
            <h4>面试真题：Vue 3 为什么选择 Proxy 替代 DefineProperty？</h4>
            <p><strong>核心答题点：</strong></p>
            <ul>
              <li><strong>性能：</strong> Proxy 是惰性代理，只有访问深层属性时才触发递归，初次加载更快。</li>
              <li><strong>完善性：</strong> Proxy 能够原生支持监听“属性新增”、“属性删除”以及“数组索引变更”。</li>
              <li><strong>现代性：</strong> 作为 ES6 标准，引擎优化上限更高，无需像 Vue 2 那样通过 $set 这种 Hack 方式。</li>
            </ul>
          </div>

          <div className={styles.diveCard}>
            <h4>核心代码手写实现 (极简版)</h4>
            <pre className={styles.miniCode}>
{`function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key); // 1. 依赖收集
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 2. 派发更新 (驱动 UI)
      return result;
    }
  });
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
