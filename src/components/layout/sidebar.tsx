'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarNavItems = [
  {
    href: '/creator/dashboard',
    label: '仪表盘',
    icon: LayoutDashboard,
  },
  {
    href: '/creator/works',
    label: '我的作品',
    icon: BookOpen,
  },
  {
    href: '/creator/works/new',
    label: '新建作品',
    icon: PlusCircle,
  },
  {
    href: '/creator/settings',
    label: '设置',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === '/creator/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setIsMobileOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="truncate">{item.label}</span>
          )}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed bottom-4 left-4 z-40 lg:hidden">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? '关闭侧边栏' : '打开侧边栏'}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-60 border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {navContent}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-950 lg:block',
          isCollapsed ? 'w-16' : 'w-56'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-end px-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              {isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
          {navContent}
        </div>
      </aside>
    </>
  );
}
