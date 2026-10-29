import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Checkbox, Drawer, Layout, Menu, Switch } from 'antd';
import type { MenuProps } from 'antd';
import {
  BulbFilled,
  BulbOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import { HttpUtil } from '@/utils';
import { pauseAnimationsUntilLeave, useTheme } from '@/hooks/useTheme';
import { PANEL_ROUTES } from '@/routes/panelRoutes';
import './AppSidebar.css';

const LOGOUT_KEY = '__logout__';
const THEME_KEY = '__theme__';
const THEME_DARK_KEY = '__theme_dark__';
const THEME_ULTRA_KEY = '__theme_ultra__';
const SIDER_WIDTH = 200;
const SIDEBAR_HIDDEN_PATHS = new Set(['/outbound', '/routing']);
const COLLAPSED_WIDTH = 80;
// Same storage key the v2.x panel used, so a returning operator keeps their choice.
const SIDEBAR_COLLAPSED_KEY = 'isSidebarCollapsed';

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {}
}

export default function AppSidebar() {
  const { t } = useTranslation();
  const { isDark, isUltra, toggleTheme, toggleUltra } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCollapse = useCallback((value: boolean) => {
    saveCollapsed(value);
    setCollapsed(value);
  }, []);

  const currentTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const onToggleDark = useCallback(
    (id: string) => {
      pauseAnimationsUntilLeave(id);
      if (isDark && isUltra) toggleUltra();
      toggleTheme();
    },
    [isDark, isUltra, toggleTheme, toggleUltra],
  );

  const onToggleUltra = useCallback(
    (id: string) => {
      pauseAnimationsUntilLeave(id);
      toggleUltra();
    },
    [toggleUltra],
  );

  const themeItem = useCallback(
    (idSuffix: string): NonNullable<MenuProps['items']>[number] => {
      const darkId = `change-theme${idSuffix}`;
      const ultraId = `change-theme-ultra${idSuffix}`;
      const children: NonNullable<MenuProps['items']> = [
        {
          key: THEME_DARK_KEY,
          className: 'ant-menu-theme-switch',
          label: (
            <span id={darkId} className="theme-switch-row">
              <span>{t('menu.dark')}</span>
              <Switch size="small" checked={isDark} aria-label={t('menu.dark')} />
            </span>
          ),
        },
      ];
      if (isDark) {
        children.push({
          key: THEME_ULTRA_KEY,
          className: 'ant-menu-theme-switch',
          label: (
            <span id={ultraId} className="theme-switch-row">
              <span>{t('menu.ultraDark')}</span>
              <Checkbox checked={isUltra} aria-label={t('menu.ultraDark')} />
            </span>
          ),
        });
      }
      return {
        key: THEME_KEY,
        icon: isDark ? <BulbFilled aria-hidden /> : <BulbOutlined aria-hidden />,
        label: t('menu.theme'),
        children,
      };
    },
    [t, isDark, isUltra],
  );

  // v2's flat menu: Outbounds and Routing live as tabs inside Xray Configs.
  const navItems = useMemo<NonNullable<MenuProps['items']>>(
    () => [
      ...PANEL_ROUTES.filter((route) => !SIDEBAR_HIDDEN_PATHS.has(route.path)).map((route) => {
        const Icon = route.icon;
        return { key: route.path, icon: <Icon aria-hidden />, label: t(route.titleKey) };
      }),
      { key: LOGOUT_KEY, icon: <LogoutOutlined aria-hidden />, label: t('logout') },
    ],
    [t],
  );

  const selectedKey =
    pathname === '/outbound' || pathname === '/routing'
      ? '/xray'
      : pathname === ''
        ? '/'
        : pathname;

  const onMenuClick = useCallback(
    async (key: string, idSuffix: string) => {
      if (key === THEME_DARK_KEY) {
        onToggleDark(`change-theme${idSuffix}`);
        return false;
      }
      if (key === THEME_ULTRA_KEY) {
        onToggleUltra(`change-theme-ultra${idSuffix}`);
        return false;
      }
      if (key === LOGOUT_KEY) {
        await HttpUtil.post('/logout');
        window.location.href = window.X_UI_BASE_PATH || '/';
        return true;
      }
      navigate(key);
      return true;
    },
    [navigate, onToggleDark, onToggleUltra],
  );

  const siderItems = useMemo(() => [themeItem(''), ...navItems], [themeItem, navItems]);
  const drawerItems = useMemo(() => [themeItem('-drawer'), ...navItems], [themeItem, navItems]);

  return (
    <div className="ant-sidebar" style={{ width: collapsed ? COLLAPSED_WIDTH : SIDER_WIDTH }}>
      <Layout.Sider
        theme={currentTheme}
        width={SIDER_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <Menu
          theme={currentTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          className="sider-nav"
          items={siderItems}
          onClick={({ key }) => {
            void onMenuClick(String(key), '');
          }}
        />
      </Layout.Sider>

      <Drawer
        placement="left"
        closable={false}
        open={drawerOpen}
        rootClassName={currentTheme}
        size="min(82vw, 280px)"
        styles={{
          wrapper: { padding: 0 },
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
          header: { display: 'none' },
        }}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="drawer-header">
          <span className="drawer-brand">3X-UI</span>
          <button
            className="drawer-close"
            type="button"
            aria-label={t('close')}
            onClick={() => setDrawerOpen(false)}
          >
            <CloseOutlined aria-hidden />
          </button>
        </div>
        <Menu
          theme={currentTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          className="drawer-menu"
          items={drawerItems}
          onClick={({ key }) => {
            void onMenuClick(String(key), '-drawer').then((navigated) => {
              if (navigated) setDrawerOpen(false);
            });
          }}
        />
      </Drawer>

      {!drawerOpen && (
        <button
          className="drawer-handle"
          type="button"
          aria-label={t('menu.openMenu')}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuOutlined aria-hidden />
        </button>
      )}
    </div>
  );
}
