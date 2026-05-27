'use client';

/**
 * 技能雷达图组件
 * 使用 Recharts 库绘制，用于直观展示用户当前各项技能的掌握程度与面试目标的差距。
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { SkillNode, LearningProgress } from '@/types/schema';
import { useTranslations } from 'next-intl';

interface Props {
  skills: SkillNode[];       // 所有的技能定义数据
  progress: LearningProgress[]; // 用户的学习进度数据
}

export default function SkillRadarChart({ skills, progress }: Props) {
  const t = useTranslations('Dashboard');

  /**
   * 转换数据格式以适配 Recharts
   * 将静态的技能信息与动态的掌握进度进行匹配合并
   */
  const data = skills.map(skill => {
    // 找到当前技能对应的进度记录
    const p = progress.find(item => item.skillId === skill.id);
    return {
      subject: skill.name,        // 轴标签：技能名称
      current: p ? p.currentMastery : 0, // 维度一：当前掌握度 (0-100)
      target: skill.targetMastery, // 维度二：设定的面试目标 (0-100)
      fullMark: 100,              // 最大刻度值
    };
  });

  return (
    <div style={{ width: '100%', height: 400, background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          {/* 雷达图背景网格线 */}
          <PolarGrid stroke="var(--border)" />
          {/* 角度轴（显示技能名） */}
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          
          {/* 当前掌握度区域：实色填充的青色区域 */}
          <Radar
            name={t('currentMastery')}
            dataKey="current"
            stroke="var(--accent-neon)"
            fill="var(--accent-neon)"
            fillOpacity={0.6}
          />
          
          {/* 面试目标线：虚线表示的阴影区域 */}
          <Radar
            name={t('interviewTarget')}
            dataKey="target"
            stroke="var(--text-secondary)"
            fill="var(--text-secondary)"
            fillOpacity={0.1}
            strokeDasharray="4 4"
          />
          
          {/* 图例，显示各数据系列的名称 */}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
