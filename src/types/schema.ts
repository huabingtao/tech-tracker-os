/**
 * 本文件定义了整个应用的核心数据类型 (TypeScript 接口)
 * 确保了数据在各个组件和函数之间传递时的一致性。
 */

/**
 * 技能域分类定义
 * 用于对技术栈进行归类管理
 */
export type SkillCategory = 'Frontend' | 'Backend' | 'DevOps' | 'AI' | 'Testing';

/**
 * 技能节点接口
 * 定义了一个技术知识点的静态属性
 */
export interface SkillNode {
  id: string;               // 唯一标识符
  name: string;             // 技能名称 (如: React Fiber)
  category: SkillCategory;  // 所属分类
  dependencies: string[];    // 前置依赖技能的 ID 列表 (用于学习路径规划)
  targetMastery: number;    // 设定的面试/生产环境目标熟练度 (0-100)
  description: string;      // 简短的功能或知识点描述
}

/**
 * 学习进度状态接口
 * 记录了用户对某个特定技能的实时掌握情况及复习周期状态
 */
export interface LearningProgress {
  skillId: string;          // 关联的技能 ID
  firstStudiedAt: string;   // 首次开始学习的 ISO 日期字符串
  lastReviewedAt: string;   // 上一次复习完成的 ISO 日期字符串
  currentMastery: number;   // 当前动态评估的熟练度 (0-100)，由面试评估得分决定
  
  // --- SRS (Spaced Repetition System) 间隔复习算法核心字段 ---
  // 这些字段用于计算下一次复习的最佳时间，以对抗艾宾浩斯遗忘曲线
  repetitions: number;      // 连续成功复习的次数
  easeFactor: number;       // 简易度因子 (决定间隔增长速度的系数)
  intervalDays: number;     // 当前周期的复习间隔天数
  nextReviewDate: string;   // 建议的下一次复习日期 (ISO 字符串)
}
