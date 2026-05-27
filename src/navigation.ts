import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

/**
 * 路由与导航配置文件
 * 本文件利用 next-intl 提供的工具，创建了一套“本地化感知”的导航 API。
 * 使用这里的 Link, useRouter 等，可以确保跳转时自动保留当前语言前缀（如 /zh 或 /en）。
 */

// 定义基础路由规则
export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh'],
  // 默认语言（当访问不带前缀的路径时重定向到此）
  defaultLocale: 'zh',
  // 是否总是显示语言前缀 (always | as-needed)
  localePrefix: 'always'
});

// 导出包装后的 Next.js 导航组件和钩子
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
