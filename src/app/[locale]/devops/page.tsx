'use client';

/**
 * 运维基础设施控制页面 (模拟)
 * 展示系统节点状态和监控信息。
 */

import { Terminal, Shield, Cpu, Globe } from 'lucide-react';
import styles from '../labs/labs.module.css';
import { useTranslations } from 'next-intl';

export default function DevOpsPage() {
  const t = useTranslations('DevOps');

  /**
   * 模拟的系统服务器数据
   */
  const systems = [
    { name: 'Nginx Gateway', status: t('status.online'), load: '12%', color: 'var(--accent-neon)' },
    { name: 'Docker Registry', status: t('status.standby'), load: '0%', color: 'var(--accent-blue)' },
    { name: 'GitHub Runner', status: t('status.active'), load: '85%', color: 'var(--accent-red)' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Terminal size={32} color="var(--accent-blue)" />
        <h1>{t('title')}</h1>
      </header>

      {/* 系统节点卡片 */}
      <div className={styles.grid}>
        {systems.map(sys => (
          <div key={sys.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <Cpu size={24} color={sys.color} />
              <span className={styles.badge} style={{ background: sys.color, color: 'black' }}>{sys.status}</span>
            </div>
            <h3>{sys.name}</h3>
            <p>{t('systemLoad')}: {sys.load}</p>
            <div className={styles.footer}>
              <span>{t('manageNode')}</span>
              <Shield size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* 流量监控占位区域 */}
      <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1rem' }}>{t('trafficMonitor')}</h3>
        <div style={{ height: '200px', border: '1px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
          <Globe size={48} style={{ opacity: 0.2 }} />
          <span>{t('pending')}</span>
        </div>
      </div>
    </div>
  );
}
