import createMiddleware from 'next-intl/middleware';

/**
 * 中间件配置
 * Next.js 会在处理每一个请求前执行此逻辑。
 * 我们在这里配置 next-intl 的中间件，用于：
 * 1. 自动根据浏览器 Header 探测用户偏好语言。
 * 2. 处理 URL 中的语言前缀重定向。
 */

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],

  // Used when no locale matches
  defaultLocale: 'zh'
});

/**
 * 匹配器配置
 * 指定中间件运行的路径范围。
 */
export const config = {
  // 匹配所有路径，但排除：
  // - api 路由
  // - _next 内部资源 (static, images)
  // - favicon 等静态文件
  matcher: ['/', '/(zh|en)/:path*']
};
