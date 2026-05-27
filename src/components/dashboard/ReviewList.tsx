import { SkillNode, LearningProgress } from '@/types/schema';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './ReviewList.module.css';
import { useTranslations } from 'next-intl';

/**
 * 复习清单组件
 * 根据 SRS 算法计算出的日期，展示用户今天所有需要“温故而知新”的技术点。
 */

interface Props {
  skills: SkillNode[];       // 技能树定义
  progress: LearningProgress[]; // 用户的进度记录
}

export default function ReviewList({ skills, progress }: Props) {
  const t = useTranslations('Dashboard');
  const today = new Date();
  
  /**
   * 筛选逻辑：找出下一次复习日期早于或等于今天的技能项
   */
  const dueItems = progress
    .filter(p => new Date(p.nextReviewDate) <= today)
    .map(p => ({
      ...p,
      skill: skills.find(s => s.id === p.skillId)!
    }));

  return (
    <div className={styles.container}>
      {/* 列表头部：显示今日待办数量 */}
      <div className={styles.header}>
        <AlertCircle size={18} color="var(--accent-red)" />
        <h3>{t('dueToday', { count: dueItems.length })}</h3>
      </div>
      
      <div className={styles.list}>
        {/* 如果没有到期的任务，显示一个开心的成功提示 */}
        {dueItems.length === 0 ? (
          <div className={styles.empty}>
            <CheckCircle2 size={40} color="var(--accent-neon)" />
            <p>{t('allClear')}</p>
          </div>
        ) : (
          // 渲染待复习的技能卡片
          dueItems.map(item => (
            <div key={item.skillId} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.category}>{item.skill.category}</span>
                <h4>{item.skill.name}</h4>
                <p>{item.skill.description}</p>
              </div>
              <div className={styles.cardMeta}>
                <Clock size={14} />
                {/* 展示计算出的下一次复习时间（通常是今天） */}
                <span>{t('next')}: {new Date(item.nextReviewDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
