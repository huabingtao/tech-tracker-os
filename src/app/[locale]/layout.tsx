import "@/styles/globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

/**
 * 全局布局组件 (RootLayout)
 * 这是整个应用的最外层结构，定义了 HTML 骨架和全局 UI（如侧边栏）。
 */

export const metadata: Metadata = {
  title: "Tech-Tracker-OS",
  description: "Accelerated Learning & Interview Mastery System",
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 在服务端预先获取当前语言的翻译包数据
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        {/* 利用 NextIntlClientProvider 将翻译数据下发给所有的客户端组件 */}
        <NextIntlClientProvider messages={messages}>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* 全局侧边栏 */}
            <Sidebar />
            
            {/* 主内容区域 */}
            <main style={{ flex: 1, padding: '2rem' }}>
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
