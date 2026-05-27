import { NextRequest, NextResponse } from 'next/server';

// 使用 Edge Runtime 以支持高效的流式传输 (Streaming)
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // 从请求体中获取问题、用户回答和当前语言
    const { question, userAnswer, locale } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // 检查 API Key 是否配置
    if (!apiKey) {
      return NextResponse.json({ error: 'DeepSeek API key is not configured' }, { status: 500 });
    }

    // 根据当前语言环境设置系统提示词 (System Prompt)
    // 要求 AI 以面试官身份点评，并在最后一行输出特定格式的分数
    const systemPrompt = locale === 'zh' 
      ? `你是一个资深的技术面试官。请评估候选人对以下问题的回答。
         问题: "${question}"
         
         要求:
         1. 考察候选人是否理解了核心概念、工程实践价值和深度。
         2. 给出详细的复盘点评 (insight)，指出答对的点以及缺失的部分。
         3. 在回答的【最后一行】，必须严格按照格式输出评分：[SCORE:数字]，例如：[SCORE:85]。评分范围 0-100。
         
         请直接开始点评，不要说任何客套话。`
      : `You are a senior technical interviewer. Please evaluate the candidate's answer to the following question.
         Question: "${question}"
         
         Requirements:
         1. Assess the candidate's understanding of core concepts, engineering practical value, and depth.
         2. Provide a detailed review (insight), pointing out correct points and missing parts.
         3. In the [very last line] of your response, you MUST output the score strictly in this format: [SCORE:number], e.g., [SCORE:85]. Range 0-100.
         
         Please start the review directly without any pleasantries.`;

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userAnswer },
        ],
        stream: true, // 开启流式响应
      }),
    });

    // 处理 API 错误
    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `DeepSeek API error: ${error}` }, { status: response.status });
    }

    // 将 DeepSeek 的响应流 (ReadableStream) 直接透传给前端
    // 设置 Content-Type 为 text/event-stream 以激活 SSE
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    // 捕获并返回运行时的未知错误
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
