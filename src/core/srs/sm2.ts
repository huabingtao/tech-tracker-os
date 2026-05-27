/**
 * 间隔复习算法 (SM-2 变体)
 * 这是一个经典的 SRS (Spaced Repetition System) 算法，
 * 用于根据用户反馈的“记住程度”来动态计算下一次应该复习该知识点的日期。
 */

/**
 * 算法输入参数接口
 */
export interface SRSInput {
  quality: number;      // 用户反馈的熟练度/质量评分 (0-5)，越高代表记得越清楚
  repetitions: number;  // 该知识点已经连续成功复习的次数
  easeFactor: number;   // 简易度因子，初始通常为 2.5，代表这个知识点对用户来说有多容易记
  interval: number;     // 上次复习后的间隔天数
}

/**
 * 算法输出结果接口
 */
export interface SRSOutput {
  repetitions: number;      // 更新后的复习次数
  easeFactor: number;       // 更新后的简易度因子
  interval: number;         // 建议的下一次复习间隔天数
  nextReviewDate: Date;     // 计算出来的建议下次复习的具体日期
}

/**
 * SM-2 核心计算函数
 * @param params 输入的 SRS 状态
 * @returns 更新后的 SRS 状态和下次复习日期
 */
export function calculateSRS({
  quality,
  repetitions,
  easeFactor,
  interval,
}: SRSInput): SRSOutput {
  let nextRepetitions = repetitions;
  let nextEaseFactor = easeFactor;
  let nextInterval = interval;

  // 如果反馈质量 >= 3，代表复习是成功的
  if (quality >= 3) {
    // 第一次成功复习，间隔设为 1 天
    if (nextRepetitions === 0) {
      nextInterval = 1;
    } 
    // 第二次成功复习，间隔设为 6 天
    else if (nextRepetitions === 1) {
      nextInterval = 6;
    } 
    // 后续复习，间隔 = 上次间隔 * 简易度因子
    else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetitions++; // 成功复习次数加一
  } else {
    // 复习失败 (质量 < 3)，重置复习周期
    nextRepetitions = 0; // 重置连续次数
    nextInterval = 1;    // 间隔重置为 1 天，明天继续复习
  }

  // 计算新的 Ease Factor (EF) - 这个因子决定了知识点变难还是变容易
  // 公式参考了 SM-2 的标准定义
  nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // 简易度因子不能低于 1.3，这是为了防止复习间隔变得无限短
  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3;
  }

  // 计算具体日期
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    repetitions: nextRepetitions,
    easeFactor: nextEaseFactor,
    interval: nextInterval,
    nextReviewDate,
  };
}
