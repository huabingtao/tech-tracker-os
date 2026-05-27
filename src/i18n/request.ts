import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

/**
 * 国际化请求配置
 * 每次渲染（服务端）时，next-intl 会调用此函数来加载对应的语言包。
 */

// 定义系统支持的语言
const locales = ['en', 'zh'];

export default getRequestConfig(async ({locale}) => {
  /**
   * 容错处理：
   * 在某些路由重定向或初始加载时，locale 可能为 undefined。
   * 我们强制将其指向默认语言 'zh'，防止页面崩溃或进入 404。
   */
  const activeLocale = locale || 'zh';

  // 验证当前 URL 中的语言参数是否在支持范围内
  if (!locales.includes(activeLocale as any)) notFound();

  return {
    // 固化当前生效的语言
    locale: activeLocale as string,
    // 动态导入对应的 JSON 语言包文件
    messages: (await import(`../../messages/${activeLocale}.json`)).default
  };
});
