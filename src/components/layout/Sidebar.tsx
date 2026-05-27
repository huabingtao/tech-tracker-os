'use client';

/**
 * 侧边栏导航组件
 * 负责应用全局的主导航逻辑，包括路由跳转和语言切换。
 */

import { LayoutDashboard, Beaker, MessageSquare, Terminal, Settings, Languages } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/navigation';

export default function Sidebar() {
  const t = useTranslations('Common'); // 加载通用翻译包
  const locale = useLocale();           // 获取当前页面语言 (zh / en)
  const router = useRouter();           // 获取本地化路由实例
  const pathname = usePathname();       // 获取当前纯净路径（不带语言前缀）

  console.log('locale:',locale)
  /**
   * 侧边栏菜单项配置
   */
  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/' },
    { icon: Beaker, label: t('labs'), href: '/labs' },
    { icon: MessageSquare, label: t('interview'), href: '/interview' },
    { icon: Terminal, label: t('devops'), href: '/devops' },
  ];

  /**
   * 切换中英文语言
   */
  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'zh' : 'en';
    // 在保持当前路径不变的情况下，切换语言前缀
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <aside className={styles.sidebar}>
      {/* 品牌标识 Logo */}
      <div className={styles.logo}>
        TECH-TRACKER <span className={styles.os}>OS</span>
      </div>

      {/* 导航链接列表 */}
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navItem}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 底部功能区：含语言切换和设置 */}
      <div className={styles.footer}>
        {/* 语言切换按钮 */}
        <button 
          onClick={toggleLocale}
          className={styles.navItem} 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'inherit', font: 'inherit' }}
        >
          <Languages size={20} />
          <span>{locale === 'en' ? '简体中文' : 'English'}</span>
        </button>

        {/* 设置项（示例） */}
        <div className={styles.navItem}>
          <Settings size={20} />
          <span>{t('settings')}</span>
        </div>
      </div>
    </aside>
  );
}
