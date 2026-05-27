import { NextResponse } from 'next/server';
import { INTERVIEW_QUESTIONS, getGenericQuestions } from '@/data/interviewQuestions';

/**
 * 面试官后端接口
 * 功能：根据前端传入的技能点名称，返回对应的面试题集。
 */
export async function POST(req: Request) {
  try {
    // 获取请求参数
    const { skillName } = await req.json();

    /**
     * 模拟 AI 分析/路由延迟
     * 在真实的 AI 场景中，这里可能会调用模型来动态生成更有针对性的题目
     */
    await new Promise(resolve => setTimeout(resolve, 800));

    // 优先从预设题库获取，如果没有则生成通用题目
    const questions = INTERVIEW_QUESTIONS[skillName] || getGenericQuestions(skillName);

    // 返回题目数据
    return NextResponse.json({ questions });
  } catch (error) {
    // 异常处理
    return NextResponse.json({ error: 'AI Agent 暂时无法连接' }, { status: 500 });
  }
}
