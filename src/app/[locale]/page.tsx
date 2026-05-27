'use client';

/**
 * 应用首页 (Dashboard)
 * 展示用户的核心学习指标和技能矩阵雷达图。
 */

import { useState, useEffect } from 'react';
import SkillRadarChart from '@/components/charts/SkillRadarChart';
import ReviewList from '@/components/dashboard/ReviewList';
import { INITIAL_SKILLS, INITIAL_PROGRESS } from '@/data/initialSkills';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  // 用户的进度数据状态
  const [progress, setProgress] = useState(INITIAL_PROGRESS);

  /**
   * 同步 LocalStorage 中的进度数据到状态中
   */
  const syncProgress = () => {
    const saved = localStorage.getItem('tech_tracker_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 将保存的数据与初始数据合并
      const merged = INITIAL_PROGRESS.map(p => {
        const found = parsed.find((sp: any) => sp.skillId === p.skillId);
        return found ? { ...p, ...found } : p;
      });
      setProgress(merged);
    }
  };

  /**
   * 页面加载时执行初始化同步，并监听数据更新事件
   */
  useEffect(() => {
    syncProgress();
    // 监听面试页或其他地方触发的进度更新自定义事件
    window.addEventListener('progress_updated', syncProgress);
    return () => window.removeEventListener('progress_updated', syncProgress);
  }, []);

  // 计算全局统计数据
  const totalSkills = INITIAL_SKILLS.length;
  // 熟练度超过 80% 视为已掌握
  const completedSkills = progress.filter(p => p.currentMastery >= 80).length;
  // 计算所有技能的平均掌握程度
  const averageMastery = Math.round(
    progress.reduce((acc, curr) => acc + curr.currentMastery, 0) / totalSkills
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 顶部标题区 */}
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent-neon)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          {t('title')} <span style={{ fontWeight: 300 }}>OS</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('systemReadiness')}: <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{averageMastery}%</span>
        </p>
      </header>

      {/* 统计指标卡片网格 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {[
          { label: t('totalNodes'), value: totalSkills },
          { label: t('mastered'), value: completedSkills },
          { label: t('reviewStreak'), value: t('days', { count: 12 }) },
          { label: t('knowledgeGap'), value: `${100 - averageMastery}%` }
        ].map(stat => (
          <div key={stat.label} style={{ 
            background: 'var(--bg-secondary)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)' 
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 主展示区：左侧雷达图，右侧复习清单 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr', 
        gap: '2rem' 
      }}>
        <section>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('skillMatrixGap')}</h3>
          <SkillRadarChart skills={INITIAL_SKILLS} progress={progress} />
        </section>
        
        <section>
          <ReviewList skills={INITIAL_SKILLS} progress={progress} />
        </section>
      </div>
    </div>
  );
}
