'use client';

/**
 * 实验室列表页面
 * 用于展示和进入各个前端原理实验。
 */

import { Beaker, FlaskConical, Binary, ShieldCheck } from 'lucide-react';
import styles from './labs.module.css';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function LabsPage() {
  const t = useTranslations('Labs');

  /**
   * 实验项目列表定义
   */
  const labs = [
    {
      id: 'vue-reactivity',
      title: t('vueReactivity.title'),
      description: t('vueReactivity.description'),
      category: t('categories.framework'),
      icon: Binary,
      href: '/labs/vue-reactivity'
    },
    {
      id: 'react-hook-flow',
      title: t('reactHookFlow.title'),
      description: t('reactHookFlow.description'),
      category: t('categories.framework'),
      icon: FlaskConical,
      href: '/labs/react-hooks'
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Beaker size={32} color="var(--accent-neon)" />
        <h1>{t('title')}</h1>
      </header>

      {/* 实验卡片网格 */}
      <div className={styles.grid}>
        {labs.map(lab => (
          <Link key={lab.id} href={lab.href} className={styles.card}>
            <div className={styles.cardHeader}>
              <lab.icon size={24} className={styles.icon} />
              <span className={styles.badge}>{lab.category}</span>
            </div>
            <h3>{lab.title}</h3>
            <p>{lab.description}</p>
            <div className={styles.footer}>
              <span>{t('enter')}</span>
              <ShieldCheck size={16} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
