import { SkillNode, LearningProgress } from '@/types/schema';

/**
 * 系统的初始技能树配置
 * 每一项代表一个核心技术领域及其学习目标
 */
export const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'react-fiber',
    name: 'React Fiber Architecture',
    category: 'Frontend',
    dependencies: [],
    targetMastery: 90,
    description: '深度理解 React 16+ 的调度协调算法与并发模式'
  },
  {
    id: 'vue3-proxy',
    name: 'Vue 3 Reactivity (Proxy)',
    category: 'Frontend',
    dependencies: [],
    targetMastery: 85,
    description: '基于 Proxy 的响应式原理与 Vue 2 Object.defineProperty 的差异'
  },
  {
    id: 'nginx-reverse-proxy',
    name: 'Nginx Reverse Proxy & Load Balancing',
    category: 'DevOps',
    dependencies: [],
    targetMastery: 80,
    description: '配置反向代理、负载均衡、缓存策略与 SSL 证书'
  },
  {
    id: 'ts-advanced-types',
    name: 'TypeScript Advanced Types',
    category: 'Frontend',
    dependencies: [],
    targetMastery: 95,
    description: '掌握映射类型、条件类型、infer 关键字与类型体操'
  },
  {
    id: 'cicd-github-actions',
    name: 'CI/CD with GitHub Actions',
    category: 'DevOps',
    dependencies: [],
    targetMastery: 85,
    description: '构建自动化的 Lint、Test、Build 与 Deploy 流水线'
  }
];

/**
 * 用户的初始学习进度数据
 * 系统会为 INITIAL_SKILLS 中的每个技能创建一个默认进度对象。
 * 这些数据后续会通过浏览器的 LocalStorage 或数据库进行持久化。
 */
export const INITIAL_PROGRESS: LearningProgress[] = INITIAL_SKILLS.map(skill => ({
  skillId: skill.id, // 关联的技能 ID
  firstStudiedAt: new Date().toISOString(), // 首次学习时间
  lastReviewedAt: new Date().toISOString(),  // 最近复习时间
  currentMastery: 10, // 初始熟练度设为 10%，表示刚入坑
  
  // 以下是 SRS (间隔复习) 算法所需的初始状态
  repetitions: 0,   // 已成功复习次数
  easeFactor: 2.5,  // 默认简易度系数
  intervalDays: 0,  // 当前复习间隔天数
  nextReviewDate: new Date().toISOString() // 建议下次复习日期，默认为今天
}));
